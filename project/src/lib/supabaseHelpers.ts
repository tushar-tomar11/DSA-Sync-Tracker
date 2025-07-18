import { supabase } from './supabase';

// Types
import type { Sheet, Problem, Progress } from '../types';

/**
 * Fetch all public sheets and their problems
 */
export async function fetchPublicSheetsWithProblems(): Promise<{ sheets: Sheet[]; problemsBySheet: Record<string, Problem[]>; error?: string }> {
  try {
    const { data: sheets, error: sheetsError } = await supabase
      .from('sheets')
      .select('*')
      .eq('type', 'public');
    if (sheetsError) throw sheetsError;
    const problemsBySheet: Record<string, Problem[]> = {};
    for (const sheet of sheets || []) {
      const { data: sheetProblems, error: spError } = await supabase
        .from('sheet_problems')
        .select('problem_id, problems(*)')
        .eq('sheet_id', sheet.id);
      if (spError) throw spError;
      problemsBySheet[sheet.id] = (sheetProblems || []).map((sp: any) => sp.problems);
    }
    return { sheets: sheets || [], problemsBySheet };
  } catch (error: any) {
    return { sheets: [], problemsBySheet: {}, error: error.message };
  }
}

/**
 * Fetch a user's custom sheets
 */
export async function fetchUserCustomSheets(userId: string): Promise<{ sheets: Sheet[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('sheets')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'custom');
    if (error) throw error;
    return { sheets: data || [] };
  } catch (error: any) {
    return { sheets: [], error: error.message };
  }
}

/**
 * Mark a problem as solved/unsolved for a user (syncs all matching problems)
 */
export async function markProblemSolved(userId: string, problem: Problem, isSolved: boolean, note?: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Find all problems with same link OR (name + platform)
    const { data: matches, error: matchError } = await supabase
      .from('problems')
      .select('*')
      .or(`link.eq.${problem.link},and(name.eq.${problem.name},platform.eq.${problem.platform})`);
    if (matchError) throw matchError;
    const problemIds = (matches || []).map((p: Problem) => p.id);
    // Upsert progress for all
    for (const pid of problemIds) {
      const { error: upsertError } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          problem_id: pid,
          is_solved: isSolved,
          timestamp: new Date().toISOString(),
          notes: note || null,
        }, { onConflict: ['user_id', 'problem_id'] });
      if (upsertError) throw upsertError;
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get solved status for a problem for a user
 */
export async function getProblemSolvedStatus(userId: string, problemId: string): Promise<{ isSolved: boolean; progress?: Progress; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // Not found is ok
    return { isSolved: !!data?.is_solved, progress: data || undefined };
  } catch (error: any) {
    return { isSolved: false, error: error.message };
  }
}

/**
 * Add a new custom sheet with problems (deduplicates problems)
 */
export async function addCustomSheetWithProblems(userId: string, sheetName: string, problems: Omit<Problem, 'id' | 'created_at'>[]): Promise<{ sheetId?: string; error?: string }> {
  try {
    // Insert sheet
    const { data: sheetData, error: sheetError } = await supabase
      .from('sheets')
      .insert({ name: sheetName, user_id: userId, type: 'custom' })
      .select()
      .single();
    if (sheetError) throw sheetError;
    const sheetId = sheetData.id;
    // For each problem, deduplicate and link
    for (const p of problems) {
      const { problemId, error: matchError } = await matchOrInsertProblem(p);
      if (matchError) throw new Error(matchError);
      const { error: linkError } = await supabase
        .from('sheet_problems')
        .insert({ sheet_id: sheetId, problem_id: problemId });
      if (linkError && linkError.code !== '23505') throw linkError; // Ignore duplicate
    }
    return { sheetId };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Match uploaded problems by name+platform or link, or insert if not found
 */
export async function matchOrInsertProblem(problem: Omit<Problem, 'id' | 'created_at'>): Promise<{ problemId: string; error?: string }> {
  try {
    // Try to find by link
    let { data, error } = await supabase
      .from('problems')
      .select('id')
      .eq('link', problem.link)
      .single();
    if (data) return { problemId: data.id };
    // Try to find by name+platform
    ({ data, error } = await supabase
      .from('problems')
      .select('id')
      .eq('name', problem.name)
      .eq('platform', problem.platform)
      .single());
    if (data) return { problemId: data.id };
    // Insert new problem
    const { data: newData, error: insertError } = await supabase
      .from('problems')
      .insert(problem)
      .select('id')
      .single();
    if (insertError) throw insertError;
    return { problemId: newData.id };
  } catch (error: any) {
    return { problemId: '', error: error.message };
  }
} 