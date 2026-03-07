import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UrlInput } from "@/components/UrlInput";
import { VideoPreview } from "@/components/VideoPreview";
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

      <header className="flex items-center justify-between px-6 py-4 border-b">
        <button onClick={handleReset} className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          VideoLink
        </button>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-8">

        {state !== "results" && (
          <UrlInput onSubmit={handleSubmit} isLoading={state === "loading"} />
        )}

        {state === "loading" && <LoadingState />}

        {state === "results" && (
          <>
            <VideoPreview
              video={videoData}
              videoUrl={formats[0]?.url}
            />
          </>
        )}

        {state === "error" && (
          <div className="text-red-500">{error}</div>
        )}

      </main>

    </div>
  );
};

export default Index;
