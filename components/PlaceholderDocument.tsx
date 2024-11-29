"use client"

import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'


function PlaceholderDocument() {
    const router = useRouter();
    const handleClick = async ()=>{   
        router.push("/dashboard/upload");
    }
  return (
    <div>
        <Button onClick={handleClick}>
            +
        </Button>
    </div>
  )
}

export default PlaceholderDocument