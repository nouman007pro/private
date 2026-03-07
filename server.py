from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app)

@app.route('/get-video')
def get_video():
    url = request.args.get('url')

    ydl_opts = {'quiet': True}

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    formats = []

    for f in info['formats']:
        if f.get('height'):
            formats.append({
                "quality": str(f['height']) + "p",
                "ext": f['ext'],
                "url": f['url']
            })

    return jsonify({
        "title": info['title'],
        "thumbnail": info['thumbnail'],
        "formats": formats
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
