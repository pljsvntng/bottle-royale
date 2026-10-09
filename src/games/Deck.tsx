import RandomPick from './RandomPick'
import { useRef, useState } from 'react'
import type { Player } from '../App'
import { pick } from '../data/prompts'
import { useLS } from './ui'
export default function Deck({ players, cats, storeKey }: { players: Player[]; cats: Record<string, string[]>; storeKey: string }) {
  const [cat, setCat] = useState(Object.keys(cats)[0]), [custom, setCustom] = useLS<string[]>('br.custom.' + storeKey, [])
  const [who, setWho] = useState<Player | null>(null), used = useRef(new Set<string>()), [cur, setCur] = useState(''), [n, setN] = useState(0), [txt, setTxt] = useState('')
  const pool = [...(cats[cat] || []), ...custom]
  const next = () => { setWho(null); setCur(pick(pool, used.current)); setN(n + 1) }
  return <div className="card space-y-3">
    <div className="flex flex-wrap gap-2">{Object.keys(cats).map(c => <button key={c} className={c === cat ? 'btn' : 'btn2'} onClick={() => setCat(c)}>{c}</button>)}</div>
    <p className="text-sm text-[#6B5A73]">Prompt {n} · Turn: <b className="text-[#C23B30]">{(who ?? players[n % players.length]).name}</b></p>
    <RandomPick players={players} onPick={i => setWho(players[i])} />
    <p aria-live="polite" className="text-lg min-h-8">{cur || 'Press Next to begin.'}</p>
    <button className="btn" disabled={!pool.length} onClick={next}>Next</button>
    <div className="flex gap-2"><input aria-label="Custom prompt" className="flex-1 bg-black border border-neutral-700 rounded px-3 py-2" value={txt} onChange={e => setTxt(e.target.value)} placeholder="Add your own prompt" />
      <button className="btn2" onClick={() => { if (txt.trim()) { setCustom([...custom, txt.trim()]); setTxt('') } }}>Add</button></div>
  </div>
}
