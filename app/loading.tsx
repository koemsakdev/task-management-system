"use client";
import React from 'react';
import { Loader } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-5'>
        <Loader className='size-6 text-muted-foreground animate-spin' />
    </div>
  )
}

export default ErrorPage