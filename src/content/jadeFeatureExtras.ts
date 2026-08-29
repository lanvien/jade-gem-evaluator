// ============================================================
// FEATURE EXTRAS — Bóc phốt / 30 giây học ngọc / Fun fact theo feature
// ============================================================

export interface RoastCard {
  hook: string;
  body: string;
  extra?: string; // fun fact / khuyến nghị đi kèm
  impactLabel: string; // badge ngắn: "Điểm cộng thẩm mỹ", "Cần lưu ý cao", "CẢNH BÁO"...
}

// Đủ 19/19 mã FEATURES — không còn mã nào thiếu content.
export const ROAST_CARDS: Record<string, RoastCard> = {
  hoa_bay: {
    hook: "Chiếc này hơi thích kể chuyện.",
    body: "Nhìn xa tưởng chỉ có một màu thôi. Nhìn gần mới thấy những vệt màu mềm đang \"bơi\" trong lòng ngọc, giống cánh hoa hoặc dòng nước.",
    extra: "Không có hai bố cục hoa bay nào hoàn toàn giống nhau. Đây là một trong những dấu ấn tự nhiên khiến mỗi chiếc vòng có \"layout\" riêng.",
    impactLabel: "Điểm cộng về thẩm mỹ",
  },
  chi_mau: {
    hook: "Rất dễ bị oan.",
    body: "Đây là quán quân của cuộc thi \"bị tưởng là nứt\". Người mới chơi ngọc nhìn 5 giây đầu rất hay hoảng.",
    extra: "Soi đèn pin thử nhé: ánh sáng vẫn đi liền → nhiều khả năng là chỉ màu. Ánh sáng bị cắt hoặc đổi hướng rõ → cần kiểm tra xem có phải vết nứt hay không.",
    impactLabel: "Chủ yếu ảnh hưởng thẩm mỹ nhẹ",
  },
  gan_non: {
    hook: "Đúng kiểu \"tuổi trẻ để lại dấu vết\".",
    body: "Những đường trắng nhạt chằng chịt như rễ cây thường gặp ở ngọc có cấu trúc còn non hơn.",
    extra: "Không phải cứ thấy gân là chiếc vòng yếu. Phần lớn trường hợp đây là đặc điểm cấu trúc tự nhiên, nhưng nhìn rõ sẽ làm diện ngọc bớt \"liền khối\".",
    impactLabel: "Thẩm mỹ nhiều hơn độ bền",
  },
  gan_gia: {
    hook: "Phiên bản trưởng thành hơn của gân ngọc.",
    body: "Đường gân thường đậm màu hơn, có cảm giác chìm vào chất ngọc thay vì nổi trắng.",
    extra: "Người chơi ngọc lâu năm thường phân biệt gân non và gân già bằng màu và cảm giác \"ăn\" vào cốt ngọc, chứ không chỉ nhìn hình dạng.",
    impactLabel: "Thường khá nhẹ",
  },
  so_bong: {
    hook: "Đừng hoảng. Đây không phải vết nứt.",
    body: "Sớ bông giống những cụm sợi mờ hoặc tuyết tan nằm trong lòng ngọc.",
    extra: "Vì nó trắng và mờ nên rất dễ bị gọi nhầm là \"rạn\". Thực ra hình thái của hai loại rất khác.",
    impactLabel: "Thường ít ảnh hưởng đến độ bền",
  },
  so_ngan: {
    hook: "Một vết rất nhỏ nhưng ai soi cũng thấy.",
    body: "Sớ ngắn xuất hiện khá phổ biến, đặc biệt ở vòng bản.",
    extra: "Nhiều người chơi xem sớ ngắn dưới khoảng 1cm là điều gần như rất khó tránh trên vòng tự nhiên.",
    impactLabel: "Thấp",
  },
  so_am: {
    hook: "Ẩn kỹ ghê.",
    body: "Vuốt tay thì trơn, soi đèn mới thấy. Sớ âm nằm bên trong lòng ngọc nên thường không tạo cảm giác gợn trên bề mặt.",
    impactLabel: "Mức cần lưu ý: Trung bình",
  },
  so_am_dai: {
    hook: "Cũng là sớ âm, nhưng \"phiên bản kéo dài\".",
    body: "Đường này đủ dài để trở thành một đặc điểm nhìn thấy khá rõ trong lòng ngọc.",
    extra: "Độ dài và vị trí quan trọng hơn việc chỉ đơn giản \"có sớ\".",
    impactLabel: "Mức cần lưu ý: Trung bình – cao",
  },
  so_can: {
    hook: "Vuốt móng tay là biết ngay.",
    body: "Đây là dạng sớ nằm sát hoặc chạm bề mặt. Bụi và dầu tay thích \"ghé thăm\" mấy chỗ này hơn.",
    extra: "Khuyến nghị: đeo bình thường được, nhưng hạn chế va chạm mạnh đúng vị trí này.",
    impactLabel: "Cần lưu ý",
  },
  so_luoi_ga: {
    hook: "Đây mới là nhân vật cần chú ý nhất.",
    body: "Tên nghe đáng yêu nhưng hình dạng lại không đáng xem nhẹ. Đường sớ nhọn, cong như chiếc lưỡi gà và thường ôm theo bản vòng.",
    extra: "Đây là một trong những dạng nên được kiểm tra kỹ khi định giá hoặc đeo hằng ngày.",
    impactLabel: "Cần lưu ý cao",
  },
  so_doc: {
    hook: "Ít đáng sợ hơn vẻ ngoài.",
    body: "Đường sớ chạy cùng chiều bản vòng. Hướng này thường thuận hơn về phương chịu lực so với sớ ngang, nhưng vẫn là đặc điểm nên quan sát vị trí và chiều dài.",
    impactLabel: "Cần lưu ý",
  },
  so_doc_dai: {
    hook: "Chuyện bắt đầu dài dòng rồi đó.",
    body: "Khi sớ dọc kéo dài đáng kể, nó không còn chỉ là một chi tiết nhỏ nữa.",
    extra: "Nếu đồng thời nằm trên bề mặt hoặc đi qua vùng mỏng của vòng thì nên lưu ý nhiều hơn.",
    impactLabel: "Cần lưu ý cao",
  },
  so_cheo: {
    hook: "Cắt ngang mood của chiếc vòng.",
    body: "Đường sớ chạy chéo làm mắt rất dễ nhìn thấy.",
    extra: "Nếu chỉ nằm ở một mặt hoặc một phần bản vòng thì mức ảnh hưởng có thể khác với trường hợp chạy xuyên nhiều vùng.",
    impactLabel: "Cần lưu ý cao",
  },
  so_ngang: {
    hook: "Đây là chỗ đáng để nhìn kỹ nhất của chiếc vòng.",
    body: "Không kết luận xấu ngay, nhưng đây là hướng cần lưu ý hơn khi sử dụng.",
    extra: "Hạn chế va chạm mạnh, đặc biệt nếu đường sớ kéo dài từ mặt trong ra mặt ngoài.",
    impactLabel: "Quan sát kỹ vị trí này",
  },
  mat_cat: {
    hook: "Chiếc vòng có một \"nốt ruồi\" khá cá tính.",
    body: "Một cụm khoáng chất khác màu nằm trên bề mặt làm chỗ đó hơi gợn.",
    extra: "Có chiếc mắt cát nằm rất duyên, gần như thành điểm nhận diện của riêng chiếc vòng. Nếu nằm ở vị trí chịu lực hoặc ngay mép bản vòng thì nên lưu ý hơn.",
    impactLabel: "Cần cân nhắc",
  },
  vet_san_lom_nhe: {
    hook: "Không phải đánh bóng lúc nào cũng ra mặt gương.",
    body: "Một số vùng hơi lõm hoặc gợn còn lại từ đặc điểm của khối ngọc ban đầu.",
    extra: "Theo thời gian, những chỗ này dễ giữ bụi hoặc dầu tay hơn phần bề mặt phẳng.",
    impactLabel: "Cần lưu ý nhẹ",
  },
  vet_san_lom_vua: {
    hook: "Không phải đánh bóng lúc nào cũng ra mặt gương.",
    body: "Một số vùng hơi lõm hoặc gợn còn lại từ đặc điểm của khối ngọc ban đầu.",
    extra: "Theo thời gian, những chỗ này dễ giữ bụi hoặc dầu tay hơn phần bề mặt phẳng.",
    impactLabel: "Cần lưu ý",
  },
  vet_san_lom_ro: {
    hook: "Không phải đánh bóng lúc nào cũng ra mặt gương.",
    body: "Một số vùng hơi lõm hoặc gợn còn lại từ đặc điểm của khối ngọc ban đầu.",
    extra: "Theo thời gian, những chỗ này dễ giữ bụi hoặc dầu tay hơn phần bề mặt phẳng.",
    impactLabel: "Cần lưu ý rõ",
  },
  vet_nut: {
    hook: "Đây không còn là chuyện \"có đẹp hay không\".",
    body: "Vết nứt là đặc điểm cần tách riêng khỏi các dấu ấn tự nhiên khác. Đừng nhầm với chỉ màu hay sớ bông.",
    extra: "Nếu nhìn rõ, sờ có gợn hoặc nghi ngờ ảnh hưởng cấu trúc, nên đánh giá trực tiếp trước khi sử dụng thường xuyên.",
    impactLabel: "CẢNH BÁO — cần đánh giá chuyên môn",
  },
};

