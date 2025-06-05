
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Eye, Trash2, FileText } from 'lucide-react';
import { PromptVersion } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PromptVersionManagerProps {
  promptVersions: PromptVersion[];
  activePrompt: PromptVersion | null;
  onSetActive: (promptId: string) => Promise<void>;
  onReloadVersions: () => Promise<void>;
}

const PromptVersionManager: React.FC<PromptVersionManagerProps> = ({
  promptVersions,
  activePrompt,
  onSetActive,
  onReloadVersions
}) => {
  const { user } = useAuth();

  const deletePromptVersion = async (promptId: string) => {
    if (!user) return;

    const promptToDelete = promptVersions.find(p => p.id === promptId);
    if (promptToDelete?.is_active) {
      toast.error('Kan de actieve prompt niet verwijderen');
      return;
    }

    if (!confirm('Weet je zeker dat je deze prompt versie wilt verwijderen?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('prompt_versions')
        .delete()
        .eq('id', promptId);

      if (error) {
        throw error;
      }

      toast.success('Prompt versie verwijderd');
      onReloadVersions();
    } catch (error) {
      console.error('Error deleting prompt version:', error);
      toast.error('Fout bij verwijderen prompt versie');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreview = (content: string, maxLength = 150) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-maitje-blue" />
            Version Management
          </CardTitle>
          <CardDescription>
            Beheer al je prompt versies, wissel tussen versies en bekijk de geschiedenis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {promptVersions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nog geen prompt versies gevonden.</p>
              <p className="text-sm">Maak je eerste prompt aan in de Editor tab.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {promptVersions.map((prompt) => (
                <Card 
                  key={prompt.id}
                  className={`transition-all ${
                    prompt.is_active ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold">{prompt.version_name}</h4>
                          {prompt.is_active && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Actief
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Aangemaakt: {formatDate(prompt.created_at)}
                          </span>
                          {prompt.updated_at !== prompt.created_at && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Bijgewerkt: {formatDate(prompt.updated_at)}
                            </span>
                          )}
                        </div>

                        <div className="bg-gray-50 p-3 rounded border">
                          <p className="text-sm text-gray-700 font-mono">
                            {getPreview(prompt.prompt_content)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {!prompt.is_active && (
                          <Button
                            onClick={() => onSetActive(prompt.id)}
                            size="sm"
                            variant="outline"
                          >
                            Activeer
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => {
                            const modal = document.createElement('div');
                            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                            modal.innerHTML = `
                              <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
                                <div class="flex items-center justify-between mb-4">
                                  <h3 class="text-lg font-semibold">${prompt.version_name}</h3>
                                  <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">✕</button>
                                </div>
                                <pre class="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded border">${prompt.prompt_content}</pre>
                              </div>
                            `;
                            document.body.appendChild(modal);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Bekijk
                        </Button>

                        {!prompt.is_active && (
                          <Button
                            onClick={() => deletePromptVersion(prompt.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Verwijder
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {promptVersions.length > 0 && (
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Tips voor Versie Beheer:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Gebruik beschrijvende namen voor je versies</li>
              <li>• Test nieuwe versies altijd in de Test Sandbox</li>
              <li>• Bewaar werkende versies als backup</li>
              <li>• Gebruik de Feedback Analyse voor data-gedreven verbeteringen</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptVersionManager;
