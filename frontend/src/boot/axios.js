import { boot } from "quasar/wrappers";
import axios from "axios";
import { Dialog } from "quasar";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const serverName = process.env.DEV ? "localhost" : "i6b103.p.ssafy.io";

const api = axios.create({
  baseURL: process.env.DEV
    ? `http://${serverName}:9090`
    : `https://${serverName}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const ovapi = axios.create({
  baseURL: `https://${serverName}:4443`,
  headers: {
    "Content-Type": "application/json",
  },
});

const jwt = sessionStorage.getItem("jwt");
api.defaults.headers.common["Authorization"] = jwt ? `Bearer ${jwt}` : ``;

export default boot(({ router, store, app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API

  app.config.globalProperties.$ovapi = ovapi;

  router.beforeEach(async (to, from, next) => {
    const jwt = sessionStorage.getItem("jwt");
    if (
      to.matched.some(function (routeInfo) {
        return routeInfo.meta.authRequired;
      }) &&
      !jwt
    ) {
      Dialog.create({
        title: "<span  class='text-h6' >권한</span>",
        style: "shadow-box",
        html: true,
        style: "font-family: pocheon_b",
        message:
          "<span class='text-h7 text-weight-medium'>로그인 후 이용해주세요.</span>",
        color: "green",
        html: true,
        cancel: "로그인",

        ok: "취소",

        persistent: true,
      })
        .onOk(() => {})
        .onCancel(() => {
          // console.log('>>>> Cancel')
          router.push("/auth/login");
        });
      next("/");
    } else {
      next();
    }
  });
});

export { api, ovapi };
