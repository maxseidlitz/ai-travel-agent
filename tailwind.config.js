/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'inherit',
              fontWeight: '600',
            },
            strong: {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgb(229 231 235)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgb(229 231 235)',
              color: 'inherit',
              overflow: 'auto',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
            },
            blockquote: {
              borderLeftColor: 'rgb(209 213 219)',
              color: 'inherit',
            },
            a: {
              color: 'rgb(37 99 235)',
              textDecoration: 'underline',
            },
            table: {
              fontSize: '0.75rem',
            },
            th: {
              fontWeight: '600',
              backgroundColor: 'rgb(243 244 246)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 