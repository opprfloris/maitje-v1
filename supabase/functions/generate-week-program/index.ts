
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      kindGroep
    } = await req.json();

    console.log('Generating week program with params:', {
      selectedWeek,
      selectedYear,
      moeilijkheidsgraad,
      timePerDay,
      subjects,
      theme,
      kindGroep
    });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key niet gevonden in secrets');
    }

    // Format theme for display
    const formatTheme = (themeInput: string) => {
      if (!themeInput || themeInput.trim() === '') return null;
      return themeInput.charAt(0).toUpperCase() + themeInput.slice(1).toLowerCase() + ' Avontuur Thema';
    };

    const formattedTheme = formatTheme(theme);

    // Generate AI prompt with time management and theme logic
    const systemPrompt = `Je bent een AI-assistent die weekprogramma's genereert voor Nederlandse basisschoolkinderen in groep ${kindGroep}. 

BELANGRIJKE TIJD REGELS:
- Elk onderdeel moet MINIMAAL 15 minuten duren
- Bereken aantal vragen op basis van tijd: ~2-3 minuten per vraag
- 15 min = 5-7 vragen, 30 min = 10-15 vragen, 45 min = 15-20 vragen

THEMA REGELS:
${formattedTheme ? `Het thema is: "${formattedTheme}"` : 'Geen specifiek thema'}

WELKE ONDERDELEN KRIJGEN THEMA:
✅ Thema toepassen op: Verhalen Rekenen, Begrijpend Lezen, Woordenschat, Engels Conversatie, Spelling in context
❌ GEEN thema op: Tafels, Breuken, Hoofdrekenen, Grammatica regels, Engels grammatica

ONDERWERPEN PER GROEP ${kindGroep}:
Rekenen: Tafels, Breuken, Hoofdrekenen, Verhalen Rekenen, Meetkunde
Taal: Begrijpend Lezen, Woordenschat, Spelling, Grammatica
Engels: Woordenschat, Conversatie, Luisteren

Genereer een weekprogramma (maandag t/m vrijdag) met realistische tijdsschattingen en juiste thema toepassing.`;

    const userPrompt = `Genereer een weekprogramma voor groep ${kindGroep} met moeilijkheidsgraad "${moeilijkheidsgraad}".

Totale tijd per dag: ${timePerDay} minuten
Vakken: ${Object.entries(subjects).filter(([_, subject]) => subject.enabled).map(([key, _]) => key).join(', ')}
${formattedTheme ? `Thema: ${formattedTheme}` : ''}

Geef terug in deze exacte JSON structuur:
[
  {
    "dag": "Maandag",
    "oefeningen": [
      {
        "titel": "Titel van oefening",
        "type": "rekenen/taal/engels",
        "tijd": "15 min",
        "tijdInMinuten": 15,
        "beschrijving": "Korte beschrijving",
        "vragen": [
          {
            "vraag": "De vraag tekst",
            "antwoord": "Het juiste antwoord",
            "type": "multiple_choice/open/waar_onwaar",
            "opties": ["optie1", "optie2", "optie3", "optie4"] // alleen bij multiple_choice
          }
        ]
      }
    ]
  }
]

Zorg voor realistische tijdsschattingen en juiste thema toepassing!`;

    console.log('Sending request to OpenAI...');

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
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API fout: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received');

    const content = aiResponse.choices[0].message.content;
    
    // Parse JSON response
    let programData;
    try {
      programData = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      throw new Error('Ongeldige AI response format');
    }

    // Validate and clean up the program data
    const validatedProgram = programData.map((dag: any) => ({
      ...dag,
      oefeningen: dag.oefeningen?.map((oef: any) => ({
        ...oef,
        tijdInMinuten: oef.tijdInMinuten || parseInt(oef.tijd) || 15,
        vragen: oef.vragen?.slice(0, 20) || [] // Limit questions
      })) || []
    }));

    console.log('Program generated successfully with theme:', formattedTheme);

    return new Response(JSON.stringify({ 
      success: true, 
      programData: validatedProgram,
      theme: formattedTheme
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-week-program:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
