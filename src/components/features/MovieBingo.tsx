"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface BingoCell {
  id: number;
  text: string;
  completed: boolean;
  category: "action" | "dialogue" | "character" | "visual" | "sound";
}

interface BingoCard {
  id: string;
  name: string;
  cells: BingoCell[];
  theme: string;
}

const bingoThemes = {
  action: {
    name: "Action Movies",
    items: [
      "Car chase scene",
      "Explosion",
      "Hero saves the day",
      "Villain monologue",
      "Last-minute rescue",
      "Fight on a rooftop",
      "Slow-motion sequence",
      "Hero walks away from explosion",
      "Bad guy falls from height",
      "Weapons/gadgets malfunction",
      "Hero gets the girl",
      "Mentor dies",
      "Training montage",
      "Betrayal revealed",
      "Final showdown",
      "Hero thought dead",
      "Comic relief character",
      "Ticking time bomb",
      "Hero loses powers",
      "Unlikely alliance",
      "Sacrifice for greater good",
      "Hidden identity revealed",
      "Evil twin/clone",
      "Redemption arc",
    ],
  },
  horror: {
    name: "Horror Movies",
    items: [
      "Jump scare",
      "Power goes out",
      "Cell phone has no signal",
      "Mistaken identity",
      "Running gag",
      "Someone dies first",
      "Creaky floorboard",
      "Mirror scare",
      "Fake-out death",
      "Cat jumps out",
      "Going into basement alone",
      "Car won't start",
      "Blood on the wall",
      "Mysterious phone call",
      "Possessed object",
      "Final girl survives",
      "Killer isn't really dead",
      "Split up to cover more ground",
      "Investigation montage",
      "Ancient curse",
      "Séance scene",
      "Abandoned building",
      "Flickering lights",
      "Creepy children",
    ],
  },
  comedy: {
    name: "Comedy Movies",
    items: [
      "Slapstick moment",
      "Mistaken identity",
      "Running gag",
      "Awkward silence",
      "Physical comedy",
      "Miscommunication",
      "Overreaction",
      "Breaking the fourth wall",
      "Unexpected punchline",
      "Character falls down",
      "Food fight",
      "Disguise scene",
      "Pratfall",
      "Double take",
      "Comedic timing",
      "Sight gag",
      "Wordplay joke",
      "Embarrassing situation",
      "Comic relief",
      "Funny one-liner",
      "Silly dance",
      "Costume malfunction",
      "Accidental success",
      "Ironic situation",
    ],
  },
  romance: {
    name: "Romance Movies",
    items: [
      "Meet-cute",
      "First kiss",
      "Airport chase",
      "Declaration of love",
      "Wedding scene",
      "Romantic dinner",
      "Love triangle",
      "Breakup scene",
      "Grand gesture",
      "Sunset kiss",
      "Rain in romantic scene",
      "Dancing together",
      "Love letter",
      "Separated by circumstances",
      "Rekindling old flame",
      "Jealousy moment",
      "Heart-to-heart talk",
      "Romantic music",
      "Flower giving",
      "Staring into eyes",
      "Happy ending",
      "Obstacle to love",
      "Meeting the parents",
      "Promise ring/proposal",
    ],
  },
};

