import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProblems } from '../hooks/useProblems';
import { ProblemTable } from '../components/Problems/ProblemTable';
import { ProgressBar } from '../components/Dashboard/ProgressBar';

const SheetView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSheetProblems, sheets, toggleProblemSolved } = useProblems();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getSheetProblems(id).then(probs => {
        setProblems(probs);
        setLoading(false);
      });
    }
  }, [id, getSheetProblems]);

  const sheet = sheets.find(s => s.id === id);
  const solved = problems.filter((p: any) => p.progress?.is_solved).length;

  if (loading) return <div className="p-8">Loading...</div>;
  if (!sheet) return <div className="p-8">Sheet not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">{sheet.name}</h1>
      <ProgressBar
        label="Progress"
        current={solved}
        total={problems.length}
        color="bg-blue-500"
      />
      <div className="mb-4 text-sm text-gray-500">{solved} of {problems.length} problems solved</div>
      <ProblemTable problems={problems} onToggleSolved={toggleProblemSolved} />
    </div>
  );
};

export default SheetView; 