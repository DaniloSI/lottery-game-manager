import { Card } from "@/store/useCardsStore";

type TableRow = {
  type: string;
  competition: number;
  tenCount: number;
  gameCount: number;
};

const countGames = (cards: Card[]): TableRow[] => {
  const result: Record<string, TableRow> = {};

  cards.forEach((card) => {
    card.games.forEach((game) => {
      const key = `${card.type}-${card.competition}-${game.ten.length}`;

      if (!result[key]) {
        result[key] = {
          type: card.type,
          competition: card.competition,
          tenCount: game.ten.length,
          gameCount: 0,
        };
      }

      result[key].gameCount += 1;
    });
  });

  return Object.values(result);
};

export default countGames;
