export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  imageUrl?: string;
}

export interface Question {
  id: number;
  category: string;
  title: string;
  hint: string;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: 1,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    title: "Hạt tinh thể ngọc trông như thế nào?",
    hint: "Soi đèn pin từ cạnh cách 1-2cm vào vòng, không chiếu thẳng vào mặt.",
    options: [
      { id: "1a", label: "Hạt rất mịn (Băng)", description: "Không thấy hạt bằng mắt thường" },
      { id: "1b", label: "Hạt mịn (Nếp)", description: "Thấy hạt rất nhỏ li ti" },
      { id: "1c", label: "Hạt trung bình (Đậu)", description: "Thấy rõ các hạt nhỏ" },
    ],
  },
  {
    id: 2,
    category: "I. CỐT NGỌC (Kết cấu & Độ trong)",
    title: "Độ xuyên sáng (chất ngọc) trông thế nào?",
    hint: "Hướng vòng về phía cửa sổ (không phải chiếu ánh sáng trực diện).",
    options: [
      { id: "2a", label: "Trong suốt", description: "Ánh sáng xuyên qua hoàn toàn" },
      { id: "2b", label: "Bán trong", description: "Ánh sáng xuyên qua một phần" },
      { id: "2c", label: "Mờ đục", description: "Ánh sáng hầu như không xuyên qua" },
    ],
  },
  {
    id: 3,
    category: "II. MÀU SẮC",
    title: "Màu chủ đạo của vòng ngọc là gì?",
    hint: "Quan sát dưới ánh sáng tự nhiên ban ngày, tránh đèn vàng.",
    options: [
      { id: "3a", label: "Xanh lá đậm (Imperial Green)" },
      { id: "3b", label: "Xanh lá nhạt (Apple Green)" },
      { id: "3c", label: "Xanh phớt tím (Lavender)" },
      { id: "3d", label: "Trắng / Không màu" },
    ],
  },
  {
    id: 4,
    category: "II. MÀU SẮC",
    title: "Độ bão hòa màu sắc như thế nào?",
    hint: "So sánh cường độ màu với hình mẫu.",
    options: [
      { id: "4a", label: "Rất đậm, sống động" },
      { id: "4b", label: "Trung bình" },
      { id: "4c", label: "Nhạt, phớt" },
    ],
  },
  {
    id: 5,
    category: "II. MÀU SẮC",
    title: "Màu phân bố trên vòng như thế nào?",
    hint: "Xoay vòng 360 độ quan sát.",
    options: [
      { id: "5a", label: "Đều toàn vòng" },
      { id: "5b", label: "Loang từng mảng" },
      { id: "5c", label: "Chỉ một phần nhỏ" },
    ],
  },
  {
    id: 6,
    category: "III. ĐỘ HOÀN THIỆN",
    title: "Bề mặt vòng có khuyết điểm gì không?",
    hint: "Dùng kính lúp hoặc soi đèn kiểm tra kỹ.",
    options: [
      { id: "6a", label: "Không có khuyết điểm" },
      { id: "6b", label: "Vài vết nhỏ, khó thấy" },
      { id: "6c", label: "Nhiều vết, thấy rõ" },
    ],
  },
  {
    id: 7,
    category: "III. ĐỘ HOÀN THIỆN",
    title: "Hình dáng vòng có đều và tròn không?",
    hint: "Đặt vòng trên mặt phẳng và quan sát.",
    options: [
      { id: "7a", label: "Rất tròn đều" },
      { id: "7b", label: "Hơi méo nhẹ" },
      { id: "7c", label: "Méo rõ" },
    ],
  },
  {
    id: 8,
    category: "IV. KÍCH THƯỚC",
    title: "Đường kính trong (ni) của vòng?",
    hint: "Đo bằng thước kẹp hoặc so với bảng ni.",
    options: [
      { id: "8a", label: "< 52mm" },
      { id: "8b", label: "52-56mm" },
      { id: "8c", label: "56-60mm" },
      { id: "8d", label: "> 60mm" },
    ],
  },
  {
    id: 9,
    category: "IV. KÍCH THƯỚC",
    title: "Độ dày thân vòng?",
    hint: "Đo phần mặt cắt ngang của vòng.",
    options: [
      { id: "9a", label: "Mỏng (< 7mm)" },
      { id: "9b", label: "Trung bình (7-10mm)" },
      { id: "9c", label: "Dày (> 10mm)" },
    ],
  },
  {
    id: 10,
    category: "V. ÂM THANH",
    title: "Tiếng gõ ngọc nghe ra sao?",
    hint: "Dùng một thanh ngọc khác hoặc đồng xu gõ nhẹ.",
    options: [
      { id: "10a", label: "Trong veo, ngân dài" },
      { id: "10b", label: "Thanh nhẹ" },
      { id: "10c", label: "Đục, trầm" },
    ],
  },
  {
    id: 11,
    category: "VI. HIỆU ỨNG ĐẶC BIỆT",
    title: "Vòng có hiệu ứng ánh sáng đặc biệt không?",
    hint: "Soi dưới ánh nắng hoặc đèn LED.",
    options: [
      { id: "11a", label: "Có phát quang (fluorescence)" },
      { id: "11b", label: "Có hiệu ứng mắt mèo" },
      { id: "11c", label: "Không có hiệu ứng đặc biệt" },
    ],
  },
  {
    id: 12,
    category: "VII. TRỌNG LƯỢNG",
    title: "Trọng lượng vòng cảm nhận thế nào?",
    hint: "So sánh với vòng nhựa hoặc thủy tinh cùng kích cỡ.",
    options: [
      { id: "12a", label: "Nặng, chắc tay" },
      { id: "12b", label: "Trung bình" },
      { id: "12c", label: "Nhẹ, lỏng tay" },
    ],
  },
  {
    id: 13,
    category: "VIII. GIẤY TỜ",
    title: "Vòng có giấy kiểm định không?",
    hint: "Kiểm tra giấy tờ đi kèm khi mua.",
    options: [
      { id: "13a", label: "Có giấy từ phòng kiểm định uy tín" },
      { id: "13b", label: "Có giấy nhưng không rõ nguồn" },
      { id: "13c", label: "Không có giấy tờ" },
    ],
  },
  {
    id: 14,
    category: "IX. TỔNG QUAN",
    title: "Cảm nhận tổng thể của bạn về vòng ngọc?",
    hint: "Đánh giá chung dựa trên trực giác và kinh nghiệm.",
    options: [
      { id: "14a", label: "Rất đẹp, ấn tượng" },
      { id: "14b", label: "Khá đẹp" },
      { id: "14c", label: "Bình thường" },
      { id: "14d", label: "Không ấn tượng" },
    ],
  },
];
