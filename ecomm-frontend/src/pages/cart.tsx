import React, { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";

const productPrice = 2500; // Product price
const discount = 400; // Discount
const shippingCharges = 200; // Shipping charges
const subtotalAfterDiscount = productPrice - discount; // Subtotal after discount
const tax = Math.round(subtotalAfterDiscount * 0.18); // Tax (18%)
const total = subtotalAfterDiscount + tax + shippingCharges; // Total amount
const cartItems = [];
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
        <main></main>
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
        </aside>
      </div>
    </>
  );
};

export default Cart;
