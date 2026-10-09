import RandomPick from './RandomPick'
import { useState } from 'react'
import type { Player } from '../App'
import { QUIZ, type Q } from '../data/content'
import { Board, shuffle } from './ui'
export default function Quiz({ players }: { players: Player[] }) {
  const cats = ['All', ...new Set(QUIZ.map(q => q.c))], [cat, setCat] = useState('All'), [count, setCount] = useState(6)
  const [qs, setQs] = useState<Q[] | null>(null), [first, setFirst] = useState(0), [qi, setQi] = useState(0), [ans, setAns] = useState<number[]>([]), [sc, setSc] = useState<Record<string, number>>({})
  const begin = () => { setQs(shuffle(QUIZ.filter(q => cat === 'All' || q.c === cat)).slice(0, count)); setQi(0); setAns([]); setSc({}) }
  if (!qs) return <div className="card space-y-3"><div className="flex flex-wrap gap-2">{cats.map(c => <button key={c} className={c === cat ? 'btn' : 'btn2'} onClick={() => setCat(c)}>{c}</button>)}</div>
    <label>Questions <select className="bg-black border border-neutral-700 rounded" value={count} onChange={e => setCount(+e.target.value)}>{[2, 4, 6, 12].map(n => <option key={n}>{n}</option>)}</select></label><button className="btn" onClick={begin}>Start</button></div>
  if (qi >= qs.length) return <div className="space-y-3"><Board players={players} scores={sc} /><button className="btn" onClick={() => setQs(null)}>Play again</button></div>
  const q = qs[qi], rev = ans.length >= players.length
  const pick = (o: number) => { const a = [...ans, o]; setAns(a); if (a.length === players.length) { const s = { ...sc }; players.forEach((_, k) => { if (a[k] === q.a) { const pl = players[(first + k) % players.length]; s[pl.id] = (s[pl.id] || 0) + 1 } }); setSc(s) } }
  return <div className="grid gap-4 md:grid-cols-2"><div className="card space-y-2"><p className="text-sm text-[#6B5A73]">{q.c} · {qi + 1}/{qs.length}</p><p className="text-lg">{q.q}</p>
    {!rev && ans.length === 0 && <RandomPick players={players} onPick={setFirst} />}
    {!rev && <p>Answering: <b className="text-[#C23B30]">{players[(first + ans.length) % players.length].name}</b></p>}
    {q.o.map((o, k) => <button key={k} className={rev && k === q.a ? 'btn w-full text-left' : 'btn2 w-full text-left'} disabled={rev} onClick={() => pick(k)}>{o}</button>)}
    {rev && <><p>Correct: {q.o[q.a]}</p><button className="btn" onClick={() => { setQi(qi + 1); setAns([]) }}>{qi + 1 < qs.length ? 'Next' : 'Finish'}</button></>}</div><Board players={players} scores={sc} /></div>
}
