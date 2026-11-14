/**
 * Couleurs d'accent des véhicules — barre verticale à gauche de chaque card.
 *
 * Attribuées par index pour distinguer les véhicules du garage, pas stockées
 * en base : l'ordre de la liste suffit. Les valeurs sont dupliquées depuis
 * `src/styles/_variables.scss` parce qu'elles sont posées en inline style
 * (custom property `--vehicle-accent`), donc hors de portée du SCSS.
 */
export const VEHICLE_ACCENT_COLORS = [
  '#2B3D2F', // vert atelier
  '#C1502E', // rouille
  '#8A8D91', // chrome
  '#A8763E', // cuir / bois
  '#6E7F6A', // sauge
  '#9C5B3C', // brique claire
] as const;

export function getVehicleColor(index: number): string {
  return VEHICLE_ACCENT_COLORS[index % VEHICLE_ACCENT_COLORS.length];
}
