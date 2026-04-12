import { useEffect } from "react";

interface SectionDividerProps {
  title: string;
  onDone: () => void;
}

const SectionDivider = ({ title, onDone }: SectionDividerProps) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center animate-fade-in-up">
      <h1 className="font-serif text-2xl md:text-4xl font-bold text-accent leading-relaxed max-w-lg">
        {title}
      </h1>
    </div>
  );
};

export default SectionDivider;
