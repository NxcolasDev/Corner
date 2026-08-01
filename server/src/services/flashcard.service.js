import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js';

/**
 * Aplica o Algoritmo SuperMemo-2 (SM-2) para agendamento de repetição espaçada.
 * @param {Object} card - Objeto Mongoose do Flashcard
 * @param {Number} rating - Nota dada pelo usuário (1: De novo, 2: Difícil, 3: Bom, 4: Fácil)
 */
const calculateSM2 = (card, rating) => {
  // Converte a escala 1-4 para a escala 0-5 do SM-2 original:
  // 1 -> 1 (Incorreto / Errei)
  // 2 -> 3 (Correto com grande dificuldade)
  // 3 -> 4 (Correto com hesitação)
  // 4 -> 5 (Correto perfeito)
  const qMap = { 1: 1, 2: 3, 3: 4, 4: 5 };
  const q = qMap[rating] || 4;

  let { intervalDays = 0, easeFactor = 2.5, reviewCount = 0 } = card;

  if (q < 3) {
    // Se o usuário errou/teve muita dificuldade, reinicia as repetições
    reviewCount = 0;
    intervalDays = 1;
  } else {
    // Se lembrou do cartão
    if (reviewCount === 0) {
      intervalDays = 1;
    } else if (reviewCount === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    reviewCount += 1;
  }

  // Atualiza o Ease Factor (Mínimo de 1.3)
  // Fórmula padrão SM-2: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calcula a próxima data de revisão
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return {
    intervalDays,
    easeFactor,
    reviewCount,
    nextReview,
  };
};

export const createFlashcardService = async (data, deckId, userId) => {
  const deck = await Deck.findOne({ _id: deckId, user: userId });
  if (!deck) {
    throw new Error('Deck não encontrado ou acesso negado.');
  }

  const flashcard = await Flashcard.create({
    ...data,
    deck: deckId,
  });

  return flashcard;
};

export const getDeckFlashcards = async (deckId, userId) => {
  const deck = await Deck.findOne({ _id: deckId, user: userId });
  if (!deck) {
    throw new Error('Deck não encontrado ou acesso negado.');
  }

  // Retorna os flashcards associados ao deck
  return await Flashcard.find({ deck: deckId }).sort({ createdAt: -1 });
};

export const updateFlashcardService = async (flashcardId, userId, updateData) => {
  const flashcard = await Flashcard.findById(flashcardId).populate('deck');
  if (!flashcard) {
    throw new Error('Flashcard não encontrado.');
  }

  // Verifica se o deck pertence ao usuário
  if (flashcard.deck.user.toString() !== userId.toString()) {
    throw new Error('Acesso negado.');
  }

  // Se a requisição contiver 'rating' (1 a 4), aplica o cálculo do SM-2
  if (updateData.rating) {
    const sm2Results = calculateSM2(flashcard, Number(updateData.rating));
    updateData.intervalDays = sm2Results.intervalDays;
    updateData.easeFactor = sm2Results.easeFactor;
    updateData.reviewCount = sm2Results.reviewCount;
    updateData.nextReview = sm2Results.nextReview;
  }

  Object.assign(flashcard, updateData);
  await flashcard.save();

  return flashcard;
};

export const deleteFlashcard = async (flashcardId, userId) => {
  const flashcard = await Flashcard.findById(flashcardId).populate('deck');
  if (!flashcard) {
    throw new Error('Flashcard não encontrado.');
  }

  if (flashcard.deck.user.toString() !== userId.toString()) {
    throw new Error('Acesso negado.');
  }

  await flashcard.deleteOne();
  return { message: 'Flashcard removido com sucesso.' };
};