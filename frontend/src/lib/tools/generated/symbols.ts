import type { GenSpec } from "./types";

const S = (slug: string, name: string, description: string, keywords: string[], chars: string): GenSpec =>
  ({ slug, name, description, keywords, category: "fun", kind: "generate", generate: () => chars, generateLabel: "Show symbols" });

export const symbolTools: GenSpec[] = [
  S("heart-symbols", "Heart Symbols", "Copy heart symbols and emoji.", ["heart", "symbol", "copy"], "♥ ♡ ❤ 🧡 💛 💚 💙 💜 🖤 🤍 💕 💖 💗 💓 💞 💘 💝 ♥️ ❣ 💟"),
  S("arrow-symbols", "Arrow Symbols", "Copy arrow symbols of every direction.", ["arrow", "symbol", "copy"], "← → ↑ ↓ ↔ ↕ ↖ ↗ ↘ ↙ ⇐ ⇒ ⇑ ⇓ ⇔ ➡ ⬅ ⬆ ⬇ ↩ ↪ ⤴ ⤵ ➤ ➔"),
  S("star-symbols", "Star Symbols", "Copy star symbols and emoji.", ["star", "symbol", "copy"], "★ ☆ ✦ ✧ ✪ ✫ ✬ ✭ ✮ ✯ ⭐ 🌟 ✩ ⋆ ✶ ✷ ✸ ✹ ❋ ✺"),
  S("check-mark-symbols", "Check Mark Symbols", "Copy tick and check mark symbols.", ["check", "tick", "symbol"], "✓ ✔ ☑ ✅ √ 🗸 ✕ ☒ ❎"),
  S("cross-x-symbols", "X & Cross Symbols", "Copy cross and X symbols.", ["cross", "x", "symbol"], "✗ ✘ ✕ ❌ ☓ ✖ ╳ ⨯ ⨉ ❎"),
  S("currency-symbols", "Currency Symbols", "Copy currency symbols from around the world.", ["currency", "money", "symbol"], "$ € £ ¥ ₹ ₩ ₽ ¢ ₿ ₺ ₴ ₪ ₫ ฿ ₱ ₦ ₲ ₵ ₸ ₼ ₡ ﷼"),
  S("math-symbols", "Math Symbols", "Copy mathematical symbols and operators.", ["math", "symbol", "operator"], "± × ÷ ≠ ≈ ≤ ≥ ∑ ∏ √ ∛ ∞ ∫ ∂ π ∆ ∇ ∈ ∉ ⊂ ⊃ ∪ ∩ ∀ ∃ ∴ ∵ ∝ ≡"),
  S("greek-letters", "Greek Letters", "Copy lowercase and uppercase Greek letters.", ["greek", "letters", "symbol"], "α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ σ τ υ φ χ ψ ω Α Β Γ Δ Ε Ζ Η Θ Λ Π Σ Φ Ψ Ω"),
  S("bullet-point-symbols", "Bullet Point Symbols", "Copy bullet and list symbols.", ["bullet", "list", "symbol"], "• ◦ ‣ ⁃ ∙ ● ○ ■ □ ▪ ▫ ► ▶ ◆ ◇ ✦ ✱ ❖ ➤ ➢"),
  S("music-symbols", "Music Symbols", "Copy musical note symbols.", ["music", "note", "symbol"], "♪ ♫ ♬ ♩ ♭ ♮ ♯ 𝄞 𝄢 🎵 🎶 🎼"),
  S("chess-symbols", "Chess Symbols", "Copy chess piece symbols.", ["chess", "symbol", "pieces"], "♔ ♕ ♖ ♗ ♘ ♙ ♚ ♛ ♜ ♝ ♞ ♟"),
  S("card-suit-symbols", "Card Suit Symbols", "Copy playing card suit symbols.", ["cards", "suit", "symbol"], "♠ ♥ ♦ ♣ ♤ ♡ ♢ ♧"),
  S("zodiac-symbols", "Zodiac Symbols", "Copy astrological zodiac symbols.", ["zodiac", "astrology", "symbol"], "♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓ ☉ ☽ ☿ ♀ ♂ ♃ ♄"),
  S("weather-symbols", "Weather Symbols", "Copy weather symbols and emoji.", ["weather", "symbol"], "☀ ☁ ☂ ☃ ❄ ☔ ⚡ 🌧 🌦 🌩 🌨 🌪 🌈 ☄ 🌡 ❅ ❆ ☼"),
  S("fraction-symbols", "Fraction Symbols", "Copy fraction symbols.", ["fraction", "symbol"], "½ ⅓ ⅔ ¼ ¾ ⅕ ⅖ ⅗ ⅘ ⅙ ⅚ ⅛ ⅜ ⅝ ⅞ ⅐ ⅑ ⅒ ↉"),
  S("bracket-symbols", "Bracket Symbols", "Copy decorative bracket symbols.", ["brackets", "symbol"], "⟨ ⟩ 【 】 「 」 『 』 〔 〕 《 》 〈 〉 ⌈ ⌉ ⌊ ⌋ ❰ ❱ ❮ ❯ ⦃ ⦄"),
  S("box-drawing-symbols", "Box Drawing Symbols", "Copy box drawing line symbols.", ["box", "lines", "ascii"], "─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ═ ║ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬"),
  S("special-punctuation", "Special Punctuation", "Copy uncommon punctuation marks.", ["punctuation", "symbol"], "… – — • § ¶ † ‡ ‰ ′ ″ ‹ › « » ¿ ¡ ※ ⁂ ¦ ‖"),
  S("circled-numbers", "Circled Number Symbols", "Copy circled and enclosed numbers.", ["circled", "numbers", "symbol"], "① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩ ⑪ ⑫ ⑬ ⑭ ⑮ ❶ ❷ ❸ ❹ ❺ ⓪"),
  S("superscript-subscript", "Superscript & Subscript", "Copy superscript and subscript characters.", ["superscript", "subscript", "symbol"], "⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ⁺ ⁻ ⁼ ⁽ ⁾ ₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉ ₊ ₋"),
  S("degree-symbols", "Degree & Temperature Symbols", "Copy degree and temperature symbols.", ["degree", "temperature", "symbol"], "° ℃ ℉ K ∡ ∠ ⊾ ′ ″"),
  S("hand-pointer-symbols", "Hand & Pointer Symbols", "Copy hand and pointing symbols.", ["hand", "pointer", "symbol"], "☚ ☛ ☜ ☝ ☞ ☟ ✌ 👆 👇 👈 👉 👍 👎 ✋ 👌 🤙 ✊"),
];
