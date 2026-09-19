/**
 * Journal data — long-form editorial content. Adding an article means
 * adding an entry here plus images in scripts/image-manifest.mjs.
 */

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'image'; src: string; caption?: string };

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO
  excerpt: string;
  hero: string;
  intro: string;
  body: ArticleBlock[];
  relatedProjects: string[]; // project slugs
}

export const articles: Article[] = [
  {
    slug: 'chasing-the-light',
    title: 'Chasing the Light',
    category: 'Process',
    date: '2026-03-14',
    excerpt:
      'On working with whatever the weather gives you, and why I stopped bringing a lighting kit to editorial shoots.',
    hero: 'journal/chasing-the-light/hero',
    intro:
      'Every photograph I have ever loved was made with light I did not control. This is a note on surrender — on arriving early, watching longer, and letting the room decide.',
    body: [
      {
        type: 'p',
        text: 'For years I travelled with a case of strobes and a bag of modifiers, convinced that control was the same thing as quality. The turning point came on a grey afternoon in Lisbon, when the power in our rented studio failed and we had forty minutes of window light to make the story work. Those frames outlived everything else we shot that week.',
      },
      {
        type: 'image',
        src: 'journal/chasing-the-light/01',
        caption: 'Window light, borrowed studio, Lisbon',
      },
      { type: 'h2', text: 'Arrive before you are needed' },
      {
        type: 'p',
        text: 'The useful skill is not reading light — it is patience. I now arrive ninety minutes early to every location and spend the first hour not photographing at all. I watch where the sun will land, which walls hold shadow longest, where the floor goes bright. By the time the subject arrives, the room has already told me where to stand.',
      },
      {
        type: 'quote',
        text: 'The room has already told me where to stand. My job is to have listened.',
      },
      {
        type: 'p',
        text: 'None of this is romantic in practice. It means cold mornings and a lot of frames that fail. But the failures cost nothing, and the frames that work carry something a strobe cannot fake: the feeling that the photograph happened rather than was made.',
      },
      {
        type: 'image',
        src: 'journal/chasing-the-light/02',
      },
    ],
    relatedProjects: ['the-quiet-hour', 'new-york-after-dark'],
  },
  {
    slug: 'notes-from-new-york',
    title: 'Notes from New York',
    category: 'Locations',
    date: '2026-01-28',
    excerpt:
      'Field notes from four winters shooting the city after midnight — where the light pools, and which streets stay honest.',
    hero: 'journal/notes-from-new-york/hero',
    intro:
      'New York After Dark took four winters. These are the working notes — the corners that kept giving, and the hours when the city finally stops performing.',
    body: [
      {
        type: 'p',
        text: 'Between 2 and 5 am the city becomes a different instrument. The avenues empty, the sodium light pools on wet asphalt, and the people you do meet have nowhere left to hurry to. I worked almost exclusively between 23rd and 14th streets, west side, where the grid tilts just enough to hold reflections.',
      },
      {
        type: 'image',
        src: 'journal/notes-from-new-york/01',
        caption: 'Ninth Avenue, 4 am',
      },
      {
        type: 'p',
        text: 'The technical notes are boring, which is the point: a fast prime, a high tolerance for grain, and no tripod. A tripod is a claim on territory; a camera at chest height is a conversation. The moment you set up a tripod on a New York sidewalk, the photograph you came for leaves.',
      },
      {
        type: 'image',
        src: 'journal/notes-from-new-york/02',
      },
    ],
    relatedProjects: ['new-york-after-dark', 'portraits-of-strangers'],
  },
  {
    slug: 'the-tools-i-carry',
    title: 'The Tools I Carry',
    category: 'Equipment',
    date: '2025-11-02',
    excerpt:
      'The honest gear list — two cameras, three lenses, and why the bag gets lighter every year.',
    hero: 'journal/the-tools-i-carry/hero',
    intro:
      'Every year the bag gets lighter. What remains after a decade of editing it down: two bodies, three focal lengths, and a lot of spare batteries.',
    body: [
      {
        type: 'p',
        text: 'A 35mm equivalent stays on the camera ninety percent of the time. It is the focal length of memory — close enough to be intimate, wide enough to keep the room in the story. The 50mm comes out for portraits when the subject needs air. The 28mm lives in the bag for architecture, and mostly stays there.',
      },
      { type: 'image', src: 'journal/the-tools-i-carry/01', caption: 'The working kit, such as it is' },
      {
        type: 'p',
        text: 'The best piece of equipment I own is a small notebook. Everything else is replaceable.',
      },
    ],
    relatedProjects: ['form-and-void'],
  },
  {
    slug: 'behind-silk-and-shadow',
    title: 'Behind the Scenes: Silk & Shadow',
    category: 'Behind the Scenes',
    date: '2025-09-19',
    excerpt:
      'How the Milan editorial came together — one window, four metres of matte silk, and a rule that nothing in the frame could shine.',
    hero: 'journal/behind-silk-and-shadow/hero',
    intro:
      'The brief from the magazine was one word: restraint. What we built was a single window, raw plaster walls, and a rule that nothing in the frame was allowed to shine.',
    body: [
      {
        type: 'p',
        text: 'We shot in a nineteenth-century building off Via Tortona where the plaster had not been repainted since the seventies. The art director and I agreed on the first morning: no gloss, no chrome, no jewellery that caught light. Every surface in frame had to absorb rather than reflect.',
      },
      {
        type: 'image',
        src: 'journal/behind-silk-and-shadow/01',
        caption: 'Matte silk against raw plaster',
      },
      { type: 'h2', text: 'The pause between frames' },
      {
        type: 'p',
        text: 'We shot slowly — maybe forty frames a look. The model understood the brief instinctively: stillness is not the absence of movement but the presence of weight. The best frames were made in the pause after she settled, when the silk had finished falling.',
      },
      {
        type: 'image',
        src: 'journal/behind-silk-and-shadow/02',
      },
    ],
    relatedProjects: ['silk-and-shadow'],
  },
];

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
