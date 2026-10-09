import RandomPick from './RandomPick'
import { useRef, useState } from 'react'
import type { Player } from '../App'
import { truths, dares, pick } from '../data/prompts'

export default function TruthOrDare({ players }: { players: Player[] }) {
  const [turn, setTurn] = useState(0), [prompt, setPrompt] = useState<string | null>(null)
  const [stats, setStats] = useState<Record<string, number>>({})
  const ut = useRef(new Set<string>()), ud = useRef(new Set<string>())
  const p = players[turn % players.length]
  const next = (credit: boolean) => { if (credit) setStats(s => ({ ...s, [p.id]: (s[p.id] || 0) + 1 })); setPrompt(null); setTurn(t => t + 1) }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card space-y-3">
        <p>Current player: <b className="text-[#C23B30]">{p.name}</b></p>
        {prompt === null && <RandomPick players={players} onPick={i => setTurn(i)} />}
        {prompt === null ? <div className="flex gap-2">
          <button className="btn" onClick={() => setPrompt('Truth: ' + pick(truths, ut.current))}>Truth</button>
          <button className="btn" onClick={() => setPrompt('Dare: ' + pick(dares, ud.current))}>Dare</button></div>
        : <><p aria-live="polite" className="text-lg">{prompt}</p><div className="flex gap-2">
          <button className="btn" onClick={() => next(true)}>Completed</button><button className="btn2" onClick={() => next(false)}>Skip / Pass</button></div></>}
      </div>
      <div className="card"><h3 className="font-semibold mb-2">Completed rounds</h3>
        {players.map(q => <div key={q.id} className="flex justify-between"><span>{q.name}</span><span>{stats[q.id] || 0}</span></div>)}</div>
    </div>)
}
