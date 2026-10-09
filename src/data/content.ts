export const NHIE: Record<string, string[]> = {
  Funny: ['Never have I ever laughed so hard I cried', 'Never have I ever sent a text to the wrong person', 'Never have I ever walked into a glass door'],
  School: ['Never have I ever forgotten homework', 'Never have I ever fallen asleep in class', 'Never have I ever cheered for the wrong team'],
  Friends: ['Never have I ever kept a friend’s secret for years', 'Never have I ever forgotten a friend’s birthday', 'Never have I ever laughed at an inside joke I didn’t get'],
  Travel: ['Never have I ever missed a flight', 'Never have I ever been lost in another country', 'Never have I ever slept in an airport'],
  'Everyday Life': ['Never have I ever put on mismatched socks', 'Never have I ever burned toast', 'Never have I ever waved back at a stranger by mistake'],
}
export const MLT = ['Who is most likely to become famous?', 'Who is most likely to oversleep?', 'Who is most likely to get lost with GPS on?', 'Who is most likely to laugh at the wrong time?', 'Who is most likely to adopt ten pets?', 'Who is most likely to win a cooking show?']
export const WYR: [string, string][] = [['Be able to fly', 'Be invisible'], ['Eat pizza forever', 'Eat tacos forever'], ['Travel to the past', 'Travel to the future'], ['Never use social media', 'Never watch videos'], ['Live by the sea', 'Live in the mountains'], ['Have no phone for a month', 'Have no TV for a year']]
export const WKMB = ['What is my favorite food?', 'What is my dream vacation spot?', 'What hobby do I enjoy most?', 'What is my ideal weekend?', 'What is my favorite movie genre?']
export const WORDS: Record<string, string[]> = {
  Animals: ['Elephant', 'Penguin', 'Giraffe', 'Octopus', 'Kangaroo'], Food: ['Pizza', 'Sushi', 'Pancakes', 'Burrito', 'Ice cream'],
  Technology: ['Keyboard', 'Smartphone', 'Robot', 'Headphones', 'Wi-Fi'], Movies: ['Titanic', 'Frozen', 'Jaws', 'The Lion King', 'Shrek'],
  Objects: ['Umbrella', 'Toothbrush', 'Scissors', 'Ladder', 'Mirror'], Actions: ['Swimming', 'Brushing teeth', 'Playing guitar', 'Riding a horse', 'Taking a selfie'],
}
export type Q = { c: string; q: string; o: string[]; a: number }
export const QUIZ: Q[] = [
  { c: 'General Knowledge', q: 'How many continents are there?', o: ['5', '6', '7', '8'], a: 2 },
  { c: 'General Knowledge', q: 'Which planet is known as the Red Planet?', o: ['Venus', 'Mars', 'Jupiter', 'Mercury'], a: 1 },
  { c: 'Technology', q: 'What does CPU stand for?', o: ['Central Processing Unit', 'Computer Personal Unit', 'Core Program Utility', 'Central Power Unit'], a: 0 },
  { c: 'Technology', q: 'What does HTML stand for?', o: ['HyperText Markup Language', 'High Transfer Markup Link', 'HyperTool Machine Language', 'Home Text Mark Language'], a: 0 },
  { c: 'Movies', q: 'Who directed Jurassic Park (1993)?', o: ['James Cameron', 'Steven Spielberg', 'George Lucas', 'Ridley Scott'], a: 1 },
  { c: 'Movies', q: 'In Toy Story, what kind of toy is Woody?', o: ['Astronaut', 'Dinosaur', 'Cowboy', 'Robot'], a: 2 },
  { c: 'Science', q: 'Which gas do plants absorb for photosynthesis?', o: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], a: 2 },
  { c: 'Science', q: 'What is the chemical symbol for gold?', o: ['Ag', 'Au', 'Gd', 'Go'], a: 1 },
  { c: 'Geography', q: 'What is the capital of Japan?', o: ['Seoul', 'Osaka', 'Kyoto', 'Tokyo'], a: 3 },
  { c: 'Geography', q: 'Which is the largest ocean?', o: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], a: 2 },
  { c: 'History', q: 'Who was the first US president?', o: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], a: 1 },
  { c: 'History', q: 'In which year did World War II end?', o: ['1939', '1943', '1945', '1950'], a: 2 },
]
