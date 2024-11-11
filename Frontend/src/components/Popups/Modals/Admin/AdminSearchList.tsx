interface UserProps {
    id: number
    first_name: string
    last_name: string
    email: string
    image: string
    roles: string[]
}

interface Props {
    users: UserProps[] 
    search: string
    open: boolean
    addAdmin: (id: number) => void
}

export default function AdminSearchList({ users, search, open, addAdmin }: Props) {

    const searchLower = search.toLowerCase();

    let filteredUsers: UserProps[] = [];

        filteredUsers = users.filter((user: UserProps) => {
            const isAdmin = user.roles.includes("admin");
            const matches = (
                user.first_name.toLowerCase().includes(searchLower) ||    
                user.last_name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
            return !isAdmin && matches;
        });

    const resultUsers = filteredUsers.slice(0, 5);

    return (
        open &&
        <ul className="w-full h-auto bg-slate-200 dark:bg-zinc-800 border text-black dark:text-white border-slate-300 dark:border-zinc-900 divide-y divide-slate-100 dark:divide-zinc-700 rounded-lg shadow-sm overflow-hidden absolute top-12 left-0">
            {
                resultUsers.length > 0 ? (
                    resultUsers.map((user: UserProps) => (
                        <li
                            key={user.id}
                            className="w-full h-12 px-4 py-4 flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                            onClick={() => addAdmin(user.id)}
                        >
                            <div className="flex items-center gap-4 w-10 h-10 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden border border-slate-300 dark:border-zinc-900">
                                <img
                                    src={user.image}
                                    alt={`${user.first_name.charAt(0).toUpperCase()} ${user.last_name.charAt(0).toUpperCase()}`}
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                />
                            </div>
                            <header className="flex flex-col">
                                <h1 className="text-base font-bold whitespace-nowrap leading-5">{user.first_name} {user.last_name}</h1>
                                <h2 className="text-sm leading-4 text-zinc-600 dark:text-slate-400">{user.email}</h2>
                            </header>
                        </li>
                    ))
                ) : (
                    <li
                        className="w-full h-12 px-4 py-2 flex items-center justify-between select-none"
                    >
                        <h1>No users found</h1>
                    </li>
                ) 
            }
        </ul>
    )
}