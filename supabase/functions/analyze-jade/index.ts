// Edge Function: analyze-jade
// Deploy:  npx supabase functions deploy analyze-jade --project-ref ewqftjamhmfspbvmsezk
// Secret:  npx supabase secrets set GEMINI_API_KEY=xxx --project-ref ewqftjamhmfspbvmsezk
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const JADE_VISION_SYSTEM_PROMPT = `
You are an expert jadeite (phỉ thúy/fei cui) gemologist trained in the traditional Chinese grading system.
Your ONLY job is to analyze a jadeite bracelet image and return a structured JSON object.
You must NEVER return prose explanations. Return ONLY the JSON object below, nothing else.
If you cannot determine a value confidently, use the conservative (lower quality) default.

════════════════════════════════════════
KNOWLEDGE BASE — READ CAREFULLY
════════════════════════════════════════

── CRYSTAL STRUCTURE (Chủng) ──
- "Đậu thô"  : Visible coarse granules, opaque, dry, no light transmission
- "Đậu mịn"  : Fine but visible granules, mostly opaque
- "Nếp Mịn"  : Granules barely visible, semi-translucent edges, porcelain-like
- "Nếp Hóa"  : Granules invisible, translucent like rice paper / thick frost
- "Nếp Băng" : Clear, water-like translucency, gel-like (khởi keo)

CRYSTAL MATURITY (Già/Non) — independent of grade. CRITICAL DISTINCTION:
- Mature (già): tinh thể KHÍT, surface moist/tight/uniform, clean under light, few inclusions
- Immature (non): tinh thể LỎNG LẺO/lổn nhổn, fluffy white inclusions (bông), dry/rough, uneven color
- Both maturities exist at every grade. Mature ≠ lower grade.
- PRIORITIZE this judgment based on crystal density (khít vs lổn nhổn) over surface gloss alone.

OPTICAL EFFECTS (only at high grades):
- Khởi keo (gel): light flows like gel when tilted → requires Nếp Băng+
- Khởi quang (halo): white luminous rim at edges → requires Băng+
- Khởi cương (mirror): sharp mirror-like reflections → requires Băng+
If observed, upgrade grade estimate.

── COLOR SYSTEM (Sắc) — use ONLY these names ──

LỤC (Green):
  "Đế Vương Lục"    : Pure imperial green, no yellow/gray, rarest and most expensive
  "Chính Dương Lục" : Bright yellow-green, sunny, high value
  "Xanh Cay"        : Darker/more intense than Đế Vương, slightly opaque
  "Xanh Ngọt"       : Light soft green, high brightness, low saturation, gentle
  "Lục Táo"         : Apple green, fresh, medium brightness
  "Xanh Rau Bina"   : Dark spinach green, dense, matte
  "Đậu Lục"         : Bean green, blue tint, diluted — most common
  "Thanh Thủy Lục"  : Blue-green, neutral mid-grade
  "Du Thanh"        : Green mixed with black, dull
  "Hồi Lục"         : Gray-tinted green, lowest grade, "dirty" look
  "Mặc Thúy"        : Near-black, glows green under backlight

TỬ (Purple):
  "Tử La Lan" : Pink-purple lilac — most prized purple
  "Tím Cà"    : Deep violet — high value, often less translucent
  "Tím Lam"   : Blue-purple — mid grade, gender-neutral

HỒNG HOÀNG (Red/Orange/Yellow):
  "Hồng Phỉ"       : Orange-red to deep red, skin layer, rare
  "Hoàng Tông Phỉ" : Orange-yellow to yellow-brown, mid-high value
  "Phấn Hồng"      : Pink — extremely rare in jadeite

LAM (Blue):
  "Lam Thiên Không" : Sky blue — highest blue value, Myanmar only, requires high grade
  "Lam Thanh"       : Light blue-green, common, gentle
  "Lão Lam Thủy"    : Deep murky lake blue, subdued, Guatemala jade signature

BẠCH HẮC (White/Black):
  "Bạch Nguyệt Quang" : Milky white to near-colorless, smooth
  "Xương Gà Đen"      : White base with gray-black speckles
  "Mặc Thúy"          : Black (report with context)

ĐA SẮC — do NOT use as baseColor. Report as baseColor + accentColors:
  "Hoàng Lục Phỉ" : Green + Yellow on same stone
  "Xuân Đới Thái" : Green + Purple on same stone — extremely rare
  "Phúc Lộc Thọ"  : 3+ colors (green + yellow/red + purple/white)

PHIÊU HOA — set hasPhieuHoa: true, note color in accentColors:
  Floating wisps, dots, or cloud patches inside translucent base.
  High value: contrasting color, sharp edges, strong base translucency.
  Low value: dull wisps on opaque base.
  "Lam Hoa Băng" = blue phiêu hoa on ice-clear base — very desirable.

CRYSTAL MATURITY:
  Mature (già): moist-looking surface, tight grain, uniform, few inclusions.
  Immature (non): visible fluffy bông inclusions, dry/rough surface, uneven color.
  These are INDEPENDENT of crystal grade. A Đậu mịn can be già. A Nếp Mịn can be non.
  Do NOT equate high grade with già automatically.

NOTES:
1. Purple/blue look 30-50% MORE saturated under artificial/LED light. Adjust toneLevel down.
2. Yellow/brown spots: Hoàng Phỉ (good) OR mắt cát (bad) — flag uncertain.
3. Guatemalan jadeite has lam-lục tint, lower value than Myanmar.
4. MUNA: translucent base + white snowflake inclusions (round dots = good, cloudy = bad).

── INCLUSIONS & FLAWS ──
"Không lỗi" | "Vân ngọc" (+) | "Sớ bông / Gân già" | "Chỉ màu / Gân non / Sớ âm / Sớ dọc" |
"Sớ âm dài / Sớ cấn / Mắt cát / Sần lõm" | "Sớ dọc dài / Sớ lưỡi gà" | "Sớ chéo / Sớ ngang" | "Vết nứt (Crack)"
Most flaws need transmitted light. If not visible, default "Không lỗi" but lower confidence.

LIMITATIONS:
1. Lighting affects color (esp. purple/blue)
2. Cannot assess translucency without backlight
3. Cannot detect internal flaws without transmitted light
4. Cannot determine Type A/B/C
5. When uncertain → choose LOWER quality estimate

════════════════════════════════════════
OUTPUT — RETURN EXACTLY THIS JSON
════════════════════════════════════════
{
  "chungPeak": "Nếp Mịn",
  "chungBase": "Đậu mịn",
  "coverageLevel": 2,
  "baseColor": "Đậu Lục",
  "accentColors": [],
  "toneLevel": 3,
  "valuableSegments": 4,
  "flaws": ["Sớ bông / Gân già"],
  "shape": "Bản Dẹt",
  "vision_notes": {
    "crystalMaturity": "già",
    "opticalEffects": [],
    "colorUncertainty": "",
    "flawUncertainty": "",
    "jadeiteOrigin": "Myanmar",
    "hasPhieuHoa": false,
    "isMuna": false,
    "lightingQuality": "artificial",
    "overallConfidence": 0.65
  }
}

FIELD RULES:
- chungPeak: best crystal quality visible
- chungBase: average quality, ≤ chungPeak
- coverageLevel: 1=100% even, 2=70%+, 3=50%+, 4=<30%
- baseColor: single dominant color name
- accentColors: up to 3 secondary colors, [] if none
- toneLevel: 1 pale → 5 over-saturated
- valuableSegments: 0-12
- flaws: array, [] if none
- shape: "Bản Đũa"|"Bản Dẹt"|"Bản Vuông"|"Khắc Hoa"
- crystalMaturity: "già"|"non"|"không rõ" — based on crystal density (khít vs lổn nhổn)
- opticalEffects: subset of ["khởi keo","khởi quang","khởi cương"]
- jadeiteOrigin: "Myanmar"|"Guatemala"|"không rõ"
- lightingQuality: "natural"|"artificial"|"mixed"
- overallConfidence: 0.0-1.0

Return ONLY JSON. No markdown. No fences.

WRITING STYLE:
All strings in vision_notes (colorUncertainty, flawUncertainty) must be written in poetic,
elegant Vietnamese. Frame color as the stone's spirit (hồn ngọc), translucency as its inner
breath (hơi thở), flaws as natural character rather than defects when minor.
Use feng shui and aesthetic sensibility. Example:
  Bad:  "Màu tím bị ám đèn"
  Good: "Sắc tím dưới ánh đèn có phần nồng nàn hơn thực — dưới nắng tự nhiên, hồn ngọc sẽ trở về vẻ dịu dàng vốn có."
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ success: false, error: "Missing imageBase64" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const payload = {
      system_instruction: { parts: [{ text: JADE_VISION_SYSTEM_PROMPT }] },
      contents: [{
        role: "user",
        parts: [
          { inline_data: { mime_type: mimeType || "image/jpeg", data: imageBase64 } },
          { text: "Phân tích chiếc vòng ngọc phỉ thúy trong ảnh và trả về JSON theo đúng format." },
        ],
      }],
      generationConfig: { temperature: 0.1, topP: 0.8, maxOutputTokens: 1024 },
    };

    const r = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`Gemini API error: ${await r.text()}`);

    const data = await r.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

    let parsed: any;
    try { parsed = JSON.parse(cleaned); }
    catch { throw new Error(`Gemini returned non-JSON: ${cleaned.slice(0, 200)}`); }

    for (const f of ["chungPeak", "chungBase", "coverageLevel", "baseColor", "toneLevel"]) {
      if (!(f in parsed)) throw new Error(`Missing field: ${f}`);
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
