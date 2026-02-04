/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: ['Space Grotesk', 'sans-serif'],
  			body: ['Manrope', 'sans-serif'],
  			mono: ['JetBrains Mono', 'monospace'],
  			// Retain branding tokens but map to new fonts
  			orbitron: ['Rajdhani', 'sans-serif'],
  			syne: ['Syne', 'sans-serif'],
  			rajdhani: ['Rajdhani', 'sans-serif'],
  		},
  		colors: {
  			/* Bespoke Quantum Tokens */
  			q: {
  				void: '#020408',
  				flux: '#00F5FF',
  				entangle: '#BC13FE',
  				rose: '#FF006E',
  				glass: 'rgba(10, 20, 40, 0.4)',
  				titanium: 'rgba(255, 255, 255, 0.05)',
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'quantum-pulse': {
  				'0%, 100%': { transform: 'scale(1)', opacity: '1', filter: 'drop-shadow(0 0 10px rgba(0, 245, 255, 0.5))' },
  				'50%': { transform: 'scale(1.02)', opacity: '0.8', filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.8))' },
  			},
  			'scanline': {
  				'0%': { transform: 'translateY(-100%)' },
  				'100%': { transform: 'translateY(100%)' },
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-10px)' },
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'quantum-pulse': 'quantum-pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			'scanline': 'scanline 8s linear infinite',
  			'float': 'float 6s ease-in-out infinite',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
