/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 老项目域名地址
 * khglUrl: 客户管理域名地址
 * dicUrl : 字典服务器地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * welUrl :默认欢迎页
 *
 */

let baseUrl = ''
const iconfontVersion = [
  '567566_r22zi6t8noas8aor',
  '599693_0b5sleso3f1j1yvi',
  '667895_xte3dcfrvbo6r',
  '1288467_65q4s73jbj'
]
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`
const codeUrl = `/createCode`
// const codeUrl = `https://192.168.16.47:9999/admin/code`
if (process.env.NODE_ENV === 'development') {
  baseUrl = `http://122.114.5.63:8080/`
  // baseUrl = `http://192.168.10.254:80/`
  // baseUrl = `http://192.168.1.2:8080/`
  // baseUrl = `http://192.168.1.9:8081/`
  // baseUrl = `http://192.168.10.108:8080/`
  // baseUrl = `http://192.168.10.106:80/`
  // baseUrl = `http://192.168.10.103:80/`
  // baseUrl = `http://192.168.10.100:80/`
  // baseUrl = `http://192.168.10.102:80/`
  // baseUrl = 'http://ujsmart.natapp1.cc'
} else if (process.env.NODE_ENV === 'production') {
  // baseUrl = 'http://ujsmart.natapp1.cc'
  baseUrl = `https://218.28.14.156:9999/`
  // baseUrl = `https://192.168.16.47:9999/`
}

export { baseUrl, iconfontUrl, iconfontVersion, codeUrl }
