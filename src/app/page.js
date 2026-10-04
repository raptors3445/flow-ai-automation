'use client';
import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [actionType, setActionType] = useState('summarize_email');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setOutput('');
    
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, inputText }),
      });
      const data = await res.json();
      if (data.result) {
        setOutput(data.result);
      } else {
        setOutput('Error executing workflow.');
      }
    } catch (err) {
      setOutput('Failed to connect to automation engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="bg-indigo-500/10 text-indigo-400 text-xs px-3 py-1 rounded-full border border-indigo-500/20">
            Commercial Workflow Engine
          </span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            FlowAI Automation
          </h1>
          <p className="text-slate-400 text-sm">
            Automate business tasks, lead extraction, and response generation in seconds.
          </p>
        </div>

        {/* Builder Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              1. Select Workflow Action
            </label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="summarize_email">Summarize Email & Action Items</option>
              <option value="extract_leads">Extract Client Info & Budget (JSON)</option>
              <option value="generate_reply">Generate Professional Proposal Reply</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              2. Input Data / Raw Text
            </label>
            <textarea
              rows="5"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste text, client inquiry, or raw data here..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleExecute}
            disabled={loading || !inputText}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all"
          >
            {loading ? 'Processing Workflow...' : '⚡ Run Workflow'}
          </button>
        </div>

        {/* Output Box */}
        {output && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Output Result:
            </h3>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-950 p-4 rounded-lg border border-slate-800">
              {output}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}
