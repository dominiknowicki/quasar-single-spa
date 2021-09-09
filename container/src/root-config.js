import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@my/application",
  app: () => System.import('@my/application'),
  activeWhen: "/app",
});

registerApplication({
  name: "@my/app2",
  app: () => System.import('@my/app2'),
  activeWhen: "/app2",
});

start();
