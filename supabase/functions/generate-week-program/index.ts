
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      selectedWeek, 
      selectedYear, 
      moeilijkheidsgraad, 
      timePerDay, 
      subjects, 
      useAIPersonalization, 
      theme,
      userId,
      kindNiveau 
    } = await req.json();

    console.log('Generating week program with AI for week:', selectedWeek, 'year:', selectedYear);

    // Get user's previous performance data if personalization is enabled
    let personalizationData = '';
    if (useAIPersonalization && userId) {
      const { data: progressData } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('child_id', userId)
        .order('date', { ascending: false })
        .limit(10);

      if (progressData && progressData.length > 0) {
        const totalSessions = progressData.reduce((sum, day) => sum + day.total_sessions, 0);
        const totalCorrect = progressData.reduce((sum, day) => sum + day.total_correct, 0);
        const totalExercises = progressData.reduce((sum, day) => sum + day.total_exercises, 0);
        const accuracy = totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0;
        
        personalizationData = `
Recente prestaties van het kind:
- Gemiddelde nauwkeurigheid: ${accuracy}%
- Totaal aantal sessies afgelopen 10 dagen: ${totalSessions}
- Sterkste vakgebieden: ${progressData[0]?.subjects_practiced?.join(', ') || 'Nog geen data'}
`;
      }
    }

    // Build enabled subjects list
    const enabledSubjects = Object.entries(subjects)
      .filter(([_, subject]) => subject.enabled)
      .map(([name, subject]) => ({
        name,
        subtopics: subject.subtopics
      }));

    // Create AI prompt for week program generation
    const systemPrompt = `Je bent mAItje, een AI assistent die educatieve weekprogramma's maakt voor Nederlandse basisschoolkinderen.

BELANGRIJKE INSTRUCTIES:
- Genereer een weekprogramma voor 5 dagen (maandag t/m vrijdag)
- Elk dag moet EXACT ${timePerDay} minuten aan oefeningen bevatten
- Niveau kind: ${kindNiveau}/10
- Moeilijkheidsgraad: ${moeilijkheidsgraad}
- Geselecteerde vakgebieden: ${enabledSubjects.map(s => s.name).join(', ')}
${theme ? `- Thema: "${theme}" - integreer dit thema in alle oefeningen waar mogelijk` : ''}

${personalizationData}

MOEILIJKHEIDSNIVEAUS:
- "makkelijker": Maak oefeningen 1-2 niveaus onder het kind niveau
- "op_niveau": Maak oefeningen passend bij het kind niveau  
- "uitdagend": Maak oefeningen 1-2 niveaus boven het kind niveau

VAKGEBIED RICHTLIJNEN:
- Rekenen: Tafels, hoofdrekenen, breuken, meetkunde, woordsommen
- Taal: Spelling, begrijpend lezen, woordenschat, grammatica
- Engels: Vocabulaire, zinsbouw, uitspraak, conversatie

Genereer voor elke oefening 3-5 specifieke vragen met:
- Duidelijke vraagstelling
- Correct antwoord
- 2-3 helpende hints

Zorg dat de tijdsverdeling realistisch is en uitkomt op ${timePerDay} minuten per dag.`;

    const userPrompt = `Genereer een weekprogramma voor week ${selectedWeek}, ${selectedYear}.

Antwoord in exact deze JSON structuur:
{
  "dagen": [
    {
      "dag": "Maandag",
      "oefeningen": [
        {
          "titel": "Oefening titel",
          "type": "rekenen|taal|engels",
          "tijd": "X min",
          "tijdInMinuten": X,
          "beschrijving": "Korte beschrijving van de oefening",
          "vragen": [
            {
              "vraag": "De vraag tekst",
              "antwoord": "Het correcte antwoord",
              "hints": ["Hint 1", "Hint 2"]
            }
          ]
        }
      ]
    }
  ]
}

Zorg ervoor dat:
- Elke dag exact ${timePerDay} minuten bevat (som van alle tijdInMinuten)
- Vragen passen bij niveau ${kindNiveau} en moeilijkheidsgraad "${moeilijkheidsgraad}"
- ${theme ? `Thema "${theme}" wordt geïntegreerd waar mogelijk` : 'Geen specifiek thema'}
- Er variatie is in oefentypen per dag
- Vragen realistisch en leerzaam zijn voor Nederlandse basisschoolleerlingen`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPromprompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;
    
    console.log('AI Generated content:', generatedContent);

    // Parse the JSON response from AI
    let programData;
    try {
      // Extract JSON from the response (in case AI adds extra text)
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : generatedContent;
      programData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate and ensure time constraints are met
    const validatedProgram = validateAndAdjustProgram(programData.dagen, timePerDay);

    return new Response(JSON.stringify({ 
      success: true, 
      programData: validatedProgram,
      message: 'Week programma succesvol gegenereerd met AI'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-week-program function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Er is een fout opgetreden bij het genereren van het programma'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function validateAndAdjustProgram(dagen: any[], targetTimePerDay: number) {
  return dagen.map(dag => {
    // Calculate total time for this day
    const totalTime = dag.oefeningen.reduce((sum: number, oef: any) => sum + (oef.tijdInMinuten || 0), 0);
    
    // If time doesn't match target, adjust proportionally
    if (totalTime !== targetTimePerDay && totalTime > 0) {
      const adjustmentFactor = targetTimePerDay / totalTime;
      
      dag.oefeningen = dag.oefeningen.map((oef: any) => {
        const adjustedTime = Math.round((oef.tijdInMinuten || 0) * adjustmentFactor);
        return {
          ...oef,
          tijdInMinuten: adjustedTime,
          tijd: `${adjustedTime} min`
        };
      });
    }
    
    return dag;
  });
}
