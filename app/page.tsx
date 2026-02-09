// app/page.tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('https://api.mihong.vn/v1/gold-prices?market=domestic');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // State quản lý giao diện Sáng/Tối (Mặc định là Tối - true)
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: url,
          method: method,
          headers: {
            'Referer': 'https://mihong.vn/',
            'Origin': 'https://mihong.vn' 
          }
        }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container chính bao phủ toàn màn hình (min-h-screen) để đổi màu nền toàn bộ
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      <div className="p-10 max-w-5xl mx-auto space-y-6">
        
        {/* Header + Nút đổi Theme */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Postman Clone</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              isDarkMode 
                ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        
        {/* Input Area */}
        <div className="flex gap-2">
          {/* Select Box - Màu sắc thay đổi theo theme */}
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            className={`border p-3 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          
          {/* URL Input - Đã sửa lỗi hiển thị màu chữ */}
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`border p-3 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-800 text-white border-gray-700 placeholder-gray-400' 
                : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
            }`}
            placeholder="Enter API URL"
          />
          
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2 rounded font-bold hover:bg-blue-500 disabled:bg-gray-600 transition-colors"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Response Area */}
        <div className={`border rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Thanh tiêu đề nhỏ của Response */}
            <div className={`px-4 py-2 text-xs font-mono border-b ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}>
                RESPONSE BODY
            </div>

            {/* Nội dung JSON */}
            <div className={`p-4 min-h-[400px] overflow-auto font-mono text-sm ${
                isDarkMode ? 'bg-gray-900 text-green-400' : 'bg-white text-purple-700'
            }`}>
                <pre>{response ? JSON.stringify(response, null, 2) : 'Ready to send request...'}</pre>
            </div>
        </div>

      </div>
    </div>
  );
}