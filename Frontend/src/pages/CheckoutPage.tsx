import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import CartItem from "../components/Navigation/Cart/CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormData {
  street: string;
  apartment?: string;
  zip: string;
  city: string;
  name: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const { checkAuth, user } = useAuth();
  const [selectedShop, setSelectedShop] = useState("");
  const [isUsingShippingAddress, setIsUsingShippingAddress] = useState(true);
  const [error, setError] = useState("");
  const [shippingCost, setShippingCost] = useState(5.99);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const shippingAddress = watch(['street', 'apartment', 'zip', 'city']);

  const shopAddresses = [
    "Molėtų pl. 8, 08426 Vilnius",
    "Ukmergės g. 322, 06142 Vilnius",
    "Vytauto Pociūno g. 8, 06264 Vilnius",
    "Kalvarijų g. 206, 08314 Vilnius",
    "Ozo g. 18, 08243 Vilnius",
    "Ozo g. 25, 08217 Vilnius",
    "Ulono g. 5, 08240 Vilnius",
    "Gedimino pr. 9, 01105 Vilnius",
    "Pilies g. 3, 01123 Vilnius",
    "Gedimino pr. 51, 01504 Vilnius",
    "Gedimino pr. 52, 01110 Vilnius",
    "Gynėjų g. 16, 01108 Vilnius",
  ];

  useEffect(() => {
    const loadPage = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Error:", error);
      }
    };
    loadPage();
  }, [checkAuth, user]);

  useEffect(() => {
    if (cart.items.length === 0) {
      setError("Cart is empty. Please add items to your cart before proceeding to checkout."); // Disable button
    }
  }, [cart.items]);

  const handleCheckout: SubmitHandler<FormData> = async (data) => {
    if (cart.items.length === 0) {
      setError("Cart is empty. Please add items to your cart before proceeding to checkout.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions before placing the order."); // Animation to display error
      return;
    }

    const orderNumber = `ORDER-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // const finalAddress = selectedShop || `${data.street}, ${data.apartment || ''}, ${data.zip}, ${data.city}`;
    const finalAddress = selectedShop || shippingAddress.join(', ');

    try {
      await axios.post(
        "http://localhost:7000/api/v1/purchase",
        {
         card_number: data.cardNumber,
         cvv: data.cvv,
         expiry_date: data.expiryDate,
        },
        { withCredentials: true }
      );

      // navigate("/confirmation", {
      //   state: {
      //     orderNumber,
      //     cartItems: cart.items,
      //     total: (parseFloat(cart.total) + shippingCost).toFixed(2),
      //     shippingCost,
      //   },
      // });
    } catch (err) {
      setError("Checkout failed. Please check your payment information.");
      console.error(err);
    }
  };

  const handleAcceptTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked);
  };

  useEffect(() => {
    setShippingCost(isUsingShippingAddress ? 5.99 : 0);
  }, [isUsingShippingAddress]);

  // Format card number to add spaces
  const formatCardNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "").substring(0, 16);
    // Insert spaces every 4 digits
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  // Handle card number change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setValue("cardNumber", formattedValue);
  };

  // Handle expiry date change
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4); // Allow only up to 4 digits
    let formattedValue = "";

    if (value.length >= 2) {
      formattedValue = value.substring(0, 2) + "/" + value.substring(2);
    } else {
      formattedValue = value;
    }

    // Ensure month is between 01 and 12
    if (formattedValue.length >= 2) {
      const month = parseInt(formattedValue.substring(0, 2));
      if (month > 12) {
        formattedValue = "12" + formattedValue.substring(2);
      }
    }

    setValue("expiryDate", formattedValue);
  };

  return (
    <div className="flex space-x-8 p-8 h-full">
      <div className="w-3/5 h-full p-4 rounded-lg bg-slate-200 dark:bg-zinc-800 shadow flex flex-col dark:text-white">
        <h2 className="text-xl font-semibold mb-4">Your Cart Items</h2>
        <div className="flex-grow space-y-4 overflow-auto">
          {cart.items.length > 0 ? (
            cart.items.map((item: any) => (
              <CartItem
                key={item.productId}
                productId={item.productId}
                quantity={item.quantity}
                pricePerItem={parseFloat(item.total.$numberDecimal)}
                totalPrice={parseFloat(item.total.$numberDecimal) * item.quantity}
              />
            ))
          ) : (
            <p>No items in cart</p>
          )}
        </div>
      </div>

      <div className="w-2/5 h-full p-4 rounded-lg bg-slate-200 dark:bg-zinc-800 dark:text-white shadow flex flex-col">
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={() => navigate("/products")}
            >
              Go to Products
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="flex mb-4">
              <button
                className={`flex-1 p-2 text-sm ${isUsingShippingAddress ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setIsUsingShippingAddress(true)}
              >
                Use Shipping Address
              </button>
              <button
                className={`flex-1 p-2 text-sm ${!isUsingShippingAddress ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setIsUsingShippingAddress(false)}
              >
                Select Shop Address
              </button>
            </div>

            {isUsingShippingAddress ? (
              <>
                <label htmlFor="street" className="text-xs">Street (Ex. 123 Main St)</label>
                <input
                  {...register("street", { required: "Street is required." })}
                  type="text"
                  placeholder="Street"
                  className="border p-2 mb-2 w-full text-black"
                />
                {errors.street && <p className="text-red-500">{(errors.street as any)?.message}</p>} {/* Safely access message */}

                <label htmlFor="apartment" className="text-xs">Apartment</label>
                <input
                  {...register("apartment")}
                  type="text"
                  placeholder="Apartment"
                  className="border p-2 mb-2 w-full text-black"
                />

                <label htmlFor="zip" className="text-xs">Zip Code</label>
                <div className="flex mb-2">
                  <span className="border p-2 bg-gray-200 text-gray-500 mr-2">LT-</span>
                  <input
                    {...register("zip", { 
                      required: "Zip code is required.",
                      maxLength: {
                        value: 5,
                        message: "Zip code must be 5 digits."
                      },
                      pattern: {
                        value: /^\d{5}$/,
                        message: "Invalid zip code. Must be 5 digits."
                      }
                    })}
                    type="text"
                    placeholder="Zip Code"
                    className="border p-2 w-full text-black"
                    maxLength={5} // Limit to 5 digits
                  />
                </div>
                {errors.zip && <p className="text-red-500">{(errors.zip as any)?.message}</p>} {/* Safely access message */}


                <label htmlFor="city" className="text-xs">City</label>
                <input
                  {...register("city", { required: "City is required." })}
                  type="text"
                  placeholder="City"
                  className="border p-2 mb-2 w-full text-black"
                />
                {errors.city && <p className="text-red-500">{(errors.city as any)?.message}</p>} {/* Safely access message */}
              </>
            ) : (
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="border p-2 mb-2 w-full"
              >
                <option value="" disabled>Select a shop address</option>
                {shopAddresses.map((address, index) => (
                  <option key={index} value={address}>{address}</option>
                ))}
              </select>
            )}

            <h2 className="text-xl font-semibold mb-4 mt-4">Payment Information</h2>
            <label htmlFor="name" className="text-xs">Cardholder Name</label>
            <input
              {...register("name", { required: "Cardholder name is required." })}
              type="text"
              placeholder="Cardholder Name"
              className="border p-2 mb-2 w-full text-black"
            />
            {errors.name && <p className="text-red-500">{(errors.name as any)?.message}</p>} {/* Safely access message */}

            <label htmlFor="cardNumber" className="text-xs">Card Number</label>
            <input
              {...register("cardNumber", { required: "Card number is required." })}
              type="text"
              placeholder="Card Number"
              className="border p-2 mb-2 w-full text-black"
              maxLength={19} // Allow max length for spaces
              onChange={handleCardNumberChange} // Format on change
            />
            {errors.cardNumber && <p className="text-red-500">{(errors.cardNumber as any)?.message}</p>} {/* Safely access message */}

            <div className="flex space-x-2 mb-2">
              <div className="flex-1">
                <label htmlFor="expiryDate" className="text-xs">Expiry Date (MM/YY)</label>
                <input
                  {...register("expiryDate", { required: "Expiry date is required." })}
                  type="text"
                  placeholder="MM/YY"
                  className="border p-2 mb-2 w-full text-black"
                  maxLength={7} // Allow MM/YY
                  onChange={handleExpiryDateChange} // Format on change
                />
                {errors.expiryDate && <p className="text-red-500">{(errors.expiryDate as any)?.message}</p>} {/* Safely access message */}
              </div>
              <div className="flex-1">
                <label htmlFor="cvv" className="text-xs">CVV</label>
                <input
                  {...register("cvv", { required: "CVV is required.", pattern: { value: /^\d{3}$/, message: "Invalid CVV." } })}
                  type="text"
                  placeholder="CVV"
                  className="border p-2 mb-2 w-full text-black"
                  maxLength={3}
                />
                {errors.cvv && <p className="text-red-500">{(errors.cvv as any)?.message}</p>} {/* Safely access message */}
              </div>
            </div>

            {/* Summary Section */}
            <h2 className="text-xl font-semibold mt-6 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <p>Subtotal:</p>
              <p>{cart.subtotal}€</p>
            </div>
            <div className="flex justify-between mb-2">
              <p>Shipping:</p>
              <p>{shippingCost.toFixed(2)}€</p>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <p>Total:</p>
              <p>{(parseFloat(cart.total) + shippingCost).toFixed(2)}€</p>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={handleAcceptTerms}
                className="mr-2 text-black"
              />
              <span>I accept the terms and conditions</span>
            </div>

            <p className="text-red-500">{error}</p>

            <button
              onClick={handleSubmit(handleCheckout)} // Use handleSubmit to wrap the handleCheckout function
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2"
            >
              Confirm Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}
