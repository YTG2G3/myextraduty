import { Bricolage_Grotesque, Inter } from 'next/font/google';

// Inter is default font, Bricolage is for emphasis
// Use `font-sans` and `font-grotesque` in Tailwind CSS (see tailwind.config.ts)

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage-grotesque',
  display: 'swap',
  adjustFontFallback: false
});
