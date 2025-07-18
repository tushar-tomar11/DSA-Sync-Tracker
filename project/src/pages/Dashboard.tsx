import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, CheckCircle, Clock, Target, Flame, Filter, Search, Download } from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { ProgressBar } from '../components/Dashboard/ProgressBar';
import { ProblemTable } from '../components/Problems/ProblemTable';
import { useProblems } from '../hooks/useProblems';
import { ProblemWithProgress, Sheet } from '../types';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { problems, progress, loading, toggleProblemSolved, getSheetProblems, sheets } = useProblems();
  const [nextProblems, setNextProblems] = useState<ProblemWithProgress[]>([]);
  const [filters, setFilters] = useState({
    platform: '',
    level: '',
    status: '',
    topic: '',
    search: '',
  });
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (problems.length > 0) {
      const unsolved = problems.filter(p => !p.progress?.is_solved).slice(0, 5);
      setNextProblems(unsolved);
    }
  }, [problems]);

  // Streak calculation (optional, simple version: consecutive days with solved problems)
  const streak = useMemo(() => {
    const solvedTimestamps = progress
      .filter(p => p.is_solved && p.timestamp)
      .map(p => new Date(p.timestamp!))
      .sort((a, b) => b.getTime() - a.getTime());
    if (solvedTimestamps.length === 0) return 0;
    let streak = 1;
    let prev = solvedTimestamps[0];
    for (let i = 1; i < solvedTimestamps.length; i++) {
      const diff = (prev.getTime() - solvedTimestamps[i].getTime()) / (1000 * 60 * 60 * 24);
      if (diff >= 1 && diff < 2) {
        streak++;
        prev = solvedTimestamps[i];
      } else if (diff >= 2) {
        break;
      }
    }
    return streak;
  }, [progress]);

  // Filtered problems for ProblemTable
  const filteredProblems = useMemo(() => {
    return problems.filter(p =>
      (!filters.platform || p.platform === filters.platform) &&
      (!filters.level || p.level === filters.level) &&
      (!filters.status || (filters.status === 'solved' ? p.progress?.is_solved : !p.progress?.is_solved)) &&
      (!filters.topic || p.topic === filters.topic) &&
      (!filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }, [problems, filters]);

  // Per-sheet stats
  const sheetStats = useMemo(() => {
    return sheets.map(sheet => {
      const sheetProblems = problems.filter(p => {
        // For public sheets, match by sheet id in sheet_problems (not available here, so fallback to all problems for now)
        // For custom sheets, user_id matches
        // In a real app, fetch sheet_problems for exact mapping
        return true; // TODO: refine if needed
      });
      const total = sheetProblems.length;
      const solved = sheetProblems.filter(p => p.progress?.is_solved).length;
      return {
        sheet,
        total,
        solved,
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    });
  }, [sheets, problems]);

  // Export to CSV logic
  const handleExportCSV = async () => {
    if (!user) return;
    setExporting(true);
    try {
      // Fetch all progress for user, join with problems
      const { data, error } = await supabase
        .from('progress')
        .select('*, problems(name, link, platform)')
        .eq('user_id', user.id);
      if (error) throw error;
      const rows = (data || []).map((row: any) => ({
        'Problem Name': row.problems?.name || '',
        'Link': row.problems?.link || '',
        'Platform': row.problems?.platform || '',
        'Status': row.is_solved ? 'Solved' : 'In Progress',
        'Timestamp': row.timestamp ? new Date(row.timestamp).toLocaleString() : '',
        'Notes': row.notes || '',
      }));
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dsa-progress-${user.email?.split('@')[0] || 'user'}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export CSV.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalProblems = problems.length;
  const solvedProblems = progress.filter(p => p.is_solved).length;
  const remainingProblems = totalProblems - solvedProblems;

  const easyProblems = problems.filter(p => p.level === 'Easy');
  const mediumProblems = problems.filter(p => p.level === 'Medium');
  const hardProblems = problems.filter(p => p.level === 'Hard');

  const solvedEasy = easyProblems.filter(p => p.progress?.is_solved).length;
  const solvedMedium = mediumProblems.filter(p => p.progress?.is_solved).length;
  const solvedHard = hardProblems.filter(p => p.progress?.is_solved).length;

  // Unique filter values
  const uniquePlatforms = [...new Set(problems.map(p => p.platform))];
  const uniqueLevels = [...new Set(problems.map(p => p.level))];
  const uniqueTopics = [...new Set(problems.map(p => p.topic))];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your DSA progress across all platforms
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
          {exporting ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard
          title="Total Problems"
          value={totalProblems}
          icon={Target}
          color="bg-blue-500"
        />
        <StatsCard
          title="Solved"
          value={solvedProblems}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatsCard
          title="Remaining"
          value={remainingProblems}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Success Rate"
          value={`${totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0}%`}
          icon={BarChart3}
          color="bg-purple-500"
        />
        <StatsCard
          title="Streak"
          value={streak}
          icon={Flame}
          color="bg-orange-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filters.platform}
            onChange={e => setFilters(f => ({ ...f, platform: e.target.value }))}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">All Platforms</option>
            {uniquePlatforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={filters.level}
            onChange={e => setFilters(f => ({ ...f, level: e.target.value }))}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">All Levels</option>
            {uniqueLevels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">All Status</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
          <select
            value={filters.topic}
            onChange={e => setFilters(f => ({ ...f, topic: e.target.value }))}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">All Topics</option>
            {uniqueTopics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center ml-auto">
          <Search className="h-4 w-4 text-gray-400 mr-1" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            placeholder="Search by name"
            className="border px-2 py-1 rounded text-sm"
          />
        </div>
      </div>

      {/* Per Sheet Progress */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Sheet Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sheetStats.map(({ sheet, total, solved, percent }) => (
            <div key={sheet.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{sheet.name}</span>
                <button
                  onClick={() => navigate(`/sheet/${sheet.id}`)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View →
                </button>
              </div>
              <ProgressBar
                label="Progress"
                current={solved}
                total={total}
                color="bg-blue-500"
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {solved} of {total} problems solved ({percent}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Solving Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Continue Solving
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Next problems to tackle in your DSA journey
        </p>
        <ProblemTable
          problems={filteredProblems.slice(0, 20)}
          onToggleSolved={toggleProblemSolved}
          showFilters={false}
        />
      </div>
    </div>
  );
};