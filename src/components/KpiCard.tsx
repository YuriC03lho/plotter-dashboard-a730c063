import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color: "primary" | "accent" | "warm" | "purple";
}

const colorMap = {
  primary: "text-gradient-primary",
  accent: "text-gradient-accent",
  warm: "bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent",
  purple: "bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent",
};

const iconBgMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  warm: "bg-orange-500/10 text-orange-400",
  purple: "bg-violet-500/10 text-violet-400",
};

export function KpiCard({ title, value, subtitle, icon: Icon, color }: KpiCardProps) {
  return (
    <div className="kpi-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconBgMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className={`text-3xl font-bold mono ${colorMap[color]}`}>
        {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
      </div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
