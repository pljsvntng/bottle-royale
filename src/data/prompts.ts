export const truths = ["What's the funniest thing you've done in public?","What's your most embarrassing song on your playlist?","What's a food you pretend to like?","What was your biggest fashion mistake?","What's the silliest fear you have?","What's a talent nobody knows you have?","What's the last thing you Googled?","Who in this room would you swap lives with for a day?"]
export const dares = ["Speak in a pirate accent until your next turn.","Do your best impression of another player.","Dance for 15 seconds with no music.","Tell a joke; the group rates it.","Balance a spoon on your nose for 10 seconds.","Sing the chorus of any song in an opera voice.","Do 10 jumping jacks while reciting the alphabet.","Invent a handshake with the player to your left."]
export const bottleChallenges = [...truths, ...dares]
export function pick<T>(arr: T[], used: Set<T>): T {
  let pool = arr.filter(x => !used.has(x))
  if (!pool.length) { used.clear(); pool = arr }
  const v = pool[Math.floor(Math.random() * pool.length)]; used.add(v); return v
}
export const CHALLENGES: Record<string, string[]> = {
  'Truth Question': truths,
  'Funny Challenge': ['Do your best impression of a famous character.', 'Talk like a news anchor for 30 seconds.', 'Act like a robot until your next turn.', 'Make up a 10-second commercial for a spoon.'],
  Dare: dares,
  'Trivia Question': ['Name 5 countries in Asia in 10 seconds.', 'Name 4 planets in order from the sun.', 'Name 5 animals that start with the letter B.', 'Name 3 movies released this decade.'],
  'Group Challenge': ['Everyone does a group cheer together.', 'Group picks one person to tell a short story: everyone adds one word at a time.', 'Everyone points at who they think is funniest on three.', 'Group does a 10-second freeze pose.'],
  'Mystery Challenge': ['Swap seats with someone of your choice.', 'Give a sincere compliment to every player.', 'Let the group pick your next dare.', 'Share a happy memory in one sentence.'],
}
