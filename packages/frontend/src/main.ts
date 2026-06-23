import ui from "@nuxt/ui/vue-plugin";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";

import App from "./App.vue";
import { head } from "./core/head";
import { queryPluginOptions } from "./core/query";
import { router } from "./core/router";
import "./style.css";

const app = createApp(App);

app.use(VueQueryPlugin, queryPluginOptions);

app.use(router);

app.use(ui);

app.use(head);

app.mount("#app");
