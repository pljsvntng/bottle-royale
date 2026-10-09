import { useEffect, useRef, useState } from 'react'
import type { Player } from '../App'
export const randIndex = (n: number) => Math.floor(Math.random() * n)
export default function RandomPick({ players, onPick, disabled }: { players: Player[]; onPick: (i: number) => void; disabled?: boolean }) {
  const [busy, setBusy] = useState(false), [shown, setShown] = useState<number | null>(null), timer = useRef(0), lock = useRef(false)
  useEffect(() => () => clearInterval(timer.current), [])
  if (!players.length) return <p className="text-sm text-[#6B5A73]">Add players first to pick one randomly.</p>
  const go = () => {
    if (lock.current || disabled) return
    lock.current = true; setBusy(true)
    const final = randIndex(players.length), steps = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 14; let k = 0
    timer.current = window.setInterval(() => {
      if (++k >= steps) { clearInterval(timer.current); setShown(final); setBusy(false); lock.current = false; onPick(final) } else setShown(randIndex(players.length))
    }, 90)
  }
  const p = shown !== null ? players[shown] : undefined
  return <div className="flex items-center gap-3 flex-wrap"><button className="btn2" disabled={busy || disabled} onClick={go}>🎲 Pick Random Player</button>
    {p && <span aria-live={busy ? 'off' : 'polite'} className={`flex items-center gap-2 ${busy ? 'opacity-60' : 'text-[#C23B30] font-semibold'}`}>
      <span className="w-7 h-7 rounded-full grid place-items-center text-sm text-white" style={{ background: p.color }}>{p.name[0].toUpperCase()}</span>{p.name}</span>}</div>
}
