import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Sheet, Problem, Progress, ProblemWithProgress } from '../types';
import { markProblemSolved } from '../lib/supabaseHelpers';

export const useProblems = () => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [problems, setProblems] = useState<ProblemWithProgress[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchSheets(), fetchProblems(), fetchProgress()]).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSheets = async () => {
    try {
      const { data, error } = await supabase
        .from('sheets')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${user?.id}`);
      
      if (error) throw error;
      setSheets(data || []);
    } catch (error) {
      console.error('Error fetching sheets:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setProblems(data || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // Smart sync: mark all matching problems as solved/unsolved for this user
  const toggleProblemSolved = async (problem: Problem, isSolved: boolean, note?: string) => {
    if (!user) return;
    // Optimistic update
    setProgress(prev => {
      // Find all matching problems
      const matches = problems.filter(
        p => p.link === problem.link || (p.name === problem.name && p.platform === problem.platform)
      );
      const ids = matches.map(p => p.id);
      let updated = prev.filter(p => !ids.includes(p.problem_id));
      ids.forEach(pid => {
        updated.push({
          id: pid, // not accurate, but for UI
          user_id: user.id,
          problem_id: pid,
          is_solved: isSolved,
          timestamp: new Date().toISOString(),
          notes: note || '',
        });
      });
      return updated;
    });
    // Backend sync
    await markProblemSolved(user.id, problem, isSolved, note);
    await fetchProgress();
  };

  const getProblemsWithProgress = (problemList: Problem[]): ProblemWithProgress[] => {
    return problemList.map(problem => ({
      ...problem,
      progress: progress.find(p => p.problem_id === problem.id)
    }));
  };

  const getSheetProblems = async (sheetId: string): Promise<ProblemWithProgress[]> => {
    try {
      const { data, error } = await supabase
        .from('sheet_problems')
        .select(`
          *,
          problems(*)
        `)
        .eq('sheet_id', sheetId);

      if (error) throw error;

      const sheetProblems = data?.map(sp => sp.problems) || [];
      return getProblemsWithProgress(sheetProblems);
    } catch (error) {
      console.error('Error fetching sheet problems:', error);
      return [];
    }
  };

  return {
    sheets,
    problems: getProblemsWithProgress(problems),
    progress,
    loading,
    toggleProblemSolved,
    getSheetProblems,
    fetchSheets,
    fetchProblems
  };
};