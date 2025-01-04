"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useState } from "react";

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
import { cn } from "@/lib/utils";

interface CircleProps {
  number: number;
  onClick?: () => void;
  isChecked: boolean;
}

const Circle: React.FC<CircleProps> = ({ number, onClick, isChecked }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white transition focus:outline-none focus:ring-2",
        isChecked ? "bg-green-500" : "bg-gray-400",
      )}
    >
      {number}
    </button>
  );
};

type CreateGameProps = {
  competition: number;
  cardNumber: number;
  type: string;
  onCreate: (ten: number[]) => void;
};

export default function CreateGame({
  cardNumber,
  competition,
  type,
  onCreate,
}: CreateGameProps) {
  const [selectedTen, setSelectedTen] = useState<number[]>([]);

  return (
    <Drawer onClose={() => setSelectedTen([])}>
      <DrawerTrigger asChild>
        <Button className="w-fit" variant="outline">
          <PlusIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex max-h-dvh w-full max-w-sm flex-col">
          <DrawerHeader>
            <DrawerTitle>Cadastrar novo jogo</DrawerTitle>
            <DrawerDescription>
              {type} / cartão #{cardNumber} / concurso {competition}
              <br />
              Selecione as dezenas abaixo.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-wrap justify-center gap-2 overflow-y-scroll p-4">
            {Array.from({ length: 60 })
              .map((_, i) => i + 1)
              .map((number) => (
                <Circle
                  number={number}
                  key={number}
                  isChecked={selectedTen.some((s) => s === number)}
                  onClick={() => {
                    if (selectedTen.some((s) => s === number)) {
                      setSelectedTen(selectedTen.filter((s) => s !== number));
                    } else {
                      setSelectedTen([...selectedTen, number]);
                    }
                  }}
                />
              ))}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={(e) => {
                  if (selectedTen.length > 0) {
                    onCreate(selectedTen);
                  } else {
                    e.preventDefault();
                  }
                }}
              >
                Cadastrar jogo
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
