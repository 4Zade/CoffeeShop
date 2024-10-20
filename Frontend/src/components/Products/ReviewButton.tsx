import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Icon } from "@iconify/react/dist/iconify.js";

interface ReviewProps {
    liked: number
    productId: number
    extraClass?: string
}
export default function ReviewButton({ liked, productId, extraClass }: ReviewProps) {
    const [clicked, setClicked] = useState(false);
    const [likes, setLikes] = useState(liked);
    const { checkAuth, user } = useAuth();

    async function postReview(event: React.MouseEvent<HTMLButtonElement>) {
        try {
          event.stopPropagation();
          const response = await axios.post("http://localhost:7000/api/v1/products/review", { productId } ,{ withCredentials: true });

          if (response.data.favorited) {
            setLikes(likes + 1);
          }
          else {
            setLikes(likes - 1);
          }
          setClicked(!clicked);

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

    return (
      <div className={`top-4 right-6 flex gap-2 items-center z-10 ${extraClass}`}>
        <p>{likes}</p>
        <button className="w-10 h-10 hover:bg-gray-800 hover:bg-opacity-10 transition-[background,opacity] grid place-items-center rounded-full group/review" onClick={postReview}>
          <Icon icon="tabler:star-filled" className={`w-6 h-6 group-hover/review:scale-125 group-hover/review:text-yellow-100 transition-[transform,color] duration-300 ${clicked ? "text-yellow-400 text-opacity-100" : "text-gray-600 text-opacity-40"}`}/>
        </button>
      </div>
    );
}