import axios from "../axios";

export const apiCreateOrder = (data) =>
  axios({
    url: "/order",
    method: "post",
    data,
  });

export const apiGetAllOrder = (params) =>
  axios({
    url: "/order/admin",
    method: "get",
    params,
  });

export const apiGetOrderUsers = () =>
  axios({
    url: "/order",
    method: "get",
  });

export const apiUpdateOrder = (oid, data) =>
  axios({
    url: "/order/status/" + oid,
    method: "put",
    data,
  });
