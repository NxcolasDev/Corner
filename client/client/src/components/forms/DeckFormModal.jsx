import { CornerButton } from "../corner";

const DeckFormModal = ({
  isOpen,
  editingDeck,
  form,
  onClose,
  onSubmit,
  onFieldChange,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
              Corner
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {editingDeck ? "Edit Deck" : "Create Deck"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={(event) => onFieldChange(event.target.name, event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={(event) => onFieldChange(event.target.name, event.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
            />
          </div>

          <CornerButton type="submit" className="w-full py-3">
            {editingDeck ? "Save Changes" : "Create Deck"}
          </CornerButton>
        </form>
      </div>
    </div>
  );
};

export default DeckFormModal;