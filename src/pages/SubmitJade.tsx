import Header from "@/components/Header";
import SubmitJadeForm from "@/components/community/SubmitJadeForm";

export default function SubmitJade() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Gửi vòng lên Phòng Trà</h1>
        <p className="text-muted-foreground mb-6">
          Chia sẻ chiếc vòng của bạn để cộng đồng cùng thưởng lãm và góp ý.
        </p>
        <SubmitJadeForm />
      </main>
    </div>
  );
}
