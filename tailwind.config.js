/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* stormy_teal */
        'st-500': '#006466',
        'st-600': '#00b5b8',
        'st-700': '#0afbff',
        'st-800': '#5cfcff',
        /* dark_teal */
        'dt-400': '#05484d',
        'dt-500': '#065a60',
        /* deep_space_blue */
        'dsb-100': '#07090e',
        'dsb-200': '#0d131c',
        'dsb-300': '#141c29',
        'dsb-400': '#1b2537',
        'dsb-500': '#212f45',
        'dsb-700': '#5a7baf',
        'dsb-800': '#91a7ca',
        'dsb-900': '#c8d3e4',
        /* space_indigo */
        'si-400': '#1f1f33',
        'si-500': '#272640',
        /* midnight_violet */
        'mv-300': '#1d1529',
        'mv-400': '#271b36',
        'mv-500': '#312244',
        'mv-700': '#7f5cad',
        /* royal_violet */
        'rv-500': '#3e1f47',
        'rv-600': '#703880',
        'rv-700': '#a055b4',
        /* deep_purple */
        'dp-400': '#3e143e',
        'dp-500': '#4d194d',
        'dp-600': '#8b2d8b',
        'dp-700': '#c346c3',
      },
      animation: {
        'spin-slow':      'spin 8s linear infinite',
        'spin-medium':    'spin 11s linear infinite',
        'spin-fast':      'spin 5s linear infinite',
        'marquee-fwd':    'marqueeLeft 30s linear infinite',
        'marquee-rev':    'marqueeRight 35s linear infinite',
        'float-badge':    'floatBadge 4s ease-in-out infinite',
        'pulse-glow':     'pulseGlow 3s ease-in-out infinite',
        'scroll-line':    'scrollPulse 1.9s ease-in-out infinite',
        'loader-bar':     'loaderProg 0.85s ease forwards',
        'blob-1':         'blobDrift1 28s ease-in-out infinite',
        'blob-2':         'blobDrift2 22s ease-in-out infinite',
        'blob-3':         'blobDrift3 34s ease-in-out infinite',
      },
      keyframes: {
        marqueeLeft:  { from: { transform: 'translateX(0)' },    to: { transform: 'translateX(-50%)' } },
        marqueeRight: { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        floatBadge:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseGlow:    { '0%,100%': { filter: 'brightness(1)' }, '50%': { filter: 'brightness(1.2) drop-shadow(0 0 18px rgba(0,181,184,0.4))' } },
        scrollPulse:  { '0%,100%': { opacity: '0.25', transform: 'scaleY(0.6)', transformOrigin: 'top' }, '55%': { opacity: '1', transform: 'scaleY(1)' } },
        loaderProg:   { from: { width: '0%' }, to: { width: '100%' } },
        blobDrift1:   { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(40px,-55px) scale(1.06)' }, '66%': { transform: 'translate(-25px,35px) scale(0.94)' } },
        blobDrift2:   { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '40%': { transform: 'translate(-50px,40px) scale(1.08)' }, '70%': { transform: 'translate(30px,-30px) scale(0.96)' } },
        blobDrift3:   { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '25%': { transform: 'translate(35px,50px) scale(1.04)' }, '75%': { transform: 'translate(-40px,-45px) scale(0.97)' } },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00b5b8 0%, #a055b4 100%)',
        'gradient-card':  'linear-gradient(135deg, rgba(14,22,38,0.42), rgba(14,22,38,0.42))',
      },
      backdropBlur: {
        glass: '18px',
      },
      boxShadow: {
        'btn-primary': '0 4px 20px rgba(0,181,184,0.30), 0 2px 8px rgba(160,85,180,0.20)',
        'btn-hover':   '0 8px 36px rgba(0,181,184,0.45), 0 4px 18px rgba(160,85,180,0.35)',
        'avatar':      '0 0 0 2px rgba(0,181,184,0.30), 0 0 0 5px rgba(0,181,184,0.08), 0 8px 28px rgba(0,0,0,0.50)',
        'avatar-hov':  '0 0 0 2px rgba(0,181,184,0.55), 0 0 0 8px rgba(0,181,184,0.12), 0 12px 36px rgba(0,0,0,0.55)',
        'card-hov':    '0 8px 40px rgba(0,181,184,0.12), 0 2px 12px rgba(0,0,0,0.50)',
        'work-hov':    '0 24px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(160,85,180,0.18)',
      },
    },
  },
  plugins: [],
};
