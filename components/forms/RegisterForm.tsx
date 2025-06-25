


"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
// import userImg from "../../public/assets/icons/user.svg"
import {
    Form,
    FormControl,
} from "@/components/ui/form"
import CustomFormField from "../ui/CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.action"
import { FormFieldType } from "./PatientForm"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import FileUploader from "../ui/FileUploader"
import { PatientFormValidation } from "@/lib/validations"


const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setIsloading] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },

    })

    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        setIsloading(true);

        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            // create a new FormData object
            //blobFile is an object of type file that browser creates when we upload a file and browser can read it
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            })

            formData = new FormData();
            formData.append('blobFile', blobFile);
            formData.append('fileName', values.identificationDocument[0].name)
        }


        try {
            const patientData = {
                ...values,
                userId: user.$id,
                birthDate: new Date(values.birthDate),
                identificationDocument: formData
            }
            //@ts-ignore
            const patient = await registerPatient(patientData);
            if (patient) {
                router.push(`/patients/${user.$id}/new-appointment`)
            }

        } catch (error) {
            console.log(error)
        }
        setIsloading(false);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Welcome</h1>
                    <p className="text-dark-700">Let us know more about yourself!</p>
                </section>
                <section className=" space-y-6">
                    <div className="space-y-1 mb-9">
                        <h1 className="sub-header">Personal Information</h1>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Christan Bale"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="email"
                        label="Email address"
                        placeholder="chris@gmail.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="user"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.PHONE_INPUT}
                        control={form.control}
                        name="phone"
                        label="Phone number"
                        placeholder="444-333-111"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="birthDate"
                        label="Date of birth"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option, i) => (
                                        <div key={option + i} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="address"
                        label="Address"
                        placeholder="10th Street, Down town, Dhanmondi"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="occupation"
                        label="Occupation"
                        placeholder="Software Engineer"
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactName"
                        label="Emergency contact name"
                        placeholder="Guardian's name"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="emergencyContactNumber"
                        label="Emergency contact number"
                        placeholder="666-555-444"
                    />
                </div>



                <section className=" space-y-6">
                    <div className="space-y-1 mb-9">
                        <h1 className="sub-header">Medical Information</h1>
                    </div>
                </section>
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    label="Primary care physician"
                    placeholder="Select a physician"
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
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insuranceProvider"
                        label="Insurance provider"
                        placeholder="BlueCross BlueShield"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="insurancePolicyNumber"
                        label="Insurance policy number"
                        placeholder="ABC123456789"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, Penicillin, Pollen"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="currentMedication"
                        label="Current medications"
                        placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="familyMedicalHistory"
                        label=" Family medical history (if relevant)"
                        placeholder="Mother had brain cancer, Father has hypertension"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="pastMedicalHistory"
                        label="Past medical history"
                        placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                    />
                </div>



                <section className=" space-y-6">
                    <div className="space-y-1 mb-9">
                        <h1 className="sub-header">Identification and Verification</h1>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="identification"
                    label="Identification type"
                    placeholder="Select an identification type"
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type} className="cursor-pointer">
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="987523"
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned copy of identification document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />


                <section className=" space-y-6">
                    <div className="space-y-1 mb-9">
                        <h1 className="sub-header">Consent and Privacy</h1>
                    </div>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to treatment"
                />
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to disclosure of information"
                />
                <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacy policy"
                />

                <SubmitButton isLoading={isLoading} >Get Started..</SubmitButton>
            </form>
        </Form>
    )
}

export default RegisterForm  