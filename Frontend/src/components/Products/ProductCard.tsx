import Button from "../Button";
import { useAuth } from "../../contexts/AuthContext";
import ReviewButton from "./ReviewButton";
import { Link } from "react-router-dom";

export interface ProductProps {
  name: string;
  image: string;
  price: { $numberDecimal: string };
  description: string;
  id: number;
  category: string;
  size: string;
  liked: number;
}

export interface CardInterface {
  product: ProductProps;
}

export default function ProductCard({ product }: CardInterface) {
  const { auth } = useAuth();

  return (
    <Link to={`/produktai/${product.category.split(' ').join('-').toLowerCase()}/${product.id}`} className="w-full aspect-[6/8] flex flex-col justify-end relative">
      <div
        className="
          w-full h-min rounded-xl shadow-lg shadow-opacity-50 shadow-[#52342871] dark:shadow-[#ccc5c31e]
          dark:bg-gradient-to-tr bg-gradient-to-br from-[#C29469] via-[#ccc5c3] to-[#C29469]
        "
      >
        <div 
          className="
            w-full h-full p-0.5 rounded-xl
            bg-gradient-to-br from-transparent via-30% via-[#523428] to-[#523428]
          "
        >
          <div className="w-full h-full bg-[#523428] rounded-xl p-2 flex flex-col gap-2">
            <div className="w-full h-6 relative flex justify-center">
              <div className="w-2/3 absolute -bottom-5 flex justify-center z-10">
                <img src="/jacobs.webp" alt="" draggable="false" />
              </div>

              <div className="w-1/2 h-4 bg-white blur-2xl rounded-full"></div>
            </div>

            <header 
              className="
                w-full flex flex-col items-center z-10 bg-clip-text text-transparent
                bg-gradient-to-tr from-[#C29469] via-[#ccc5c3] to-[#C29469]
              "
            >
              <h3 className="w-full text-sm text-center tracking-widest">{product.category}</h3>
              <h1 className="w-full font-bold truncate text-center">{product.name}</h1>
              <h1 className="w-full text-2xl text-center">${product.price.$numberDecimal}</h1>
            </header>

            {
              auth && (
                <section className="w-full flex items-center gap-2">
                  <div className="grow">
                    <Button icon="tabler:shopping-cart" type="width">Add to cart</Button>
                  </div>

                  <ReviewButton liked={product.liked} productId={product.id} />
                </section>
              )
            }
          </div>
        </div>
      </div>
    </Link>
  );
}
