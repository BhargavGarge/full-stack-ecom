import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";

const productPrice = 2500; // Product price
const discount = 400; // Discount
const shippingCharges = 200; // Shipping charges
const subtotalAfterDiscount = productPrice - discount; // Subtotal after discount
const tax = Math.round(subtotalAfterDiscount * 0.18); // Tax (18%)
const total = subtotalAfterDiscount + tax + shippingCharges; // Total amount
const cartItems = [
  //sample data
  {
    productId: "1",
    name: "HeadPhone",
    price: 2500,
    stock: 5,
    quantity: 4,
    photo: "https://m.media-amazon.com/images/I/713tn9TU1IL._SX522_.jpg",
  },
];
const Cart = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isValidCouponCode, setIsValidCouponCode] = useState(false);

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      if (Math.random() > 0.5) {
        setIsValidCouponCode(true);
      } else {
        setIsValidCouponCode(false);
      }
    }, 1000);
    return () => {
      clearTimeout(timeOutID);
      setIsValidCouponCode(false);
    };
  });

  return (
    <>
      <div className="cart">
        <main>
          <main>
            {cartItems.length > 0 ? (
              cartItems.map((i, idx) => <CartItem key={idx} cartItem={i} />)
            ) : (
              <h1>No Items Added</h1>
            )}
          </main>
        </main>
        <aside>
          <p>Product Price: ₹{productPrice}</p>
          <p>Discount: ₹{discount}</p>
          <p>Subtotal After Discount: ₹{subtotalAfterDiscount}</p>
          <p>Tax (18% GST): ₹{tax}</p>
          <p>Shipping Charges: ₹{shippingCharges}</p>
          <p>
            <b>Total: ₹{total}</b>
          </p>
          <input
            type="text"
            className="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Coupon Code"
          />
          {couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                {" "}
                ₹{discount} off the using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid Coupon <VscError />
              </span>
            ))}
          {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
        </aside>
      </div>
    </>
  );
};

export default Cart;
