import { useState } from "react"

interface InputProps {
    type: string
    inputName: string
    placeholder: string
    error?: string
    register?: unknown
    currency?: string
}


export default function InputText({ type, inputName, placeholder, error, register, currency }: InputProps) {
    return (
        <div className="flex flex-col gap-0.5">
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
                    w-full h-min p-0.5 flex gap-0.5 rounded-full
                    bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]
                "
            >
                <div 
                    className={`
                        grow h-full overflow-hidden ${type === "unit" || type === "number" && currency ? "rounded-l-full rounded-r-lg" : "rounded-full"}
                        dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF]
                    `}
                >
                    <input 
                        type={type === "number" ? "text" : type}
                        name={inputName}
                        placeholder={placeholder}
                        {...register}
                        onKeyDown={type === "number" ? function(event) {
                            if(isNaN(event.key) && event.key !== 'Backspace' && event.key !== '.') {
                              event.preventDefault();
                            }
                          } : undefined}
                        step={type === "number" ? "0.01" : undefined}
                        className="
                            w-full h-full bg-transparent py-2 px-4 dark:text-white appearance-none
                        "
                    />
                </div>

                {
                    type === "unit" && (
                        <div
                            className="
                                rounded-r-full relative grid
                                w-16 dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF]
                            "
                        >
                            <input type="text" className="w-full h-full bg-transparent outline-none text-center dark:text-white" readOnly value="g" />
                        </div>
                    )
                }

                {
                    type === "number" && currency && (
                        <div
                            className="
                                rounded-r-full relative grid
                                w-16 dark:bg-[#3b2d2b] dark:hover:bg-[#66564c] hover:bg-[#F2CEA9] bg-[#EFD8BF]
                            "
                        >
                            <input type="text" className="w-full h-full bg-transparent outline-none text-center dark:text-white" readOnly value="€" />
                        </div>
                    )
                }
            </div>
            {error ? <p className="text-red-500 text-sm mt-1 ml-2">{error}</p> : <p className="w-full h-6"></p>}
        </div>
    )
}