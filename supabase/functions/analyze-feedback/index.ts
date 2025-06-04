
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
    const { sessionId, userFeedback, currentPrompt } = await req.json();

    console.log('Analyzing feedback for session:', sessionId);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key niet gevonden');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all feedback for this session
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('question_feedback')
      .select('*')
      .eq('session_id', sessionId);

    if (feedbackError) {
      throw new Error(`Database error: ${feedbackError.message}`);
    }

    // Analyze with AI
    const systemPrompt = `Je bent een expert AI prompt engineer die feedback analyseert op AI-gegenereerde onderwijscontent voor Nederlandse basisschoolkinderen.

Je taak is om:
1. Alle feedback te analyseren (zowel categorieën als tekstuele feedback)
2. Patronen te identificeren in de problemen
3. Concrete verbeteringen voor te stellen voor de AI prompt
4. Een nieuwe, verbeterde prompt te genereren

Focus op:
- Vraagkwaliteit (duidelijkheid, moeilijkheidsgraad, relevantie)
- Antwoordkwaliteit (juistheid, volledigheid)
- Thema-consistentie
- Tijd-realisme
- Leeftijdsgeschiktheid

Geef een gestructureerde analyse met concrete prompt verbeteringen.`;

    const analysisPrompt = `Analyseer deze feedback op een AI-gegenereerd weekprogramma:

HUIDIGE PROMPT:
${currentPrompt}

FEEDBACK DATA:
${JSON.stringify(feedbackData, null, 2)}

AANVULLENDE GEBRUIKER FEEDBACK:
${userFeedback}

Geef een gedetailleerde analyse met:
1. BELANGRIJKSTE PROBLEMEN (top 3)
2. PATRONEN IN FEEDBACK
3. CONCRETE VERBETERINGEN
4. NIEUWE PROMPT VERSIE

Format je antwoord als JSON met de velden: analysis, improvements, newPrompt`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API fout: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0].message.content;

    let analysisResult;
    try {
      // Try to parse as JSON first
      analysisResult = JSON.parse(content);
    } catch {
      // If not JSON, create structured response
      analysisResult = {
        analysis: content,
        improvements: "Zie analyse voor verbeteringen",
        newPrompt: currentPrompt
      };
    }

    // Update session with analysis
    const { error: updateError } = await supabase
      .from('feedback_sessions')
      .update({ 
        ai_analysis: JSON.stringify(analysisResult),
        status: 'analyzed',
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session:', updateError);
    }

    console.log('Feedback analysis completed');

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-feedback:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
