import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FlashcardRow from "../components/cards/FlashcardRow";
import DeckFormModal from "../components/forms/DeckFormModal";
import { deleteDeck, fetchDecks, updateDeck } from "../services/deck.service";
import {
  createFlashcard,
  deleteFlashcard,
  fetchFlashcards,
  updateFlashcard,
} from "../services/flashcard.service";
import { 
  ArrowLeft, 
  Play, 
  Edit2, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon,
  Tag,
  BookOpen,
  FileText,
  Upload
} from "lucide-react";

const DeckDetails = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDeck, setEditingDeck] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [deckForm, setDeckForm] = useState({ title: "", description: "", category: "Outros", imageUrl: "" });
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const [cardForm, setCardForm] = useState({
    front: "",
    back: "",
    tags: "",
    difficulty: "medium",
    imageUrl: "",
  });
  const [error, setError] = useState(null);

  const loadDeck = useCallback(async () => {
    try {
      setLoading(true);
      const decks = await fetchDecks();
      const selectedDeck = decks.find((item) => item._id === deckId);
      const cards = await fetchFlashcards(deckId);

      if (!selectedDeck) {
        setError("Deck não encontrado.");
        return;
      }

      setDeck(selectedDeck);
      setFlashcards(cards || []);
    } catch {
      setError("Erro ao carregar informações do deck.");
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadDeck();
  }, [deckId, loadDeck]);

  const handleSaveDeck = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateDeck(deckId, deckForm);
      setDeck(updated);
      setEditingDeck(false);
      setIsDeckModalOpen(false);
    } catch {
      setError("Erro ao salvar o deck.");
    }
  };

  const handleDeleteDeck = async () => {
    if (!window.confirm("Certeza que deseja remover este deck e todos os seus cards?")) return;
    try {
      await deleteDeck(deckId);
      navigate("/dashboard");
    } catch {
      setError("Erro ao deletar o deck.");
    }
  };

  const handleOpenDeckModal = () => {
    setDeckForm({ 
      title: deck?.title || "", 
      description: deck?.description || "",
      category: deck?.category || "Outros",
      imageUrl: deck?.imageUrl || ""
    });
    setEditingDeck(true);
    setIsDeckModalOpen(true);
  };

  const handleCreateOrUpdateCard = async (e) => {
    e.preventDefault();
    const payload = {
      front: cardForm.front,
      back: cardForm.back,
      tags: typeof cardForm.tags === "string" ? cardForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : cardForm.tags,
      difficulty: cardForm.difficulty,
      imageUrl: cardForm.imageUrl,
    };

    try {
      if (editingFlashcard) {
        const updated = await updateFlashcard(editingFlashcard._id, payload);
        setFlashcards((prev) => prev.map((card) => (card._id === updated._id ? updated : card)));
        setEditingFlashcard(null);
      } else {
        const created = await createFlashcard(deckId, payload);
        setFlashcards((prev) => [created, ...prev]);
      }
      setCardForm({ front: "", back: "", tags: "", difficulty: "medium", imageUrl: "" });
    } catch {
      setError("Erro ao salvar o flashcard.");
    }
  };

  // Importador de TXT / CSV estilo Anki
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/);
      let importedCount = 0;

      for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith("#")) continue; // Ignora linhas vazias e comentários

        // Suporta delimitadores: Tab, Ponto e vírgula, ou Vírgula
        let separator = ";";
        if (line.includes("\t")) separator = "\t";
        else if (line.includes(";")) separator = ";";
        else if (line.includes(",")) separator = ",";

        const parts = line.split(separator);
        if (parts.length >= 2) {
          const front = parts[0].trim();
          const back = parts[1].trim();
          const tags = parts[2] ? parts[2].split(",").map((t) => t.trim()) : ["importado"];

          if (front && back) {
            try {
              const created = await createFlashcard(deckId, {
                front,
                back,
                tags,
                difficulty: "medium",
                imageUrl: "",
              });
              setFlashcards((prev) => [created, ...prev]);
              importedCount++;
            } catch {
              console.error("Erro ao importar linha:", line);
            }
          }
        }
      }

      setIsImporting(false);
      alert(`${importedCount} flashcards importados com sucesso!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.readAsText(file);
  };

  // Suporte a Upload Local de Imagem (DataURI Base64)
  const handleImageLocalUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCardForm((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFlashcardEdit = (flashcard) => {
    setEditingFlashcard(flashcard);
    setCardForm({
      front: flashcard.front,
      back: flashcard.back,
      tags: flashcard.tags?.join(", ") || "",
      difficulty: flashcard.difficulty || "medium",
      imageUrl: flashcard.imageUrl || "",
    });
  };

  const handleFlashcardDelete = async (flashcard) => {
    if (!window.confirm("Remover este flashcard?")) return;
    try {
      await deleteFlashcard(flashcard._id);
      setFlashcards((prev) => prev.filter((item) => item._id !== flashcard._id));
    } catch {
      setError("Erro ao excluir flashcard.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm font-bold text-slate-400 animate-pulse">Carregando baralho...</div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="p-12 text-center text-rose-500 font-bold">
        Deck não encontrado.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <DeckFormModal
        isOpen={isDeckModalOpen}
        editingDeck={editingDeck}
        form={deckForm}
        onClose={() => setIsDeckModalOpen(false)}
        onSubmit={handleSaveDeck}
        onFieldChange={(field, val) => setDeckForm((prev) => ({ ...prev, [field]: val }))}
      />

      <section className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[32px] bg-slate-900 p-6 text-white shadow-[0_24px_80px_-40px_rgba(15,23,42,0.75)] md:p-8">
        {deck.imageUrl && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={deck.imageUrl} alt={deck.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10">
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Voltar ao Dashboard
          </Link>

          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
              <Tag size={12} /> {deck.category || "Outros"}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-5xl">{deck.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            {deck.description || "Sem descrição informada."}
          </p>
        </div>

        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="text-xs font-semibold text-slate-400">
            Total de cartões: <span className="font-bold text-white">{flashcards.length}</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.csv"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
              title="Importar cards via TXT ou CSV"
            >
              <Upload size={15} />
              {isImporting ? "Importando..." : "Importar .TXT / .CSV"}
            </button>

            <button
              onClick={handleOpenDeckModal}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
              title="Editar Deck"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDeleteDeck}
              className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-400 transition hover:bg-rose-500/20"
              title="Excluir Deck"
            >
              <Trash2 size={16} />
            </button>
            <Link
              to={`/study/${deckId}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
            >
              <Play size={16} fill="currentColor" /> Estudar Agora
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <section className="grid items-start gap-6 lg:grid-cols-12">
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] lg:col-span-5 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Sparkles size={18} className="text-blue-600" />
              {editingFlashcard ? "Editar Card" : "Novo Flashcard"}
            </h3>
            {editingFlashcard && (
              <button
                type="button"
                onClick={() => {
                  setEditingFlashcard(null);
                  setCardForm({ front: "", back: "", tags: "", difficulty: "medium", imageUrl: "" });
                }}
                className="text-xs font-bold text-slate-400 transition hover:text-slate-600"
              >
                Cancelar
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleCreateOrUpdateCard}>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Frente (Pergunta/Termo)
              </label>
              <textarea
                value={cardForm.front}
                onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                required
                rows={3}
                placeholder="ex: What is 'spaced repetition'?"
                className="mt-1.5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Verso (Resposta/Definição)
              </label>
              <textarea
                value={cardForm.back}
                onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                required
                rows={3}
                placeholder="ex: Uma técnica de aprendizado baseada na repetição espaçada."
                className="mt-1.5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Dificuldade
                </label>
                <select
                  value={cardForm.difficulty}
                  onChange={(e) => setCardForm({ ...cardForm, difficulty: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Tags
                </label>
                <input
                  type="text"
                  value={cardForm.tags}
                  onChange={(e) => setCardForm({ ...cardForm, tags: e.target.value })}
                  placeholder="vocab, b2"
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                <span>Imagem (URL ou Upload)</span>
              </label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="text"
                  value={cardForm.imageUrl}
                  onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })}
                  placeholder="https://... ou escolha um arquivo"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white"
                />
                <label className="flex cursor-pointer items-center justify-center rounded-2xl bg-slate-100 p-3.5 text-slate-600 transition hover:bg-slate-200">
                  <ImageIcon size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageLocalUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-600 active:scale-95"
            >
              {editingFlashcard ? "Salvar Alterações" : "Adicionar Flashcard"}
            </button>
          </form>
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_36px_-28px_rgba(15,23,42,0.55)] lg:col-span-7 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <BookOpen size={18} className="text-slate-400" />
              Cards neste Deck ({flashcards.length})
            </h3>
          </div>

          <div className="space-y-3">
            {flashcards.length > 0 ? (
              flashcards.map((card) => (
                <FlashcardRow
                  key={card._id}
                  flashcard={card}
                  onDelete={handleFlashcardDelete}
                  onUpdate={handleFlashcardEdit}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
                <FileText size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-600">Nenhum card cadastrado ainda.</p>
                <p className="mt-1 text-xs">
                  Crie um manualmente ao lado ou use o botão <b>"Importar .TXT / .CSV"</b> acima.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeckDetails;