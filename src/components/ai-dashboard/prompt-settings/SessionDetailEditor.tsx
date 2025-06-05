
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Calendar, Settings, FileText } from 'lucide-react';
import { FeedbackSession, PromptVersion } from '@/types/database';
import { toast } from 'sonner';

interface SessionDetailEditorProps {
  session: FeedbackSession;
  promptVersion: PromptVersion | null;
  onUpdateNotes: (sessionId: string, notes: string) => Promise<void>;
}

const SessionDetailEditor: React.FC<SessionDetailEditorProps> = ({
  session,
  promptVersion,
  onUpdateNotes
}) => {
  const [userNotes, setUserNotes] = useState(session.user_notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await onUpdateNotes(session.id, userNotes);
      toast.success('Notities opgeslagen');
    } catch (error) {
      toast.error('Fout bij opslaan notities');
    } finally {
      setIsSaving(false);
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

  const settings = session.generation_settings || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-maitje-blue" />
            Sessie Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Algemene Informatie</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Naam:</strong> {session.session_name}</p>
                <p><strong>Aangemaakt:</strong> {formatDate(session.created_at)}</p>
                <p><strong>Status:</strong> 
                  <Badge className="ml-2" variant={
                    session.status === 'analyzed' ? 'default' :
                    session.status === 'completed' ? 'secondary' : 'outline'
                  }>
                    {session.status === 'in_progress' ? 'In uitvoering' :
                     session.status === 'completed' ? 'Voltooid' : 'Geanalyseerd'}
                  </Badge>
                </p>
                <p><strong>Feedback compleet:</strong> 
                  <Badge className="ml-2" variant={session.feedback_completed ? 'default' : 'outline'}>
                    {session.feedback_completed ? 'Ja' : 'Nee'}
                  </Badge>
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Prompt Versie</h4>
              <div className="space-y-2 text-sm">
                {promptVersion ? (
                  <>
                    <p><strong>Naam:</strong> {promptVersion.version_name}</p>
                    <p><strong>Aangemaakt:</strong> {formatDate(promptVersion.created_at)}</p>
                    <p><strong>Actief:</strong> 
                      <Badge className="ml-2" variant={promptVersion.is_active ? 'default' : 'outline'}>
                        {promptVersion.is_active ? 'Ja' : 'Nee'}
                      </Badge>
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500">Prompt versie niet gevonden</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-maitje-blue" />
            Generatie Instellingen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Tijd per dag:</strong> {settings.timePerDay || 'Niet gespecificeerd'} minuten</p>
              <p><strong>Thema:</strong> {settings.theme || 'Geen thema'}</p>
              <p><strong>AI Personalisatie:</strong> {settings.useAIPersonalization ? 'Aan' : 'Uit'}</p>
            </div>
            <div>
              <p><strong>Vakken:</strong></p>
              <div className="ml-4 space-y-1">
                {settings.subjects ? Object.entries(settings.subjects).map(([subject, config]: [string, any]) => (
                  config.enabled && (
                    <div key={subject}>
                      <Badge variant="outline" className="mr-2">{subject}</Badge>
                      {config.subtopics && (
                        <span className="text-xs text-gray-600">
                          ({config.subtopics.join(', ')})
                        </span>
                      )}
                    </div>
                  )
                )) : 'Niet gespecificeerd'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {promptVersion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-maitje-blue" />
              Gebruikte Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {promptVersion.prompt_content}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Eigen Notities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Voeg hier je eigen observaties en notities toe over deze test sessie..."
            className="min-h-[120px]"
          />
          <Button 
            onClick={handleSaveNotes}
            disabled={isSaving}
            className="w-full"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Opslaan...' : 'Notities Opslaan'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programma Overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {session.test_program_data.map((dag: any, index: number) => (
              <div key={index} className="text-center p-3 border rounded-lg">
                <div className="font-semibold text-gray-800">{dag.dag}</div>
                <div className="text-sm text-gray-600">
                  {dag.oefeningen?.length || 0} oefeningen
                </div>
                <div className="text-xs text-gray-500">
                  {dag.oefeningen?.reduce((sum: number, oef: any) => sum + (oef.tijdInMinuten || 0), 0) || 0} min
                </div>
                <div className="text-xs text-gray-500">
                  {dag.oefeningen?.reduce((sum: number, oef: any) => sum + (oef.vragen?.length || 0), 0) || 0} vragen
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionDetailEditor;
