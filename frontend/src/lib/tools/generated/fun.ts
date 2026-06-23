import type { GenSpec } from "./types";
import type { ToolCategoryId } from "../types";

const cp = (s: string, fn: (c: string) => string) => [...s].map(fn).join("");
const block = (U: number, L: number, D?: number) => (s: string) =>
  cp(s, (c) => {
    const x = c.codePointAt(0)!;
    if (x >= 65 && x <= 90) return String.fromCodePoint(U + x - 65);
    if (x >= 97 && x <= 122) return String.fromCodePoint(L + x - 97);
    if (D && x >= 48 && x <= 57) return String.fromCodePoint(D + x - 48);
    return c;
  });
const upperBlock = (U: number) => (s: string) =>
  cp(s.toUpperCase(), (c) => {
    const x = c.codePointAt(0)!;
    return x >= 65 && x <= 90 ? String.fromCodePoint(U + x - 65) : c;
  });
const combine = (m: string) => (s: string) => cp(s, (c) => (/\s/.test(c) ? c : c + m));
const circled = (s: string) =>
  cp(s, (c) => {
    const x = c.codePointAt(0)!;
    if (x >= 65 && x <= 90) return String.fromCodePoint(0x24b6 + x - 65);
    if (x >= 97 && x <= 122) return String.fromCodePoint(0x24d0 + x - 97);
    if (x === 48) return "⓪";
    if (x >= 49 && x <= 57) return String.fromCodePoint(0x2460 + x - 49);
    return c;
  });

const ZAL: string[] = [];
for (let i = 0x300; i <= 0x36f; i++) ZAL.push(String.fromCharCode(i));
const EMO = ["✨", "🔥", "💯", "🎉", "🚀", "🌈", "⭐", "💫", "😎", "👏"];
const KAO = ["(╯°□°)╯︵ ┻━┻", "¯\\_(ツ)_/¯", "(づ｡◕‿‿◕｡)づ", "ʕ•ᴥ•ʔ", "(ノ◕ヮ◕)ノ*:･ﾟ✧", "(◕‿◕)", "ಠ_ಠ", "(✿◠‿◠)", "♪~ ᕕ(ᐛ)ᕗ", "( ͡° ͜ʖ ͡°)"];
const EIGHTBALL = ["It is certain", "Without a doubt", "Yes definitely", "Most likely", "Outlook good", "Signs point to yes", "Reply hazy, try again", "Ask again later", "Cannot predict now", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
const QUOTES = ["The best way out is always through.", "Stay hungry, stay foolish.", "Simplicity is the ultimate sophistication.", "Done is better than perfect.", "Make it work, make it right, make it fast.", "What gets measured gets managed.", "Fall seven times, stand up eight.", "Action is the foundational key to all success."];
const FACTS = ["Honey never spoils.", "Octopuses have three hearts.", "Bananas are berries, but strawberries aren't.", "A day on Venus is longer than its year.", "Sharks predate trees.", "Wombat poop is cube-shaped.", "The Eiffel Tower grows in summer.", "Sea otters hold hands while sleeping."];
const JOKES = ["Why do programmers prefer dark mode? Because light attracts bugs.", "There are 10 kinds of people: those who understand binary and those who don't.", "Why did the developer go broke? He used up all his cache.", "A SQL query walks into a bar, sees two tables and asks: can I join you?", "Why do Java developers wear glasses? Because they don't C#.", "I would tell you a UDP joke, but you might not get it.", "To understand recursion, you must first understand recursion.", "There's no place like 127.0.0.1."];
const COMPLIMENTS = ["You're doing better than you think.", "Your code is cleaner than most.", "You ask great questions.", "You make hard things look easy.", "You're a quick learner.", "Your attention to detail is excellent.", "You bring good energy.", "You're more capable than you realize."];
const EXCUSES = ["It works on my machine.", "It's a caching issue.", "That's a feature, not a bug.", "The requirements changed.", "It must be a network problem.", "I didn't touch that file.", "It's a third-party library issue.", "We'll fix it in the next sprint."];
const WYR = ["Would you rather have unlimited coffee or unlimited wifi?", "Would you rather code only frontend or only backend forever?", "Would you rather always work mornings or always work nights?", "Would you rather debug for an hour or document for an hour?", "Would you rather have no bugs but slow releases, or fast releases with bugs?", "Would you rather use only the keyboard or only the mouse?"];
const SUP_A = ["Captain", "Doctor", "The", "Mega", "Night", "Iron", "Shadow", "Quantum"];
const SUP_B = ["Falcon", "Vortex", "Phantom", "Titan", "Blaze", "Pulse", "Specter", "Comet"];
const ANIMALS = ["red panda", "axolotl", "narwhal", "pangolin", "capybara", "quokka", "okapi", "fennec fox", "tapir", "lemur"];
const CARDS_R = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CARDS_S = ["♠", "♥", "♦", "♣"];

const ri = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

const FT = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string): GenSpec =>
  ({ slug, name, description, keywords, category: "text", kind: "transform", live: true, run, placeholder: "Type your text here…" });
