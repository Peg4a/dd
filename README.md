# Diya's Translator

A clean, responsive translator website that converts text between English and Central Kurdish (Sorani, Arabic script).

## How it works

- The page uses HTML, CSS, and JavaScript (no framework needed).
- You can switch direction: English to Central Kurdish, or Central Kurdish to English.
- When you click Translate, the app uses live translation providers (Google endpoint first, MyMemory fallback).
- This removes fixed dictionary limits and supports general words and sentences while internet is available.
- You can copy the translated result with one click.

## Run locally

Option 1 (quickest):
- Open index.html in your browser.

Option 2 (recommended local server):
- If Python is installed, run:

```powershell
py -m http.server 5500
```

- Then open http://localhost:5500

## Publish options

### Option A: Netlify (drag and drop)
1. Go to Netlify and sign in.
2. Open the Sites dashboard.
3. Drag this project folder into the deploy area.
4. Netlify gives you a live URL immediately.

### Option B: GitHub Pages
1. Create a new GitHub repository.
2. Push all files in this folder to the repository.
3. In repository settings, enable GitHub Pages from the main branch root.
4. Your site will be published on a GitHub Pages URL.

### Option C: Vercel
1. Import the repository into Vercel.
2. Keep default static settings.
3. Deploy and get a public URL.

## Notes

- Translation quality and vocabulary coverage depend on external providers and internet connectivity.
- For production-grade translation quality and higher limits, replace the free endpoint with a paid translation provider API key.
