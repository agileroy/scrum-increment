// Graphique SVG des ventes cumulées, sans bibliothèque.
// Couleurs portées par des classes CSS (variables de thème), marqueurs et traits distincts
// par courbe pour ne pas dépendre de la couleur seule.

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

function mark(kind, x, y, title) {
  const tip = `<title>${title}</title>`;
  return kind === 1
    ? `<rect class="mark-1" x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" rx="1.5">${tip}</rect>`
    : `<circle class="mark-2" cx="${x}" cy="${y}" r="5">${tip}</circle>`;
}

/**
 * series : [{ kind: 1 | 2, label, values: [cumul de chaque période] }]
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
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ventes cumulées sur 20 semaines, une courbe par manche, avec la fin du projet après ${frontier * 2} semaines">`;

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
  for (let i = 0; i < n; i++) {
    const label = axis[i];
    // Sur téléphone, « +4 sem. » passe sur deux lignes pour ne pas chevaucher ses voisins.
    const m = compact && label.match(/^(\+?\d+) (sem\.)$/);
    svg += m
      ? `<text class="axis" x="${x(i)}" y="${H - 24}" text-anchor="middle"><tspan>${m[1]}</tspan><tspan x="${x(i)}" dy="13">${m[2]}</tspan></text>`
      : `<text class="axis" x="${x(i)}" y="${H - 12}" text-anchor="middle">${label}</text>`;
  }
  for (const s of series) {
    const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    svg += `<polyline class="curve curve-${s.kind}" points="${pts}"/>`;
    s.values.forEach((v, i) => { svg += mark(s.kind, x(i), y(v), `${s.label}, ${names[i]} : ${formatEuro(v)}`); });
  }
  return `${svg}</svg>`;
}

/** Légende : trait et marqueur de chaque courbe, puis son libellé. */
export function legendHtml(series) {
  return series.map((s) => {
    const dash = s.kind === 1 ? ' stroke-dasharray="7 5"' : '';
    const m = s.kind === 1
      ? '<rect class="mark-1" x="14.5" y="4.5" width="9" height="9" rx="1.5"/>'
      : '<circle class="mark-2" cx="19" cy="9" r="5"/>';
    return `<span><svg width="38" height="18" aria-hidden="true"><line class="curve-${s.kind}" x1="2" x2="36" y1="9" y2="9" stroke-width="3"${dash}/>${m}</svg>${s.label}</span>`;
  }).join('');
}
