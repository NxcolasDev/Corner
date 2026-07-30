import { useEffect, useState, useRef } from "react";
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

  const loadDeck = async () => {
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
  };

  useEffect(() => {
    loadDeck();
  }, [deckId]);

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
            } catch (err) {
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
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      <DeckFormModal
        isOpen={isDeckModalOpen}
        editingDeck={editingDeck}
        form={deckForm}
        onClose={() => setIsDeckModalOpen(false)}
        onSubmit={handleSaveDeck}
        onFieldChange={(field, val) => setDeckForm((prev) => ({ ...prev, [field]: val }))}
      />

      {/* Top Banner / Capa do Deck */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl min-h-[220px] flex flex-col justify-between p-6 md:p-8">
        {deck.imageUrl && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={deck.imageUrl} alt={deck.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition mb-4"
          >
            <ArrowLeft size={16} /> Voltar ao Dashboard
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-blue-300">
              <Tag size={12} /> {deck.category || "Outros"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{deck.title}</h1>
          <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
            {deck.description || "Sem descrição informada."}
          </p>
        </div>

        <div className="relative z-10 pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 mt-4">
          <div className="text-xs font-semibold text-slate-400">
            Total de cartões: <span className="text-white font-bold">{flashcards.length}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Input Oculto para Importação TXT/CSV */}
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
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 font-semibold text-xs text-slate-200 hover:bg-slate-700 transition"
              title="Importar cards via TXT ou CSV"
            >
              <Upload size={15} />
              {isImporting ? "Importando..." : "Importar .TXT / .CSV"}
            </button>

            <button
              onClick={handleOpenDeckModal}
              className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition"
              title="Editar Deck"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDeleteDeck}
              className="p-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
              title="Excluir Deck"
            >
              <Trash2 size={16} />
            </button>
            <Link
              to={`/study/${deckId}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 text-sm"
            >
              <Play size={16} fill="currentColor" /> Estudar Agora
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <section className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* Formulário de Novo/Editar Flashcard */}
        <div className="lg:col-span-5 rounded-3xl bg-white p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
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
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition"
              >
                Cancelar
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleCreateOrUpdateCard}>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Frente (Pergunta/Termo)
              </label>
              <textarea
                value={cardForm.front}
                onChange={(e) => setCardForm({ ...cardForm, front: e.target.value })}
                required
                rows={3}
                placeholder="ex: What is 'spaced repetition'?"
                className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Verso (Resposta/Definição)
              </label>
              <textarea
                value={cardForm.back}
                onChange={(e) => setCardForm({ ...cardForm, back: e.target.value })}
                required
                rows={3}
                placeholder="ex: Uma técnica de aprendizado baseada na repetição espaçada."
                className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dificuldade
                </label>
                <select
                  value={cardForm.difficulty}
                  onChange={(e) => setCardForm({ ...cardForm, difficulty: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600 transition"
                >
                  <option value="easy">Fácil</option>
                  <option value="medium">Médio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tags
                </label>
                <input
                  type="text"
                  value={cardForm.tags}
                  onChange={(e) => setCardForm({ ...cardForm, tags: e.target.value })}
                  placeholder="vocab, b2"
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Imagem (URL ou Upload)</span>
              </label>
              <div className="mt-1.5 flex gap-2 items-center">
                <input
                  type="text"
                  value={cardForm.imageUrl}
                  onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })}
                  placeholder="https://... ou escolha um arquivo"
                  className="flex-1 rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 bg-slate-50/50 outline-none focus:bg-white focus:border-blue-600 transition"
                />
                <label className="cursor-pointer p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition flex items-center justify-center">
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
              className="w-full mt-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-blue-600 transition shadow-md active:scale-95"
            >
              {editingFlashcard ? "Salvar Alterações" : "Adicionar Flashcard"}
            </button>
          </form>
        </div>

        {/* Lista de Flashcards */}
        <div className="lg:col-span-7 rounded-3xl bg-white p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
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
              <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                <FileText size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-600">Nenhum card cadastrado ainda.</p>
                <p className="text-xs mt-1">
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