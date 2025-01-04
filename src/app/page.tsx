"use client";

import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { descend, prop, sort, sum } from "ramda";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCardsStore, { GamesTypes } from "@/store/useCardsStore";
import countGames from "@/utils/countGames";

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

type Result = {
  matchesSize: number;
  matches: number[];
  game: number[];
};

export default function Home() {
  const [inputSortedTen, setInputSortedTen] = useState<string>("");
  const [result, setResult] = useState<Result[]>([]);
  const { cards } = useCardsStore();
  const [type, setType] = useState<GamesTypes | undefined>();
  const [competition, setCompetition] = useState<number | undefined>();

  function compareResult() {
    const sortedTen = new Set(
      inputSortedTen
        .replaceAll(" ", "")
        .split(",")
        .map((ten) => parseInt(ten)),
    );

    const result = [] as Result[];

    const games = cards
      .filter((c) => c.type === type && c.competition === competition)
      .flatMap((card) => card.games.map((game) => game.ten));

    for (const game of games) {
      const matches = sortedTen.intersection(new Set(game));

      result.push({
        matchesSize: matches.size,
        matches: Array.from(matches),
        game,
      });
    }

    setResult(result);
  }

  const countedGames = countGames(cards);

  const sortResultByMatchesSize = sort<Result>(descend(prop("matchesSize")));

  const competitions = Array.from(
    new Set(
      countedGames
        .filter((c) => c.type === type)
        .map((c) => c.competition.toString()),
    ),
  );

  return (
    <main>
      <div className="p-4">
        <h1 className="mb-4 text-center">Loteria</h1>
        <Tabs defaultValue="account" className="flex flex-col justify-center">
          <TabsList className="m-auto w-fit">
            <TabsTrigger value="account">
              Meus jogos ({sum(countedGames.map((game) => game.gameCount))})
            </TabsTrigger>
            <TabsTrigger value="password">Conferir resultado</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            {countedGames.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Tipo</TableHead>
                    <TableHead className="text-center">Concurso</TableHead>
                    <TableHead className="text-center">Qtd dezenas</TableHead>
                    <TableHead className="text-center">Qtd jogos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countedGames.map(
                    ({ type, competition, tenCount, gameCount }) => (
                      <TableRow key={`${type}-${competition}-${tenCount}`}>
                        <TableCell className="text-center">{type}</TableCell>
                        <TableCell className="text-center">
                          {competition}
                        </TableCell>
                        <TableCell className="text-center">
                          {tenCount}
                        </TableCell>
                        <TableCell className="text-center">
                          {gameCount}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            ) : (
              <p className="my-6 text-center">Nenhum jogo cadastrado.</p>
            )}

            <div className="mt-4 flex justify-center">
              <Button asChild>
                <Link href="/manage">
                  <GearIcon /> Gerenciar jogos
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <h2 className="my-4 text-center">Conferir resultado</h2>

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
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {types.map((gameType) => (
                        <SelectItem key={gameType.value} value={gameType.value}>
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
                <Select
                  onValueChange={(value) => setCompetition(parseInt(value))}
                  value={competition?.toString() ?? ""}
                  disabled={competitions.length === 0}
                >
                  <SelectTrigger className="w-full" id="gameType">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {competitions.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="competition">
                Dezenas sorteadas <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="competition"
                placeholder="Ex.: 1, 2, 3, 4, 5, 6"
                inputMode="decimal"
                value={inputSortedTen}
                onChange={(e) => setInputSortedTen(e.target.value)}
              />
            </div>

            <div className="my-4 flex justify-center">
              <Dialog
                onOpenChange={(open) => {
                  if (open) {
                    compareResult();
                  } else {
                    setResult([]);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button disabled={!type || !competition || !inputSortedTen}>
                    Conferir resultado
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Resultado</DialogTitle>
                    <DialogDescription>
                      {type} / Concurso #{competition}
                    </DialogDescription>
                  </DialogHeader>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Acertos</TableHead>
                        <TableHead className="text-center">Jogo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortResultByMatchesSize(result).map((result) => (
                        <TableRow key={result.game.join("-")}>
                          <TableCell className="text-center">
                            {result.matchesSize}
                          </TableCell>
                          <TableCell className="text-center">
                            {result.game.map((ten, i) => (
                              <React.Fragment key={ten}>
                                <span
                                  className={
                                    result.matches.some((m) => m === ten)
                                      ? "text-green-500"
                                      : ""
                                  }
                                >
                                  {ten}
                                </span>
                                {i < result.game.length - 1 && <span> - </span>}
                              </React.Fragment>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Fechar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
