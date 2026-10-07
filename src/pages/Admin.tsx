import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye, EyeOff, Loader2, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ensureAnonUser } from "@/lib/anonAuth";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  guest_name: string;
  description: string | null;
  image_urls: string[];
  created_at: string;
  is_published: boolean;
}

type Phase = "checking" | "login" | "denied" | "admin";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function Admin() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [listError, setListError] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setListError(false);
    const { data, error } = await supabase
      .from("submissions")
      .select("id, guest_name, description, image_urls, created_at, is_published")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) { setListError(true); setPosts([]); return; }
    setPosts(data ?? []);
  }, []);

  // Chỉ phiên đăng nhập bằng email VÀ có dòng 'admin' trong user_roles mới vào được.
  // (Đây chỉ là cổng giao diện; quyền thật do RLS ở backend quyết định.)
  const resolvePhase = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user || user.is_anonymous) { setPhase("login"); return; }
    const { data: role, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error || !role) { setPhase("denied"); return; }
    setPhase("admin");
    await loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    (async () => {
      // Chờ phiên ẩn danh của App (nếu đang tạo) xong, tránh ghi đè phiên admin sau này.
      try { await ensureAnonUser(); } catch { /* vẫn hiện form đăng nhập */ }
      await resolvePhase();
    })();
  }, [resolvePhase]);

  const signIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    setPassword("");
    if (error) { toast.error("Đăng nhập thất bại. Kiểm tra lại email và mật khẩu."); return; }
    setPhase("checking");
    await resolvePhase();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setPosts(null);
    setConfirmId(null);
    // Trả trình duyệt về một phiên ẩn danh để Phòng Trà tiếp tục hoạt động.
    try { await ensureAnonUser(); } catch { /* Phòng Trà sẽ tự thử lại */ }
    setPhase("login");
  };

  const toggle = async (p: Post) => {
    setWorkingId(p.id);
    const next = !p.is_published;
    const { data, error } = await supabase
      .from("submissions")
      .update({ is_published: next })
      .eq("id", p.id)
      .select("id");
    setWorkingId(null);
    // RLS chặn thì không báo lỗi mà trả 0 dòng, nên phải kiểm tra data.
    if (error || !data?.length) { toast.error("Không cập nhật được bài này."); return; }
    setPosts((prev) => prev?.map((x) => (x.id === p.id ? { ...x, is_published: next } : x)) ?? prev);
    toast.success(next ? "Đã hiện lại bài." : "Đã ẩn bài khỏi Phòng Trà.");
  };

  const remove = async (p: Post) => {
    setWorkingId(p.id);
    // Xóa dòng trước (kéo theo nhận xét); chỉ khi thành công mới xóa ảnh.
    const { data, error } = await supabase.from("submissions").delete().eq("id", p.id).select("id");
    if (error || !data?.length) {
      setWorkingId(null);
      toast.error("Không xóa được bài này.");
      return;
    }
    setPosts((prev) => prev?.filter((x) => x.id !== p.id) ?? prev);
    setConfirmId(null);
    const paths = p.image_urls ?? [];
    let photosOk = true;
    if (paths.length) {
      const { data: removed, error: rmError } = await supabase.storage.from("jade-images").remove(paths);
      photosOk = !rmError && (removed?.length ?? 0) >= paths.length;
    }
    setWorkingId(null);
    if (photosOk) toast.success("Đã xóa vĩnh viễn bài và ảnh.");
    else toast.warning("Đã xóa bài. Một số ảnh không xóa được hoặc không còn trong kho.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-8">
        {phase === "checking" && (
          <p className="text-muted-foreground text-center py-12">Đang kiểm tra…</p>
        )}

        {phase === "login" && (
          <div className="mx-auto max-w-sm">
            <h1 className="font-serif text-2xl font-bold mb-1">Quản trị Phòng Trà</h1>
            <p className="text-sm text-muted-foreground mb-5">Đăng nhập bằng tài khoản quản trị.</p>
            <form onSubmit={signIn} className="space-y-3 rounded-lg border border-border bg-card p-4">
              <div>
                <label htmlFor="admin-email" className="mb-1 block text-sm font-medium">Email</label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-1 block text-sm font-medium">Mật khẩu</label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-gold hover:bg-gold-dark text-primary-foreground"
              >
                {busy ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                Đăng nhập
              </Button>
            </form>
          </div>
        )}

        {phase === "denied" && (
          <div className="mx-auto max-w-sm text-center">
            <p className="text-muted-foreground mb-4">
              Tài khoản này không có quyền quản trị, hoặc không xác minh được quyền.
            </p>
            <Button variant="outline" onClick={signOut}>
              <LogOut size={14} className="mr-2" /> Đăng xuất
            </Button>
          </div>
        )}

        {phase === "admin" && (
          <>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h1 className="font-serif text-3xl font-bold">Quản trị Phòng Trà</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {posts ? `${posts.length} bài đăng` : "Đang tải…"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut size={14} className="mr-2" /> Đăng xuất
              </Button>
            </div>

            {listError && (
              <div className="text-center py-10 border border-dashed border-border rounded-lg mb-5">
                <p className="text-muted-foreground mb-4">Không tải được danh sách bài đăng.</p>
                <Button onClick={loadPosts} className="bg-gold hover:bg-gold-dark text-primary-foreground">
                  Thử lại
                </Button>
              </div>
            )}
            {posts && posts.length === 0 && !listError && (
              <p className="text-muted-foreground text-center py-12">Chưa có bài đăng nào.</p>
            )}

            <div className="space-y-3">
              {posts?.map((p) => (
                <div key={p.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-foreground">{p.guest_name}</span>
                    <span className="text-muted-foreground text-xs">
                      {format(new Date(p.created_at), "HH:mm d MMM yyyy", { locale: vi })}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    {p.is_published ? (
                      <span className="rounded border border-border px-2 py-0.5 text-muted-foreground">Đang hiện</span>
                    ) : (
                      <span className="rounded border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-semibold text-destructive">
                        Đã ẩn
                      </span>
                    )}
                    <span className="text-muted-foreground">{p.image_urls?.length ?? 0} ảnh</span>
                  </div>
                  {p.description && (
                    <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{p.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link to={`/cong-dong/${p.id}`}>
                      <Button variant="outline" size="sm">Xem bài</Button>
                    </Link>
                    <Button variant="outline" size="sm" disabled={workingId === p.id} onClick={() => toggle(p)}>
                      {p.is_published ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                      {p.is_published ? "Ẩn bài" : "Hiện lại"}
                    </Button>
                    {confirmId !== p.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={workingId === p.id}
                        onClick={() => setConfirmId(p.id)}
                      >
                        <Trash2 size={14} className="mr-2" /> Xóa
                      </Button>
                    )}
                  </div>

                  {confirmId === p.id && (
                    <div className="mt-3 rounded border border-destructive/40 bg-destructive/10 p-3">
                      <p className="text-sm font-semibold text-destructive">
                        Xóa vĩnh viễn bài này cùng nhận xét và ảnh? Không thể hoàn tác.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={workingId === p.id}
                          onClick={() => remove(p)}
                        >
                          {workingId === p.id ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
                          Xóa vĩnh viễn
                        </Button>
                        <Button variant="outline" size="sm" disabled={workingId === p.id} onClick={() => setConfirmId(null)}>
                          Hủy
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
