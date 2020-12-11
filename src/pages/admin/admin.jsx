/* 后台管理的路由组件 */
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import { Button, Layout } from 'antd';  
import memoryUtils from '../../utils/memoryUtils';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import './admin.less'

import Home from '../home/home';
import Category from '../category/category';
import Bar from '../charts/bar';
import Line from '../charts/line';
import Pie from '../charts/pie';
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
    render() { 
        const user = memoryUtils.user
        // 如果内存没有存储user（即当前没有登录）（注意网页一刷新，内存就会没）
        if (!user || !user._id) {
            // 自动跳转到登录界面(注意：在render()里面跳转页面通常用<Redirect/>，在事件回调函数的跳转页面则用history)
            return <Redirect to='/login'/>
            
        }

        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{margin: '20px', backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color:'#ccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
 
export default Admin;