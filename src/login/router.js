import Vue from "vue";
import Router from "vue-router";

import Login from "./Login.vue";
import Sign_up from "./Sign_up.vue";


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            component: Login
        },
        {
            path: "/Sign_up",
            component: Sign_up
        }
    ]
});
