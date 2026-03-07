import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export function LoadingState() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 95));
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-md mx-auto text-center space-y-4 py-12"
    >
      <div className="text-sm text-muted-foreground font-medium">
        Fetching video streams…
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-muted-foreground">
        Analyzing available formats
      </p>
    </motion.div>
  );
}
