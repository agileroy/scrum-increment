// Mode collectif côté interface : courbes par équipe et chargement à la demande.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chartSvg, legendHtml } from '../site/js/chart.js';

const values = Array.from({ length: 10 }, (_, i) => i * 100);
const axis = values.map((_, i) => `${(i + 1) * 2} sem.`);

test('une couleur par équipe, un style par approche', () => {
  const series = [
    { kind: 1, team: 1, label: 'Croissant · projet', values },
    { kind: 2, team: 2, label: 'Baguette · Scrum', values },
    { kind: 1, team: 3, label: 'Brioche · projet', values },
  ];
  const svg = chartSvg(series, { axis, names: axis, frontier: 5 });
  assert.match(svg, /curve curve-1 team-1/);
  assert.match(svg, /curve curve-2 team-2/);
  assert.match(svg, /<rect class="mark-1 team-3"/);
  assert.match(svg, /<circle class="mark-2 team-2"/);
  assert.match(svg, /une courbe par équipe/);
  assert.match(legendHtml(series), /Croissant · projet/);
});

test('sans équipe, le graphique du solo est inchangé', () => {
  const svg = chartSvg([{ kind: 1, label: 'Manche 1', values }], { axis, names: axis, frontier: 5 });
  assert.doesNotMatch(svg, /team-/);
  assert.match(svg, /une courbe par manche/);
});

test('le jeu seul ne charge pas le mode collectif au démarrage', () => {
  const app = readFileSync(new URL('../site/js/app.js', import.meta.url), 'utf8');
  const ui = readFileSync(new URL('../site/js/ui.js', import.meta.url), 'utf8');
  const staticImports = (src) => [...src.matchAll(/^import [^;]+ from '([^']+)'/gm)].map((m) => m[1]);
  for (const src of [app, ui]) {
    assert.ok(staticImports(src).every((p) => !/room-ui|room-store|firebase|memory-db/.test(p)), 'import statique du mode collectif');
  }
  assert.match(app, /import\('\.\/room-ui\.js/);
});
