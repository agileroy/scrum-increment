// Habillage : polices hébergées avec le site, aucune ressource servie par un tiers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../site/${f}`, import.meta.url), 'utf8');

test('Polices hébergées avec le site, avec leur licence', () => {
  const css = read('app.css');
  const urls = [...css.matchAll(/url\("([^"]+)"\)/g)].map((m) => m[1]);
  assert.ok(urls.length >= 2);
  for (const u of urls) {
    assert.ok(!/^(https?:)?\/\//.test(u), `ressource externe : ${u}`);
    assert.ok(existsSync(new URL(`../site/${u}`, import.meta.url)), `fichier manquant : ${u}`);
  }
  for (const f of ['bricolage-grotesque', 'caveat']) assert.ok(existsSync(new URL(`../site/fonts/${f}-LICENSE.txt`, import.meta.url)));
  assert.match(css, /font-display: swap/);
});

test('Accueil : aucune feuille de style, police ni script servis par un tiers', () => {
  const html = read('index.html');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) assert.ok(!/^(https?:)?\/\//.test(m[1]), m[1]);
  assert.ok(!/@import/.test(read('app.css')));
});

test('Devanture sur tous les écrans, écriture manuscrite réservée à Mme Lefèvre', () => {
  const html = read('index.html');
  const css = read('app.css');
  assert.match(html, /<div class="awning" aria-hidden="true">/);
  const hand = [...css.matchAll(/([^{}]+)\{[^}]*font-family: var\(--hand\)/g)].map((m) => m[1].trim());
  assert.ok(hand.length > 0);
  for (const sel of hand) assert.match(sel, /\.speech|\.home-intro strong/, sel);
});
