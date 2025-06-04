
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DailyPlan, PlanItemProgress } from '@/types/database';

export const useDailyPlan = (childId?: string) => {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [items, setItems] = useState<PlanItemProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyPlan = async () => {
    if (!childId) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch or create today's plan
      let { data: existingPlan } = await supabase
        .from('daily_plans')
        .select('*')
        .eq('child_id', childId)
        .eq('date', today)
        .single();

      if (!existingPlan) {
        // Create a default plan for today
        const { data: newPlan, error: createError } = await supabase
          .from('daily_plans')
          .insert({
            child_id: childId,
            date: today,
            plan_items: []
          })
          .select()
          .single();

        if (createError) throw createError;
        existingPlan = newPlan;

        // Create default plan items
        const defaultItems = [
          {
            plan_id: existingPlan.id,
            item_order: 1,
            module_type: 'rekenen',
            exercise_id: 'tafel-7-mixed',
            title: 'Tafel van 7 oefenen',
            description: 'Door elkaar • 10 minuten'
          },
          {
            plan_id: existingPlan.id,
            item_order: 2,
            module_type: 'lezen',
            exercise_id: 'ruimtereis-story',
            title: 'Lezen: "De Ruimtereis"',
            description: 'Met vragen • 15 minuten'
          },
          {
            plan_id: existingPlan.id,
            item_order: 3,
            module_type: 'engels',
            exercise_id: 'animals-words',
            title: 'Engels: Dieren woordjes',
            description: '10 nieuwe woorden • 8 minuten'
          }
        ];

        const { error: itemsError } = await supabase
          .from('plan_item_progress')
          .insert(defaultItems);

        if (itemsError) throw itemsError;
      }

      setPlan(existingPlan);

      // Fetch plan items
      const { data: planItems, error: itemsError } = await supabase
        .from('plan_item_progress')
        .select('*')
        .eq('plan_id', existingPlan.id)
        .order('item_order');

      if (itemsError) throw itemsError;
      setItems(planItems || []);
    } catch (err) {
      console.error('Error fetching daily plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (itemId: string, status: PlanItemProgress['status']) => {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() };
      
      if (status === 'in_progress') {
        updates.started_at = new Date().toISOString();
      } else if (status === 'completed' || status === 'skipped') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('plan_item_progress')
        .update(updates)
        .eq('id', itemId);

      if (error) throw error;

      // Update local state
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ));
    } catch (err) {
      console.error('Error updating item status:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDailyPlan();
  }, [childId]);

  return {
    plan,
    items,
    loading,
    error,
    updateItemStatus,
    refetch: fetchDailyPlan
  };
};
