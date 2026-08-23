import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "@/ui/layout/Container";
import Button from "@/ui/ui/Button";
import FeedbackForm from "@/ui/ui/FeedbackForm";

export default function FeedbackPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper maxWidth="md" className="bg-background">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="border-b border-border pb-8"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Kembali
        </Button>
        <p className="text-label-md text-primary">Masukan</p>
        <h1 className="mt-2 text-display-sm text-foreground">
          Bagaimana pengalamanmu menggunakan Ruang Pulih?
        </h1>
        <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
          Masukan ini bersifat anonim dan membantu kami memahami apa yang perlu
          diperbaiki. Tidak ada data pribadi yang dikumpulkan.
        </p>
      </motion.header>

      <div className="py-8">
        <FeedbackForm
          sourcePage="feedback-page"
          onSubmitted={() => {
            setTimeout(() => navigate("/"), 2000);
          }}
        />
      </div>
    </PageWrapper>
  );
}
