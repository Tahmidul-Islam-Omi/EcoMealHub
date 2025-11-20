import { X } from 'lucide-react';

const FilterChip = ({ label, active, onClick, onRemove }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
          : 'bg-slate-700/60 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-slate-200'
      }`}
    >
      <span className="capitalize">{label}</span>
      {active && (
        <X
          className="w-4 h-4 hover:text-indigo-200 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
};

export default FilterChip;
