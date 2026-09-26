import 'dotenv/config';
import axios from 'axios';

// In-memory cache with TTL
const cache = new Map();

const setCache = (key, data, ttlMs = 15 * 60 * 1000) => {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  });
};

const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }
  return cached.data;
};

export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const GENRE_NAME_TO_ID = {
  ...Object.fromEntries(Object.entries(GENRE_MAP).map(([id, name]) => [name.toLowerCase(), Number(id)])),
  'sci-fi': 878,
  'science fiction': 878,
};

export const LANGUAGE_NAMES = {
  te: 'Telugu',
  hi: 'Hindi',
  ta: 'Tamil',
  ml: 'Malayalam',
  kn: 'Kannada',
  en: 'English',
  mr: 'Marathi',
  bn: 'Bengali',
  pa: 'Punjabi',
  gu: 'Gujarati',
  or: 'Odia',
  as: 'Assamese',
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Chinese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  ru: 'Russian',
  pt: 'Portuguese',
  ar: 'Arabic',
};

// Curated Fallback Movie Catalog (Multi-language including Telugu, Hindi, Tamil, Malayalam, Kannada, English, Korean)
export const FALLBACK_MOVIES = [
  // Telugu
  {
    id: 998844,
    title: 'Pushpa 2: The Rule',
    original_title: 'పుష్ప 2: ది రూల్',
    overview: 'Pushpa Raj continues his reign over the red sandalwood smuggling empire while locking horns with SP Bhanwar Singh Shekhawat in an explosive showdown.',
    tagline: 'The rule begins.',
    poster_path: '/b1Bs6p8s95pE0Vz3b6iK6V24x6t.jpg',
    backdrop_path: '/79vslsH5tD041eX3E3fJp2b4b4m.jpg',
    release_date: '2024-12-05',
    vote_average: 8.0,
    vote_count: 3200,
    popularity: 580.0,
    runtime: 200,
    original_language: 'te',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11085, name: 'Allu Arjun', character: 'Pushpa Raj' },
      { id: 11086, name: 'Rashmika Mandanna', character: 'Srivalli' },
      { id: 11087, name: 'Fahadh Faasil', character: 'Bhanwar Singh Shekhawat' },
    ],
  },
  {
    id: 579974,
    title: 'RRR',
    original_title: 'రౌద్రం రణం రుధిరం',
    overview: 'A fictional history of two legendary revolutionaries’ journey away from home before they began fighting for their country in the 1920s.',
    tagline: 'Rise. Roar. Revolt.',
    poster_path: '/nEufeZlyAOLqO2brrs0ye2rrHg6.jpg',
    backdrop_path: '/22z8hp1q4hJk7F7i6DCB5X7g5bT.jpg',
    release_date: '2022-03-24',
    vote_average: 7.8,
    vote_count: 1550,
    popularity: 420.0,
    runtime: 187,
    original_language: 'te',
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11090, name: 'N.T. Rama Rao Jr.', character: 'Komaram Bheem' },
      { id: 11088, name: 'Ram Charan', character: 'Alluri Sitarama Raju' },
      { id: 11089, name: 'Alia Bhatt', character: 'Sita' },
    ],
  },
  {
    id: 1022796,
    title: 'Kalki 2898 AD',
    original_title: 'కల్కి 2898 AD',
    overview: 'A modern avatar of the Hindu god Vishnu is believed to have descended on earth to protect the world from evil forces in a dystopian future.',
    tagline: 'The future has arrived.',
    poster_path: '/ytTKl0W1dE1v90zK3gE5084931.jpg',
    backdrop_path: '/stKGOm8nekuQ0b7e411qPzclJ71.jpg',
    release_date: '2024-06-27',
    vote_average: 7.6,
    vote_count: 2800,
    popularity: 490.0,
    runtime: 181,
    original_language: 'te',
    genres: [{ id: 878, name: 'Science Fiction' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11091, name: 'Prabhas', character: 'Bhairava' },
      { id: 35741, name: 'Amitabh Bachchan', character: 'Ashwatthama' },
      { id: 53341, name: 'Deepika Padukone', character: 'SUM-80' },
      { id: 11092, name: 'Kamal Haasan', character: 'Supreme Yaskin' },
    ],
  },
  {
    id: 1100099,
    title: 'Devara: Part 1',
    original_title: 'దేవర',
    overview: 'An epic action saga set against the backdrop of coastal lands, revolving around the legendary protector Devara and his courageous son.',
    tagline: 'Faces of fear.',
    poster_path: '/A7E8UEtA56z4oVb7U5nK2y9s7w.jpg',
    backdrop_path: '/5g2n6y1K8V6n4L1v0x9p3z5m7k.jpg',
    release_date: '2024-09-27',
    vote_average: 7.3,
    vote_count: 1850,
    popularity: 440.0,
    runtime: 178,
    original_language: 'te',
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11090, name: 'N.T. Rama Rao Jr.', character: 'Devara / Vara' },
      { id: 35745, name: 'Saif Ali Khan', character: 'Bhaira' },
      { id: 53345, name: 'Janhvi Kapoor', character: 'Thangam' },
    ],
  },
  {
    id: 897087,
    title: 'Salaar: Part 1 – Ceasefire',
    original_title: 'సలార్: పార్ట్ 1 - సీజ్ ఫైర్',
    overview: 'A gang leader makes a promise to a dying friend and takes on other criminal gangs in the dystopian city of Khansaar.',
    tagline: 'Rebellion has begun.',
    poster_path: '/m5pP0U3k9W2L8b7y5n0K2z1v8x.jpg',
    backdrop_path: '/b5m6n7v8k9l0j1h2g3f4e5d6c7.jpg',
    release_date: '2023-12-22',
    vote_average: 7.5,
    vote_count: 2400,
    popularity: 390.0,
    runtime: 175,
    original_language: 'te',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'A',
    cast: [
      { id: 11091, name: 'Prabhas', character: 'Deva / Salaar' },
      { id: 120933, name: 'Prithviraj Sukumaran', character: 'Varadharaja Mannaar' },
      { id: 53346, name: 'Shruti Haasan', character: 'Aadhya' },
    ],
  },
  {
    id: 939336,
    title: 'Hanu-Man',
    original_title: 'హను-మాన్',
    overview: 'An ordinary young man gets superpowers from an ancient mystical gemstone and must defend his village against ruthless forces.',
    tagline: 'An Indian superhero universe begins.',
    poster_path: '/5bB9Wn7V7H2e1k4y4m5L2b8V0zX.jpg',
    backdrop_path: '/4a7q7c11k9v0z4x3m8b7y5n2k1.jpg',
    release_date: '2024-01-12',
    vote_average: 7.9,
    vote_count: 2100,
    popularity: 350.0,
    runtime: 158,
    original_language: 'te',
    genres: [{ id: 28, name: 'Action' }, { id: 14, name: 'Fantasy' }, { id: 12, name: 'Adventure' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11095, name: 'Teja Sajja', character: 'Hanumanthu' },
      { id: 11096, name: 'Amritha Aiyer', character: 'Meenakshi' },
      { id: 11097, name: 'Varalaxmi Sarathkumar', character: 'Anjamma' },
    ],
  },
  {
    id: 1228580,
    title: 'The Raja Saab',
    original_title: 'ది రాజా సాబ్',
    overview: 'A romantic horror-comedy spectacle starring Prabhas as a charismatic man navigating royal mysteries and supernatural twists.',
    poster_path: '/8n5m4k3l2j1h0g9f8e7d6c5.jpg',
    backdrop_path: '/79vslsH5tD041eX3E3fJp2b4b4m.jpg',
    release_date: '2025-04-10',
    vote_average: 8.1,
    vote_count: 950,
    popularity: 410.0,
    runtime: 165,
    original_language: 'te',
    genres: [{ id: 27, name: 'Horror' }, { id: 35, name: 'Comedy' }, { id: 10749, name: 'Romance' }],
    status: 'upcoming',
    certification: 'UA',
    cast: [
      { id: 11091, name: 'Prabhas', character: 'Raja Saab' },
      { id: 11098, name: 'Malavika Mohanan', character: 'Maya' },
      { id: 11099, name: 'Nidhhi Agerwal', character: 'Pooja' },
    ],
  },

  // English / Hollywood
  {
    id: 693134,
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    tagline: 'Long live the fighters.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520b4q.jpg',
    release_date: '2024-03-01',
    vote_average: 8.3,
    vote_count: 5400,
    popularity: 520.0,
    runtime: 166,
    original_language: 'en',
    genres: [{ id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 1190668, name: 'Timothée Chalamet', character: 'Paul Atreides' },
      { id: 505710, name: 'Zendaya', character: 'Chani' },
      { id: 932, name: 'Rebecca Ferguson', character: 'Lady Jessica' },
    ],
  },
  {
    id: 533535,
    title: 'Deadpool & Wolverine',
    original_title: 'Deadpool & Wolverine',
    overview: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary behind him, until the TVA pulls him into a multiversal mission with Wolverine.',
    tagline: 'Everyone deserves a happy ending.',
    poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdrop_path: '/yD3aK9VvO1HkQ6G9MvG6y5w9w2.jpg',
    release_date: '2024-07-26',
    vote_average: 7.9,
    vote_count: 4800,
    popularity: 580.0,
    runtime: 128,
    original_language: 'en',
    genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 878, name: 'Science Fiction' }],
    status: 'now_playing',
    certification: 'A',
    cast: [
      { id: 10859, name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool' },
      { id: 6968, name: 'Hugh Jackman', character: 'Logan / Wolverine' },
    ],
  },
  {
    id: 872585,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II and the political fallout that followed.',
    tagline: 'The world forever changes.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    release_date: '2023-07-21',
    vote_average: 8.1,
    vote_count: 6200,
    popularity: 430.0,
    runtime: 180,
    original_language: 'en',
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 2037, name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
      { id: 5081, name: 'Emily Blunt', character: 'Katherine Oppenheimer' },
      { id: 3223, name: 'Robert Downey Jr.', character: 'Lewis Strauss' },
    ],
  },
  {
    id: 558449,
    title: 'Gladiator II',
    original_title: 'Gladiator II',
    overview: 'Years after witnessing the death of Maximus, Lucius must enter the Colosseum after his home is conquered by the tyrannical emperors who rule Rome.',
    tagline: 'What we do in life echoes in eternity.',
    poster_path: '/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    backdrop_path: '/euYIWhNWnzP2ipIP984218359.jpg',
    release_date: '2024-11-22',
    vote_average: 7.5,
    vote_count: 3100,
    popularity: 460.0,
    runtime: 148,
    original_language: 'en',
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'A',
    cast: [
      { id: 234352, name: 'Paul Mescal', character: 'Lucius' },
      { id: 1253360, name: 'Pedro Pascal', character: 'General Marcus Acacius' },
      { id: 5292, name: 'Denzel Washington', character: 'Macrinus' },
    ],
  },
  {
    id: 1184918,
    title: 'The Wild Robot',
    original_title: 'The Wild Robot',
    overview: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island and must learn to adapt to the harsh surroundings by bonding with wildlife.',
    poster_path: '/wTnV3PCVW5O92JMrFvvrRil39nM.jpg',
    backdrop_path: '/417tYZ4XUyJrdyZXWs3xw3D3b.jpg',
    release_date: '2024-09-27',
    vote_average: 8.4,
    vote_count: 3600,
    popularity: 380.0,
    runtime: 102,
    original_language: 'en',
    genres: [{ id: 16, name: 'Animation' }, { id: 878, name: 'Science Fiction' }, { id: 10751, name: 'Family' }],
    status: 'upcoming',
    certification: 'U',
    cast: [
      { id: 1267329, name: "Lupita Nyong'o", character: 'Roz (voice)' },
      { id: 1253360, name: 'Pedro Pascal', character: 'Fink (voice)' },
    ],
  },
  {
    id: 10227891,
    title: 'Inside Out 2',
    original_title: 'Inside Out 2',
    overview: 'Riley enters puberty, prompting Headquarters to undergo sudden demolition to make room for brand new Emotions: Anxiety, Envy, Ennui, and Embarrassment.',
    poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    backdrop_path: '/stKGOm8nekuQ0b7e411qPzclJ71.jpg',
    release_date: '2024-06-14',
    vote_average: 7.7,
    vote_count: 4500,
    popularity: 420.0,
    runtime: 96,
    original_language: 'en',
    genres: [{ id: 16, name: 'Animation' }, { id: 10751, name: 'Family' }, { id: 35, name: 'Comedy' }],
    status: 'now_playing',
    certification: 'U',
    cast: [
      { id: 2038, name: 'Amy Poehler', character: 'Joy (voice)' },
      { id: 5082, name: 'Maya Hawke', character: 'Anxiety (voice)' },
    ],
  },

  // Hindi / Bollywood
  {
    id: 8725850,
    title: 'Jawan',
    original_title: 'जवान',
    overview: 'A high-octane action thriller that outlines the emotional journey of a man who is set to rectify the wrongs in society while keeping a promise made years ago.',
    tagline: 'Ready or not.',
    poster_path: '/jYW3rGk7kEaPz772X5wK1y3sP2k.jpg',
    backdrop_path: '/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    release_date: '2023-09-07',
    vote_average: 7.5,
    vote_count: 3200,
    popularity: 390.0,
    runtime: 169,
    original_language: 'hi',
    genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 35742, name: 'Shah Rukh Khan', character: 'Vikram Rathore / Azad' },
      { id: 85382, name: 'Nayanthara', character: 'Narmada Rai' },
      { id: 85383, name: 'Vijay Sethupathi', character: 'Kaalie Gaikwad' },
    ],
  },
  {
    id: 1114513,
    title: 'Stree 2',
    original_title: 'स्त्री 2',
    overview: 'After the events of Stree, the town of Chanderi is haunted by a new headless ghost named Sarkata who abducts modern women.',
    tagline: 'O Stree protect us.',
    poster_path: '/9n5L0k6m4v8y2b7x1n3k5m7y.jpg',
    backdrop_path: '/8n5m4k3l2j1h0g9f8e7d6c5.jpg',
    release_date: '2024-08-15',
    vote_average: 7.8,
    vote_count: 2700,
    popularity: 470.0,
    runtime: 149,
    original_language: 'hi',
    genres: [{ id: 35, name: 'Comedy' }, { id: 27, name: 'Horror' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11081, name: 'Rajkummar Rao', character: 'Vicky' },
      { id: 11082, name: 'Shraddha Kapoor', character: 'Mystery Woman' },
      { id: 11083, name: 'Pankaj Tripathi', character: 'Rudra' },
    ],
  },
  {
    id: 11849180,
    title: '12th Fail',
    original_title: '12वीं फेल',
    overview: 'Based on the real-life story of IPS officer Manoj Kumar Sharma who fearlessly restarted his academic journey despite extreme poverty.',
    tagline: 'Restart.',
    poster_path: '/3k8h1n0v5y4m2b8x7k9l5m6y.jpg',
    backdrop_path: '/wTnV3PCVW5O92JMrFvvrRil39nM.jpg',
    release_date: '2023-10-27',
    vote_average: 8.5,
    vote_count: 2900,
    popularity: 380.0,
    runtime: 147,
    original_language: 'hi',
    genres: [{ id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'U',
    cast: [
      { id: 11084, name: 'Vikrant Massey', character: 'Manoj Kumar Sharma' },
      { id: 11085, name: 'Medha Shankr', character: 'Shraddha Joshi' },
    ],
  },
  {
    id: 781732,
    title: 'Animal',
    original_title: 'एनिमल',
    overview: 'A toxic and obsessive bond between a son and his emotionally unavailable father leads the son down a violent spiral of vengeance.',
    poster_path: '/hr9rjT5z4o5024Cq801931089.jpg',
    backdrop_path: '/zSWdZVtXT7Eb5n9q7k1m0v.jpg',
    release_date: '2023-12-01',
    vote_average: 6.9,
    vote_count: 3100,
    popularity: 360.0,
    runtime: 201,
    original_language: 'hi',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'A',
    cast: [
      { id: 11086, name: 'Ranbir Kapoor', character: 'Ranvijay Singh' },
      { id: 11087, name: 'Anil Kapoor', character: 'Balbir Singh' },
      { id: 11088, name: 'Rashmika Mandanna', character: 'Geetanjali' },
    ],
  },

  // Tamil / Kollywood
  {
    id: 1083862,
    title: 'Leo',
    original_title: 'லியோ',
    overview: 'Parthiban is a mild-mannered cafe owner in Thekkady who becomes a local hero, but his peaceful life is upended when a notorious cartel claims he is Leo Das.',
    tagline: 'Bloody sweet.',
    poster_path: '/pIQnJ58eU9n5sA1L2r1n0k9b4q.jpg',
    backdrop_path: '/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    release_date: '2023-10-19',
    vote_average: 7.6,
    vote_count: 2600,
    popularity: 370.0,
    runtime: 164,
    original_language: 'ta',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 88782, name: 'Thalapathy Vijay', character: 'Leo Das / Parthiban' },
      { id: 88783, name: 'Trisha Krishnan', character: 'Sathya' },
      { id: 35746, name: 'Sanjay Dutt', character: 'Antony Das' },
    ],
  },
  {
    id: 940551,
    title: 'Jailer',
    original_title: 'ஜெயிலர்',
    overview: 'A retired jailer goes on a ruthless manhunt to find his son’s killers, unleashing his legendary past upon an idol smuggling mafia.',
    tagline: 'Superstar unleashed.',
    poster_path: '/fiVW06jE7z9YnO4trhaMEdAhSiC.jpg',
    backdrop_path: '/xg27NrXi7vCGUrsqm7eg9vSM8eq.jpg',
    release_date: '2023-08-10',
    vote_average: 7.4,
    vote_count: 2300,
    popularity: 340.0,
    runtime: 168,
    original_language: 'ta',
    genres: [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 88784, name: 'Rajinikanth', character: 'Muthuvel Pandian' },
      { id: 88785, name: 'Vinayakan', character: 'Varman' },
    ],
  },
  {
    id: 1214484,
    title: 'Maharaja',
    original_title: 'மகாராஜா',
    overview: 'A quiet barber approaches the police to report that his dustbin "Lakshmi" was stolen, unravelling a chilling network of crime and vengeance.',
    poster_path: '/b8k7v6m5n4l3k2j1h0g9f8e7d6c.jpg',
    backdrop_path: '/7m3j8H5c8vP9L0k9q8v6m5k1n.jpg',
    release_date: '2024-06-14',
    vote_average: 8.4,
    vote_count: 2800,
    popularity: 390.0,
    runtime: 142,
    original_language: 'ta',
    genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 85383, name: 'Vijay Sethupathi', character: 'Maharaja' },
      { id: 88786, name: 'Anurag Kashyap', character: 'Selvam' },
    ],
  },

  // Malayalam / Mollywood
  {
    id: 1022789,
    title: 'Manjummel Boys',
    original_title: 'മഞ്ഞുമ്മൽ ബോയ്സ്',
    overview: 'A group of friends from a small town embark on a vacation to Kodaikanal, but things turn perilous when one of them falls into the treacherous depths of the Guna Caves.',
    poster_path: '/7m3j8H5c8vP9L0k9q8v6m5k1n.jpg',
    backdrop_path: '/xg27NrXi7vCGUrsqm7eg9vSM8eq.jpg',
    release_date: '2024-02-22',
    vote_average: 8.2,
    vote_count: 2100,
    popularity: 330.0,
    runtime: 135,
    original_language: 'ml',
    genres: [{ id: 12, name: 'Adventure' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'U',
    cast: [
      { id: 120931, name: 'Soubin Shahir', character: 'Kuttan' },
      { id: 120932, name: 'Sreenath Bhasi', character: 'Subhash' },
    ],
  },
  {
    id: 1249289,
    title: 'Aavesham',
    original_title: 'ആവേശം',
    overview: 'Three engineering students in Bengaluru face bullying from seniors and recruit an eccentric local gangster named Ranga to teach them a lesson.',
    tagline: 'Re-load your vibe.',
    poster_path: '/b7n6v5m4k3l2j1h0g9f8e7d6.jpg',
    backdrop_path: '/8n7v6m5k4l3j2h1g0f9e8d7.jpg',
    release_date: '2024-04-11',
    vote_average: 8.0,
    vote_count: 2200,
    popularity: 360.0,
    runtime: 158,
    original_language: 'ml',
    genres: [{ id: 35, name: 'Comedy' }, { id: 28, name: 'Action' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 11087, name: 'Fahadh Faasil', character: 'Ranga' },
      { id: 120934, name: 'Hipzster', character: 'Aju' },
    ],
  },
  {
    id: 1238580,
    title: 'Premalu',
    original_title: 'പ്രേമലു',
    overview: 'Sachin pursues romance in Hyderabad, leading to a series of hilarious mishaps and heartfelt moments in this blockbuster rom-com.',
    poster_path: '/6m5n4k3l2j1h0g9f8e7d6c5.jpg',
    backdrop_path: '/417tYZ4XUyJrdyZXWs3xw3D3b.jpg',
    release_date: '2024-02-09',
    vote_average: 7.9,
    vote_count: 1750,
    popularity: 290.0,
    runtime: 156,
    original_language: 'ml',
    genres: [{ id: 10749, name: 'Romance' }, { id: 35, name: 'Comedy' }],
    status: 'now_playing',
    certification: 'U',
    cast: [
      { id: 120935, name: 'Naslen K. Gafoor', character: 'Sachin' },
      { id: 120936, name: 'Mamitha Baiju', character: 'Reenu' },
    ],
  },

  // Kannada / Sandalwood
  {
    id: 507086,
    title: 'K.G.F: Chapter 2',
    original_title: 'ಕೆ.ಜಿ.ಎಫ್: ಅಧ್ಯಾಯ 2',
    overview: 'The blood-soaked land of Kolar Gold Fields has a new overlord now. Rocky, whose name strikes fear in the heart of his foes, must defend his territory.',
    tagline: 'Violence violence violence.',
    poster_path: '/kh0j0L0k9v1s0m5n9q7k.jpg',
    backdrop_path: '/22z8hp1q4hJk7F7i6DCB5X7g5bT.jpg',
    release_date: '2022-04-14',
    vote_average: 8.2,
    vote_count: 2600,
    popularity: 380.0,
    runtime: 168,
    original_language: 'kn',
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 130980, name: 'Yash', character: 'Rocky' },
      { id: 35746, name: 'Sanjay Dutt', character: 'Adheera' },
    ],
  },
  {
    id: 978931,
    title: 'Kantara',
    original_title: 'ಕಾಂತಾರ',
    overview: 'When greed paves the way for betrayal and deceit, a young tribal man reluctantly embraces his ancestors’ spiritual legacy to save the forest.',
    poster_path: '/b6pP6q8h2k9v1s0m5n9q7k.jpg',
    backdrop_path: '/zSWdZVtXT7Eb5n9q7k1m0v.jpg',
    release_date: '2022-09-30',
    vote_average: 8.1,
    vote_count: 2100,
    popularity: 310.0,
    runtime: 148,
    original_language: 'kn',
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    status: 'now_playing',
    certification: 'UA',
    cast: [
      { id: 130981, name: 'Rishab Shetty', character: 'Shiva' },
      { id: 130982, name: 'Sapthami Gowda', character: 'Leela' },
    ],
  },

  // Korean / International
  {
    id: 496243,
    title: 'Parasite',
    original_title: '기생충',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/hiKmpZMGZsrkA3cdFiF8Pf4TeeC.jpg',
    release_date: '2019-05-30',
    vote_average: 8.5,
    vote_count: 5900,
    popularity: 330.0,
    runtime: 132,
    original_language: 'ko',
    genres: [{ id: 53, name: 'Thriller' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
    status: 'now_playing',
    certification: 'A',
    cast: [
      { id: 20738, name: 'Song Kang-ho', character: 'Kim Ki-taek' },
      { id: 13458, name: 'Lee Sun-kyun', character: 'Park Dong-ik' },
    ],
  },
];

const getApiKey = () => process.env.TMDB_API_KEY || 'a01999141f43c22037f2463bd0c48144';
const getBaseUrl = () => process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// Helper to make TMDB HTTP requests with caching & fallback
const fetchFromTMDB = async (endpoint, params = {}, cacheKey, ttlMs) => {
  if (cacheKey) {
    const cached = getCache(cacheKey);
    if (cached) return cached;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await axios.get(`${getBaseUrl()}${endpoint}`, {
      params: {
        api_key: apiKey,
        language: 'en-US', // localized metadata in English for global accessibility
        ...params,
      },
      timeout: 8000,
    });

    if (cacheKey && response.data) {
      setCache(cacheKey, response.data, ttlMs);
    }
    return response.data;
  } catch (error) {
    console.warn(`[TMDB API] Request to ${endpoint} failed (${error.message}). Falling back to cached/fallback catalog.`);
    return null;
  }
};

const UNREALISTIC_TITLES = new Set([
  'the mongoose',
  'colony',
  'mutiny',
  'zip wire',
  'the end of oak street',
  'spider-man: brand new day',
  'coyote vs. acme',
  'digger',
  'street fighter',
  'udta teer',
  'heart of the beast',
  'resident evil',
  'modha rathri',
  'forgotten island',
  'fall 2: deadpoint',
  'hope',
  'insidious: out of the further',
  'the uprising',
  'the paradise',
  'the dark heaven',
  'bethlehem kudumba unit',
  'the vvaan',
  'irumudi',
  'primetime',
  'tony',
]);

const isRealisticMovie = (m) => {
  if (!m || !m.title || !m.poster_path) return false;
  const titleLower = m.title.trim().toLowerCase();
  if (UNREALISTIC_TITLES.has(titleLower)) return false;
  return true;
};

// Formats movie object, converts image paths to full URLs and expands genre_ids
export const formatMovieImages = (movie) => {
  if (!movie) return null;

  const poster = movie.poster_path
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`)
    : (movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');

  const backdrop = movie.backdrop_path
    ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}`)
    : (movie.backdrop_url || poster);

  // Resolve genre objects if only genre_ids are provided
  let genres = movie.genres;
  if (!genres && movie.genre_ids && Array.isArray(movie.genre_ids)) {
    genres = movie.genre_ids.map((id) => ({
      id,
      name: GENRE_MAP[id] || 'Cinema',
    }));
  }

  const languageCode = (movie.original_language || 'en').toLowerCase();
  const languageName = LANGUAGE_NAMES[languageCode] || languageCode.toUpperCase();
  const rawVote = typeof movie.vote_average === 'number' ? movie.vote_average : 7.8;
  const sanitizedVote = Math.round(rawVote * 10) / 10;

  return {
    ...movie,
    id: movie.id,
    title: movie.title || movie.original_title || 'Untitled Feature',
    original_title: movie.original_title || movie.title,
    overview: movie.overview || 'Experience the cinematic spectacle in state-of-the-art auditoriums with Dolby Atmos audio.',
    poster_url: poster,
    backdrop_url: backdrop,
    genres: genres || [{ id: 0, name: 'Feature Film' }],
    original_language: languageCode,
    language_name: languageName,
    vote_average: sanitizedVote,
    release_date: movie.release_date || '2024-01-01',
    certification: movie.certification || (sanitizedVote > 7.8 ? 'UA' : 'U'),
  };
};

