'use client';

import React from 'react';

export function Avatar({ initials, color = 'bg-indigo-600' }) {
  return (
    <div className={`${color} w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold`}>
      {initials}
    </div>
  );
}
