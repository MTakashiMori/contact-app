import Vue from 'vue'
import VueRouter from 'vue-router'
import ContactUploadList from "../views/ContactUploadList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ContactUploadList
  },
];

const router = new VueRouter({
  routes
});

export default router
