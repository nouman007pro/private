import { useState } from "react";
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
        `https://04fbd74e-17c4-4e86-a768-c4bdd084a4d3-00-z2cw58o53yiq.worf.replit.dev/get-video?url=${encodeURIComponent(
          url
        )}`
      );

      const data = await response.json();

      setVideoData({
        title: data.title,
        thumbnail: data.thumbnail,
      });

      setFormats(data.formats || []);

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
const videoFormats = (formats || []).filter((f) => f.hasVideo);
const audioFormats = (formats || []).filter((f) => f.hasAudio && !f.hasVideo);

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
          <div className="w-full max-w-2xl">

            <VideoPreview video={videoData} videoUrl={videoFormats[0]?.url} />

            {/* VIDEO FORMATS */}
            <h2 className="text-xl font-semibold mt-6 mb-3">
              Video Downloads
            </h2>

            {videoFormats.map((format, i) => (
              <div
                key={i}
                className="flex justify-between items-center border rounded p-3 mb-2"
              >
                <span>
                  {format.qualityLabel || "Video"} ({format.container})
                </span>

                <a
                  href={format.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Download
                </a>
              </div>
            ))}

            {/* AUDIO FORMATS */}
            <h2 className="text-xl font-semibold mt-6 mb-3">
              Audio Downloads
            </h2>

            {audioFormats.map((format, i) => (
              <div
                key={i}
                className="flex justify-between items-center border rounded p-3 mb-2"
              >
                <span>
                  Audio {format.audioBitrate || "128"} kbps
                </span>

                <a
                  href={format.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Download MP3
                </a>
              </div>
            ))}

          </div>
        )}

        {state === "error" && (
          <div className="text-red-500">{error}</div>
        )}

      </main>

    </div>
  );
};

export default Index;
