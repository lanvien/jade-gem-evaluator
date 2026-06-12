import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/cop-ngoc" element={<CopNgoc />} />
          <Route path="/jade-vault" element={<JadeVault />} />
          <Route path="/vong/:id" element={<PublicBracelet />} />
          <Route path="/cong-dong" element={<CongDong />} />
          <Route path="/cong-dong/dang" element={<SubmitJade />} />
          <Route path="/cong-dong/:id" element={<SubmissionDetail />} />
          <Route path="/phong-tra" element={<CongDong />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
