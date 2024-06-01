'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@nextui-org/react';

export default function Settings() {
  const [isTrailerEnabled, setIsTrailerEnabled] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsTrailerEnabled(checked);
    if (typeof window !== 'undefined') {
      localStorage.setItem('watchTrailer', JSON.stringify(checked));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('watchTrailer');
      if (savedState !== null) {
        setIsTrailerEnabled(JSON.parse(savedState));
      }
    }
  }, []);

  return (
    <div className='container h-screen'>
      <h1 className='mb-10 text-4xl font-bold'>Settings</h1>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl font-bold'>Watch Trailer</h1>
          <p>Play the hero trailer on the home page</p>
        </div>
        <Switch
          color='primary'
          isSelected={isTrailerEnabled}
          onChange={(e) => handleSwitchChange(e.target.checked)}
        />
      </div>
    </div>
  );
}
