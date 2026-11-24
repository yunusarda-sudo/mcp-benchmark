/** Tailwind v3 build config for the static GitHub Pages site in docs/. */
module.exports = {
  darkMode: 'class',
  content: ['./docs/index.html', './docs/app.js', './docs/site.js'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#f0fdf4', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857' },
        dark: { 950: '#060910', 900: '#090d16', 850: '#0e1422', 800: '#131b2e', 700: '#1e293b', 600: '#334155' }
      }
    }
  },
  safelist: []
};
