export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Sheet {
  id: string;
  name: string;
  user_id?: string;
  type: 'public' | 'custom';
  created_at: string;
}

export interface Problem {
  id: string;
  name: string;
  topic: string;
  level: 'Easy' | 'Medium' | 'Hard';
  platform: string;
  link: string;
  created_at: string;
}

export interface SheetProblem {
  id: string;
  sheet_id: string;
  problem_id: string;
  problem: Problem;
}

export interface Progress {
  id: string;
  user_id: string;
  problem_id: string;
  is_solved: boolean;
  timestamp?: string;
  notes?: string;
}

export interface SheetWithProblems extends Sheet {
  sheet_problems: SheetProblem[];
}

export interface ProblemWithProgress extends Problem {
  progress?: Progress;
}