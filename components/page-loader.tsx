import { Loader } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='flex items-center justify-center h-full'>
        <Loader className='size-5 animate-spin text-muted-foreground' />
    </div>
  )
}

export default PageLoader