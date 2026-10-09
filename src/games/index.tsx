import type { ComponentType } from 'react'
import type { Player } from '../App'
import Spin from './Spin'; import TruthOrDare from './TruthOrDare'; import Deck from './Deck'; import Custom from './Custom'; import Vote from './Vote'
import Knows from './Knows'; import TwoTruths from './TwoTruths'; import Words from './Words'; import Quiz from './Quiz'; import Wheel from './Wheel'
import { NHIE } from '../data/content'
type P = { players: Player[] }
export const COMP: Record<string, ComponentType<P>> = {
  spin: Spin, tod: TruthOrDare, nhie: ({ players }) => <Deck players={players} cats={NHIE} storeKey="nhie" />, mlt: ({ players }) => <Vote players={players} kind="mlt" />, wyr: ({ players }) => <Vote players={players} kind="wyr" />,
  wkmb: Knows, ttl: TwoTruths, charades: ({ players }) => <Words players={players} mode="charades" />, quiz: Quiz, wheel: Wheel, guess: ({ players }) => <Words players={players} mode="guess" />, custom: Custom,
}
