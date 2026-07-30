import { X, Tag, Image } from "lucide-react";

const categoriesList = ["Idiomas", "Programação", "Exames", "Outros"];

const DeckFormModal = ({
  isOpen,
  editingDeck,
  form,
  onClose,
  onSubmit,
  onFieldChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingDeck ? "Editar Deck" : "Criar Novo Deck"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {editingDeck ? "Atualize as informações do baralho" : "Adicione uma nova coleção de flashcards"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Título
            </label>
            <input
              type="text"
              required
              value={form.title || ""}
              onChange={(e) => onFieldChange("title", e.target.value)}
              placeholder="ex: Vocabulário em Francês"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <Tag size={12} /> Categoria
            </label>
            <select
              value={form.category || "Outros"}
              onChange={(e) => onFieldChange("category", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <Image size={12} /> URL da Imagem / Capa <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input
              type="url"
              value={form.imageUrl || ""}
              onChange={(e) => onFieldChange("imageUrl", e.target.value)}
              placeholder="https://exemplo.com/bandeira-franca.png"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Descrição <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              value={form.description || ""}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Resumo sobre o conteúdo deste deck..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition active:scale-95"
            >
              {editingDeck ? "Salvar Alterações" : "Criar Deck"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeckFormModal;