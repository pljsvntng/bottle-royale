import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Player } from '../App'
import { CHALLENGES, pick } from '../data/prompts'
import { sfx } from './sound'
import { useLS } from './ui'

const DEFAULT_PENALTY = 'Challenge skipped! Choose a non-alcoholic penalty, such as drinking a glass of water, answering a bonus question, or accepting a funny harmless challenge.'
const CATS = Object.keys(CHALLENGES)
type Phase = 'idle' | 'spinning' | 'reveal' | 'wheel' | 'wheelspin' | 'challenge' | 'confirm' | 'result'
const Modal = ({ children }: { children: ReactNode }) => <div role="dialog" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-black/70 p-4 overflow-auto"><div className="pop card max-w-md w-full text-center space-y-3 !border-[#c9a24b]">{children}</div></div>

export default function Spin({ players }: { players: Player[] }) {
  const [cfg, setCfg] = useLS('br.spin.settings', { sound: true, again: true, penalty: DEFAULT_PENALTY })
  const [stats, setStats] = useLS('br.spin.stats', { rounds: 0, completed: 0, passed: 0 })
  const [ph, setPh] = useState<Phase>('idle'), [rot, setRot] = useState(0), [wrot, setWrot] = useState(0)
  const [sel, setSel] = useState<Player | null>(null), [cat, setCat] = useState(-1), [prompt, setPrompt] = useState(''), [outcome, setOutcome] = useState('')
  const pend = useRef(0), used = useRef(new Set<string>()), n = players.length
  const play = (f: () => void) => { if (cfg.sound) f() }
  useEffect(() => () => sfx.stopSpin(), [])

  const spin = () => {
    if (ph !== 'idle') return
    const i = Math.floor(Math.random() * n), cur = ((rot % 360) + 360) % 360
    pend.current = i; setPh('spinning'); sfx.unlock(); play(sfx.startSpin)
    setRot(rot + 1800 + ((i * 360) / n - cur + 360) % 360)
  }
  const bottleDone = () => {
    if (ph !== 'spinning') return
    sfx.stopSpin(); setSel(players[pend.current]); setPh('reveal'); play(sfx.stop); setTimeout(() => play(sfx.reveal), 350)
  }
  const spinWheel = () => {
    if (ph !== 'wheel' && ph !== 'challenge') return
    const k = CATS.length, s = 360 / k, i = Math.floor(Math.random() * k), cur = ((wrot % 360) + 360) % 360
    pend.current = i; setPh('wheelspin'); play(sfx.startSpin)
    setWrot(wrot + 1800 + (((360 - (i + .5) * s) % 360) - cur + 360) % 360)
  }
  const wheelDone = () => {
    if (ph !== 'wheelspin') return
    sfx.stopSpin(); const i = pend.current; setCat(i); setPrompt(pick(CHALLENGES[CATS[i]], used.current)); setPh('challenge'); play(sfx.stop); setTimeout(() => play(sfx.category), 300)
  }
  const complete = () => { if (ph !== 'challenge') return; setStats(s => ({ rounds: s.rounds + 1, completed: s.completed + 1, passed: s.passed })); setOutcome('Challenge completed!'); setPh('result'); play(sfx.done) }
  const confirmPass = () => { if (ph !== 'confirm') return; setStats(s => ({ rounds: s.rounds + 1, completed: s.completed, passed: s.passed + 1 })); setOutcome('Passed. Apply the penalty: ' + cfg.penalty); setPh('result'); play(sfx.passed) }
  const nextRound = () => { if (ph !== 'result') return; setSel(null); setCat(-1); setPh('idle') }

  const k = CATS.length, s = 360 / k, pt = (a: number) => [100 * Math.sin(a * Math.PI / 180), -100 * Math.cos(a * Math.PI / 180)]
  return (
    <div className="grid gap-4 md:grid-cols-2 items-start">
      <div className="relative mx-auto w-full max-w-sm aspect-square">
        {players.map((p, i) => { const a = (i * 2 * Math.PI) / n
          return <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2 text-center text-xs" style={{ left: `${50 + 39 * Math.sin(a)}%`, top: `${50 - 39 * Math.cos(a)}%` }}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 text-sm rounded-full grid place-items-center font-bold border-2 ${sel?.id === p.id ? 'border-[#c9a24b] scale-125' : 'border-transparent'}`} style={{ background: p.color }}>{p.name[0].toUpperCase()}</div><span className="block max-w-[4.5rem] truncate mx-auto">{p.name}</span></div> })}
        <svg viewBox="0 0 60 200" className="absolute inset-0 m-auto h-3/5" aria-label="Bottle" style={{ transform: `rotate(${rot}deg)`, transition: ph === 'spinning' ? 'transform 4s cubic-bezier(.15,.7,.1,1)' : 'none' }} onTransitionEnd={bottleDone}>
          <rect x="22" y="2" width="16" height="12" rx="2" fill="#c9a24b" />
          <path d="M23 14h14v40c0 10 18 18 18 40v90c0 6-4 10-10 10H15c-6 0-10-4-10-10V94c0-22 18-30 18-40z" fill="#1c2a22" stroke="#3a4a40" />
          <rect x="12" y="105" width="36" height="50" rx="3" fill="#e9dcc0" /><text x="30" y="135" fontSize="7" textAnchor="middle" fill="#7b1e2b" fontWeight="700">ROYALE</text>
          <path d="M14 96v85" stroke="#fff" strokeOpacity=".18" strokeWidth="3" />
        </svg>
      </div>
      <div className="card space-y-3">
        <p className="text-sm text-neutral-400">Round {stats.rounds + (ph === 'idle' ? 1 : 0)} · Completed {stats.completed} · Passed {stats.passed}</p>
        <button className="btn w-full" onClick={spin} disabled={ph !== 'idle'}>{ph === 'idle' ? 'SPIN' : ph === 'spinning' ? 'Spinning…' : 'Round in progress'}</button>
        <details><summary className="cursor-pointer text-sm">Game rules & sound</summary><div className="space-y-2 mt-2 text-sm">
          <label className="block"><input type="checkbox" checked={cfg.sound} onChange={e => setCfg({ ...cfg, sound: e.target.checked })} /> Sound effects</label>
          <label className="block"><input type="checkbox" checked={cfg.again} onChange={e => setCfg({ ...cfg, again: e.target.checked })} /> Allow “Spin Again” on challenges</label>
          <label className="block">Passing penalty (never require alcohol)<textarea rows={3} className="w-full bg-black border border-neutral-700 rounded px-2 py-1" value={cfg.penalty} onChange={e => setCfg({ ...cfg, penalty: e.target.value })} /></label>
          <button className="btn2" onClick={() => setCfg({ ...cfg, penalty: DEFAULT_PENALTY })}>Restore default penalty</button></div></details>
      </div>

      {ph === 'reveal' && sel && <Modal><p className="text-sm tracking-widest text-neutral-400">THE BOTTLE CHOSE...</p>
        <div className="w-20 h-20 rounded-full mx-auto grid place-items-center text-3xl font-bold border-4 border-[#c9a24b]" style={{ background: sel.color }}>{sel.name[0].toUpperCase()}</div>
        <p className="text-4xl font-bold text-[#c9a24b]">{sel.name.toUpperCase()}!</p><p className="italic">You're up next. Ready for your challenge?</p>
        <button autoFocus className="btn w-full" onClick={() => setPh('wheel')}>Continue</button></Modal>}

      {(ph === 'wheel' || ph === 'wheelspin' || ph === 'challenge' || ph === 'confirm' || ph === 'result') && sel && (
        <div className="md:col-span-2 card space-y-3">
          <p className="text-center">Challenge wheel for <b className="text-[#c9a24b]">{sel.name}</b></p>
          <div className="relative mx-auto max-w-xs"><div className="absolute left-1/2 -top-2 -translate-x-1/2 z-10 text-[#c9a24b]">▼</div>
            <svg viewBox="-105 -105 210 210" aria-label="Challenge category wheel" style={{ transform: `rotate(${wrot}deg)`, transition: ph === 'wheelspin' ? 'transform 4s cubic-bezier(.15,.7,.1,1)' : 'none' }} onTransitionEnd={wheelDone}>
              {CATS.map((t, i) => { const [x1, y1] = pt(i * s), [x2, y2] = pt((i + 1) * s)
                return <g key={t}><path d={`M0 0L${x1} ${y1}A100 100 0 0 1 ${x2} ${y2}Z`} fill={i % 2 ? '#7b1e2b' : '#2a2a2a'} stroke="#c9a24b" strokeWidth=".5" />
                  <text transform={`rotate(${(i + .5) * s}) translate(0,-62)`} fontSize="7" fill="#f3ead8" textAnchor="middle">{t.replace(' Question', '').replace(' Challenge', '')}</text></g> })}</svg></div>
          {ph === 'wheel' && <button autoFocus className="btn w-full" onClick={spinWheel}>Spin for your challenge</button>}
          {ph === 'wheelspin' && <p className="text-center">Spinning…</p>}
        </div>)}

      {ph === 'challenge' && sel && <Modal><p className="text-sm tracking-widest text-neutral-400">YOUR CHALLENGE IS...</p><p className="text-3xl font-bold text-[#c9a24b]">{CATS[cat].toUpperCase()}</p>
        <p className="italic text-lg">{prompt}</p><div className="flex flex-wrap gap-2 justify-center">
          <button autoFocus className="btn" onClick={complete}>Complete Challenge</button><button className="btn2" onClick={() => setPh('confirm')}>Pass</button>
          {cfg.again && <button className="btn2" onClick={spinWheel}>Spin Again</button>}</div></Modal>}

      {ph === 'confirm' && <Modal><p className="text-2xl font-bold text-[#c9a24b]">PASSING PENALTY</p><p>{cfg.penalty}</p><div className="flex gap-2 justify-center">
        <button className="btn" onClick={confirmPass}>Confirm Pass</button><button autoFocus className="btn2" onClick={() => setPh('challenge')}>Cancel</button></div></Modal>}

      {ph === 'result' && <Modal><p className="text-xl">{outcome}</p><button autoFocus className="btn w-full" onClick={nextRound}>Next Round</button></Modal>}
    </div>)
}
