import s from './IosChrome.module.css'

const A = '/play/pragmatica/ios'

/** iPhone status bar as drawn in the Figma frames (393 px wide). `dark` is for light screens. */
export function StatusBar({ time, dark = false }: { time: string; dark?: boolean }) {
  return (
    <div className={dark ? `${s.statusBar} ${s.dark}` : s.statusBar} aria-hidden="true">
      <span className={s.time}>{time}</span>
      <span className={s.island} />
      <span className={s.levels}>
        {/* eslint-disable @next/next/no-img-element -- static design assets exported from Figma */}
        <img src={`${A}/status-cellular.svg`} alt="" width={19.2} height={12.226} />
        <img src={`${A}/status-wifi.svg`} alt="" width={17.142} height={12.328} />
        <img src={`${A}/status-battery.svg`} alt="" width={27.328} height={13} />
        {/* eslint-enable @next/next/no-img-element */}
      </span>
    </div>
  )
}

export function HomeIndicator({ dark = false }: { dark?: boolean }) {
  return <span className={dark ? `${s.homeIndicator} ${s.dark}` : s.homeIndicator} aria-hidden="true" />
}
