# Bottle Royale 
All 12 games implemented (untested). Not yet built: Settings page, sound, team mode, per-game timers in quiz.
```
npm install && npm run dev      # local
npm run build && npm run preview
```
Cloudflare Pages: push to GitHub, Workers & Pages > Create > Pages > Connect Git; preset Vite, build `npm run build`, output `dist`, branch `main`. No routing is used, so refresh works. LocalStorage is per-browser/device.
