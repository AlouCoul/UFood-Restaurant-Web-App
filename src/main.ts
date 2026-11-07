import { createApp } from "vue";
import { router } from "./router";
import App from "./App.vue";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "/node_modules/bootstrap-icons/font/bootstrap-icons.css";
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
    components,
    directives,
  })

const app = createApp(App).use(vuetify);

app.use(router);
app.mount("#app");
