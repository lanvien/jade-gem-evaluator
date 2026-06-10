# Kế hoạch triển khai 6 yêu cầu

Yêu cầu này lớn (chạm Assessment, Header, Vault, định tuyến mới + cần backend cho privacy code). Em đề xuất chia **2 đợt** làm liên tiếp, không chờ test giữa, nhưng tách rõ để dễ rollback nếu hỏng.

---

## ĐỢT A — Frontend-only (làm ngay)

### 1. Khung ảnh câu hỏi (Assessment)
- Khôi phục layout khung cũ: container vuông `aspect-square` với border + bg sang trọng như bản trước.
- Ảnh vòng bên trong: đổi từ `object-contain p-2` → `object-cover w-full h-full` (fill kín khung), giữ `cursor-zoom-in` để mở Lightbox.
- KHÔNG đổi cấu trúc grid câu hỏi.

### 2. Vision AI khôi phục + prefill
- Kiểm tra lại `useJadeVision` + nút upload ở Q1 còn hoạt động không (nếu bị ẩn do banner prefill thì bỏ điều kiện ẩn).
- Đảm bảo prefill từ AI vẫn map đúng các câu hỏi (đã làm ở phase trước, chỉ verify).

### 3. Nội tại — Icon thay vì ảnh nhỏ
- File: `src/components/assessment/PatternStructure.tsx` (hoặc nơi đang render hình Vân/Sớ).
- Thay mỗi item ảnh bằng 1 icon Lucide (vd: `Sparkles`, `Waves`, `GitBranch`...) trong khung tròn vàng.
- Click icon → mở `Dialog` (shadcn) hiển thị "Information Card": tên đặc điểm + mô tả phong thủy/thẩm mỹ chi tiết.
- Văn phong giữ nguyên giọng thanh nhã đã thiết lập.

### 4. Gộp Ni + Chột + Dày thành 1 câu
- File: `src/data/questions.ts` + `src/pages/Assessment.tsx`.
- Tạo question type mới `multi-number` (hoặc reuse): 1 step duy nhất, render 3 input số cạnh nhau với label riêng.
  - Ni vòng: 47–65, step 0.5
  - Chột vòng (đường kính trong): khoảng hợp lý, step 0.5
  - Độ dày: 6–18, step 0.5
- Cập nhật `pricingEngine` đọc từ key mới (giữ backward compat).

### 5. Hamburger Menu + Sidebar (Header)
- Thêm icon `Menu` bên trái logo "Hiểu Ngọc".
- Click → mở `Sheet` từ trái (shadcn `sheet` side="left").
- Nội dung Sidebar (style "tabs & outlines" — viền vàng nhạt, divider, mỗi mục là 1 ô có outline):
  - Input "Nhập code Cốp Ngọc..." + nút Mở.
  - Link Trang chủ (`/`).
  - Link Cộng đồng thẩm định (`/phong-tra` — sẽ tạo placeholder page "Sắp ra mắt" ở đợt này, hoàn thiện sau).
  - Link Cẩm nang (`#guides`).
- Khi nhập code hợp lệ → navigate `/vong/{code}`.

### 6a. Trang `/vong/:id` (skeleton frontend)
- Tạo `src/pages/PublicBracelet.tsx` đọc từ localStorage `jadeVault` trước (cho ring của chính mình).
- Hiển thị: ảnh user upload (hoặc SVG ring), tên, đoạn assessment, ID + nút Copy Code + Copy Link.
- Nếu không tìm thấy ID: "Chiếc vòng này chưa được chia sẻ công khai hoặc không tồn tại."
- Trong Vault detail card: thêm khối "Mã định danh" với ID (8 ký tự từ nanoid đã có), nút Copy Code, nút Copy Link `https://.../vong/{id}`, toggle "Công khai" (lưu local field `isPublic` trên JadeItem).

---

## ĐỢT B — Cross-device share (cần Lovable Cloud)

Hiện tại `jadeVault` chỉ ở localStorage máy của owner → người khác mở link sẽ KHÔNG thấy gì. Để link thật sự share được:

- Bật **Lovable Cloud**, tạo bảng `public_bracelets` (id text PK, owner_session_id, name, payload jsonb, image_url text, is_public bool, created_at).
- RLS: SELECT public khi `is_public=true`; INSERT/UPDATE chỉ owner (match `owner_session_id` lưu trong localStorage).
- Khi bật toggle "Công khai" trong Vault → upsert lên Cloud.
- `/vong/:id` query Cloud trước, fallback localStorage.
- Storage bucket cho ảnh user upload (hiện đang base64 trong localStorage — sẽ upload file thật).

---

## File sẽ tạo/sửa (Đợt A)

**Mới:**
- `src/components/AppSidebarSheet.tsx` (Hamburger sidebar)
- `src/components/assessment/IntrinsicIcons.tsx` (icon + dialog cho Nội tại)
- `src/pages/PublicBracelet.tsx`

**Sửa:**
- `src/pages/Assessment.tsx` (khung ảnh, gộp Ni/Chột/Dày)
- `src/data/questions.ts` (merge 3 câu)
- `src/components/Header.tsx` (hamburger)
- `src/components/assessment/PatternStructure.tsx` (icon hóa)
- `src/pages/JadeVault.tsx` (block ID + copy + toggle public)
- `src/lib/jadeVault.ts` (thêm `isPublic`, helper getById)
- `src/App.tsx` (route `/vong/:id`)

---

## Em xin xác nhận

- **OK đợt A trước** (em làm ngay, ~1 lượt) → anh test → confirm sang Đợt B (bật Cloud).
- Hay anh muốn em **gộp luôn cả A+B** trong 1 lượt (rủi ro cao hơn, sẽ bật Cloud mà không hỏi lại).

Anh trả lời "OK đợt A" hoặc "làm hết A+B".
