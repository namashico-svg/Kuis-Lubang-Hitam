import React, { useState, useRef, useEffect } from "react";
import { sound } from "../lib/sound";
import { MessageSquare, X, Send, Sparkles, AlertCircle, HelpCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface Props {
  studentName: string;
  isOpen: boolean;
  onClose: () => void;
  currentQuestionText?: string;
  currentExplanation?: string;
}

export default function AiAssistant({
  studentName,
  isOpen,
  onClose,
  currentQuestionText,
  currentExplanation,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `Halo **${studentName || "Penjelajah Kosmis"}**! Saya adalah Asisten AI Kosmis Anda. 🌌\n\nAda konsep lubang hitam yang membuat Anda penasaran? Silakan tanyakan apa saja, atau klik tombol kontes di bawah untuk membahas soal aktif saat ini!`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    sound.playClick();
    setErrorMsg("");

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          contextQuestion: currentQuestionText,
          contextExplanation: currentExplanation,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gagal menghubungi server kosmis.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.text || "Maaf, pemancar terganggu. Bisa diulang?" },
      ]);
    } catch (err: any) {
      console.error("AI Assistant communicating failed:", err);
      setErrorMsg(err.message || "Pemancar radio tersendat debu kosmis.");
    } finally {
      setIsLoading(false);
    }
  };

  const askAboutCurrentQuestion = () => {
    if (!currentQuestionText) return;
    const promptText = `Bisa jelaskan lebih dalam mengapa jawaban untuk pertanyaan: "${currentQuestionText}" adalah demikian? Serta apa pelajaran penting dari sini?`;
    handleSend(promptText);
  };

  // Safe and ultra-lightweight custom rich text converter for simple markdown (* -> strong, \n -> br, 🌌 -> large emoji)
  const renderMessageContent = (text: string) => {
    // Escape HTML in a safe manner
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let formatted = line;
      // Bold replacer: **text**
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Bullet replacer: - item or * item
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      if (isBullet) {
        const cleaned = line.trim().substring(2);
        const bulletFormatted = cleaned.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <li key={idx} className="list-disc list-inside ml-2 text-slate-300 my-1 font-sans leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: bulletFormatted }} />
        );
      }
      return (
        <p key={idx} className="my-1.5 text-slate-300 font-sans leading-relaxed" 
           dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div id="ai-assistant-drawer" className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#0b1026]/95 border-l border-cyan-500/30 shadow-2xl flex flex-col backdrop-blur-md transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-sans text-cyan-400 tracking-wide">ASISTEN AI KOSMIS</h3>
            <span className="text-[10px] font-mono text-slate-400">Teknologi Pendidikan Tutor</span>
          </div>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
          title="Tutup Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm border shadow-md transition-all duration-200 ${
                msg.role === "user"
                  ? "bg-cyan-950/85 text-white border-cyan-500/20 rounded-tr-none"
                  : "bg-slate-950/90 text-slate-200 border-purple-500/20 rounded-tl-none"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="text-[10px] font-mono text-purple-400 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  KOSMOS AI
                </div>
              )}
              {msg.role === "user" && (
                <div className="text-[10px] font-mono text-cyan-400 mb-1 text-right">
                  {studentName || "SISWA"}
                </div>
              )}
              <div className="text-slate-350 select-text">
                {renderMessageContent(msg.text)}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-950/90 border border-cyan-500/20 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
              <div className="text-[10px] font-mono text-cyan-400 mb-1 flex items-center gap-1 animate-pulse">
                <span>MENTRANSMISIKAN DATA GALAXY...</span>
              </div>
              <div className="flex space-x-1.5 items-center py-2 px-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-3 flex gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Sambungan Terganggu</p>
              <p className="opacity-90 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions based on active Question */}
      {currentQuestionText && (
        <div className="p-3 bg-slate-950/90 border-t border-cyan-500/10 flex flex-col gap-2 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            SARAN TOPIK AKTIF:
          </span>
          <button
            onClick={askAboutCurrentQuestion}
            disabled={isLoading}
            className="text-left text-xs bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-cyan-300 border border-cyan-500/20 px-3 py-2 rounded-lg transition-colors hover:border-cyan-500/40"
          >
            "Jelaskan jawaban dari soal nomor ini..."
          </button>
        </div>
      )}

      {/* Form Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="p-4 bg-slate-950 border-t border-cyan-500/25 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder="Tanya konsep orbital, hawking, relativitas..."
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-800 border border-cyan-400/20 text-[#050816] font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 flex items-center gap-1"
          title="Kirim Pertanyaan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
