import { useState } from "react";
import { Download, AlertCircle } from "lucide-react";
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

  // 1. Browser-based download function (YouTube block bypass karne ke liye)
  const handleDownloadAction = async (url: string, filename: string) => {
    try {
      // Direct window.open aksar play kar deta hai, isliye hum fetch use karte hain
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Agar browser fetch block kare toh tab naya tab kholay
      window.open(url, "_blank");
    }
  };

  const handleSubmit = async (url: string) => {
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;

    if (!ytRegex.test(url)) {
      setState("error");
      setError("Please enter a valid YouTube URL");
      return;
    }

    try {
      setState("loading");
      
      // APNA CLOUDFLARE WORKER URL YAHAN DALEIN
      const WORKER_URL = "https://yt-api.mindmentor2025.workers.dev/"; 
      
      const response = await fetch(
        `${WORKER_URL}/?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) throw new Error("Worker responded with error");

      const data = await response.json();

      setVideoData({
        title: data.title || "YouTube Video",
        thumbnail: data.thumbnail,
      });

      // Backend (Worker) se format names match karna zaroori hai
      setFormats(data.formats || []);
      setState("results");
    } catch (err) {
      setState("error");
      setError("Failed to fetch video data. Please check your Cloudflare Worker.");
    }
  };

  const handleReset = () => {
    setState("idle");
    setError("");
    setVideoData(null);
    setFormats([]);
  };

  // Helper filters
  const videoFormats = (formats || []).filter((f) => f.hasVideo);
  const audioFormats = (formats || []).filter((f) => f.hasAudio && !f.hasVideo);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
        <button onClick={handleReset} className="flex items-center gap-2 font-bold text-xl">
          <Download className="h-6 w-6 text-primary" />
          <span>VideoLink</span>
        </button>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-10">
        {state !== "results" && (
          <div className="w-full max-w-xl text-center">
            <h1 className="text-4xl font-extrabold mb-4">YouTube Downloader</h1>
            <p className="text-muted-foreground mb-8">Fast, Free and unlimited downloads</p>
            <UrlInput onSubmit={handleSubmit} isLoading={state === "loading"} />
          </div>
        )}

        {state === "loading" && <LoadingState />}

        {state === "results" && (
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4">
            <VideoPreview video={videoData} />

            {/* VIDEO SECTION */}
            <h2 className="text-xl font-bold mt-8 mb-4 border-l-4 border-blue-500 pl-3">
              Video Quality
            </h2>
            <div className="grid gap-3">
              {videoFormats.map((format, i) => (
                <div key={i} className="flex justify-between items-center border p-4 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <span className="font-medium">{format.qualityLabel || "HD Video"}</span>
                    <span className="ml-2 text-xs text-muted-foreground uppercase">{format.container}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadAction(format.url, `${videoData.title}.${format.container || 'mp4'}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>

            {/* AUDIO SECTION */}
            <h2 className="text-xl font-bold mt-8 mb-4 border-l-4 border-green-500 pl-3">
              Audio (MP3)
            </h2>
            <div className="grid gap-3">
              {audioFormats.map((format, i) => (
                <div key={i} className="flex justify-between items-center border p-4 rounded-lg bg-card shadow-sm">
                  <div>
                    <span className="font-medium">High Quality Audio</span>
                    <span className="ml-2 text-xs text-muted-foreground">{format.audioBitrate}kbps</span>
                  </div>
                  <button
                    onClick={() => handleDownloadAction(format.url, `${videoData.title}.mp3`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md font-medium"
                  >
                    Download MP3
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © 2026 VideoLink - Built for speed
      </footer>
    </div>
  );
};

export default Index;
