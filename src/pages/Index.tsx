import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UrlInput } from "@/components/UrlInput";
import { VideoPreview } from "@/components/VideoPreview";
import { FormatList } from "@/components/FormatList";
import { LoadingState } from "@/components/LoadingState";

type AppState = "idle" | "loading" | "results" | "error";

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState<any>(null);
  const [formats, setFormats] = useState<any[]>([]);

  const handleSubmit = async (url: string) => {
    const ytRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;

    if (!ytRegex.test(url)) {
      setState("error");
      setError("Please enter a valid YouTube URL");
      return;
    }

    try {
      setState("loading");

      const response = await fetch(
        `http://127.0.0.1:5000/get-video?url=${encodeURIComponent(url)}`
      );

      const data = await response.json();

      setVideoData({
        title: data.title,
        thumbnail: data.thumbnail,
      });

      setFormats(data.formats);

      setState("results");
    } catch (err) {
      setState("error");
      setError("Failed to fetch video data");
    }
  };

  const handleReset = () => {
    setState("idle");
    setError("");
    setVideoData(null);
    setFormats([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <button onClick={handleReset} className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/25">
            <Download className="h-5 w-5 text-primary-foreground" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            VideoLink
          </span>
        </button>
        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-16">
        {/* Hero */}
        {state === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 space-y-3"
          >
            <h1
              className="text-3xl sm:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Download YouTube Videos
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
              Paste a link, pick a quality, and download — it's that simple.
            </p>
          </motion.div>
        )}

        {/* URL Input */}
        {state !== "results" && (
          <div className="w-full mb-8">
            <UrlInput onSubmit={handleSubmit} isLoading={state === "loading"} />
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4 rounded-xl bg-destructive/10 text-destructive text-sm max-w-md"
          >
            {error}
          </motion.div>
        )}

        {/* Loading */}
        {state === "loading" && <LoadingState />}

        {/* Results */}
        {state === "results" && (
          <div className="w-full space-y-8">
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-sm text-primary hover:underline"
              >
                ← Download another video
              </button>
            </div>

            {/* Video Preview */}
            {videoData && <VideoPreview video={videoData} />}

            {/* Format list */}
            {formats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formats.map((format, index) => (
                  <a
                    key={index}
                    href={format.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-lg bg-card border flex flex-col items-center justify-center hover:shadow-lg transition"
                  >
                    <span className="text-sm font-semibold">
                      {format.type === "video" ? format.quality : "Audio"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format.ext}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Download
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Idle features */}
        {state === "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-2xl w-full"
          >
            {[
              { title: "Multiple Qualities", desc: "From 144p to 1080p MP4" },
              { title: "Audio Extraction", desc: "Download as MP3 audio" },
              { title: "Fast & Free", desc: "No signup, no limits" },
            ].map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl bg-card border text-center space-y-1"
              >
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-6 border-t">
        VideoLink Downloader
      </footer>
    </div>
  );
};

export default Index;
