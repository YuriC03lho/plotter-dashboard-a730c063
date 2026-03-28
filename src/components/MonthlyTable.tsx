import type { MonthlyAgg } from "@/lib/dataUtils";

interface Props {
  data: MonthlyAgg[];
}

export function MonthlyTable({ data }: Props) {
  const totals = data.reduce(
    (acc, m) => ({
      rolos: acc.rolos + m.totalRolos,
      epi: acc.epi + m.totalEpi,
      kits: acc.kits + m.totalKits,
      dias: acc.dias + m.diasTrabalhados,
    }),
    { rolos: 0, epi: 0, kits: 0, dias: 0 }
  );

  return (
    <div className="glass-card rounded-xl p-5 overflow-x-auto">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Resumo Mensal Detalhado
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Mês", "Dias", "Colab. Médio", "Rolos", "EPI", "Kits", "Rolos/dia", "Kits/dia"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left text-[10px] uppercase tracking-wider text-muted-foreground py-2 px-3"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr
              key={m.month}
              className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
            >
              <td className="py-2 px-3 font-medium text-foreground">{m.label}</td>
              <td className="py-2 px-3 mono text-muted-foreground">{m.diasTrabalhados}</td>
              <td className="py-2 px-3 mono text-muted-foreground">{m.avgColaboradores}</td>
              <td className="py-2 px-3 mono text-primary font-medium">
                {m.totalRolos.toLocaleString("pt-BR")}
              </td>
              <td className="py-2 px-3 mono text-violet-400 font-medium">
                {m.totalEpi.toLocaleString("pt-BR")}
              </td>
              <td className="py-2 px-3 mono text-accent font-medium">
                {m.totalKits.toLocaleString("pt-BR")}
              </td>
              <td className="py-2 px-3 mono text-muted-foreground">{m.mediaRolosDia}</td>
              <td className="py-2 px-3 mono text-muted-foreground">{m.mediaKitsDia}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-primary/30">
            <td className="py-2 px-3 font-bold text-foreground">Total</td>
            <td className="py-2 px-3 mono font-bold text-foreground">{totals.dias}</td>
            <td className="py-2 px-3">—</td>
            <td className="py-2 px-3 mono font-bold text-primary">
              {totals.rolos.toLocaleString("pt-BR")}
            </td>
            <td className="py-2 px-3 mono font-bold text-violet-400">
              {totals.epi.toLocaleString("pt-BR")}
            </td>
            <td className="py-2 px-3 mono font-bold text-accent">
              {totals.kits.toLocaleString("pt-BR")}
            </td>
            <td className="py-2 px-3 mono text-muted-foreground">
              {totals.dias > 0 ? Math.round(totals.rolos / totals.dias) : 0}
            </td>
            <td className="py-2 px-3 mono text-muted-foreground">
              {totals.dias > 0 ? Math.round(totals.kits / totals.dias) : 0}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
