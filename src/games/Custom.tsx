import { useState } from 'react'
import type { Player } from '../App'
import Deck from './Deck'
import { useLS } from './ui'
type G = { id: string; title: string; prompts: string[] }
export default function Custom({ players }: { players: Player[] }) {
  const [list, setList] = useLS<G[]>('br.customgames', []), [t, setT] = useState(''), [p, setP] = useState(''), [err, setErr] = useState(''), [play, setPlay] = useState<G | null>(null)
  if (play) return <div className="space-y-3"><button className="btn2" onClick={() => setPlay(null)}>Back</button><Deck players={players} cats={{ [play.title]: play.prompts }} storeKey={play.id} /></div>
  const save = () => {
    const prompts = p.split('\n').map(s => s.trim()).filter(Boolean)
    if (!t.trim()) return setErr('Title required.'); if (!prompts.length) return setErr('Add at least one prompt (one per line).')
    setList([...list, { id: crypto.randomUUID(), title: t.trim(), prompts }]); setT(''); setP(''); setErr('')
  }
  return <div className="grid gap-4 md:grid-cols-2"><div className="card space-y-2"><h3 className="font-semibold">Build a game</h3>
    <input aria-label="Game title" className="w-full bg-black border border-neutral-700 rounded px-3 py-2" placeholder="Title" value={t} onChange={e => setT(e.target.value)} />
    <textarea aria-label="Prompts" rows={5} className="w-full bg-black border border-neutral-700 rounded px-3 py-2" placeholder="One prompt per line" value={p} onChange={e => setP(e.target.value)} />
    {err && <p role="alert" className="text-red-400 text-sm">{err}</p>}<button className="btn" onClick={save}>Save game</button></div>
    <div className="card space-y-2"><h3 className="font-semibold">Saved games</h3>{!list.length && <p className="text-neutral-400">None yet.</p>}
      {list.map(g => <div key={g.id} className="flex items-center gap-2"><span className="flex-1">{g.title} ({g.prompts.length})</span><button className="btn" onClick={() => setPlay(g)}>Play</button><button className="btn2" onClick={() => setList(list.filter(x => x.id !== g.id))}>Delete</button></div>)}</div></div>
}
