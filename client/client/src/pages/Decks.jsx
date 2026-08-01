import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Layers, Play, BookOpen } from "lucide-react";
import { createDeck, fetchDecks } from "../services/deck.service";
import DeckFormModal from "../components/forms/DeckFormModal";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Outros",
  imageUrl: "",
};

export default function Decks() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deckForm, setDeckForm] = useState(EMPTY_FORM);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const data = await fetchDecks();
      setDecks(data || []);
      setError("");
    } catch {
      setError("Não foi possível carregar os baralhos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const filteredDecks = decks.filter((deck) =>
    deck.title?.toLowerCase().includes(search.toLowerCase()) ||
    deck.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateDeck = async (e) => {
    e.preventDefault();

    try {
      const created = await createDeck(deckForm);
      setDecks((prev) => [created, ...prev]);
      setDeckForm(EMPTY_FORM);
      setIsModalOpen(false);
    } catch {
      setError("Não foi possível criar o baralho.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8 lg:p-10">
      <DeckFormModal
        isOpen={isModalOpen}
        editingDeck={false}
        form={deckForm}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateDeck}
        onFieldChange={(field, value) => setDeckForm((prev) => ({ ...prev, [field]: value }))}
      />

      <section className="flex flex-col justify-between gap-4 rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.75)] md:flex-row md:items-center md:p-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
            <Layers size={14} /> Biblioteca de Baralhos
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">Organize seus decks e avance no estudo</h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
            Gerencie seus conjuntos de estudo, crie novos decks e entre em sessão com um clique.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02] hover:bg-blue-500 active:scale-95"
        >
          <Plus size={18} />
          Novo Baralho
        </button>
      </section>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título ou categoria..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
        />
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse rounded-[28px] border border-slate-100 bg-white p-12 text-center text-sm font-bold text-slate-400">
          Carregando baralhos...
        </div>
      ) : filteredDecks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDecks.map((deck) => (
            <div
              key={deck._id || deck.id}
              className="group flex min-h-[220px] flex-col justify-between space-y-6 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600">
                    {deck.category || "GERAL"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-blue-600">
                  {deck.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {deck.description || "Sem descrição informada."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Layers size={15} className="text-slate-400" />
                  <span>{deck.cardsCount || 0} cards</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/decks/${deck._id || deck.id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                  >
                    Gerenciar
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate(`/study/${deck._id || deck.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-500"
                  >
                    <Play size={12} fill="currentColor" />
                    Estudar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 rounded-[28px] border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center">
          <BookOpen size={40} className="mx-auto text-slate-300" />
          <p className="text-base font-bold text-slate-700">Nenhum baralho encontrado</p>
          <p className="text-xs text-slate-400">
            Tente mudar o termo da busca ou crie um novo baralho no botão acima.
          </p>
        </div>
      )}
    </div>
  );
}