import React, { useEffect, useState } from "react";
import { sound } from "../lib/sound";
import { motion } from "motion/react";
import { Trophy, Award, RefreshCw, Home, Sparkles, CheckCircle2, XCircle, Printer } from "lucide-react";

interface Props {
  studentName: string;
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onBackHome: () => void;
}

export default function ResultPanel({
  studentName,
  score,
  totalQuestions,
  onRetry,
  onBackHome,
}: Props) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const correctCount = score;
  const wrongCount = totalQuestions - score;

  // Compute Badge and Title based on scoring rubric in user JSON
  const getRanking = (pct: number) => {
    if (pct === 100) return "🌟 Ahli Astronomi Muda";
    if (pct >= 90) return "🏆 Sangat Baik";
    if (pct >= 75) return "🥇 Baik";
    if (pct >= 60) return "🥈 Cukup";
    return "📚 Perlu Belajar Lagi";
  };

  const getCelebrationMessage = (pct: number) => {
    if (pct === 100) return "Luar Biasa! Pemahaman sempurna tentang gaya fisika lubang hitam!";
    if (pct >= 75) return "Hebat sekali! Anda memiliki bakat tinggi dalam bidang astronomi kosmis!";
    if (pct >= 60) return "Kerja bagus! Teruskan mempelajari rahasia cakrawala peristiwa.";
    return "Mari terus belajar! Ruang angkasa luas penuh rahasia menanti Anda jelajahi.";
  };

  const rankBadge = getRanking(percentage);

  // Play result sound on mount
  useEffect(() => {
    if (percentage >= 75) {
      sound.playCorrect();
      // Spark extra delayed correct arpeggios
      const t1 = setTimeout(() => sound.playCorrect(), 300);
      const t2 = setTimeout(() => sound.playCorrect(), 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      sound.playWrong();
    }
  }, [percentage]);

  const triggerPrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div id="result-container" className="w-full max-w-3xl mx-auto p-4 md:p-6 text-white text-center">
      
      {/* Animated Greeting Card Header */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="inline-block p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4 animate-bounce">
          <Trophy className="w-16 h-16 text-cyan-400" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans text-cyan-300">
          Evaluasi Selesai!
        </h1>
        <p className="text-slate-400 mt-2 font-sans max-w-md mx-auto">
          {getCelebrationMessage(percentage)}
        </p>
      </motion.div>

      {/* Grid of Tallies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        {/* Score Percentage Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0b1026]/80 backdrop-blur border border-cyan-500/20 rounded-2xl p-6"
        >
          <span className="text-xs font-mono text-cyan-400 block tracking-wider">SKOR AKHIR</span>
          <div className="text-5xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mt-2">
            {percentage}%
          </div>
          <p className="text-xs text-slate-400 mt-2 font-sans font-medium">
            ({score} dari {totalQuestions} pertanyaan benar)
          </p>
        </motion.div>

        {/* Breakdown Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0b1026]/80 backdrop-blur border border-cyan-500/20 rounded-2xl p-6 flex flex-col justify-center gap-3"
        >
          <div className="flex justify-between items-center bg-black/40 px-4 py-2.5 rounded-xl border border-emerald-500/20">
            <span className="text-xs font-sans text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Benar
            </span>
            <span className="text-base font-bold font-mono text-emerald-400">{correctCount}</span>
          </div>
          <div className="flex justify-between items-center bg-black/40 px-4 py-2.5 rounded-xl border border-rose-500/20">
            <span className="text-xs font-sans text-slate-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" /> Salah
            </span>
            <span className="text-base font-bold font-mono text-rose-400">{wrongCount}</span>
          </div>
        </motion.div>

        {/* Badge Ranking Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0b1026]/80 backdrop-blur border border-purple-500/20 rounded-2xl p-6 flex flex-col justify-center items-center"
        >
          <span className="text-xs font-mono text-purple-400 block tracking-wider">PRESTASI KEPANGKATAN</span>
          <div className="text-base font-bold font-sans text-amber-300 bg-amber-500/10 border border-amber-500/30 px-4 py-2.5 rounded-xl mt-3 text-center tracking-wide shadow-inner">
            {rankBadge}
          </div>
        </motion.div>
      </div>

      {/* Holographic Certificate Badge (Tech Edu Printout layout) */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        id="printable-certificate"
        className="relative bg-slate-950 p-6 md:p-8 rounded-3xl border-4 border-double border-amber-600/50 shadow-2xl max-w-2xl mx-auto my-8 overflow-hidden print:bg-white print:text-black print:border-black print:shadow-none bg-[radial-gradient(#1e1e38_1px,transparent_1px)] [background-size:24px_24px]"
      >
        {/* Abstract orbital lines for Certificate design */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border border-purple-500/10 pointer-events-none" />
        
        <div className="flex flex-col items-center">
          <Award className="w-12 h-12 text-amber-500 mb-3" />
          <span className="text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase">Sertifikat Kelulusan Kosmik</span>
          
          <h2 className="text-xl md:text-2xl font-serif text-amber-300 font-extrabold mt-4 tracking-wide print:text-black">
            LUBANG HITAM BELAJAR INTERAKTIF
          </h2>
          
          <div className="w-16 h-[1.5px] bg-gradient-to-r from-orange-500 to-amber-500 my-4" />
          
          <p className="text-slate-400 text-xs md:text-sm font-sans italic my-2 print:text-neutral-600">
            Diberikan sebagai tanda apresiasi kelulusan kuis kepada:
          </p>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide font-sans underline underline-offset-8 decoration-amber-500/40 my-3 print:text-black">
            {studentName || "Penjelajah Kosmis Tanpa Nama"}
          </h3>

          <p className="text-xs text-slate-300 max-w-md my-3 leading-relaxed print:text-neutral-700">
            Telah menyelesaikan evaluasi pembelajaran komprehensif mengenai mekanika astrofisika <strong>Mengenal Lubang Hitam</strong> dengan rata-rata tingkat ketepatan <strong>{percentage}% ({score}/{totalQuestions})</strong> dan menyandang gelar kehormatan akademis:
          </p>

          <span className="text-sm font-bold font-mono text-amber-300 tracking-widest bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded mt-2 uppercase print:text-black">
            {rankBadge}
          </span>

          <div className="flex justify-between items-end w-full mt-8 pt-6 border-t border-slate-850 print:border-neutral-300">
            <div className="text-left">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Media Pengembangan</span>
              <span className="text-xs font-sans text-cyan-400 font-bold print:text-black">Ihwal Athayas’san</span>
              <span className="text-[9px] font-mono text-slate-400 block">NIM: 25690101084</span>
            </div>
            
            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Teknologi Pendidikan</span>
              <span className="text-xs font-sans text-purple-400 font-bold print:text-black">Astronomi Interaktif</span>
              <span className="text-[9px] font-mono text-slate-400 block">{new Date().toLocaleDateString("id-ID")}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Button controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        <button
          onClick={triggerPrint}
          className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-5 py-3 rounded-xl transition-all inline-flex items-center gap-2 text-sm font-medium tracking-wide shadow-lg hover:border-slate-500"
        >
          <Printer className="w-4 h-4" /> Cetak Sertifikat
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onRetry();
          }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-500/30 hover:border-purple-400/50 text-white font-semibold px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2 text-sm tracking-wide shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <RefreshCw className="w-4 h-4" /> {onRetry ? "Ulangi Kuis" : "Retry"}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onBackHome();
          }}
          className="bg-slate-950/80 hover:bg-slate-900 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 px-5 py-3 rounded-xl transition-all inline-flex items-center gap-2 text-sm tracking-wide shadow-lg font-medium cursor-pointer"
        >
          <Home className="w-4 h-4" /> Beranda
        </button>
      </div>

    </div>
  );
}
