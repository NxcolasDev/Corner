import { useEffect, useMemo, useState } from "react";
import { BookOpen, Clock3, Flame, Layers, Plus, Search } from "lucide-react";
import { createDeck, deleteDeck, fetchDecks, updateDeck } from "../services/deck.service";
import { fetchFlashcards } from "../services/flashcard.service";
import DeckCard from "../components/cards/DeckCard";
import DeckFormModal from "../components/forms/DeckFormModal";
import { useAuth } from "../context/useAuth";
import { getDueCards } from "../utils/format";
import {
  CornerHeroSection,
  CornerMetric,
  CornerCard,
  CornerButton,
  CornerInput,
  CornerSectionTitle,
  CornerSurface,
  CornerBadge,
} from "../components/corner";
import ProgressChart from "../components/charts/ProgressChart";
import CategoryChart from "../components/charts/CategoryChart";
import ActivityChart from "../components/charts/ActivityChart";

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
  const [deckFlashcards, setDeckFlashcards] = useState({});

  const getErrorMessage = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

  const loadDecks = async () => {
    try {
      setLoading(true);
      const decksData = await fetchDecks();
      setDecks(decksData);
      setError(null);

      const deckCards = await Promise.all(
        decksData.map(async (deck) => {
          const cards = await fetchFlashcards(deck._id);
          return [deck._id, cards];
        })
      );

      setDeckFlashcards(Object.fromEntries(deckCards));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load decks. Please refresh."));
    } finally {
      setLoading(false);
    }
  };

  // `loadDecks` is intentionally recreated with the page state; the load runs on mount only.
  useEffect(() => {
    loadDecks();
    setStreak(getDailyStreak());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const totalCards = useMemo(
    () => decks.reduce((sum, item) => sum + (item.totalCards || 0), 0),
    [decks]
  );

  const dueByDeck = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(deckFlashcards).map(([deckId, cards]) => [deckId, getDueCards(cards).length])
      ),
    [deckFlashcards]
  );

  const cardsDueToday = useMemo(
    () => Object.values(dueByDeck).reduce((sum, count) => sum + count, 0),
    [dueByDeck]
  );

  const recentDecks = useMemo(
    () =>
      [...decks]
        .sort((a, b) => {
          const aDate = new Date(a.lastStudied || a.updatedAt || a.createdAt).getTime();
          const bDate = new Date(b.lastStudied || b.updatedAt || b.createdAt).getTime();
          return bDate - aDate;
        })
        .slice(0, 3),
    [decks]
  );

  const filteredDecks = useMemo(
    () => decks.filter((deck) => deck.title.toLowerCase().includes(search.toLowerCase())),
    [decks, search]
  );

  const progressData = useMemo(() => {
    if (!decks.length) {
      return [
        { name: "Deck 1", value: 25 },
        { name: "Deck 2", value: 55 },
        { name: "Deck 3", value: 40 },
      ];
    }

    return decks.slice(0, 4).map((deck) => {
      const cards = deckFlashcards[deck._id] || [];
      const due = getDueCards(cards).length;
      const ratio = deck.totalCards ? Math.round((due / deck.totalCards) * 100) : 0;
      return {
        name: deck.title.length > 10 ? `${deck.title.slice(0, 10)}...` : deck.title,
        value: Math.min(100, Math.max(10, ratio)),
      };
    });
  }, [decks, deckFlashcards]);

  const categoryData = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };

    Object.values(deckFlashcards).flat().forEach((card) => {
      if (counts[card.difficulty] !== undefined) {
        counts[card.difficulty] += 1;
      }
    });

    return [
      { name: "Easy", value: counts.easy },
      { name: "Medium", value: counts.medium },
      { name: "Hard", value: counts.hard },
    ].filter((item) => item.value > 0);
  }, [deckFlashcards]);

  const activityData = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return {
        name: date.toLocaleDateString(undefined, { weekday: 'short' }),
        reviews: 0,
      };
    });

    Object.values(deckFlashcards)
      .flat()
      .forEach((card) => {
        const nextReview = card.nextReview ? new Date(card.nextReview) : null;
        if (!nextReview) return;

        const diffDays = Math.floor(
          (nextReview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays >= 0 && diffDays < 7) {
          days[diffDays].reviews += 1;
        }
      });

    return days;
  }, [deckFlashcards]);

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

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
    <div className="space-y-5">
      <DeckFormModal
        isOpen={isModalOpen}
        editingDeck={editingDeck}
        form={form}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
      />

      <CornerHeroSection user={user} streak={streak} dueToday={cardsDueToday} onStart={() => handleOpenModal()} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CornerMetric label="Total decks" value={decks.length} detail="Organized learning sets." icon={<BookOpen size={24} />} />
        <CornerMetric label="Flashcards" value={totalCards} detail="Cards available for review." icon={<Layers size={24} />} />
        <CornerMetric label="Due today" value={cardsDueToday} detail="Ready for your next study session." icon={<Clock3 size={24} />} variant="accent" />
        <CornerMetric label="Study streak" value={`${streak} days`} detail="Keep your momentum alive." icon={<Flame size={22} />} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ProgressChart data={progressData} />
        <ActivityChart data={activityData} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_.85fr]">
        <CornerSurface className="space-y-5 border border-slate-200/80">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CornerSectionTitle title="My Decks" subtitle="Library" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                <Search size={15} className="text-slate-400" />
                <CornerInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search decks"
                  className="h-7 w-full border-0 bg-transparent px-0 py-0 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0"
                />
              </div>
              <CornerButton onClick={() => handleOpenModal()} className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs">
                <Plus size={15} />
                New deck
              </CornerButton>
            </div>
          </div>

          {error && (
            <div className="rounded-[2rem] bg-rose-50 p-4 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="grid gap-3 lg:grid-cols-2">
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
              <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <BookOpen size={32} className="mx-auto text-slate-300" />
                <h3 className="mt-3 text-base font-bold text-slate-900">No decks found</h3>
                <CornerButton onClick={() => handleOpenModal()} className="mt-4 rounded-lg px-3 py-2 text-xs">
                  Create deck
                </CornerButton>
              </div>
            )}
          </div>
        </CornerSurface>

        <div className="space-y-4">
          <CornerCard className="border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Today’s focus</p>
                <h3 className="mt-1 text-lg font-bold text-slate-950">Review plan</h3>
              </div>
              <CornerBadge tone="info">Ready</CornerBadge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-slate-400">Due cards</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{cardsDueToday}</p>
                <p className="mt-1 text-xs text-slate-500">ready to study today</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-slate-400">Streak</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{streak} days</p>
                <p className="mt-1 text-xs text-slate-500">keep the momentum alive</p>
              </div>
            </div>
          </CornerCard>

          <CategoryChart data={categoryData} />

          <CornerCard className="border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-400">Recent decks</p>
                <h3 className="mt-1 text-lg font-bold text-slate-950">Activity overview</h3>
              </div>
              <CornerBadge tone="success">{recentDecks.length} live</CornerBadge>
            </div>
            <div className="mt-4 space-y-2">
              {recentDecks.length ? (
                recentDecks.map((deck) => (
                  <div key={deck._id} className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-950">{deck.title}</h4>
                        <p className="mt-1 text-xs text-slate-500">{deck.totalCards || 0} cards</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-600">
                        {dueByDeck[deck._id] > 0 ? "review" : "clear"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No recent decks yet.</p>
              )}
            </div>
          </CornerCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
