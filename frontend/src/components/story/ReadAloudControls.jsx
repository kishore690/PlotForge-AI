import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square } from "lucide-react";

const speechLanguages = [
  { label: "English", locale: "en-US" },
  { label: "Hindi", locale: "hi-IN" },
  { label: "Kannada", locale: "kn-IN" },
];

export default function ReadAloudControls({ text, language = "English" }) {
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState("");
  const queue = useRef([]);
  const index = useRef(0);
  const alive = useRef(true);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const languageOption = speechLanguages.find((item) => item.label === selectedLanguage) || speechLanguages[0];
  const matchingVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(languageOption.locale.slice(0, 2)));

  useEffect(() => {
    setSelectedLanguage(speechLanguages.some((item) => item.label === language) ? language : "English");
  }, [language]);

  useEffect(() => {
    if (!supported) return undefined;
    alive.current = true;
    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    if (window.speechSynthesis.addEventListener) window.speechSynthesis.addEventListener("voiceschanged", updateVoices);
    else window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      alive.current = false;
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.removeEventListener) window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
      else if (window.speechSynthesis.onvoiceschanged === updateVoices) window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const stop = () => {
    if (supported) window.speechSynthesis.cancel();
    queue.current = [];
    index.current = 0;
    setSpeaking(false);
    setPaused(false);
  };

  const speakNext = () => {
    if (!alive.current) return;
    if (index.current >= queue.current.length) {
      setSpeaking(false);
      setPaused(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(queue.current[index.current]);
    utterance.lang = languageOption.locale;
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.onend = () => { index.current += 1; speakNext(); };
    utterance.onerror = () => {
      setMessage(`Playback stopped. Check that a ${selectedLanguage} speech voice is installed in your browser or device.`);
      setSpeaking(false);
      setPaused(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const play = () => {
    setMessage("");
    if (!supported) {
      setMessage("Read aloud is not supported by this browser.");
      return;
    }
    if (!matchingVoice) {
      setMessage(`No ${selectedLanguage} voice is available in this browser or device.`);
      return;
    }
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      return;
    }
    stop();
    const sentences = String(text || "").match(/[^.!?।॥\n]+[.!?।॥]?/gu) || [];
    queue.current = sentences.flatMap((sentence) => {
      const words = sentence.trim().split(/\s+/);
      const parts = [];
      let part = "";
      for (const word of words) {
        if (part && `${part} ${word}`.length > 220) {
          parts.push(part);
          part = word;
        } else part = part ? `${part} ${word}` : word;
      }
      if (part) parts.push(part);
      return parts;
    });
    index.current = 0;
    if (!queue.current.length) {
      setMessage("There is no story text to read yet.");
      return;
    }
    setSpeaking(true);
    speakNext();
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setPaused(true);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-bg/70 px-3 py-2.5">
      <span className="mr-1 text-xs font-medium text-ink-soft">Read aloud</span>
      <label className="sr-only" htmlFor="read-aloud-language">Speech language</label>
      <select id="read-aloud-language" value={selectedLanguage} onChange={(event) => { stop(); setSelectedLanguage(event.target.value); setMessage(""); }} className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-primary/50">
        {speechLanguages.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
      </select>
      <button type="button" onClick={play} disabled={speaking && !paused} aria-label={paused ? "Resume reading aloud" : "Play story aloud"} title={paused ? "Resume" : "Play"} className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary hover:bg-primary/25 disabled:opacity-50"><Play size={15} fill="currentColor" /></button>
      <button type="button" onClick={pause} disabled={!speaking || paused} aria-label="Pause reading aloud" title="Pause" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-soft hover:text-ink disabled:opacity-40"><Pause size={15} fill="currentColor" /></button>
      <button type="button" onClick={stop} disabled={!speaking} aria-label="Stop reading aloud" title="Stop" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-soft hover:text-ink disabled:opacity-40"><Square size={13} fill="currentColor" /></button>
      <span className="text-[11px] text-ink-soft">{matchingVoice ? matchingVoice.name : "Voice unavailable"}</span>
      {message && <span role="status" className="w-full text-xs text-ink-soft">{message}</span>}
    </div>
  );
}