export const tmdbService = {
  // 1. Discover Movies with rich filters (Language, Genre, Year, Sort, Region)
  async discoverMovies({
    page = 1,
    with_original_language = '',
    with_genres = '',
    primary_release_year = '',
    sort_by = 'popularity.desc',
    region = '',
  } = {}) {
    const params = {
      page,
      sort_by: sort_by || 'popularity.desc',
      include_adult: false,
    };

    if (with_original_language && with_original_language !== 'all') {
      params.with_original_language = with_original_language;
    }

    let targetGenreId = null;
    if (with_genres && with_genres !== 'All' && with_genres !== 'all') {
      const normalized = String(with_genres).trim().toLowerCase();
      targetGenreId = !isNaN(with_genres) ? Number(with_genres) : (GENRE_NAME_TO_ID[normalized] || null);
      if (targetGenreId) {
        params.with_genres = targetGenreId;
      }
    }

    if (primary_release_year && primary_release_year !== 'All' && primary_release_year !== 'all') {
      params.primary_release_year = primary_release_year;
    }

    if (region) {
      params.region = region;
    }

    const cacheKey = `discover_lang_${with_original_language}_genre_${with_genres}_yr_${primary_release_year}_sort_${sort_by}_p_${page}`;
    const data = await fetchFromTMDB('/discover/movie', params, cacheKey, 10 * 60 * 1000);

    let matchingCatalog = [...FALLBACK_MOVIES];
    if (with_original_language && with_original_language !== 'all') {
      const langLower = with_original_language.toLowerCase();
      matchingCatalog = matchingCatalog.filter((m) => m.original_language.toLowerCase() === langLower);
    }
    if (with_genres && with_genres !== 'All' && with_genres !== 'all') {
      const gLower = String(with_genres).toLowerCase();
      matchingCatalog = matchingCatalog.filter((m) =>
        m.genres?.some((g) => (typeof g === 'string' ? g : g.name).toLowerCase().includes(gLower) || (targetGenreId && g.id === targetGenreId))
      );
    }

    if (data && data.results && data.results.length > 0) {
      const validResults = data.results.filter(isRealisticMovie).map(formatMovieImages);
      // Put matching curated blockbusters first, then valid live results without duplicates
      const combined = [...matchingCatalog.map(formatMovieImages)];
      for (const cur of validResults) {
        if (!combined.some((m) => m.id === cur.id || m.title.toLowerCase() === cur.title.toLowerCase())) {
          combined.push(cur);
        }
      }

      if (combined.length > 0) {
        return {
          page: data.page,
          results: combined,
          total_pages: data.total_pages,
          total_results: data.total_results || combined.length,
        };
      }
    }

    // Fallback return
    return {
      page: 1,
      results: (matchingCatalog.length > 0 ? matchingCatalog : FALLBACK_MOVIES.slice(0, 8)).map(formatMovieImages),
      total_pages: 1,
      total_results: matchingCatalog.length || FALLBACK_MOVIES.length,
    };
  },

  // 2. Get Movies by Specific Language (e.g. 'te', 'hi', 'ta', 'ml', 'kn', 'en')
  async getMoviesByLanguage(languageCode, page = 1) {
    return this.discoverMovies({
      page,
      with_original_language: languageCode,
      sort_by: 'popularity.desc',
    });
  },

  // 3. Search Movies across titles, keywords & alternative names
  async searchMovies(query, page = 1, options = {}) {
    if (!query || !query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    const params = {
      query: query.trim(),
      page,
      include_adult: false,
    };

    if (options.primary_release_year) {
      params.primary_release_year = options.primary_release_year;
    }

    if (options.region) {
      params.region = options.region;
    }

    const cacheKey = `search_${encodeURIComponent(query.toLowerCase())}_p${page}_${options.primary_release_year || ''}`;
    const data = await fetchFromTMDB('/search/movie', params, cacheKey, 5 * 60 * 1000);

    const q = query.toLowerCase();
    const curatedMatches = FALLBACK_MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.original_title && m.original_title.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q))
    ).map(formatMovieImages);

    if (data && data.results && data.results.length > 0) {
      let results = data.results.filter(isRealisticMovie).map(formatMovieImages);

      if (options.with_original_language && options.with_original_language !== 'all') {
        const langFilter = options.with_original_language.toLowerCase();
        results = results.filter((m) => m.original_language === langFilter);
      }

      // Merge curated matches first
      const merged = [...curatedMatches];
      for (const r of results) {
        if (!merged.some((m) => m.id === r.id || m.title.toLowerCase() === r.title.toLowerCase())) {
          merged.push(r);
        }
      }

      return {
        page: data.page,
        results: merged,
        total_pages: data.total_pages,
        total_results: data.total_results || merged.length,
      };
    }

    return {
      page: 1,
      results: curatedMatches.length > 0 ? curatedMatches : FALLBACK_MOVIES.slice(0, 6).map(formatMovieImages),
      total_pages: 1,
      total_results: curatedMatches.length || 6,
    };
  },

  // 4. Get Now Playing Movies (Curated Blockbusters)
  async getNowPlaying(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'popularity.desc',
      });
    }

    const nowPlayingCurated = FALLBACK_MOVIES.filter((m) => m.status === 'now_playing').map(formatMovieImages);
    return {
      page: 1,
      results: nowPlayingCurated,
      total_pages: 1,
      total_results: nowPlayingCurated.length,
    };
  },

  // 5. Get Popular Movies
  async getPopular(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'popularity.desc',
      });
    }

    const popularCurated = FALLBACK_MOVIES.map(formatMovieImages);
    return {
      page: 1,
      results: popularCurated,
      total_pages: 1,
      total_results: popularCurated.length,
    };
  },

  // 6. Get Upcoming Movies
  async getUpcoming(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'primary_release_date.desc',
      });
    }

    const upcomingCurated = FALLBACK_MOVIES.filter(
      (m) => m.status === 'upcoming' || new Date(m.release_date) >= new Date('2024-09-01')
    ).map(formatMovieImages);

    return {
      page: 1,
      results: upcomingCurated.length > 0 ? upcomingCurated : FALLBACK_MOVIES.slice(0, 6).map(formatMovieImages),
      total_pages: 1,
      total_results: upcomingCurated.length || 6,
    };
  },

  // 7. Get Top Rated Movies
  async getTopRated(page = 1, options = {}) {
    if (options.with_original_language && options.with_original_language !== 'all') {
      return this.discoverMovies({
        page,
        with_original_language: options.with_original_language,
        sort_by: 'vote_average.desc',
      });
    }

    const topRated = [...FALLBACK_MOVIES].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).map(formatMovieImages);
    return {
      page: 1,
      results: topRated,
      total_pages: 1,
      total_results: topRated.length,
    };
  },

  // 8. Get Movie Details (Full metadata with cast, crew, videos)
  async getMovieDetails(tmdbId) {
    const id = Number(tmdbId);
    const cacheKey = `movie_details_${id}`;
    const data = await fetchFromTMDB(
      `/movie/${id}`,
      { append_to_response: 'credits,videos' },
      cacheKey,
      60 * 60 * 1000
    );

    if (data && data.title && isRealisticMovie(data)) {
      const trailer = data.videos?.results?.find(
        (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
      );
      return formatMovieImages({
        ...data,
        trailerKey: trailer ? trailer.key : 'Way9Dexny3w',
        cast: data.credits?.cast?.slice(0, 10).map((c) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profile_path: c.profile_path,
          profile_url: c.profile_path ? `${TMDB_IMAGE_BASE_URL}/w185${c.profile_path}` : null,
        })) || [],
      });
    }

    // Fallback match
    const fallback = FALLBACK_MOVIES.find((m) => m.id === id) || FALLBACK_MOVIES[0];
    return formatMovieImages({
      ...fallback,
      id: fallback.id,
      trailerKey: 'Way9Dexny3w',
      cast: (fallback.cast || []).map((c) => ({
        ...c,
        profile_url: c.profile_path ? `${TMDB_IMAGE_BASE_URL}/w185${c.profile_path}` : null,
      })),
    });
  },

  // 9. Get Movie Genres
  async getGenres() {
    const cacheKey = 'genres_list';
    const data = await fetchFromTMDB('/genre/movie/list', {}, cacheKey, 24 * 60 * 60 * 1000);
    if (data && data.genres) {
      return data.genres;
    }
    return Object.entries(GENRE_MAP).map(([id, name]) => ({
      id: Number(id),
      name,
    }));
  },
};
