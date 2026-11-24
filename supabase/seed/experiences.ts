/**
 * Daily experience inventory.
 *
 * Rules every entry follows (spec section 4): free, 5 to 10 minutes, possible
 * at home with things most people already have, and paired with a handwritten
 * alternative that does not depend on the same ability (sight, hearing,
 * movement, a camera, another person). Choosing the alternative earns the same
 * XP.
 *
 * To add content: append an entry with a new slug. Entries are upserted by
 * slug on startup, and the scheduler uses each approved entry once, in list
 * order, before it recycles any.
 */

export const EXPERIENCE_CATEGORIES = [
  "Discovery",
  "Creativity",
  "Observation",
  "Connection",
  "Learning",
  "Reflection",
  "Nature",
  "Music",
  "Movement",
  "Imagination",
  "Personal history",
  "Kindness",
  "Sensory",
  "Exploration",
  "Photography",
  "Appreciation",
  "Problem-solving",
  "Mindful attention",
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];
export type ExperienceSetting = "At home" | "Anywhere" | "Indoors or out";

export type SeedAlternative = {
  title: string;
  prompt: string;
  steps: string[];
  setting: ExperienceSetting;
  items?: string[];
  /** Who this version is designed to work for. */
  accessibilityNote: string;
};

export type SeedExperience = {
  slug: string;
  title: string;
  prompt: string;
  steps: string[];
  category: ExperienceCategory;
  minutes: [number, number];
  setting: ExperienceSetting;
  /** Common household items needed. Empty means nothing is needed. */
  items?: string[];
  alternative: SeedAlternative;
};

