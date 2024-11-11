import { Link } from "react-router-dom";

export default function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <Link to={to} className="whitespace-nowrap text-center min-w-24 w-24 h-7 overflow-hidden group hidden lg:block">
            <div 
                className="
                    group-hover:-mt-7 transition-[margin] duration-300 bg-clip-text text-transparent font-semibold
                    bg-gradient-to-tr from-[#C29469] via-[#ccc5c3] to-[#C29469] dark:from-[#3b2d2b] dark:via-[#66564c] dark:to-[#3b2d2b]
                "
            >
                <h1 className="">{children}</h1>
                <h1 className="text-white">{children}</h1>
            </div>
        </Link>
    )
}

//<Link to="/products" className="w-28 whitespace-nowrap text-center">Our Coffee</Link>