'use client';

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const Countdown = ({ airingAt }: { airingAt: number }) => {
  const calculateTimeRemaining = () => {
    const currentTime = Date.now();
    const timeRemaining = airingAt * 1000 - currentTime;
    return timeRemaining;
  };

  const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airingAt]);

  return (
    <div className=''>
      {timeRemaining > 0 ? (
        <div className='flex items-center text-lg font-semibold'>
          <Clock className='mr-2 h-6 w-6' />
          <span>Time until next episode: {formatTime(timeRemaining)}</span>
        </div>
      ) : null}
    </div>
  );
};

export default Countdown;
