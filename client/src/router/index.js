import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '@/views/Index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/Login"),
    hidden: true
  },
  {
    name: "Reginster",
    path: "/register",
    component: () => import("@/views/Register"),
    hidden: true
  },
  {
    path: "/",
    component: index,
    redirect: "/home",
    singleNode: true,
    meta: { title: "Home", icon: "el-icon-s-home" },
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/Home')
    }]
  },
  {
    path: "/work",
    component: index,
    redirect: "/work/project",
    meta: { title: "Work", icon: "el-icon-s-cooperation" },
    children: [{
      path: 'project',
      name: 'Project',
      component: () => import('@/views/Project'),
      meta: { title: "Project" },
    }]
  },
  {
    path: "/settings",
    component: index,
    redirect: "/settings/user",
    privilege: true,
    meta: { title: "Settings", icon: "el-icon-s-tools" },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/User'),
        meta: { title: "User" }
      },
      {
        path: '/external',
        name: 'External',
        meta: { title: "External", icon: "el-icon-connection" },
        children: [
          {
            path: 'https://github.com/sam-tech-cn',
            name: 'Sam-Tech',
            meta: { title: "Sam-Tech" },
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router