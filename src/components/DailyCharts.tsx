import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ComposedChart, Line, Legend,
} from "recharts";
import type { ProductivityRecord } from "@/lib/dataUtils";

interface Props {
  data: ProductivityRecord[];
}

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "hsl(220, 18%, 10%)",
    border: "1px solid hsl(220, 14%, 20%)",
    borderRadius: "8px",
    color: "hsl(210, 20%, 92%)",
    fontSize: "12px",
  },
};

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

export function DailyCharts({ data }: Props) {
  const months = useMemo(() => {
    const set = new Set<string>();
    data.forEach((r) => set.add(r.data.slice(0, 7)));
    return Array.from(set).sort();
  }, [data]);

  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1] || "");

  const dailyData = useMemo(() => {
    return data
      .filter((r) => r.data.slice(0, 7) === selectedMonth)
      .sort((a, b) => a.data.localeCompare(b.data))
      .map((r) => ({
        dia: r.data.slice(8, 10) + "/" + r.data.slice(5, 7),
        colaboradores: r.colaboradores || 0,
        rolos: r.rolos_cortados || 0,
        epi: r.epi || 0,
      }));
  }, [data, selectedMonth]);

  const [, mm, yy] = selectedMonth ? [selectedMonth.slice(0, 4), selectedMonth.slice(5, 7), selectedMonth.slice(2, 4)] : ["", "", ""];
  const monthLabel = mm ? `${MONTH_LABELS[mm]} 20${yy}` : "";

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Month selector */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            Detalhamento Diário — {monthLabel}
          </h3>
          <div className="flex gap-1.5 flex-wrap">
            {months.map((m) => {
              const [y, mo] = m.split("-");
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    m === selectedMonth
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {MONTH_LABELS[mo]} {y.slice(2)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rolos + EPI + Colaboradores por dia */}
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
            <XAxis dataKey="dia" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "hsl(210,20%,85%)" }} />
            <Bar yAxisId="left" dataKey="rolos" name="Rolos Cortados" fill="hsl(200,100%,50%)" radius={[3, 3, 0, 0]} opacity={0.85} />
            <Bar yAxisId="left" dataKey="epi" name="EPI" fill="hsl(280,70%,60%)" radius={[3, 3, 0, 0]} opacity={0.85} />
            <Line yAxisId="right" type="monotone" dataKey="colaboradores" name="Colaboradores" stroke="hsl(35,95%,55%)" strokeWidth={2.5} dot={{ fill: "hsl(35,95%,55%)", r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
