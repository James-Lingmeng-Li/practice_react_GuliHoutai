/* 
    这是一个 包含应用中 所有接口请求函数的 模块。
    req:请求(request)

    （做这个模块的教学目的是：能根据接口文档定义接口请求）
*/
import ajax from './ajax';
import axios from 'axios';
const BASE = '' /* 空串是为了不让域名固定。因为有可能是3000端口，也有可能是3001，所以就不固定写3000 */

// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')
// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')
// 请求天气
export const reqWeather = (city) => {
    const url = 'http://api.k780.com'
    return axios.get(url, {
        params: {
            app:'weather.today',
            weaid: city,
            appkey:55743,
            sign:'0f20ff36425bba040b24bc7b9dc70dd2',
            format:'json' 
        }
    })
}
// 获取一级/二级分类的列表
export const reqCategories = (parentId) => ajax(BASE+'/manage/category/list', {parentId/* : parentId */}/* ,'GET' */)
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE+'/manage/category/add', {categoryName, parentId},'POST')
// 更新分类
export const reqUpdateCategory = ({categoryName, categoryId}) => ajax(BASE+'/manage/category/update', {categoryName, categoryId}, 'POST')
// export const reqUpdateCategory = ({categoryName: categoryName, categoryId: categoryId}) => ajax(BASE+'/manage/category/update',{categoryName: categoryName, categoryId: categoryId}, 'POST')
    /* 这里添加分类和更新分类传参时用了两种格式，都可以 */

// 获取商品分页列表 (pageSize是每页数量，pageNum是请求数据的页码)
export const reqProducts = (pageNum, pageSize) => ajax(BASE+'/manage/product/list',{pageNum, pageSize})
// 获取商品分页列表 (searchType是搜索的类型，是根据商品描述还是商品名称)
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE+'/manage/product/search',{
    pageNum, 
    pageSize,
    [searchType]: searchName,
})
// 对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax(BASE+'/manage/product/updateStatus',{productId, status}, 'POST')
// 根据分类ID获取分类名称
export const reqCategoryName = (categoryId) => ajax(BASE+'/manage/category/info',{categoryId})

// 删除图片
export const reqDeltePicture = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')
// 添加或更新商品
export const reqAddorUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update': 'add'), product, 'POST')/* 注意这里product本身就是一个对象，所以就不需要再加花括号 */

