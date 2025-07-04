import React from 'react'
import Image from 'next/image'
import { Button } from './button'
// import spinner from '../../public/assets/icons/loader.svg'

interface ButtonProps {
    isLoading: boolean,
    className?: string,
    children: React.ReactNode
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
    return (
        <Button
            type='submit'
            disabled={isLoading}
            className={className ?? "shad-primary-btn w-full"}
        >
            {
                isLoading ? (
                    <div className='flex items-center gap-4'>
                        <Image
                            src="/assets/icons/loader.svg"
                            alt='loader'
                            width={24}
                            height={24}
                            className='animate-spin'
                        />
                        Loading......
                    </div>
                ) : children
            }

        </Button>
    )
}

export default SubmitButton