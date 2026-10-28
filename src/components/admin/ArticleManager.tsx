import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, ExternalLink, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  SLUG_PATTERN,
  coverPublicUrl,
  removeArticleCover,
  slugify,
  uploadArticleCover,
  validateCoverFile,
  type ArticleRow,
} from "@/lib/articles";
import ArticleContent from "@/components/ArticleContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ListItem = Pick<
  ArticleRow,
  "id" | "slug" | "title" | "status" | "category" | "cover_image_path" | "published_at" | "updated_at"
>;

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  content: string;
  seo_title: string;
  seo_description: string;
}

const EMPTY: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  category: "",
  content: "",
  seo_title: "",
  seo_description: "",
};

const fromRow = (r: ArticleRow): FormState => ({
  title: r.title ?? "",
  slug: r.slug ?? "",
  excerpt: r.excerpt ?? "",
  category: r.category ?? "",
  content: r.content ?? "",
  seo_title: r.seo_title ?? "",
  seo_description: r.seo_description ?? "",
});

const LIST_COLUMNS = "id, slug, title, status, category, cover_image_path, published_at, updated_at";

function describeError(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) return "Không lưu được bài viết.";
  if (error.code === "23505") return "Slug này đã được dùng cho bài khác.";
  const msg = (error.message ?? "").toLowerCase();
  if (msg.includes("slug")) return `Lỗi slug: ${error.message}`;
  if (error.code === "23514" || msg.includes("check") || msg.includes("violates")) {
    return `Dữ liệu không hợp lệ: ${error.message}`;
  }
  return "Không lưu được bài viết. Vui lòng thử lại.";
}

