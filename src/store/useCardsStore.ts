import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GamesTypes = "mega-sena" | "loto-facil";

export type Game = {
  id: number;
  ten: number[];
};

export type Card = {
  id: string;
  cardNumber: number;
  type: GamesTypes;
  competition: number;
  games: Game[];
};

type CardsState = {
  cards: Card[];
  addCard: (card: Card) => void;
  removeCard: (id: string) => void;
  updateCard: (id: string, updatedCard: Partial<Card>) => void;
};

const useCardsStore = create<CardsState>()(
  persist(
    (set) => ({
      cards: [],
      addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
        })),
      updateCard: (id, updatedCard) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updatedCard } : card,
          ),
        })),
    }),
    {
      name: "cards-store",
    },
  ),
);

export default useCardsStore;
