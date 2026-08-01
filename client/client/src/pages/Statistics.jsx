import { useEffect, useState } from "react";
import { fetchDecks } from "../services/deck.service";
import ActivityChart from "../components/charts/ActivityChart";
import CategoryChart from "../components/charts/CategoryChart";
import ProgressChart from "../components/charts/ProgressChart";
import { BarChart3, Layers, BookOpen, CheckCircle2 } from "lucide-react";

const Statistics = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatsData = async () => {
      try {
        const data = await fetchDecks();
        setDecks(data || []);
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStatsData();
  }, []);

  const categoryCount = decks.reduce((acc, deck) => {
    const cat = deck.category || "Geral";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.keys(categoryCount).map((cat) => ({
    name: cat,
    value: categoryCount[cat],
  }));

  // Replace with real backend activity endpoint when ready
  const activityData = [
    { name: "Seg", reviews: 0 },
    { name: "Ter", reviews: 0 },
    { name: "Qua", reviews: 0 },
    { name: "Qui", reviews: 0 },
    { name: "Sex", reviews: 0 },
    { name: "Sáb", reviews: 0 },
    { name: "Dom", reviews: 0 },
  ];

  const progressData = [
    { name: "Sem 1", value: 0 },
    { name: "Sem 2", value: 0 },
    { name: "Sem 3", value: 0 },
    { name: "Sem 4", value: 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <section className="rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.75)] md:p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
            <BarChart3 size={28} />
          </div>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <BarChart3 size={14} /> Estatísticas
            </div>
            <h1 className="text-3xl font-black tracking-tight">Estatísticas</h1>
            <p className="mt-2 text-sm text-slate-300">
              Métricas calculadas dinamicamente a partir da sua conta.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="group flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Baralhos Criados</p>
            <p className="mt-0.5 text-2xl font-black text-slate-900">{loading ? "..." : decks.length}</p>
          </div>
        </div>

        <div className="group flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Categorias Ativas</p>
            <p className="mt-0.5 text-2xl font-black text-slate-900">
              {loading ? "..." : Object.keys(categoryCount).length}
            </p>
          </div>
        </div>

        <div className="group flex items-center gap-4 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Status da Conta</p>
            <p className="mt-0.5 text-2xl font-black text-slate-900">Ativa</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="animate-pulse py-12 text-center text-sm font-semibold text-slate-400">Carregando métricas...</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <ActivityChart data={activityData} />
            <CategoryChart data={categoryChartData.length > 0 ? categoryChartData : [{ name: "Sem dados", value: 1 }]} />
          </div>
          <ProgressChart data={progressData} />
        </>
      )}
    </div>
  );
};

export default Statistics;