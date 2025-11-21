
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, X, Loader2, Volume2, Camera, CameraOff } from 'lucide-react';

interface LiveSessionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSession: React.FC<LiveSessionProps> = ({ isOpen, onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [status, setStatus] = useState('Connecting...');
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<Promise<any> | null>(null);
  const videoIntervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => stopSession();
  }, [isOpen]);

  const startSession = async () => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setStatus('API Key missing');
        return;
      }
      
      setStatus('Initializing Devices...');
      const ai = new GoogleGenAI({ apiKey });

      // Audio Setup
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // Request Media Stream (Audio is mandatory, Video optional but requested for multimodal)
      // We start with audio only, enabling video if user toggles it, OR request both and mute video track?
      // Strategy: Request both if possible, manage tracks.
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        // Request video if we want to support it, but maybe default to off and request later?
        // For simplicity in Live Demo, let's request both and disable video track initially.
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;

      // Handle Video Track
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = false; // Start with video off
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        }
      }

      // Input Processing (Mic -> Model)
      const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputSourceRef.current = inputContext.createMediaStreamSource(stream);
      processorRef.current = inputContext.createScriptProcessor(4096, 1, 1);
      
      // Output Processing (Model -> Speakers)
      outputNodeRef.current = audioContextRef.current.createGain();
      outputNodeRef.current.connect(audioContextRef.current.destination);

      setStatus('Connecting to Gemini Live...');
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setStatus('Live');
            setIsConnected(true);
            
            // Start Streaming Audio Input
            if (processorRef.current) {
              processorRef.current.onaudioprocess = (e) => {
                if (isMuted) return; 
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmData = floatTo16BitPCM(inputData);
                const base64 = arrayBufferToBase64(pcmData);
                
                sessionPromise.then(session => {
                  session.sendRealtimeInput({
                    media: {
                      mimeType: 'audio/pcm;rate=16000',
                      data: base64
                    }
                  });
                });
              };
              inputSourceRef.current?.connect(processorRef.current);
              processorRef.current.connect(inputContext.destination);
            }

            // Start Video Frame Loop (sends only if enabled)
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            videoIntervalRef.current = window.setInterval(async () => {
                 // Check if we should send video
                 const track = streamRef.current?.getVideoTracks()[0];
                 if (track && track.enabled && videoRef.current && !videoRef.current.paused && ctx) {
                     canvas.width = videoRef.current.videoWidth;
                     canvas.height = videoRef.current.videoHeight;
                     ctx.drawImage(videoRef.current, 0, 0);
                     const base64 = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
                     
                     sessionPromise.then(session => {
                         session.sendRealtimeInput({
                             media: { mimeType: 'image/jpeg', data: base64 }
                         });
                     });
                 }
            }, 500); // 2 FPS
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Transcription
            if (msg.serverContent?.inputTranscription) {
              setCurrentTranscript(`You: ${msg.serverContent.inputTranscription.text}`);
            }
            if (msg.serverContent?.outputTranscription) {
              setCurrentTranscript(`Gemini: ${msg.serverContent.outputTranscription.text}`);
            }
            if (msg.serverContent?.turnComplete) {
              // Optionally clear transcript after a delay or keep the last sentence
              // setCurrentTranscript(''); 
            }

            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              playAudioChunk(audioData);
            }

            // Handle Interruption
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(source => source.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setStatus('Disconnected');
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error(err);
            setStatus('Error occurred');
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      setStatus('Connection Failed');
    }
  };

  const stopSession = () => {
    // Cleanup Stream
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
        videoIntervalRef.current = null;
    }

    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (inputSourceRef.current) {
        inputSourceRef.current.disconnect();
        inputSourceRef.current = null;
    }
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    setIsConnected(false);
    setIsVideoEnabled(false);
  };

  const toggleVideo = () => {
      const track = streamRef.current?.getVideoTracks()[0];
      if (track) {
          const newState = !isVideoEnabled;
          track.enabled = newState;
          setIsVideoEnabled(newState);
      }
  };

  const toggleMute = () => {
      setIsMuted(!isMuted);
  };

  const playAudioChunk = async (base64Data: string) => {
    if (!audioContextRef.current || !outputNodeRef.current) return;
    
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const int16Data = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(int16Data.length);
    for (let i=0; i<int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
    }
    
    const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
    buffer.copyToChannel(float32Data, 0);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(outputNodeRef.current);
    
    const currentTime = audioContextRef.current.currentTime;
    const startTime = Math.max(currentTime, nextStartTimeRef.current);
    
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;
    
    sourcesRef.current.add(source);
    source.onended = () => sourcesRef.current.delete(source);
  };

  // Helpers
  const floatTo16BitPCM = (float32Array: Float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300 font-mono">
      <button onClick={onClose} className="absolute top-8 right-8 p-2 bg-amber-950/20 border-2 border-amber-900/50 hover:bg-amber-950/40 hover:border-amber-500 text-amber-400 z-50 transition-colors">
        <X size={32} />
      </button>

      {/* Video / Visualizer */}
      <div className="relative w-full max-w-2xl aspect-video mb-12 flex items-center justify-center bg-black overflow-hidden border-4 border-amber-500">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>

        {isVideoEnabled ? (
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                autoPlay
                playsInline
            />
        ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
                <div className={`absolute inset-0 bg-amber-500/10 blur-3xl transition-all duration-1000 ${isConnected ? 'animate-pulse' : ''}`}></div>
                <div className="w-48 h-48 bg-amber-950/30 border-4 border-amber-500 flex items-center justify-center relative shadow-[0_0_60px_rgba(217,119,6,0.6)] z-10">
                   {isConnected ? <Volume2 size={64} className="text-amber-500 animate-bounce" /> : <Loader2 size={64} className="text-amber-500 animate-spin" />}
                </div>
            </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 border-2 border-amber-900/50 backdrop-blur text-[10px] font-bold text-emerald-400 flex items-center gap-2 tracking-wider">
           <div className={`w-2 h-2 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
           {status.toUpperCase()}
        </div>

        {/* Subtitles Overlay */}
        {currentTranscript && (
          <div className="absolute bottom-8 left-0 right-0 text-center px-4">
            <div className="inline-block bg-black/80 backdrop-blur-md px-6 py-3 border-2 border-amber-500 text-amber-400 text-sm font-medium shadow-lg max-w-2xl tracking-wide">
              {currentTranscript}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-8 items-center">
        <button
          className={`p-6 transition-all transform hover:scale-105 border-2 ${isVideoEnabled ? 'bg-amber-500 text-black border-amber-400' : 'bg-amber-950/20 border-amber-900/50 text-amber-700 hover:bg-amber-950/40 hover:border-amber-700'}`}
          onClick={toggleVideo}
          title="Toggle Camera"
        >
          {isVideoEnabled ? <Camera size={32} /> : <CameraOff size={32} />}
        </button>

        <button
          className={`p-8 transition-all transform hover:scale-105 shadow-2xl border-2 ${isMuted ? 'bg-rose-600 text-white border-rose-500' : 'bg-amber-500 text-black border-amber-400 hover:bg-amber-400'}`}
          onClick={toggleMute}
          title="Toggle Microphone"
        >
          {isMuted ? <MicOff size={40} /> : <Mic size={40} />}
        </button>
      </div>

      <div className="mt-12 max-w-md text-center text-amber-800 text-[10px] tracking-wider">
        <p>POWERED BY GEMINI 2.5 NATIVE AUDIO & VISION.</p>
        <p>TOGGLE CAMERA TO SHOW INFIGENIE YOUR WORLD.</p>
      </div>
    </div>
  );
};
