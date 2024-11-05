import Image from 'next/image'
import React from 'react'
// import register from '../../../../../src/public/assets/images/register-img.png'
import Link from 'next/link'
import { getUser } from '@/lib/actions/patient.action'
import RegisterForm from '@/components/forms/RegisterForm'


const Register = async ({ params: { userId } }: SearchParamProps) => {
    const user = await getUser(userId);

    return (
        <>
            <div className='flex h-screen max-h-screen'>
                <section className='remove-scrollbar container '>
                    <div className='sub-container max-w-[860px] flex-col py-10'>
                        <Image
                            src="/assets/icons/logo-full.svg"
                            height={1000}
                            width={1000}
                            alt="patient"
                            className="mb-12 h-10 w-fit"
                        />
                        <RegisterForm user={user} />
                        <p className='copyright py-12'>
                            &copy; 2024 MediCare</p>
                        {/* <div className='text-14-regular mt-20 flex justify-between'>
                            <Link href="/?admin=true" className='text-green-500'>Admin</Link>
                        </div> */}

                    </div>
                </section>
                <Image
                    src="/assets/images/register-img.png"
                    height={1000}
                    width={1000}
                    alt='patient'
                    className='side-img max-w-[390px]'
                />
            </div>
        </>
    )
}

export default Register