"use client";

import { Pencil1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, Game, GamesTypes } from "@/store/useCardsStore";

export type CreatedCard = Pick<Card, "type" | "competition" | "games">;

type CreateEditCardProps = {
  mode: "create" | "edit";
  onSave: (card: CreatedCard) => void;
  card?: Card;
};

const types = [
  {
    value: "Mega-Sena",
    label: "Mega-Sena",
  },
  {
    value: "Lotofácil",
    label: "Lotofácil",
  },
];

export default function CreateEditCard({
  card,
  mode,
  onSave,
}: CreateEditCardProps) {
  const [type, setType] = useState<GamesTypes | undefined>(card?.type);
  const [competition, setCompetition] = useState<number | undefined>(
    card?.competition,
  );
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (card?.games) {
      setGames(card.games);
    }
  }, [card?.games]);

  const title = mode === "create" ? "Cadastrar novo cartão" : "Editar cartão";
  const description =
    mode === "create"
      ? "Cadastre um novo cartão."
      : "Altere os dados do cartão.";

  return (
    <div className="flex justify-center">
      <Drawer
        onClose={() => {
          if (mode === "create") {
            setType(undefined);
            setCompetition(undefined);
          } else {
            setGames(card?.games ?? []);
          }
        }}
      >
        <DrawerTrigger asChild>
          {mode === "create" ? (
            <Button className="w-fit">
              <PlusIcon /> Cadastrar novo cartão
            </Button>
          ) : (
            <Button className="w-fit" variant="outline">
              <Pencil1Icon />
            </Button>
          )}
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto flex max-h-dvh w-full max-w-sm flex-col">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-scroll p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="gameType">
                    Tipo de jogo <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    onValueChange={(value) => setType(value as GamesTypes)}
                    value={type}
                  >
                    <SelectTrigger className="w-full" id="gameType">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {types.map((gameType) => (
                          <SelectItem
                            key={gameType.value}
                            value={gameType.value}
                          >
                            {gameType.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="competition">
                    Concurso <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    id="competition"
                    placeholder="Concurso"
                    inputMode="numeric"
                    value={competition ?? ""}
                    onChange={(e) => setCompetition(e.target.valueAsNumber)}
                  />
                </div>
              </div>

              {games.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jogo</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {games.map(({ id, ten }) => (
                      <TableRow key={id}>
                        <TableCell>
                          {ten
                            .map((t) => t.toString().padStart(2, "0"))
                            .join("-")}
                        </TableCell>
                        <TableCell className="text-end">
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => {
                              setGames(games.filter((game) => game.id !== id));
                            }}
                          >
                            <TrashIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button
                  onClick={(e) => {
                    if (type && competition) {
                      onSave({
                        type,
                        competition,
                        games,
                      });
                    } else {
                      e.preventDefault();
                    }
                  }}
                >
                  {mode === "create" ? "Cadastrar" : "Salvar"}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">Fechar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
