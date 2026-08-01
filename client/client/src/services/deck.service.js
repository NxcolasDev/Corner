import api from "../api/axios";

export const fetchDecks = async () => {
  const response = await api.get("/decks");
  return response.data.decks;
};

export const createDeck = async (data) => {
  const response = await api.post("/decks", data);
  return response.data.deck;
};

export const updateDeck = async (deckId, data) => {
  const response = await api.put(`/decks/${deckId}`, data);
  return response.data.deck;
};

export const deleteDeck = async (deckId) => {
  const response = await api.delete(`/decks/${deckId}`);
  return response.data;
};
