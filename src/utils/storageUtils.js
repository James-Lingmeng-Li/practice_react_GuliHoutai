/* 
    进行local数据存储管理的工具模块
*/

import store from 'store';
const USER_KEY = 'user_key'
export default {
    /* 
        保存user、读取user、删除user
    */
   saveUser(user) {
       /* 要传入字符串，而user本身是一个对象，所以我们传入一个JSON格式的字符串 */
       store.set(USER_KEY, user)
   },

   getUser() {
       /* 目的是返回一个对象，而getItem()返回的是JSON格式的字符串 */
       return store.get(USER_KEY) || {}
       /* 若存储数据的时候没存到，那么读取的时候就会读不到，getItem()会返回null. */
       /* 但JSON.parse不会解析null，所以我希望当是null的时候返回一个空对象给我，
        这样至少我在点什么属性的时候不会报错，所以就用了 || '{}' */
   },
   removeUser() {
       store.remove(USER_KEY)
   }
}