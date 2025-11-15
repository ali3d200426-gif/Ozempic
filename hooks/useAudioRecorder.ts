
import { useState, useRef, useCallback } from 'react';

type AudioRecorderControls = {
  isRecording: boolean;
  audioURL: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
  error: string | null;
};

export function useAudioRecorder(): AudioRecorderControls {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setAudioURL(null);
      audioChunksRef.current = [];
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      
      recorder.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      });

      recorder.start();
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access was denied. Please enable it in your browser settings.');
      setIsRecording(false);
    }
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
    setAudioURL(null);
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  }, []);

  return { isRecording, audioURL, startRecording, stopRecording, resetRecording, error };
}
