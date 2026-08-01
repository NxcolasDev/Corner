import { useState } from "react";
import { StickyNote, Save } from "lucide-react";

const Notes = () => {
  const [note, setNote] = useState(() => localStorage.getItem("corner-study-notes") || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("corner-study-notes", note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <section className="flex flex-col justify-between gap-4 rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.75)] md:flex-row md:items-center md:p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600">
            <StickyNote size={28} />
          </div>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <StickyNote size={14} /> Bloco de Anotações
            </div>
            <h1 className="text-3xl font-black tracking-tight">Anotações do Estudante</h1>
            <p className="mt-2 text-sm text-slate-300">
              Espaço livre para gramática, rascunhos e vocabulário.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
        >
          <Save size={16} /> {saved ? "Salvo!" : "Salvar Notas"}
        </button>
      </section>

      <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] md:p-6">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escreva aqui suas anotações rápidas, regras de gramática ou frases para revisar..."
          className="h-96 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>
    </div>
  );
};

export default Notes;