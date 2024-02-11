import { Inter, Bricolage_Grotesque } from 'next/font/google';

// Inter is default font, Bricolage is for emphasis

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
