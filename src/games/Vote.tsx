import RandomPick from './RandomPick'
import { useMemo, useState } from 'react'
import type { Player } from '../App'
import { MLT, WYR } from '../data/content'
import { shuffle } from './ui'
export default function Vote({ players, kind }: { players: Player[]; kind: 'mlt' | 'wyr' }) {
  const qs = useMemo<string[][]>(() => shuffle(kind === 'mlt' ? MLT.map(q => [q]) : WYR.map(q => [...q])), [kind])
  const [first, setFirst] = useState(0), [qi, setQi] = useState(0), [votes, setVotes] = useState<(number | null)[]>([])
  const q = qs[qi % qs.length], opts = kind === 'mlt' ? players.map(p => p.name) : q
  const done = votes.length >= players.length
  const counts = opts.map((_, i) => votes.filter(v => v === i).length), total = counts.reduce((a, b) => a + b, 0), max = Math.max(...counts)
  const winners = opts.filter((_, i) => max > 0 && counts[i] === max)
  return <div className="card space-y-3"><p className="text-lg">{kind === 'mlt' ? q[0] : 'Would you rather…'}</p>
    {!done ? <>{votes.length === 0 && <RandomPick players={players} onPick={setFirst} />}<p>Pass the device to <b className="text-[#C23B30]">{players[(first + votes.length) % players.length].name}</b> ({votes.length}/{players.length} voted)</p>
      <div className="grid gap-2 sm:grid-cols-2">{opts.map((o, i) => <button key={i} className="btn" onClick={() => setVotes([...votes, i])}>{o}</button>)}</div>
      <button className="btn2" onClick={() => setVotes([...votes, null])}>Pass</button></>
      : <><div className="space-y-1">{opts.map((o, i) => <div key={i} className="flex justify-between"><span>{o}</span><span>{counts[i]} · {total ? Math.round(counts[i] / total * 100) : 0}%</span></div>)}</div>
        <p className="text-[#C23B30]">{!winners.length ? 'No votes.' : winners.length > 1 ? `Tie: ${winners.join(' & ')}` : `Winner: ${winners[0]}`}</p>
        <button className="btn" onClick={() => { setVotes([]); setQi(qi + 1) }}>Next question</button></>}</div>
}
