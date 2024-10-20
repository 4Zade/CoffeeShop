import AddToCart from "./AddToCart";
import ReviewButton from "./ReviewButton";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
export interface ProductProps {
  name: string;
  image: string;
  price: { $numberDecimal: string };
  description: string;
  id: number;
  liked: number;
}

export interface CardInterface {
  product: ProductProps;
  loading: boolean;
}

export default function ProductCard({ product }: CardInterface) {
  const { auth } = useAuth();

  return (
    <section
      key={product.id}
      className="h-min w-full grid place-items-center relative"
    >
      <Link
        to={`/products/${product.id}`}
        className="h-min w-full flex flex-col justify-end group hover:scale-105 transition-transform"
      >
        <div className="w-full flex px-12 py-3 -mb-12 z-10">
          <img src={"/jacobs.webp"} alt="" draggable="false" />
        </div>

        <div
          className={`w-full h-min rounded-3xl bg-slate-200 dark:bg-zinc-800 dark:text-white px-6 py-4 flex flex-col justify-end gap-4 relative shadow group-hover:shadow-lg transition-shadow ${auth ? "h-48" : "h-24"}`}
        >
          <header className="flex flex-col">
            <div className="h-min flex justify-between items-center">
              <h1 className="text-lg font-bold">{product.name}</h1>
              {auth && <ReviewButton liked={product.liked} productId={product.id} />}
            </div>
            <p className="w-full text-sm truncate line-clamp-1 text-wrap">
              {product.description}
            </p>
          </header>

          {auth && <AddToCart productId={product.id} />}
        </div>
      </Link>
    </section>
  );
}
