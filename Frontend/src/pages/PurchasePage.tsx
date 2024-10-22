import { useEffect, useState } from "react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext";
import CartItem, { CartItemProps } from "../components/Cart/CartItem";
import axios from "axios";
import { Link } from "react-router-dom";

export default function PurchasePage() {
  const { cart, getCart } = useCart();
  const { checkAuth } = useAuth();
  const [code, setCode] = useState<string>("");


  useEffect(() => {
    const loadPage = async () => {
      try {
        await checkAuth();
        await getCart();
      }
      catch (error) {
        console.error('Error:', error);
      }
    }

    loadPage();
  }, [])

  useEffect(() => {
    console.log(code)
  }, [code])

  const handleDiscountCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:7000/api/v1/users/discounts/${code}`, { withCredentials: true });
      console.log(response.data.data);
      await getCart();
      setCode("");
    }
    catch (err) {
      console.log(err);
    }
  }

  const clearCart = async () => {
    try {
      const response = await axios.delete(`http://localhost:7000/api/v1/users/cart`, { withCredentials: true });
      console.log(response.data.data);
      await getCart();
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex space-x-8 p-8 h-full">
<<<<<<< HEAD
  {/* Left Section (Cart Items) */}
  <div className="w-3/5 h-full p-4 rounded-lg bg-slate-200 dark:bg-zinc-800 shadow flex flex-col dark:text-white">
    <h2 className="text-xl font-semibold mb-4">Your Cart Items</h2>
    <div className="flex-grow space-y-4 overflow-auto">
      {cart.items.length > 0 ? (
        cart.items.map((item: any) => {
          return (
            <CartItem
              key={item.productId}
              productId={item.productId}
              quantity={item.quantity}
              pricePerItem={parseFloat(item.total.$numberDecimal)}
              totalPrice={parseFloat(item.total.$numberDecimal) * item.quantity}
            />
          )
        })
      ) : (
        <p>No items in cart</p>
      )}
    </div>
    <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full" onClick={clearCart}>
      Clear Cart
    </button>
  </div>

  {/* Right Section (Cart Summary) */}
  <div className="w-2/5 h-full p-4 rounded-lg bg-slate-200 dark:bg-zinc-800 dark:text-white shadow flex flex-col">
    <h2 className="text-xl font-semibold mb-4">Summary</h2>
    <div className="space-y-2 flex-grow">
    <div className="flex justify-between">
        <p>Code:</p>
        <p>{cart.code}</p>
      </div>
      <div className="flex justify-between">
        <p>Subtotal:</p>
        <p>{cart.subtotal}€</p>
      </div>
      <div className="flex justify-between">
        <p>Discount:</p>
        <p>-{cart.discount}€</p>
      </div>
      <div className="flex justify-between font-bold">
        <p>Total:</p>
        <p>{cart.total}€</p>
      </div>
    </div>

    {/* Discount Code Input */}
    <div className="mt-6">
      <input
        type="text"
        placeholder="Discount code"
        className="border-2 rounded-lg p-2 w-full text-center dark:bg-zinc-900"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full" onClick={handleDiscountCheck}>
        Apply Discount
      </button>
    </div>

    {/* Proceed to Checkout Button */}
    <Link to="/checkout" className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full text-center">
      Next
    </Link>
  </div>
</div>
=======
      {/* Left Section (Cart Items) */}
      <div className="w-3/5 h-full p-4 border rounded-lg bg-white shadow flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Your Cart Items</h2>
        <div className="flex-grow space-y-4 overflow-auto">
          {items.length > 0 ? (
            items.map((item: CartItemProps) => (
              <CartItem
                key={item.id}
                productName={item.productName}
                productImage={item.productImage}
                quantity={item.quantity}
                pricePerItem={item.price?.$numberDecimal ? parseFloat(item.price.$numberDecimal) : 0}
                totalPrice={item.totalPrice?.$numberDecimal ? parseFloat(item.totalPrice.$numberDecimal) : 0}
              />
            ))
          ) : (
            <p>No items in the cart</p>
          )}
        </div>
        <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full">
          Clear Cart
        </button>
      </div>

      {/* Right Section (Cart Summary) */}
      <div className="w-2/5 h-full p-4 border rounded-lg bg-gray-50 shadow flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="space-y-2 flex-grow">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>€{cartDetails.subtotal}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount:</p>
            <p>-€{cartDetails.discountAmount}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total:</p>
            <p>€{cartDetails.total}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount Percentage:</p>
            <p>{cartDetails.discountPercentage}%</p>
          </div>
          <div className="flex justify-between">
            <p>Item Count:</p>
            <p>{cartDetails.count}</p>
          </div>
        </div>

        {/* Discount Code Input */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Discount code"
            className="border rounded-lg p-2 w-full text-center"
          />
          <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full">
            Apply Discount
          </button>
        </div>

        {/* Proceed to Checkout Button */}
        <button className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full">
          Next
        </button>
      </div>
    </div>
>>>>>>> 005852c1a3b6a9d02d7fe07548993925d23899c7
  );
}


//     <div>
//       <h1>Total: {cartDetails.total}</h1>  /
//       <h1>Subtotal: {cartDetails.subtotal}</h1>   /
//       <h1>Discount: {cartDetails.discountAmount}</h1> /
//       <h1>Discount Percentage: {cartDetails.discountPercentage}</h1>
//       <h1>Count: {cartDetails.count}</h1>
//     </div>
//   )
// }