import { motion } from "framer-motion";
import { Clock, Eye, Calendar, User } from "lucide-react";
import type { VideoMetadata } from "@/lib/mock-data";

interface VideoPreviewProps {
  video: VideoMetadata;
}

export function VideoPreview({ video }: VideoPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="rounded-2xl overflow-hidden bg-card border shadow-lg">
        {/* Embedded player */}
        <div className="aspect-video bg-foreground/5">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Video info */}
        <div className="p-5 space-y-3">
          <h2 className="text-lg font-semibold leading-snug line-clamp-2">
            {video.title}
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {video.channel}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> {video.views}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {video.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {video.uploadDate}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
