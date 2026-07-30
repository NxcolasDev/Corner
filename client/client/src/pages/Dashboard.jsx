import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboardStats } from "../services/user.service";
import { 
  Flame, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Plus, 
  Sparkles,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data.stats);
        setDecks(data.decks || []);
      } catch {
        setError("Não foi possível carregar as estatísticas.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-400">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 text-center text-rose-700 font-semibold max-w-xl mx-auto my-8 shadow-sm">
        {error}
      </div>
    );
  }

  const goalPercentage = stats?.dailyGoal
    ? Math.min((stats.reviewedToday / stats.dailyGoal) * 100, 100)
    : 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto p-6 md:p-10">
      {/* Cabeçalho de Boas-vindas com Destaque Dinâmico */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-3">
            <Sparkles size={14} /> Painel de Desempenho
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Visão Geral do Seu Progresso</h1>
          <p className="text-sm text-slate-300 mt-2 font-medium max-w-lg">
            Mantenha sua rotina de estudos atualizada e alcance a fluência com repetição espaçada.
          </p>
        </div>
        <Link
          to="/decks"
          className="relative z-10 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Novo Baralho
        </Link>
      </div>

      {/* Grid de Métricas Interativas */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Streak */}
        <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shrink-0">
            <Flame size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sequência</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {stats?.streak || 0} <span className="text-xs font-semibold text-slate-500">{stats?.streak === 1 ? "dia" : "dias"}</span>
            </p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <BookOpen size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Para Revisar</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {stats?.dueCards || 0} <span className="text-xs font-semibold text-slate-500">cards</span>
            </p>
          </div>
        </div>

        {/* Revisados Hoje */}
        <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revisados Hoje</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {stats?.reviewedToday || 0} <span className="text-xs font-semibold text-slate-500">/ {stats?.dailyGoal || 10}</span>
            </p>
          </div>
        </div>

        {/* Total Decks */}
        <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <Layers size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Baralhos</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {stats?.totalDecks || 0} <span className="text-xs font-semibold text-slate-500">({stats?.totalCards || 0} cards)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Meta Diária Estilizada */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Meta Diária de Estudo</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {stats?.reviewedToday >= stats?.dailyGoal
                  ? "🎉 Incrível! Meta diária concluída com sucesso!"
                  : `Faltam ${Math.max(0, (stats?.dailyGoal || 10) - (stats?.reviewedToday || 0))} cards para atingir seu objetivo de hoje.`}
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
            {Math.round(goalPercentage)}%
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${goalPercentage}%` }}
          />
        </div>
      </div>

      {/* Lista de Baralhos Ativos */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Seus Baralhos em Andamento</h2>
            <p className="text-xs text-slate-500 mt-0.5">Acesse rapidamente seus conjuntos mais recentes.</p>
          </div>
          <Link
            to="/decks"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Ver biblioteca completa <ArrowRight size={14} />
          </Link>
        </div>

        {decks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center space-y-4">
            <p className="text-sm text-slate-500 font-medium">Você ainda não possui baralhos cadastrados.</p>
            <Link
              to="/decks"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-500 transition shadow-md"
            >
              <Plus size={16} /> Criar Meu Primeiro Baralho
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {decks.slice(0, 6).map((deck) => (
              <div
                key={deck._id}
                className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                      {deck.category || "Geral"}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">
                    {deck.title}
                  </h3>
                  {deck.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {deck.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-400">
                    {deck.cardsCount || 0} cards
                  </span>
                  <Link
                    to={`/study/${deck._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    <Play size={13} className="fill-current" /> Estudar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;