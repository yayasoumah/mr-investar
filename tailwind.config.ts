import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Primary Colors
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				hover: 'hsl(var(--primary-hover))',
  				light: 'hsl(var(--primary-light))',
  				lighter: 'hsl(var(--primary-lighter))',
  			},
  			// Secondary Colors
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				hover: 'hsl(var(--secondary-hover))',
  				light: 'hsl(var(--secondary-light))',
  				lighter: 'hsl(var(--secondary-lighter))',
  			},
  			// Grey Scale
  			grey: {
  				100: 'hsl(var(--grey-100))',
  				200: 'hsl(var(--grey-200))',
  				300: 'hsl(var(--grey-300))',
  				400: 'hsl(var(--grey-400))',
  				500: 'hsl(var(--grey-500))',
  				600: 'hsl(var(--grey-600))',
  			},
  			// Semantic Colors
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				light: 'hsl(var(--success-light))',
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				light: 'hsl(var(--warning-light))',
  			},
  			error: {
  				DEFAULT: 'hsl(var(--error))',
  				light: 'hsl(var(--error-light))',
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				light: 'hsl(var(--info-light))',
  			},
  			// Base Colors
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  		},
  		borderRadius: {
  			'xs': 'var(--radius-xs)',
  			'sm': 'var(--radius-sm)',
  			'md': 'var(--radius-md)',
  			'lg': 'var(--radius-lg)',
  			'xl': 'var(--radius-xl)',
  			'2xl': 'var(--radius-2xl)',
  		},
  		fontFamily: {
  			sans: ['var(--font-geist-sans)'],
  			mono: ['var(--font-geist-mono)'],
  		},
  		fontSize: {
  			'xs': '12px',
  			'sm': '14px',
  			'base': '16px',
  			'lg': '18px',
  			'xl': '20px',
  			'2xl': '24px',
  			'3xl': '30px',
  			'4xl': '36px',
  			'5xl': '48px',
  		},
  		fontWeight: {
  			regular: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '700',
  		},
  		lineHeight: {
  			tight: '1.25',
  			base: '1.5',
  			relaxed: '1.75',
  		},
  		spacing: {
  			'0': '0px',
  			'1': '4px',
  			'2': '8px',
  			'3': '12px',
  			'4': '16px',
  			'5': '20px',
  			'6': '24px',
  			'8': '32px',
  			'10': '40px',
  			'12': '48px',
  			'16': '64px',
  			'20': '80px',
  			'24': '96px',
  		},
  		boxShadow: {
  			'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  			DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  			'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  			'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  			'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  		},
  		maxWidth: {
  			'sm': '640px',
  			'md': '768px',
  			'lg': '1024px',
  			'xl': '1280px',
  			'2xl': '1536px',
  		},
  		zIndex: {
  			'base': '0',
  			'header': '100',
  			'dropdown': '200',
  			'modal': '300',
  			'tooltip': '400',
  			'toast': '500',
  		},
  	}
  },
  plugins: [
    animate,
    typography,
  ],
} satisfies Config;
