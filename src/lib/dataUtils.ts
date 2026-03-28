import rawData from "@/data/productivityData.json";

export interface ProductivityRecord {
  data: string;
  colaboradores: number | null;
  rolos_cortados: number | null;
  epi: number | null;
  kits_embalados: number | null;
  kits_pedidos: number | null;
  colaborador_nome: string;
}

export interface MonthlyAgg {
  month: string;
  label: string;
  totalRolos: number;
  totalEpi: number;
  totalKits: number;
  kitsPedidos: number;
  avgColaboradores: number;
  diasTrabalhados: number;
  mediaRolosDia: number;
  mediaKitsDia: number;
  mediaEpiDia: number;
}

const records: ProductivityRecord[] = rawData as ProductivityRecord[];

export function getAllRecords(): ProductivityRecord[] {
  return records;
}

export function getUniqueCollaborators(): string[] {
  const set = new Set<string>();
  records.forEach((r) => {
    if (r.colaborador_nome) {
      r.colaborador_nome.split("/").forEach((c) => {
        const trimmed = c.trim();
        if (trimmed && trimmed !== "-") set.add(trimmed.toUpperCase());
      });
    }
  });
  return Array.from(set).sort();
}

export function getDateRange(): { min: string; max: string } {
  const dates = records.map((r) => r.data).filter(Boolean).sort();
  return { min: dates[0], max: dates[dates.length - 1] };
}

export function filterRecords(
  startDate?: string,
  endDate?: string,
  collaborators?: string[],
  minRolos?: number,
  maxRolos?: number,
  minEpi?: number,
  maxEpi?: number,
  minKits?: number,
  maxKits?: number
): ProductivityRecord[] {
  return records.filter((r) => {
    if (startDate && r.data < startDate) return false;
    if (endDate && r.data > endDate) return false;
    if (collaborators && collaborators.length > 0) {
      const names = (r.colaborador_nome || "").toUpperCase();
      if (!collaborators.some((c) => names.includes(c.toUpperCase()))) return false;
    }
    if (minRolos != null && (r.rolos_cortados == null || r.rolos_cortados < minRolos)) return false;
    if (maxRolos != null && (r.rolos_cortados == null || r.rolos_cortados > maxRolos)) return false;
    if (minEpi != null && (r.epi == null || r.epi < minEpi)) return false;
    if (maxEpi != null && (r.epi == null || r.epi > maxEpi)) return false;
    if (minKits != null && (r.kits_embalados == null || r.kits_embalados < minKits)) return false;
    if (maxKits != null && (r.kits_embalados == null || r.kits_embalados > maxKits)) return false;
    return true;
  });
}

const MONTH_LABELS: Record<string, string> = {
  "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
  "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
};

export function aggregateByMonth(data: ProductivityRecord[]): MonthlyAgg[] {
  const map = new Map<string, ProductivityRecord[]>();

  data.forEach((r) => {
    const key = r.data.slice(0, 7); // YYYY-MM
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  });

  const result: MonthlyAgg[] = [];
  Array.from(map.keys())
    .sort()
    .forEach((key) => {
      const items = map.get(key)!;
      const valid = items.filter(
        (i) => i.rolos_cortados != null || i.epi != null || i.kits_embalados != null
      );
      const totalRolos = valid.reduce((s, i) => s + (i.rolos_cortados || 0), 0);
      const totalEpi = valid.reduce((s, i) => s + (i.epi || 0), 0);
      const totalKits = valid.reduce((s, i) => s + (i.kits_embalados || 0), 0);
      const kitsPedidos = valid.length > 0 ? (valid[0].kits_pedidos || 0) : 0;
      const colabs = valid.filter((i) => i.colaboradores != null);
      const avgColab = colabs.length > 0
        ? colabs.reduce((s, i) => s + (i.colaboradores || 0), 0) / colabs.length
        : 0;

      const [year, month] = key.split("-");
      result.push({
        month: key,
        label: `${MONTH_LABELS[month]} ${year.slice(2)}`,
        totalRolos,
        totalEpi,
        totalKits,
        kitsPedidos,
        avgColaboradores: Math.round(avgColab),
        diasTrabalhados: valid.length,
        mediaRolosDia: valid.length > 0 ? Math.round(totalRolos / valid.length) : 0,
        mediaKitsDia: valid.length > 0 ? Math.round(totalKits / valid.length) : 0,
        mediaEpiDia: valid.length > 0 ? Math.round(totalEpi / valid.length) : 0,
      });
    });

  return result;
}
