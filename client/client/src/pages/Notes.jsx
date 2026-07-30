import { useState, useEffect } from "react";
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <StickyNote size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Anotações do Estudante</h1>
            <p className="text-sm text-slate-500">Espaço livre para gramática, rascunhos e vocabulário.</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-500 transition shadow-md shadow-blue-500/20"
        >
          <Save size={16} /> {saved ? "Salvo!" : "Salvar Notas"}
        </button>
      </section>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escreva aqui suas anotações rápidas, regras de gramática ou frases para revisar..."
          className="w-full h-96 resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
        />
      </div>
    </div>
  );
};

export default Notes;