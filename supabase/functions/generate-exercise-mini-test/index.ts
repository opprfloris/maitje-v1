
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAIClient } from "../generate-week-program/openai-client.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestSettings {
  module: string;
  niveau: string;
  thema?: string;
  aantal_items: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt_content, test_settings } = await req.json();

    if (!prompt_content || !test_settings) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt_content or test_settings' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openai = new OpenAIClient(openaiApiKey);

    // Build context for the mini test
    const context = buildTestContext(test_settings);
    
    // Inject context into prompt
    const finalPrompt = `${prompt_content}\n\nContext voor deze test:\n${context}`;

    const messages = [
      {
        role: 'system' as const,
        content: finalPrompt
      },
      {
        role: 'user' as const,
        content: `Genereer ${test_settings.aantal_items} oefening(en) voor ${test_settings.module} op niveau ${test_settings.niveau}${test_settings.thema ? ` met thema "${test_settings.thema}"` : ''}. Geef de output als JSON array met objecten die 'question' en 'answer' velden hebben.`
      }
    ];

    console.log('Sending request to OpenAI with prompt length:', finalPrompt.length);

    const response = await openai.generateCompletion(messages, 'gpt-4o-mini');
    
    if (!response.choices?.[0]?.message?.content) {
      throw new Error('No content received from OpenAI');
    }

    let exercises;
    try {
      // Try to parse JSON from the response
      const content = response.choices[0].message.content.trim();
      
      // Extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      
      exercises = JSON.parse(jsonString);
      
      // Ensure it's an array
      if (!Array.isArray(exercises)) {
        exercises = [exercises];
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // Fallback: create a single exercise from the raw response
      exercises = [{
        question: response.choices[0].message.content,
        answer: "Antwoord niet geparseerd - controleer output format"
      }];
    }

    // Validate and clean exercises
    const validatedExercises = exercises.slice(0, test_settings.aantal_items).map((exercise: any, index: number) => ({
      question: exercise.question || exercise.vraag || `Vraag ${index + 1}`,
      answer: exercise.answer || exercise.antwoord || "Geen antwoord gevonden",
      type: test_settings.module,
      level: test_settings.niveau,
      theme: test_settings.thema || null
    }));

    console.log(`Generated ${validatedExercises.length} exercises`);

    return new Response(
      JSON.stringify({ 
        exercises: validatedExercises,
        settings: test_settings
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-exercise-mini-test:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildTestContext(settings: TestSettings): string {
  let context = `Module: ${settings.module}\nNiveau: ${settings.niveau}\nAantal items: ${settings.aantal_items}`;
  
  if (settings.thema) {
    context += `\nThema: ${settings.thema}`;
  }

  // Add module-specific guidelines
  switch (settings.module) {
    case 'rekenen':
      context += '\n\nRichtlijnen voor rekenen:\n- Gebruik duidelijke getallen\n- Zorg voor haalbare berekeningen voor het niveau\n- Varieer tussen som-, aftrek-, keer- en deelsommen indien van toepassing';
      break;
    case 'taal':
      context += '\n\nRichtlijnen voor taal/lezen:\n- Gebruik leeftijdsgeschikte woordenschat\n- Zorg voor duidelijke zinnen\n- Focus op begrijpend lezen of grammatica';
      break;
    case 'engels':
      context += '\n\nRichtlijnen voor Engels:\n- Gebruik basis Engels vocabulaire\n- Zorg voor eenvoudige zinstructuren\n- Focus op herkenning en begrip';
      break;
    case 'spelling':
      context += '\n\nRichtlijnen voor spelling:\n- Kies woorden passend bij het niveau\n- Varieer in moeilijkheid\n- Focus op veelvoorkomende spellingpatronen';
      break;
  }

  return context;
}
