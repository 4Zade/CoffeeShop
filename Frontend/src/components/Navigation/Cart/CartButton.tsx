import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function CartButton() {
  const [number, setNumber] = useState("0");
  const { cart } = useCart();
  const { auth } = useAuth();

  useEffect(() => {
    if (cart.count > 99) {
      return setNumber("99+");
    }

    return setNumber(cart.count.toString());
  }, [cart]);

  return auth && (
    <Link
      to="/purchase" 
      className="
        w-10 h-10 flex items-center justify-center relative
      "
    >
      <Icon icon="tabler:shopping-cart" className="w-8 h-8 text-[#ccc5c3] dark:text-[#66564c]"/>

      <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-[0.65rem] rounded-full dark:bg-[#F2CEA9] bg-[#66564c]">
        <span className="-mt-px text-white">{number}</span>
      </span>
    </Link>
  )
}
