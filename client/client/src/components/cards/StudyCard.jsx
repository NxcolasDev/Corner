import StudyCard from "../components/cards/StudyCard";

const StudyCard = ({ flashcard, flipped, onFlip }) => {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-pressed={flipped}
      aria-label={flipped ? "Show question" : "Show answer"}
      className={`study-card relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 text-left shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)] focus:outline-none focus:ring-4 focus:ring-blue-200 md:p-12 ${flipped ? 'is-flipped' : ''}`}
    >
      <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-blue-600" />
      <div className="flip-inner card-inner min-h-[360px] md:min-h-[460px] flex items-center justify-center">
        <div className="flip-face flip-front relative flex flex-col items-center gap-6 text-center px-6">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Question
          </div>
          <p className="max-w-2xl text-balance text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
            {flashcard?.front}
          </p>
          <p className="text-sm font-medium text-slate-500">Tap or press Enter to flip</p>
        </div>

        <div className="flip-face flip-back relative flex flex-col items-center gap-6 text-center px-6">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Answer
          </div>
          <p className="max-w-2xl text-balance text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
            {flashcard?.back}
          </p>
          <p className="text-sm font-medium text-slate-500">Tap or press Enter to flip back</p>
        </div>
      </div>
    </button>
  );
};

export default StudyCard;
