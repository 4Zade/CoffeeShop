import { useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import ReviewButton from "../../components/Products/ReviewButton";
import Button from "../../components/Button";
import axios from "axios";
import AddToCart from "../../components/Products/AddToCart";

interface ProductProps {
  id: number;
  name: string;
  image: string;
  price: { $numberDecimal: string };
  description: string;
  category: string;
  size: string;
  liked: number;
}

export default function ProductPage() {
  const product: ProductProps = useLoaderData() as ProductProps;
  const { auth, user } = useAuth();
  const { productModal, successAlert, errorAlert } = useAlert();
  const navigate = useNavigate();

  const deleteProduct = async (id: number | string) => {
    try {
      await axios.delete(`/api/v1/products/${id}`, { withCredentials: true });
      successAlert("Produktas sėkmingai ištrintas");
      navigate("/produktai");
    } catch (err) {
      console.log(err);
      errorAlert("Įvyko klaida trinant produktą!");
    }
  };

  return (
    <main className="w-full h-[95%] bg flex flex-col md:flex-row items-center px-4 xl:px-48 text-white">
      <div
        className="
          w-full h-min rounded-3xl shadow-lg shadow-opacity-50 shadow-[#52342871] dark:shadow-[#ccc5c31e]
          dark:bg-gradient-to-tr bg-gradient-to-br from-[#C29469] via-[#ccc5c3] to-[#C29469]
        "
      >
        <div 
          className="
            w-full h-full p-0.5 rounded-3xl
            bg-gradient-to-br from-transparent via-30% via-[#523428] to-[#523428]
          "
        >
          <section className="h-full bg-[#523428] rounded-3xl flex flex-col md:grid md:grid-cols-5 p-8 relative gap-12">
            <aside className={`w-full h-full bg-slate-50 dark:bg-zinc-900 rounded-2xl col-span-2 relative grid place-items-center`}>
              <img src={product.image || "/jacobs.webp"} alt={product.name} className="object-contain max-h-[700px]"/>
            </aside>

            <aside className="w-full h-full flex flex-col justify-between col-span-3">
              <header className="w-full flex flex-col gap-2">
                <div className="w-full flex items-center justify-between">
                  <h1 className="text-sm md:text-xl font-bold tracking-widest uppercase truncate">{product.category}</h1>
                  <section className="flex items-center gap-2">
                    {
                      auth && user?.roles.includes("admin") && (
                        <>
                          <Button type="icon" icon="tabler:edit" onClick={() => productModal('edit', product.id, product.category) }/>
                          <Button type="icon" icon="tabler:trash" onClick={() => deleteProduct(product.id)}/>
                        </>
                      )
                    }
                    <ReviewButton liked={product.liked} productId={product.id} />
                  </section>
                </div>

                <h1 className="text-xl md:text-4xl font-bold text-white truncate">{product.name}</h1>

                <p className="text-sm md:text-xl text-slate-300 truncate">{product.description}</p>

              </header>

              <section className="w-full flex flex-col gap-8">
                <div className="flex flex-col justify-between md:px-8 gap-2">
                  <h1 className="text-2xl font-bold">{product.size}</h1>
                  <h1 className="text-2xl font-bold">${product.price.$numberDecimal}</h1>
                </div>
                <AddToCart productId={product.id} />
              </section>
            </aside>
          </section>
        </div>
      </div>
    </main>
    )
}