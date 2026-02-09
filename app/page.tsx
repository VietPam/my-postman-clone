// app/page.tsx
'use client';
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('https://api.mihong.vn/v1/gold-prices?market=domestic');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    try {
      // Gọi đến API Proxy của chính mình (server nội bộ Next.js)
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: url,
          method: method,
          headers: {
            // Thêm headers đặc biệt nếu cần thiết
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
    <div className="p-10 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">My Postman Clone (Vercel Proxy)</h1>
      
      {/* Input Area */}
      <div className="flex gap-2">
        <select 
          value={method} 
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2 rounded bg-gray-100 text-black"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
        
        <input 
          type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 rounded flex-1 text-black"
          placeholder="Enter API URL"
        />
        
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {/* Response Area */}
      <div className="border rounded p-4 bg-gray-900 text-green-400 min-h-[300px] overflow-auto font-mono text-sm">
        <pre>{response ? JSON.stringify(response, null, 2) : 'Ready to send request...'}</pre>
      </div>
    </div>
  );
}