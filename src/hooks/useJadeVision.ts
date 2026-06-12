import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VisionResult {
  chungPeak: string;
  chungBase: string;
  coverageLevel: 1 | 2 | 3 | 4;
  baseColor: string;
  accentColors: string[];
  toneLevel: 1 | 2 | 3 | 4 | 5;
  valuableSegments: number;
  flaws: string[];
  shape: string;
  vision_notes: {
    crystalMaturity: string;
    opticalEffects: string[];
    colorUncertainty: string;
    flawUncertainty: string;
    jadeiteOrigin: string;
    hasPhieuHoa: boolean;
    isMuna: boolean;
    lightingQuality: string;
    overallConfidence: number;
  };
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildWarnings(r: VisionResult): string[] {
  const w: string[] = [];
  const n = r.vision_notes;
  if (n.lightingQuality === "artificial")
    w.push("⚡ Ảnh chụp dưới đèn nhân tạo — màu có thể rực hơn thực tế 30-50%. AI đã hạ ước tính.");
  if (n.colorUncertainty) w.push(`🎨 ${n.colorUncertainty}`);
  if (n.flawUncertainty) w.push(`🔍 ${n.flawUncertainty}`);
  if (n.overallConfidence < 0.6)
    w.push("⚠️ Độ tin cậy thấp — ảnh chưa đủ rõ. Kết quả chỉ tham khảo.");
  if (n.hasPhieuHoa) w.push("✨ Phát hiện Phiêu Hoa — giá trị cao hơn vòng trơn cùng chủng.");
  if (n.isMuna) w.push("❄️ Đặc điểm Ngọc Muna — bông tuyết trắng bên trong.");
  if (n.jadeiteOrigin === "Guatemala")
    w.push("🌎 Có dấu hiệu Phỉ Thúy Guatemala — giá trị thấp hơn Myanmar.");
  if (n.crystalMaturity === "non")
    w.push("🌱 AI nhận định Ngọc NON (tinh thể lổn nhổn) — giá trị thấp hơn ngọc già cùng chủng.");
  return w;
}

export function useJadeVision() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VisionResult | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const analyze = useCallback(async (file: File): Promise<VisionResult | null> => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setWarnings([]);

    try {
      let imageBase64 = await fileToBase64(file);

      // Compress if too large
      if (imageBase64.length > 3_000_000) {
        const img = new Image();
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = rej;
          img.src = `data:${file.type};base64,${imageBase64}`;
        });
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 1500 / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        imageBase64 = canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
      }

      const { data: json, error: fnError } = await supabase.functions.invoke("analyze-jade", {
        body: { imageBase64, mimeType: file.type || "image/jpeg" },
      });
      if (fnError) throw new Error(fnError.message ?? "Edge Function failed");
      if (!json?.success) throw new Error(json?.error ?? "Edge Function failed");

      const v: VisionResult = json.data;
      const w = buildWarnings(v);
      setResult(v);
      setWarnings(w);
      return v;
    } catch (e: any) {
      setError(e.message ?? "Phân tích ảnh thất bại.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyze,
    isLoading,
    error,
    result,
    confidence: result?.vision_notes.overallConfidence ?? 0,
    warnings,
  };
}