export default function ArticleManager() {
  const [list, setList] = useState<ListItem[] | null>(null);
  const [listError, setListError] = useState(false);

  const [editing, setEditing] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [article, setArticle] = useState<ArticleRow | null>(null); // dòng đã lưu; null = bài mới
  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);

  const [saving, setSaving] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadList = useCallback(async () => {
    setListError(false);
    const { data, error } = await supabase
      .from("articles")
      .select(LIST_COLUMNS)
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) {
      setListError(true);
      setList([]);
      return;
    }
    setList(data ?? []);
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const slugLocked = article?.published_at != null; // đã từng xuất bản → khóa slug
  const isPublished = article?.status === "published";
  const baseline = article ? fromRow(article) : EMPTY;
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const openNew = () => {
    setArticle(null);
    setForm(EMPTY);
    setSlugTouched(false);
    setEditing(true);
  };

  const openEdit = async (id: string) => {
    setLoadingEdit(true);
    const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
    setLoadingEdit(false);
    if (error || !data) {
      toast.error("Không tải được bài viết.");
      return;
    }
    setArticle(data);
    setForm(fromRow(data));
    setSlugTouched(true);
    setEditing(true);
  };

  const closeEditor = () => {
    if (dirty && !window.confirm("Có thay đổi chưa lưu. Rời đi và bỏ các thay đổi này?")) return;
    setEditing(false);
    setArticle(null);
    loadList();
  };

  const onTitleChange = (v: string) => {
    setForm((f) => ({ ...f, title: v, slug: !slugTouched && !slugLocked ? slugify(v) : f.slug }));
  };

  const validate = (forPublish: boolean): string | null => {
    if (!form.title.trim()) return "Vui lòng nhập tiêu đề.";
    if (!SLUG_PATTERN.test(form.slug)) return "Slug chỉ gồm chữ thường, số và dấu gạch ngang (vd: cach-soi-den-ngoc).";
    if (forPublish) {
      if (!form.excerpt.trim()) return "Cần có mô tả ngắn trước khi xuất bản.";
      if (!form.content.trim()) return "Cần có nội dung trước khi xuất bản.";
    }
    return null;
  };

  /** Lưu các trường văn bản (+ trạng thái nếu có). Thời gian do server quyết định. */
  const persist = async (status?: "draft" | "published"): Promise<boolean> => {
    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category.trim(),
      content: form.content,
      seo_title: form.seo_title.trim(),
      seo_description: form.seo_description.trim(),
      ...(slugLocked ? {} : { slug: form.slug }),
      ...(status ? { status } : {}),
    };
    setSaving(true);
    let row: ArticleRow | null = null;
    let error: { code?: string; message?: string } | null = null;
    if (article) {
      const res = await supabase.from("articles").update(payload).eq("id", article.id).select("*").maybeSingle();
      row = res.data;
      error = res.error;
      // RLS chặn thì không báo lỗi mà trả 0 dòng.
      if (!error && !row) error = { message: "Không có quyền hoặc bài không còn tồn tại." };
    } else {
      const res = await supabase
        .from("articles")
        .insert({ ...payload, slug: form.slug })
        .select("*")
        .single();
      row = res.data;
      error = res.error;
    }
    setSaving(false);
    if (error || !row) {
      toast.error(describeError(error));
      return false;
    }
    setArticle(row);
    setForm(fromRow(row));
    loadList();
    return true;
  };

  const saveDraft = async () => {
    const err = validate(false);
    if (err) return toast.error(err);
    if (await persist()) toast.success(isPublished ? "Đã lưu thay đổi." : "Đã lưu nháp.");
  };

  const publish = async () => {
    const err = validate(true);
    if (err) return toast.error(err);
    if (await persist("published")) toast.success("Đã xuất bản bài viết.");
  };

  const unpublish = async () => {
    const err = validate(false);
    if (err) return toast.error(err);
    if (await persist("draft")) toast.success("Đã gỡ về bản nháp.");
  };

  // ---- Ảnh bìa: luôn tải lên đường dẫn mới; xóa ảnh cũ chỉ sau khi DB cập nhật xong. ----
  const onPickCover = async (file: File | undefined) => {
    if (fileRef.current) fileRef.current.value = "";
    if (!file || !article) return;
    const invalid = validateCoverFile(file);
    if (invalid) return toast.error(invalid);

    setCoverBusy(true);
    const oldPath = article.cover_image_path;
    let newPath: string;
    try {
      newPath = await uploadArticleCover(article.id, file);
    } catch {
      setCoverBusy(false);
      return toast.error("Không tải được ảnh lên.");
    }
    const { data, error } = await supabase
      .from("articles")
      .update({ cover_image_path: newPath })
      .eq("id", article.id)
      .select("*")
      .maybeSingle();
    if (error || !data) {
      await removeArticleCover(newPath); // dọn ảnh vừa tải vì DB không nhận
      setCoverBusy(false);
      return toast.error("Không cập nhật được ảnh bìa.");
    }
    // Chỉ cập nhật trường ảnh, giữ nguyên phần chữ đang soạn chưa lưu.
    setArticle((a) => (a ? { ...a, cover_image_path: data.cover_image_path, updated_at: data.updated_at } : a));
    loadList();
    const cleaned = oldPath ? await removeArticleCover(oldPath) : true;
    setCoverBusy(false);
    if (cleaned) toast.success("Đã cập nhật ảnh bìa.");
    else toast.warning("Đã đổi ảnh bìa, nhưng ảnh cũ chưa xóa được khỏi kho.");
  };

  const onRemoveCover = async () => {
    if (!article?.cover_image_path) return;
    setCoverBusy(true);
    const oldPath = article.cover_image_path;
    const { data, error } = await supabase
      .from("articles")
      .update({ cover_image_path: null })
      .eq("id", article.id)
      .select("*")
      .maybeSingle();
    if (error || !data) {
      setCoverBusy(false);
      return toast.error("Không gỡ được ảnh bìa.");
    }
    setArticle((a) => (a ? { ...a, cover_image_path: null, updated_at: data.updated_at } : a));
    loadList();
    const cleaned = await removeArticleCover(oldPath);
    setCoverBusy(false);
    if (cleaned) toast.success("Đã xóa ảnh bìa.");
    else toast.warning("Đã gỡ ảnh bìa, nhưng tệp chưa xóa được khỏi kho.");
  };

  // ---- Xóa vĩnh viễn: xóa dòng DB trước, thành công mới dọn ảnh. ----
  const doDelete = async () => {
    if (!article) return;
    setDeleting(true);
    const { data, error } = await supabase.from("articles").delete().eq("id", article.id).select("id");
    if (error || !data?.length) {
      setDeleting(false);
      return toast.error("Không xóa được bài viết.");
    }
    const cleaned = await removeArticleCover(article.cover_image_path);
    setDeleting(false);
    setDeleteOpen(false);
    setEditing(false);
    setArticle(null);
    loadList();
    if (cleaned) toast.success("Đã xóa vĩnh viễn bài viết.");
    else toast.warning("Đã xóa bài. Ảnh bìa chưa xóa được khỏi kho.");
  };

  // ======================= Danh sách =======================
  if (!editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">{list ? `${list.length} bài viết` : "Đang tải…"}</p>
          <Button onClick={openNew} className="bg-gold hover:bg-gold-dark text-primary-foreground" size="sm">
            <Plus size={14} className="mr-2" /> Bài mới
          </Button>
        </div>

        {list === null && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        )}

        {listError && (
          <div className="text-center py-10 border border-dashed border-border rounded-lg mb-5">
            <p className="text-muted-foreground mb-4">Không tải được danh sách bài viết.</p>
            <Button onClick={loadList} className="bg-gold hover:bg-gold-dark text-primary-foreground">
              Thử lại
            </Button>
          </div>
        )}

        {list && list.length === 0 && !listError && (
          <p className="text-muted-foreground text-center py-12">Chưa có bài viết nào.</p>
        )}

        <div className="space-y-3">
          {list?.map((a) => {
            const cover = coverPublicUrl(a.cover_image_path);
            return (
              <button
                key={a.id}
                type="button"
                disabled={loadingEdit}
                onClick={() => openEdit(a.id)}
                className="w-full text-left flex items-center gap-4 rounded-lg border border-border bg-card p-3 hover:border-gold transition-colors"
              >
                {cover ? (
                  <img src={cover} alt="" className="h-14 w-14 rounded object-cover flex-shrink-0" />
                ) : (
                  <div className="h-14 w-14 rounded bg-muted flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{a.title}</span>
                    <Badge variant={a.status === "published" ? "default" : "secondary"}>
                      {a.status === "published" ? "Đã đăng" : "Nháp"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    /{a.slug}
                    {a.category ? ` · ${a.category}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cập nhật {format(new Date(a.updated_at), "HH:mm d MMM yyyy", { locale: vi })}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ======================= Trình soạn =======================
  const cover = coverPublicUrl(article?.cover_image_path);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="sm" onClick={closeEditor}>
          <ArrowLeft size={14} className="mr-2" /> Danh sách
        </Button>
        <div className="flex items-center gap-2">
          {article && (
            <Badge variant={isPublished ? "default" : "secondary"}>{isPublished ? "Đã đăng" : "Nháp"}</Badge>
          )}
          {isPublished && article && (
            <Link to={`/cam-nang/${article.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink size={14} className="mr-2" /> Xem bài
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div>
          <Label htmlFor="art-title">Tiêu đề</Label>
          <Input id="art-title" value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="art-slug">Slug (đường dẫn)</Label>
          <Input
            id="art-slug"
            value={form.slug}
            disabled={slugLocked}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value.toLowerCase());
            }}
            placeholder="vi-du-ten-bai"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {slugLocked
              ? "Slug đã khóa vì bài từng được xuất bản."
              : `Địa chỉ: /cam-nang/${form.slug || "…"} — không đổi được sau lần xuất bản đầu tiên.`}
          </p>
        </div>
        <div>
          <Label htmlFor="art-category">Chuyên mục / phụ đề</Label>
          <Input id="art-category" value={form.category} onChange={(e) => set("category", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="art-excerpt">Mô tả ngắn</Label>
          <Textarea
            id="art-excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <Label>Ảnh bìa</Label>
        {!article ? (
          <p className="mt-1 text-sm text-muted-foreground">Lưu nháp trước, sau đó có thể tải ảnh bìa (JPG/PNG/WebP, tối đa 5 MB).</p>
        ) : (
          <div className="mt-2 flex items-center gap-4">
            {cover ? (
              <img src={cover} alt="Ảnh bìa" className="h-24 w-36 rounded object-cover" />
            ) : (
              <div className="h-24 w-36 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Chưa có ảnh
              </div>
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => onPickCover(e.target.files?.[0])}
              />
              <Button variant="outline" size="sm" disabled={coverBusy} onClick={() => fileRef.current?.click()}>
                {coverBusy ? <Loader2 className="animate-spin mr-2" size={14} /> : <ImagePlus size={14} className="mr-2" />}
                {cover ? "Thay ảnh" : "Tải ảnh lên"}
              </Button>
              {cover && (
                <Button variant="outline" size="sm" disabled={coverBusy} onClick={onRemoveCover}>
                  <Trash2 size={14} className="mr-2" /> Xóa ảnh
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <Label>Nội dung (Markdown)</Label>
        <Tabs defaultValue="write" className="mt-2">
          <TabsList>
            <TabsTrigger value="write">Soạn</TabsTrigger>
            <TabsTrigger value="preview">Xem trước</TabsTrigger>
          </TabsList>
          <TabsContent value="write">
            <Textarea
              rows={18}
              className="font-mono text-sm"
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="## Tiêu đề phần&#10;&#10;Nội dung bằng Markdown…"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Chỉ hỗ trợ Markdown; HTML thô và ảnh chèn trong bài sẽ không hiển thị.
            </p>
          </TabsContent>
          <TabsContent value="preview">
            <div className="min-h-[200px] rounded-md border border-border bg-background p-4">
              {form.content.trim() ? (
                <ArticleContent markdown={form.content} />
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có nội dung.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div>
          <Label htmlFor="art-seo-title">SEO title (tùy chọn)</Label>
          <Input id="art-seo-title" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="art-seo-desc">SEO description (tùy chọn)</Label>
          <Textarea
            id="art-seo-desc"
            rows={2}
            value={form.seo_description}
            onChange={(e) => set("seo_description", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" disabled={saving || deleting} onClick={saveDraft}>
          {saving ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
          {isPublished ? "Lưu thay đổi" : "Lưu nháp"}
        </Button>
        {isPublished ? (
          <Button variant="outline" disabled={saving || deleting} onClick={unpublish}>
            Gỡ về nháp
          </Button>
        ) : (
          <Button
            disabled={saving || deleting}
            onClick={publish}
            className="bg-gold hover:bg-gold-dark text-primary-foreground"
          >
            Xuất bản
          </Button>
        )}
        {article && (
          <Button
            variant="outline"
            disabled={saving || deleting}
            onClick={() => setDeleteOpen(true)}
            className="ml-auto text-destructive"
          >
            <Trash2 size={14} className="mr-2" /> Xóa vĩnh viễn
          </Button>
        )}
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={(o) => !deleting && setDeleteOpen(o)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn bài viết?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài “{article?.title}” và ảnh bìa sẽ bị xóa, không thể hoàn tác. Nếu chỉ muốn ẩn khỏi công khai, hãy chọn “Gỡ về nháp”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                doDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="animate-spin mr-2" size={14} /> : null}
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