// CHỈ 8/19 mã có "30 giây học ngọc" — không tự bịa cho các mã còn lại.
export const LEARN_CARDS: Partial<Record<string, string>> = {
  hoa_bay: "Hoa bay không phải \"màu loang\". Đó là các dải màu hoặc khoáng chất phân bố tự nhiên bên trong lòng ngọc, tạo nên cảm giác có chiều sâu khi nhìn xuyên sáng.",
  chi_mau: "Chỉ màu và nứt đều là đường dài trong lòng ngọc, nhưng chúng không phải cùng một hiện tượng. Đó là lý do người chơi thường soi đèn trước khi kết luận.",
  gan_non: "Gân ngọc là dấu vết của cấu trúc bên trong, không phải \"mạch máu\" của viên ngọc như nhiều người vẫn gọi vui.",
  gan_gia: "Gân ngọc là dấu vết của cấu trúc bên trong, không phải \"mạch máu\" của viên ngọc như nhiều người vẫn gọi vui.",
  so_bong: "Sớ bông nhìn giống cụm sợi mờ, còn nứt thường có đường sắc hơn và tạo cảm giác \"cắt\" cấu trúc.",
  so_am: "Có những đường chỉ hiện ra khi ánh sáng đi xuyên qua lòng ngọc. Vì thế soi đèn luôn cho nhiều thông tin hơn nhìn bằng mắt thường.",
  so_ngang: "Điều quan trọng không chỉ là \"có sớ ngang\", mà còn là sớ dài bao nhiêu, nằm ở đâu và có chạm bề mặt hay không.",
  mat_cat: "Mắt cát là vùng khoáng chất khác màu hoặc khác cấu trúc nằm trên bề mặt. Vị trí của nó quan trọng hơn số lượng.",
  vet_nut: "Một chiếc vòng có nứt không đồng nghĩa sẽ vỡ ngay. Nhưng đây là yếu tố cần được cân nhắc nghiêm túc khi định giá và sử dụng.",
};

