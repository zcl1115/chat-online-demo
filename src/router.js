import Vue from "vue";
import Router from "vue-router";

import Login from "./views/Login.vue";
import Signup from "./views/Signup.vue";


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            component: Login
        },
        {
            path: "/Signup",
            component: Signup
        }
    ]
});
