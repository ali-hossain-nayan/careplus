
// 'use client'
import StatCard from '@/components/ui/StatCard'
import { columns } from '@/components/ui/table/columns'
// import { columns, Payment } from '@/components/ui/table/Columns'
import { DataTable } from '@/components/ui/table/DataTable'
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import { columns } from "@/components/table/columns";




const Admin = async () => {
    const appointments = await getRecentAppointmentList()

    // const data = await getData()
    return (
        <div className='mx-auto flex flex-col max-w-7xl space-y-14'>
            <header className="admin-header">
                <Link href="/" className='cursor-pointer'>
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={32}
                        width={162}
                        alt='logo'
                        className='h-8 w-fit'
                    />
                </Link>
                <p className="text-16-semibold">Admin Dashboard</p>
            </header>

            <main className="admin-main">
                <section className="w-full space-y-4">
                    <h1 className="header">Welcome</h1>
                    <p className="text-dark-700">
                        Start the day with managing new appointment
                    </p>
                </section>


                <section className="admin-stat">
                    <StatCard
                        type="appointments"
                        count={appointments.scheduledCount}
                        label="Scheduled appointments"
                        icon="/assets/icons/appointments.svg"
                    />
                    <StatCard
                        type="pending"
                        count={appointments.pendingCount}
                        label="Pending appointments"
                        icon="/assets/icons/pending.svg"
                    />
                    <StatCard
                        type="cancelled"
                        count={appointments.cancelledCount}
                        label="Cancelled appointments"
                        icon="/assets/icons/cancelled.svg"
                    />
                </section>

                <DataTable columns={columns} data={appointments.documents} />
                {/* <DataTable columns={columns} data={data} /> */}
            </main>

        </div>
    )
}

export default Admin