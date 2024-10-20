import axios from "axios";

export default function AddToCart({productId}: {productId: number}) {
   
    const addToCart = async () => {
        try {
            await axios.post("http://localhost:7000/api/v1/cart", {productId}, {withCredentials: true});
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <button className="bg-blue-500 text-white rounded-lg py-2 w-full hover:bg-blue-600" onClick={addToCart}>
          Add to Cart
        </button>
    )
}