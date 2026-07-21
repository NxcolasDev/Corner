import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchDecks, updateDeck, deleteDeck } from "../services/deck.service";
import {
  createFlashcard,
  deleteFlashcard,
  fetchFlashcards,
  updateFlashcard,
} from "../services/flashcard.service";
import FlashcardRow from "../components/cards/FlashcardRow";
import { formatDate, getDueCards } from "../utils/format";

const DeckDetails = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDeck, setEditingDeck] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [deckForm, setDeckForm] = useState({ title: "", description: "" });
  const [cardForm, setCardForm] = useState({ front: "", back: "", tags: "", difficulty: "medium" });
  const [error, setError] = useState(null);

  const dueFlashcards = getDueCards(flashcards);

  const loadDeck = async () => {
    try {
      setLoading(true);
      const decks = await fetchDecks();
      const selectedDeck = decks.find((item) => item._id === deckId);
      const cards = await fetchFlashcards(deckId);

      if (!selectedDeck) {
        setError("Deck not found.");
        return;
      }

      setDeck(selectedDeck);
      setFlashcards(cards);
    } catch {
      setError("Unable to load deck data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  const handleSaveDeck = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateDeck(deckId, deckForm);
      setDeck(updated);
      setEditingDeck(false);
    } catch {
      setError("Unable to save deck.");
    }
  };

  const handleDeleteDeck = async () => {
    if (!window.confirm("Delete this deck?")) return;
    try {
      await deleteDeck(deckId);
      navigate("/dashboard");
    } catch {
      setError("Unable to delete deck.");
    }
  };

  const handleCreateOrUpdateCard = async (e) => {
    e.preventDefault();
    const payload = {
      front: cardForm.front,
      back: cardForm.back,
      tags: cardForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      difficulty: cardForm.difficulty,
    };

    try {
      if (editingFlashcard) {
        const updated = await updateFlashcard(editingFlashcard._id, payload);
        setFlashcards((prev) => prev.map((card) => (card._id === updated._id ? updated : card)));
        setEditingFlashcard(null);
      } else {
        const created = await createFlashcard(deckId, payload);
        setFlashcards((prev) => [created, ...prev]);
      }
      setCardForm({ front: "", back: "", tags: "", difficulty: "medium" });
      await loadDeck();
    } catch {
      setError("Unable to save flashcard.");
    }
  };

  const handleFlashcardEdit = (flashcard) => {
    setEditingFlashcard(flashcard);
    setCardForm({
      front: flashcard.front,
      back: flashcard.back,
      tags: flashcard.tags?.join(", ") || "",
      difficulty: flashcard.difficulty,
    });
  };

  const handleFlashcardDelete = async (flashcard) => {
    if (!window.confirm("Delete this flashcard?")) return;
    try {
      await deleteFlashcard(flashcard._id);
      setFlashcards((prev) => prev.filter((item) => item._id !== flashcard._id));
      await loadDeck();
    } catch {
      setError("Unable to delete flashcard.");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading deck...</div>;
  if (!deck) return <div className="p-8 text-center text-rose-500">Deck not found.</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8">
        <Link to="/dashboard" className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 hover:text-blue-700">
          ← Back to decks
        </Link>
        <div className="mt-4 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-950 md:text-4xl">{deck.title}</h2>
            <p className="mt-2 text-slate-500">{deck.description || "No description provided."}</p>
          </div>
          <div className="flex gap-3">
            <Link to={`/study/${deckId}`} className="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
              Start study session
            </Link>
            <button onClick={() => setEditingDeck(true)} className="rounded-2xl border px-5 py-3 font-semibold text-slate-700">
              Edit
            </button>
            <button onClick={handleDeleteDeck} className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-semibold text-rose-700">
              Delete
            </button>
          </div>
        </div>
      </section>

      {error && <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.95fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <h3 className="text-xl font-bold text-slate-950 mb-6">Flashcards ({flashcards.length})</h3>
          <div className="space-y-4">
            {flashcards.length ? (
              flashcards.map((card) => (
                <FlashcardRow key={card._id} flashcard={card} onDelete={handleFlashcardDelete} onUpdate={handleFlashcardEdit} />
              ))
            ) : (
              <p className="text-slate-500">No flashcards in this deck yet.</p>
            )}
          </div>
        </div>

        <aside className="rounded-[2rem] bg-slate-50 p-6 shadow-sm md:p-8">
          <h3 className="text-xl font-bold text-slate-950">{editingFlashcard ? "Edit flashcard" : "Add flashcard"}</h3>
          <form className="mt-6 space-y-4" onSubmit={handleCreateOrUpdateCard}>
            <div>
              <label className="text-sm font-semibold text-slate-700">Front</label>
              <textarea
                value={cardForm.front}
                onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                required
                rows={3}
                className="mt-2 w-full rounded-xl border p-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Back</label>
              <textarea
                value={cardForm.back}
                onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                required
                rows={3}
                className="mt-2 w-full rounded-xl border p-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Tags</label>
              <input
                type="text"
                value={cardForm.tags}
                onChange={(e) => setCardForm({ ...cardForm, tags: e.target.value })}
                className="mt-2 w-full rounded-xl border p-3 text-sm"
              />
            </div>
            <button type="submit" className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700">
              {editingFlashcard ? "Save changes" : "Add flashcard"}
            </button>
          </form>
        </aside>
      </section>
    </div>
  );
};

export default DeckDetails;