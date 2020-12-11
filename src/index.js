/* 
    入口js文件
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';


//读取本地中保存的user，再保存到内存中（注意在admin.jsx中没有必要读取本地中user，在那里我直接在内存中读取就好了）
/* 
    网页一刷新，其实就是重新渲染页面，重新渲染页面即在index.js开始的，
    所以我统一在index.js中在本地读取，然后存进去内存中，
    之后每个单页页面就能通过内存间接访问到本地的user 
*/
const user = storageUtils.getUser()
memoryUtils.user = user


ReactDOM.render(<App/>, document.getElementById('root'))