import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import CartItemComponent from '../components/PurchasePage/CartItemComponent'; // Import the CartItemComponent
import CartSummary from '../components/PurchasePage/CartSummary'; // Import the CartSummary

// Define and export the CartItem type
export type CartItem = {
  productId: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

const PurchasePage = () => {
  const { checkAuth, auth } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState('');
  const [validCode, setValidCode] = useState(true);

  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discontPercentage, setDiscountPercentage] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        await checkAuth();
      }
      catch (err) {
        console.log(err);
      }
      finally {
        if (auth) {
          fetchCartItems();
        }
      }
    }
    
    authenticateUser();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/v1/users/cart', { withCredentials: true });
      setCartItems(response.data.data.items);
      setSubtotal(response.data.data.total);
      setTotal(response.data.data.total);
      
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeItem = async (id: number) => {
    try {
      await axios.delete(`http://localhost:7000/api/users/cart/${id}`, { withCredentials: true });
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/users/cart/clear', { withCredentials: true });
      setCartItems([]);
      setSubtotal(0);
      setDiscountAmount(0); // Reset the discount amount when cart is cleared
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full min-h-screen flex">
      {/* Left Section: Products and Clear Cart */}
      <div className="w-3/5 pr-4 flex flex-col border rounded-lg bg-white p-6">
        <div className="mb-6 space-y-4 flex-grow flex flex-col">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500">
              Your cart is empty. <a href="/products" className="text-blue-500">Continue Shopping</a>
            </div>
          ) : (
            cartItems.map(item => (
              <CartItemComponent
                key={item.productId}
                item={item}
                removeItem={removeItem}
              />
            ))
          )}
        </div>

        {/* Clear Cart Button */}
        <div className="flex justify-end">
          <button
            className="text-red-500 border border-red-500 rounded-lg py-2 px-4 hover:bg-red-100"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Right Section: Discount Code and Checkout */}
      <CartSummary
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        validCode={validCode}
        totalPrice={subtotal}
        discountAmount={discountAmount}
      />
    </div>
  );
};

export default PurchasePage;
