    import { DiscountProps } from "./DiscounPage";

export default  function DiscountCard({ discount } : DiscountProps) {    
    return (
        <div>
            <h1>{discount.code}</h1>
            <h1>{discount.percentage}</h1>
            <h1>{discount.expiry}</h1>
        </div>
    )
}

