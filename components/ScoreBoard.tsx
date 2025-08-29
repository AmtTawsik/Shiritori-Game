"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
}

interface ScoreBoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export default function ScoreBoard({ players, currentPlayerIndex }: ScoreBoardProps) {
  const maxScore = Math.max(...players.map(p => p.score));
  const leader = players.find(p => p.score === maxScore);
  const isTied = players.filter(p => p.score === maxScore).length > 1;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Scoreboard
        </h2>
        {!isTied && maxScore > 0 && (
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" />
            {leader?.name} Leading
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-300",
              index === currentPlayerIndex 
                ? "border-blue-500 bg-blue-50 shadow-md" 
                : "border-gray-200 bg-gray-50",
              player.score === maxScore && maxScore > 0 && !isTied 
                ? "ring-2 ring-yellow-400 bg-yellow-50" 
                : ""
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full text-white", player.color)}>
                  <Star className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">{player.name}</h3>
                  <p className="text-sm text-gray-600">
                    {index === currentPlayerIndex ? 'Current turn' : 'Waiting'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{player.score}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}