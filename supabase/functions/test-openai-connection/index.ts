
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'OpenAI API key is niet geconfigureerd in Supabase secrets',
        details: 'Voeg je OpenAI API key toe in de Tool & AI Instellingen'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Testing OpenAI API connection...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: 'Zeg alleen "Test succesvol" in het Nederlands' }
        ],
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API test failed:', response.status, errorData);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: `OpenAI API fout (${response.status})`,
        details: response.status === 401 ? 'Ongeldige API key' : errorData
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResponse = await response.json();
    const testMessage = aiResponse.choices[0].message.content;

    console.log('OpenAI API test successful:', testMessage);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'OpenAI API verbinding succesvol getest',
      testResponse: testMessage,
      model: 'gpt-4o-mini'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error testing OpenAI connection:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Fout bij testen van OpenAI verbinding',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
