import { FaPlus } from "react-icons/fa";

type ProductProps = {
  productId: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  handler: () => void;
};

const server = "ertyujkj";
const ProductCard = ({
  productId,
  name,
  photo,
  price,
  stock,
  handler,
}: ProductProps) => {
  return (
    <div className="productcard">
      <img src={photo} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>

      <div>
        <button onClick={() => handler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
