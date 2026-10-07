import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ensureAnonUser } from "@/lib/anonAuth";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Assessment from "./pages/Assessment.tsx";
import Results from "./pages/Results.tsx";
import CopNgoc from "./pages/CopNgoc.tsx";
import JadeVault from "./pages/JadeVault.tsx";
import PublicBracelet from "./pages/PublicBracelet.tsx";
import CongDong from "./pages/CongDong.tsx";
import SubmissionDetail from "./pages/SubmissionDetail.tsx";
import SubmitJade from "./pages/SubmitJade.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import DinhGiaPhiThuy from "./pages/DinhGiaPhiThuy.tsx";
import Seo from "@/components/Seo";

const queryClient = new QueryClient();

const noindex = (path: string, title: string, el: JSX.Element) => (
  <>
    <Seo noindex path={path} title={`${title} | Hiểu Ngọc`} description="Hiểu Ngọc - công cụ tìm hiểu và định giá tham khảo ngọc phỉ thúy." />
    {el}
  </>
);

const App = () => {
  useEffect(() => {
    ensureAnonUser().catch(() => {});
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Seo
                  path="/"
                  title="Hiểu Ngọc - Tìm hiểu và định giá ngọc phỉ thúy"
                  description="Hiểu Ngọc giúp bạn tìm hiểu vòng ngọc phỉ thúy qua cốt ngọc, màu sắc, nội tại và hình dáng, kèm khoảng giá tham khảo miễn phí."
                />
                <Index />
              </>
            }
          />
          <Route path="/assessment" element={noindex("/assessment", "Định giá vòng ngọc", <Assessment />)} />
          <Route path="/results" element={noindex("/results", "Kết quả định giá", <Results />)} />

          <Route path="/dinh-gia-phi-thuy" element={<DinhGiaPhiThuy />} />
          <Route
            path="/tham-dinh"
            element={<Navigate to="/dinh-gia-phi-thuy" replace />}
          />

          <Route path="/cop-ngoc" element={noindex("/cop-ngoc", "Cốp ngọc", <CopNgoc />)} />
          <Route path="/jade-vault" element={noindex("/jade-vault", "Cốp ngọc của tôi", <JadeVault />)} />
          <Route path="/vong/:id" element={noindex("/vong", "Vòng ngọc", <PublicBracelet />)} />
          <Route
            path="/cong-dong"
            element={
              <>
                <Seo
                  path="/cong-dong"
                  title="Cộng đồng ngọc phỉ thúy | Hiểu Ngọc"
                  description="Nơi người yêu ngọc chia sẻ ảnh vòng phỉ thúy và cùng nhau nhận xét, thẩm định một cách ẩn danh."
                />
                <CongDong />
              </>
            }
          />
          <Route path="/cong-dong/dang" element={noindex("/cong-dong/dang", "Đăng vòng ngọc", <SubmitJade />)} />
          <Route path="/cong-dong/:id" element={noindex("/cong-dong", "Bài đăng cộng đồng", <SubmissionDetail />)} />
          <Route path="/admin" element={noindex("/admin", "Quản trị", <Admin />)} />
          <Route path="/phong-tra" element={<Navigate to="/cong-dong" replace />} />
          <Route path="*" element={noindex("/404", "Không tìm thấy trang", <NotFound />)} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
}; 

export default App;
