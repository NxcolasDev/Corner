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
    <div className="space-y-6 max-w-6xl mx-auto">
      <section className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Estatísticas</h1>
            <p className="text-sm text-slate-500">Métricas calculadas dinamicamente a partir da sua conta.</p>
          </div>
        </div>
      </section>

      {/* Cards de Métricas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baralhos Criados</p>
            <p className="text-2xl font-black text-slate-900">{loading ? "..." : decks.length}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categorias Ativas</p>
            <p className="text-2xl font-black text-slate-900">
              {loading ? "..." : Object.keys(categoryCount).length}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status da Conta</p>
            <p className="text-2xl font-black text-slate-900">Ativa</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12 text-slate-400 font-semibold animate-pulse">Carregando métricas...</p>
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