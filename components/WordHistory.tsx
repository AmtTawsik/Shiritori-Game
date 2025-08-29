"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Player {
  id: number;
  name: string;
  score: number;
  color: string;
}

interface GameWord {
  word: string;
  player: Player;
  timestamp: Date;
  isValid: boolean;
}

interface WordHistoryProps {
  words: GameWord[];
}

export default function WordHistory({ words }: WordHistoryProps) {
  const validWords = words.filter(w => w.isValid);
  const totalWords = validWords.length;

  return (
    <Card className="p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          Word History
        </h2>
        <Badge variant="outline">
          {totalWords} word{totalWords !== 1 ? 's' : ''}
        </Badge>
      </div>

      {words.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No words yet</p>
            <p className="text-sm">Start playing to see word history!</p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-3">
            {words.map((word, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200",
                  word.isValid 
                    ? "border-green-200 bg-green-50" 
                    : "border-red-200 bg-red-50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1 rounded-full text-white text-xs",
                      word.player.color
                    )}>
                      <div className="w-4 h-4 flex items-center justify-center font-bold">
                        {word.player.id}
                      </div>
                    </div>
                    <span className="font-medium text-sm">{word.player.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {word.isValid ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs text-gray-500">
                      {word.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <div className={cn(
                  "font-mono text-lg font-semibold",
                  word.isValid ? "text-green-700" : "text-red-700"
                )}>
                  {word.word}
                </div>
                
                {!word.isValid && word.word !== '[TIME UP]' && (
                  <div className="text-xs text-red-600 mt-1">
                    Invalid word - point deducted
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
}