// CHỈ 8/19 mã có fun fact — không tự bịa cho các mã còn lại.
export const FUN_FACTS: Partial<Record<string, string[]>> = {
  hoa_bay: [
    "Không có hai bố cục hoa bay nào hoàn toàn giống nhau.",
    "Có người chọn vòng chỉ vì thích \"đường hoa\" chứ không phải màu.",
    "Hoa bay thường hiện rõ hơn khi soi dưới ánh sáng xiên.",
  ],
  chi_mau: [
    "Đây là feature bị nhầm thành nứt nhiều nhất.",
    "Đường chỉ màu thường mang đúng màu của vùng ngọc xung quanh, chỉ đậm hơn.",
  ],
  so_bong: [
    "Nhiều chiếc vòng rất đẹp vẫn có sớ bông.",
    "Sớ bông nhìn rõ hơn khi nền ngọc sáng.",
  ],
  gan_non: ["Gân non thường trắng nhạt và giống rễ cây."],
  gan_gia: ["Gân già thường chìm màu hơn và khó nhận ra nếu không nhìn kỹ."],
  mat_cat: ["Mắt cát có thể là \"dấu vân tay\" giúp nhận ra đúng chiếc vòng của mình."],
  so_luoi_ga: ["Tên gọi xuất phát từ hình dáng của đường sớ chứ không phải màu sắc."],
  vet_nut: ["Nứt và sớ là hai nhóm đặc điểm khác nhau trong Jade Oracle."],
};
