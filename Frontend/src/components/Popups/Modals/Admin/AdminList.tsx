import { useEffect } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"

interface AdminProps {
    id: number
    first_name: string
    last_name: string
    email: string
    image: string
    roles: string[]
}

export default function AdminList({ getAdmins, admins, removeAdmin }: { getAdmins: () => void, admins: AdminProps[], removeAdmin: (id: number) => void }) {
    

    useEffect(() => {
        getAdmins();
    }, [])

    return (
        <ul className="w-full h-min max-h-[400px] overflow-y-scroll p-4 divide-y divide-slate-200 dark:divide-zinc-800">
            {
            admins 
            ?
            (
                admins.map((admin: AdminProps) => (
                    <li key={admin.id} className="flex items-center justify-between text-black dark:text-white py-2 select-none">
                        <section className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-red-400">
                                <img 
                                    src={admin.image} 
                                    alt={`${admin.first_name.charAt(0).toUpperCase()} ${admin.last_name.charAt(0).toUpperCase()}`} 
                                    className="w-full h-full flex items-center justify-center"
                                />
                            </div>
                            <header className="flex flex-col">
                                <h1 className="text-base font-bold leading-5">{admin.first_name} {admin.last_name}</h1>
                                <h2 className="text-sm leading-4">{admin.email}</h2>
                            </header>
                        </section>

                        <section className="flex items-center gap-1">
                            <button 
                                className="w-8 h-8 bg-red-500 dark:bg-red-400 rounded-md text-white grid place-items-center"
                                onClick={() => removeAdmin(admin.id)}
                            >
                                <Icon icon="tabler:trash" className="w-5 h-5"/>
                            </button>
                        </section>
                    </li>
                ))
            )
            :
            <p>No admins found</p>
            }
        </ul>

    )
}