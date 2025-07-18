import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { addCustomSheetWithProblems } from '../lib/supabaseHelpers';
import { useAuth } from '../contexts/AuthContext';

interface ParsedProblem {
  name: string;
  topic: string;
  level: string;
  platform: string;
  link: string;
  checklist?: string;
}

const Upload: React.FC = () => {
  const [parsedProblems, setParsedProblems] = useState<ParsedProblem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sheetName, setSheetName] = useState('');
  const { user } = useAuth();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    setParsedProblems([]);
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      // Map and clean data
      const problems: ParsedProblem[] = json.map((row) => ({
        name: row['Problem Name'] || row['Name'] || '',
        topic: row['Topic'] || '',
        level: row['Level'] || '',
        platform: row['Platform'] || '',
        link: row['Problem Link'] || row['Link'] || '',
        checklist: row['Checklist'] || '',
      })).filter(p => p.name && p.link && p.platform);
      setParsedProblems(problems);
    } catch (err: any) {
      setError('Failed to parse file. Please check the format.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSheet = async () => {
    setError(null);
    setSuccess(null);
    if (!user) {
      setError('You must be logged in to upload a sheet.');
      return;
    }
    if (!sheetName.trim()) {
      setError('Please enter a sheet name.');
      return;
    }
    if (parsedProblems.length === 0) {
      setError('No problems to save.');
      return;
    }
    setLoading(true);
    try {
      // Prepare problems for helper (omit id/created_at)
      const problems = parsedProblems.map(({ name, topic, level, platform, link }) => ({ name, topic, level, platform, link }));
      const { sheetId, error: saveError } = await addCustomSheetWithProblems(user.id, sheetName.trim(), problems);
      if (saveError) throw new Error(saveError);
      setSuccess('Sheet uploaded successfully!');
      setParsedProblems([]);
      setSheetName('');
    } catch (err: any) {
      setError(err.message || 'Failed to save sheet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Upload DSA Sheet</h1>
      <input
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFile}
        className="mb-4"
        disabled={loading}
      />
      {parsedProblems.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Sheet Name</label>
          <input
            type="text"
            value={sheetName}
            onChange={e => setSheetName(e.target.value)}
            className="border px-2 py-1 rounded w-full mb-2"
            placeholder="Enter a name for your sheet"
            disabled={loading}
          />
          <button
            onClick={handleSaveSheet}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Sheet'}
          </button>
        </div>
      )}
      {loading && <div>Processing...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {parsedProblems.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Parsed Problems</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Topic</th>
                  <th className="border px-2 py-1">Level</th>
                  <th className="border px-2 py-1">Platform</th>
                  <th className="border px-2 py-1">Link</th>
                  <th className="border px-2 py-1">Checklist</th>
                </tr>
              </thead>
              <tbody>
                {parsedProblems.map((p, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{p.name}</td>
                    <td className="border px-2 py-1">{p.topic}</td>
                    <td className="border px-2 py-1">{p.level}</td>
                    <td className="border px-2 py-1">{p.platform}</td>
                    <td className="border px-2 py-1"><a href={p.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Link</a></td>
                    <td className="border px-2 py-1">{p.checklist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload; 