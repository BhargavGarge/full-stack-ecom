import { useState } from "react";
import { BiArrowBack } from "react-icons/bi";

const shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const changeHandler = () => {};
  return (
    <>
      <div className="shipping">
        <button>
          <BiArrowBack />
        </button>
        <form>
          <h1>Shipping Address</h1>
        </form>
      </div>
    </>
  );
};

export default shipping;
