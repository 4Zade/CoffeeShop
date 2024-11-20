import axios from "axios";
import { useCart } from "../../contexts/CartContext";
import Button from "../Button";
import { useAlert } from "../../contexts/AlertContext";

export default function AddToCart({productId}: {productId: number}) {
    const { getCart } = useCart();
    const { successAlert, errorAlert } = useAlert();

    const addToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            event.stopPropagation();
            await axios.post(`/api/v1/users/cart/${productId}`, {}, {withCredentials: true});
            await getCart();
            successAlert("Produktas sėkmingai pridėtas į krepšelį");
        } catch (err) {
            console.log(err);
            errorAlert("Įvyko klaida pridėjus produktą į krepšelį!");
        }
    }

    return (
        <button onClick={addToCart} className="w-full h-min">
            <Button icon="tabler:shopping-cart" type="width">Pridėti į krepšelį</Button>
        </button>
    )
}