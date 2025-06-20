import React from 'react'
import Image from 'next/image'

function Loading() {
  return (
    <div className='flex items-center justify-center h-dvh'>
      <Image src="/images/login_logo.png" alt="Login Logo" width={200} height={200} />
    </div>
  )
}

export default Loading