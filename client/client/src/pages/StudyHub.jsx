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
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      {/* Banner Principal de Ação */}
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-lg shadow-blue-500/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <Flame size={14} className="text-amber-300" /> Meta Diária de Revisão
          </div>
          <h1 className="text-3xl font-black">Pronto para a sessão de hoje?</h1>
          <p className="text-sm text-blue-100 max-w-md">
            Estudar um pouco todos os dias melhora a retenção no longo prazo graças à repetição espaçada.
          </p>
        </div>

        {firstDeckId && (
          <Link
            to={`/study/${firstDeckId}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-blue-600 shadow-md hover:bg-blue-50 transition shrink-0"
          >
            <Play size={16} fill="currentColor" /> Iniciar Sessão Rápida
          </Link>
        )}
      </section>

      {/* Lista de Baralhos Prontos para Estudo */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Escolha o que deseja praticar</h2>

        {loading ? (
          <p className="text-center py-12 text-slate-400 font-semibold animate-pulse">
            Buscando sessões pendentes...
          </p>
        ) : decks.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm space-y-3">
            <GraduationCap size={44} className="mx-auto text-slate-300" />
            <h3 className="text-lg font-bold text-slate-800">Nenhum baralho criado ainda</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vá até a biblioteca de Baralhos para criar seu primeiro deck antes de começar a praticar.
            </p>
            <Link
              to="/decks"
              className="inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500"
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
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        {deck.category || "Estudo"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock size={12} /> Pronto para treino
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{deck.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {deck.description || "Inicie para revisar seus flashcards cadastrados."}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-500" /> Repetição espaçada
                    </span>
                    <Link
                      to={`/study/${deckId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
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