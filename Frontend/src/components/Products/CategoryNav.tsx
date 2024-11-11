import CategoryItem from "./CategoryItem";

export default function CategoryNav() {

    const categories = [
        {
            name: "Visos kavos",
            icon: "tabler:cup"
        },
        {
            name: "Kavos pupelės",
            icon: "game-icons:coffee-beans"
        },
        {
            name: "Aromatizuota kava",
            icon: "tabler:coffee"
        },
        {
            name: "Kavos be kafeino",
            icon: "tabler:cup-off"
        },
        {
            name: "Šalta kava",
            icon: "game-icons:soda-can"
        },
        {
            name: "Specijalios kavos",
            icon: "tabler:gift"
        },
        {
            name: "Kitos kavos",
            icon: "game-icons:coffee-pot"
        }
    ]

    return (
        <div className="flex flex-col gap-4">
            
            <section className="w-full h-min flex items-center gap-12 justify-center">
                {categories.map((category) => (
                    <CategoryItem
                        key={category.name}
                        category={category.name}
                        icon={category.icon}
                    />
                ))}
            </section>

            <hr className="w-full h-1 rounded-full bg-gradient-to-tr dark:from-[#C29469] dark:via-[#ccc5c3] dark:to-[#C29469] from-[#3b2d2b] via-[#66564c] to-[#3b2d2b]"/>
        </div>
    )
}