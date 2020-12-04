import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { reqWeather } from '../../api';
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import './index.less'
import memoryUtils from '../../utils/memoryUtils';
import {formateDate} from '../../utils/dateUtils';

const { confirm } = Modal;
class Header extends Component {
    state = {
        citynm: '',
        weather: '',
        weather_icon: '',
        currentDate: formateDate(Date.now())
    }
    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(value => {
            if (value.key === path) {//如果当前value对象的key和path一样，则value的title就是我要显示的title
                title = value.title
            } else if (value.subMenuList) {//又如果此时有子菜单
                const subMenu = value.subMenuList.find(value2 => value2.key === path)
                if (subMenu) {//如果上面find()找到了，就执行下面语句
                    title = subMenu.title
                }
            }
        })
        return title
    }
    getTime = () => {
        this.intervalId = setInterval(() => {
            this.setState({currentDate: formateDate(Date.now())})
        }, 1000)
    }
    getWeather = async () => {
        const wea = await reqWeather('广州')
        console.log(wea);
        const {citynm, weather,weather_icon} = wea.data.result
        this.setState({citynm, weather, weather_icon})
    }

    logOut = () => {
        confirm({
          title: '确认登出账号吗?',
          icon: <ExclamationCircleOutlined />,
          content: '你将会返回到登录界面',
          onOk: () => {
            storageUtils.removeUser()
            memoryUtils.user = {}/* 清除内存中用户信息 */
            // window.history.go(0) /* 这个是网址的刷新，使用这个方式就不用清楚内存中用户信息 */
            this.props.history.replace('/login') 
            /*  ↑这个是路由的跳转，网址不用刷新，所以内存还保留，所以要清楚内存中的用户信息。
                另外：使用这个replace()的前提是当前为路由组件，并且onOk要改为箭头函数(this的指向不正确) */
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }
    componentDidMount() {
        this.getTime()
        this.getWeather()
    }
    componentWillUnmount() {
        // 清楚定时器
        clearInterval(this.intervalId)
    }

    render() { 
        const {username} = memoryUtils.user
        const {weather, weather_icon, citynm} = this.state
        const title = this.getTitle()/* 这里暂时不可以放在生命周期的didMount或willMount中，因为这里是要每一次切换路由即每一次渲染都要变化，而didMount是挂载组件 */
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <Button type="primary" size='small' onClick={this.logOut} className='log-out'>登出</Button>
                    </div>
                <div className='header-bottom'>
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{this.state.currentDate}</span>
                        <img src={weather_icon} alt="weather"/>
                        <span>{citynm} {weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
 
export default withRouter(Header);