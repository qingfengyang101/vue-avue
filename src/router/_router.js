const _import = require('./_import')
import Layout from '@/page/index/'
export default [
  {
    path: '/',
    name: '主页',
    redirect: '/wel'
  },
  {
    path: '/wel',
    component: Layout,
    redirect: '/wel/index',
    children: [
      {
        path: 'index',
        name: '首页',
        component: _import('wel'),
        meta: {
          isIndex: true
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/login',
    name: '登录页',
    component: _import('login/index')
  },
  {
    path: '/lock',
    name: '锁屏页',
    component: _import('lock/index')
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    children: [
      {
        path: 'index',
        name: '修改信息',
        component: _import('admin/user/info', 'views')
      }
    ]
  },
  {
    path: '/orderdetails',
    component: Layout,
    redirect: '/orderdetails/index',
    children: [
      {
        path: 'index',
        name: '订单详情',
        component: _import('business/order/orderDetail', 'views')
      }
    ]
  },
  {
    path: '/addProductCate',
    component: Layout,
    redirect: '/addProductCate/index',
    children: [
      {
        path: 'index',
        name: '商品分类',
        component: _import('business/classify/add', 'views')
      }
    ]
  },
  {
    path: '/updateProductCate',
    component: Layout,
    redirect: '/updateProductCate/index',
    children: [
      {
        path: 'index',
        name: '商品分类',
        component: _import('business/classify/update', 'views')
      }
    ]
  },
  {
    path: '/advadd',
    component: Layout,
    redirect: '/advadd/index',
    children: [
      {
        path: 'index',
        name: '添加广告',
        component: _import('mall/advertise/add', 'views')
      }
    ]
  },
  {
    path: '/advupdate',
    component: Layout,
    redirect: '/advupdate/index',
    children: [
      {
        path: 'index',
        name: '编辑广告',
        component: _import('mall/advertise/update', 'views')
      }
    ]
  },
  {
    path: '/404',
    component: _import('error-page/404', 'components'),
    name: '404'
  },
  {
    path: '/403',
    component: _import('error-page/403', 'components'),
    name: '403'
  },
  {
    path: '/500',
    component: _import('error-page/500', 'components'),
    name: '500'
  },
  {
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: ':routerPath',
        name: 'iframe',
        component: _import('iframe/main', 'components'),
        props: true
      }
    ]
  }
]
