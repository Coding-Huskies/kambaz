"use client";

import { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';

export default function QuizTimer({ timeLimit, onTimeUp }: { timeLimit: number, onTimeUp: () => void }) {
  const [remainingTime, setRemainingTime] = useState(timeLimit * 60);

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [remainingTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="wd-quiz-timer">
      <Badge bg="warning" text="dark" className="p-2">
        Time Remaining: {formatTime(remainingTime)}
      </Badge>
    </div>
  );
}
