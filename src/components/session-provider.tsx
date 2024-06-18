'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';
import { toast } from 'sonner';

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasToastShown = sessionStorage.getItem('toastShown');

      if (!hasToastShown && session?.user) {
        toast.success(
          `Welcome Back, ${session.user.name}! You are currently logged in. Enjoy your time with us.`
        );
        sessionStorage.setItem('toastShown', 'true');
      }
    }
  }, [session]);

  return (
    <SessionProvider session={session}>
      <SkeletonTheme
        baseColor='#18181b'
        highlightColor='#1e1e24'
        borderRadius={'0.5rem'}
      >
        {children}
      </SkeletonTheme>
    </SessionProvider>
  );
}
