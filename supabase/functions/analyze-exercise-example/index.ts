
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { exampleId, exerciseLength = 10 } = await req.json();

    // Get the uploaded file info
    const { data: example, error: fetchError } = await supabase
      .from('exercise_examples')
      .select('*')
      .eq('id', exampleId)
      .single();

    if (fetchError) throw fetchError;

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('exercise-examples')
      .download(example.file_path);

    if (downloadError) throw downloadError;

    // Convert file to base64 for OpenAI Vision API
    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const mimeType = example.file_type;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze with OpenAI Vision API
    const analysisPrompt = `
    Analyseer deze oefening voor ${example.subject}. Beschrijf:
    1. Het type oefening (rekenen, begrijpend lezen, etc.)
    2. Het moeilijkheidsniveau
    3. De structuur en opmaak
    4. Specifieke onderwerpen die behandeld worden
    5. De stijl van vragen stellen
    
    Wees zeer specifiek over de details zodat ik een vergelijkbare oefening kan maken.
    `;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      }),
    });

    const analysisData = await analysisResponse.json();
    const analysis = analysisData.choices[0].message.content;

    // Generate similar exercises based on analysis
    const generationPrompt = `
    Gebaseerd op deze analyse van een ${example.subject} oefening:
    
    ${analysis}
    
    Maak ${exerciseLength} vergelijkbare vragen in dezelfde stijl en moeilijkheidsgraad.
    
    Geef het resultaat terug als JSON array met deze structuur:
    [
      {
        "id": "vraag_1",
        "question": "De vraag",
        "options": ["A) optie1", "B) optie2", "C) optie3", "D) optie4"],
        "correct_answer": "A",
        "explanation": "Uitleg waarom dit het juiste antwoord is",
        "type": "multiple_choice"
      }
    ]
    
    Zorg dat de vragen:
    - Hetzelfde onderwerp behandelen
    - Dezelfde moeilijkheidsgraad hebben
    - Dezelfde vraagstijl gebruiken
    - Educatief en leerzaam zijn
    `;

    const generationResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: generationPrompt }
        ],
        max_tokens: 2000
      }),
    });

    const generationData = await generationResponse.json();
    let exercises = [];

    try {
      const exerciseText = generationData.choices[0].message.content;
      // Extract JSON from the response
      const jsonMatch = exerciseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        exercises = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing generated exercises:', parseError);
      // Fallback: create simple exercises
      exercises = Array.from({ length: exerciseLength }, (_, i) => ({
        id: `vraag_${i + 1}`,
        question: `${example.subject} vraag ${i + 1} (gebaseerd op geüpload voorbeeld)`,
        options: ['A) Optie 1', 'B) Optie 2', 'C) Optie 3', 'D) Optie 4'],
        correct_answer: 'A',
        explanation: 'Dit is het juiste antwoord gebaseerd op het geüploade voorbeeld.',
        type: 'multiple_choice'
      }));
    }

    return new Response(
      JSON.stringify({ 
        analysis,
        exercises,
        generatedCount: exercises.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-exercise-example function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Er is een fout opgetreden bij de analyse', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});
