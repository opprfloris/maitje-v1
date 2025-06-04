
import React, { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Child } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Props {
  selectedChild: Child | null;
  onChildSelect: (child: Child) => void;
  onSignOut: () => void;
}

const ChildSelector = ({ selectedChild, onChildSelect, onSignOut }: Props) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('Groep 5');
  const [loading, setLoading] = useState(false);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('family_connections')
      .select(`
        child_id,
        children (*)
      `)
      .eq('parent_id', user.id);

    if (error) {
      console.error('Error fetching children:', error);
      return;
    }

    const childrenData = data?.map(fc => fc.children).filter(Boolean) as Child[];
    setChildren(childrenData || []);
    
    // Auto-select first child if none selected
    if (childrenData?.length > 0 && !selectedChild) {
      onChildSelect(childrenData[0]);
    }
  };

  const addChild = async () => {
    if (!user || !childName.trim()) return;
    
    setLoading(true);
    try {
      // Create child
      const { data: childData, error: childError } = await supabase
        .from('children')
        .insert({
          name: childName.trim(),
          school_level: schoolLevel,
          current_level: parseInt(schoolLevel.replace('Groep ', '')),
        })
        .select()
        .single();

      if (childError) throw childError;

      // Create family connection
      const { error: connectionError } = await supabase
        .from('family_connections')
        .insert({
          parent_id: user.id,
          child_id: childData.id,
          is_primary: children.length === 0, // First child is primary
        });

      if (connectionError) throw connectionError;

      await fetchChildren();
      setChildName('');
      setShowAddChild(false);
      
      toast({
        title: "Kind toegevoegd!",
        description: `${childData.name} is succesvol toegevoegd`,
      });

      // Select the new child
      onChildSelect(childData);
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error.message || "Er is een fout opgetreden",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-maitje-cream p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-nunito font-bold text-gray-800">
              Welkom {profile?.first_name}! 👋
            </h1>
            <p className="text-gray-600 font-nunito">
              Selecteer een kind om te beginnen met leren
            </p>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">Uitloggen</span>
          </button>
        </div>

        {/* Children Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => onChildSelect(child)}
              className={`maitje-card text-left p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${
                selectedChild?.id === child.id ? 'ring-2 ring-maitje-blue' : ''
              }`}
            >
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-maitje-green rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                  {child.avatar_emoji}
                </div>
                <h3 className="text-xl font-nunito font-bold text-gray-800">
                  {child.name}
                </h3>
                <p className="text-gray-600">{child.school_level}</p>
                <p className="text-sm text-maitje-blue font-semibold">
                  Level {child.current_level}
                </p>
              </div>
            </button>
          ))}

          {/* Add Child Button */}
          <Dialog open={showAddChild} onOpenChange={setShowAddChild}>
            <DialogTrigger asChild>
              <button className="maitje-card p-6 text-center hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <Plus className="w-8 h-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-nunito font-bold text-gray-600">
                      Kind Toevoegen
                    </h3>
                    <p className="text-sm text-gray-500">
                      Voeg een nieuw kind toe
                    </p>
                  </div>
                </div>
              </button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nieuw Kind Toevoegen</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="childName">Naam van het kind</Label>
                  <Input
                    id="childName"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Bijv. Emma"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="schoolLevel">Schoolniveau</Label>
                  <select
                    id="schoolLevel"
                    value={schoolLevel}
                    onChange={(e) => setSchoolLevel(e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Groep 3">Groep 3</option>
                    <option value="Groep 4">Groep 4</option>
                    <option value="Groep 5">Groep 5</option>
                    <option value="Groep 6">Groep 6</option>
                    <option value="Groep 7">Groep 7</option>
                    <option value="Groep 8">Groep 8</option>
                  </select>
                </div>
                
                <Button
                  onClick={addChild}
                  disabled={loading || !childName.trim()}
                  className="w-full maitje-button"
                >
                  {loading ? 'Toevoegen...' : 'Kind Toevoegen'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {selectedChild && (
          <div className="text-center">
            <Button
              onClick={() => onChildSelect(selectedChild)}
              className="maitje-button text-xl py-6 px-12"
            >
              Start met leren voor {selectedChild.name} →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildSelector;
