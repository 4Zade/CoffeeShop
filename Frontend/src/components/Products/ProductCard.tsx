
import AddToCart from "./AddToCart";
export interface ProductProps {
  name: string;
  image: string
  price: { $numberDecimal: string }
  description: string
  id: number
  liked: number
}

export interface CardInterface{
  product: ProductProps
  loading: boolean
}

export default function ProductCard({ product }: CardInterface) {
  return (
    <main className="flex flex-col items-center justify-center h-[100vh] w-[100vw]">{" "} {/* better view for testing */}
      <section
        className="
            bg-red-500 h-[40vh] w-[15vw]
            rounded-3xl
            "
      > 

        <div className="w-[100%] h-[33%] flex items-center flex-col">
        <div className="w-5 h-5 bg-yellow-300 flex justify-center">
          <p>{product.liked}</p>
        </div>
          <img
            src="https://picsum.photos/200/300 "
            className="h-[90%] w-[66%] m-4 rounded-xl"
          />
        </div>
        <div className="w-[100%] h-[44%] flex justify-center">
          <p>
            {product.name}
          </p>
        </div>
        <div className="w-[100%] h-[10%] flex items-center flex-col">
          <p className="p-2">{product.price.$numberDecimal}€</p>
          <AddToCart />
        </div>
      </section>
    </main>
  );
}
