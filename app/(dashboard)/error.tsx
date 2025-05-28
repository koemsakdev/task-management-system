"use client";
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

const ErrorPage = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-5'>
        <AlertTriangle className='size-10 text-red-500' />
        <p className="text-sm text-muted-foreground">
            Something went wrong. Please try again later.
        </p>

        <Button
            variant='secondary'
            size={"sm"}
            asChild
            className='text-sm bg-lime-100 hover:bg-lime-200 text-lime-500 hover:text-lime-600'
        >
            <Link href={"/"}>
                Go back
            </Link>
        </Button>
    </div>
  )
}

export default ErrorPage