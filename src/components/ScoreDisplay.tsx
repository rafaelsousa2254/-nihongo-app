'use client';

interface ScoreDisplayProps {
  score: number;
  total: number;
  percentage: number;
  onRetry?: () => void;
  onNext?: () => void;
}

export default function ScoreDisplay({ score, total, percentage, onRetry, onNext }: ScoreDisplayProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - percentage / 100);

  const getGrade = () => {
    if (percentage >= 95) return { letter: 'S', color: '#f59e0b', label: 'Perfeito!' };
    if (percentage >= 90) return { letter: 'A', color: '#22c55e', label: 'Excelente!' };
    if (percentage >= 80) return { letter: 'B', color: '#0ea5e9', label: 'Muito Bom!' };
    if (percentage >= 70) return { letter: 'C', color: '#8b5cf6', label: 'Bom' };
    if (percentage >= 60) return { letter: 'D', color: '#f59e0b', label: 'Regular' };
    return { letter: 'F', color: '#ef4444', label: 'Precisa Melhorar' };
  };

  const grade = getGrade();

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={grade.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: grade.color }}>
            {grade.letter}
          </span>
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-white mb-1">{grade.label}</p>
        <p className="text-sm text-slate-400">
          {score} de {total} corretas
        </p>
      </div>

      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            🔄 Tentar Novamente
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
          >
            ➡ Próximo
          </button>
        )}
      </div>
    </div>
  );
}
