'use server'
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment, Patient } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

type Status = 'pending' | 'scheduled' | 'cancelled';

type CreateAppointmentParams = {
  patient: Patient | string; // Can be either full patient object or just ID
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason?: string;
  note?: string;
  userId: string;
};

type UpdateAppointmentParams = {
  appointmentId: string;
  appointment: Partial<Omit<Appointment, '$id' | '$collectionId' | '$databaseId'>>;
  userId?: string;
  type?: 'statusChange' | 'reschedule' | 'other';
};

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  if (!DATABASE_ID || !APPOINTMENT_COLLECTION_ID) {
    throw new Error('Appwrite configuration is incomplete');
  }

  try {
    const patientId = typeof appointment.patient === 'string' 
      ? appointment.patient 
      : appointment.patient.$id;

   const newAppointment = await databases.createDocument(
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  ID.unique(),
  {
    patient: patientId, // <-- Correct field name here
    schedule: appointment.schedule.toISOString(),
    status: appointment.status,
    primaryPhysician: appointment.primaryPhysician,
    reason: appointment.reason,
    note: appointment.note,
    userId: appointment.userId
  }
);

    return parseStringify(newAppointment);
  } catch (error) {
    console.error("Failed to create appointment:", error);
    throw error;
  }
};

export const getAppointment = async (appointmentId: string) => {
  if (!DATABASE_ID || !APPOINTMENT_COLLECTION_ID) {
    throw new Error('Appwrite configuration is incomplete');
  }

  try {
    const appointment = await databases.getDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId
    );
    return parseStringify(appointment as Appointment);
  } catch (error) {
    console.error("Failed to get appointment:", error);
    throw error;
  }
};

export const getRecentAppointmentList = async () => {
  if (!DATABASE_ID || !APPOINTMENT_COLLECTION_ID) {
    throw new Error('Appwrite configuration is incomplete');
  }

  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(50)]
    );

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        acc[`${appointment.status}Count`] += 1;
        return acc;
      },
      { scheduledCount: 0, pendingCount: 0, cancelledCount: 0 }
    );

    return parseStringify({
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents as Appointment[]
    });
  } catch (error) {
    console.error("Failed to get appointments:", error);
    throw error;
  }
};

export const updateAppointment = async ({
  appointmentId,
  appointment,
  userId,
  type
}: UpdateAppointmentParams) => {
  if (!DATABASE_ID || !APPOINTMENT_COLLECTION_ID) {
    throw new Error('Appwrite configuration is incomplete');
  }

  try {
    const updateData = {
      ...appointment,
      ...(appointment.schedule && { schedule: appointment.schedule.toISOString() }),
      ...(type === 'statusChange' && userId ? { updatedBy: userId } : {})
    };

    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID,
      APPOINTMENT_COLLECTION_ID,
      appointmentId,
      updateData
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found!");
    }

    revalidatePath("/admin");
    return parseStringify(updatedAppointment as Appointment);
  } catch (error) {
    console.error("Failed to update appointment:", error);
    throw error;
  }
};