const StudyCard = ({ flashcard, flipped, onFlip }) => {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-pressed={flipped}
      aria-label={flipped ? "Show question" : "Show answer"}
      className={`study-card relative mx-auto w-full overflow-hidden rounded-2xl border border-white/10 bg-[#122b52] p-6 text-left shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200 md:p-10 ${flipped ? 'is-flipped' : ''}`}
    >
      <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-blue-500" />
      <div className="flip-inner card-inner min-h-[320px] md:min-h-[400px] flex items-center justify-center">
        <div className="flip-face flip-front relative flex flex-col items-center gap-6 text-center px-6">
          <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            Question
          </div>
          <p className="max-w-2xl text-balance text-3xl font-bold leading-tight text-white md:text-4xl">
            {flashcard?.front}
          </p>
          <p className="text-sm font-medium text-slate-300">Tap or press Enter to flip</p>
        </div>

        <div className="flip-face flip-back relative flex flex-col items-center gap-6 text-center px-6">
          <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
            Answer
          </div>
          <p className="max-w-2xl text-balance text-3xl font-bold leading-tight text-white md:text-4xl">
            {flashcard?.back}
          </p>
          <p className="text-sm font-medium text-slate-300">Tap or press Enter to flip back</p>
        </div>
      </div>
    </button>
  );
};

export default StudyCard;
