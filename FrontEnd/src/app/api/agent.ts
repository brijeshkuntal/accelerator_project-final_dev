import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { store } from "../stores/store";
import { refresh_Token } from "../common/query/query";
import UserStore from "../stores/userStore";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};
// GraphQL single Entry Point URL
axios.defaults.baseURL = "http://nagarro.test.com:8000/userlist/";
axios.defaults.method = "get";

// Adding bearer token to header of every request
// axios.interceptors.request.use(config => {
//     const token = store.commonStore.token;
//     if (token) config.headers.Authorization = `Bearer ${token}`
//     return config;
// })

axios.interceptors.response.use(
  async (response) => {
    let token = localStorage.getItem("jwt");
    let reftoken = localStorage.getItem("jwt2");

    if (token && reftoken) {
      store.userStore.updateToken(token);
    }
    await sleep(1000);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response! || {};
    switch (status) {
      case 400:
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        } else {
          toast.error(data);
        }
        break;
      case 401:
        toast.error("unauthorised");
        break;
      case 404:
        history.push("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

const API = {
  data: (query: any) =>
    axios({
      data: query,
    }),
};

const agent = {
  API,
};

export default agent;
