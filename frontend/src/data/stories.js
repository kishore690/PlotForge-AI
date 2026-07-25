export const genres = [
  'Fantasy', 'Adventure', 'Romance', 'Mystery', 'Thriller',
  'Sci-Fi', 'Comedy', 'Horror', 'Historical', 'Mythology', 'Crime',
];

export const lengths = ['Short', 'Medium', 'Long'];
export const styles = ['Dark', 'Funny', 'Emotional', 'Inspirational', 'Cinematic', 'Poetic'];
export const audiences = ['Kids', 'Teen', 'Adult'];
export const languages = ['English', 'Hindi', 'Kannada'];
export const complexities = ['Simple', 'Moderate', 'Complex'];

export const stories = [
  {
    id: 's1',
    title: 'The Ember Throne',
    genre: 'Fantasy',
    cover: 'linear-gradient(135deg,#3a0d0d,#0f0505)',
    createdAt: '2026-07-18',
    readingTime: 14,
    progress: 62,
    favorite: true,
    excerpt: 'A forgotten heir wakes an ember-god sleeping beneath the capital, and the throne itself begins to burn.',
  },
  {
    id: 's2',
    title: 'Static Hours',
    genre: 'Sci-Fi',
    cover: 'linear-gradient(135deg,#0d1f3a,#050a0f)',
    createdAt: '2026-07-15',
    readingTime: 9,
    progress: 100,
    favorite: false,
    excerpt: 'On a colony ship where time runs slower each day, a technician finds a message sent from her own future.',
  },
  {
    id: 's3',
    title: 'The Cartographer\'s Widow',
    genre: 'Mystery',
    cover: 'linear-gradient(135deg,#241a3a,#0a0510)',
    createdAt: '2026-07-10',
    readingTime: 21,
    progress: 30,
    favorite: true,
    excerpt: 'She inherits her late husband\'s maps — every one of them missing the same street.',
  },
  {
    id: 's4',
    title: 'Marigold & Ruin',
    genre: 'Romance',
    cover: 'linear-gradient(135deg,#3a0d24,#0f0508)',
    createdAt: '2026-07-02',
    readingTime: 12,
    progress: 0,
    favorite: false,
    excerpt: 'Two rival florists, one dying garden, and a bet that neither of them wanted to lose.',
  },
  {
    id: 's5',
    title: 'The Hollow Choir',
    genre: 'Horror',
    cover: 'linear-gradient(135deg,#1a0d3a,#05050a)',
    createdAt: '2026-06-28',
    readingTime: 17,
    progress: 45,
    favorite: false,
    excerpt: 'A village that stopped singing generations ago is asked, one more time, to open its mouth.',
  },
  {
    id: 's6',
    title: 'Bronze & Brine',
    genre: 'Mythology',
    cover: 'linear-gradient(135deg,#3a2a0d,#0f0a05)',
    createdAt: '2026-06-20',
    readingTime: 26,
    progress: 88,
    favorite: true,
    excerpt: 'The last bronze golem of a drowned city is dredged up, still holding its maker\'s final instruction.',
  },
];

export const sampleChapters = [
  {
    id: 'c1',
    title: 'Chapter One — The Waking Ember',
    content: `The throne room had not held heat in three hundred years, yet Isla felt it now — a warmth rising through the marble like breath through a sleeping chest.

She should not have been there. The keys had been her mother's, and her mother had been dead a week, and grief made people do foolish, trespassing things.

The ember-god did not wake with a roar. It woke the way coals do: a dim brightening at the edges, a heat you feel before you understand its source. Isla pressed her palm to the throne's blackened armrest and felt something press back.

"You're late," said a voice that was not a voice, more a warmth arranging itself into words. "Your line always is."`,
  },
  {
    id: 'c2',
    title: 'Chapter Two — What the Throne Remembers',
    content: `Outside, the capital slept on, unaware that its foundations had just remembered how to burn.

Isla withdrew her hand, and the warmth did not follow — it waited, patient as embers always are. "My line," she repeated. "You knew my mother."

"I knew every one of them," the throne said. "I have been waiting for the day one of you would be desperate enough, or foolish enough, to come looking with the key instead of asking for one."

She thought of her mother's last letter, unopened on the kitchen table. She thought of the capital's granaries, half-empty for a second winter. She thought, foolishly, that warmth was better than nothing at all.

"Then let's begin," Isla said, "before I change my mind."`,
  },
];
