import React, { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const SUPABASE_BUCKET = (import.meta.env.VITE_SUPABASE_BUCKET as string) || "recordings";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        // auto upload
        await uploadAudio(audioBlob);
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

  const uploadAudio = async (audioBlob: Blob) => {
    setUploading(true);
    try {
      const id = crypto.randomUUID();
      const ext = "webm";
      const path = `${id}.${ext}`;

      // upload to storage
      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(path, audioBlob, { upsert: false });

      if (uploadError) throw uploadError;

      // get public url
      const { data: publicData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(path);
      const publicUrl = publicData?.publicUrl || null;

      // store metadata in recordings table if available
      try {
        await supabase.from("recordings").insert([
          {
            id,
            path,
            bucket: SUPABASE_BUCKET,
            content_type: audioBlob.type,
            size: audioBlob.size,
          },
        ]);
      } catch (err) {
        // ignore metadata insert errors but log
        console.warn("Could not insert recording metadata", err);
      }

      if (publicUrl) {
        setAudioUrl(publicUrl);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console for details.");
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
