import { ReactNode } from "react";

interface DropdownProps {
    children: ReactNode[];
  }

export default function Dropdown({ children }: DropdownProps) {
    return (
        <main className="
            w-min h-min p-0.5 absolute top-14 right-0 rounded-lg
            bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
        ">
            <div className="
                w-full h-full rounded-md p-2
                dark:bg-[#3b2d2b] bg-[#EFD8BF]
            ">
                {children}
            </div>
        </main>
    )
}