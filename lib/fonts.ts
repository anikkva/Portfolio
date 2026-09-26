import localFont from 'next/font/local'

export const ink = localFont({
  src: [
    { path: '../public/fonts/AnikkvaInk-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/AnikkvaInk-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-ink',
  display: 'swap',
})
