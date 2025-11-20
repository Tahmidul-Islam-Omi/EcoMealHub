import { X } from 'lucide-react';
import './FilterChip.css';

const FilterChip = ({ label, active, onClick, onRemove }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-chip ${active ? 'active' : ''}`}
    >
      <span style={{ textTransform: 'capitalize' }}>{label}</span>
      {active && (
        <X
          className="chip-icon"
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
