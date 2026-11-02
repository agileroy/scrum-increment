// Graphique SVG des ventes cumulées, sans bibliothèque.
// Couleurs portées par des classes CSS (variables de thème), marqueurs et traits distincts
// par courbe pour ne pas dépendre de la couleur seule.

export const formatEuro = (n) => `${Math.round(n).toLocaleString('fr-FR')} €`;

const W = 640, H = 300, LEFT = 78, RIGHT = 16, TOP = 14, BOTTOM = 34;

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
 * series : [{ kind: 1 | 2, label, values: [cumul S1…Sn] }]
 * Renvoie le SVG du graphique.
 */
export function chartSvg(series) {
  const n = Math.max(...series.map((s) => s.values.length));
  const top = niceTop(Math.max(...series.flatMap((s) => s.values)));
  const x = (i) => LEFT + (i * (W - LEFT - RIGHT)) / (n - 1);
  const y = (v) => TOP + (H - TOP - BOTTOM) * (1 - v / top);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ventes cumulées par Sprint, une courbe par manche">`;
  for (let k = 0; k <= 4; k++) {
    const v = (top * k) / 4;
    svg += `<line class="grid" x1="${LEFT}" x2="${W - RIGHT}" y1="${y(v)}" y2="${y(v)}"/>`;
    svg += `<text class="axis" x="${LEFT - 8}" y="${y(v) + 4}" text-anchor="end">${formatEuro(v)}</text>`;
  }
  for (let i = 0; i < n; i++) svg += `<text class="axis" x="${x(i)}" y="${H - 10}" text-anchor="middle">S${i + 1}</text>`;
  for (const s of series) {
    const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    svg += `<polyline class="curve curve-${s.kind}" points="${pts}"/>`;
    s.values.forEach((v, i) => { svg += mark(s.kind, x(i), y(v), `${s.label}, Sprint ${i + 1} : ${formatEuro(v)}`); });
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
