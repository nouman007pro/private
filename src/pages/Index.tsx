import { useState } from "react";
import { Download, AlertCircle, RefreshCcw } from "lucide-react";
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

  // Browser-based download function
  const handleDownloadAction = async (url: string, filename: string) => {
    try {
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
      // Fallback: Agar CORS block kare toh naye tab mein open karein
      window.open(url, "_blank");
    }
  };

  const handleSubmit = async (url: string) => {
    const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)/;

    if (!ytRegex.test(url)) {
      setState("error");
      setError("Please enter a valid YouTube URL (Videos or Shorts)");
      return;
    }

    try {
      setState("loading");
      
      // HUGGING FACE BACKEND URL
      const BACKEND_URL = "https://mindmentor12-ytdl-api.hf.space"; 
      
      // FIX: Yahan /get-video endpoint add kiya gaya hai
      const response = await fetch(
        `${BACKEND_URL}/get-video?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Backend is busy. Please try again in a few seconds.");
      }

      const data = await response.json();

      if (!data.formats || data.formats.length === 0) {
        throw new Error("No downloadable formats found. YouTube might be blocking this IP.");
      }

      setVideoData({
        title: data.title || "YouTube Video",
        thumbnail: data.thumbnail,
      });

      setFormats(data.formats);
      setState("results");
    } catch (err: any) {
      setState("error");
      setError(err.message || "Something went wrong. Please check your Hugging Face Space.");
    }
  };

  const handleReset = () => {
    setState("idle");
    setError("");
    setVideoData(null);
    setFormats([]);
  };

  // Improved filtering for formats
  const videoFormats = (formats || []).filter((f) => f.hasVideo && f.url);
  const audioFormats = (formats || []).filter((f) => f.hasAudio && !f.hasVideo && f.url);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <button onClick={handleReset} className="flex items-center gap-2 font-bold text-2xl tracking-tighter hover:opacity-80">
          <Download className="h-7 w-7 text-primary" />
          <span>VideoLink</span>
        </button>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12 max-w-4xl mx-auto w-full">
        
        {/* Input Section */}
        {state !== "results" && (
          <div className="w-full max-w-xl text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-5xl font-black mb-4 tracking-tight">Download simply.</h1>
            <p className="text-muted-foreground text-lg mb-8">Paste your YouTube link and get started for free.</p>
            <UrlInput onSubmit={handleSubmit} isLoading={state === "loading"} />
          </div>
        )}

        {state === "loading" && (
          <div className="mt-12 text-center">
            <LoadingState />
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Fetching data from Hugging Face...</p>
          </div>
        )}

        {/* Results Section */}
        {state === "results" && (
          <div className="w-full animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Preview & Title */}
              <div className="w-full md:w-1/2">
                <VideoPreview video={videoData} />
                <button 
                  onClick={handleReset}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <RefreshCcw className="h-4 w-4" /> Download another video
                </button>
              </div>

              {/* Download Options */}
              <div className="w-full md:w-1/2 space-y-6">
                
                {/* Video Options */}
                <div>
                  <h2 className="text-lg font-bold mb-3 border-b pb-2">Video Qualities</h2>
                  <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
                    {videoFormats.length > 0 ? videoFormats.map((format, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-card border shadow-sm">
                        <span className="font-semibold text-sm capitalize">{format.qualityLabel} ({format.container})</span>
                        <button
                          onClick={() => handleDownloadAction(format.url, `${videoData.title}.${format.container}`)}
                          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                          Download
                        </button>
                      </div>
                    )) : <p className="text-sm text-muted-foreground">No direct video formats found.</p>}
                  </div>
                </div>

                {/* Audio Options */}
                <div>
                  <h2 className="text-lg font-bold mb-3 border-b pb-2 text-green-600">Audio Only (MP3)</h2>
                  <div className="grid gap-2">
                    {audioFormats.length > 0 ? audioFormats.map((format, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-card border shadow-sm">
                        <span className="font-semibold text-sm">High Quality ({format.audioBitrate}kbps)</span>
                        <button
                          onClick={() => handleDownloadAction(format.url, `${videoData.title}.mp3`)}
                          className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-green-700 transition-colors"
                        >
                          Get MP3
                        </button>
                      </div>
                    )) : <p className="text-sm text-muted-foreground">No audio formats available.</p>}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {state === "error" && (
          <div className="mt-8 w-full max-w-md animate-in shake duration-300">
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-bold">Error</p>
                <p className="text-sm opacity-90">{error}</p>
                <button onClick={handleReset} className="mt-2 text-xs underline font-bold uppercase tracking-wider">Try Again</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 text-center border-t bg-card/20">
        <p className="text-sm text-muted-foreground italic">© 2026 VideoLink - Professional Downloader</p>
      </footer>
    </div>
  );
};

export default Index;
