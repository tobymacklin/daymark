/**
 * Hobby collections and their achievements.
 *
 * Unlike daily experiences, achievements may take real time, materials and
 * money, so each one states its estimated time and cost up front. Rarity
 * reflects the size of the accomplishment and sets the XP: Bronze 50, Silver
 * 150, Gold 300, Platinum 500, Legendary 1,000.
 *
 * To add content: append an achievement with a slug unique within its
 * collection, a `motif` that exists in src/components/achievements/motifs.tsx,
 * and optional `requires` slugs from the same collection. Entries are upserted
 * by slug on startup.
 */

export type Rarity = "bronze" | "silver" | "gold" | "platinum" | "legendary";

export const RARITY_XP: Record<Rarity, number> = {
  bronze: 50,
  silver: 150,
  gold: 300,
  platinum: 500,
  legendary: 1000,
};

/** XP awarded once when every achievement in a collection is unlocked. */
export const MASTERY_XP = 500;

export type CollectionTheme = "baker" | "bookworm" | "photographer";

export type SeedAchievement = {
  slug: string;
  title: string;
  description: string;
  /** What counts as having done it. */
  criteria: string[];
  rarity: Rarity;
  time: string;
  cost: string;
  materials?: string[];
  safety?: string;
  /** Slugs of achievements in the same collection that must be unlocked first. */
  requires?: string[];
  motif: string;
};

export type SeedCollection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  theme: CollectionTheme;
  emblem: string;
  achievements: SeedAchievement[];
};

const OVEN_SAFETY = "Hot oven and trays. Use oven gloves and keep children at a safe distance.";

