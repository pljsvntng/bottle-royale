import { useState } from 'react'
import type { Player } from '../App'
import { Board } from './ui'
export default function TwoTruths({ players }: { players: Player[] }) {
  const [t, setTurn] = useState(0), [ph, setPh] = useState<'write' | 'vote' | 'reveal'>('write'), [st, setSt] = useState(['', '', '']), [lie, setLie] = useState(-1), [votes, setVotes] = useState<Record<string, number>>({}), [sc, setSc] = useState<Record<string, number>>({})
  const a = players[t % players.length], voters = players.filter(p => p.id !== a.id), cur = voters[Object.keys(votes).length]
  const vote = (i: number) => {
    const v = { ...votes, [cur.id]: i }; setVotes(v)
    if (Object.keys(v).length === voters.length) { const s = { ...sc }; voters.forEach(p => { if (v[p.id] === lie) s[p.id] = (s[p.id] || 0) + 1; else s[a.id] = (s[a.id] || 0) + 1 }); setSc(s); setPh('reveal') }
  }
  const nextTurn = () => { setTurn(t + 1); setPh('write'); setSt(['', '', '']); setLie(-1); setVotes({}) }
  return <div className="grid gap-4 md:grid-cols-2"><div className="card space-y-2"><p>Storyteller: <b className="text-[#c9a24b]">{a.name}</b> (fictional statements are fine)</p>
    {ph === 'write' && <>{st.map((s, i) => <div key={i} className="flex flex-wrap gap-2 items-center"><input aria-label={`Statement ${i + 1}`} className="flex-1 bg-black border border-neutral-700 rounded px-2 py-1" value={s} onChange={e => setSt(st.map((x, j) => j === i ? e.target.value : x))} /><label><input type="radio" name="lie" checked={lie === i} onChange={() => setLie(i)} /> Lie</label></div>)}
      <button className="btn" disabled={st.some(s => !s.trim()) || lie < 0} onClick={() => setPh('vote')}>Hide & start voting</button></>}
    {ph === 'vote' && <><p>{cur.name}: which one is the lie?</p>{st.map((s, i) => <button key={i} className="btn w-full text-left" onClick={() => vote(i)}>{s}</button>)}</>}
    {ph === 'reveal' && <>{st.map((s, i) => <p key={i} className={i === lie ? 'text-[#c9a24b]' : ''}>{i === lie ? 'LIE: ' : 'Truth: '}{s}</p>)}<button className="btn" onClick={nextTurn}>Next storyteller</button></>}</div><Board players={players} scores={sc} /></div>
}
