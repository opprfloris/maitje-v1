
import React, { useState } from 'react';
import { Upload, FileText, Trash2, Eye, Plus, BookOpen } from 'lucide-react';
import { useLessonMethodContent } from '@/hooks/useLessonMethodContent';

const ContentManagementTab: React.FC = () => {
  const { content, loading, createContent, deleteContent } = useLessonMethodContent();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newContent, setNewContent] = useState({
    method_name: '',
    subject: 'rekenen',
    description: '',
    content_data: [] as any[],
  });

  const subjects = [
    { value: 'rekenen', label: 'Rekenen' },
    { value: 'begrijpend_lezen', label: 'Begrijpend Lezen' },
    { value: 'engels', label: 'Engels' },
    { value: 'spelling', label: 'Spelling' },
  ];

  const handleCreateContent = async () => {
    if (!newContent.method_name || !newContent.subject) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const result = await createContent(newContent);
    if (result) {
      setNewContent({
        method_name: '',
        subject: 'rekenen',
        description: '',
        content_data: [],
      });
      setShowCreateForm(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm('Weet je zeker dat je deze content wilt verwijderen?')) {
      await deleteContent(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-nunito font-bold text-gray-800">Content Management</h2>
          <p className="text-gray-600">Beheer lesmethode content voor dagelijkse oefeningen</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-maitje-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Content
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-nunito font-bold text-gray-800 mb-4">
            Nieuwe Lesmethode Content
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-nunito font-semibold text-gray-700 mb-2">
                Methode Naam *
              </label>
              <input
                type="text"
                value={newContent.method_name}
                onChange={(e) => setNewContent(prev => ({ ...prev, method_name: e.target.value }))}
                placeholder="bijv. Pluspunt, Nieuw Namen"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-blue focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-nunito font-semibold text-gray-700 mb-2">
                Vak *
              </label>
              <select
                value={newContent.subject}
                onChange={(e) => setNewContent(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-blue focus:outline-none"
              >
                {subjects.map(subject => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-nunito font-semibold text-gray-700 mb-2">
              Beschrijving
            </label>
            <textarea
              value={newContent.description}
              onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Korte beschrijving van de lesmethode"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-maitje-blue focus:outline-none"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleCreateContent}
              className="bg-maitje-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Aanmaken
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-nunito font-bold text-gray-800">
            Beschikbare Content ({content.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-maitje-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Content laden...</p>
          </div>
        ) : content.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-nunito font-semibold text-gray-500 mb-2">
              Nog geen content
            </h4>
            <p className="text-gray-400">
              Voeg je eerste lesmethode content toe om te beginnen.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {content.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-nunito font-bold text-gray-800">
                        {item.method_name}
                      </h4>
                      <span className="bg-maitje-blue text-white px-3 py-1 rounded-full text-sm font-nunito">
                        {subjects.find(s => s.value === item.subject)?.label}
                      </span>
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 mb-3">{item.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Aangemaakt: {new Date(item.created_at).toLocaleDateString('nl-NL')}</span>
                      <span>•</span>
                      <span>Content items: {Array.isArray(item.content_data) ? item.content_data.length : 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-maitje-blue transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors">
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-nunito font-bold text-blue-800 mb-3">
          📋 Hoe werkt Content Management?
        </h4>
        <div className="space-y-2 text-blue-700">
          <p>• <strong>Lesmethode content:</strong> Upload materiaal van bestaande lesmethoden zoals Pluspunt, Nieuw Namen, etc.</p>
          <p>• <strong>AI Integratie:</strong> Content wordt gebruikt om automatisch oefeningen te genereren die aansluiten bij de lesmethode</p>
          <p>• <strong>Dagelijkse Oefeningen:</strong> Leerlingen kunnen in het hoofdmenu kiezen voor lesmethode-specifieke oefeningen</p>
          <p>• <strong>Voortgang:</strong> Alle gemaakte oefeningen worden bijgehouden voor analyse en verbetering</p>
        </div>
      </div>
    </div>
  );
};

export default ContentManagementTab;
