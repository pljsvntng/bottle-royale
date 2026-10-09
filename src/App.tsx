import { useEffect, useState } from 'react'
import { Wine, Users, Gamepad2, Home, X, Flame, Hand, Vote, Scale, HeartHandshake, Drama, Clapperboard, Brain, CircleDot, MessageCircleQuestion, Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import { COMP } from './games'

export type Player = { id: string; name: string; color: string }
const COLORS = ['#FF6257', '#FFD166', '#9DE3C2', '#8EC5FF', '#C3A6FF', '#FF9EC4', '#F5A25D', '#7FD6D6']
const _OLD = ['#7b1e2b', '#8a6d1f', '#3f6b5a', '#4a5d8a', '#8a5a3a', '#6b4a7a', '#a34a4a', '#5a7a8a']
function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => { try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init } catch { return init } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }, [key, v])
  return [v, setV] as const
}
const GAMES = [
  { id: "spin", title: "Spin the Bottle", desc: "Spin and face a challenge.", min: 2, time: "15 min", cat: "Bottle Games", color: "#FF6257", how: "Spin the bottle, meet your fate, then spin for a challenge.", icon: Wine },
  { id: "tod", title: "Truth or Dare", desc: "Choose your fate.", min: 2, time: "20 min", cat: "Challenge Games", color: "#FFD166", how: "Pick Truth or Dare, then answer or perform it.", icon: Flame },
  { id: "nhie", title: "Never Have I Ever", desc: "Group statements, no drinking needed.", min: 2, time: "15 min", cat: "Question Games", color: "#9DE3C2", how: "Read the statement. If you have done it, say so. No drinking needed.", icon: Hand },
  { id: "mlt", title: "Most Likely To", desc: "Vote for who fits.", min: 2, time: "15 min", cat: "Voting Games", color: "#FF9EC4", how: "Everyone secretly votes for who fits the question.", icon: Vote },
  { id: "wyr", title: "Would You Rather?", desc: "A or B, real vote counts.", min: 2, time: "10 min", cat: "Voting Games", color: "#8EC5FF", how: "Everyone votes A or B, then see the split.", icon: Scale },
  { id: "wkmb", title: "Who Knows Me Best?", desc: "Guess the host’s answers.", min: 3, time: "20 min", cat: "Guessing Games", color: "#C3A6FF", how: "Others guess the host’s answers; the host marks who got it right.", icon: HeartHandshake },
  { id: "ttl", title: "Two Truths and a Lie", desc: "Spot the lie.", min: 3, time: "20 min", cat: "Guessing Games", color: "#F5A25D", how: "Write 3 statements, one a lie. Others vote on the lie.", icon: Drama },
  { id: "charades", title: "Charades", desc: "Act it out against the clock.", min: 2, time: "15 min", cat: "Team Games", color: "#FF6257", how: "Act out the word silently before time runs out.", icon: Clapperboard },
  { id: "quiz", title: "Quick Quiz Battle", desc: "Pass-and-play trivia.", min: 2, time: "10 min", cat: "Trivia Games", color: "#9DE3C2", how: "Pass the phone: each player answers every question.", icon: Brain },
  { id: "wheel", title: "Challenge Wheel", desc: "Spin a custom wheel.", min: 1, time: "10 min", cat: "Challenge Games", color: "#FFD166", how: "Spin the wheel and do what it lands on.", icon: CircleDot },
  { id: "guess", title: "Guess the Word", desc: "Describe, don’t say.", min: 2, time: "15 min", cat: "Guessing Games", color: "#8EC5FF", how: "Describe the word without saying it.", icon: MessageCircleQuestion },
  { id: "custom", title: "Custom Party Game", desc: "Build your own prompt game.", min: 1, time: "Any", cat: "Custom Games", color: "#C3A6FF", how: "Build your own prompt game, then play it.", icon: Sparkles },
]

