import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingDonButton } from "@/components/FloatingDonButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <div className="hidden md:block">
        <FloatingDonButton />
      </div>
    </>
  );
}
