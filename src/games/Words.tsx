import RandomPick from './RandomPick'
import { useEffect, useState } from 'react'
import type { Player } from '../App'
import { WORDS } from '../data/content'
import { Board, shuffle } from './ui'
export default function Words({ players, mode }: { players: Player[]; mode: 'charades' | 'guess' }) {
  const [cat, setCat] = useState('Animals'), [dur, setDur] = useState(60), [ph, setPh] = useState<'idle' | 'play' | 'end'>('idle'), [run, setRun] = useState(false), [t, setT] = useState(60)
  const [list, setList] = useState<string[]>([]), [i, setI] = useState(0), [show, setShow] = useState(false), [hint, setHint] = useState(false), [log, setLog] = useState<[string, boolean][]>([]), [turn, setTurn] = useState(0), [sc, setSc] = useState<Record<string, number>>({})
  useEffect(() => { if (!run) return; const id = setInterval(() => setT(x => x - 1), 1000); return () => clearInterval(id) }, [run])
  useEffect(() => { if (ph === 'play' && t <= 0) { setRun(false); setPh('end'); setShow(false) } }, [t, ph])
  const p = players[turn % players.length], w = list[i % (list.length || 1)] || ''
  const start = () => { setList(shuffle(WORDS[cat])); setI(0); setLog([]); setT(dur); setShow(false); setHint(false); setPh('play'); setRun(true) }
  const reset = () => { setRun(false); setPh('idle'); setShow(false) }
  const mark = (ok: boolean) => { setLog([...log, [w, ok]]); if (ok) setSc({ ...sc, [p.id]: (sc[p.id] || 0) + 1 }); setI(i + 1); setShow(false); setHint(false) }
  return <div className="grid gap-4 md:grid-cols-2"><div className="card space-y-3"><p>{mode === 'charades' ? 'Act it out — no talking!' : 'Describe it without saying the word.'} Player: <b className="text-[#c9a24b]">{p.name}</b></p>
    {ph === 'idle' && <><RandomPick players={players} onPick={setTurn} /><div className="flex flex-wrap gap-2">{Object.keys(WORDS).map(c => <button key={c} className={c === cat ? 'btn' : 'btn2'} onClick={() => setCat(c)}>{c}</button>)}</div>
      <label>Seconds <select className="bg-black border border-neutral-700 rounded" value={dur} onChange={e => setDur(+e.target.value)}>{[30, 60, 90].map(s => <option key={s}>{s}</option>)}</select></label><button className="btn w-full" onClick={start}>Start</button></>}
    {ph === 'play' && <><p className="text-3xl font-bold" role="timer">{t}s</p><p className="text-2xl min-h-9">{show ? w : '••••••'}</p>
      <div className="flex flex-wrap gap-2"><button className="btn2" onClick={() => setShow(!show)}>{show ? 'Hide word' : 'Show word (player only)'}</button>
        {mode === 'guess' && <button className="btn2" onClick={() => setHint(true)}>Hint</button>}<button className="btn" onClick={() => mark(true)}>Correct</button><button className="btn2" onClick={() => mark(false)}>Skip</button>
        <button className="btn2" onClick={() => setRun(!run)}>{run ? 'Pause' : 'Resume'}</button><button className="btn2" onClick={reset}>Reset</button></div>
      {hint && <p className="text-sm text-neutral-400">Starts with “{w[0]}”, {w.length} letters</p>}</>}
    {ph === 'end' && <><p className="font-semibold">Time’s up! The last word was “{w}”.</p>{log.map(([x, ok], k) => <p key={k}>{ok ? '✔' : '✖'} {x}</p>)}<button className="btn" onClick={() => { setTurn(turn + 1); reset() }}>Next player</button></>}</div><Board players={players} scores={sc} /></div>
}
