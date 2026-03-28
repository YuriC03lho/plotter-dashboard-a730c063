import { useState, useMemo } from "react";
import { Scissors, Package, ShieldCheck, Users, BarChart3, Activity } from "lucide-react";
import {
  getAllRecords,
  getUniqueCollaborators,
  getDateRange,
  filterRecords,
  aggregateByMonth,
} from "@/lib/dataUtils";
import { KpiCard } from "@/components/KpiCard";
import { FilterPanel } from "@/components/FilterPanel";
import { MonthlyCharts } from "@/components/MonthlyCharts";
import { MonthlyTable } from "@/components/MonthlyTable";
import { DailyCharts } from "@/components/DailyCharts";

const Index = () => {
  const collaborators = useMemo(() => getUniqueCollaborators(), []);
  const { min: dateMin, max: dateMax } = useMemo(() => getDateRange(), []);

  const [startDate, setStartDate] = useState(dateMin);
  const [endDate, setEndDate] = useState(dateMax);
  const [selectedCollabs, setSelectedCollabs] = useState<string[]>([]);

  const filtered = useMemo(
    () => filterRecords(startDate, endDate, selectedCollabs.length > 0 ? selectedCollabs : undefined),
    [startDate, endDate, selectedCollabs]
  );

  const monthly = useMemo(() => aggregateByMonth(filtered), [filtered]);

  const totals = useMemo(() => {
    const totalRolos = filtered.reduce((s, r) => s + (r.rolos_cortados || 0), 0);
    const totalEpi = filtered.reduce((s, r) => s + (r.epi || 0), 0);
    const totalKits = filtered.reduce((s, r) => s + (r.kits_embalados || 0), 0);
    const colabs = filtered.filter((r) => r.colaboradores != null);
    const avgColab = colabs.length > 0
      ? Math.round(colabs.reduce((s, r) => s + (r.colaboradores || 0), 0) / colabs.length)
      : 0;
    return { totalRolos, totalEpi, totalKits, avgColab, dias: filtered.length };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Produtividade <span className="text-gradient-primary">Plotter</span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Dashboard de produtividade — tbl_total · {filtered.length} registros
        </p>
      </div>

      {/* Filters */}
      <FilterPanel
        collaborators={collaborators}
        selectedCollabs={selectedCollabs}
        onCollabChange={setSelectedCollabs}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        dateMin={dateMin}
        dateMax={dateMax}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          title="Total Rolos"
          value={totals.totalRolos}
          subtitle={`${totals.dias} dias trabalhados`}
          icon={Scissors}
          color="primary"
        />
        <KpiCard
          title="Total Kits"
          value={totals.totalKits}
          subtitle={`${totals.dias > 0 ? Math.round(totals.totalKits / totals.dias) : 0}/dia em média`}
          icon={Package}
          color="accent"
        />
        <KpiCard
          title="Total EPI"
          value={totals.totalEpi}
          icon={ShieldCheck}
          color="purple"
        />
        <KpiCard
          title="Meses"
          value={monthly.length}
          subtitle={`${dateMin.slice(0, 7)} a ${endDate.slice(0, 7)}`}
          icon={Activity}
          color="primary"
        />
      </div>

      {/* Charts */}
      <div className="mb-6">
        <MonthlyCharts data={monthly} />
      </div>

      {/* Daily Charts */}
      <div className="mb-6">
        <DailyCharts data={filtered} />
      </div>

      {/* Table */}
      <MonthlyTable data={monthly} />
    </div>
  );
};

export default Index;