export default function App() {
  const [view, setView] = useState('home'), [players, setPlayers] = useLS<Player[]>('br.players', []), [name, setName] = useState(''), [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const add = () => {
    const t = name.trim()
    if (!t) return setErr('Enter a name.')
    if (players.some(p => p.name.toLowerCase() === t.toLowerCase())) return setErr('That name is taken.')
    setPlayers([...players, { id: crypto.randomUUID(), name: t, color: COLORS[players.length % COLORS.length] }]); setName(''); setErr('')
  }
  const game = GAMES.find(g => g.id === view), Game = game ? COMP[game.id] : null
  const nav = [['home', 'Home', Home], ['games', 'Games', Gamepad2], ['players', `Players (${players.length})`, Users]] as const
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-[#26152F]/95 border-b border-neutral-800 px-4 pb-3 pt-[max(.75rem,env(safe-area-inset-top))] flex items-center gap-3">
        <span className="text-[#FFD166] display text-xl flex items-center gap-2"><Wine size={20} />Bottle Royale</span>
        <nav className="hidden md:flex gap-2 ml-auto">{nav.map(([id, l, I]) => <button key={id} className="btn2 flex items-center gap-1 text-sm" onClick={() => setView(id)}><I size={14} />{l}</button>)}</nav>
      </header>
      <main className="max-w-4xl mx-auto p-4 pb-28 md:pb-4 space-y-4">
        {view === 'home' && <section className="grid md:grid-cols-[1.2fr_1fr] gap-8 items-center py-4 md:py-10">
          <div className="space-y-5">
            <span className="inline-block -rotate-2 bg-[#FFD166] text-[#211B24] px-3 py-1 font-extrabold text-sm border-2 border-[#211B24]">12 PARTY GAMES · 1 PHONE</span>
            <h1 className="display text-5xl sm:text-7xl">Spin it.<br /><span className="text-[#FF6257]">Dare it.</span><br />Laugh it.</h1>
            <p className="text-[#E6D9EE] max-w-md">Add your crew, pick a game, pass the phone. No sign-up, no drinking required.</p>
            <div className="flex flex-wrap items-center gap-3"><button className="btn text-lg" onClick={() => setView(players.length ? 'games' : 'players')}>PLAY NOW</button>
              <button className="btn2" onClick={() => setView('players')}>{players.length ? `${players.length} players ready` : 'Add players'}</button></div>
            <div className="flex -space-x-2" aria-label="Players">{players.slice(0, 8).map(p => <span key={p.id} title={p.name} className="w-9 h-9 rounded-full grid place-items-center font-bold border-2 border-[#211B24]" style={{ background: p.color }}>{p.name[0].toUpperCase()}</span>)}</div>
          </div>
          <svg viewBox="0 0 160 200" className="mx-auto h-64 md:h-96 rotate-[18deg]" role="img" aria-label="Bottle illustration">
            <path d="M20 40l5 8-9 3 7 6-9 4 8 5M140 30l-4 8 9 1-7 6 9 3-8 5" stroke="#FFD166" strokeWidth="3" fill="none" strokeLinecap="round" />
            <g transform="translate(50 0) scale(1)"><rect x="22" y="2" width="16" height="12" rx="2" fill="#FFD166" stroke="#211B24" strokeWidth="2" />
              <path d="M23 14h14v40c0 10 18 18 18 40v90c0 6-4 10-10 10H15c-6 0-10-4-10-10V94c0-22 18-30 18-40z" fill="#2E7D5B" stroke="#211B24" strokeWidth="2" />
              <rect x="12" y="105" width="36" height="50" rx="3" fill="#FFF4E5" stroke="#211B24" strokeWidth="1.5" /><text x="30" y="135" fontSize="7" textAnchor="middle" fill="#D93F34" fontWeight="900">ROYALE</text></g>
          </svg>
          <ol className="md:col-span-2 grid sm:grid-cols-3 gap-4 border-t-2 border-[#FFD166]/40 pt-4">{['Add your friends', 'Pick a game', 'Pass the phone'].map((t, i) => <li key={t} className="flex items-center gap-3"><span className="display text-5xl text-[#FFD166]">{i + 1}</span><span className="font-semibold">{t}</span></li>)}</ol>
        </section>}
        {view === 'players' && <section className="card space-y-3"><h2 className="display text-3xl">Who’s playing?</h2>
          <div className="flex gap-2"><input aria-label="Player name" className="flex-1 bg-black border border-neutral-700 rounded px-3 py-2" value={name} maxLength={20} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Name" /><button className="btn" onClick={add}>Add</button></div>
          {err && <p role="alert" className="text-red-400 text-sm">{err}</p>}
          {!players.length && <p className="text-[#CDBFD6]">No players yet.</p>}
          {players.map(p => <div key={p.id} className="flex items-center gap-3"><span className="w-8 h-8 rounded-full grid place-items-center" style={{ background: p.color }}>{p.name[0].toUpperCase()}</span><span className="flex-1">{p.name}</span>
            <button aria-label={`Remove ${p.name}`} className="btn2" onClick={() => setPlayers(players.filter(x => x.id !== p.id))}><X size={14} /></button></div>)}</section>}
        {view === 'games' && <section className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><h2 className="display text-4xl">Pick your game</h2>
          <input aria-label="Search games" className="px-3 py-2 w-full sm:w-64" placeholder="Search games" value={q} onChange={e => setQ(e.target.value)} /></div>
          {!GAMES.some(g => g.title.toLowerCase().includes(q.toLowerCase())) && <p className="card">No games match “{q}”. The bottle is confused.</p>}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{GAMES.filter(g => g.title.toLowerCase().includes(q.toLowerCase())).map((g, i) => { const I = g.icon
            return <div key={g.id} style={{ '--accent': g.color } as CSSProperties} className="card lift flex flex-col gap-2">
              <div className="flex items-start justify-between"><span className={`grid place-items-center w-14 h-14 border-2 border-[#211B24] ${i % 2 ? 'rotate-3' : '-rotate-3'}`} style={{ background: g.color }}><I size={28} /></span><span className="text-xs font-bold border-2 border-[#211B24] px-2 py-0.5">{g.min}+ · {g.time}</span></div>
              <h3 className="display text-2xl">{g.title}</h3><p className="text-sm text-[#6B5A73] flex-1">{g.desc}</p><p className="text-xs font-bold uppercase text-[#6B5A73]">{g.cat}</p>
              <button className="btn" onClick={() => setView(g.id)}>PLAY</button></div> })}</div></section>}
        {game && <section style={{ '--accent': game.color } as CSSProperties} className="space-y-4"><div className="flex items-start gap-3"><button className="btn2" onClick={() => setView('games')} aria-label="Back to lobby">← Lobby</button>
          <div><h2 className="display text-3xl sm:text-5xl" style={{ color: game.color }}>{game.title}</h2><p className="text-[#E6D9EE] text-sm mt-1">{game.how}</p></div></div>
          {players.length < game.min ? <div className="card space-y-2"><p className="display text-2xl">Not enough players</p><p>The bottle is lonely. Add at least {game.min} players to start.</p><button className="btn" onClick={() => setView('players')}>Add players</button></div>
            : Game && <Game players={players} />}</section>}
      </main>
      <nav aria-label="Main" className="md:hidden fixed bottom-0 inset-x-0 z-10 grid grid-cols-3 bg-[#1B0E24] border-t border-neutral-800 pb-[env(safe-area-inset-bottom)]">{nav.map(([id, l, I]) => <button key={id} onClick={() => setView(id)} className={`flex flex-col items-center gap-1 py-2 text-xs ${view === id ? "text-[#FFD166]" : "text-[#CDBFD6]"}`}><I size={20} />{l}</button>)}</nav>
    </div>)
}
