
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import userImg from "../../public/assets/icons/user.svg"
// import emailImg from "../../public/assets/icons/email.svg"
import {
    Form,

} from "@/components/ui/form"
import CustomFormField from "../ui/CustomFormField"
import { useState } from "react"
import { useRouter } from "next/navigation"
// import { createUser } from "@/lib/actions/patient.action"
import SubmitButton from "../ui/SubmitButton"
// import UserFormValidation from "@/lib/validations"
// import { AppointmentFormValidation } from "@/lib/validations"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { getAppointmentSchema } from "@/lib/validations"
import { Appointment } from "@/types/appwrite.types"




const AppointmentForm = ({ userId, patientId, type, appointment, setOpen }:
    {
        userId: string;
        patientId: string;
        type: "create" | 'cancel' | 'schedule';
        appointment?: Appointment;
        setOpen: (open: boolean) => void;

    }
) => {

    const [isLoading, setIsloading] = useState(false)
    const router = useRouter()

    const AppointmentFormValidation = getAppointmentSchema(type)


    // 1. Define your form.
    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : "",
            schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || ""
        },
    })


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        console.log("I am submitting", { type })
        setIsloading(true);

        let status;
        switch (type) {
            case 'schedule':
                status = 'scheduled';
                break;
            case 'cancel':
                status = 'cancelled';
                break;
            default:
                status = 'pending';
                break;

        }


        try {
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    note: values.note,
                    status: status as Status,
                }
                const appointment = await createAppointment(appointmentData)
                if (appointment) {
                    form.reset();
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }

            // if (user) router.push(`/patients/${user.$id}/register`)
            else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values?.primaryPhysician,
                        schedule: new Date(values?.schedule),
                        status: status as Status,
                        cancellationReason: values?.cancellationReason
                    },
                    type
                }
                const updatedAppointment = await updateAppointment(appointmentToUpdate);
                if (updatedAppointment) {
                    setOpen && setOpen(false);
                    form.reset();
                }
            }

        } catch (error) {
            console.log(error)
        }
        setIsloading(false);
    }


    let btnLabel;
    switch (type) {
        case 'cancel':
            btnLabel = 'Cancel Appointment'
            break;
        case 'create':
            btnLabel = 'Create Appointment'
            break;
        case 'schedule':
            btnLabel = 'Schedule Appointment'
            break;
        default:
            break;
    }



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
                {type === "create" && <section className="mb-12 space-y-5">
                    <h1 className="header">New Appointment</h1>
                    <p className="text-dark-700">Request a new  appointment</p>
                </section>}
                {
                    type !== 'cancel' && (
                        <>
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                name="primaryPhysician"
                                label="Doctor"
                                placeholder="Select a doctor"
                            >
                                {/* {console.log(Doctors)} */}
                                {Doctors.map((doctor) => (
                                    <SelectItem key={doctor.name} value={doctor.name}>
                                        <div className="flex cursor-pointer items-center gap-2">
                                            <Image
                                                src={doctor.image}
                                                width={32}
                                                height={32}
                                                alt={doctor.name}
                                                className="rounded-full border border-dark-500"
                                            />
                                            <p>{doctor.name}</p>

                                        </div>
                                    </SelectItem>
                                ))}
                            </CustomFormField>


                            <CustomFormField
                                fieldType={FormFieldType.DATE_PICKER}
                                control={form.control}
                                name="schedule"
                                label="Expected appointment date"
                                showTimeSelect
                                dateFormat="MM/dd/yyyy - h:mm aa"
                            />

                            <div className="flex flex-col gap-6 xl:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="reason"
                                    label="Reason for appointment"
                                    placeholder="Enter reason for appointment"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="note"
                                    label="Notes"
                                    placeholder="Enter notes"
                                />
                            </div>
                        </>
                    )
                }


                {
                    type === 'cancel' && (
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="cancellationReason"
                            label="Reason for cancellation"
                            placeholder="Enter reason for cancellation"
                        />
                    )
                }



                <SubmitButton isLoading={isLoading}
                    className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
                >
                    {btnLabel}</SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm