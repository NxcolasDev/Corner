import User from "../models/User.js";
import Deck from "../models/Deck.js";
import Flashcard from "../models/Flashcard.js";

// Busca os dados do usuário logado
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar usuário." });
  }
};

// Salva as configurações de meta e lembretes
export const updateSettings = async (req, res) => {
  try {
    const { dailyGoal, studyReminders } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { dailyGoal, studyReminders },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar configurações." });
  }
};

// Atualiza a sequência (Streak) ao concluir um estudo
export const recordStudySession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const now = new Date();
    const lastStudied = user.lastStudiedAt ? new Date(user.lastStudiedAt) : null;

    let newStreak = user.streak || 0;

    if (!lastStudied) {
      newStreak = 1;
    } else {
      const diffHours = (now - lastStudied) / (1000 * 60 * 60);
      const isSameDay = now.toDateString() === lastStudied.toDateString();

      if (!isSameDay) {
        if (diffHours <= 48) {
          newStreak += 1; // Estudou no dia seguinte
        } else {
          newStreak = 1; // Faltou mais de um dia, reseta
        }
      }
    }

    user.streak = newStreak;
    user.lastStudiedAt = now;
    await user.save();

    res.status(200).json({
      success: true,
      streak: user.streak,
      lastStudiedAt: user.lastStudiedAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao registrar streak." });
  }
};

// Retorna as métricas agregadas do Dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    // 1. Busca todos os decks do usuário
    const decks = await Deck.find({ user: userId });
    const deckIds = decks.map((d) => d._id);

    // 2. Busca todos os flashcards pertencentes a esses decks
    const flashcards = await Flashcard.find({ deck: { $in: deckIds } });

    // 3. Calcula total de cards pendentes para hoje (nextReview <= agora)
    const now = new Date();
    const dueFlashcards = flashcards.filter(
      (card) => !card.nextReview || new Date(card.nextReview) <= now
    );

    // 4. Calcula cartões revisados hoje (que foram revisados no mesmo dia)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const reviewedToday = flashcards.filter((card) => {
      if (!card.updatedAt) return false;
      return new Date(card.updatedAt) >= todayStart && card.reviewCount > 0;
    }).length;

    res.status(200).json({
      success: true,
      stats: {
        streak: user.streak || 0,
        dailyGoal: user.dailyGoal || 10,
        totalDecks: decks.length,
        totalCards: flashcards.length,
        dueCards: dueFlashcards.length,
        reviewedToday,
      },
      decks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao buscar métricas do dashboard.",
      error: error.message,
    });
  }
};