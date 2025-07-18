import React, { useState } from 'react';
import { ExternalLink, Check, X, Filter } from 'lucide-react';
import { ProblemWithProgress, Problem } from '../../types';

interface ProblemTableProps {
  problems: ProblemWithProgress[];
  onToggleSolved: (problem: Problem, isSolved: boolean, note?: string) => void;
  showFilters?: boolean;
}

export const ProblemTable: React.FC<ProblemTableProps> = ({ 
  problems, 
  onToggleSolved, 
  showFilters = true 
}) => {
  const [filters, setFilters] = useState({
    topic: '',
    level: '',
    platform: '',
    status: ''
  });
  const [notes, setNotes] = useState<{ [problemId: string]: string }>({});
  const [toast, setToast] = useState<string | null>(null);

  const filteredProblems = problems.filter(problem => {
    return (
      (!filters.topic || problem.topic === filters.topic) &&
      (!filters.level || problem.level === filters.level) &&
      (!filters.platform || problem.platform === filters.platform) &&
      (!filters.status || 
        (filters.status === 'solved' && problem.progress?.is_solved) ||
        (filters.status === 'unsolved' && !problem.progress?.is_solved)
      )
    );
  });

  const uniqueTopics = [...new Set(problems.map(p => p.topic))];
  const uniqueLevels = [...new Set(problems.map(p => p.level))];
  const uniquePlatforms = [...new Set(problems.map(p => p.platform))];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Easy': return 'text-green-600 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleToggle = async (problem: ProblemWithProgress, isSolved: boolean) => {
    const note = notes[problem.id] || '';
    await onToggleSolved(problem, isSolved, note);
    setToast(
      isSolved
        ? `Problem marked as solved and synced across all sheets.`
        : `Problem marked as unsolved and synced across all sheets.`
    );
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">{toast}</div>
      )}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            <select
              value={filters.topic}
              onChange={(e) => setFilters(prev => ({ ...prev, topic: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Topics</option>
              {uniqueTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>

            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Levels</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Platforms</option>
              {uniquePlatforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Topic
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProblems.map((problem) => (
              <tr key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center space-x-2"
                    >
                      <span>{problem.name}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {problem.topic}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${getDifficultyColor(problem.level)}`}>
                    {problem.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white">{problem.platform}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggle(problem, !problem.progress?.is_solved)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      problem.progress?.is_solved
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {problem.progress?.is_solved ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Solved
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Unsolved
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={notes[problem.id] || problem.progress?.notes || ''}
                    onChange={e => setNotes(n => ({ ...n, [problem.id]: e.target.value }))}
                    placeholder="Add note"
                    className="border px-2 py-1 rounded w-full text-xs"
                  />
                  {problem.progress?.timestamp && (
                    <div className="text-xs text-gray-400 mt-1">{new Date(problem.progress.timestamp).toLocaleString()}</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};