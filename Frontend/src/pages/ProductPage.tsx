import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import AddToCart from "../components/Products/AddToCart";
import ReviewButton from "../components/Products/ReviewButton";

interface ProductProps {
  id: number;
  name: string;
  image: string;
  price: { $numberDecimal: string };
  description: string;
  category: string;
  liked: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const { checkAuth, auth } = useAuth();
  const [product, setProduct] = useState<ProductProps | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuth();
        const response = await axios.get(`http://localhost:7000/api/v1/products/${id}`, { withCredentials: true });
        setProduct(response.data.data);
      } 
      catch (err) {
        console.log(err);
      } 
      finally {
        // setLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    product && (
      <main className="w-full h-full bg flex flex-col md:flex-row items-center px-48 py-16 dark:text-white">
        <section className="w-full h-full bg-slate-200 dark:bg-zinc-800 rounded-3xl grid grid-cols-5 p-8 relative">
          <aside className="w-full h-full bg-slate-50 dark:bg-zinc-900 rounded-2xl col-span-2 relative grid place-items-center">
            <img src="/jacobs.webp" alt="" className="object-contain max-h-[700px]"/>
          </aside>

          <article className="w-full h-full col-span-3 px-8 py-6 flex flex-col justify-between relative">
            <header className="w-full flex flex-col gap-4">
              <h3 className="text-xl font-bold tracking-widest">{product.category}</h3>
              <h1 className="text-5xl font-black">{product.name}</h1>
              <p className="text-xl">{product.description}</p>
            </header>

            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold">Packaging:</h3>
              <footer className="w-full flex items-center justify-between">
                <div className="bg-gradient-to-br from-coffee-200 to-coffee-100 px-6 py-2 rounded-md font-bold text-xl">
                  200g
                </div>

                <h3 className="text-3xl font-black">
                  {product.price.$numberDecimal}€
                </h3>
                
              </footer>

              {
                auth && <AddToCart productId={product.id} />
              }
            </div>
          </article>

          {
            auth && <ReviewButton liked={product.liked} productId={product.id} extraClass="absolute top-6 right-12 scale-150"/>
          }
        </section>
      </main>
    )
  );
}
