import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UsernameModal from "@/components/UsernameModal";
import { getUsername } from "@/lib/username";
import { uploadJadeImage } from "@/lib/jadeImages";
import { supabase } from "@/integrations/supabase/client";

const MAX_FILES = 5;
const MAX_DESC = 500;

export default function SubmitJade() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [askName, setAskName] = useState(false);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    if (!incoming.length) return;
    const combined = [...files, ...incoming].slice(0, MAX_FILES);
    setFiles(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
    e.target.value = "";
  };

  const removeFile = (i: number) => {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    const name = getUsername();
    if (!name) { setAskName(true); return; }
    if (!files.length) { toast.error("Hãy chọn ít nhất một ảnh."); return; }

    setSubmitting(true);
    try {
      const paths = await Promise.all(files.map((f) => uploadJadeImage(f, name)));
      const { error } = await supabase.from("submissions").insert({
        guest_name: name,
        description: desc.trim() || null,
        image_urls: paths,
      });
      if (error) throw error;
      toast.success("Đã gửi! Cộng đồng sẽ giúp bạn sớm thôi 🪨");
      navigate("/cong-dong");
    } catch (e: any) {
      toast.error(e.message ?? "Gửi thất bại, thử lại nhé.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Gửi vòng lên Phòng Trà</h1>
        <p className="text-muted-foreground mb-6">
          Chia sẻ chiếc vòng của bạn để cộng đồng cùng thưởng lãm và góp ý.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Ảnh ngọc (1–5 ảnh)</label>
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-border bg-muted">
                  <img src={src} alt={`upload-${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 text-white p-1 hover:bg-black/80"
                    aria-label="Xoá ảnh"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {files.length < MAX_FILES && (
                <label className="aspect-square rounded-md border-2 border-dashed border-gold/50 bg-gold/5 flex flex-col items-center justify-center cursor-pointer hover:bg-gold/10 transition text-gold-dark">
                  <ImagePlus size={28} />
                  <span className="text-xs mt-1 font-semibold">Thêm ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onFiles}
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Mô tả thêm về viên ngọc của bạn
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({desc.length}/{MAX_DESC})
              </span>
            </label>
            <Textarea
              placeholder="Vd: Mua ở chợ Bến Thành, không rõ chủng… nhờ mọi người chỉ giúp."
              maxLength={MAX_DESC}
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting || !files.length}
            className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-bold py-6 text-base"
          >
            {submitting ? (<><Loader2 className="animate-spin mr-2" size={16}/> Đang gửi…</>) : "Gửi lên cộng đồng"}
          </Button>
        </div>
      </main>

      <UsernameModal
        open={askName}
        onOpenChange={setAskName}
        onSaved={() => { setAskName(false); handleSubmit(); }}
      />
    </div>
  );
}
