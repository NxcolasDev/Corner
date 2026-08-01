import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDecks } from "../services/deck.service";
import { GraduationCap, Play, Clock, Flame, CheckCircle2 } from "lucide-react";

const StudyHub = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDecks();
        setDecks(data || []);
      } catch (err) {
        console.error("Erro ao carregar baralhos para treino:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const firstDeckId = decks[0]?._id || decks[0]?.id;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <section className="flex flex-col justify-between gap-6 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-[0_24px_80px_-40px_rgba(37,99,235,0.8)] md:flex-row md:items-center md:p-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <Flame size={14} className="text-amber-300" /> Meta Diária de Revisão
          </div>
          <h1 className="text-3xl font-black">Pronto para a sessão de hoje?</h1>
          <p className="max-w-md text-sm text-blue-100">
            Estudar um pouco todos os dias melhora a retenção no longo prazo graças à repetição espaçada.
          </p>
        </div>

        {firstDeckId && (
          <Link
            to={`/study/${firstDeckId}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-blue-600 shadow-md transition hover:bg-blue-50"
          >
            <Play size={16} fill="currentColor" /> Iniciar Sessão Rápida
          </Link>
        )}
      </section>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Escolha o que deseja praticar</h2>

        {loading ? (
          <p className="animate-pulse py-12 text-center text-sm font-semibold text-slate-400">
            Buscando sessões pendentes...
          </p>
        ) : decks.length === 0 ? (
          <div className="space-y-3 rounded-[28px] border border-slate-100 bg-white p-12 text-center shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)]">
            <GraduationCap size={44} className="mx-auto text-slate-300" />
            <h3 className="text-lg font-bold text-slate-800">Nenhum baralho criado ainda</h3>
            <p className="mx-auto max-w-sm text-xs text-slate-500">
              Vá até a biblioteca de Baralhos para criar seu primeiro deck antes de começar a praticar.
            </p>
            <Link
              to="/decks"
              className="inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
            >
              Ir para Baralhos
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {decks.map((deck) => {
              const deckId = deck._id || deck.id;
              return (
                <div
                  key={deckId}
                  className="flex min-h-[220px] flex-col justify-between rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
                        {deck.category || "Estudo"}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                        <Clock size={12} /> Pronto para treino
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{deck.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {deck.description || "Inicie para revisar seus flashcards cadastrados."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <CheckCircle2 size={14} className="text-emerald-500" /> Repetição espaçada
                    </span>
                    <Link
                      to={`/study/${deckId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
                    >
                      Estudar Agora <Play size={12} fill="currentColor" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyHub;