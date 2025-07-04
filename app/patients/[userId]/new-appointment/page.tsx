import AppointmentForm from '@/components/forms/AppointmentForm'
import { getPatient } from '@/lib/actions/patient.action';
import Image from 'next/image'
import React from 'react'

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
  return (
    <>
      <div className='flex h-screen max-h-screen'>
        <section className='remove-scrollbar container my-auto'>
          <div className='sub-container max-w-[860px] flex-1 justify-between'>
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            />

            {/* <PatientForm /> */}
            <AppointmentForm
              type="create"
              userId={userId}
              patientId={patient.$id}
            />
            <p className='copyright mt-10 py-12'>
              &copy; 2024 MediCare</p>
          </div>
        </section>
        <Image
          src="/assets/images/appointment-img.png"
          height={1000}
          width={1000}
          alt='appointment'
          className='side-img max-w-[390px] bg-bottom'
        />
      </div>
    </>
  )
}

export default NewAppointment