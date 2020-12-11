/* 
    能发送异步ajax请求的函数模块
    封装了axios库
*/
import { message } from 'antd';
import axios from 'axios';

/* 
    data:请求参数
    type:请求方式

    优化2：异步得到的不是value，而是value.data 
*/
export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise/* 这里用let是因为const不允许在声明时不赋值;而且单独提一个promise出来是因为下面有两种情况 */
        // 1.执行异步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data
            })
        } else {
            promise = axios.post(url, data)
        }
        // 2.如果成功了，调用resolve(value)
        promise.then(value => {
            resolve(value.data)
            // 3.如果失败了，不调用reject(reason)，而是提示异常信息
        }).catch(error => {
            message.error('请求出错了'+ error.message)
        })
    })
    // 此时该ajax返回的promise的状态永远不会出错
};

// 请求登录接口
// ajax('/login', {
//     username: '',
//     password: ''
// }, 'POST').then()