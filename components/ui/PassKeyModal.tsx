
'use client'
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { set } from 'zod';
import { decryptKey, encryptKey } from '@/lib/utils';

const PassKeyModal = () => {
    const [open, setOpen] = useState(true);
    const router = useRouter()
    const [passkey, setPassKey] = useState("");
    const [error, setError] = useState("");
    const path = usePathname();

    const closeModal = () => {
        setOpen(false);
        router.push('/')
    }

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.
        getItem('accessKey') : null;


    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey);
        if (path) {
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                setOpen(false);
                router.push('/admin');

            } else {
                setOpen(true);
            }
        }

    }, [encryptedKey])


    const validatePassKey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);
            localStorage.setItem('accessKey', encryptedKey);
            setOpen(false)

        } else {
            setError("Invalid passkey!!")
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className='shad-alert-dialog'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex items-start justify-between'>
                        Admin Access Verification
                        <Image
                            src="/assets/icons/close.svg"
                            width={20}
                            height={20}
                            alt='close'
                            className='cursor-pointer'
                            onClick={() => closeModal()}
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                    <InputOTP maxLength={6}
                        value={passkey}
                        onChange={(value) => setPassKey(value)}>
                        <InputOTPGroup className='shad-otp'>
                            <InputOTPSlot index={0} className='shad-otp-slot' />
                            <InputOTPSlot index={1} className='shad-otp-slot' />
                            <InputOTPSlot index={2} className='shad-otp-slot' />
                            <InputOTPSlot index={3} className='shad-otp-slot' />
                            <InputOTPSlot index={4} className='shad-otp-slot' />
                            <InputOTPSlot index={5} className='shad-otp-slot' />
                        </InputOTPGroup>
                    </InputOTP>

                    {
                        error && <p className='shad-error text-14-regular mt-4 flex justify-center'>
                            {error}
                        </p>
                    }

                </div>
                <AlertDialogFooter>
                    <AlertDialogAction
                        className='shad-primary-btn w-full'
                        onClick={(e) => validatePassKey(e)}
                    >
                        Enter Admin PassKey
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default PassKeyModal