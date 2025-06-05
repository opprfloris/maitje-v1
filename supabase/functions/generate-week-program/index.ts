
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { formatTheme } from './theme-utils.ts';
import { generateSystemPrompt, generateUserPrompt } from './prompt-generator.ts';
import { OpenAIClient } from './openai-client.ts';
import { parseAndValidateProgram } from './data-validator.ts';
import { PromptService } from './prompt-service.ts';

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

    // Initialize services
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const promptService = new PromptService(supabaseUrl, supabaseKey);
    const openAIClient = new OpenAIClient(openAIApiKey);

    // Get custom prompt
    const customPrompt = await promptService.getCustomPrompt(promptVersionId, userId);

    // Format theme for display
    const formattedTheme = formatTheme(theme);

    // Generate prompts
    const systemPrompt = generateSystemPrompt(customPrompt, kindGroep, theme);
    const userPrompt = generateUserPrompt({
      kindGroep,
      moeilijkheidsgraad,
      timePerDay,
      subjects,
      theme,
      isTestMode
    });

    console.log('Sending request to OpenAI with custom prompt...', customPrompt ? 'Using custom prompt' : 'Using default prompt');

    // Call OpenAI API
    const aiResponse = await openAIClient.generateCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    console.log('OpenAI response received');

    const content = aiResponse.choices[0].message.content;
    
    // Parse and validate response
    const validatedProgram = parseAndValidateProgram(content);

    console.log('Program generated successfully with theme:', formattedTheme, 'Test mode:', isTestMode);

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
