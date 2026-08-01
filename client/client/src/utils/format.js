export const formatDate = (value) => {
  if (!value) {
    return "Not studied yet";
  }

  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const difficultyLabel = (level) => {
  if (level === "easy") return "Easy";
  if (level === "hard") return "Hard";
  return "Medium";
};

export const difficultyClass = (level) => {
  if (level === "easy") return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
  if (level === "hard") return "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
  return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
};

export const isDueForReview = (flashcard, now = new Date()) => {
  if (!flashcard?.nextReview) {
    return true;
  }

  return new Date(flashcard.nextReview).getTime() <= now.getTime();
};

export const getDueCards = (flashcards, now = new Date()) =>
  flashcards.filter((flashcard) => isDueForReview(flashcard, now));

export const calculateReviewSchedule = (flashcard, rating, now = new Date()) => {
  const previousInterval = Math.max(0, Number(flashcard?.intervalDays) || 0);
  const previousEase = Number(flashcard?.easeFactor) || 2.5;

  const schedule = {
    difficulty: rating === "again" ? "hard" : rating,
    easeFactor: previousEase,
    intervalDays: previousInterval,
    nextReview: new Date(now),
  };

  if (rating === "again") {
    schedule.easeFactor = Math.max(1.3, previousEase - 0.2);
    schedule.intervalDays = 0;
    schedule.nextReview.setMinutes(schedule.nextReview.getMinutes() + 5);
    return schedule;
  }

  if (rating === "hard") {
    schedule.easeFactor = Math.max(1.3, previousEase - 0.15);
    schedule.intervalDays = Math.max(1, Math.ceil(previousInterval * 1.2 || 1));
  } else if (rating === "easy") {
    schedule.easeFactor = Math.min(2.8, previousEase + 0.15);
    schedule.intervalDays = Math.max(4, Math.ceil((previousInterval || 1) * (previousEase + 0.7)));
  } else {
    schedule.intervalDays = Math.max(1, Math.ceil((previousInterval || 1) * previousEase));
  }

  schedule.nextReview.setDate(schedule.nextReview.getDate() + schedule.intervalDays);
  return schedule;
};
