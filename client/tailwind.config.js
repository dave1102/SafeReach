/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Token system for Overflow AI. Brief specifies blue/green/white,
      // glassmorphism, rounded cards — these are deliberate shades within
      // that brief, not defaults: a deep "trust" blue for structure/nav,
      // a "signal" green for safe/positive actions, a reserved red used
      // ONLY for SOS/danger so it stays meaningful, not decorative.
      colors: {
        trust: {
          50: '#EEF4FF', 100: '#D9E6FF', 200: '#B3CCFF', 300: '#82A9FF',
          400: '#4C7CFF', 500: '#2456EB', 600: '#1D3FCB', 700: '#1A34A0',
          800: '#182C7D', 900: '#152660'
        },
        signal: {
          50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7',
          400: '#34D399', 500: '#0FA968', 600: '#0B8A55', 700: '#0A6E46',
          800: '#0A5738', 900: '#08432C'
        },
        alert: {
          50: '#FEF2F2', 100: '#FEE2E2', 400: '#F87171', 500: '#E23B3B',
          600: '#C42A2A', 700: '#9E1F1F'
        },
        mist: {
          50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1',
          400: '#94A3B8', 500: '#64748B', 700: '#334155', 800: '#1E293B',
          900: '#0B1220'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Manrope', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      backdropBlur: { xs: '2px' },
      borderRadius: { '2.5xl': '1.375rem', '3xl': '1.75rem' },
      boxShadow: {
        glass: '0 8px 32px -8px rgba(21, 38, 96, 0.25)',
        'glass-lg': '0 20px 50px -12px rgba(21, 38, 96, 0.35)'
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        pulseRing: 'pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
        fadeUp: 'fadeUp 0.4s ease-out both'
      }
    }
  },
  plugins: []
}
