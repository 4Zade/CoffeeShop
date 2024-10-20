import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios'; 
import { Link } from "react-router-dom";

const CartButton = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/users/cart', {withCredentials: true});
        if (response.data.data.items.length > 0 && response.data.data.items.length < 100) {
          setTotalItems(response.data.data.items.length);
        } 
        else {
          setTotalItems(99);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (auth) {
      fetchCartItems();
    }
  }, [auth]);

  if (!auth) return null; 

  return (
    <Link to="/purchase" className="relative flex items-center">
      <button
        className="flex items-center p-2 rounded-full text-coffee-400 dark:text-white hover:bg-gray-800 hover:bg-opacity-10 transition-[background,color] relative"
        aria-label="Your Cart"
        onMouseEnter={() => setIsTooltipVisible(true)} // Show tooltip on hover
        onMouseLeave={() => setIsTooltipVisible(false)} // Hide tooltip when not hovering
      >
        <Icon icon="tabler:shopping-cart" className="h-8 w-8" />
        <div className='absolute top-0 right-0 w-4 h-4 bg-coffee-200 rounded-full text-sm text-center'>
          <p className='scale-75 -mt-0.5 text-black'>{totalItems}</p>
        </div>
      </button>

      {/* Tooltip on hover */}
      {isTooltipVisible && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white font-semibold text-xs rounded-md p-2 opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Your Cart
        </div>
      )}
    </Link>
  );
};

export default CartButton;
