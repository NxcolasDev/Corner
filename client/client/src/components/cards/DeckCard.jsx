import { Link } from "react-router-dom";
import { BookOpen, Edit3, Trash2 } from "lucide-react";

const DeckCard = ({ deck, dueCount = 0, onDelete, onEdit }) => {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-sm shadow-slate-200/80 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/90">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-sky-400 to-violet-500" />

      <div className="flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-black text-white shadow-lg">
          {deck.title?.charAt(0).toUpperCase()}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          Deck
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">{deck.title}</h3>
      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500 line-clamp-2">
        {deck.description || "No description yet"}
      </p>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-100 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Cards</p>
          <p className="text-3xl font-black text-slate-900">{deck.totalCards || 0}</p>
        </div>

        <BookOpen size={28} className="text-blue-600" />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 rounded-[1.75rem] border border-sky-100/80 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 shadow-sm shadow-sky-100">
        <span>{dueCount ? `${dueCount} ready to review` : "No cards due today"}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-600">
          {dueCount > 0 ? "Due" : "Clear"}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <Link
          to={`/study/${deck._id}`}
          className="flex-1 rounded-2xl bg-blue-600 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Study
        </Link>

        <Link
          to={`/decks/${deck._id}`}
          className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Details
        </Link>

        <button
          type="button"
          onClick={() => onEdit(deck)}
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:bg-slate-50"
          title="Edit deck"
        >
          <Edit3 size={18} />
        </button>

        <button
          type="button"
          onClick={() => onDelete(deck)}
          className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700 transition hover:bg-rose-100"
          title="Delete deck"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default DeckCard;