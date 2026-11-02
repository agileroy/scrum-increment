// Point d'entrée du jeu « Fournée ».
// Le jeu seul ne charge rien d'externe : le mode collectif (room-ui.js, la base et le QR code)
// n'est chargé qu'à la création d'une partie, à l'arrivée dans une salle, ou avec ?salle= dans l'adresse.
import { init } from './ui.js?v=__VERSION__';
import { normalizeCode } from './room-core.js?v=__VERSION__';

init();

const $ = (id) => document.getElementById(id);
let roomMode = null;
function loadRoomMode() {
  roomMode ??= import('./room-ui.js?v=__VERSION__').then((m) => m.startRoomMode());
  return roomMode;
}

try { $('name-input').value = localStorage.getItem('scrum-increment.name') ?? ''; } catch { /* stockage indisponible */ }
$('code-input').addEventListener('input', () => { $('code-input').value = normalizeCode($('code-input').value); });

$('create-room').addEventListener('click', async () => {
  $('create-room').disabled = true;
  try { await (await loadRoomMode()).create(); } finally { $('create-room').disabled = false; }
});

$('join-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  $('join-submit').disabled = true;
  try { await (await loadRoomMode()).join(); } finally { $('join-submit').disabled = false; }
});

if (new URLSearchParams(location.search).has('salle')) loadRoomMode();
