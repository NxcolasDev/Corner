import api from "../api/axios";

export const fetchFlashcards = async (deckId) => {
  const response = await api.get(`/flashcards/${deckId}`);
  return response.data.flashcards;
};

export const createFlashcard = async (deckId, data) => {
  const response = await api.post(`/flashcards/${deckId}`, data);
  return response.data.flashcard;
};

export const updateFlashcard = async (flashcardId, data) => {
  const response = await api.put(`/flashcards/${flashcardId}`, data);
  return response.data.flashcard;
};

export const deleteFlashcard = async (flashcardId) => {
  const response = await api.delete(`/flashcards/${flashcardId}`);
  return response.data;
};
