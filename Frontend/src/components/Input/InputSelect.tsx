import InputDropdown from "./InputDropdown"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion";

interface InputProps {
    inputName: string;
    dropdownData: string[];
    register: unknown;
}

export default function InputSelect({ inputName, dropdownData, register, setValue }: InputProps) {
    const [option, setOption] = useState(dropdownData[dropdownData.length - 1]);
    const [open, setOpen] = useState<boolean>(false);

    const selectOption = (option: string) => {
        setOption(option);
        setOpen(false);
    }

    useEffect(() => {
        setValue("productCategory", option);
    }, [option])

    return (
        <div className="flex flex-col gap-0.5 relative pb-6">
            <label 
                htmlFor={inputName} 
                className="
                    text-base font-semibold ml-2 bg-clip-text text-transparent
                    bg-gradient-to-tr from-[#C29469] via-[#ccc5c3] to-[#C29469]
                "
            >
                {inputName.charAt(0).toUpperCase() + inputName.slice(1)}
            </label>

            <div 
                className="
                    w-full h-min rounded-full p-0.5
                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                "
            >
                <div 
                    className="
                        w-full h-full rounded-full overflow-hidden
                        dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF]
                    "
                >
                    <input 
                        type="text"
                        name={inputName}
                        readOnly
                        {...register}
                        onClick={() => setOpen(!open)}
                        value={option}
                        className="
                            w-full h-full bg-transparent py-2 px-4 dark:text-white cursor-pointer
                        "
                    />
                </div>
            </div>
            
            {
                open &&
                <AnimatePresence mode="wait">
                    <motion.div
                        key="dropdown"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full origin-top absolute top-[4.5rem] left-0 z-10"
                    >
                        <InputDropdown data={dropdownData} click={selectOption} />
                    </motion.div>
                </AnimatePresence>
            }
        </div>
    )
}