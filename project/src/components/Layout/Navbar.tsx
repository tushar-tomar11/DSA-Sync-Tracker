import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, User, Moon, Sun, LogOut, Settings, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut, userProfile, updateUserProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [leetcode, setLeetcode] = useState(userProfile?.leetcode_username || '');
  const [gfg, setGfg] = useState(userProfile?.gfg_username || '');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  const handleSaveUsernames = async () => {
    setSaving(true);
    await updateUserProfile({ leetcode_username: leetcode, gfg_username: gfg });
    setSaving(false);
  };

  // Mock fetch solved problems from LeetCode/GFG
  const fetchSolvedProblemsFromAccounts = async () => {
    // In real app, call public APIs. Here, mock with random problems from DB.
    const { data: problems, error } = await supabase.from('problems').select('*');
    if (error) return [];
    // Mock: pick 25 random problems as "solved"
    return (problems || []).slice(0, 25).map((p: any) => ({
      id: p.id,
      name: p.name,
      link: p.link,
      platform: p.platform,
    }));
  };

  const handleSyncProgress = async () => {
    setSyncing(true);
    setSyncSummary(null);
    // 1. Fetch solved problems from accounts (mocked)
    const solved = await fetchSolvedProblemsFromAccounts();
    // 2. For each, mark as solved in progress
    let count = 0;
    for (const prob of solved) {
      // Find all problems in DB matching by link or name+platform
      const { data: matches, error } = await supabase
        .from('problems')
        .select('id')
        .or(`link.eq.${prob.link},and(name.eq.${prob.name},platform.eq.${prob.platform})`);
      if (error) continue;
      for (const match of matches || []) {
        await supabase.from('progress').upsert({
          user_id: user?.id,
          problem_id: match.id,
          is_solved: true,
          timestamp: new Date().toISOString(),
          notes: 'Synced from account',
        }, { onConflict: ['user_id', 'problem_id'] });
        count++;
      }
    }
    setSyncSummary(`${count} problems matched and marked as solved from your profile(s).`);
    setSyncing(false);
  };

  // Keep inputs in sync with profile
  React.useEffect(() => {
    setLeetcode(userProfile?.leetcode_username || '');
    setGfg(userProfile?.gfg_username || '');
  }, [userProfile]);

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DSA Tracker
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/sheets"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/sheets')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Built-in Sheets
            </Link>
            <Link
              to="/upload"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/upload')
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Upload Sheet
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block text-sm font-medium">
                  {user?.email?.split('@')[0]}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Member since {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-2 space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">LeetCode Username</label>
                      <input
                        type="text"
                        value={leetcode}
                        onChange={e => setLeetcode(e.target.value)}
                        className="w-full border px-2 py-1 rounded text-sm mb-1"
                        placeholder="LeetCode username"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">GeeksforGeeks Username</label>
                      <input
                        type="text"
                        value={gfg}
                        onChange={e => setGfg(e.target.value)}
                        className="w-full border px-2 py-1 rounded text-sm mb-1"
                        placeholder="GFG username"
                        disabled={saving}
                      />
                    </div>
                    <button
                      onClick={handleSaveUsernames}
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Usernames'}
                    </button>
                    {(leetcode || gfg) && (
                      <button
                        onClick={handleSyncProgress}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                        disabled={syncing}
                      >
                        <RefreshCw className="h-4 w-4 animate-spin" style={{ display: syncing ? 'inline' : 'none' }} />
                        {syncing ? 'Syncing...' : 'Sync My Progress'}
                      </button>
                    )}
                    {syncSummary && (
                      <div className="text-xs text-green-600 mt-2 text-center">{syncSummary}</div>
                    )}
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};