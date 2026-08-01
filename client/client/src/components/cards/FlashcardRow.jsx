import { difficultyClass, difficultyLabel } from "../../utils/format";

const FlashcardRow = ({ flashcard, onDelete, onUpdate }) => {
  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] md:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Front</p>
            <p className="mt-2 text-sm font-semibold text-slate-950 line-clamp-2">{flashcard.front}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Back</p>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{flashcard.back}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${difficultyClass(flashcard.difficulty)}`}>
            {difficultyLabel(flashcard.difficulty)}
          </span>
          <button onClick={() => onUpdate(flashcard)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
            Edit
          </button>
          <button onClick={() => onDelete(flashcard)} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardRow;