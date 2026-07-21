import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchFlashcards, updateFlashcard } from "../services/flashcard.service";
import { fetchDecks } from "../services/deck.service";
import StudyCard from "../components/cards/StudyCard";
import { getDueCards } from "../utils/format";
import Button from "../components/ui/Button";

const Study = () => {
  const { deckId } = useParams();
  const [deckName, setDeckName] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cards = await fetchFlashcards(deckId);
      const dueCards = getDueCards(cards);
      
      setFlashcards(dueCards);
      setTotalDue(dueCards.length);
      setReviewedCount(0);
      setCurrentIndex(0);
      setFlipped(false);
      setCompleted(false);

      const decks = await fetchDecks();
      const deck = decks.find((item) => item._id === deckId);
      setDeckName(deck?.title || "Study session");
    } catch {
      setError("Unable to load study cards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reload only when the routed deck changes.
  useEffect(() => {
    loadFlashcards();
  }, [deckId]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentCard = flashcards[currentIndex];

  const handleReview = async (rating) => {
    if (!currentCard) return;

    try {
      await updateFlashcard(currentCard._id, { rating });
      
      const remainingCards = flashcards.filter((_, index) => index !== currentIndex);
      setReviewedCount((prev) => prev + 1);

      if (remainingCards.length === 0) {
        setCompleted(true);
      } else {
        setFlashcards(remainingCards);
        // Keep index bounded to remaining array length
        setCurrentIndex((prev) => (prev >= remainingCards.length ? 0 : prev));
        setFlipped(false);
      }
    } catch {
      setError("Unable to record review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm shadow-slate-200/70">
        Preparing study deck...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-rose-700 shadow-sm shadow-slate-200/70">
        {error}
      </div>
    );
  }

  if (!flashcards.length && !completed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
        <h2 className="text-2xl font-bold text-slate-950">No cards ready to study yet</h2>
        <p className="mt-3 text-sm text-slate-500">Add flashcards to this deck before starting a session.</p>
        <Link
          to={`/decks/${deckId}`}
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Go back to deck
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm shadow-slate-200/70">
        <h2 className="text-3xl font-bold text-slate-950">Session complete</h2>
        <p className="mt-4 text-sm text-slate-500">
          You reviewed all {totalDue} cards in "{deckName}".
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to={`/decks/${deckId}`}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Return to deck
          </Link>
          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm shadow-slate-200/70 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
              Study session
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">{deckName}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Flip the card, rate your recall, and move cleanly through the deck.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-50 p-5 text-slate-700 shadow-sm shadow-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Progress</p>
            <p className="mt-3 text-4xl font-black text-slate-950">
              {Math.min(reviewedCount + 1, totalDue)}/{totalDue}
            </p>
            <p className="mt-2 text-sm text-slate-500">cards in this session</p>
          </div>
        </div>

        <div className="mt-6 rounded-full bg-slate-100 p-1">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 transition-all duration-500"
            style={{ width: `${totalDue ? ((Math.min(reviewedCount + 1, totalDue) / totalDue) * 100) : 0}%` }}
          />
        </div>

        <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5 shadow-sm shadow-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Session overview
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Deck</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{deckName}</p>
            </div>
            <div className="rounded-3xl bg-white p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Remaining</p>
              <p className="mt-2 text-lg font-bold text-slate-950">{totalDue - reviewedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr]">
        <StudyCard flashcard={currentCard} flipped={flipped} onFlip={() => setFlipped((prev) => !prev)} />

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/70">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">How did it feel?</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button aria-label="Again - 5 minutes" onClick={() => handleReview("again")} variant="rating" color="again" className="w-full text-left">
              Again
              <span className="block text-xs font-medium text-slate-500">5 minutes</span>
            </Button>
            <Button aria-label="Hard - short interval" onClick={() => handleReview("hard")} variant="rating" color="hard" className="w-full text-left">
              Hard
              <span className="block text-xs font-medium text-slate-500">Short interval</span>
            </Button>
            <Button aria-label="Good - normal interval" onClick={() => handleReview("medium")} variant="rating" color="medium" className="w-full text-left">
              Good
              <span className="block text-xs font-medium text-slate-500">Normal interval</span>
            </Button>
            <Button aria-label="Easy - long interval" onClick={() => handleReview("easy")} variant="rating" color="easy" className="w-full text-left">
              Easy
              <span className="block text-xs font-medium text-slate-500">Long interval</span>
            </Button>
          </div>

          <div className="mt-6 rounded-[1.75rem] bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm shadow-slate-200">
            Use the rating buttons to capture recall confidence and keep the session moving. Your choices help the app space review intelligently.
          </div>
        </div>
      </section>
    </div>
  );
};

export default Study;
