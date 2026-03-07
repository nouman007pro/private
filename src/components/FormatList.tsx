import { motion } from "framer-motion";
import { Download, Film, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VideoFormat } from "@/lib/mock-data";
import { toast } from "sonner";

interface FormatListProps {
  formats: VideoFormat[];
}

export function FormatList({ formats }: FormatListProps) {
  const videoFormats = formats.filter((f) => f.type === "video");
  const audioFormats = formats.filter((f) => f.type === "audio");

  const handleDownload = (format: VideoFormat) => {
    toast.info(`Download started: ${format.quality} ${format.format}`, {
      description: "This is a demo — connect a backend to enable real downloads.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      {/* Video formats */}
      <div>
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" /> Video Downloads
        </h3>
        <div className="space-y-2">
          {videoFormats.map((format, i) => (
            <FormatRow key={format.id} format={format} index={i} onDownload={handleDownload} />
          ))}
        </div>
      </div>

      {/* Audio formats */}
      <div>
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" /> Audio Downloads
        </h3>
        <div className="space-y-2">
          {audioFormats.map((format, i) => (
            <FormatRow key={format.id} format={format} index={i} onDownload={handleDownload} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FormatRow({
  format,
  index,
  onDownload,
}: {
  format: VideoFormat;
  index: number;
  onDownload: (f: VideoFormat) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border hover:border-primary/30 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <Badge
          variant={format.quality === "1080p" ? "default" : "secondary"}
          className="shrink-0 font-mono text-xs"
        >
          {format.quality}
        </Badge>
        <div className="text-sm text-muted-foreground hidden sm:block">
          {format.resolution || format.bitrate}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground font-mono">
          {format.fileSize}
        </span>
        <Button
          size="sm"
          onClick={() => onDownload(format)}
          className="rounded-lg gap-1.5 shadow-sm group-hover:shadow-primary/20"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">{format.format}</span>
        </Button>
      </div>
    </motion.div>
  );
}
