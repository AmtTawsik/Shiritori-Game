"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
}

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  lastLetter?: string;
}

export default function PlayerCard({ player, isActive, lastLetter }: PlayerCardProps) {
  return (
    <Card className={cn(
      "p-6 transition-all duration-300",
      isActive 
        ? "ring-2 ring-blue-500 bg-blue-50 border-blue-200" 
        : "bg-gray-50 opacity-60"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-full text-white",
            player.color
          )}>
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{player.name}</h3>
            <p className="text-gray-600">
              {isActive ? "Your turn!" : "Waiting..."}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">{player.score}</div>
          <div className="text-sm text-gray-600">points</div>
        </div>
      </div>

      {isActive && lastLetter && (
        <div className="mt-4 p-3 bg-white rounded-lg border">
          <div className="text-sm text-gray-600 mb-1">Next word must start with:</div>
          <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
            {lastLetter.toUpperCase()}
          </Badge>
        </div>
      )}
    </Card>
  );
}