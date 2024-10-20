import { Link } from "react-router-dom";

export default function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <Link to={to} className="whitespace-nowrap text-center w-min h-7 overflow-hidden group">
            <div className="group-hover:-mt-7 transition-[margin] duration-300">
                <h1 className="text-coffee-400 dark:text-white">{children}</h1>
                <h1 className="text-coffee-200">{children}</h1>
            </div>
        </Link>
    )
}

//<Link to="/products" className="w-28 whitespace-nowrap text-center">Our Coffee</Link>