import React, { memo, useEffect } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import * as apis from "apis";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getCurrent } from "store/user/asyncActions";
import { useNavigate } from "react-router-dom";
import path from "ultils/path";
import { updateCart } from "store/user/userSlice";

const style = { layout: "vertical" };
// NÚT XÁC NHẬN
const ButtonWrapper = ({ currency, showSpinner, amount, payload }) => {
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
  const dispatchReact = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: { ...options, currency: currency },
    });
  }, [currency, showSpinner]);

  const handleSaveOrder = async () => {
    const response = await apis.apiCreateOrder({
      ...payload,
      status: "Successed",
    });
    if (response.success)
      Swal.fire("Successfully", "Thanh toán thành công!", "success").then(
        () => {
          dispatchReact(getCurrent());
          dispatchReact(updateCart([]))
          navigate(`/${path.HOME}`);
        }
      );
    else toast.error(response.mes);
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data, actions) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
              ],
            })
            .then((orderID) => orderID)
        }
        onApprove={(data, actions) =>
          actions.order.capture().then(async (response) => {
            if (response.status === "COMPLETED") {
              handleSaveOrder();
            }
          })
        }
      />
    </>
  );
};

const PayPal = ({ amount, payload }) => {
  return (
    <div className="max-w-[750px] min-h-[200px]">
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        <ButtonWrapper
          payload={payload}
          currency={"USD"}
          amount={amount}
          showSpinner={false}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default memo(PayPal);
