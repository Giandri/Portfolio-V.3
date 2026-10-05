import "server-only";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are a professional translator for a personal portfolio website.

RULES:
- Translate the meaning naturally. Do NOT translate literally word-by-word.
- NEVER translate proper nouns or technical terms. Keep these as-is:
  Next.js, React, React.js, Node.js, TypeScript, JavaScript, Tailwind CSS,
  PostgreSQL, Prisma, Laravel, PHP, MySQL, API, REST, UI, UX, HTML, CSS,
  Git, GitHub, Vercel, Neon, Figma, Framer Motion, Motion, Recharts, Shadcn,
  Axios, Leaflet, TanStack, Redux, Docker, AWS, OAuth, JWT, Google, Microsoft.
- Keep numbers, dates, units, and proper names unchanged.
- Use the target language's natural writing style, not translated-sounding text.
- If the source is already in the target language, return it unchanged.

OUTPUT FORMAT:
Return ONLY the translated text. No explanations, no quotes, no markdown, no
prefix like "Translation:" or "Terjemahan:".`;

export type TranslateResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

function label(language: "id" | "en"): string {
  return language === "id" ? "Bahasa Indonesia" : "English";
}

async function callGroq(prompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY belum diatur.");

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Groq error ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq tidak mengembalikan teks.");
  return text;
}

/**
 * Terjemahkan satu teks. Dipakai saat admin menyimpan konten, bukan saat
 * halaman publik dibaca, supaya tidak menambah latency dan biaya per pengunjung.
 */
export async function translateText(
  text: string,
  to: "id" | "en",
): Promise<TranslateResult> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, message: "Nothing to translate." };

  try {
    const translated = await callGroq(
      `Translate the following text into ${label(to)}.\n\nTEXT:\n${trimmed}`,
      Math.min(2048, Math.ceil(trimmed.length / 2) + 256),
    );
    return { ok: true, text: translated };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Terjemahan gagal.",
    };
  }
}

/**
 * Terjemahkan daftar teks (bullet / role) sekaligus dalam satu permintaan,
 * memakai penanda angka supaya urutannya tidak kacau. Baris kosong dilewati.
 */
export async function translateList(
  items: string[],
  to: "id" | "en",
): Promise<TranslateResult> {
  const nonEmpty = items.filter((item) => item.trim());
  if (nonEmpty.length === 0) return { ok: false, message: "Nothing to translate." };

  try {
    const numbered = items
      .map((item, index) => `[${index + 1}] ${item.trim()}`)
      .join("\n");

    const raw = await callGroq(
      `Translate each line below into ${label(to)}. Keep the [N] markers exactly as they are, at the start of each translated line. Keep one line per item, do not merge or split lines.\n\n${numbered}`,
      Math.min(2048, Math.ceil(nonEmpty.join("").length / 2) + 512),
    );

    const parsed = items.map(() => "");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*\[(\d+)\]\s*(.*)$/);
      if (!match) continue;
      const index = Number(match[1]) - 1;
      if (index >= 0 && index < parsed.length) parsed[index] = match[2].trim();
    }

    // Kalau model gagal spitting penanda, pakai teks asal untuk baris yang ada.
    for (let i = 0; i < parsed.length; i++) {
      if (!parsed[i] && items[i]?.trim()) parsed[i] = items[i].trim();
    }

    return { ok: true, text: parsed.join("\n") };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Terjemahan gagal.",
    };
  }
}