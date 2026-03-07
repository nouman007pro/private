import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Video API is running"

@app.route("/get-video")
def get_video():
    url = request.args.get("url")

    if not url:
        return jsonify({"error": "URL parameter is required"}), 400

    try:
        ydl_opts = {
            "quiet": True,
            "noplaylist": True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        formats = []

        for f in info["formats"]:
            formats.append({
                "quality": f"{f.get('height')}p" if f.get("height") else "audio",
                "url": f.get("url"),
                "ext": f.get("ext"),
                "hasVideo": f.get("vcodec") != "none",
                "hasAudio": f.get("acodec") != "none"
            })

        return jsonify({
            "title": info.get("title"),
            "thumbnail": info.get("thumbnail"),
            "formats": formats
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
