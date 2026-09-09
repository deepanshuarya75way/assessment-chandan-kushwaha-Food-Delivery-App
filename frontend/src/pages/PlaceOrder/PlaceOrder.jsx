import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, cartItems, url, food_list } =
    useContext(StoreContext);

  // Creating a state var for the form field
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });


  // Handler to save the from data in the data state var.
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle Razorpay payment gateway
  const handlePayment = async (e) => {
    e.preventDefault();

    // Creating order's items data
    let orderItems = [];

    (food_list || []).forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40,
    };

    try {
      // Send orderData to backend
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { order, orderId, key } = response.data;

        if (!window.Razorpay) {
          alert("Razorpay SDK failed to load. Please check your internet connection.");
          return;
        }

        const options = {
          key: key,
          amount: order.amount,
          currency: order.currency,
          name: "Mern-Eats",
          description: "Food Delivery Order",
          order_id: order.id,
          handler: async function (paymentResponse) {
            try {
              const verifyRes = await axios.post(
                url + "/api/order/verify",
                {
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  orderId: orderId,
                },
                { headers: { token } }
              );

              if (verifyRes.data.success) {
                navigate("/myorders");
              } else {
                alert(verifyRes.data.message || "Payment verification failed");
                navigate("/myorders");
              }
            } catch (err) {
              console.error("Verification error:", err);
              navigate("/myorders");
            }
          },
          modal: {
            ondismiss: async function () {
              try {
                await axios.post(
                  url + "/api/order/verify",
                  { success: false, orderId: orderId },
                  { headers: { token } }
                );
              } catch (err) {
                console.error(err);
              }
            },
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#ff6347",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert(response.data.message || "Error placing order");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Error initiating payment");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      alert("Login to checkout! ");
    } else if (getTotalCartAmount() === 0) {
      navigate("/");
      alert("Cart is empty! ");
    }
  }, [token]);

  return (
    <form onSubmit={handlePayment} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>

        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="text"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip Code"
            required
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
          required
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}
              </b>
            </div>
          </div>

          <div className="card-no-container" style={{ justifyContent: "center", gap: "8px", color: "#555" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>🔒 Secured Payment by <b>Razorpay</b> (UPI, Card, NetBanking)</span>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
