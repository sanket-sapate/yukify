// Song metadata generated from /public/songs/
// " - I" suffix in filenames = Yukta's individual cover tag

// Song-specific cover art (place images in /public/covers/)
const covers = {
  'Barso Re - I.mp3':              '/covers/Barso Re.jpg',
  'Bol Na Halke - I.mp3':          '/covers/Bol Na Halke.jpg',
  'Chand Sifarish - I.mp3':        '/covers/Chand Sifarish.jpg',
  'Isq Risk - I.mp3':              '/covers/Isq Risk.jpg',
  'Kanha Soja Jara.aac':           '/covers/Kanha Soja Jara.jpg',
  'Kehna Hi Kya.aac':              '/covers/Kehna Hi Kya.jpg',
  'Kitida Navyane.aac':            '/covers/Kitida Navyane.jpg',
  'Lae Dooba - I.mp3':             '/covers/Lae Dooba.jpg',
  'Piya Tose Naina Lage Re.aac':   '/covers/Piya Tose Naina Lage Re.jpg',
  'Raat Ka Nasha.aac':             '/covers/Raat Ka Nasha.jpg',
  'Surili Akhiyon Wale.mp3':       '/covers/Surili Ankhiyon Wale.jpg',
}

const rawSongs = [
  { file: 'Aapki Ankhon Me Kuch.mp3' },
  { file: 'Barso Re - I.mp3' },
  { file: 'Behka - I.mp3' },
  { file: 'Bol Na Halke - I.mp3' },
  { file: 'Buleyaa - I.mp3' },
  { file: 'Chand Sifarish - I.mp3' },
  { file: 'Churake Dil Mera - I.mp3' },
  { file: 'Darkhast - I.mp3' },
  { file: 'Isq Risk - I.mp3' },
  { file: 'Kanha Soja Jara.aac' },
  { file: 'Lae Dooba - I.mp3' },
  { file: 'Mann ki Lagan.mp3' },
  { file: 'O Re Piya - I.mp3' },
  { file: 'Phir Mohabaat - I.mp3' },
  { file: 'Piya Tose Naina Lage Re.aac' },
  { file: 'Remix - Duaa - Kyuki Tum Hi Ho - I.mp3' },
  { file: 'Rimjhim Gira Sawan - I.mp3' },
  { file: 'Saas Me Teri - I.mp3' },
  { file: 'Saiyaan - Kailash Kher - I.mp3' },
  { file: 'Sun Raha Hai Na Tu - I.mp3' },
  { file: 'Sun Sathiyan - I.mp3' },
  { file: 'Surili Akhiyon Wale.mp3' },
  { file: 'Tu Hai Wahi - I.mp3' },
  { file: 'Tu Hi Meri Shab Hai - I.mp3' },
  { file: 'Yeh Dil Tum Bin Kahin Lagta Nahi.aac' },
  { file: 'Kehna Hi Kya.aac' },
  { file: 'Kitida Navyane.aac' },
  { file: 'Raat Ka Nasha.aac' },
]

// Gradient palettes for song cards (no album art)
const gradients = [
  ['#e94560', '#c62a47'],
  ['#0f3460', '#16213e'],
  ['#533483', '#2d1b69'],
  ['#e94560', '#533483'],
  ['#1a6b8a', '#0f3460'],
  ['#c84b31', '#9b2335'],
  ['#2b5f75', '#16213e'],
  ['#7952b3', '#533483'],
  ['#e94560', '#7952b3'],
  ['#1e8449', '#145a32'],
]

function cleanTitle(filename) {
  return filename
    .replace(/\.(mp3|aac|wav|flac|ogg|m4a)$/i, '') // remove extension
    .replace(/\s*-\s*I$/i, '')                      // remove " - I" suffix
    .trim()
}

export const songs = rawSongs.map((s, i) => ({
  id: i + 1,
  title: cleanTitle(s.file),
  artist: 'Yukta',
  src: `/songs/${encodeURIComponent(s.file)}`,
  gradient: gradients[i % gradients.length],
  image: covers[s.file] ?? null,
}))
