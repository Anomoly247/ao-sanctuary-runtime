# The ONE COIN Contribution Economy
## Code Architecture (`app/backend/coins.js`)
All arcade games feed into a single `localStorage` balance (`ao_coin_balance`) and dispatch `ao-coin-update` events to sync UI metrics across the site in real time.

## Game Reward Payouts
- **Trivia (`trivia.js`):** +15 AO Coins for correct answers
- **Memory (`memory.js`):** +20 AO Coins for winning matches
- **Mood Logger (`mood.js`):** +10 AO Coins for daily logs
- **Clicker Tycoon (`tycoon.js`):** +5 AO Coins per 10 clicks
- **Coin-Hunt Explorer (`coin-hunt.js`):** +25 AO Coins for "good" actions, +5 for standard pickups

## Squad Pick (`app/backend/houses.js`)
- **Ember Squad (`#FF2E9A`):** Speed Buff
- **Tide Squad (`#00F0FF`):** Heal Buff
- **Verdant Squad (`#C6FF00`):** Tank Buff
