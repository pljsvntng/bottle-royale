import { useEffect, useState } from 'react'
import { Wine, Users, Gamepad2, Home, X } from 'lucide-react'
import { COMP } from './games'

export type Player = { id: string; name: string; color: string }
const COLORS = ['#7b1e2b', '#8a6d1f', '#3f6b5a', '#4a5d8a', '#8a5a3a', '#6b4a7a', '#a34a4a', '#5a7a8a']
function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => { try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init } catch { return init } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage unavailable */ } }, [key, v])
  return [v, setV] as const
}
const GAMES = [
  { id: "spin", title: "Spin the Bottle", desc: "Spin and face a challenge.", min: 2, time: "15 min", cat: "Bottle Games", ready: true },
  { id: "tod", title: "Truth or Dare", desc: "Choose your fate.", min: 2, time: "20 min", cat: "Challenge Games", ready: true },
  { id: "nhie", title: "Never Have I Ever", desc: "Group statements, no drinking needed.", min: 2, time: "15 min", cat: "Question Games", ready: true },
  { id: "mlt", title: "Most Likely To", desc: "Vote for who fits.", min: 2, time: "15 min", cat: "Voting Games", ready: true },
  { id: "wyr", title: "Would You Rather?", desc: "A or B, real vote counts.", min: 2, time: "10 min", cat: "Voting Games", ready: true },
  { id: "wkmb", title: "Who Knows Me Best?", desc: "Guess the host’s answers.", min: 3, time: "20 min", cat: "Guessing Games", ready: true },
  { id: "ttl", title: "Two Truths and a Lie", desc: "Spot the lie.", min: 3, time: "20 min", cat: "Guessing Games", ready: true },
  { id: "charades", title: "Charades", desc: "Act it out against the clock.", min: 2, time: "15 min", cat: "Team Games", ready: true },
  { id: "quiz", title: "Quick Quiz Battle", desc: "Pass-and-play trivia.", min: 2, time: "10 min", cat: "Trivia Games", ready: true },
  { id: "wheel", title: "Challenge Wheel", desc: "Spin a custom wheel.", min: 1, time: "10 min", cat: "Challenge Games", ready: true },
  { id: "guess", title: "Guess the Word", desc: "Describe, don’t say.", min: 2, time: "15 min", cat: "Guessing Games", ready: true },
  { id: "custom", title: "Custom Party Game", desc: "Build your own prompt game.", min: 1, time: "Any", cat: "Custom Games", ready: true },
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
      <header className="sticky top-0 z-10 bg-[#121212]/95 border-b border-neutral-800 px-4 pb-3 pt-[max(.75rem,env(safe-area-inset-top))] flex items-center gap-3">
        <span className="font-bold text-[#c9a24b] flex items-center gap-2"><Wine size={20} />Bottle Royale</span>
        <nav className="hidden md:flex gap-2 ml-auto">{nav.map(([id, l, I]) => <button key={id} className="btn2 flex items-center gap-1 text-sm" onClick={() => setView(id)}><I size={14} />{l}</button>)}</nav>
      </header>
      <main className="max-w-4xl mx-auto p-4 pb-28 md:pb-4 space-y-4">
        {view === 'home' && <section className="text-center py-12 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#c9a24b]">Bottle Royale</h1>
          <p className="text-neutral-400">Add your friends, pick a game, pass the phone.</p>
          <button className="btn" onClick={() => setView(players.length ? 'games' : 'players')}>Start Playing</button></section>}
        {view === 'players' && <section className="card space-y-3"><h2 className="text-xl font-semibold">Players</h2>
          <div className="flex gap-2"><input aria-label="Player name" className="flex-1 bg-black border border-neutral-700 rounded px-3 py-2" value={name} maxLength={20} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Name" /><button className="btn" onClick={add}>Add</button></div>
          {err && <p role="alert" className="text-red-400 text-sm">{err}</p>}
          {!players.length && <p className="text-neutral-400">No players yet.</p>}
          {players.map(p => <div key={p.id} className="flex items-center gap-3"><span className="w-8 h-8 rounded-full grid place-items-center" style={{ background: p.color }}>{p.name[0].toUpperCase()}</span><span className="flex-1">{p.name}</span>
            <button aria-label={`Remove ${p.name}`} className="btn2" onClick={() => setPlayers(players.filter(x => x.id !== p.id))}><X size={14} /></button></div>)}</section>}
        {view === 'games' && <section className="space-y-3"><input aria-label="Search games" className="w-full bg-black border border-neutral-700 rounded px-3 py-2" placeholder="Search games" value={q} onChange={e => setQ(e.target.value)} />
          <div className="grid gap-3 sm:grid-cols-2">{GAMES.filter(g => g.title.toLowerCase().includes(q.toLowerCase())).map(g => <div key={g.id} className="card space-y-1"><h3 className="font-semibold">{g.title}</h3><p className="text-sm text-neutral-400">{g.desc}</p>
            <p className="text-xs text-neutral-500">{g.cat} · {g.min}+ players · {g.time}</p>
            <button className="btn" disabled={!g.ready} onClick={() => setView(g.id)}>{g.ready ? 'Play Now' : 'Soon'}</button></div>)}</div></section>}
        {game?.ready && <section className="space-y-3"><h2 className="text-xl font-semibold">{game.title}</h2>
          {players.length < game.min ? <div className="card">Add at least {game.min} players first. <button className="btn ml-2" onClick={() => setView('players')}>Players</button></div>
            : Game && <Game players={players} />}</section>}
      </main>
      <nav aria-label="Main" className="md:hidden fixed bottom-0 inset-x-0 z-10 grid grid-cols-3 bg-[#161616] border-t border-neutral-800 pb-[env(safe-area-inset-bottom)]">{nav.map(([id, l, I]) => <button key={id} onClick={() => setView(id)} className={`flex flex-col items-center gap-1 py-2 text-xs ${view === id ? "text-[#c9a24b]" : "text-neutral-400"}`}><I size={20} />{l}</button>)}</nav>
    </div>)
}