const NV = (slug: string, name: string, description: string, keywords: string[], run: (s: string) => string, cat: ToolCategoryId = "fun"): GenSpec =>
  ({ slug, name, description, keywords, category: cat, kind: "transform", live: true, run, placeholder: "Type your text here…" });
const GM = (slug: string, name: string, description: string, keywords: string[], generate: () => string, label = "Roll"): GenSpec =>
  ({ slug, name, description, keywords, category: "fun", kind: "generate", generate, generateLabel: label });

export const funTools: GenSpec[] = [
  // Fancy text styles
  FT("bold-text-generator", "Bold Text Generator", "Turn text into 𝐛𝐨𝐥𝐝 unicode.", ["bold", "fancy", "font"], block(0x1d400, 0x1d41a, 0x1d7ce)),
  FT("italic-text-generator", "Italic Text Generator", "Turn text into bold-italic unicode.", ["italic", "fancy", "font"], block(0x1d468, 0x1d482)),
  FT("sans-serif-text", "Sans-serif Text Generator", "Clean sans-serif unicode text.", ["sans", "font", "fancy"], block(0x1d5a0, 0x1d5ba, 0x1d7e2)),
  FT("sans-bold-text", "Sans-serif Bold Text", "Bold sans-serif unicode text.", ["sans", "bold", "font"], block(0x1d5d4, 0x1d5ee, 0x1d7ec)),
  FT("sans-italic-text", "Sans-serif Italic Text", "Italic sans-serif unicode text.", ["sans", "italic", "font"], block(0x1d608, 0x1d622)),
  FT("monospace-text", "Monospace Text Generator", "Typewriter-style 𝚖𝚘𝚗𝚘 text.", ["monospace", "code", "font"], block(0x1d670, 0x1d68a, 0x1d7f6)),
  FT("cursive-text-generator", "Cursive Text Generator", "Elegant bold-script unicode text.", ["cursive", "script", "font"], block(0x1d4d0, 0x1d4ea)),
  FT("gothic-text-generator", "Gothic Text Generator", "Bold fraktur / blackletter text.", ["gothic", "fraktur", "blackletter"], block(0x1d56c, 0x1d586)),
  FT("fullwidth-text", "Vaporwave (Fullwidth) Text", "Ａｅｓｔｈｅｔｉｃ fullwidth text.", ["vaporwave", "fullwidth", "aesthetic"], block(0xff21, 0xff41, 0xff10)),
  FT("bubble-text-generator", "Bubble Text Generator", "Circled Ⓑⓤⓑⓑⓛⓔ text.", ["bubble", "circled", "font"], circled),
  FT("square-text-generator", "Squared Text Generator", "Boxed 🅂🅀🅄🄰🅁🄴 text.", ["square", "boxed", "font"], upperBlock(0x1f130)),
  FT("negative-square-text", "Negative Squared Text", "Filled 🅽🅴🅶 squared text.", ["square", "negative", "font"], upperBlock(0x1f170)),
  FT("regional-indicator-text", "Emoji Letter Text", "🇦🇧🇨 regional indicator letters.", ["emoji", "letters", "flags"], upperBlock(0x1f1e6)),
  FT("strikethrough-text", "Strikethrough Text", "Add a s̶t̶r̶i̶k̶e̶ through text.", ["strikethrough", "cross"], combine("̶")),
  FT("underline-text", "Underline Text", "Add an u̲n̲d̲e̲r̲l̲i̲n̲e̲ to text.", ["underline"], combine("̲")),
  FT("overline-text", "Overline Text", "Add an o̅v̅e̅r̅l̅i̅n̅e̅ to text.", ["overline"], combine("̅")),
  NV("remove-vowels", "Remove Vowels", "Strip all vowels from text.", ["vowels", "remove"], (s) => s.replace(/[aeiou]/gi, ""), "text"),
  NV("remove-consonants", "Remove Consonants", "Keep only vowels and spaces.", ["consonants", "remove"], (s) => s.replace(/[bcdfghjklmnpqrstvwxyz]/gi, ""), "text"),

  // Novelty
  NV("clap-text-generator", "Clap Text Generator", "Add 👏 claps 👏 between 👏 words.", ["clap", "emoji", "meme"], (s) => s.trim().split(/\s+/).join(" 👏 ")),
  NV("space-out-text", "Space Out Text", "P u t   s p a c e s between letters.", ["spaced", "letters"], (s) => cp(s, (c) => (c === "\n" ? c : c + " ")).trimEnd()),
  NV("zalgo-text-generator", "Zalgo Glitch Text", "Create c̷r̴e̶e̵p̶y̴ glitch text.", ["zalgo", "glitch", "creepy"], (s) => cp(s, (c) => { if (/\s/.test(c)) return c; let r = c; const n = ri(1, 3); for (let i = 0; i < n; i++) r += pick(ZAL); return r; })),
  NV("emojify-text", "Emojify Text", "Sprinkle random emoji between words.", ["emoji", "fun"], (s) => s.trim().split(/\s+/).reduce((acc, w, i) => (i === 0 ? w : `${acc} ${pick(EMO)} ${w}`), "")),

  // Games & random
  GM("coin-flip", "Coin Flip", "Flip a virtual coin.", ["coin", "flip", "heads", "tails"], () => pick(["Heads", "Tails"]), "Flip"),
  GM("dice-roller", "Dice Roller", "Roll a six-sided die.", ["dice", "die", "d6"], () => `🎲 ${ri(1, 6)}`, "Roll"),
  GM("d20-roller", "D20 Roller", "Roll a twenty-sided die.", ["d20", "dice", "rpg"], () => `🎲 ${ri(1, 20)}`, "Roll"),
  GM("two-dice-roller", "Two Dice Roller", "Roll a pair of dice.", ["dice", "two", "craps"], () => { const a = ri(1, 6), b = ri(1, 6); return `🎲 ${a} + 🎲 ${b} = ${a + b}`; }, "Roll"),
  GM("magic-8-ball", "Magic 8-Ball", "Ask the Magic 8-Ball a question.", ["8 ball", "fortune", "decision"], () => pick(EIGHTBALL), "Shake"),
  GM("yes-or-no", "Yes or No", "Let fate decide: yes or no.", ["yes", "no", "decision"], () => pick(["Yes", "No"]), "Decide"),
  GM("rock-paper-scissors", "Rock Paper Scissors", "Get a random throw.", ["rock", "paper", "scissors"], () => pick(["🪨 Rock", "📄 Paper", "✂️ Scissors"]), "Throw"),
  GM("random-card", "Random Playing Card", "Draw a random card.", ["card", "deck", "random"], () => `${pick(CARDS_R)}${pick(CARDS_S)}`, "Draw"),
  GM("random-emoji", "Random Emoji", "Get a random emoji.", ["emoji", "random"], () => pick(EMO), "Random"),
  GM("random-emoji-trio", "Random Emoji Trio", "Get three random emoji.", ["emoji", "random"], () => Array.from({ length: 3 }, () => pick(EMO)).join(" "), "Random"),
  GM("random-kaomoji", "Random Kaomoji", "Get a random Japanese emoticon.", ["kaomoji", "emoticon"], () => pick(KAO), "Random"),
  GM("random-decision", "Random Decision Maker", "Yes, No or Maybe.", ["decision", "random"], () => pick(["Yes", "No", "Maybe"]), "Decide"),
  GM("lottery-number-generator", "Lottery Number Generator", "Six unique numbers from 1–49.", ["lottery", "numbers", "lucky"], () => { const set = new Set<number>(); while (set.size < 6) set.add(ri(1, 49)); return [...set].sort((a, b) => a - b).join(" "); }, "Generate"),
  GM("random-quote", "Random Quote", "Get a motivational quote.", ["quote", "inspiration"], () => pick(QUOTES), "New quote"),
  GM("random-fact", "Random Fun Fact", "Learn a random fun fact.", ["fact", "trivia"], () => pick(FACTS), "New fact"),
  GM("random-joke", "Random Programming Joke", "Get a random dev joke.", ["joke", "humor"], () => pick(JOKES), "New joke"),
  GM("random-compliment", "Random Compliment", "Get a kind compliment.", ["compliment", "kind"], () => pick(COMPLIMENTS), "Compliment me"),
  GM("random-excuse", "Random Developer Excuse", "Generate a classic dev excuse.", ["excuse", "funny"], () => pick(EXCUSES), "New excuse"),
  GM("would-you-rather", "Would You Rather", "Get a would-you-rather question.", ["would you rather", "game"], () => pick(WYR), "Ask"),
  GM("random-superhero-name", "Superhero Name Generator", "Generate a superhero alias.", ["superhero", "name"], () => `${pick(SUP_A)} ${pick(SUP_B)}`, "Generate"),
  GM("random-band-name", "Band Name Generator", "Generate a random band name.", ["band", "name", "music"], () => `The ${pick(["Electric", "Velvet", "Midnight", "Cosmic", "Neon", "Wild"])} ${pick(["Foxes", "Echoes", "Tigers", "Waves", "Rebels", "Comets"])}`, "Generate"),
  GM("random-startup-name", "Startup Name Generator", "Generate a startup-style name.", ["startup", "name", "brand"], () => pick(["Zen", "Flow", "Nova", "Hyper", "Quant", "Loop", "Pulse", "Snap"]) + pick(["ify", "ly", "base", "hub", "lab", "io", "wave", "stack"]), "Generate"),
  GM("random-animal", "Random Animal", "Get a random unusual animal.", ["animal", "random"], () => pick(ANIMALS), "Random"),
  GM("bingo-number", "Bingo Number Caller", "Call a random bingo number (1–75).", ["bingo", "number"], () => { const n = ri(1, 75); const L = "BINGO"[Math.floor((n - 1) / 15)]; return `${L}-${n}`; }, "Call"),
  GM("random-letter", "Random Letter", "Get a random letter A–Z.", ["letter", "random"], () => String.fromCharCode(ri(65, 90)), "Random"),
  GM("random-direction", "Random Direction", "Pick a random compass direction.", ["direction", "compass"], () => pick(["North ⬆️", "East ➡️", "South ⬇️", "West ⬅️"]), "Spin"),

  // Pickers (button)
  { slug: "random-line-picker", name: "Random Line Picker", description: "Pick a random line from your list.", keywords: ["random", "picker", "raffle"], category: "fun", kind: "transform", live: false, run: (s) => { const l = s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean); if (!l.length) throw new Error("Add some lines first."); return l[Math.floor(Math.random() * l.length)]; }, placeholder: "One option per line…" },
  { slug: "team-generator", name: "Random Team Generator", description: "Split names into two random teams.", keywords: ["teams", "random", "split"], category: "fun", kind: "transform", live: false, run: (s) => { const l = s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean); if (l.length < 2) throw new Error("Add at least two names."); for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } const h = Math.ceil(l.length / 2); return `Team A:\n${l.slice(0, h).join("\n")}\n\nTeam B:\n${l.slice(h).join("\n")}`; }, placeholder: "One name per line…" },
];
