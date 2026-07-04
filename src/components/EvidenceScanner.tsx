/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, RefreshCw, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Evidence } from '../types';

interface EvidenceScannerProps {
  caseId: string;
  isWarmMode: boolean;
  onClueScanned: (newClue: Evidence) => void;
}

export default function EvidenceScanner({ caseId, isWarmMode, onClueScanned }: EvidenceScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<Evidence | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Styling
  const containerBg = isWarmMode
    ? 'bg-[#ebdcd0]/70 border-amber-800/20 text-stone-900 shadow-md'
    : 'bg-[#15151a] border-[#2d2d33] text-[#d1d1d6] shadow-2xl';

  const terminalBg = isWarmMode
    ? 'bg-[#faf7f3] border-stone-300'
    : 'bg-[#0a0a0c] border-[#2d2d33]';

  const buttonStyle = 'px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border';

  // Toggle Camera stream
  const startCamera = async () => {
    setCameraError(null);
    setCapturedImage(null);
    setScanResult(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access denied or failed:', err);
      setCameraError('Microscope hardware offline. Please grant browser camera permissions or upload a snapshot.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Lifecycle
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  // Capture Image from Video Stream
  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Match aspect ratio
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Draw image frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URI
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        
        // Shut down stream to conserve memory
        stopCamera();
      }
    }
  };

  // File drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setScanResult(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScanResult(null);
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Forensic scanner only accepts image assets (PNG/JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Call backend to analyze clue with Gemini
  const analyzeCapturedEvidence = async () => {
    if (!capturedImage) return;
    setIsScanning(true);
    setScanResult(null);
    try {
      const response = await fetch('/api/evidence/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          image: capturedImage,
        }),
      });

      const data = await response.json();
      if (data.success && data.clue) {
        setScanResult(data.clue);
        onClueScanned(data.clue);
      } else {
        throw new Error(data.error || 'Server processing error');
      }
    } catch (err) {
      console.error('Forensic scan failed:', err);
      alert('Forensic matrix computation failed. Reverting to offline spectrum logs.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <section className={`relative rounded-xl p-4 sm:p-5 border transition-all overflow-hidden ${containerBg}`}>
      {/* Reticle / Matrix Background effect */}
      {!isWarmMode && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-5" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 4px, 6px 100%'
          }} 
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 mb-4 border-b border-stone-850/10">
        <div>
          <h2 className="font-sans font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-3 bg-red-600 animate-pulse"></span>
            <span>AI Evidence Scanner Hub</span>
          </h2>
          <p className="text-[10px] text-stone-500 font-mono mt-0.5">
            Capture or import physical clues. Gemini extract forensic metadata.
          </p>
        </div>
        <div className="flex bg-stone-900/30 p-0.5 rounded border border-stone-800/40">
          <button
            onClick={() => { setActiveTab('camera'); setCapturedImage(null); setScanResult(null); }}
            className={`px-2 py-1 text-[9px] font-mono rounded uppercase transition-colors ${
              activeTab === 'camera'
                ? 'bg-red-600 text-white'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            Webcam
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setCapturedImage(null); setScanResult(null); }}
            className={`px-2 py-1 text-[9px] font-mono rounded uppercase transition-colors ${
              activeTab === 'upload'
                ? 'bg-red-600 text-white'
                : 'text-stone-500 hover:text-stone-300'
            }`}
          >
            File Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch relative z-10">
        
        {/* Left Side: Scanner Preview or Capture */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className={`relative aspect-video rounded-lg border overflow-hidden flex items-center justify-center ${terminalBg}`}>
            
            {activeTab === 'camera' && (
              <>
                {isCameraActive && !capturedImage && (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                    />
                    
                    {/* Retro Laser / Scan overlays */}
                    <div className="absolute inset-0 border-2 border-red-500/20 pointer-events-none" />
                    <div className="absolute top-2 left-2 text-[8px] font-mono text-red-500 bg-black/60 px-1 py-0.5 rounded animate-pulse">
                      MICROSCOPE_FEED_ON
                    </div>
                    
                    {/* Reticle brackets */}
                    <div className="absolute w-4 h-4 border-t-2 border-l-2 border-red-500 top-6 left-6" />
                    <div className="absolute w-4 h-4 border-t-2 border-r-2 border-red-500 top-6 right-6" />
                    <div className="absolute w-4 h-4 border-b-2 border-l-2 border-red-500 bottom-6 left-6" />
                    <div className="absolute w-4 h-4 border-b-2 border-r-2 border-red-500 bottom-6 right-6" />

                    {/* Scanning line animation */}
                    <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444] animate-scan" style={{
                      animation: 'scan 3s linear infinite'
                    }} />
                  </>
                )}

                {!isCameraActive && !capturedImage && (
                  <div className="p-4 text-center">
                    {cameraError ? (
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                        <p className="text-[10px] font-mono text-amber-500 leading-tight max-w-xs">{cameraError}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-stone-500 animate-spin mb-2" />
                        <p className="text-[10px] font-mono text-stone-500">Initializing micro-spectrograph camera...</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'upload' && !capturedImage && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`absolute inset-0 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-red-500 bg-red-950/10' 
                    : 'border-stone-700/50 hover:border-stone-500 hover:bg-stone-900/10'
                }`}
              >
                <Upload className="w-8 h-8 text-stone-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold uppercase tracking-wide">Drag Forensic Photo Here</p>
                <p className="text-[9px] text-stone-500 font-mono mt-1">or click to browse local mainframe memory</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}

            {/* Render Static Snapshot Preview */}
            {capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <img src={capturedImage} alt="Captured clue" className="w-full h-full object-contain" />
                
                {/* Neon scanning laser sweeping if analyzing */}
                {isScanning && (
                  <div className="absolute inset-0 bg-red-500/10 backdrop-blur-[0.5px]">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-red-500 shadow-[0_0_15px_#dc2626] animate-pulse" style={{
                      animation: 'sweep 1.5s ease-in-out infinite alternate',
                      left: '50%'
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-stone-950/90 border border-stone-800 px-4 py-2.5 rounded-md flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                        <span className="text-[10px] font-mono text-stone-300 tracking-wider">GEMINI_EXTRACTING_CLUE...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Row Under Preview */}
          <div className="flex gap-2.5 mt-3 justify-end shrink-0">
            {isCameraActive && !capturedImage && (
              <button
                onClick={captureSnapshot}
                className={`${buttonStyle} bg-red-600 hover:bg-red-500 border-red-600 text-stone-100`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap Forensic Image</span>
              </button>
            )}

            {capturedImage && !isScanning && (
              <>
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    setScanResult(null);
                    if (activeTab === 'camera') startCamera();
                  }}
                  className={`${buttonStyle} bg-stone-950 hover:bg-stone-900 border-stone-800 text-stone-400`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reshoot</span>
                </button>
                <button
                  onClick={analyzeCapturedEvidence}
                  className={`${buttonStyle} bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-stone-100`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Scan with Gemini AI</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Analysis Display */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className={`p-4 rounded-lg border h-full flex flex-col justify-center min-h-[140px] ${terminalBg}`}>
            
            {/* Case where scan is in progress */}
            {isScanning && (
              <div className="text-center py-6">
                <Loader2 className="w-7 h-7 text-red-500 animate-spin mx-auto mb-2" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-red-400">Spectrum Decoding</h4>
                <p className="text-[10px] text-stone-500 font-mono mt-1 leading-relaxed max-w-xs mx-auto">
                  Gemini multimodal model parsing pixels. Correlating molecular stains with suspect profiles.
                </p>
              </div>
            )}

            {/* Case where nothing has been captured/scanned yet */}
            {!capturedImage && !isScanning && !scanResult && (
              <div className="text-center text-stone-500 py-6">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <h4 className="text-[10px] font-mono uppercase tracking-wider">Scanner Idle</h4>
                <p className="text-[9px] leading-tight max-w-[160px] mx-auto mt-1">
                  Feed a physical item into the spectrograph to decrypt secret correlations.
                </p>
              </div>
            )}

            {/* Show instructions once photo is ready to scan */}
            {capturedImage && !isScanning && !scanResult && (
              <div className="text-center text-stone-400 py-6">
                <Sparkles className="w-6 h-6 mx-auto mb-2 text-red-500 animate-pulse" />
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-red-400">Photo Staged Successfully</h4>
                <p className="text-[9px] leading-tight max-w-[180px] mx-auto mt-1">
                  Click 'Scan with Gemini AI' to let the AI process the image and output the forensic records.
                </p>
              </div>
            )}

            {/* Case where scan has succeeded and returned evidence metadata */}
            {scanResult && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-500 font-mono text-[10px] uppercase font-bold">
                  <Check className="w-3.5 h-3.5 bg-emerald-950 border border-emerald-500 rounded-full p-0.5" />
                  <span>Scanning complete</span>
                </div>
                
                <div>
                  <h4 className="text-xs font-extrabold uppercase font-mono tracking-tight text-red-500">
                    {scanResult.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-mono uppercase tracking-widest bg-red-950/40 text-red-400 border border-red-900/40 px-1.5 py-0.25 rounded">
                      {scanResult.importance}_priority
                    </span>
                    <span className="text-[8px] font-mono uppercase text-stone-500">
                      NODE_{scanResult.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className={`text-[10px] leading-relaxed ${isWarmMode ? 'text-stone-800' : 'text-[#a1a1aa]'}`}>
                  {scanResult.description}
                </p>
                
                <div className="bg-emerald-950/10 border border-emerald-500/20 px-2.5 py-1.5 rounded text-[8px] font-mono text-emerald-400">
                  🧬 Added and pinned onto Corkboard.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {/* Dynamic Keyframes injected for CSS animation sweeps */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes sweep {
          0% { left: 0%; }
          100% { left: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
