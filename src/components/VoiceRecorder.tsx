import React, { useState, useRef } from "react";

const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        await uploadAudioViaServer(audioBlob);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone access denied or unavailable");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadAudioViaServer = async (audioBlob: Blob) => {
    setUploading(true);
    try {
      const id = crypto.randomUUID();
      const ext = "webm";
      const filename = `${id}.${ext}`;

      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.length; i++) binary += String.fromCharCode(uint8Array[i]);
      const base64 = btoa(binary);

      const res = await fetch('/.netlify/functions/upload-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, contentType: audioBlob.type, base64 }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `upload failed ${res.status}`);
      }

      const data = await res.json();
      if (data?.publicUrl) setAudioUrl(data.publicUrl);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 320 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={startRecording} disabled={recording}>
          {recording ? "Recording..." : "Start Recording"}
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
      </div>
      {uploading && <div style={{ fontSize: 12 }}>Uploading...</div>}
      {audioUrl && (
        <audio src={audioUrl} controls style={{ marginTop: 8 }} />
      )}
    </div>
  );
};

export default VoiceRecorder;
