"use client";

import { ArrowLeftIcon, TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ascend, descend, prop, sortWith } from "ramda";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useCardsStore, { Card as CardType } from "@/store/useCardsStore";

import CreateEditCard, { CreatedCard } from "./components/CreateEditCard";
import CreateGame from "./components/CreateGame";

export default function Manage() {
  const { cards, addCard, removeCard, updateCard } = useCardsStore();

  const cardsSort = sortWith<CardType>([
    ascend(prop("type")),
    descend(prop("competition")),
  ]);

  const handleCreateGame = (cardId: string, ten: number[]) => {
    const card = cards.find((card) => card.id === cardId);

    if (card) {
      updateCard(cardId, {
        ...card,
        games: [
          ...card.games,
          {
            id:
              card.games.length > 0
                ? Math.max(...card.games.map((g) => g.id)) + 1
                : 1,
            ten: ten.sort((a, b) => a - b),
          },
        ],
      });
    }
  };

  const handleEditCard = (cardId: string, newCard: CreatedCard) => {
    const card = cards.find((card) => card.id === cardId);

    if (card) {
      updateCard(cardId, {
        ...card,
        competition: newCard.competition,
        type: newCard.type,
        games: newCard.games,
      });
    }
  };

  return (
    <main className="flex h-dvh flex-col gap-4 overflow-scroll p-4">
      <Button asChild className="w-fit" variant="ghost">
        <Link href="/">
          <ArrowLeftIcon /> Voltar
        </Link>
      </Button>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {cards.length === 0 && (
          <p className="mt-4 text-center">Nenhum cartão cadastrado ainda.</p>
        )}

        {cardsSort(cards).map(
          ({ id, cardNumber, competition, type, games }) => (
            <Card key={id}>
              <CardHeader>
                <CardTitle>
                  Cartão #{cardNumber.toString().padStart(4, "0")}
                </CardTitle>
                <CardDescription>
                  {type}
                  <br />
                  Concurso #{competition}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {games.length === 0 && (
                  <p>Nenhum jogo adicionado ao cartão ainda.</p>
                )}
                <ul>
                  {games.map((game) => (
                    <li key={game.id}>
                      <strong>{game.id}:</strong>{" "}
                      {game.ten
                        .map((ten) => ten.toString().padStart(2, "0"))
                        .join(", ")}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-end gap-4">
                <CreateGame
                  cardNumber={cardNumber}
                  competition={competition}
                  type={type}
                  onCreate={(ten) => handleCreateGame(id, ten)}
                />

                <CreateEditCard
                  mode="edit"
                  card={{ id, cardNumber, competition, type, games }}
                  onSave={(newCard) => handleEditCard(id, newCard)}
                />

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCard(id)}
                >
                  <TrashIcon />
                </Button>
              </CardFooter>
            </Card>
          ),
        )}
      </div>

      <CreateEditCard
        mode="create"
        onSave={(newCard) => {
          addCard({
            id: cards.length.toString(),
            cardNumber:
              cards.length > 0
                ? Math.max(...cards.map((c) => c.cardNumber)) + 1
                : 1,
            competition: newCard.competition,
            type: newCard.type,
            games: [],
          });
        }}
      />
    </main>
  );
}
