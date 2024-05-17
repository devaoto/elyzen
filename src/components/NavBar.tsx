'use client';

import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function NavBar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key='navbar'
          className='fixed -top-1 z-[69454] mx-auto flex w-full justify-between px-4 py-2'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={'/'}>
            <h1 className='text-4xl font-bold text-white'>
              Ely<span className='text-[#00FF7F]'>zen</span>
            </h1>
          </Link>
          <SearchIcon className='h-8 w-8' />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
