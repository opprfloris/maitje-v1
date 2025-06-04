
import React from 'react';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface SubjectData {
  enabled: boolean;
  subtopics: string[];
}

interface SubjectSelectorProps {
  subjects: Record<string, SubjectData>;
  onSubjectToggle: (subject: string) => void;
  onSubtopicToggle: (subject: string, subtopic: string) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  onSubjectToggle,
  onSubtopicToggle
}) => {
  const [openSubjects, setOpenSubjects] = React.useState<Record<string, boolean>>({});

  const subjectConfig = {
    rekenen: {
      name: 'Rekenen',
      icon: '🔢',
      color: 'blue',
      allSubtopics: ['Tafels', 'Breuken', 'Hoofdrekenen', 'Verhalen Rekenen', 'Meetkunde']
    },
    taal: {
      name: 'Taal',
      icon: '📚',
      color: 'green', 
      allSubtopics: ['Begrijpend Lezen', 'Woordenschat', 'Spelling', 'Grammatica']
    },
    engels: {
      name: 'Engels',
      icon: '🇬🇧',
      color: 'purple',
      allSubtopics: ['Woordenschat', 'Conversatie', 'Luisteren']
    }
  };

  const toggleSubject = (subject: string) => {
    setOpenSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  return (
    <div className="space-y-4">
      {Object.entries(subjectConfig).map(([key, config]) => {
        const subject = subjects[key];
        const isOpen = openSubjects[key];
        
        return (
          <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
            <Collapsible open={isOpen} onOpenChange={() => toggleSubject(key)}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={subject.enabled}
                      onChange={() => onSubjectToggle(key)}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-5 h-5 text-${config.color}-600 focus:ring-${config.color}-500 border-gray-300 rounded`}
                    />
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <span className="font-semibold text-gray-800">{config.name}</span>
                      <div className="text-sm text-gray-600">
                        {subject.subtopics.length} van {config.allSubtopics.length} onderdelen geselecteerd
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {subject.enabled && (
                      <span className={`px-2 py-1 text-xs bg-${config.color}-100 text-${config.color}-800 rounded-full`}>
                        Actief
                      </span>
                    )}
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {config.allSubtopics.map((subtopic) => {
                      const isSelected = subject.subtopics.includes(subtopic);
                      
                      return (
                        <div
                          key={subtopic}
                          onClick={() => onSubtopicToggle(key, subtopic)}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            isSelected 
                              ? `border-${config.color}-300 bg-${config.color}-50` 
                              : 'border-gray-200 hover:border-gray-300'
                          } ${!subject.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? `border-${config.color}-500 bg-${config.color}-500` 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{subtopic}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        config.allSubtopics.forEach(subtopic => {
                          if (!subject.subtopics.includes(subtopic)) {
                            onSubtopicToggle(key, subtopic);
                          }
                        });
                      }}
                      disabled={!subject.enabled}
                      className={`px-3 py-1 text-xs border rounded ${
                        subject.enabled 
                          ? `border-${config.color}-300 text-${config.color}-700 hover:bg-${config.color}-50` 
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Alles selecteren
                    </button>
                    <button
                      onClick={() => {
                        subject.subtopics.forEach(subtopic => {
                          onSubtopicToggle(key, subtopic);
                        });
                      }}
                      disabled={!subject.enabled}
                      className={`px-3 py-1 text-xs border rounded ${
                        subject.enabled 
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Alles deselecteren
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
};

export default SubjectSelector;
