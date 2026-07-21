import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card from "../shared/ui/Card";
import { difficultyClass, difficultyLabel } from "../../utils/format";

const FlashcardRow = ({ flashcard, onDelete, onUpdate }) => {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Front</p>
            <p className="mt-2 text-sm font-semibold text-slate-950 line-clamp-2">{flashcard.front}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Back</p>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{flashcard.back}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={difficultyClass(flashcard.difficulty)}>{difficultyLabel(flashcard.difficulty)}</Badge>
          <Button variant="secondary" size="sm" className="px-3 py-2" onClick={() => onUpdate(flashcard)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="px-3 py-2" onClick={() => onDelete(flashcard)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FlashcardRow;
