
import React from 'react';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DevDashboardDocumentationProps {
  onBack: () => void;
}

const DevDashboardDocumentation: React.FC<DevDashboardDocumentationProps> = ({ onBack }) => {
  const markdownContent = `
# Dev Dashboard - Volledige Systeemanalyse

## Overzicht
Het Dev Dashboard is het centrale beheercentrum voor AI-configuratie en content management binnen de Maitje applicatie. Dit document beschrijft alle inputs, outputs, database verbindingen en API interacties.

---

## 1. AI Model Configuration Tab

### Functionaliteit
- Configuratie van AI modellen en instellingen
- Beheer van API keys en model selectie
- Taal- en content filter instellingen

### Database Verbindingen
**Tabel: \`user_ai_config\`**
- \`user_id\`: Koppeling naar auth.users
- \`selected_model\`: Gekozen AI model (gpt-4-mini, gpt-4o, etc.)
- \`api_key_encrypted\`: Versleutelde OpenAI API key
- \`language\`: Taalinstelling (default: 'nl')
- \`content_filter\`: Filter niveau (low, medium, high)

### API Verbindingen
- **OpenAI API**: Voor AI model configuratie en testing
- **Supabase Edge Functions**: Voor AI functionaliteit

### Input/Output Flow
\`\`\`
User Input → AI Config Form → Supabase Database → Edge Functions → OpenAI API
                                     ↓
                            Real-time Updates ← Response Processing
\`\`\`

---

## 2. AI Prompt Instellingen Tab

### Functionaliteit
- Beheer van prompt versies
- Testing sandbox voor prompts
- Feedback analyse systeem
- Template management

### Database Verbindingen
**Tabel: \`prompt_versions\`**
- \`user_id\`: Eigenaar van de prompt
- \`version_name\`: Naam van de prompt versie
- \`prompt_content\`: De daadwerkelijke prompt tekst
- \`is_active\`: Of deze versie actief is
- \`test_count\`: Aantal keer getest
- \`success_rate\`: Succespercentage
- \`tags\`: Categorisering tags

**Tabel: \`feedback_sessions\`**
- \`user_id\`: Sessie eigenaar
- \`prompt_version_id\`: Gekoppelde prompt versie
- \`session_name\`: Naam van de test sessie
- \`test_program_data\`: Test data voor AI
- \`ai_analysis\`: AI analyse resultaten
- \`status\`: Sessie status (in_progress, completed, analyzed)
- \`generation_settings\`: Configuratie instellingen

**Tabel: \`question_feedback\`**
- \`session_id\`: Koppeling naar feedback sessie
- \`question_text\`: De gestelde vraag
- \`correct_answer\`: Het juiste antwoord
- \`feedback_category\`: Type feedback (good, incorrect, unclear, etc.)
- \`thumbs_rating\`: Duim omhoog/omlaag
- \`difficulty_rating\`: Moeilijkheidsgraad feedback

### Edge Functions
**\`generate-week-program\`**
- Input: Prompt versie, generatie instellingen
- Output: Gegenereerd weekprogramma
- Database updates: Opslaan van resultaten in feedback_sessions

**\`analyze-feedback\`**
- Input: Feedback session data
- Output: AI analyse van de feedback
- Database updates: ai_analysis veld in feedback_sessions

### API Flow
\`\`\`
Prompt Editor → prompt_versions table → Testing Sandbox
                                              ↓
                                    generate-week-program function
                                              ↓
                                         OpenAI API
                                              ↓
                                    feedback_sessions table
                                              ↓
                                      Feedback Analysis
                                              ↓
                                    question_feedback table
\`\`\`

---

## 3. Document Library Tab

### Functionaliteit
- Upload en beheer van AI documenten
- Categorisering van bestanden
- Document analyse en verwerking

### Database Verbindingen
**Tabel: \`ai_documents\`**
- \`user_id\`: Eigenaar van het document
- \`document_name\`: Naam van het bestand
- \`document_type\`: Type bestand (PDF, DOCX, etc.)
- \`file_path\`: Pad naar bestand in Supabase Storage
- \`subject_category\`: Onderwerp categorie
- \`description\`: Beschrijving van het document
- \`tags\`: Zoek tags

### Storage Verbindingen
**Supabase Storage Bucket: \`documents\`**
- Opslag van geüploade bestanden
- Automatische file path generatie
- Beveiligde toegang via RLS policies

### API Flow
\`\`\`
File Upload → Supabase Storage → ai_documents table → Document Processing
                                                              ↓
                                                    Content Extraction
                                                              ↓
                                                      AI Analysis
                                                              ↓
                                              Enhanced Document Metadata
\`\`\`

---

## 4. Content Management Tab

### Functionaliteit
- Beheer van lesmethode content
- Upload van educatieve materialen
- Koppeling met dagelijkse oefeningen

### Database Verbindingen
**Tabel: \`lesson_method_content\`**
- \`user_id\`: Content eigenaar
- \`method_name\`: Naam van de lesmethode (Pluspunt, Nieuw Namen, etc.)
- \`subject\`: Vak (rekenen, begrijpend_lezen, engels, spelling)
- \`description\`: Beschrijving van de methode
- \`content_data\`: JSON met lesson content
- \`file_path\`: Optioneel pad naar bijlagen
- \`is_active\`: Of de content actief is

**Tabel: \`exercise_examples\`**
- \`user_id\`: Eigenaar van de voorbeelden
- \`file_name\`: Originele bestandsnaam
- \`file_path\`: Pad in Supabase Storage
- \`file_type\`: MIME type van bestand
- \`subject\`: Onderwerp van de oefening
- \`ai_analysis\`: AI analyse van het bestand
- \`generated_exercises\`: Gegenereerde oefeningen

### Edge Functions
**\`analyze-exercise-example\`**
- Input: Exercise example ID, gewenste lengte
- Process: AI analyse van uploaded content
- Output: Gegenereerde oefeningen
- Database updates: ai_analysis en generated_exercises velden

### Storage Integration
**Bucket: \`exercise-examples\`**
- Opslag van geüploade voorbeelden
- Automatische bestandsorganisatie per gebruiker
- RLS beleid voor toegangscontrole

### Dagelijkse Oefeningen Koppeling
\`\`\`
Content Upload → lesson_method_content table
                              ↓
                    Daily Exercise Generator
                              ↓
                      AI Content Analysis
                              ↓
                   Personalized Exercise Creation
                              ↓
                    Student Interface Display
\`\`\`

---

## 5. Analytics Tab

### Functionaliteit
- Analyse van AI prestaties
- User behavior tracking
- System performance monitoring

### Database Verbindingen
**Diverse Analytics Tables:**
- \`exercise_sessions\`: Oefening statistieken
- \`daily_progress\`: Dagelijkse voortgang
- \`weekly_program_progress\`: Week programma voortgang
- \`question_feedback\`: Vraag feedback data

### Data Aggregation
\`\`\`
Raw Session Data → Analytics Processing → Insights Generation
                                              ↓
                                        Dashboard Widgets
                                              ↓
                                     Performance Metrics
\`\`\`

---

## 6. Cross-Component Integraties

### Authentication Flow
\`\`\`
User Login → Supabase Auth → Profile Creation → Role Assignment
                                      ↓
                               Dev Dashboard Access Check
                                      ↓
                              Component Authorization
\`\`\`

### Data Synchronization
- **Real-time Updates**: Via Supabase Realtime
- **Cross-tab Communication**: Shared state management
- **Cache Management**: React Query voor data caching

### Security Layers
1. **Supabase RLS Policies**: Row-level beveiliging
2. **API Key Encryption**: Veilige opslag van gevoelige data
3. **Role-based Access**: Verschillende toegangsniveaus
4. **Input Validation**: Beide client- en server-side

---

## 7. Edge Functions Architectuur

### Function Dependencies
\`\`\`
generate-week-program/
├── index.ts (main handler)
├── openai-client.ts (API wrapper)
├── prompt-generator.ts (prompt creation)
├── prompt-service.ts (database queries)
├── data-validator.ts (input validation)
└── theme-utils.ts (theme processing)
\`\`\`

### Secrets Management
- **OPENAI_API_KEY**: Voor AI functionaliteit
- **SUPABASE_SERVICE_ROLE_KEY**: Voor database toegang
- **Custom Environment Variables**: Per function configuratie

---

## 8. Performance Optimizations

### Database Optimizations
- **Indexing**: Op veel-gebruikte query velden
- **Connection Pooling**: Efficiënte database verbindingen
- **Query Optimization**: Geoptimaliseerde SQL queries

### Frontend Optimizations
- **Code Splitting**: Lazy loading van components
- **Memoization**: React memo voor performance
- **Virtual Scrolling**: Voor grote data sets

### API Optimizations
- **Request Batching**: Gecombineerde API calls
- **Response Caching**: Intelligent cache strategies
- **Error Handling**: Graceful degradation

---

## 9. Monitoring & Debugging

### Logging Strategies
- **Edge Function Logs**: Realtime functie monitoring
- **Database Logs**: Query performance tracking
- **Frontend Logs**: User interaction tracking

### Error Handling
- **Try-catch Blocks**: Gestructureerde error handling
- **User Feedback**: Toast notificaties voor users
- **Admin Notifications**: Kritieke error alerts

---

## 10. Future Extensibility

### Modulaire Architectuur
- **Plugin System**: Voor nieuwe AI providers
- **Template System**: Voor custom content types
- **API Versioning**: Voor backward compatibility

### Scalability Considerations
- **Horizontal Scaling**: Database sharding strategies
- **CDN Integration**: Voor static content delivery
- **Load Balancing**: Voor high-traffic scenarios

---

*Laatst bijgewerkt: ${new Date().toLocaleDateString('nl-NL')}*
`;

  return (
    <div className="min-h-screen bg-maitje-cream">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Terug naar Dev Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-nunito font-bold text-gray-800">
                  Dev Dashboard Documentatie
                </h1>
                <p className="text-gray-600">Volledige systeemanalyse en architectuur</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="prose max-w-none">
              <div 
                className="markdown-content"
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  lineHeight: '1.6',
                  color: '#374151'
                }}
                dangerouslySetInnerHTML={{
                  __html: markdownContent
                    .replace(/^# (.*$)/gm, '<h1 style="font-size: 2.5rem; font-weight: bold; margin: 2rem 0 1rem 0; color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 0.5rem;">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 style="font-size: 2rem; font-weight: bold; margin: 1.5rem 0 0.75rem 0; color: #374151;">$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3 style="font-size: 1.5rem; font-weight: semibold; margin: 1.25rem 0 0.5rem 0; color: #4b5563;">$1</h3>')
                    .replace(/^\*\*(.*?)\*\*/gm, '<strong style="font-weight: bold; color: #1f2937;">$1</strong>')
                    .replace(/^- (.*$)/gm, '<li style="margin: 0.25rem 0;">$1</li>')
                    .replace(/^([0-9]+\. .*$)/gm, '<ol><li style="margin: 0.25rem 0;">$1</li></ol>')
                    .replace(/```([\s\S]*?)```/g, '<pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0;"><code style="font-family: Monaco, Consolas, monospace; font-size: 0.875rem;">$1</code></pre>')
                    .replace(/`([^`]+)`/g, '<code style="background: #e5e7eb; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: Monaco, Consolas, monospace; font-size: 0.875rem;">$1</code>')
                    .replace(/\n\n/g, '</p><p style="margin: 1rem 0;">')
                    .replace(/^\*\s/gm, '• ')
                    .replace(/^---$/gm, '<hr style="margin: 2rem 0; border: none; border-top: 1px solid #e5e7eb;">')
                }}
              />
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="mt-6 flex gap-4">
          <Button
            onClick={() => {
              const blob = new Blob([markdownContent], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'dev-dashboard-documentatie.md';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Download als Markdown
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DevDashboardDocumentation;
