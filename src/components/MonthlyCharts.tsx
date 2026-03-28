import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart,
} from "recharts";
import type { MonthlyAgg } from "@/lib/dataUtils";

interface Props {
  data: MonthlyAgg[];
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

export function MonthlyCharts({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Todos os indicadores juntos */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Indicadores Mensais — Rolos, Kits, EPI e Colaboradores
        </h3>
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
            <XAxis dataKey="label" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Bar yAxisId="left" dataKey="totalRolos" name="Rolos Cortados" fill="hsl(200,100%,50%)" radius={[4, 4, 0, 0]} opacity={0.85} />
            <Bar yAxisId="left" dataKey="totalKits" name="Kits Embalados" fill="hsl(160,80%,45%)" radius={[4, 4, 0, 0]} opacity={0.85} />
            <Line yAxisId="left" type="monotone" dataKey="totalEpi" name="EPI" stroke="hsl(280,70%,60%)" strokeWidth={2.5} dot={{ fill: "hsl(280,70%,60%)", r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="avgColaboradores" name="Colaboradores" stroke="hsl(35,95%,55%)" strokeWidth={2.5} dot={{ fill: "hsl(35,95%,55%)", r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Média Diária */}
      {/* Kits Pedidos vs Realizados */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Kits Pedidos vs Kits Embalados
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,18%)" />
            <XAxis dataKey="label" tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="totalKits" name="Kits Embalados" fill="hsl(160,80%,45%)" radius={[4, 4, 0, 0]} opacity={0.8} />
            <Line type="monotone" dataKey="kitsPedidos" name="Kits Pedidos" stroke="hsl(340,75%,55%)" strokeWidth={2.5} dot={{ fill: "hsl(340,75%,55%)", r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
