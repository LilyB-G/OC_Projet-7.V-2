import Vue from 'vue'
import VueRouter from 'vue-router'
import User from '../components/User'
import Wall from '../components/Wall'
import Admin from '../components/Admin'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Wall',
    component: Wall,
   
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/auth',
    name: 'User',
    component: User,
    beforeEnter: (to, from, next) => { 
      const localToken = localStorage.getItem("token")
      if (localToken != null) {
        next('/');
      }
      next();
    }
  }
];



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const Access = ['/auth']
  const pagesVerif = !Access.includes(to.path)
  const loggedIn = localStorage.getItem("userId")
  const isAdmin = localStorage.getItem("isAdmin")
  const localToken = localStorage.getItem("token")
  if (pagesVerif && !loggedIn && !localToken) {
      return next('/auth')
  }
  if (to.fullPath === '/admin') {
    if (isAdmin != "true") {
      next('/')
    }
  }
  next()
})

export default router
