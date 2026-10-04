'use client';
import { useState, useEffect } from 'react';
import ResultDisplay from '../components/ResultDisplay';
import HistorySidebar from '../components/HistorySidebar';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [actionType, setActionType] = useState('summarize_email');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // لود کردن تاریخچه از مرورگر
  useEffect(() => {
    const saved = localStorage.getItem('flowai_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleExecute = async () => {
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, inputText, isDemoMode }),
      });
      const data = await res.json();

      if (data.result) {
        setOutput(data.result);
        const newHistory = [{ actionType, inputText, result: data.result }, ...history.slice(0, 4)];
        setHistory(newHistory);
        localStorage.setItem('flowai_history', JSON.stringify(newHistory));
      }
    } catch (err) {
      setOutput('Failed to execute process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-12 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
            Commercial Workflow Engine
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            FlowAI Automation
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Transform raw inquiries, unstructured emails, and manual workflows into instant business value.
          </p>
        </div>

        {/* Main Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-300">Execution Mode</p>
              <p className="text-[11px] text-slate-500">Toggle between mock demo data or live API key</p>
            </div>
            <label className="flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              <span className="text-xs text-slate-300">{isDemoMode ? 'Demo Mode (Free Test)' : 'Live API Key'}</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                1. Action Type
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="summarize_email">Summarize Email & Action Items</option>
                <option value="extract_leads">Extract Client Info & Budget (JSON)</option>
                <option value="generate_reply">Generate Professional Proposal Reply</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                2. Input Context / Email / Inquiry
              </label>
              <textarea
                rows="4"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste client inquiry or raw text here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={loading || !inputText}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Processing...' : '⚡ Execute Workflow'}
            </button>
          </div>
        </div>

        {/* Results Component */}
        <ResultDisplay output={output} loading={loading} />

        {/* Activity Log Component */}
        <HistorySidebar
          history={history}
          onSelectHistory={(item) => {
            setActionType(item.actionType);
            setInputText(item.inputText);
            setOutput(item.result);
          }}
          onClear={() => {
            setHistory([]);
            localStorage.removeItem('flowai_history');
          }}
        />

      </div>
    </main>
  );
}
