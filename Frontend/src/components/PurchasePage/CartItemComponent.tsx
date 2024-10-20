import { CartItem } from '../../pages/PurchasePage'; // Import the CartItem type from PurchasePage

type CartItemProps = {
  item: CartItem;
  handleQuantityChange: (id: number, newQuantity: number) => void;
  removeItem: (id: number) => void;
};

const CartItemComponent = ({ item, removeItem }: CartItemProps) => (
  <div className="border rounded-lg p-4 flex items-center">
    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
    <div className="flex-grow">
      <h3 className="font-semibold">{item.name}</h3>
      <div className="flex items-center">
        <input
          type="number"
          value={item.quantity}
          min="1"
          className="border rounded-lg p-1 w-16 text-center"
        />
        <span className="ml-4">€{item.price.toFixed(2)} each</span>
        <span className="ml-2">Total: €{(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
    <button className="ml-4 text-red-500" onClick={() => removeItem(item.productId)}>
      Remove
    </button>
  </div>
);

export default CartItemComponent;
