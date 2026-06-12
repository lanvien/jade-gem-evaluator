import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrls } from "@/lib/jadeImages";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UsernameModal from "@/components/UsernameModal";
import { getUsername } from "@/lib/username";

interface Submission {
  id: string;
  guest_name: string;
  description: string | null;
  image_urls: string[];
  created_at: string;
}
interface Comment {
  id: string;
  submission_id: string;
  guest_name: string;
  content: string;
  created_at: string;
}

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const [sub, setSub] = useState<Submission | null>(null);
  const [signed, setSigned] = useState<string[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [askName, setAskName] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("submissions").select("*").eq("id", id).maybeSingle();
      if (!data) { setNotFound(true); return; }
      setSub(data as Submission);
      setSigned(await getSignedUrls(data.image_urls ?? []));
      const { data: cs } = await supabase
        .from("comments")
        .select("*")
        .eq("submission_id", id)
        .order("created_at", { ascending: true });
      setComments((cs ?? []) as Comment[]);
    })();
  }, [id]);

  const submitComment = async () => {
    const name = getUsername();
    if (!name) { setAskName(true); return; }
    const content = draft.trim();
    if (!content || !id) return;
    setPosting(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({ submission_id: id, guest_name: name, content })
        .select()
        .single();
      if (error) throw error;
      setComments((prev) => [...prev, data as Comment]);
      setDraft("");
    } catch (e: any) {
      toast.error(e.message ?? "Gửi nhận xét thất bại.");
    } finally {
      setPosting(false);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-muted-foreground">Không tìm thấy bài đăng.</p>
          <Link to="/cong-dong" className="text-gold underline mt-3 inline-block">← Về Phòng Trà</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-6">
        <Link to="/cong-dong" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={14} className="mr-1" /> Phòng Trà
        </Link>

        {!sub && <p className="text-muted-foreground">Đang tải…</p>}

        {sub && (
          <article className="rounded-lg border border-border bg-card overflow-hidden">
            {signed.length > 0 && (
              <div className="flex gap-2 overflow-x-auto bg-muted/40 p-2 snap-x">
                {signed.map((u, i) => (
                  <img
                    key={i}
                    src={u}
                    alt={`vòng ${i + 1}`}
                    className="h-80 w-auto object-cover rounded snap-start flex-shrink-0"
                  />
                ))}
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold">{sub.guest_name}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(sub.created_at), "HH:mm — d MMM yyyy", { locale: vi })}
                </span>
              </div>
              {sub.description && (
                <p className="mt-3 text-sm whitespace-pre-wrap text-foreground/90">{sub.description}</p>
              )}
            </div>
          </article>
        )}

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold mb-4">
            Nhận xét ({comments.length})
          </h2>

          <div className="space-y-3 mb-6">
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Chưa có nhận xét nào. Hãy là người đầu tiên thưởng ngọc.
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="rounded-md border border-border bg-card p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{c.guest_name}</span>
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: vi })}
                  </span>
                </div>
                <p className="mt-1.5 text-sm whitespace-pre-wrap">{c.content}</p>
              </div>
            ))}
          </div>

          <div className="rounded-md border border-border bg-card p-3">
            <Textarea
              placeholder="Nhận xét của bạn..."
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={1000}
            />
            <div className="flex justify-end mt-2">
              <Button
                onClick={submitComment}
                disabled={posting || !draft.trim()}
                className="bg-gold hover:bg-gold-dark text-primary-foreground"
              >
                {posting ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                Gửi nhận xét
              </Button>
            </div>
          </div>
        </section>
      </main>

      <UsernameModal
        open={askName}
        onOpenChange={setAskName}
        onSaved={() => { setAskName(false); submitComment(); }}
      />
    </div>
  );
}
