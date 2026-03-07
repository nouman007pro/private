export interface VideoFormat {
  id: string;
  quality: string;
  format: string;
  fileSize: string;
  fileSizeBytes: number;
  type: 'video' | 'audio';
  resolution?: string;
  bitrate?: string;
}

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views: string;
  uploadDate: string;
  videoId: string;
}

export const mockVideoMetadata: VideoMetadata = {
  title: "Building a Modern Web App from Scratch — Full Tutorial 2025",
  thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  duration: "24:38",
  channel: "CodeMaster Pro",
  views: "1.2M views",
  uploadDate: "Jan 15, 2025",
  videoId: "dQw4w9WgXcQ",
};

export const mockFormats: VideoFormat[] = [
  { id: "1", quality: "1080p", format: "MP4", fileSize: "245 MB", fileSizeBytes: 245000000, type: "video", resolution: "1920×1080" },
  { id: "2", quality: "720p", format: "MP4", fileSize: "128 MB", fileSizeBytes: 128000000, type: "video", resolution: "1280×720" },
  { id: "3", quality: "480p", format: "MP4", fileSize: "68 MB", fileSizeBytes: 68000000, type: "video", resolution: "854×480" },
  { id: "4", quality: "360p", format: "MP4", fileSize: "42 MB", fileSizeBytes: 42000000, type: "video", resolution: "640×360" },
  { id: "5", quality: "240p", format: "MP4", fileSize: "22 MB", fileSizeBytes: 22000000, type: "video", resolution: "426×240" },
  { id: "6", quality: "144p", format: "MP4", fileSize: "12 MB", fileSizeBytes: 12000000, type: "video", resolution: "256×144" },
  { id: "7", quality: "320kbps", format: "MP3", fileSize: "9.4 MB", fileSizeBytes: 9400000, type: "audio", bitrate: "320 kbps" },
  { id: "8", quality: "128kbps", format: "MP3", fileSize: "3.8 MB", fileSizeBytes: 3800000, type: "audio", bitrate: "128 kbps" },
];
