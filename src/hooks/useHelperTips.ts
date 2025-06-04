
import { useState, useEffect } from 'react';
import { Helper, GenericTip, SpecificTip } from '@/types/helpers';
import { supabase } from '@/integrations/supabase/client';

export const useHelperTips = (selectedHelper: Helper | null) => {
  const [currentTip, setCurrentTip] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedHelper) {
      fetchRandomTip();
    }
  }, [selectedHelper]);

  const fetchRandomTip = async () => {
    if (!selectedHelper) return;

    try {
      setLoading(true);
      
      // 70% chance for generic tip, 30% chance for specific tip
      const useGenericTip = Math.random() < 0.7;

      if (useGenericTip) {
        // Fetch random generic tip
        const { data: genericTips, error: genericError } = await supabase
          .from('generic_tips')
          .select('*');

        if (genericError) {
          console.error('Error fetching generic tips:', genericError);
          return;
        }

        if (genericTips && genericTips.length > 0) {
          const randomTip = genericTips[Math.floor(Math.random() * genericTips.length)];
          const personalizedTip = randomTip.text_template.replace(/\[HulpjeNaam\]/g, selectedHelper.name);
          setCurrentTip(personalizedTip);
        }
      } else {
        // Fetch random specific tip for the selected helper
        const { data: specificTips, error: specificError } = await supabase
          .from('specific_tips')
          .select('*')
          .eq('helper_id', selectedHelper.id);

        if (specificError) {
          console.error('Error fetching specific tips:', specificError);
          return;
        }

        if (specificTips && specificTips.length > 0) {
          const randomTip = specificTips[Math.floor(Math.random() * specificTips.length)];
          setCurrentTip(randomTip.text);
        } else {
          // Fallback to generic tip if no specific tips found
          const { data: genericTips, error: genericError } = await supabase
            .from('generic_tips')
            .select('*');

          if (!genericError && genericTips && genericTips.length > 0) {
            const randomTip = genericTips[Math.floor(Math.random() * genericTips.length)];
            const personalizedTip = randomTip.text_template.replace(/\[HulpjeNaam\]/g, selectedHelper.name);
            setCurrentTip(personalizedTip);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setLoading(false);
    }
  };

  return { currentTip, loading, refreshTip: fetchRandomTip };
};
