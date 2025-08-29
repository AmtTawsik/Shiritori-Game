"use client";

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameTimerProps {
  timeLeft: number;
  totalTime: number;
  onTimeUp: () => void;
  isActive: boolean;
  onTick: (time: number) => void;
}

export default function GameTimer({ 
  timeLeft, 
  totalTime, 
  onTimeUp, 
  isActive, 
  onTick 
}: GameTimerProps) {
  
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      const newTime = timeLeft - 1;
      onTick(newTime);
      
      if (newTime <= 0) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp, onTick]);

  const progressValue = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <Card className={cn(
      "p-6 transition-all duration-300",
      isCritical && "ring-2 ring-red-500 bg-red-50",
      isUrgent && !isCritical && "ring-2 ring-yellow-500 bg-yellow-50"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
          ) : (
            <Clock className="h-5 w-5 text-gray-600" />
          )}
          <span className="font-medium">Time Remaining</span>
        </div>
        <div className={cn(
          "text-2xl font-bold",
          isCritical && "text-red-600 animate-pulse",
          isUrgent && !isCritical && "text-yellow-600"
        )}>
          {timeLeft}s
        </div>
      </div>
      
      <Progress 
        value={progressValue} 
        className={cn(
          "h-3 transition-all duration-300",
          isCritical && "bg-red-100",
          isUrgent && !isCritical && "bg-yellow-100"
        )}
      />
    </Card>
  );
}