import { useEffect, useMemo, useState } from "react";
import { Library, Plus, Search } from "lucide-react";
import { createDeck, deleteDeck, fetchDecks, updateDeck } from "../services/deck.service";
import { fetchFlashcards } from "../services/flashcard.service";
import DeckCard from "../components/cards/DeckCard";import { useAuth } from "../context/AuthContext";
import { getDueCards } from "../utils/format";

const Dashboard = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingDeck, setEditingDeck] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streak, setStreak] = useState(1);
  const [error, setError] = useState(null);
  const [dueByDeck, setDueByDeck] = useState({});

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

  const loadDecks = async () => {
    try {
      setLoading(true);
      const decksData = await fetchDecks();
      setDecks(decksData);
      setError(null);

      const dueEntries = await Promise.all(
        decksData.map(async (deck) => {
          const cards = await fetchFlashcards(deck._id);
          return [deck._id, getDueCards(cards).length];
        })
      );
      setDueByDeck(Object.fromEntries(dueEntries));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load decks. Please refresh."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
    setStreak(getDailyStreak());
  }, []);

  const getDailyStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = JSON.parse(localStorage.getItem("corner-streak") || "null");
    
    if (!saved) {
      const next = { days: 1, lastVisit: today };
      localStorage.setItem("corner-streak", JSON.stringify(next));
      return 1;
    }

    if (saved.lastVisit === today) return saved.days;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const days = saved.lastVisit === yesterday ? saved.days + 1 : 1;
    localStorage.setItem("corner-streak", JSON.stringify({ days, lastVisit: today }));
    return days;
  };

  const totalCards = useMemo(
    () => decks.reduce((sum, item) => sum + (item.totalCards || 0), 0),
    [decks]
  );

  const cardsDueToday = useMemo(
    () => Object.values(dueByDeck).reduce((sum, count) => sum + count, 0),
    [dueByDeck]
  );

  const recentDecks = useMemo(() => decks.slice(0, 3), [decks]);
  const filteredDecks = useMemo(
    () => decks.filter((deck) => deck.title.toLowerCase().includes(search.toLowerCase())),
    [decks, search]
  );

  const handleOpenModal = (deck = null) => {
    if (deck) {
      setEditingDeck(deck);
      setForm({ title: deck.title, description: deck.description || "" });
    } else {
      setEditingDeck(null);
      setForm({ title: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeck(null);
    setForm({ title: "", description: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;

    try {
      setError(null);
      if (editingDeck) {
        await updateDeck(editingDeck._id, form);
      } else {
        await createDeck(form);
      }
      handleCloseModal();
      await loadDecks();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save deck. Please try again."));
    }
  };

  const handleDelete = async (deck) => {
    if (!window.confirm(`Delete ${deck.title}?`)) return;
    try {
      await deleteDeck(deck._id);
      await loadDecks();
    } catch {
      setError("Unable to delete deck. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                  Corner
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {editingDeck ? "Edit Deck" : "Create Deck"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
              >
                {editingDeck ? "Save Changes" : "Create Deck"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-2xl shadow-slate-900/30 md:px-10 md:py-12">
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-300">Welcome back</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Hi, {user?.username}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">Continue your learning journey, review your flashcards and build long-term memory every day.</p>
          </div>

          <div className="w-60 rounded-3xl bg-white/10 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Streak</p>
            <p className="mt-2 text-6xl font-black">{streak}</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">days in a row</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-slate-400">Total Decks</p>
            <h2 className="mt-3 text-5xl font-black">{decks.length}</h2>
          </div>
          <div className="rounded-3xl bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-slate-400">Flashcards</p>
            <h2 className="mt-3 text-5xl font-black">{totalCards}</h2>
          </div>
          <div className="rounded-3xl bg-blue-600 p-6 shadow-xl">
            <p className="text-sm text-blue-100">Due Today</p>
            <h2 className="mt-3 text-5xl font-black text-white">{cardsDueToday}</h2>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Library</p>
                <h2 className="mt-2 text-3xl font-black text-slate-900">My Decks</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-44 bg-transparent text-sm outline-none"
                  />
                </div>

                <button
                  onClick={() => handleOpenModal()}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {error && <div className="mb-4 rounded-3xl bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}

            <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
              {loading ? (
                <p className="col-span-full text-sm text-slate-500">Loading decks...</p>
              ) : filteredDecks.length ? (
                filteredDecks.map((deck) => (
                  <DeckCard
                    key={deck._id}
                    deck={deck}
                    dueCount={dueByDeck[deck._id] || 0}
                    onDelete={handleDelete}
                    onEdit={(d) => handleOpenModal(d)}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <Library size={48} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-lg font-bold text-slate-900">No decks found</h3>
                  <button
                    onClick={() => handleOpenModal()}
                    className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Create Deck
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-slate-50 p-6 shadow-sm md:p-8">
            <h3 className="text-xl font-bold text-slate-950">Recently Updated</h3>
            <div className="mt-6 space-y-3">
              {recentDecks.length ? (
                recentDecks.map((deck) => (
                  <div key={deck._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-950">{deck.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{deck.totalCards || 0} flashcards</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recent decks.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Dashboard;