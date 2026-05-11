# Đề xuất chia nhỏ công việc

Yêu cầu này rất lớn (chạm ~10 file + 2 bảng DB mới + 2 trang public mới). Để tránh "fix một cái sai một cái khác" như đã xảy ra, em đề xuất chia làm **3 đợt deploy**, mỗi đợt em làm xong → anh test → mới sang đợt sau.

---

## ĐỢT 1 — Polish hiện tại (KHÔNG đụng backend)

Làm trong 1 lần, không động đến design trang Results trừ 2 thứ anh dặn:

1. **Trang Results** (chỉ thêm, không sửa layout):
   - "cốp ngọc" trong nút "Lưu về cốp ngọc của bạn" và text "Về cốp ngọc của bạn >>>" → link sang `/jade-vault`
   - Sau khi lưu: chạy `flyToVault` animation + toast "Đã cất vào Cốp Ngọc ✨"

2. **FIX 1 — Navbar**: thêm lại link "Cốp ngọc của tôi" (text) bên cạnh icon 🏺 + giữ nút "Định giá ngay"

3. **FIX 2 — Shimmer**: thêm hiệu ứng sheen chéo cho nút "Định giá Phỉ Thuý" trên homepage (chỉ CSS, không đổi màu/size)

4. **FIX 3 — Assessment**:
   - 3a: swap câu 7 ↔ 8 (shape ↔ ni vòng)
   - 3b: ni 47–65mm step 0.5; chốt 6–18mm
   - 3c: ảnh minh hoạ `object-contain max-h-[160px] w-auto`
   - 3d: bảng màu collapse theo nhóm (chỉ Lục sắc hệ mở mặc định)

5. **FIX 4 — AI prefill** thực sự điền form: map chungPeak/Base→Q1, coverage→Q3, baseColor→Q4 swatch, segments→12 ô vòng theo opacity của toneLevel, hasPhieuHoa→overlay, flaws→Q5, shape→Q7. Sau prefill ẩn upload ở các bước sau + banner vàng + warnings.

6. **FIX 5 — Jade Vault redesign**: nền dark rosewood (CSS gradient), animation lid mở 1 lần/session, grid compartment crimson + viền vàng, slot có cloud pattern góc, ring SVG 90px + drop-shadow, detail sheet wood-grain + Playfair Display, chia sẻ chưa làm ở đợt này.

---

## ĐỢT 2 — Bước 2: Public link `/vong/{id}`

- Migration tạo table `public_bracelets` (id text PK, owner_session_id, name, segments jsonb, has_phieu_hoa, is_muna, assessment jsonb, is_public, created_at)
- RLS: ai cũng SELECT được khi `is_public=true`; chỉ owner (match `owner_session_id` từ localStorage) mới UPSERT/UPDATE
- Trong detail card vault: toggle "Công khai để chia sẻ" + nút "Chia sẻ" copy link
- Trang `/vong/:id` read-only, nếu private/không tồn tại → "Chiếc vòng này chưa được chia sẻ công khai"
- CTA "Tự định giá vòng của bạn →" cuối trang

---

## ĐỢT 3 — Bước 3: Phòng Trà Thưởng Ngọc

- Trang `/phong-tra` masonry grid public bracelets, pagination 10/page
- Trang chi tiết `/phong-tra/:id` + bình luận
- Migration `bracelet_comments` (nickname, content, is_expert, is_hidden) + `bracelet_reports`
- Badge "Giám định viên" vàng cho `is_expert=true`, comment expert pinned + viền vàng trái
- Nút "⚑ Báo cáo" insert vào `bracelet_reports` rồi disable
- Link "Phòng Trà" thêm vào navbar

---

## Em đề nghị

Anh **OK đợt 1 trước** để em làm 1 lần dứt điểm rồi test. Đợt 2-3 cần tạo bảng + RLS, em sẽ làm sau khi đợt 1 đã ổn định.

Anh confirm "OK đợt 1" hay muốn em ghép tất cả vào 1 lượt (rủi ro cao)?
