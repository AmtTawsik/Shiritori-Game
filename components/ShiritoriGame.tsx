"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Clock, Trophy, History } from 'lucide-react';
import { validateWord } from '@/lib/dictionary-api';
import { cn } from '@/lib/utils';
import GameTimer from './GameTimer';
import PlayerCard from './PlayerCard';
import WordHistory from './WordHistory';
import ScoreBoard from './ScoreBoard';

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

const INITIAL_PLAYERS: Player[] = [
  { id: 1, name: 'Player 1', score: 0, color: 'bg-blue-500' },
  { id: 2, name: 'Player 2', score: 0, color: 'bg-purple-500' }
];

const TURN_TIME = 30; // seconds

export default function ShiritoriGame() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [wordHistory, setWordHistory] = useState<GameWord[]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [isValidating, setIsValidating] = useState(false);
  const [lastLetter, setLastLetter] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(TURN_TIME);
  const [error, setError] = useState<string>('');
  const [isProcessingInvalid, setIsProcessingInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentPlayer = players[currentPlayerIndex];
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

  const resetGame = useCallback(() => {
    setPlayers(INITIAL_PLAYERS);
    setCurrentPlayerIndex(0);
    setCurrentWord('');
    setWordHistory([]);
    setGameStatus('waiting');
    setLastLetter('');
    setTimeLeft(TURN_TIME);
    setError('');
  }, []);

  const startGame = () => {
    setGameStatus('playing');
    setTimeLeft(TURN_TIME);
  };

  const switchPlayer = useCallback(() => {
    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentWord('');
    setTimeLeft(TURN_TIME);
    setError('');
    setIsProcessingInvalid(false);
  }, [nextPlayerIndex]);

  // Auto-focus input when player changes
  useEffect(() => {
    if (gameStatus === 'playing' && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex, gameStatus]);

  const handleTimeUp = useCallback(() => {
    if (isValidating || isProcessingInvalid) return;
    
    // Current player loses a point for time running out
    setPlayers(prev => prev.map(player => 
      player.id === currentPlayer.id 
        ? { ...player, score: Math.max(0, player.score - 1) }
        : player
    ));
    
    const newWord: GameWord = {
      word: '[TIME UP]',
      player: currentPlayer,
      timestamp: new Date(),
      isValid: false
    };
    
    setWordHistory(prev => [...prev, newWord]);
    switchPlayer();
  }, [currentPlayer, switchPlayer, isValidating, isProcessingInvalid]);

  const validateAndSubmitWord = async () => {
    if (!currentWord.trim() || isValidating) return;

    const word = currentWord.trim().toLowerCase();
    setIsValidating(true);
    setIsProcessingInvalid(true);
    setError('');

    let errorMessage = '';
    let isValid = false;

    // Check all validation rules
    if (word.length < 4) {
      errorMessage = 'Word must be at least 4 letters long';
    } else if (wordHistory.some(w => w.word.toLowerCase() === word && w.isValid)) {
      errorMessage = 'Word has already been used';
    } else if (lastLetter && word[0] !== lastLetter.toLowerCase()) {
      errorMessage = `Word must start with "${lastLetter.toUpperCase()}"`;
    } else {
      // Only check dictionary if other rules pass
      try {
        isValid = await validateWord(word);
        if (!isValid) {
          errorMessage = 'Not a valid English word';
        }
      } catch {
        errorMessage = 'Not a valid English word';
      }
    }

    if (isValid) {
      // Word is valid - add points and update game state
      setPlayers(prev => prev.map(player => 
        player.id === currentPlayer.id 
          ? { ...player, score: player.score + 1 }
          : player
      ));

      const newWord: GameWord = {
        word: word,
        player: currentPlayer,
        timestamp: new Date(),
        isValid: true
      };

      setWordHistory(prev => [...prev, newWord]);
      setLastLetter(word[word.length - 1]);
      switchPlayer();
    } else {
      // Word is invalid - deduct point and add to history once
      setError(errorMessage);
      
      setPlayers(prev => prev.map(player => 
        player.id === currentPlayer.id 
          ? { ...player, score: Math.max(0, player.score - 1) }
          : player
      ));

      const newWord: GameWord = {
        word: word,
        player: currentPlayer,
        timestamp: new Date(),
        isValid: false
      };

      setWordHistory(prev => [...prev, newWord]);
      
      setTimeout(() => {
        switchPlayer();
      }, 2000);
    }

    setIsValidating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmitWord();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isValidating) {
      e.preventDefault();
      validateAndSubmitWord();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Shiritori Game
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Take turns creating words that start with the last letter of the previous word. 
          Words must be at least 4 letters long and cannot be repeated!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Board */}
          <ScoreBoard players={players} currentPlayerIndex={currentPlayerIndex} />

          {/* Game Status */}
          {gameStatus === 'waiting' && (
            <Card className="p-8 text-center">
              <Trophy className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Ready to Start?</h2>
              <p className="text-gray-600 mb-6">
                The first player can start with any word of at least 4 letters.
              </p>
              <Button onClick={startGame} size="lg" className="min-w-32">
                Start Game
              </Button>
            </Card>
          )}

          {gameStatus === 'playing' && (
            <div className="space-y-6">
              {/* Current Player Turn */}
              <PlayerCard 
                player={currentPlayer}
                isActive={true}
                lastLetter={lastLetter}
              />

              {/* Timer */}
              <GameTimer 
                timeLeft={timeLeft}
                totalTime={TURN_TIME}
                onTimeUp={handleTimeUp}
                isActive={gameStatus === 'playing'}
                onTick={setTimeLeft}
              />

              {/* Word Input */}
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="word-input" className="block text-sm font-medium mb-2">
                      {lastLetter 
                        ? `Enter a word starting with "${lastLetter.toUpperCase()}":`
                        : 'Enter any word to start (minimum 4 letters):'
                      }
                    </label>
                    <div className="flex gap-3">
                      <Input
                        ref={inputRef}
                        id="word-input"
                        type="text"
                        value={currentWord}
                        onChange={(e) => setCurrentWord(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your word..."
                        disabled={isValidating}
                        className={cn(
                          "text-lg py-3",
                          error && "border-red-500 focus:border-red-500"
                        )}
                        autoFocus
                      />
                      <Button 
                        type="submit" 
                        disabled={!currentWord.trim() || isValidating}
                        size="lg"
                        className="px-8"
                      >
                        {isValidating ? 'Checking...' : 'Submit'}
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}
                </form>
              </Card>

              {/* Game Actions */}
              <div className="flex justify-center">
                <Button variant="outline" onClick={resetGame} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset Game
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Word History Sidebar */}
        <div className="lg:col-span-1">
          <WordHistory words={wordHistory} />
        </div>
      </div>
    </div>
  );
}