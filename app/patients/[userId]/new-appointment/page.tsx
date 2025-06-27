"use client";
import AppointmentForm from '@/components/forms/AppointmentForm';
import { getPatient } from '@/lib/actions/patient.action';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

type Patient = {
  $id: string;
  // Add other patient properties here as needed
};

type SearchParamProps = {
  params: {
    userId: string;
  };
};

const NewAppointment = ({ params: { userId } }: SearchParamProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientData = await getPatient(userId);
        if (patientData && typeof patientData === 'object' && '$id' in patientData) {
          setPatient(patientData as Patient);
        } else {
          throw new Error('Invalid patient data');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

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

            <AppointmentForm
              type="create"
              userId={userId}
              patientId={patient.$id}
              appointment={undefined}
            />
            <p className='copyright mt-10 py-12'>
              &copy; 2024 MediCare
            </p>
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
  );
};

export default NewAppointment;