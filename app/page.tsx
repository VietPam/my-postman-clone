'use client';
import { useState, useEffect } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface HeaderItem {
  key: string;
  value: string;
  enabled: boolean;
}

interface HistoryItem {
  id: string;
  url: string;
  method: Method;
  timestamp: number;
  status?: number;
}

export default function Home() {
  const [url, setUrl] = useState('https://api.mihong.vn/v1/gold-prices?market=domestic');
  const [method, setMethod] = useState<Method>('GET');
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { key: 'Accept', value: 'application/json', enabled: true },
    { key: 'Content-Type', value: 'application/json', enabled: true },
  ]);
  const [body, setBody] = useState('{\n  \n}');
  const [activeTab, setActiveTab] = useState<'PARAMS' | 'HEADERS' | 'BODY'>('PARAMS');
  
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('req_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const addToHistory = (status: number) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      url,
      method,
      timestamp: Date.now(),
      status
    };
    const newHistory = [newItem, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('req_history', JSON.stringify(newHistory));
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setUrl(item.url);
    setMethod(item.method);
    setShowHistory(false);
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setStatus(null);

    const activeHeaders = headers.reduce((acc, curr) => {
      if (curr.enabled && curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    activeHeaders['Referer'] = 'https://mihong.vn/';
    activeHeaders['Origin'] = 'https://mihong.vn';

    try {
      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: url,
          method,
          headers: activeHeaders,
          data: method !== 'GET' ? JSON.parse(body) : undefined,
        }),
      });

      const data = await res.json();
      setStatus(data.status || res.status);
      setResponse(data.data || data);
      addToHistory(data.status || res.status);
    } catch (error) {
      setStatus(500);
      setResponse({ error: 'Client Error', details: error });
    } finally {
      setLoading(false);
    }
  };

  const themeClass = isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inputClass = isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${themeClass}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white`}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Postman Clone</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-4 py-2 rounded-md font-medium border ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              History
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-md border ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {showHistory && (
          <div className={`p-4 rounded-lg border shadow-sm ${cardClass}`}>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-70">Recent Requests</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => loadHistoryItem(item)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`font-bold text-xs w-12 ${getMethodColor(item.method)}`}>{item.method}</span>
                    <span className="truncate opacity-80">{item.url}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
              {history.length === 0 && <p className="text-sm opacity-50 text-center py-4">No history yet</p>}
            </div>
          </div>
        )}

        <div className={`p-1 rounded-lg border shadow-sm flex gap-0 ${cardClass}`}>
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value as Method)}
            className={`px-4 py-3 rounded-l-md font-bold bg-transparent outline-none cursor-pointer ${getMethodColor(method)}`}
          >
            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m} value={m} className="text-black">{m}</option>)}
          </select>
          <div className={`w-px my-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 bg-transparent outline-none font-mono text-sm"
            placeholder="https://api.example.com/v1/resource"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-r-md font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending</span>
              </>
            ) : 'Send'}
          </button>
        </div>

        <div className={`rounded-lg border shadow-sm overflow-hidden ${cardClass}`}>
          <div className={`flex border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <TabButton label="Query Params" isActive={activeTab === 'PARAMS'} onClick={() => setActiveTab('PARAMS')} isDark={isDarkMode} />
            <TabButton label="Headers" count={headers.filter(h => h.enabled).length} isActive={activeTab === 'HEADERS'} onClick={() => setActiveTab('HEADERS')} isDark={isDarkMode} />
            <TabButton label="JSON Body" isActive={activeTab === 'BODY'} onClick={() => setActiveTab('BODY')} isDark={isDarkMode} />
          </div>
          
          <div className="p-6 min-h-[200px]">
            {activeTab === 'PARAMS' && (
              <div className="text-center py-10 opacity-50">
                <p>Query params are currently parsed directly from the URL.</p>
                <p className="text-sm mt-2">Edit the URL directly above.</p>
              </div>
            )}

            {activeTab === 'HEADERS' && (
              <div className="space-y-2">
                {headers.map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="checkbox" 
                      checked={h.enabled} 
                      onChange={e => {
                        const newH = [...headers];
                        newH[i].enabled = e.target.checked;
                        setHeaders(newH);
                      }}
                      className="mt-3"
                    />
                    <input 
                      placeholder="Key"
                      value={h.key}
                      onChange={e => {
                        const newH = [...headers];
                        newH[i].key = e.target.value;
                        setHeaders(newH);
                      }}
                      className={`flex-1 p-2 rounded border outline-none text-sm ${inputClass}`}
                    />
                    <input 
                      placeholder="Value"
                      value={h.value}
                      onChange={e => {
                        const newH = [...headers];
                        newH[i].value = e.target.value;
                        setHeaders(newH);
                      }}
                      className={`flex-1 p-2 rounded border outline-none text-sm ${inputClass}`}
                    />
                    <button 
                      onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}
                      className="p-2 opacity-50 hover:opacity-100 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setHeaders([...headers, { key: '', value: '', enabled: true }])}
                  className="mt-2 text-sm text-blue-500 hover:underline font-medium"
                >
                  + Add Header
                </button>
              </div>
            )}

            {activeTab === 'BODY' && (
              <div className="h-full relative">
                 {method === 'GET' && <div className="absolute inset-0 bg-black/5 flex items-center justify-center z-10 backdrop-blur-[1px] rounded text-sm opacity-70">GET requests typically do not have a body</div>}
                 <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className={`w-full h-48 p-4 font-mono text-sm rounded border outline-none resize-y ${inputClass}`}
                  spellCheck={false}
                 />
              </div>
            )}
          </div>
        </div>

        <div className={`rounded-lg border shadow-sm overflow-hidden ${cardClass}`}>
          <div className={`flex justify-between items-center px-4 py-2 border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <span className="text-xs font-bold opacity-70 tracking-wider">RESPONSE</span>
            {status && (
              <div className="flex gap-4 text-xs font-mono">
                <span className={`font-bold ${getStatusColor(status)}`}>Status: {status}</span>
              </div>
            )}
          </div>
          <div className={`p-0 overflow-auto max-h-[600px] ${isDarkMode ? 'bg-[#0d1117]' : 'bg-white'}`}>
            {response ? (
              <JsonHighlighter data={response} isDark={isDarkMode} />
            ) : (
              <div className="p-8 text-center opacity-40 text-sm">
                Enter URL and click Send to get a response
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const TabButton = ({ label, count, isActive, onClick, isDark }: any) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium border-b-2 transition-all flex gap-2 items-center ${
      isActive 
        ? 'border-blue-500 text-blue-500' 
        : `border-transparent ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`
    }`}
  >
    {label}
    {count !== undefined && count > 0 && (
      <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">{count}</span>
    )}
  </button>
);

const JsonHighlighter = ({ data, isDark }: { data: any, isDark: boolean }) => {
  const jsonString = JSON.stringify(data, null, 2);
  
  const colorize = (json: string) => {
    if (!json) return '';
    
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = isDark ? 'text-orange-400' : 'text-blue-700'; 
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = isDark ? 'text-blue-400' : 'text-purple-700'; 
          } else {
            cls = isDark ? 'text-green-400' : 'text-green-700'; 
          }
        } else if (/true|false/.test(match)) {
          cls = isDark ? 'text-purple-400' : 'text-purple-600'; 
        } else if (/null/.test(match)) {
          cls = 'text-gray-500';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <pre 
      className="p-4 font-mono text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: colorize(jsonString) }}
    />
  );
};

const getMethodColor = (m: string) => {
  switch (m) {
    case 'GET': return 'text-green-500';
    case 'POST': return 'text-yellow-500';
    case 'DELETE': return 'text-red-500';
    case 'PUT': return 'text-blue-500';
    default: return 'text-gray-500';
  }
};

const getStatusColor = (s: number | undefined) => {
  if (!s) return 'text-gray-500';
  if (s >= 200 && s < 300) return 'text-green-500 bg-green-500/10';
  if (s >= 400 && s < 500) return 'text-orange-500 bg-orange-500/10';
  if (s >= 500) return 'text-red-500 bg-red-500/10';
  return 'text-blue-500';
};