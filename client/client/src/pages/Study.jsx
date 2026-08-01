import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchFlashcards, updateFlashcard } from "../services/flashcard.service";
import { fetchDecks } from "../services/deck.service";
import { recordStudySession } from "../services/user.service";
import StudyCard from "../components/cards/StudyCard";
import { ArrowLeft, CheckCircle2, Keyboard } from "lucide-react";

const RATING_MAP = {
  again: 1,
  hard: 2,
  medium: 3,
  easy: 4,
};

const Study = () => {
  const { deckId } = useParams();
  const [deckName, setDeckName] = useState("");
  const [deckLang, setDeckLang] = useState("en-US");
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streakResult, setStreakResult] = useState(null);

  const loadFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const cards = await fetchFlashcards(deckId);
      const activeCards = cards || [];

      setFlashcards(activeCards);
      setTotalDue(activeCards.length);
      setReviewedCount(0);
      setCurrentIndex(0);
      setFlipped(false);
      setCompleted(false);

      const decks = await fetchDecks();
      const deck = decks?.find((item) => item._id === deckId);
      setDeckName(deck?.title || "Sessão de Estudos");

      if (deck?.targetLanguage) {
        setDeckLang(deck.targetLanguage);
      }
    } catch {
      setError("Não foi possível carregar os flashcards de estudo.");
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadFlashcards();
  }, [deckId, loadFlashcards]);

  const currentCard = flashcards[currentIndex];

  const speakText = useCallback((text, lang = deckLang) => {
    if ("speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  }, [deckLang]);

  const handleReview = useCallback(
    async (ratingKey) => {
      if (!currentCard) return;

      try {
        setError(null);
        const ratingScore = RATING_MAP[ratingKey] || 3;

        try {
          await updateFlashcard(currentCard._id, {
            rating: ratingScore,
            difficulty: ratingKey,
            lastReviewed: new Date().toISOString(),
          });
        } catch {
          console.warn("Falha ao salvar no servidor, avançando card localmente.");
        }

        const remainingCards = flashcards.filter((_, index) => index !== currentIndex);
        setReviewedCount((prev) => prev + 1);

        if (remainingCards.length === 0) {
          try {
            const data = await recordStudySession();
            setStreakResult(data);
          } catch (e) {
            console.error("Erro ao registrar sessão de estudo:", e);
          }
          setCompleted(true);
        } else {
          setFlashcards(remainingCards);
          setCurrentIndex((prev) => (prev >= remainingCards.length ? 0 : prev));
          setFlipped(false);
        }
      } catch {
        setError("Erro ao registrar revisão. Tente novamente.");
      }
    },
    [currentCard, currentIndex, flashcards]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((prev) => !prev);
      } else if (e.key === "1") handleReview("again");
      else if (e.key === "2") handleReview("hard");
      else if (e.key === "3") handleReview("medium");
      else if (e.key === "4") handleReview("easy");
      else if (e.key === "s" || e.key === "S") {
        speakText(flipped ? currentCard?.back : currentCard?.front);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipped, currentCard, handleReview, speakText]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm font-bold text-slate-400 animate-pulse">Carregando sessão...</p>
      </div>
    );
  }

  if (error && !flashcards.length) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 font-semibold max-w-xl mx-auto text-center">
        {error}
      </div>
    );
  }

  if (!flashcards.length && !completed) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm max-w-xl mx-auto my-8">
        <h2 className="text-2xl font-bold text-slate-900">Nenhum cartão para este deck</h2>
        <p className="mt-2 text-sm text-slate-500">Adicione flashcards a este deck antes de iniciar.</p>
        <Link
          to={`/decks/${deckId}`}
          className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-500/20"
        >
          Voltar ao Baralho
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm max-w-xl mx-auto my-8">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 text-3xl font-bold mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Sessão Concluída!</h2>
        <p className="mt-2 text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
          Você revisou todos os <span className="font-bold text-slate-800">{totalDue}</span> cartões de{" "}
          <span className="font-bold text-blue-600">"{deckName}"</span>.
        </p>

        {streakResult?.streak && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-6 py-3 text-amber-600 font-extrabold text-base">
            🔥 Sequência de {streakResult.streak} {streakResult.streak === 1 ? "dia" : "dias"} mantida!
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={`/decks/${deckId}`}
            className="rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/20"
          >
            Voltar ao Baralho
          </Link>
          <Link
            to="/dashboard"
            className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Ir ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = totalDue ? Math.min(((reviewedCount + 1) / totalDue) * 100, 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
          {error}
        </div>
      )}

      <section className="rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              to={`/decks/${deckId}`}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.24em] text-slate-400 transition hover:text-slate-700"
            >
              <ArrowLeft size={14} /> Sair do Treino
            </Link>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{deckName}</h2>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Cartão Atual</p>
              <p className="text-xl font-black text-slate-900">
                {Math.min(reviewedCount + 1, totalDue)}{" "}
                <span className="text-sm font-semibold text-slate-400">/ {totalDue}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <StudyCard
            flashcard={currentCard}
            flipped={flipped}
            onFlip={() => setFlipped((prev) => !prev)}
            onSpeak={speakText}
          />
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] md:p-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Grau de Dificuldade
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              Qual foi a facilidade para lembrar da resposta?
            </p>

            <div className="grid gap-2.5">
              <button
                type="button"
                onClick={() => handleReview("again")}
                className="group flex w-full items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/60 p-3.5 text-left transition hover:bg-rose-100 active:scale-95"
              >
                <div>
                  <span className="block text-sm font-bold text-rose-800">De novo</span>
                  <span className="block text-[11px] text-rose-600/80">Errei / Revisar logo</span>
                </div>
                <span className="rounded-lg bg-rose-200/60 px-2 py-1 text-xs font-bold text-rose-800">1</span>
              </button>

              <button
                type="button"
                onClick={() => handleReview("hard")}
                className="group flex w-full items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-left transition hover:bg-amber-100 active:scale-95"
              >
                <div>
                  <span className="block text-sm font-bold text-amber-900">Difícil</span>
                  <span className="block text-[11px] text-amber-700/80">Com esforço</span>
                </div>
                <span className="rounded-lg bg-amber-200/60 px-2 py-1 text-xs font-bold text-amber-900">2</span>
              </button>

              <button
                type="button"
                onClick={() => handleReview("medium")}
                className="group flex w-full items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 text-left transition hover:bg-blue-100 active:scale-95"
              >
                <div>
                  <span className="block text-sm font-bold text-blue-900">Bom</span>
                  <span className="block text-[11px] text-blue-700/80">Intervalo normal</span>
                </div>
                <span className="rounded-lg bg-blue-200/60 px-2 py-1 text-xs font-bold text-blue-900">3</span>
              </button>

              <button
                type="button"
                onClick={() => handleReview("easy")}
                className="group flex w-full items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-left transition hover:bg-emerald-100 active:scale-95"
              >
                <div>
                  <span className="block text-sm font-bold text-emerald-900">Fácil</span>
                  <span className="block text-[11px] text-emerald-700/80">Lembrei instantaneamente</span>
                </div>
                <span className="rounded-lg bg-emerald-200/60 px-2 py-1 text-xs font-bold text-emerald-900">4</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-[28px] border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-500 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)]">
            <Keyboard size={18} className="mt-0.5 shrink-0 text-slate-400" />
            <div>
              <p className="mb-0.5 font-bold text-slate-700">Atalhos:</p>
              <p>
                <code className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-800">Espaço</code> virar |{" "}
                <code className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-800">1-4</code> avaliar |{" "}
                <code className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-800">S</code> áudio
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Study;