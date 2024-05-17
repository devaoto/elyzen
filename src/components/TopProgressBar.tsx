'use client';

import { Suspense } from 'react';
import { AppProgressBar } from 'next-nprogress-bar';

export default function TopProgressBar() {
  return (
    <Suspense>
      <AppProgressBar
        height='4px'
        color='#FFFFFF'
        options={{ showSpinner: false }}
        shallowRouting
      />
    </Suspense>
  );
}
