import { motion } from "framer-motion";
import { Download } from "lucide-react";

interface VideoPreviewProps {
  video: {
    title: string;
    thumbnail: string;
  };
  videoUrl: string;
}

export function VideoPreview({ video, videoUrl }: VideoPreviewProps) {

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${video.title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >

      <div className="rounded-xl overflow-hidden border">

        <video
          controls
          poster={video.thumbnail}
          className="w-full"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        <div className="p-4">

          <h2 className="text-lg font-semibold">
            {video.title}
          </h2>

          <button
            onClick={downloadVideo}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded"
          >
            <Download className="inline w-4 h-4 mr-2" />
            Download
          </button>

        </div>

      </div>

    </motion.div>
  );
}
