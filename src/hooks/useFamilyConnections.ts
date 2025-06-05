
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FamilyConnection {
  id: string;
  parent_id: string;
  child_id: string;
  relationship: string;
  is_primary: boolean;
  created_at: string;
}

export const useFamilyConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<FamilyConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('family_connections')
        .select('*')
        .eq('parent_id', user.id);

      if (error) throw error;
      setConnections(data || []);
    } catch (error) {
      console.error('Error fetching family connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getParentIdForChild = (childId: string): string | null => {
    // Voor nu gebruiken we de ingelogde user als parent
    // Later kan dit uitgebreid worden met echte family connections
    return user?.id || null;
  };

  useEffect(() => {
    fetchConnections();
  }, [user]);

  return {
    connections,
    loading,
    getParentIdForChild,
    refetch: fetchConnections,
  };
};
