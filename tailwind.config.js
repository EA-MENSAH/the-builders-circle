/** @type {import('tailwindcss').Config} */
// Architectural Prestige — reconstructed from the Stitch design system.
// Light, hairline-minimalist: warm off-white paper, deep navy, architectural gold.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // backgrounds / surfaces
        paper: {
          DEFAULT: '#F8F8F6', // app background (warm off-white)
          0: '#FFFFFF', // card / lowest
          50: '#F9F9F7',
          100: '#F4F4F2',
          200: '#EEEEEC',
          300: '#E8E8E6',
          400: '#E2E3E1',
        },
        // brand navy
        navy: {
          DEFAULT: '#04122E',
          900: '#04122E',
          800: '#0D1B37',
          700: '#1A2744',
          600: '#2A3D6B',
          500: '#3A4665',
          200: '#B9C6EB',
          100: '#D9E2FF',
        },
        // architectural gold
        gold: {
          DEFAULT: '#B8960C',
          700: '#725C00',
          600: '#9A7C0A', // hover
          500: '#B8960C', // primary accent
          400: '#E9C340',
          300: '#FED752', // gold container
          100: '#FDF3C8', // soft gold surface
          50: '#FFF9E6',
        },
        // text (dark on light)
        ink: {
          900: '#1A1A1A', // primary text
          700: '#45464D',
          600: '#555555', // secondary text
          400: '#75777E', // muted / outline
          200: '#C5C6CE', // outline-variant
        },
        line: {
          subtle: 'rgba(0,0,0,0.08)',
          DEFAULT: 'rgba(0,0,0,0.10)',
          strong: 'rgba(0,0,0,0.16)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Stitch type scale
        'label-caps': ['10px', { lineHeight: '12px', letterSpacing: '2.5px', fontWeight: '600' }],
        'stat-label': ['11px', { lineHeight: '14px', letterSpacing: '0.05em', fontWeight: '600' }],
        'body-sm': ['13px', { lineHeight: '20px' }],
        'body-md': ['14px', { lineHeight: '24px' }],
        'headline-sm': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-hero': ['26px', { lineHeight: '32px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-xl': ['34px', { lineHeight: '38px', letterSpacing: '-0.03em', fontWeight: '700' }],
      },
      letterSpacing: {
        caps: '0.18em',
        widest2: '0.25em',
      },
      borderRadius: {
        sm: '0.5rem', // 8px — buttons, inputs, small cards
        DEFAULT: '0.5rem',
        md: '0.75rem', // 12px — featured cards
        lg: '1rem', // 16px — shell
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        shell: '0 4px 24px rgba(0,0,0,0.07)',
        card: '0 1px 2px rgba(0,0,0,0.04), 0 6px 18px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 28px rgba(4,18,46,0.12)',
        gold: '0 0 0 4px rgba(184,150,12,0.12)',
        focus: '0 0 0 3px rgba(184,150,12,0.18)',
        navy: '0 8px 24px rgba(4,18,46,0.18)',
      },
      backgroundImage: {
        'gold-grad': 'linear-gradient(135deg, #FED752 0%, #B8960C 100%)',
        'navy-grad': 'linear-gradient(150deg, #1A2744 0%, #04122E 100%)',
        'paper-grad': 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F6 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
