import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sierra Sunset theme from your current site
        background: '#2a2038',
        card: '#3a3048',
        text: '#f5e6d3',
        muted: '#c9b5a3',
        accent: '#ff7b5f',
      },
    },
  },
  plugins: [],
}
export default config
