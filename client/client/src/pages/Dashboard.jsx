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

  const dailyGoal = stats?.dailyGoal ?? 10;
  const reviewedToday = stats?.reviewedToday ?? 0;
  const goalPercentage = dailyGoal
    ? Math.min((reviewedToday / dailyGoal) * 100, 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8 lg:p-10">
      {/* Cabeçalho de Boas-vindas com Destaque Dinâmico */}
      <div className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.75)] md:flex-row md:items-center md:p-8">
        <div className="absolute -right-8 -top-8 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
            <Sparkles size={14} /> Painel de Desempenho
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Visão Geral do Seu Progresso</h1>
          <p className="mt-2 max-w-lg text-sm font-medium text-slate-300">
            Mantenha sua rotina de estudos atualizada e alcance a fluência com repetição espaçada.
          </p>
        </div>
        <Link
          to="/decks"
          className="relative z-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] hover:bg-blue-500 active:scale-95"
        >
          <Plus size={18} /> Novo Baralho
        </Link>
      </div>

      {/* Grid de Métricas Interativas */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Streak */}
        <div className="group flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-500 transition-colors duration-300 group-hover:bg-amber-500 group-hover:text-white">
            <Flame size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Sequência</p>
            <p className="mt-0.5 text-2xl font-black text-slate-900">
              {stats?.streak || 0} <span className="text-xs font-semibold text-slate-500">{stats?.streak === 1 ? "dia" : "dias"}</span>
            </p>
          </div>
        </div>

        {/* Pendentes */}
        <div className="group flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
            <BookOpen size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Para Revisar</p>
            <p className="mt-0.5 text-2xl font-black text-slate-900">
              {stats?.dueCards || 0} <span className="text-xs font-semibold text-slate-500">cards</span>
            </p>
          </div>
        </div>

        {/* Revisados Hoje */}
        <div className="group flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Revisados Hoje</p>
            <p className="mt-0.5 text-2xl font-black text-slate-900">
              {reviewedToday} <span className="text-xs font-semibold text-slate-500">/ {dailyGoal}</span>
            </p>
          </div>
        </div>

        {/* Total Decks */}
        <div className="group flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-purple-50 text-purple-600 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
            <Layers size={26} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Baralhos</p>
            <p className="mt-0.5 text-2xl font-black text-slate-900">
              {stats?.totalDecks || 0} <span className="text-xs font-semibold text-slate-500">({stats?.totalCards || 0} cards)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Meta Diária Estilizada */}
      <div className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Meta Diária de Estudo</h3>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                {reviewedToday >= dailyGoal
                  ? "🎉 Incrível! Meta diária concluída com sucesso!"
                  : `Faltam ${Math.max(0, dailyGoal - reviewedToday)} cards para atingir seu objetivo de hoje.`}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-600">
            {Math.round(goalPercentage)}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-slate-200/60 bg-slate-100 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${goalPercentage}%` }}
          />
        </div>
      </div>

      {/* Lista de Baralhos Ativos */}
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Seus Baralhos em Andamento</h2>
            <p className="mt-0.5 text-xs text-slate-500">Acesse rapidamente seus conjuntos mais recentes.</p>
          </div>
          <Link
            to="/decks"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-700"
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {decks.slice(0, 6).map((deck) => (
              <div
                key={deck._id}
                className="group flex min-h-[220px] flex-col justify-between space-y-5 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-600">
                      {deck.category || "Geral"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-blue-600">
                    {deck.title}
                  </h3>
                  {deck.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {deck.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-medium text-slate-400">
                    {deck.cardsCount || 0} cards
                  </span>
                  <Link
                    to={`/study/${deck._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
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