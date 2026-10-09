import { useEffect, useState } from 'react'
import type { Player } from '../App'
export const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])
export function useLS<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => { try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : init } catch { return init } })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* unavailable */ } }, [key, v])
  return [v, setV] as const
}
export function Board({ players, scores }: { players: Player[]; scores: Record<string, number> }) {
  return <div className="card"><h3 className="font-semibold mb-2">Scoreboard</h3>{[...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)).map(p => <div key={p.id} className="flex justify-between"><span>{p.name}</span><b>{scores[p.id] || 0}</b></div>)}</div>
}