export default function MovieBingo() {
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof bingoThemes>("action");
  const [currentCard, setCurrentCard] = useState<BingoCard | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateBingoCard = (theme: keyof typeof bingoThemes) => {
    const themeData = bingoThemes[theme];
    const shuffled = [...themeData.items].sort(() => Math.random() - 0.5);
    const selectedItems = shuffled.slice(0, 25);

    const cells: BingoCell[] = selectedItems.map((item, index) => ({
      id: index,
      text: item,
      completed: false,
      category: "action" as const,
    }));

    // Make center cell "FREE"
    cells[12] = {
      id: 12,
      text: "FREE",
      completed: true,
      category: "action",
    };

    const card: BingoCard = {
      id: `${theme}_${Date.now()}`,
      name: `${themeData.name} Bingo`,
      cells,
      theme,
    };

    setCurrentCard(card);
    setIsPlaying(true);
  };

  const toggleCell = (cellId: number) => {
    if (!currentCard) return;

    const updatedCells = currentCard.cells.map((cell) =>
      cell.id === cellId ? { ...cell, completed: !cell.completed } : cell
    );

    setCurrentCard({
      ...currentCard,
      cells: updatedCells,
    });
  };

  // Check for completed lines (rows, columns, diagonals)
  const checkCompletedLines = () => {
    if (!currentCard) return [];

    const lines = [];
    const cells = currentCard.cells;

    // Check rows
    for (let i = 0; i < 5; i++) {
      const row = cells.slice(i * 5, (i + 1) * 5);
      if (row.every((cell) => cell.completed)) {
        lines.push(`Row ${i + 1}`);
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      const column = cells.filter((_, index) => index % 5 === i);
      if (column.every((cell) => cell.completed)) {
        lines.push(`Column ${i + 1}`);
      }
    }

    // Check diagonals
    const diagonal1 = [cells[0], cells[6], cells[12], cells[18], cells[24]];
    if (diagonal1.every((cell) => cell.completed)) {
      lines.push("Diagonal 1");
    }

    const diagonal2 = [cells[4], cells[8], cells[12], cells[16], cells[20]];
    if (diagonal2.every((cell) => cell.completed)) {
      lines.push("Diagonal 2");
    }

    return lines;
  };

  const completedLines = checkCompletedLines();
  const hasWon = completedLines.length > 0;

  if (!isPlaying) {
    return (
      <div className="min-h-screen pt-20 lg:pt-28 w-full">
        {/* Hero Section - Full Width */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.3),transparent)]" />

          <div className="relative z-10 text-center w-full">
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-white mb-6">
              🎯 <span className="text-gradient-premium">Movie</span>{" "}
              <span className="text-white">Bingo</span>
            </h1>
            <p className="text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto">
              Make your movie nights more interactive! Check off tropes and
              moments as they happen.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(bingoThemes).map(([key, theme]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 cursor-pointer"
                  onClick={() =>
                    setSelectedTheme(key as keyof typeof bingoThemes)
                  }
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">
                      {key === "action"
                        ? "💥"
                        : key === "horror"
                        ? "👻"
                        : key === "comedy"
                        ? "😂"
                        : "💕"}
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {theme.name}
                    </h3>
                  </div>

                  <div className="text-sm text-slate-400 mb-4">
                    Sample items:
                  </div>

                  <ul className="text-sm text-slate-300 space-y-1">
                    {theme.items.slice(0, 3).map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                    <li>• And {theme.items.length - 3} more...</li>
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => generateBingoCard(selectedTheme)}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg"
              >
                Generate {bingoThemes[selectedTheme].name} Card
              </motion.button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 lg:pt-28 w-full">
      {/* Header Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden w-full bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {currentCard?.name}
          </h1>
          <p className="text-slate-300 mb-4">
            Click items as they happen in the movie!
          </p>

          {hasWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 rounded-xl p-4 mb-4"
            >
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-green-400 font-bold">BINGO!</div>
              <div className="text-slate-300">
                Completed: {completedLines.join(", ")}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Game Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
        <div className="max-w-4xl mx-auto">
          {/* Bingo Grid */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {currentCard?.cells.map((cell) => (
              <motion.button
                key={cell.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCell(cell.id)}
                className={`aspect-square p-2 text-xs sm:text-sm font-medium rounded-xl border-2 transition-all duration-300 ${
                  cell.completed
                    ? "bg-gradient-to-br from-green-500/30 to-blue-500/30 border-green-500 text-green-300"
                    : "bg-slate-800/50 border-slate-600 text-slate-300 hover:border-blue-500/50"
                }`}
              >
                {cell.text}
              </motion.button>
            ))}
          </div>

          {/* Controls */}
          <div className="text-center space-x-4">
            <button
              onClick={() => setIsPlaying(false)}
              className="px-6 py-3 bg-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-600 transition-all duration-300"
            >
              New Card
            </button>

            <button
              onClick={() => {
                if (currentCard) {
                  const resetCells = currentCard.cells.map((cell) => ({
                    ...cell,
                    completed: cell.text === "FREE",
                  }));
                  setCurrentCard({
                    ...currentCard,
                    cells: resetCells,
                  });
                }
              }}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-500 transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
