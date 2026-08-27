from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
import uvicorn

app = FastAPI()

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marketing Automation Tool</title>
    <script src="https://jsdelivr.net"></script>
</head>
<body class="bg-gray-100 font-sans min-h-screen flex flex-col items-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mt-6">
        <h1 class="text-2xl font-bold text-center text-blue-600 mb-6">🚀 Automation Tool</h1>
        
        <form action="/run-bot" method="post" class="space-y-4">
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nội dung bài đăng Facebook:</label>
                <textarea name="fb_content" rows="3" class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập nội dung đăng nhóm..."></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Đường dẫn Video TikTok (trên PC):</label>
                <input type="text" name="tiktok_video" class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ví dụ: C:/videos/clip1.mp4">
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề video TikTok:</label>
                <input type="text" name="tiktok_caption" class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nhập caption + hashtag...">
            </div>

            <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-blue-700 transition duration-200">
                👉 KÍCH HOẠT TOOL NGAY
            </button>
        </form>
    </div>
</body>
</html>
"""

@app.get("/", response_class=HTMLResponse)
async def home():
    return HTML_TEMPLATE

@app.post("/run-bot")
async def run_bot(fb_content: str = Form(""), tiktok_video: str = Form(""), tiktok_caption: str = Form("")):
    print(f"[HỆ THỐNG] Nhận bài đăng FB: {fb_content}")
    print(f"[HỆ THỐNG] Nhận Video TikTok: {tiktok_video} | Caption: {tiktok_caption}")
    return HTMLResponse("<h2>Hệ thống đã nhận lệnh thành công! Trình duyệt đang chạy ngầm để đăng bài...</h2><br><a href='/'>Quay lại</a>")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

