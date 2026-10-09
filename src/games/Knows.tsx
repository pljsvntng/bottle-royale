import RandomPick from './RandomPick'
import { useMemo, useState } from 'react'
import type { Player } from '../App'
import { WKMB } from '../data/content'
import { Board, shuffle } from './ui'
export default function Knows({ players }: { players: Player[] }) {
  const qs = useMemo(() => shuffle(WKMB), []), [off, setOff] = useState(0), [r, setR] = useState(0), [g, setG] = useState<Record<string, string>>({}), [rev, setRev] = useState(false), [ok, setOk] = useState<Record<string, boolean>>({}), [sc, setSc] = useState<Record<string, number>>({})
  const host = players[(r + off) % players.length], others = players.filter(p => p.id !== host.id)
  const next = () => { const s = { ...sc }; others.forEach(p => { if (ok[p.id]) s[p.id] = (s[p.id] || 0) + 1 }); setSc(s); setG({}); setOk({}); setRev(false); setR(r + 1) }
  return <div className="grid gap-4 md:grid-cols-2"><div className="card space-y-2"><p className="text-sm text-neutral-400">Round {r + 1} · Host: <b className="text-[#c9a24b]">{host.name}</b></p><p className="text-lg">{qs[r % qs.length]}</p>
    {!rev && <RandomPick players={players} onPick={i => { setOff(((i - r) % players.length + players.length) % players.length); setG({}) }} />}
    {others.map(p => <div key={p.id} className="flex flex-wrap items-center gap-2"><label className="w-24 truncate" htmlFor={p.id}>{p.name}</label>
      {rev ? <><span className="flex-1">{g[p.id] || '—'}</span><label><input type="checkbox" checked={!!ok[p.id]} onChange={e => setOk({ ...ok, [p.id]: e.target.checked })} /> Correct</label></>
        : <input id={p.id} type="password" className="flex-1 bg-black border border-neutral-700 rounded px-2 py-1" value={g[p.id] || ''} onChange={e => setG({ ...g, [p.id]: e.target.value })} />}</div>)}
    {rev ? <button className="btn" onClick={next}>Award & next host</button> : <button className="btn" onClick={() => setRev(true)}>Reveal guesses</button>}</div><Board players={players} scores={sc} /></div>
}