export const SEED_EXPERIENCES: SeedExperience[] = [
  {
    slug: "the-ordinary-reimagined",
    title: "The ordinary, reimagined.",
    prompt: "Photograph a familiar object from a perspective you have never tried.",
    steps: [
      "Pick something you see every day: a kettle, a shoe, a door handle.",
      "Get underneath it, directly above it, or as close as your camera will focus.",
      "Take one photo you would not normally take. Keep it or delete it; the looking is the point.",
    ],
    category: "Photography",
    minutes: [5, 10],
    setting: "At home",
    items: ["A phone or camera"],
    alternative: {
      title: "The ordinary, by hand.",
      prompt: "Pick up a familiar object and explore it by touch as if you had never held it.",
      steps: [
        "Choose something you use daily and hold it with your eyes closed or looking away.",
        "Find three details you have never paid attention to: an edge, a seam, a weight.",
        "Say or note the one that surprised you most.",
      ],
      setting: "At home",
      accessibilityNote: "No camera or sight needed.",
    },
  },
  {
    slug: "a-face-in-the-ordinary",
    title: "A face in the ordinary.",
    prompt: "Find something in your home that looks like a face but is not a face.",
    steps: [
      "Look at sockets, taps, bags, appliances and the fronts of things.",
      "When two eyes and a mouth appear, decide what mood it is in.",
      "Take a picture if you would like to keep it.",
    ],
    category: "Discovery",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "An object with a personality.",
      prompt: "Choose an object at home that has always seemed to have a character of its own.",
      steps: [
        "Think of something you own that feels stubborn, cheerful, tired or proud.",
        "Describe its personality in one sentence, aloud or in a note.",
        "Decide what it would say if it could speak.",
      ],
      setting: "At home",
      accessibilityNote: "No sight or moving around needed.",
    },
  },
  {
    slug: "a-song-older-than-you-remember",
    title: "A song from your first year.",
    prompt: "Listen to a song released the year you were born that you have never heard before.",
    steps: [
      "Search for the charts from your birth year on any free source.",
      "Choose a title you do not recognise and play it all the way through.",
      "Notice one thing about it that could only belong to that year.",
    ],
    category: "Music",
    minutes: [5, 10],
    setting: "Anywhere",
    items: ["A free way to play music"],
    alternative: {
      title: "A headline from your first year.",
      prompt: "Find one thing that happened in the year you were born that you never knew about.",
      steps: [
        "Look up your birth year in any free encyclopedia or archive.",
        "Skip the famous events and find something small or strange.",
        "Imagine the adults around you hearing that news.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No hearing needed.",
    },
  },
  {
    slug: "six-words-one-life",
    title: "Six words, one life.",
    prompt: "Write your autobiography in exactly six words.",
    steps: [
      "Write a first attempt without thinking too hard.",
      "Swap one word for a truer one.",
      "Read it back. It only has to be true today.",
    ],
    category: "Reflection",
    minutes: [5, 10],
    setting: "Anywhere",
    items: ["Something to write with"],
    alternative: {
      title: "Six words, spoken.",
      prompt: "Compose a six-word autobiography in your head and say it aloud.",
      steps: [
        "Count the words on your fingers or in your head as you go.",
        "Change one word for a truer one.",
        "Say the final version aloud, once.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No writing needed.",
    },
  },
  {
    slug: "where-did-this-come-from",
    title: "Where did this come from?",
    prompt: "Find an object you have owned for years and recall how it came to be yours.",
    steps: [
      "Choose something that has survived several clear-outs.",
      "Recall where you were when you got it, and who else was there.",
      "Ask yourself why it has stayed.",
    ],
    category: "Personal history",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "Where did that go?",
      prompt: "Think of an object you no longer own and recall how it left your life.",
      steps: [
        "Let one come to mind: a toy, a coat, a first phone.",
        "Recall the last time you remember having it.",
        "Decide whether you would take it back.",
      ],
      setting: "Anywhere",
      accessibilityNote: "Done entirely from memory, with no moving around.",
    },
  },
  {
    slug: "the-other-hand",
    title: "The other hand.",
    prompt: "Draw a self-portrait using the hand you do not normally write with.",
    steps: [
      "Use any pen, pencil or a drawing app.",
      "Give yourself three minutes and do not erase anything.",
      "Sign it with the same hand.",
    ],
    category: "Creativity",
    minutes: [5, 10],
    setting: "Anywhere",
    items: ["Something to draw with, or a drawing app"],
    alternative: {
      title: "A portrait in five words.",
      prompt: "Describe your own face in five words to someone who has never met you.",
      steps: [
        "Avoid the obvious words such as hair colour and height.",
        "Choose five that a friend would recognise you by.",
        "Say them aloud or write them down.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No drawing or use of the hands needed.",
    },
  },
  {
    slug: "the-window-you-stopped-seeing",
    title: "The window you stopped seeing.",
    prompt: "Look out of a window and find three things you have never noticed before.",
    steps: [
      "Choose a window you pass many times a day.",
      "Look at the far distance, then the middle, then right up close to the glass.",
      "Name your three things before you step away.",
    ],
    category: "Observation",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "The room you stopped noticing.",
      prompt: "Sit in a familiar room and notice three things using only sound or touch.",
      steps: [
        "Settle somewhere you sit often.",
        "Listen, or reach out, for details you have tuned out: a hum, a draught, a texture.",
        "Name your three things.",
      ],
      setting: "At home",
      accessibilityNote: "No sight needed, and no window.",
    },
  },
  {
    slug: "a-handshake-nobody-knows",
    title: "A handshake nobody knows.",
    prompt: "Invent a new handshake, with someone who wants to join in or on your own.",
    steps: [
      "Give it at least three moves.",
      "Practise until you can do it without thinking.",
      "Give it a name.",
    ],
    category: "Connection",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "A greeting nobody knows.",
      prompt: "Invent a secret greeting: a word, phrase or sound that belongs only to you.",
      steps: [
        "Make it short enough to say in passing.",
        "Decide who, if anyone, you would share it with.",
        "Use it once today, even if only to yourself.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No physical contact or use of the hands needed.",
    },
  },
  {
    slug: "cleared-for-takeoff",
    title: "Cleared for takeoff.",
    prompt: "Make a paper airplane from spare paper and give it one proper flight.",
    steps: [
      "Use a sheet that was heading for recycling.",
      "Fold any design you remember, or make one up.",
      "Launch it once, and notice where it lands.",
    ],
    category: "Creativity",
    minutes: [5, 10],
    setting: "At home",
    items: ["One sheet of spare paper"],
    alternative: {
      title: "An aircraft of your own.",
      prompt: "Imagine an aircraft that has never existed, then sketch or describe it.",
      steps: [
        "Decide what it carries and where it flies.",
        "Give it one feature no real aircraft has.",
        "Name it.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No paper, folding or throwing needed.",
    },
  },
  {
    slug: "three-of-a-kind",
    title: "Three of a kind.",
    prompt: "Find three objects in your home that share an unexpected connection.",
    steps: [
      "Rule out the obvious links such as colour or room.",
      "Look for a shared origin, a shared decade, a shared person.",
      "Put them side by side and say the connection aloud.",
    ],
    category: "Problem-solving",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "Three of a kind, in mind.",
      prompt: "Think of three places you have been that share an unexpected connection.",
      steps: [
        "Let three places come to mind without choosing carefully.",
        "Search for what links them: a smell, a person, a feeling.",
        "Give the set a title.",
      ],
      setting: "Anywhere",
      accessibilityNote: "Done from memory, with no moving around.",
    },
  },
  {
    slug: "two-minutes-of-listening",
    title: "Two minutes of listening.",
    prompt: "Listen to the sounds around you for two minutes and pick out five distinct ones.",
    steps: [
      "Stay where you are and stop what you are doing.",
      "Count sounds on your fingers: near ones first, then far ones.",
      "Decide which one you had not noticed until now.",
    ],
    category: "Sensory",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "Five textures within reach.",
      prompt: "Without getting up, find five distinct textures you can touch from where you are.",
      steps: [
        "Reach for surfaces, fabrics and objects around you.",
        "Give each texture one word.",
        "Choose the one you would most like to keep touching.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No hearing needed.",
    },
  },
  {
    slug: "the-secret-life-of-a-stapler",
    title: "The secret life of things.",
    prompt: "Give a household object an imaginary name and a backstory.",
    steps: [
      "Pick an object with a bit of wear on it.",
      "Decide its name, where it grew up, and what it wanted to be.",
      "Work out what it thinks of you.",
    ],
    category: "Imagination",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "The secret life of a sound.",
      prompt: "Give a sound you hear regularly at home a name and a backstory.",
      steps: [
        "Choose a creak, a hum, a neighbour's door or a pipe.",
        "Decide who or what is really making it.",
        "Give the character a name.",
      ],
      setting: "At home",
      accessibilityNote: "No sight or moving around needed.",
    },
  },
  {
    slug: "hello-again",
    title: "Hello, again.",
    prompt: "Learn to say hello in a language you have never studied.",
    steps: [
      "Choose a language you could not say a single word of this morning.",
      "Find the greeting from any free source and listen to it if you can.",
      "Say it five times, then use it on someone or something today.",
    ],
    category: "Learning",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "Hello, without a sound.",
      prompt: "Learn how hello is written or signed in a language you have never studied.",
      steps: [
        "Choose a language with a script or sign you do not know.",
        "Find the greeting from any free source.",
        "Trace, write or sign it three times.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No speech or hearing needed.",
    },
  },
  {
    slug: "a-small-scene-from-long-ago",
    title: "A small scene from long ago.",
    prompt: "Recreate a childhood memory using a drawing or objects you already own.",
    steps: [
      "Choose a small memory: a kitchen table, a car journey, a hiding place.",
      "Sketch it, or stand objects in for the people and furniture.",
      "Add the one detail that makes it unmistakably yours.",
    ],
    category: "Personal history",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "A small scene, retold.",
      prompt: "Tell a childhood memory in three sentences, aloud or to someone else.",
      steps: [
        "Choose a small, ordinary memory rather than a big event.",
        "First sentence: where. Second: who. Third: what you can still feel.",
        "Tell it once, to anyone or to no one.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No drawing or handling of objects needed.",
    },
  },
  {
    slug: "chapter-one",
    title: "Chapter one.",
    prompt: "Describe where you are right now as the opening scene of a novel.",
    steps: [
      "Start with the light, the weather or a sound.",
      "Write three or four sentences in the third person.",
      "End on something that makes a reader want the next page.",
    ],
    category: "Creativity",
    minutes: [5, 10],
    setting: "Anywhere",
    items: ["Something to write with"],
    alternative: {
      title: "The title on the cover.",
      prompt: "Give the place you are in right now a book title and a one-line blurb.",
      steps: [
        "Decide the genre: mystery, romance, comedy, something else.",
        "Compose the title and one line for the back cover.",
        "Say them aloud.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No writing needed.",
    },
  },
  {
    slug: "a-photo-you-forgot-you-had",
    title: "A photo you forgot you had.",
    prompt: "Find a photograph you have not looked at in years and recall the story behind it.",
    steps: [
      "Scroll far back in your phone, or open a drawer or an album.",
      "Stop at one you had forgotten existed.",
      "Recall who took it, and what happened just after.",
    ],
    category: "Personal history",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "A photo that was never taken.",
      prompt: "Recall a moment you wish had been photographed and describe what is in the frame.",
      steps: [
        "Choose a moment that exists only in your memory.",
        "Describe the frame: who is in it, where the light is, what is at the edges.",
        "Give it a caption.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No sight or photographs needed.",
    },
  },
  {
    slug: "a-gallery-of-five",
    title: "A gallery of five.",
    prompt: "Arrange five nearby objects into a miniature work of art.",
    steps: [
      "Gather five things within arm's reach.",
      "Arrange them by height, colour, story or nothing at all.",
      "Give the piece a title before you put everything back.",
    ],
    category: "Creativity",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "An exhibition in mind.",
      prompt: "Choose five things you own for an imaginary exhibition, and title the show.",
      steps: [
        "Pick the five from memory; you do not need to fetch them.",
        "Decide which one goes at the entrance.",
        "Name the exhibition.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No lifting or arranging needed.",
    },
  },
  {
    slug: "dear-later",
    title: "Dear later.",
    prompt: "Write a short message to yourself one year from now.",
    steps: [
      "Tell them one thing that is on your mind today.",
      "Ask them one question.",
      "Keep it somewhere you might find it, or add it as your note here.",
    ],
    category: "Reflection",
    minutes: [5, 10],
    setting: "Anywhere",
    items: ["Something to write with"],
    alternative: {
      title: "Dear later, aloud.",
      prompt: "Say or record a short message to yourself one year from now.",
      steps: [
        "Tell them one thing that is on your mind today.",
        "Ask them one question.",
        "Record it if you can, or simply say it aloud.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No writing needed.",
    },
  },
  {
    slug: "four-lines-entirely-yours",
    title: "Four lines, entirely yours.",
    prompt: "Make up a completely original four-line poem.",
    steps: [
      "Take your subject from whatever is directly in front of you.",
      "It does not need to rhyme, and it does not need to be good.",
      "Read it aloud once when it is finished.",
    ],
    category: "Creativity",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "Two lines about lunch.",
      prompt: "Make up a two-line rhyme about the last thing you ate.",
      steps: [
        "Find a word that rhymes with the food, or with how it tasted.",
        "Build the two lines in your head.",
        "Say them aloud, or sign them, with conviction.",
      ],
      setting: "Anywhere",
      accessibilityNote: "Shorter, and no writing needed.",
    },
  },
  {
    slug: "five-minutes-with-the-overlooked",
    title: "Five minutes with the overlooked.",
    prompt: "Choose something you pass every day without a glance and observe it for five minutes.",
    steps: [
      "Pick a thing, not a view: a hinge, a houseplant, a light switch.",
      "Notice how it is made, how it has worn, and what it does.",
      "Stay for the whole five minutes, even after you think you have finished.",
    ],
    category: "Mindful attention",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "Two minutes with a background sound.",
      prompt: "Choose a background sound or sensation you normally ignore and attend to it fully.",
      steps: [
        "Pick one: an appliance humming, your own breathing, the chair beneath you.",
        "Notice whether it is steady or changing.",
        "Stay with it for two minutes.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No sight needed, and shorter.",
    },
  },
  {
    slug: "todays-sky-reported",
    title: "Today's sky, reported.",
    prompt: "Watch the sky for two minutes and deliver a weather report in your own style.",
    steps: [
      "Look from a window, a doorway or outside.",
      "Note the colour, the movement and what it seems to be planning.",
      "Give your report in three sentences. Dramatic delivery is welcome.",
    ],
    category: "Nature",
    minutes: [5, 10],
    setting: "Indoors or out",
    alternative: {
      title: "The weather, without looking.",
      prompt: "Work out today's weather using only what you can hear, feel or smell.",
      steps: [
        "Stay indoors, near a window or door if you can.",
        "Collect clues: temperature, sounds outside, the air.",
        "Make your forecast for the next hour.",
      ],
      setting: "At home",
      accessibilityNote: "No sight needed, and no going outside.",
    },
  },
  {
    slug: "a-thank-you-overdue",
    title: "A thank-you, overdue.",
    prompt: "Write two lines of thanks to someone who helped you and never knew it.",
    steps: [
      "Think of a teacher, a stranger, a colleague, a neighbour.",
      "Say exactly what they did and what it changed.",
      "Sending it is optional. Writing it is the experience.",
    ],
    category: "Appreciation",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "Thanks to a thing.",
      prompt: "Choose an object you rely on daily and say, specifically, what it does for you.",
      steps: [
        "Pick something you would miss by lunchtime if it vanished.",
        "Name three things it makes possible.",
        "Say thank you aloud. Yes, to the object.",
      ],
      setting: "At home",
      accessibilityNote: "No writing needed, and it does not involve another person.",
    },
  },
  {
    slug: "the-map-in-your-head",
    title: "The map in your head.",
    prompt: "Draw, from memory, a map of a place you knew well as a child.",
    steps: [
      "Choose a street, a school, a house or a garden.",
      "Draw it quickly, without checking anything.",
      "Mark the one spot that mattered most to you.",
    ],
    category: "Exploration",
    minutes: [5, 10],
    setting: "Anywhere",
    items: ["Something to draw with"],
    alternative: {
      title: "The route in your head.",
      prompt: "Walk, in your mind, from the front door of a childhood place to your favourite spot.",
      steps: [
        "Start at the door and describe each turn.",
        "Notice what you pass on the way.",
        "Arrive, and stay there for a moment.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No drawing needed.",
    },
  },
  {
    slug: "the-oldest-thing-here",
    title: "The oldest thing here.",
    prompt: "Find the oldest object in your home and work out roughly how old it is.",
    steps: [
      "Consider books, furniture, coins, tools, anything inherited.",
      "Look for a date, a maker's mark or a clue in how it was made.",
      "Imagine who used it first.",
    ],
    category: "Discovery",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "The oldest thing you have held.",
      prompt: "Recall the oldest object you have ever held in your hands.",
      steps: [
        "Think of museums, grandparents' houses, beaches and attics.",
        "Recall how it felt and who showed it to you.",
        "Guess its age.",
      ],
      setting: "Anywhere",
      accessibilityNote: "Done from memory, with no searching.",
    },
  },
  {
    slug: "one-slow-bite",
    title: "One slow bite.",
    prompt: "Eat or drink something you already have, slowly, and find three distinct things in it.",
    steps: [
      "Choose anything already in your kitchen.",
      "Take one bite or sip and wait before the next.",
      "Name three separate flavours or textures.",
    ],
    category: "Sensory",
    minutes: [5, 10],
    setting: "At home",
    items: ["Any food or drink you already have"],
    alternative: {
      title: "One slow breath in.",
      prompt: "Find something at home with a scent and describe it in three words.",
      steps: [
        "Try soap, a spice jar, a book, a jumper.",
        "Breathe it in slowly, twice.",
        "Choose three words, and notice what it reminds you of.",
      ],
      setting: "At home",
      accessibilityNote: "No eating or drinking needed.",
    },
  },
  {
    slug: "new-names-for-old-colours",
    title: "New names for old colours.",
    prompt: "Choose three colours you can see and rename each one as a paint chart would.",
    steps: [
      "Pick three colours within view.",
      "Give each a name that says where you found it.",
      "Decide which one you would paint a room.",
    ],
    category: "Imagination",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "New names for old textures.",
      prompt: "Choose three textures you can touch and give each one a new name.",
      steps: [
        "Find three surfaces within reach.",
        "Name each one for how it feels, not what it is.",
        "Decide which you would choose for a blanket.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No colour vision or sight needed.",
    },
  },
  {
    slug: "thirty-seconds-of-original-music",
    title: "Thirty seconds of original music.",
    prompt: "Hum, whistle or tap a melody nobody has heard before, and give it a title.",
    steps: [
      "Start with three notes or three taps and see where they lead.",
      "Keep going for about thirty seconds.",
      "Name your composition.",
    ],
    category: "Music",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "The album that does not exist.",
      prompt: "Invent an album that has never been made: its title, its cover and its first track.",
      steps: [
        "Decide what kind of music it is.",
        "Describe the cover in one sentence.",
        "Name the opening track.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No hearing or sound-making needed.",
    },
  },
  {
    slug: "move-like-something-else",
    title: "Move like something else.",
    prompt: "Choose an animal and move like it for one minute, in whatever way suits your body.",
    steps: [
      "Pick an animal whose movement you admire.",
      "Borrow its pace, its posture or just the way it turns its head.",
      "Keep going for a full minute, and stop if anything is uncomfortable.",
    ],
    category: "Movement",
    minutes: [5, 10],
    setting: "At home",
    alternative: {
      title: "Three verbs for an animal.",
      prompt: "Choose an animal you admire and find the three verbs that best describe how it moves.",
      steps: [
        "Picture or recall the animal in motion.",
        "Search for verbs more exact than walk, run or fly.",
        "Say your three aloud.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No physical movement needed.",
    },
  },
  {
    slug: "a-note-left-behind",
    title: "A note left behind.",
    prompt: "Leave a short, kind note where someone you live or work with will find it.",
    steps: [
      "Use any scrap of paper.",
      "Write one specific, true, kind thing.",
      "Leave it in a pocket, a book, a cupboard or on a desk.",
    ],
    category: "Kindness",
    minutes: [5, 10],
    setting: "At home",
    items: ["A scrap of paper and something to write with"],
    alternative: {
      title: "A message sent ahead.",
      prompt: "Send one kind message to someone, or compose one for yourself to find later.",
      steps: [
        "Choose a person, or choose yourself next week.",
        "Say one specific, true, kind thing.",
        "Send it, schedule it, or say it aloud.",
      ],
      setting: "Anywhere",
      accessibilityNote: "No handwriting needed, and it works if you live alone.",
    },
  },
  {
    slug: "ask-what-you-never-asked",
    title: "Ask what you never asked.",
    prompt: "Ask someone you know well a question you have never asked them.",
    steps: [
      "Choose someone you can reach today, in person or by message.",
      "Ask about a time before you knew them, or something they once wanted.",
      "Listen to the whole answer before you say anything.",
    ],
    category: "Connection",
    minutes: [5, 10],
    setting: "Anywhere",
    alternative: {
      title: "The question you would ask.",
      prompt: "Decide on one question you would ask someone you can no longer reach.",
      steps: [
        "Let the person come to mind.",
        "Find the one question you would most want answered.",
        "Imagine, briefly, what they might say.",
      ],
      setting: "Anywhere",
      accessibilityNote: "Does not involve another person or a conversation.",
    },
  },
];
