// Edge Function: analyze-jade
// Uses Lovable AI Gateway (no external key needed) with Google Gemini.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

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

CRYSTAL MATURITY (Già/Non) — independent of grade:
- Mature (già): tinh thể KHÍT, surface moist/tight/uniform, clean under light
- Immature (non): tinh thể LỎNG LẺO/lổn nhổn, fluffy white inclusions

OPTICAL EFFECTS: khởi keo, khởi quang, khởi cương — require Nếp Băng+

── COLOR SYSTEM (Sắc) ──
LỤC: Đế Vương Lục, Chính Dương Lục, Xanh Cay, Xanh Ngọt, Lục Táo, Xanh Rau Bina, Đậu Lục, Thanh Thủy Lục, Du Thanh, Hồi Lục, Mặc Thúy
TỬ: Tử La Lan, Tím Cà, Tím Lam
HỒNG HOÀNG: Hồng Phỉ, Hoàng Tông Phỉ, Phấn Hồng
LAM: Lam Thiên Không, Lam Thanh, Lão Lam Thủy
BẠCH HẮC: Bạch Nguyệt Quang, Xương Gà Đen, Mặc Thúy

── FLAWS ──
"Không lỗi" | "Vân ngọc" | "Sớ bông / Gân già" | "Chỉ màu / Gân non / Sớ âm / Sớ dọc" |
"Sớ âm dài / Sớ cấn / Mắt cát / Sần lõm" | "Sớ dọc dài / Sớ lưỡi gà" | "Sớ chéo / Sớ ngang" | "Vết nứt (Crack)"

OUTPUT — RETURN EXACTLY THIS JSON (no markdown, no fences):
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
- coverageLevel: 1=100% even, 2=70%+, 3=50%+, 4=<30%
- toneLevel: 1 pale → 5 over-saturated
- valuableSegments: 0-12
- shape: "Bản Đũa"|"Bản Dẹt"|"Bản Vuông"|"Khắc Hoa"
- crystalMaturity: "già"|"non"|"không rõ"
- jadeiteOrigin: "Myanmar"|"Guatemala"|"không rõ"
- lightingQuality: "natural"|"artificial"|"mixed"
- overallConfidence: 0.0-1.0

All vision_notes strings in poetic, elegant Vietnamese.
Return ONLY JSON. No markdown. No fences.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    if (!LOVABLE_API_KEY) throw new Error("Missing LOVABLE_API_KEY");

    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ success: false, error: "Missing imageBase64" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const dataUrl = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

    const r = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: JADE_VISION_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Phân tích chiếc vòng ngọc phỉ thúy trong ảnh và trả về JSON theo đúng format." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      if (r.status === 429) throw new Error("Rate limit exceeded. Vui lòng thử lại sau.");
      if (r.status === 402) throw new Error("AI credits exhausted. Vui lòng nạp thêm credits.");
      throw new Error(`AI Gateway error (${r.status}): ${errText}`);
    }

    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

    let parsed: any;
    try { parsed = JSON.parse(cleaned); }
    catch { throw new Error(`AI returned non-JSON: ${cleaned.slice(0, 200)}`); }

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
