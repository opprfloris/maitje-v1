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
      kindGroep,
      promptVersionId,
      isTestMode = false
    } = await req.json();

    console.log('Generating week program with params:', {
      selectedWeek,
      selectedYear,
      moeilijkheidsgraad,
      timePerDay,
      subjects,
      theme,
      kindGroep,
      promptVersionId,
      isTestMode
    });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key niet gevonden in secrets');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get custom prompt if specified
    let customPrompt = null;
    if (promptVersionId) {
      const { data: promptData, error: promptError } = await supabase
        .from('prompt_versions')
        .select('prompt_content')
        .eq('id', promptVersionId)
        .single();

      if (!promptError && promptData) {
        customPrompt = promptData.prompt_content;
      }
    }

    // If no custom prompt, get the active prompt for this user
    if (!customPrompt) {
      const { data: activePromptData, error: activePromptError } = await supabase
        .from('prompt_versions')
        .select('prompt_content')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (!activePromptError && activePromptData) {
        customPrompt = activePromptData.prompt_content;
      }
    }

    // Format theme for display
    const formatTheme = (themeInput: string) => {
      if (!themeInput || themeInput.trim() === '') return null;
      return themeInput.charAt(0).toUpperCase() + themeInput.slice(1).toLowerCase() + ' Avontuur Thema';
    };

    const formattedTheme = formatTheme(theme);

    // Use custom prompt or fallback to default
    const systemPrompt = customPrompt || `Je bent een AI-assistent die weekprogramma's genereert voor Nederlandse basisschoolkinderen in groep ${kindGroep}. 

BELANGRIJKE TIJD REGELS:
- Elk onderdeel moet MINIMAAL 15 minuten duren
- Bereken aantal vragen op basis van tijd: ~2-3 minuten per vraag
- 15 min = 5-7 vragen, 30 min = 10-15 vragen, 45 min = 15-20 vragen

THEMA REGELS:
${formattedThema ? `Het thema is: "${formattedThema}"` : 'Geen specifiek thema'}

WELKE ONDERDELEN KRIJGEN THEMA:
✅ Thema toepassen op: Verhalen Rekenen, Begrijpend Lezen, Woordenschat, Engels Conversatie, Spelling in context
❌ GEEN thema op: Tafels, Breuken, Hoofdrekenen, Grammatica regels, Engels grammatica

ONDERWERPEN PER GROEP ${kindGroep}:
Rekenen: Tafels, Breuken, Hoofdrekenen, Verhalen Rekenen, Meetkunde
Taal: Begrijpend Lezen, Woordenschat, Spelling, Grammatica
Engels: Woordenschat, Conversatie, Luisteren

Genereer een weekprogramma (maandag t/m vrijdag) met realistische tijdsschattingen en juiste thema toepassing.`;

    // Generate AI prompt with time management and theme logic
    const userPrompt = `Genereer een weekprogramma voor groep ${kindGroep} met moeilijkheidsgraad "${moeilijkheidsgraad}".

Totale tijd per dag: ${timePerDay} minuten
Vakken: ${Object.entries(subjects).filter(([_, subject]) => subject.enabled).map(([key, _]) => key).join(', ')}
${formattedTheme ? `Thema: ${formattedTheme}` : ''}
${isTestMode ? '\n*** DIT IS EEN TEST GENERATIE - GEBRUIK EXTRA AANDACHT VOOR KWALITEIT ***' : ''}

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

    console.log('Sending request to OpenAI with custom prompt...', customPrompt ? 'Using custom prompt' : 'Using default prompt');

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
    
    // Parse JSON response - handle markdown code blocks
    let programData;
    try {
      // Remove markdown code block markers if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/\n?```/g, '');
      programData = JSON.parse(cleanContent);
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

    console.log('Program generated successfully with theme:', formattedThema, 'Test mode:', isTestMode);

    return new Response(JSON.stringify({ 
      success: true, 
      programData: validatedProgram,
      theme: formattedThema
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
