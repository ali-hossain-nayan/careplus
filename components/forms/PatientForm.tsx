
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
import { createUser } from "@/lib/actions/patient.action"
import { UserFormValidation } from "@/lib/validations"
export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "dataPicker",
    SELECT = "select",
    SKELETON = "skeleton"
}



const PatientForm = () => {

    const [isLoading, setIsloading] = useState(false)
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
        setIsloading(true);

        try {
            const userData = { name, email, phone }
            const user = await createUser(userData);
            if (user) router.push(`/patients/${user.$id}/register`)

        } catch (error) {
            console.log(error)
        }
        setIsloading(false);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
                <section className="mb-12 space-y-5">
                    <h1 className="header">Hi,there...</h1>
                    <p className="text-dark-700">Schudle your first appointment</p>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    // passing the control prop to the CustomFormField component means that the component will be able to access the form's state and methods, such as validation and submission.
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="Christan Bale"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"


                />
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
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
                // iconSrc={userImg}
                // iconAlt="user"


                />
                <SubmitButton isLoading={isLoading} >Get Started..</SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm