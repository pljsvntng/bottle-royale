import RandomPick from './RandomPick'
import { useState } from 'react'
import type { Player } from '../App'
import { useLS } from './ui'
const DEF = ['Dance 10s', 'Tell a joke', 'Sing a line', 'Impression', 'Silly walk', 'Compliment all', 'Tongue twister', 'Freeze 15s']
export default function Wheel({ players }: { players: Player[] }) {
  const [secs, setSecs] = useLS<string[]>('br.wheel', DEF), [rot, setRot] = useState(0), [spin, setSpin] = useState(false), [idx, setIdx] = useState(-1), [res, setRes] = useState(-1), [txt, setTxt] = useState(''), [n, setN] = useState(0), [who, setWho] = useState<Player | null>(null), [cur, setCur] = useState<Player | null>(null)
  const k = secs.length, s = 360 / k, pt = (a: number) => [100 * Math.sin(a * Math.PI / 180), -100 * Math.cos(a * Math.PI / 180)]
  const go = () => { if (spin || k < 2) return; const i = Math.floor(Math.random() * k), want = (360 - (i + .5) * s) % 360, cur = ((rot % 360) + 360) % 360; setIdx(i); setRes(-1); setCur(who ?? players[n % players.length]); setWho(null); setSpin(true); setRot(rot + 1800 + (want - cur + 360) % 360) }
  return <div className="grid gap-4 md:grid-cols-2"><div className="relative mx-auto w-full max-w-sm"><div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10 text-[#c9a24b]">▼</div>
    <svg viewBox="-105 -105 210 210" aria-label="Challenge wheel" style={{ transform: `rotate(${rot}deg)`, transition: spin ? 'transform 4s cubic-bezier(.15,.7,.1,1)' : 'none' }} onTransitionEnd={() => { if (spin) { setSpin(false); setRes(idx); setN(n + 1) } }}>
      {secs.map((t, i) => { const [x1, y1] = pt(i * s), [x2, y2] = pt((i + 1) * s); return <g key={i}><path d={`M0 0L${x1} ${y1}A100 100 0 0 1 ${x2} ${y2}Z`} fill={i % 2 ? '#7b1e2b' : '#2a2a2a'} stroke="#c9a24b" strokeWidth=".5" />
        <text transform={`rotate(${(i + .5) * s}) translate(0,-62)`} fontSize="7" fill="#f3ead8" textAnchor="middle">{t.slice(0, 14)}</text></g> })}</svg></div>
    <div className="card space-y-2"><RandomPick players={players} disabled={spin} onPick={i => setWho(players[i])} />
      <button className="btn w-full" disabled={spin || k < 2} onClick={go}>{spin ? 'Spinning…' : res >= 0 ? 'Spin again' : 'SPIN'}</button>
      {res >= 0 && <p aria-live="polite" className="text-lg"><b className="text-[#c9a24b]">{(cur ?? players[0]).name}</b>: {secs[res]}</p>}
      <div className="flex gap-2"><input aria-label="New section" className="flex-1 bg-black border border-neutral-700 rounded px-2 py-1" value={txt} onChange={e => setTxt(e.target.value)} placeholder="Add section" /><button className="btn2" onClick={() => { if (txt.trim() && !spin) { setSecs([...secs, txt.trim()]); setTxt('') } }}>Add</button></div>
      {secs.map((t, i) => <div key={i} className="flex justify-between text-sm"><span>{t}</span><button aria-label={`Remove ${t}`} disabled={spin || k <= 2} onClick={() => setSecs(secs.filter((_, j) => j !== i))}>✕</button></div>)}
      <button className="btn2" disabled={spin} onClick={() => setSecs(DEF)}>Reset wheel</button></div></div>
}
