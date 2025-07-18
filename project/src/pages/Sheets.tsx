import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Clock, ExternalLink, Target } from 'lucide-react';
import { useProblems } from '../hooks/useProblems';
import { Sheet, ProblemWithProgress } from '../types';

export const Sheets: React.FC = () => {
  const navigate = useNavigate();
  const { sheets, loading, getSheetProblems, progress } = useProblems();
  const [publicSheets, setPublicSheets] = useState<Sheet[]>([]);
  const [sheetStats, setSheetStats] = useState<Record<string, { total: number; solved: number }>>({});

  useEffect(() => {
    setPublicSheets(sheets.filter(sheet => sheet.type === 'public'));
    loadSheetStats();
  }, [sheets]);

  const loadSheetStats = async () => {
    const stats: Record<string, { total: number; solved: number }> = {};
    
    for (const sheet of sheets.filter(s => s.type === 'public')) {
      const problems = await getSheetProblems(sheet.id);
      const solved = problems.filter(p => p.progress?.is_solved).length;
      stats[sheet.id] = { total: problems.length, solved };
    }
    
    setSheetStats(stats);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getSheetDescription = (name: string) => {
    switch (name) {
      case 'Blind 75':
        return 'Curated list of 75 most important coding interview problems from top tech companies. Perfect for FAANG preparation.';
      case 'Striver Sheet':
        return 'Comprehensive DSA sheet by Striver covering all important topics with structured approach. Great for systematic learning.';
      case 'Love Babbar Sheet':
        return '450 DSA problems curated by Love Babbar, perfect for placement preparation and competitive programming.';
      default:
        return 'A curated collection of DSA problems for interview preparation.';
    }
  };

  const getSheetIcon = (name: string) => {
    switch (name) {
      case 'Blind 75':
        return '🎯';
      case 'Striver Sheet':
        return '🚀';
      case 'Love Babbar Sheet':
        return '💪';
      default:
        return '📚';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Built-in Sheets</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Curated problem sets from top educators and companies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicSheets.map((sheet) => (
          <div
            key={sheet.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/sheet/${sheet.id}`)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getSheetIcon(sheet.name)}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {sheet.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Public Sheet
                    </p>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {getSheetDescription(sheet.name)}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {sheetStats[sheet.id]?.total || 0} problems
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>{sheetStats[sheet.id]?.solved || 0} solved</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Progress
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {sheetStats[sheet.id] ? 
                      Math.round((sheetStats[sheet.id].solved / sheetStats[sheet.id].total) * 100) : 0}% complete
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${sheetStats[sheet.id] ? (sheetStats[sheet.id].solved / sheetStats[sheet.id].total) * 100 : 0}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {publicSheets.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No sheets available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Built-in sheets will appear here once they're loaded into the database.
          </p>
        </div>
      )}
    </div>
  );
};