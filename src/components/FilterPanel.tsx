import { useState } from "react";
import { Calendar, Filter, Users, X } from "lucide-react";

interface FilterPanelProps {
  collaborators: string[];
  selectedCollabs: string[];
  onCollabChange: (collabs: string[]) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (d: string) => void;
  onEndDateChange: (d: string) => void;
  dateMin: string;
  dateMax: string;
}

export function FilterPanel({
  collaborators,
  selectedCollabs,
  onCollabChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  dateMin,
  dateMax,
}: FilterPanelProps) {
  const [collabOpen, setCollabOpen] = useState(false);

  const toggleCollab = (c: string) => {
    if (selectedCollabs.includes(c)) {
      onCollabChange(selectedCollabs.filter((x) => x !== c));
    } else {
      onCollabChange([...selectedCollabs, c]);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Filtros</span>
        {(selectedCollabs.length > 0 || startDate !== dateMin || endDate !== dateMax) && (
          <button
            onClick={() => {
              onCollabChange([]);
              onStartDateChange(dateMin);
              onEndDateChange(dateMax);
            }}
            className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        {/* Date filters */}
        <div className="flex gap-3 items-end">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
              <Calendar className="w-3 h-3 inline mr-1" />De
            </label>
            <input
              type="date"
              value={startDate}
              min={dateMin}
              max={endDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
              Até
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              max={dateMax}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Collaborator filter */}
        <div className="relative">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
            <Users className="w-3 h-3 inline mr-1" />Colaboradores
          </label>
          <button
            onClick={() => setCollabOpen(!collabOpen)}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground flex items-center gap-2 min-w-[180px] hover:border-primary/50 transition-colors"
          >
            {selectedCollabs.length === 0
              ? "Todos"
              : `${selectedCollabs.length} selecionado(s)`}
          </button>
          {collabOpen && (
            <div className="absolute top-full mt-1 left-0 bg-popover border border-border rounded-lg shadow-xl z-50 p-2 min-w-[200px] max-h-[280px] overflow-y-auto">
              {collaborators.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-secondary cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedCollabs.includes(c)}
                    onChange={() => toggleCollab(c)}
                    className="rounded border-border accent-primary"
                  />
                  <span className="text-foreground">{c}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active filter badges */}
      {selectedCollabs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {selectedCollabs.map((c) => (
            <span
              key={c}
              className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => toggleCollab(c)}
            >
              {c} <X className="w-3 h-3" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
