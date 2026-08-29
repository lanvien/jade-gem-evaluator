// ============================================================
// PERSONALITY CARD — "Nếu chiếc vòng này là một người..."
// Full 22/22 màu, verbatim từ content pool đã duyệt.
// ============================================================
import type { ColorName } from "./jadeContent";

export interface PersonalityCard {
  personality: string;
  drink: string;
  outfit: string;
  playlist: string;
  vibe: string;
}

export const PERSONALITY_CARDS: Record<ColorName, PersonalityCard> = {
  "Đế Vương Lục": {
    personality: "Điềm tĩnh, rất tự tin nhưng không thích ồn ào. Vào phòng không nói nhiều nhưng ai cũng để ý.",
    drink: "Matcha latte hoặc trà sen đá.",
    outfit: "Linen trắng, blazer xanh rêu, đồng hồ da nâu.",
    playlist: "Jazz, bossa nova, Norah Jones.",
    vibe: "\"Quiet luxury\" nhưng phiên bản biết trồng cây.",
  },
  "Chính Dương Lục": {
    personality: "Hướng ngoại vừa đủ, nhiều năng lượng, cười rất tươi.",
    drink: "Yuzu soda hoặc iced matcha.",
    outfit: "Áo sơ mi trắng, quần jeans xanh nhạt, sneaker trắng.",
    playlist: "Pop indie, Laufey, HONNE.",
    vibe: "Người luôn rủ bạn đi picnic.",
  },
  "Xanh Cay": {
    personality: "Gan, nhanh, thích thử cái mới. Có ý tưởng trước khi có kế hoạch.",
    drink: "Mojito không cồn hoặc kombucha.",
    outfit: "Cargo, baby tee, kính màu.",
    playlist: "R&B, funk, Kaytranada.",
    vibe: "\"Main character\" của một buổi concert ngoài trời.",
  },
  "Xanh Ngọt": {
    personality: "Dịu dàng nhưng rất biết chăm người khác.",
    drink: "Trà đào hoặc matcha dâu.",
    outfit: "Cardigan kem, váy trắng, tóc buộc thấp.",
    playlist: "Acoustic, IU, Keshi.",
    vibe: "Người nhớ sinh nhật của tất cả bạn bè.",
  },
  "Lục Táo": {
    personality: "Lạc quan kinh khủng, kiểu \"thôi được rồi mình giải quyết tiếp.\"",
    drink: "Apple tea hoặc sparkling lemonade.",
    outfit: "Xanh lá nhạt, trắng, be.",
    playlist: "Bedroom pop, wave to earth.",
    vibe: "Mang trái cây đến lớp cho mọi người.",
  },
  "Đậu Lục": {
    personality: "Trầm, đáng tin, rất ít drama.",
    drink: "Americano hoặc trà ô long.",
    outfit: "Olive, nâu đất, kem.",
    playlist: "Folk, Bon Iver.",
    vibe: "Người luôn mang theo một cuốn sách.",
  },
  "Thanh Thủy Lục": {
    personality: "Bình yên, thích ở gần cây và rất mê ánh sáng buổi sáng.",
    drink: "Cold brew hoặc trà sen.",
    outfit: "Xanh nhạt, be, trắng.",
    playlist: "Acoustic, instrumental piano.",
    vibe: "Cuối tuần đi nhà kính hoặc bảo tàng.",
  },
  "Xanh Dầu": {
    personality: "Cá tính, hơi khó đoán nhưng cực kỳ có gu.",
    drink: "Espresso tonic.",
    outfit: "Olive đậm, denim, boots.",
    playlist: "Arctic Monkeys, Cigarettes After Sex.",
    vibe: "Có máy film trong túi.",
  },
  "Hồi Lục": {
    personality: "Chậm rãi, thích đồ cũ và những quán ít người biết.",
    drink: "Trà phổ nhĩ hoặc cacao nóng.",
    outfit: "Linen xám, nâu, xanh rêu nhạt.",
    playlist: "Jazz Nhật, lo-fi.",
    vibe: "Sưu tầm gốm và sách cũ.",
  },
  "Tử La Lan": {
    personality: "Nghệ nghệ một chút, thích ngắm hoàng hôn và viết caption rất dài.",
    drink: "Trà ô long đào.",
    outfit: "Lụa tím khói, kem, xám nhạt.",
    playlist: "Indie, dream pop, Cigarettes After Sex.",
    vibe: "Pinterest board biết nói chuyện.",
  },
  "Tím Cà": {
    personality: "Bí ẩn, nói ít nhưng câu nào cũng đáng nhớ.",
    drink: "Grape sparkling tea.",
    outfit: "Burgundy, đen, bạc.",
    playlist: "Lana Del Rey, Florence + The Machine.",
    vibe: "Đi xem triển lãm một mình.",
  },
  "Tím Lam": {
    personality: "Mơ mộng nhưng logic kỳ lạ.",
    drink: "Butterfly pea lemonade.",
    outfit: "Tím than, xanh lam, trắng.",
    playlist: "Ambient, synth-pop.",
    vibe: "Thức đến 2 giờ sáng chỉ để ngắm bầu trời.",
  },
  "Lam Thiên Không": {
    personality: "Dễ gần, rất tích cực, thích đi biển.",
    drink: "Soda chanh.",
    outfit: "Xanh baby, trắng, denim.",
    playlist: "Surf pop, Dayglow.",
    vibe: "Luôn ngồi cạnh cửa sổ.",
  },
  "Lam Thanh": {
    personality: "Nhẹ nhàng, biết lắng nghe và rất có kiên nhẫn.",
    drink: "Earl Grey milk tea.",
    outfit: "Xanh pastel, xám nhạt.",
    playlist: "Classical piano, Yiruma.",
    vibe: "Người nhắn \"về tới nhà chưa?\" đầu tiên.",
  },
  "Lão Lam Thuỷ": {
    personality: "Bình tĩnh, trưởng thành, ít khi vội vàng.",
    drink: "Cold brew không đường.",
    outfit: "Navy, xám đậm, trắng.",
    playlist: "Jazz instrumental, FKJ.",
    vibe: "Người luôn có sổ tay.",
  },
  "Hồng Phỉ": {
    personality: "Ấm áp, nhiều năng lượng và rất biết làm người khác thấy được quan tâm.",
    drink: "Strawberry matcha.",
    outfit: "Hồng đào, trắng, kem.",
    playlist: "City pop, NewJeans, Laufey.",
    vibe: "Mang bánh đến mỗi buổi học nhóm.",
  },
  "Hoàng Tông Phỉ": {
    personality: "Sang nhưng không kiểu phô trương.",
    drink: "Honey citron tea.",
    outfit: "Vàng kem, nâu caramel, trắng ngà.",
    playlist: "Soul, Motown, Phum Viphurit.",
    vibe: "Hoàng hôn mùa thu.",
  },
  "Mặc Thúy": {
    personality: "Ít nói nhưng rất có gu. Người ta tưởng lạnh, quen rồi mới thấy hài.",
    drink: "Espresso.",
    outfit: "Đen, xám, bạc.",
    playlist: "Classical, ambient.",
    vibe: "Gallery tối và nhạc vinyl.",
  },
  "Bạch Nguyệt Quang": {
    personality: "Thanh sạch, tối giản và cực kỳ gọn gàng.",
    drink: "Jasmine tea.",
    outfit: "Trắng, kem, bạc.",
    playlist: "Piano, Studio Ghibli.",
    vibe: "\"Clean girl\" nhưng thích sách hơn skincare.",
  },
  "Trắng Cháo": {
    personality: "Dịu, mềm và rất dễ làm người khác thấy an toàn.",
    drink: "Soy latte.",
    outfit: "Beige, oatmeal, trắng sữa.",
    playlist: "Acoustic café.",
    vibe: "Chăn bông và mưa nhỏ.",
  },
  "Gà Đen": {
    personality: "Mạnh mẽ, hơi \"cool\" nhưng rất trung thành.",
    drink: "Dark chocolate.",
    outfit: "Đen, nâu đậm, boots.",
    playlist: "Rock nhẹ, The Neighbourhood.",
    vibe: "Chụp ảnh trắng đen rất đẹp.",
  },
  "Xám": {
    personality: "Điềm đạm, cực kỳ thực tế và luôn đúng giờ.",
    drink: "Latte nóng.",
    outfit: "Xám, trắng, denim.",
    playlist: "Lo-fi, jazz café.",
    vibe: "Người luôn mang ô khi trời có 20% mưa.",
  },
};
