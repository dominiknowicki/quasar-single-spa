// import Vue from 'vue' this is vue2
import singleSpaVue from "single-spa-vue";
import createApp from "../.quasar/app.js"; // Dynamically created by Quasar CLI
import { h, createApp as createAppVue } from "vue";
import router from "./router";
import App from "./App.vue";
import * as Vue from "vue";

function createDeferredPromise() {
  let resolveFn;
  const deferredPromise = new Promise((resolve) => {
    resolveFn = resolve;
  });
  return { deferredPromise, resolveFn };
}

let asyncLifecyclesPromise;
createApp().then(({ app }) => {
  const { deferredPromise, resolveFn } = createDeferredPromise();
  asyncLifecyclesPromise = deferredPromise;

  // const vueLifecycles = singleSpaVue({ Vue, appOptions: app }) this is vue2

  const vueLifecycles = singleSpaVue({
    createAppVue,
    appOptions: {
      render() {
        return h(App, {
          // single-spa props are available on the "this" object. Forward them to your component as needed.
          // https://single-spa.js.org/docs/building-applications#lifecyle-props
          name: this.name,
          mountParcel: this.mountParcel,
          singleSpa: this.singleSpa,
        })
      },
    },
    handleInstance: (app) => {
      app.use(router);
    },
  })

  resolveFn(vueLifecycles);
});

export const mount = async () =>
  asyncLifecyclesPromise.then((lifecycles) => lifecycles.mount);
export const unmount = async () =>
  asyncLifecyclesPromise.then((lifecycles) => lifecycles.unmount);
export const bootstrap = async () =>
  asyncLifecyclesPromise.then((lifecycles) => lifecycles.bootstrap);
