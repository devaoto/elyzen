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
          className='fixed -top-1 z-[69454] mx-auto flex w-full justify-between px-10 py-2 md:px-4 lg:px-4'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Link href={'/'}>
            <h1 className='text-2xl font-bold text-black dark:text-white md:text-4xl lg:text-4xl'>
              Ely<span className='text-[#00FF7F]'>zen</span>
            </h1>
          </Link>
          <SearchIcon className='size-5 md:size-8 lg:size-8' />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
