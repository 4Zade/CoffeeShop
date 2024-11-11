import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../Button";

interface ReviewProps {
    liked: number
    productId: number
    extraClass?: string
}
export default function ReviewButton({ liked, productId }: ReviewProps) {
    const [clicked, setClicked] = useState(false);
    const [likes, setLikes] = useState(liked);
    const { checkAuth, user } = useAuth();

    async function postReview(event: React.MouseEvent<HTMLButtonElement>) {
        try {
          event.preventDefault();
          event.stopPropagation();

          const response = await axios.post("http://localhost:7000/api/v1/products/review", { productId } ,{ withCredentials: true });

          if (response.data.favorited) {
            setLikes(likes + 1);
            console.log("added like");
          }
          else {
            setLikes(likes - 1);
            console.log("removed like");
          }
          setClicked(!clicked);
          console.log("clicked");

        } catch (err) {
          console.log(err);
        }
      }
      useEffect(() => {
        setLikes(liked);
      }, [liked]);

      useEffect(() => {
        const loadReviews = async () => {
          try {
            await checkAuth();

            if(user?.favorite.includes(productId)) {
              setClicked(true);
            }
          } catch (err) {
            console.log(err);
          }
        }
        loadReviews();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const icon = clicked ? "tabler:star-filled" : "tabler:star";
    return (
      <div className="w-min h-min">
        <button 
          className="w-min h-min" 
          onClick={postReview}
        >
          <Button type="icon" icon={icon} />
        </button>
      </div>
    );
}