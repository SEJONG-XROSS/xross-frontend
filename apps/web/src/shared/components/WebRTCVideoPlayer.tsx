import { useEffect, useRef, useState } from "react";

interface WebRTCVideoPlayerProps {
  streamPath: string;
  className?: string;
  muted?: boolean;
  onError?: (error: Error) => void;
  onStreamReady?: () => void;
}

export default function WebRTCVideoPlayer({
  streamPath,
  className = "",
  muted = true,
  onError,
  onStreamReady,
}: WebRTCVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const isConnectingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || isConnectingRef.current) return;

    const baseUrl = import.meta.env.VITE_MEDIAMTX_BASE_URL || "http://localhost:8889";
    const whepUrl = `${baseUrl}/${streamPath}/whep`;

    setIsLoading(true);
    setError(null);
    isConnectingRef.current = true;

    const startStream = async () => {
      try {
        console.log("[WebRTC] Connecting to:", whepUrl);
        
        const optionsResponse = await fetch(whepUrl, { method: "OPTIONS" });
        console.log("[WebRTC] OPTIONS response status:", optionsResponse.status);
        
        if (!optionsResponse.ok) {
          throw new Error(`OPTIONS request failed: ${optionsResponse.status}`);
        }
        
        const linkHeader = optionsResponse.headers.get("Link");
        console.log("[WebRTC] Link header:", linkHeader);
        
        const iceServers: RTCIceServer[] = [];
        if (linkHeader) {
          const matches = linkHeader.matchAll(/<([^>]+)>;\s*rel="ice-server"/g);
          for (const match of matches) {
            iceServers.push({ urls: match[1] });
          }
        }

        console.log("[WebRTC] ICE servers:", iceServers);

        const pc = new RTCPeerConnection({ iceServers });
        pcRef.current = pc;

        pc.onconnectionstatechange = () => {
          console.log("[WebRTC] Connection state:", pc.connectionState);
        };

        pc.oniceconnectionstatechange = () => {
          console.log("[WebRTC] ICE connection state:", pc.iceConnectionState);
        };

        pc.addTransceiver("video", { direction: "recvonly" });
        pc.addTransceiver("audio", { direction: "recvonly" });

        const remoteStream = new MediaStream();
        let streamAssigned = false;

        pc.ontrack = (event) => {
          console.log("[WebRTC] Track received:", event.track.kind);
          console.log("[WebRTC] Track state:", event.track.readyState, "enabled:", event.track.enabled);
          
          if (!event.track.enabled) {
            console.log("[WebRTC] Enabling track:", event.track.kind);
            try { 
              event.track.enabled = true; 
            } catch (e) { 
              console.warn("[WebRTC] Could not set track.enabled:", e); 
            }
          }
          
          remoteStream.addTrack(event.track);
          console.log("[WebRTC] Stream tracks count:", remoteStream.getTracks().length);
          
          if (!streamAssigned && videoElement) {
            const el = videoRef.current ?? videoElement;
            if (!el) {
              console.warn("[WebRTC] No video element available when attempting to assign stream");
              return;
            }
            
            streamAssigned = true;
            console.log("[WebRTC] Assigning stream to video element. Stream tracks:", 
              remoteStream.getTracks().map(t => `${t.kind}:${t.readyState}`));
            
            el.srcObject = remoteStream;
            el.muted = true;
            
            console.log("[WebRTC] Video element srcObject assigned:", !!el.srcObject);
            console.log("[WebRTC] Video readyState:", el.readyState, 
              "networkState:", el.networkState,
              "paused:", el.paused);
            
            const tryPlay = () => {
              el.play().then(() => {
                console.log("[WebRTC] Play() succeeded. Video state:", 
                  "readyState:", el.readyState,
                  "paused:", el.paused,
                  "videoWidth:", el.videoWidth,
                  "videoHeight:", el.videoHeight);
              }).catch((err) => {
                console.warn("[WebRTC] Play() rejected:", err);
              });
            };
            
            if (el.readyState >= 1) {
              tryPlay();
            } else {
              const onLoaded = () => {
                el.removeEventListener("loadedmetadata", onLoaded);
                console.log("[WebRTC] loadedmetadata event fired");
                tryPlay();
              };
              el.addEventListener("loadedmetadata", onLoaded);
            }
            
            setTimeout(() => {
              console.log("[WebRTC] Video check after 1.5s: videoWidth=", el.videoWidth, "videoHeight=", el.videoHeight);
              if (el.videoWidth === 0 || el.videoHeight === 0) {
                console.warn("[WebRTC] Video has zero dimensions — no frames received yet");
              }
            }, 1500);
            
            console.log("[WebRTC] Stream assigned to video element");
            setIsLoading(false);
            onStreamReady?.();
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log("[WebRTC] Offer created:", offer.type, "SDP length:", offer.sdp?.length);

        console.log("[WebRTC] Sending POST to:", whepUrl);
        const response = await fetch(whepUrl, {
          method: "POST",
          headers: { "Content-Type": "application/sdp" },
          body: offer.sdp,
        });

        console.log("[WebRTC] POST response status:", response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("[WebRTC] POST error response:", errorText);
          throw new Error(`WHEP request failed: ${response.status} - ${errorText}`);
        }

        const answerSdp = await response.text();
        console.log("[WebRTC] Answer received, length:", answerSdp.length);
        await pc.setRemoteDescription({
          type: "answer",
          sdp: answerSdp,
        });
        console.log("[WebRTC] Remote description set");
      } catch (err) {
        console.error("[WebRTC] Error:", err);
        const errorMsg = err instanceof Error ? err.message : "Failed to load stream";
        setError(errorMsg);
        setIsLoading(false);
        onError?.(err instanceof Error ? err : new Error(errorMsg));
      }
    };

    startStream();

    return () => {
      isConnectingRef.current = false;
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [streamPath, onError, onStreamReady]);

  console.log("[WebRTC] Render - isLoading:", isLoading, "error:", error);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ backgroundColor: "transparent" }}
      />
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#020618]">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2b7fff] border-t-transparent" />
            <span className="font-mono text-xs text-monitor-text-dim">
              스트림 연결 중...
            </span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#020618]">
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <span className="font-mono text-xs text-red-400">스트림 연결 실패</span>
            <span className="font-mono text-[10px] text-monitor-text-dim">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
