// Graphique SVG des ventes cumulées, sans bibliothèque.
// Couleurs portées par des classes CSS (variables de thème), marqueurs et traits distincts
// par courbe pour ne pas dépendre de la couleur seule.

import { HORIZON_WEEKS, SPRINT_WEEKS } from './scenario.js?v=__VERSION__';

export const formatEuro = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;

const LAYOUT = {
  wide: { W: 640, H: 320, LEFT: 78, RIGHT: 34, TOP: 40, BOTTOM: 34 },
  compact: { W: 420, H: 300, LEFT: 84, RIGHT: 18, TOP: 46, BOTTOM: 44 },
};

// Graduation « ronde » au-dessus du maximum : 1, 2, 2,5 ou 5 × une puissance de 10, en quatre pas.
function niceTop(max) {
  const raw = Math.max(max, 1000) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw);
  return step * 4;
}

const toneClass = (s) => (s.team ? ` team-${s.team}` : '');

function mark(s, x, y, title) {
  const tip = `<title>${title}</title>`;
  return s.kind === 1
    ? `<rect class="mark-1${toneClass(s)}" x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" rx="1.5">${tip}</rect>`
    : `<circle class="mark-2${toneClass(s)}" cx="${x}" cy="${y}" r="5">${tip}</circle>`;
}

/**
 * series : [{ kind: 1 | 2, label, values: [cumul de chaque période], team?: 1 à 6 (couleur de l'équipe) }]
 * options :
 *   axis : libellé court de chaque période (« 6 sem. ») ;
 *   names : libellé long de chaque période, pour le survol (« semaines 5 et 6 ») ;
 *   frontier : nombre de Sprints de développement (ligne « Fin du projet » après cette période) ;
 *   compact : mise en page pour téléphone.
 * Renvoie le SVG du graphique.
 */
export function chartSvg(series, { axis, names, frontier, compact = false }) {
  const { W, H, LEFT, RIGHT, TOP, BOTTOM } = compact ? LAYOUT.compact : LAYOUT.wide;
  const n = Math.max(...series.map((s) => s.values.length));
  const top = niceTop(Math.max(...series.flatMap((s) => s.values)));
  const x = (i) => LEFT + (i * (W - LEFT - RIGHT)) / (n - 1);
  const y = (v) => TOP + (H - TOP - BOTTOM) * (1 - v / top);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ventes cumulées sur ${HORIZON_WEEKS} semaines, une courbe par ${series.some((s) => s.team) ? 'équipe' : 'manche'}, avec la fin du projet après ${frontier * SPRINT_WEEKS} semaines">`;

  // Zone d'exploitation et frontière « Fin du projet », sous les courbes.
  if (frontier < n) {
    const xf = (x(frontier - 1) + x(frontier)) / 2;
    svg += `<rect class="ops-zone" x="${xf}" y="${TOP - 6}" width="${W - RIGHT - xf}" height="${H - BOTTOM - TOP + 6}"/>`;
    svg += `<line class="frontier" x1="${xf}" x2="${xf}" y1="4" y2="${H - BOTTOM}"/>`;
    svg += `<text class="frontier-label" x="${xf - 6}" y="16" text-anchor="end">Fin du projet</text>`;
    svg += compact
      ? `<text class="ops-label" x="${xf + 6}" y="16"><tspan>Exploitation,</tspan><tspan x="${xf + 6}" dy="14">plus de développement</tspan></text>`
      : `<text class="ops-label" x="${xf + 8}" y="16">Exploitation, plus de développement</text>`;
  }

  for (let k = 0; k <= 4; k++) {
    const v = (top * k) / 4;
    svg += `<line class="grid" x1="${LEFT}" x2="${W - RIGHT}" y1="${y(v)}" y2="${y(v)}"/>`;
    svg += `<text class="axis" x="${LEFT - 8}" y="${y(v) + 4}" text-anchor="end">${formatEuro(v)}</text>`;
  }
  // Sur téléphone, « 4 sem. » devient « 4 », avec une seule légende « semaines » sous l'axe.
  const weeksOnly = compact && axis.every((label) => /^\+?\d+ sem\.$/.test(label));
  for (let i = 0; i < n; i++) {
    const label = weeksOnly ? axis[i].replace(' sem.', '') : axis[i];
    svg += `<text class="axis" x="${x(i)}" y="${weeksOnly ? H - 24 : H - 12}" text-anchor="middle">${label}</text>`;
  }
  if (weeksOnly) svg += `<text class="axis" x="${(LEFT + W - RIGHT) / 2}" y="${H - 4}" text-anchor="middle">semaines</text>`;
  for (const s of series) {
    const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    svg += `<polyline class="curve curve-${s.kind}${toneClass(s)}" points="${pts}"/>`;
    s.values.forEach((v, i) => { svg += mark(s, x(i), y(v), `${s.label}, ${names[i]} : ${formatEuro(v)}`); });
  }
  return `${svg}</svg>`;
}

/** Légende : trait et marqueur de chaque courbe, puis son libellé. */
export function legendHtml(series) {
  return series.map((s) => {
    const dash = s.kind === 1 ? ' stroke-dasharray="7 5"' : '';
    const m = s.kind === 1
      ? `<rect class="mark-1${toneClass(s)}" x="14.5" y="4.5" width="9" height="9" rx="1.5"/>`
      : `<circle class="mark-2${toneClass(s)}" cx="19" cy="9" r="5"/>`;
    return `<span><svg width="38" height="18" aria-hidden="true"><line class="curve-${s.kind}${toneClass(s)}" x1="2" x2="36" y1="9" y2="9" stroke-width="3"${dash}/>${m}</svg>${s.label}</span>`;
  }).join('');
}
