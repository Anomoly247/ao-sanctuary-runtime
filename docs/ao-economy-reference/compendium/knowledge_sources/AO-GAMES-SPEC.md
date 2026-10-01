### Anoms Universe — Streamlined Vision — Code Pack for NotebookLM
Source: anoms_x5f_streamlined_x5f_vision.html + living repo Anomoly247/anom-artsy-rebuild Goal: ONE REPO, ONE COIN. All games feed ONE coin. ONE coin feeds ALL games.
#### Repo Structure (stay in this repo)
```
anom-artsy-rebuild/
├── pages/
│   ├── index.html              # REALM 1 — Identity — LANDING
│   ├── gallery.html
│   ├── about.html
│   ├── kids-corner.html        # REALM 2 — Moonberry Farm
│   ├── tater-clifford.html     # REALM 3 — Security Division
│   ├── sanctuary.html          # REALM 4 — Sanctuary Lab
│   └── store.html
├── app/
│   ├── games-arcade/
│   │   ├── trivia.js           # +15 AO coin
│   │   ├── memory.js           # +20 AO coin
│   │   ├── mood.js             # +10 AO coin
│   │   ├── tycoon.js           # clicker
│   │   └── coin-hunt.js        # Zelda top-down unified
│   ├── ridables/
│   │   ├── rainbow-unicorn.js  # SPEED 500
│   │   ├── cosmic-dragon.js    # FLIGHT 1200 legendary
│   │   ├── dark-pegasus.js     # TANK 800
│   │   ├── light-pegasus.js    # SCOUT 650
│   │   └── white-unicorn.js    # HEALER 950
│   └── backend/
│       ├── coins.js            # ONE COIN economy
│       └── houses.js           # 3 Houses squad-pick

```
#### ONE COIN Economy — Core
```js
// app/backend/coins.js — NotebookLM ingestible
const AO_COIN_KEY = 'ao_coin_balance';
export const Coin = {
  get: () => parseInt(localStorage.getItem(AO_COIN_KEY) || '0', 10),
  add: (n) => {
    const v = Coin.get() + n;
    localStorage.setItem(AO_COIN_KEY, String(v));
    window.dispatchEvent(new CustomEvent('ao-coin-update', {detail: v}));
    return v;
  },
  spend: (n) => {
    if (Coin.get() < n) return false;
    return Coin.add(-n);
  }
};

```
#### 3 Houses — Squad Pick
```js
// app/backend/houses.js
export const HOUSES = {
  ember: { name: 'Ember', color: '#FF2E9A', buff: 'speed' },
  tide: { name: 'Tide', color: '#00F0FF', buff: 'heal' },
  verdant: { name: 'Verdant', color: '#C6FF00', buff: 'tank' }
};
export const pickHouse = (id) => {
  localStorage.setItem('ao_house', id);
  return HOUSES[id];
};

```
#### Games — Wiring
Each game exports play() and calls Coin.add() on win.
##### Trivia +15
```js
// app/games-arcade/trivia.js
import { Coin } from '../backend/coins.js';
export function playTrivia(correct) {
  if (correct) return Coin.add(15);
  return Coin.get();
}

```
##### Memory +20
```js
// app/games-arcade/memory.js
import { Coin } from '../backend/coins.js';
export function winMemory() { return Coin.add(20); }

```
##### Mood +10
```js
// app/games-arcade/mood.js
import { Coin } from '../backend/coins.js';
export function logMood(mood) { 
  // mood: assets/moods/
  return Coin.add(10);
}

```
##### Clicker Tycoon
```js
// app/games-arcade/tycoon.js
import { Coin } from '../backend/coins.js';
let clicks = 0;
export function clickTycoon() {
  clicks++;
  if (clicks % 10 === 0) Coin.add(5);
  return clicks;
}

```
##### Coin-Hunt Zelda Top-Down Unified
```js
// app/games-arcade/coin-hunt.js
import { Coin } from '../backend/coins.js';
export const MAP = ['farm','vault','saloon','sanctuary'];
export function collectCoin(type) {
  // cyan/magenta per vision: do good -> AO coin
  const val = type === 'good' ? 25 : 5;
  return Coin.add(val);
}
export const MOUNTS = {
  'rainbow-unicorn': { speed: 500, type: 'SPEED' },
  'cosmic-dragon': { speed: 1200, type: 'FLIGHT', legendary: true },
  'dark-pegasus': { speed: 800, type: 'TANK' },
  'light-pegasus': { speed: 650, type: 'SCOUT' },
  'white-unicorn': { speed: 950, type: 'HEALER' }
};
export function mount(id) {
  if (Coin.get() < MOUNTS[id].speed) return false;
  Coin.spend(MOUNTS[id].speed);
  localStorage.setItem('ao_mount', id);
  return true;
}

```
#### Landing Page — Wiring (pages/index.html)
```html
<!DOCTYPE html>
<html>
<head><title>Anoms Universe</title></head>
<body>
  <div id="coin">AO: <span id="coin-val">0</span></div>
  <div id="houses">
    <button onclick="pickHouse('ember')">Ember</button>
    <button onclick="pickHouse('tide')">Tide</button>
    <button onclick="pickHouse('verdant')">Verdant</button>
  </div>
  <div id="arcade">
    <button onclick="playTrivia(true)">Trivia +15</button>
    <button onclick="winMemory()">Memory +20</button>
    <button onclick="logMood('happy')">Mood +10</button>
    <button onclick="clickTycoon()">Tycoon Click</button>
    <button onclick="collectCoin('good')">Coin-Hunt Good +25</button>
  </div>
  <div id="mounts"></div>
  <script type="module">
    import { Coin } from '../app/backend/coins.js';
    import { pickHouse } from '../app/backend/houses.js';
    // wiring in landing
    document.getElementById('coin-val').innerText = Coin.get();
    window.addEventListener('ao-coin-update', e => {
      document.getElementById('coin-val').innerText = e.detail;
    });
  </script>
</body>
</html>

```
#### NotebookLM Instructions
Upload this file + /games/*.js as sources. Ask: "Wire landing page to ONE COIN economy with 5 mounts and 3 Houses, games feed coin."
