type CartSummaryProps = {
  discountCode: string;
  setDiscountCode: (code: string) => void;
  applyDiscount: () => void;
  validCode: boolean;
  totalPrice: number;
  discountAmount: number;
  finalTotal: string;
};

const CartSummary = ({
  discountCode,
  setDiscountCode,
  totalPrice,
  discountAmount,
}: CartSummaryProps) => (
  <div className="w-2/5 pl-4 flex flex-col">
    <div className="flex-grow flex flex-col justify-end border rounded-lg p-6 bg-gray-50 space-y-4">
      {/* Cart Total */}
      <div className="font-bold text-lg mt-4">
        Cart Total: €{totalPrice.toFixed(2)}
      </div>

      {/* Discount Amount */}
      {discountAmount > 0 && (
        <div className="font-bold text-lg">
          Discount: -€{discountAmount.toFixed(2)}
        </div>
      )}

      {/* Final Total */}
      <div className="font-bold text-lg">
        Final Total: €{finalTotal}
      </div>

      {/* Discount Code Input */}
      <input
        type="text"
        placeholder="Discount code"
        className={`border rounded-lg p-2 w-full text-center ${!validCode ? 'border-red-500' : ''}`}
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white rounded-lg py-2 w-full hover:bg-blue-600"
      >
        Apply Discount
      </button>
      {!validCode && <div className="text-red-500 text-center">Invalid discount code</div>}

      {/* Proceed to Checkout Button */}
      <button className="bg-green-500 text-white rounded-lg py-2 w-full hover:bg-green-600">
        Proceed to Checkout
      </button>
    </div>
  </div>
);

export default CartSummary;
