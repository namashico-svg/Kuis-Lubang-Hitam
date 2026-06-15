import React, { useState, useEffect, useRef } from "react";
import { QUESTIONS, Question } from "./questions";
import CosmicBackground from "./components/CosmicBackground";
import CosmicVisualizer from "./components/CosmicVisualizer";
import AiAssistant from "./components/AiAssistant";
import ResultPanel from "./components/ResultPanel";
import { sound } from "./lib/sound";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  Clock, 
  GraduationCap, 
  User, 
  Compass, 
  MessageSquare
} from "lucide-react";

export default function App() {
  // Navigation & User state
  const [screen, setScreen] = useState<"HOME" | "QUIZ" | "RESULT">("HOME");
  const [studentName, setStudentName] = useState("");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Quiz Engine state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  
  // Auto-next state: once answered, we count down 4 seconds before advancing
  const [autoNextTime, setAutoNextTime] = useState<number | null>(null);
  const autoNextIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion: Question = QUESTIONS[currentQuestionIndex];

  // Handle ambient sound toggling
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.toggleAmbient(nextVal);
    sound.playClick();
  };

  // 30s Countdown timer logic for the active question
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      // Time is up! Treat as incorrect trigger
      handleTimeUp();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeLeft, timerActive]);

  // Handle automatic advanced timeline countdown
  useEffect(() => {
    if (autoNextTime !== null) {
      if (autoNextTime > 0) {
        autoNextIntervalRef.current = setTimeout(() => {
          setAutoNextTime((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);
      } else {
        // Advance automatically
        handleNextQuestion();
      }
    }
    return () => {
      if (autoNextIntervalRef.current) clearTimeout(autoNextIntervalRef.current);
    };
  }, [autoNextTime]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setSelectedOption(null); // No selection
    setIsCorrect(false);
    sound.playWrong();
    
    // Start auto next countdown (4 seconds)
    setAutoNextTime(5);
  };

  const handleStartQuiz = () => {
    sound.playClick();
    // Warm up/play correct arpeggio as start chime
    setTimeout(() => sound.playCorrect(), 100);
    
    // Default name if blank
    if (!studentName.trim()) {
      setStudentName("Penjelajah Kosmis");
    }

    // Reset quiz fields
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(30);
    setAutoNextTime(null);
    setScreen("QUIZ");
    setTimerActive(true);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || timeLeft === 0) return; // Already answered

    setTimerActive(false); // Pause 30s timer
    setSelectedOption(optionIndex);
    
    const correct = optionIndex === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      sound.playCorrect();
    } else {
      sound.playWrong();
    }

    // Start auto next countdown (4 seconds)
    setAutoNextTime(5);
  };

  const handleNextQuestion = () => {
    // Clear auto timers
    if (autoNextIntervalRef.current) clearTimeout(autoNextIntervalRef.current);
    setAutoNextTime(null);

    sound.playClick();

    if (currentQuestionIndex + 1 < QUESTIONS.length) {
      setSelectedOption(null);
      setIsCorrect(null);
      setTimeLeft(30);
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimerActive(true);
    } else {
      // Finished all 20 questions!
      setTimerActive(false);
      setScreen("RESULT");
    }
  };

  const handleRetry = () => {
    handleStartQuiz();
  };

  const handleBackHome = () => {
    sound.playClick();
    setScreen("HOME");
    setSelectedOption(null);
    setIsCorrect(null);
    setTimerActive(false);
  };

  return (
    <div className="relative min-h-screen text-white font-sans flex flex-col justify-between overflow-x-hidden select-none">
      
      {/* Space Starfield Backdrop System */}
      <CosmicBackground />

      {/* Floating Ambient Synth Sound Toggle Control */}
      <div id="ambient-synth-toggle" className="fixed top-4 right-4 z-40 flex items-center gap-1.5 md:gap-3">
        <button
          onClick={handleToggleSound}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-mono font-medium tracking-wide transition-all ${
            soundEnabled 
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
              : "bg-slate-950/80 text-slate-400 border-slate-800"
          }`}
          title={soundEnabled ? "Matikan Musik Latar" : "Aktifkan Musik Latar"}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>MUSIK: AKTIF</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span>MUSIK: BISU</span>
            </>
          )}
        </button>

        {/* Floating AI Panel button when in quiz */}
        {screen === "QUIZ" && (
          <button
            id="ai-assistant-toggle"
            onClick={() => {
              sound.playClick();
              setIsAiOpen(!isAiOpen);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-mono transition-all ${
              isAiOpen
                ? "bg-purple-500/20 text-purple-400 border-purple-400"
                : "bg-slate-950/80 text-cyan-400 border-cyan-500/30 hover:border-cyan-400"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 animate-pulse" />
            <span>ASISTEN AI</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <header className="py-6 px-4 shrink-0 text-center relative z-15 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded text-[10px] font-mono font-extrabold tracking-widest text-[#050816] bg-cyan-400">ASTRONOMI</span>
            <span className="text-xs font-mono text-slate-300">MEDIA PEMBELAJARAN INTERAKTIF</span>
          </div>
          {screen === "QUIZ" && (
            <div className="text-xs font-mono bg-black/60 px-3 py-1.5 rounded-full border border-cyan-500/20">
              Siswa: <span className="font-bold text-cyan-400">{studentName}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: HOME PAGE */}
          {screen === "HOME" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl"
            >
              {/* Home main card */}
              <div className="bg-[#0b1026]/75 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.08)] flex flex-col items-center">
                
                {/* Visual decorative star/gull */}
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 text-cyan-400 animate-pulse">
                  <Compass className="w-7 h-7" />
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold font-sans tracking-tight text-center bg-gradient-to-r from-white via-cyan-300 to-purple-400 text-transparent bg-clip-text">
                  Mengenal Lubang Hitam
                </h1>
                
                <h2 className="text-md md:text-xl font-medium font-sans text-purple-300 text-center mt-2 tracking-wide">
                  Media Interaktif Pembelajaran Astronomi
                </h2>

                <p className="text-sm md:text-base text-slate-350 text-center mt-4 max-w-xl leading-relaxed opacity-95">
                  Uji pemahamanmu mengenai lubang hitam melalui kuis interaktif yang menarik. Temukan rahasia kelengkungan ruang-waktu, cakrawala peristiwa, spagetifikasi, hingga teori relativitas umum!
                </p>

                {/* Hero illustration description representation */}
                <div className="w-full mt-6 mb-8 border border-cyan-500/15 rounded-2xl overflow-hidden bg-black/50 p-4">
                  <CosmicVisualizer type="accretion" />
                  <div className="text-[11px] md:text-xs text-center text-slate-400 mt-2 italic font-mono uppercase tracking-widest">
                    "Ilustrasi 2D modern lubang hitam dengan piringan akresi bercahaya"
                  </div>
                </div>

                {/* Name registration input field */}
                <div className="w-full max-w-md bg-slate-950/80 p-5 rounded-2xl border border-cyan-500/10 mb-8 self-center">
                  <label className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2.5 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    Masukkan Nama Anda:
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="contoh: Ihwal Athayas'san"
                    className="w-full bg-[#050816] text-white border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-base placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-slate-500 font-sans mt-2">
                    * Nama akan dicetak otomatis pada Sertifikat Kelulusan Kosmik Anda.
                  </p>
                </div>

                {/* Start Button */}
                <button
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#050816] text-lg font-bold px-10 py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Mulai Kuis
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* Developer credits bento block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#0b1026]/50 backdrop-blur-sm border border-cyan-500/10 rounded-2xl p-4 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Program Studi</span>
                    <span className="text-xs font-bold text-slate-300 font-sans leading-tight block">Teknologi Pendidikan</span>
                  </div>
                </div>

                <div className="bg-[#0b1026]/50 backdrop-blur-sm border border-cyan-500/10 rounded-2xl p-4 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Pengembang</span>
                    <span className="text-xs font-bold text-slate-300 font-sans leading-tight block">Ihwal Athayas’san</span>
                    <span className="text-[9px] font-mono text-slate-400">NIM: 25690101084</span>
                  </div>
                </div>

                <div className="bg-[#0b1026]/50 backdrop-blur-sm border border-cyan-500/10 rounded-2xl p-4 flex gap-3 items-center">
                  <div className="w-9 h-9 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Gaya Visual</span>
                    <span className="text-xs font-bold text-amber-300 font-sans leading-tight block">Motion Graphic Futuristik</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* SCREEN 2: ACTIVE QUIZ PLAY */}
          {screen === "QUIZ" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              
              {/* Question visual and metadata card (Left side / 5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Question tracker & timer details */}
                <div className="bg-[#0b1026]/85 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono text-cyan-400 tracking-wider">PERTANYAAN AKTIF</span>
                    <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
                      {currentQuestionIndex + 1} / {QUESTIONS.length}
                    </span>
                  </div>

                  {/* Linear progress bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4 border border-slate-700">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-350"
                      style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                    />
                  </div>

                  {/* Countdown timer with circular color glow indicator */}
                  <div className="flex items-center justify-between bg-black/40 px-3 py-2.5 rounded-xl border border-cyan-500/5">
                    <span className="text-xs text-slate-300 font-sans flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" /> Sisa Waktu Berpikir:
                    </span>
                    <span className={`text-base font-bold font-mono px-3 py-1 rounded-md tracking-wider ${
                      timeLeft > 10 
                        ? "text-green-400 bg-green-500/10" 
                        : "text-rose-400 bg-rose-500/15 animate-pulse"
                    }`}>
                      {timeLeft} detik
                    </span>
                  </div>
                </div>

                {/* Simulation visual sandbox */}
                <div className="bg-[#0b1026]/85 backdrop-blur border border-cyan-500/20 rounded-2xl p-5 shadow-lg">
                  <CosmicVisualizer 
                    type={currentQuestion.visualType} 
                    imageCaption={currentQuestion.image_prompt} 
                  />
                </div>

              </div>

              {/* Question text & choices selection (Right side / 7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Main Question Card wrapper */}
                <div className="bg-[#0b1026]/85 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-6 md:p-8 min-h-[300px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold font-sans text-white leading-snug tracking-tight mb-6">
                      {currentQuestion.question}
                    </h3>

                    {/* Option Choices List */}
                    <div className="space-y-3.5">
                      {currentQuestion.options.map((option, index) => {
                        // Formatting styles for standard, corrected, or failed states
                        let btnStyle = "border-slate-850 hover:border-cyan-400/50 bg-slate-950/60";
                        const isAnswered = selectedOption !== null;

                        if (isAnswered) {
                          if (index === currentQuestion.answer) {
                            // Correct highlighted
                            btnStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                          } else if (selectedOption === index) {
                            // Student selected option but it was incorrect
                            btnStyle = "border-rose-500 bg-rose-950/40 text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                          } else {
                            // Dimmed
                            btnStyle = "border-slate-850 opacity-40 hover:border-slate-850";
                          }
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-xl border text-sm md:text-base font-medium font-sans leading-relaxed transition-all duration-200 flex items-center justify-between ${btnStyle} ${
                              !isAnswered ? "cursor-pointer hover:bg-slate-900/60 hover:-translate-y-0.5" : ""
                            }`}
                          >
                            <span>{option}</span>
                            {isAnswered && index === currentQuestion.answer && (
                              <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">Karakteristik Tepat</span>
                            )}
                            {isAnswered && index === selectedOption && index !== currentQuestion.answer && (
                              <span className="text-xs font-mono font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded shrink-0">Karakteristik Kurang Tepat</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation card bottom block & Skip/Next buttons */}
                  {selectedOption !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-2xl bg-slate-950/90 border border-purple-500/20"
                    >
                      <h4 className="text-xs font-mono text-purple-400 uppercase tracking-widest block mb-1.5 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" /> Penjelasan Kosmis Edukatif:
                      </h4>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                  
                  {timeLeft === 0 && selectedOption === null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-2xl bg-amber-950/20 border border-yellow-500/20"
                    >
                      <h4 className="text-xs font-mono text-yellow-400 uppercase tracking-widest block mb-1.5">
                        ⌛ Waktu Habis!
                      </h4>
                      <p className="text-xs text-yellow-300/90 font-sans">
                        Siswa tidak memilih di dalam 30 detik. Jawaban tepat adalah: <strong>{currentQuestion.options[currentQuestion.answer]}</strong>.
                      </p>
                      <p className="text-xs text-slate-350 leading-relaxed mt-2 font-sans italic border-t border-yellow-550/10 pt-2">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}

                  {/* Manual trigger for next question when answered */}
                  {(selectedOption !== null || timeLeft === 0) && (
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-cyan-500/10">
                      {autoNextTime !== null && (
                        <span className="text-[11px] font-mono text-slate-400 italic animate-pulse">
                          Mengalihkan ke soal berikut otomatis dalam {autoNextTime}s...
                        </span>
                      )}
                      <button
                        onClick={handleNextQuestion}
                        className="ml-auto bg-cyan-500 hover:bg-cyan-400 hover:border-cyan-400 border border-cyan-500/20 text-[#050816] font-bold px-6 py-2.5 rounded-lg text-xs md:text-sm tracking-wide transition-all flex items-center gap-1 shadow-lg transform active:translate-y-0.5"
                      >
                        {currentQuestionIndex + 1 === QUESTIONS.length ? "Lihat Hasil Kuis" : "Lanjut Soal Berikut"}
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </motion.div>
          )}

          {/* SCREEN 3: EVALUATION RESULTS & PRINT REPORT */}
          {screen === "RESULT" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResultPanel
                studentName={studentName}
                score={score}
                totalQuestions={QUESTIONS.length}
                onRetry={handleRetry}
                onBackHome={handleBackHome}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Floating conversational AI Sidepanel Drawer */}
      <AiAssistant
        studentName={studentName}
        isOpen={isAiOpen && screen === "QUIZ"}
        onClose={() => setIsAiOpen(false)}
        currentQuestionText={currentQuestion ? currentQuestion.question : undefined}
        currentExplanation={currentQuestion ? currentQuestion.explanation : undefined}
      />

      {/* Footer Branding Area */}
      <footer 
        id="applet-footer" 
        className="py-6 px-4 text-center shrink-0 border-t border-slate-900 bg-[#020617] relative z-10 print:hidden"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-sans">
            Media Pembelajaran Interaktif - Tema Lubang Hitam
          </p>
          <div className="text-xs text-slate-500 font-mono">
            Proyek Teknologi Pendidikan &bull; Oleh <span className="text-cyan-400 font-bold uppercase">Ihwal Athayas’san</span> (NIM: 25690101084)
          </div>
        </div>
      </footer>

    </div>
  );
}
