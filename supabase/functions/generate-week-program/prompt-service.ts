
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

export class PromptService {
  private supabase: any;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getCustomPrompt(promptVersionId?: string, userId?: string): Promise<string | null> {
    // Get custom prompt if specified
    if (promptVersionId) {
      const { data: promptData, error: promptError } = await this.supabase
        .from('prompt_versions')
        .select('prompt_content')
        .eq('id', promptVersionId)
        .single();

      if (!promptError && promptData) {
        return promptData.prompt_content;
      }
    }

    // If no custom prompt, get the active prompt for this user
    if (userId) {
      const { data: activePromptData, error: activePromptError } = await this.supabase
        .from('prompt_versions')
        .select('prompt_content')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (!activePromptError && activePromptData) {
        return activePromptData.prompt_content;
      }
    }

    return null;
  }
}