export const SEED_COLLECTIONS: SeedCollection[] = [
  {
    slug: "bookworm",
    name: "The Bookworm",
    tagline: "Read beyond your usual shelf",
    description:
      "Ten reading accomplishments, from a single finished book to a lifetime habit. Library books, borrowed books and audiobooks all count.",
    theme: "bookworm",
    emblem: "emblem-bookworm",
    achievements: [
      {
        slug: "first-chapter",
        title: "First Chapter",
        description: "Finish your first tracked book.",
        criteria: [
          "You read or listened to one whole book, start to finish.",
          "Any length, any format, any genre.",
        ],
        rarity: "bronze",
        time: "A few evenings to a few weeks",
        cost: "Free with a library card",
        materials: ["One book, in any format"],
        motif: "open-book",
      },
      {
        slug: "off-the-usual-shelf",
        title: "Off the Usual Shelf",
        description: "Read a book from a genre you never choose.",
        criteria: [
          "The book belongs to a genre you have not read in the last few years.",
          "You finished it, whether or not you enjoyed it.",
        ],
        rarity: "bronze",
        time: "One to three weeks",
        cost: "Free with a library card",
        materials: ["One book from an unfamiliar genre"],
        motif: "leaning-book",
      },
      {
        slug: "word-of-mouth",
        title: "Word of Mouth",
        description: "Read a book a friend recommended to you.",
        criteria: [
          "Someone you know recommended it to you personally.",
          "You finished it and told them what you thought.",
        ],
        rarity: "bronze",
        time: "One to three weeks",
        cost: "Free if borrowed",
        materials: ["A recommendation and the book"],
        motif: "speech-book",
      },
      {
        slug: "second-wind",
        title: "Second Wind",
        description: "Finish a book you once abandoned.",
        criteria: [
          "You had started this book before and given up.",
          "This time you reached the last page.",
        ],
        rarity: "bronze",
        time: "One to three weeks",
        cost: "Free: you probably still own it",
        materials: ["The book you put down"],
        motif: "bookmark-return",
      },
      {
        slug: "old-soul",
        title: "Old Soul",
        description: "Read a classic novel.",
        criteria: [
          "The novel was first published at least a hundred years ago.",
          "You read the full text, not an abridged edition.",
        ],
        rarity: "silver",
        time: "Two to six weeks",
        cost: "Free: most classics are in the public domain",
        materials: ["One classic novel"],
        motif: "quill",
      },
      {
        slug: "in-translation",
        title: "In Translation",
        description: "Read a book originally written in another language.",
        criteria: [
          "The book was first written in a language other than the one you read it in.",
          "You know which language, and who translated it.",
        ],
        rarity: "silver",
        time: "Two to four weeks",
        cost: "Free with a library card",
        materials: ["One translated book"],
        motif: "globe",
      },
      {
        slug: "new-territory",
        title: "New Territory",
        description: "Finish a nonfiction book about a subject you know nothing about.",
        criteria: [
          "The subject was unfamiliar to you when you started.",
          "You can now explain one idea from it to someone else.",
        ],
        rarity: "silver",
        time: "Two to four weeks",
        cost: "Free with a library card",
        materials: ["One nonfiction book"],
        motif: "lightbulb",
      },
      {
        slug: "double-digits",
        title: "Double Digits",
        description: "Finish ten books.",
        criteria: [
          "Ten complete books since you started keeping track.",
          "Rereads count once each.",
        ],
        rarity: "gold",
        time: "Several months",
        cost: "Free with a library card",
        materials: ["A list of what you have read"],
        requires: ["first-chapter"],
        motif: "book-stack",
      },
      {
        slug: "five-shelves",
        title: "Five Shelves",
        description: "Read books from five different genres.",
        criteria: [
          "Five finished books, each from a different genre.",
          "At least two of the genres were new to you.",
        ],
        rarity: "platinum",
        time: "Several months",
        cost: "Free with a library card",
        materials: ["A list of what you have read"],
        requires: ["off-the-usual-shelf"],
        motif: "five-spines",
      },
      {
        slug: "the-long-read",
        title: "The Long Read",
        description: "Read fifty books over time.",
        criteria: [
          "Fifty complete books since you started keeping track.",
          "There is no deadline. This one is meant to take years.",
        ],
        rarity: "legendary",
        time: "Years",
        cost: "Free with a library card",
        materials: ["A list of what you have read"],
        requires: ["double-digits"],
        motif: "library-arch",
      },
    ],
  },
  {
    slug: "baker",
    name: "The Baker",
    tagline: "Create something from scratch",
    description:
      "Ten bakes that build on each other, from a first tray of cookies to a recipe that is entirely your own.",
    theme: "baker",
    emblem: "emblem-baker",
    achievements: [
      {
        slug: "cookie-rookie",
        title: "Cookie Rookie",
        description: "Bake a batch of cookies.",
        criteria: ["You mixed the dough yourself, not from a ready-made roll.", "A full tray came out of the oven."],
        rarity: "bronze",
        time: "About 45 minutes",
        cost: "Under $10 in ingredients",
        materials: ["Flour, butter, sugar, an egg", "A baking tray", "An oven"],
        safety: OVEN_SAFETY,
        motif: "cookie",
      },
      {
        slug: "bread-winner",
        title: "Bread Winner",
        description: "Bake a loaf of bread.",
        criteria: ["You made a yeasted dough and let it rise.", "One baked loaf, whatever its shape."],
        rarity: "bronze",
        time: "3 to 4 hours, mostly waiting",
        cost: "Under $5 in ingredients",
        materials: ["Bread flour, yeast, salt", "A loaf tin or baking tray", "An oven"],
        safety: OVEN_SAFETY,
        motif: "loaf",
      },
      {
        slug: "muffin-maker",
        title: "Muffin Maker",
        description: "Bake a batch of muffins.",
        criteria: ["You made the batter from separate ingredients.", "At least six muffins, any flavour."],
        rarity: "bronze",
        time: "About 40 minutes",
        cost: "Under $10 in ingredients",
        materials: ["Flour, sugar, egg, milk, oil or butter", "A muffin tin and cases", "An oven"],
        safety: OVEN_SAFETY,
        motif: "muffin",
      },
      {
        slug: "kitchen-explorer",
        title: "Kitchen Explorer",
        description: "Try a baking recipe you have never attempted.",
        criteria: [
          "The recipe was new to you, with at least one unfamiliar technique or ingredient.",
          "You followed it through to the end, whatever the result.",
        ],
        rarity: "bronze",
        time: "1 to 2 hours",
        cost: "Under $15 in ingredients",
        materials: ["A recipe you have not made before", "Whatever it calls for"],
        safety: OVEN_SAFETY,
        motif: "whisk",
      },
      {
        slug: "dough-developer",
        title: "Dough Developer",
        description: "Make homemade pizza dough.",
        criteria: [
          "You made and kneaded the dough yourself.",
          "You shaped it and baked at least one pizza on it.",
        ],
        rarity: "silver",
        time: "2 to 3 hours, mostly rising",
        cost: "Under $10 in ingredients",
        materials: ["Flour, yeast, salt, olive oil", "Toppings of your choice", "A hot oven"],
        safety: "Very hot oven. Use oven gloves and take care sliding the pizza in and out.",
        motif: "rolling-pin",
      },
      {
        slug: "rise-and-shine",
        title: "Rise and Shine",
        description: "Bake cinnamon rolls.",
        criteria: [
          "You made an enriched dough, rolled it with filling and cut the spirals.",
          "A tray of baked rolls.",
        ],
        rarity: "silver",
        time: "3 to 4 hours, mostly rising",
        cost: "Under $15 in ingredients",
        materials: ["Flour, yeast, butter, milk, sugar, cinnamon", "A baking dish", "An oven"],
        safety: OVEN_SAFETY,
        motif: "spiral-roll",
      },
      {
        slug: "layer-by-layer",
        title: "Layer by Layer",
        description: "Bake and decorate a multilayer cake.",
        criteria: [
          "A cake with at least two baked layers.",
          "Filling between the layers.",
          "Frosting or decoration on the outside.",
        ],
        rarity: "silver",
        time: "3 to 4 hours",
        cost: "$15 to $25 in ingredients",
        materials: ["Cake ingredients", "Two cake tins", "Frosting and a palette knife or butter knife"],
        safety: OVEN_SAFETY,
        motif: "layer-cake",
      },
      {
        slug: "french-connection",
        title: "French Connection",
        description: "Make French macarons.",
        criteria: [
          "Meringue-based shells that you piped and baked.",
          "Shells sandwiched with a filling.",
          "Cracked or lopsided ones still count.",
        ],
        rarity: "gold",
        time: "3 hours, plus resting",
        cost: "$15 to $25 in ingredients",
        materials: ["Ground almonds, icing sugar, egg whites", "A piping bag", "Kitchen scales"],
        safety: OVEN_SAFETY,
        motif: "macaron",
      },
      {
        slug: "sourdough-specialist",
        title: "Sourdough Specialist",
        description: "Bake a loaf using a sourdough starter.",
        criteria: [
          "The loaf was raised by a live starter, with no commercial yeast.",
          "You fed the starter yourself, whether you grew it or were given it.",
        ],
        rarity: "gold",
        time: "About a week for a new starter, then two days for the loaf",
        cost: "Under $10 in flour",
        materials: ["Bread flour and water", "A jar for the starter", "A lidded pot or baking stone"],
        safety: "A preheated pot is extremely hot. Use thick oven gloves.",
        requires: ["bread-winner"],
        motif: "boule",
      },
      {
        slug: "signature-baker",
        title: "Signature Baker",
        description: "Develop and document an original baking recipe.",
        criteria: [
          "The recipe is your own: not an adaptation of a single existing one.",
          "You baked it at least twice, changing something between attempts.",
          "It is written down clearly enough for someone else to follow.",
        ],
        rarity: "legendary",
        time: "Several weeks of attempts",
        cost: "Varies with your recipe",
        materials: ["A notebook", "Ingredients for repeated attempts"],
        safety: OVEN_SAFETY,
        requires: ["kitchen-explorer", "layer-by-layer"],
        motif: "toque",
      },
    ],
  },
  {
    slug: "photographer",
    name: "The Photographer",
    tagline: "See ordinary things differently",
    description:
      "Ten ways of looking, from one sunrise to a portfolio. Any camera counts, including the one on your phone.",
    theme: "photographer",
    emblem: "emblem-photographer",
    achievements: [
      {
        slug: "first-light",
        title: "First Light",
        description: "Capture a sunrise.",
        criteria: ["A photograph taken within about half an hour of sunrise.", "The sky or its light is the subject."],
        rarity: "bronze",
        time: "One early morning",
        cost: "Free",
        materials: ["Any camera", "An alarm clock"],
        safety: "Never look at the sun through a camera lens or viewfinder.",
        motif: "sunrise",
      },
      {
        slug: "mirror-mirror",
        title: "Mirror Mirror",
        description: "Photograph an interesting reflection.",
        criteria: [
          "The reflection is the subject, not an accident.",
          "Water, glass, metal and puddles all count.",
        ],
        rarity: "bronze",
        time: "About 30 minutes",
        cost: "Free",
        materials: ["Any camera"],
        motif: "reflection",
      },
      {
        slug: "shadow-play",
        title: "Shadow Play",
        description: "Capture an interesting shadow.",
        criteria: ["A photograph in which a shadow is the main subject.", "The shape or pattern of the shadow is clear."],
        rarity: "bronze",
        time: "About 30 minutes",
        cost: "Free",
        materials: ["Any camera", "Low sun or a single lamp"],
        motif: "long-shadow",
      },
      {
        slug: "outline",
        title: "Outline",
        description: "Capture a silhouette.",
        criteria: [
          "A subject shown as a dark shape against a brighter background.",
          "The shape alone tells you what it is.",
        ],
        rarity: "bronze",
        time: "About 30 minutes",
        cost: "Free",
        materials: ["Any camera", "A bright background"],
        safety: "If you photograph people, ask them first.",
        motif: "silhouette",
      },
      {
        slug: "another-angle",
        title: "Another Angle",
        description: "Photograph an ordinary object from an unusual perspective.",
        criteria: [
          "An everyday object, photographed from a viewpoint people rarely see.",
          "Someone might need a second look to recognise it.",
        ],
        rarity: "bronze",
        time: "About 20 minutes",
        cost: "Free",
        materials: ["Any camera"],
        motif: "tilted-frame",
      },
      {
        slug: "shades-of-grey",
        title: "Shades of Grey",
        description: "Create a black-and-white photograph.",
        criteria: [
          "You chose the subject because it suits black and white: light, texture or shape.",
          "The final image has no colour.",
        ],
        rarity: "silver",
        time: "About an hour",
        cost: "Free",
        materials: ["Any camera", "A free editing app or the camera's monochrome mode"],
        motif: "half-tone",
      },
      {
        slug: "three-act-story",
        title: "Three-Act Story",
        description: "Create a visual story using three photographs.",
        criteria: [
          "Three photographs that read as a beginning, a middle and an end.",
          "The story makes sense without captions.",
        ],
        rarity: "silver",
        time: "An afternoon",
        cost: "Free",
        materials: ["Any camera"],
        motif: "three-frames",
      },
      {
        slug: "common-thread",
        title: "Common Thread",
        description: "Build a five-photo collection around one theme.",
        criteria: [
          "Five photographs joined by a single theme: a colour, a shape, a subject.",
          "Taken on at least two different days.",
        ],
        rarity: "gold",
        time: "One to two weeks",
        cost: "Free",
        materials: ["Any camera"],
        requires: ["three-act-story"],
        motif: "five-frames",
      },
      {
        slug: "four-seasons",
        title: "Four Seasons",
        description: "Photograph the same location in different seasons.",
        criteria: [
          "The same place, from the same position, in all four seasons.",
          "Four photographs taken across about a year.",
        ],
        rarity: "platinum",
        time: "About a year",
        cost: "Free",
        materials: ["Any camera", "A place you can return to"],
        motif: "four-seasons",
      },
      {
        slug: "the-portfolio",
        title: "The Portfolio",
        description: "Develop a personal photography portfolio.",
        criteria: [
          "At least twelve photographs you chose as your best.",
          "Put in a deliberate order, in an album, a folder or a printed book.",
          "You have shown it to at least one other person.",
        ],
        rarity: "legendary",
        time: "Months",
        cost: "Free digitally; printing is optional",
        materials: ["Your own photographs", "An album, folder or site to hold them"],
        requires: ["common-thread"],
        motif: "aperture",
      },
    ],
  },
];
