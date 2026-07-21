import { Link } from "react-router-dom";
import { BookOpen, Edit3, Trash2 } from "lucide-react";
import { CornerCard, CornerButton, CornerBadge } from "../corner";

const DeckCard = ({ deck, dueCount = 0, onDelete, onEdit }) => {
  return (
    <CornerCard className="group relative overflow-hidden border-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-base font-bold text-blue-600">
          {deck.title?.charAt(0).toUpperCase()}
        </div>
        <CornerBadge tone={dueCount > 0 ? "warning" : "default"} className="rounded-full px-2 py-1 text-[0.6rem] uppercase tracking-[0.14em]">
          Deck
        </CornerBadge>
      </div>

      <div className="px-4 pt-3">
        <h3 className="text-base font-bold text-slate-950">{deck.title}</h3>
        <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500 line-clamp-2">
          {deck.description || "No description yet"}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-[0.58rem] uppercase tracking-[0.18em] text-slate-400">Cards</p>
          <p className="mt-1 text-xl font-bold text-slate-950">{deck.totalCards || 0}</p>
        </div>
        <BookOpen size={20} className="text-slate-900/70" />
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700">
          <span>{dueCount ? `${dueCount} ready to review` : "No cards due today"}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-600">
            {dueCount > 0 ? "Due" : "Clear"}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Link to={`/study/${deck._id}`} className="rounded-lg bg-blue-600 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-blue-700">
            Study
          </Link>
          <Link to={`/decks/${deck._id}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-50">
            Details
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CornerButton variant="secondary" className="rounded-lg px-3 py-2 text-xs" onClick={() => onEdit(deck)}>
            <Edit3 size={14} />
            <span className="ml-2">Edit</span>
          </CornerButton>
          <CornerButton variant="ghost" className="rounded-lg border border-rose-200 px-3 py-2 text-xs text-rose-700 hover:bg-rose-50" onClick={() => onDelete(deck)}>
            <Trash2 size={14} />
            <span className="ml-2">Delete</span>
          </CornerButton>
        </div>
      </div>
    </CornerCard>
  );
};

export default DeckCard;
