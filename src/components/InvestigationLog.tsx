/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, HelpCircle, FileText, AlertCircle } from 'lucide-react';

interface InvestigationLogProps {
  caseId: string;
  isWarmMode: boolean;
  notes: string[];
  onAddNote: (note: string) => void;
}

export default function InvestigationLog({ caseId, isWarmMode, notes, onAddNote }: InvestigationLogProps) {
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Styling properties
  const containerBg = isWarmMode
    ? 'bg-[#ebdcd0]/70 border-amber-800/20 text-stone-900 shadow-md'
    : 'bg-[#15151a] border-[#2d2d33] text-[#d1d1d6] shadow-xl';

  const terminalBg = isWarmMode
    ? 'bg-[#faf7f3] border-stone-300'
    : 'bg-[#0a0a0c] border-[#2d2d33]';

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsRecording(true);
        setRecordingError(null);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim()) {
          onAddNote(transcript.trim());
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setRecordingError('Microphone permission blocked. Enable access in browser settings.');
        } else {
          setRecordingError(`Speech error: ${event.error}`);
        }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [onAddNote]);

  // Scroll logs to bottom when new note is added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [notes]);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Your browser does not support standard speech recognition. Please type manual notes.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recording:', e);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddNote(inputText.trim());
      setInputText('');
    }
  };

  return (
    <section className={`rounded-xl p-4 sm:p-5 border transition-all ${containerBg}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-850/10">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-red-500 animate-pulse" />
          <h2 className="font-sans font-bold text-xs uppercase tracking-wider">Deduction Notes & Voice Logs</h2>
        </div>
        <span className="text-[9px] font-mono bg-red-950/40 text-red-400 border border-red-900/40 px-1.5 py-0.5 rounded">
          SECURE_FILE_{caseId.slice(0, 8)}
        </span>
      </div>

      {/* Terminal Log Output */}
      <div 
        ref={scrollRef}
        className={`h-40 overflow-y-auto rounded-lg p-3 font-mono text-[11px] leading-relaxed space-y-2 border mb-3 ${terminalBg}`}
      >
        {notes.map((note, index) => {
          const isUserLog = note.startsWith('DEDUCTION_LOG:');
          const prefixColor = isUserLog ? 'text-emerald-500' : 'text-stone-500';
          const content = isUserLog ? note.replace('DEDUCTION_LOG:', '') : note;

          return (
            <div key={index} className="flex gap-2 items-start border-b border-stone-900/10 last:border-0 pb-1">
              <span className={`shrink-0 font-bold ${prefixColor}`}>
                [{isUserLog ? 'SLEUTH_LOG' : 'FORENSIC_DB'}]
              </span>
              <span className={isWarmMode ? 'text-stone-800' : 'text-stone-300'}>{content}</span>
            </div>
          );
        })}
        {notes.length === 0 && (
          <div className="text-stone-500 text-center py-10">
            No entries registered in this investigation file yet.
          </div>
        )}
      </div>

      {/* Recording Feedback Messages */}
      {isRecording && (
        <div className="flex items-center gap-2 mb-3 px-1 py-1.5 bg-red-950/30 border border-red-900/40 rounded text-[10px] font-mono text-red-400 animate-pulse">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span>MICROPHONE_ACTIVE: Speak clearly into scanning array...</span>
        </div>
      )}

      {recordingError && (
        <div className="flex items-center gap-2 mb-3 px-2 py-1.5 bg-amber-950/30 border border-amber-900/40 rounded text-[10px] font-mono text-amber-500">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{recordingError}</span>
        </div>
      )}

      {/* Action Input Form */}
      <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
        <button
          type="button"
          id="record-note-btn"
          onClick={handleToggleRecording}
          className={`shrink-0 p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            isRecording
              ? 'bg-red-600 border-red-500 text-white animate-pulse'
              : 'bg-stone-950/30 hover:bg-stone-900/30 border-stone-800/40 text-stone-400'
          }`}
          title={isRecording ? 'Stop Recording' : 'Record spoken note via voice'}
        >
          {isRecording ? <MicOff className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isRecording ? 'Listening...' : 'Type physical observations manually...'}
          disabled={isRecording}
          className={`w-full bg-stone-950/40 border border-stone-800/40 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-red-500 transition-all ${
            isWarmMode ? 'text-stone-950 placeholder-stone-500' : 'text-stone-200 placeholder-stone-600'
          }`}
        />

        <button
          type="submit"
          disabled={isRecording || !inputText.trim()}
          className="shrink-0 p-2.5 bg-red-600 hover:bg-red-500 disabled:bg-stone-950/20 disabled:text-stone-600 rounded-lg text-white font-bold transition-all cursor-pointer border border-red-600"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </section>
  );
}
