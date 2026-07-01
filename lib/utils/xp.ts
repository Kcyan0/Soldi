export const LEVELS = [
  { level: 1, title: "SDR Iniciante", xpRequired: 0, xpNext: 500 },
  { level: 2, title: "SDR Júnior", xpRequired: 500, xpNext: 1500 },
  { level: 3, title: "SDR Pleno", xpRequired: 1500, xpNext: 3500 },
  { level: 4, title: "SDR Sênior", xpRequired: 3500, xpNext: 7000 },
  { level: 5, title: "SDR Expert", xpRequired: 7000, xpNext: 12000 },
  { level: 6, title: "Sales Master", xpRequired: 12000, xpNext: 999999 },
];

export function getLevelInfo(xp: number) {
  const current = [...LEVELS].reverse().find((l) => xp >= l.xpRequired) || LEVELS[0];
  const next = LEVELS.find((l) => l.level === current.level + 1);
  const progressXp = xp - current.xpRequired;
  const neededXp = (next?.xpRequired ?? current.xpNext) - current.xpRequired;
  const percentage = Math.min(100, Math.round((progressXp / neededXp) * 100));

  return {
    current,
    next,
    progressXp,
    neededXp,
    percentage,
  };
}

export function getXpForSimulation(score: number): number {
  if (score >= 90) return 150;
  if (score >= 70) return 100;
  if (score >= 50) return 50;
  return 20;
}

export function getXpLabel(score: number): string {
  if (score >= 90) return "+150 XP";
  if (score >= 70) return "+100 XP";
  if (score >= 50) return "+50 XP";
  return "+20 XP";
}

export function getScoreLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 90) return { label: "Excelente", color: "#7DC832" };
  if (score >= 70) return { label: "Bom", color: "#A3E635" };
  if (score >= 50) return { label: "Regular", color: "#F59E0B" };
  return { label: "Precisa Melhorar", color: "#EF4444" };
}
