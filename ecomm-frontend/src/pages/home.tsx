import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";

const Home = () => {
  const addToCartHandler = () => {
    console.log("Add to cart button clicked");
  };
  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        <ProductCard
          productId="ert"
          name="HeadPhone"
          price={2500}
          stock={34}
          handler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/713tn9TU1IL._SX522_.jpg"
        />
      </main>
    </div>
  );
};

export default Home;
