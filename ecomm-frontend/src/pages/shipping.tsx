import { ChangeEvent, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const shipping = () => {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value, // Dynamically update the field based on the "name" attribute
    }));
  };

  return (
    <>
      <div className="shipping">
        <button className="back-btn" onClick={() => navigate("/cart")}>
          <BiArrowBack />
        </button>
        <form>
          <h1>Shipping Address</h1>
          <input
            required
            type="text"
            placeholder="Address"
            name="address"
            value={shippingInfo.address}
            onChange={changeHandler}
          />
          <input
            required
            type="text"
            placeholder="City"
            name="city"
            value={shippingInfo.city}
            onChange={changeHandler}
          />{" "}
          <input
            required
            type="text"
            placeholder="State"
            name="state"
            value={shippingInfo.state}
            onChange={changeHandler}
          />{" "}
          {/* <input
            required
            type="text"
            placeholder="Country"
            name="country"
            value={shippingInfo.country}
            onChange={changeHandler}
          />{" "} */}
          <select
            name="country"
            required
            value={shippingInfo.country}
            onChange={changeHandler}
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="AUS">Australia</option>
          </select>
          <input
            required
            type="number"
            placeholder="PinCode"
            name="pincode"
            value={shippingInfo.pincode}
            onChange={changeHandler}
          />
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </>
  );
};

export default shipping;
