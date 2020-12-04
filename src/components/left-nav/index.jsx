import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom';
import { Menu } from 'antd';
import menuList from '../../config/menuConfig';
import logo from '../../assets/images/bg-logo.png';
import './index.less';
import MenuItem from 'antd/lib/menu/MenuItem';

const { SubMenu } = Menu;/* 子菜单 */
/* 左侧导航的组件 */
class LeftNav extends Component {
    // 根据menu的数据数组生成对应的标签数组
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(value => {
            if (!value.subMenuList) {
                return (
                    <MenuItem key={value.key} icon={value.icon}>
                        <Link to={value.key}>{value.title}</Link>
                    </MenuItem>
                )
            } else {
                // 查找（筛选）一个与当前地址栏请求路径一样的子菜单
                const submenu = value.subMenuList.find(value => path.indexOf(value.key) === 0)
                /* 这里的value是上一级的value */
                // 如果存在，说明当前菜单的子菜单需要展开
                if (submenu) {
                    this.openMenu = value.key/* 往组件存了一个属性openMenu属性 */
                }
                return (
                    <SubMenu key={value.key} icon={value.icon} title={value.title}>
                        {this.getMenuNodes(value.subMenuList)}
                        {/* 这里不用递归也可以，但只能渲染到两级菜单 */}
                    </SubMenu>
                )
            }
        })
    }
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() { 
        // 避免const openMenu = this.openMenu得不到数据，把this.getMenuNodes(menuList)提上来，
        /* 
            但其实this.getMenuNodes(menuList)放在这里其实还不算好，因为
            每次渲染都要调用一次这个方法，其实没必要。所以我们利用生命周期函数
        */
        // const menuNodes = this.getMenuNodes(menuList)
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        /* ↑left-nav.jsx不是路由组件，所以没有location这个属性，所以会报错 */
        /* 我们可以利用withRouter来获得location这个属性 */
        if (path.indexOf("/product") === 0) {
            // 当前请求的是商品或其子路由
            path = '/product'
        }

        // 得到需要打开的菜单
        const openMenu = this.openMenu


        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/><h1>谷粒后台</h1>
                </Link>
                <div style={{ width: 200 }}>
                    <Menu
                        // defaultSelectedKeys={[path]}/* 默认选中的菜单项(注意这里只是显示上的选中) */
                        /* 
                            defaultSelectedKeys只生效一次，即页面第一次渲染时生效，
                            而打开localhost:3000/时实际上会自动跳转到localhost:3000/home，
                            此时会再渲染一次，而这次渲染defaultSelectedKeys就不生效，
                            所以我们使用selectedKeys，它每渲染一次就生效一次 
                        */
                        selectedKeys={[path]}/* 当前选中的key，即UI界面下当前选中的导航按钮 */
                        defaultOpenKeys={[openMenu]}/* 默认选中的拥有子菜单的菜单项 */
                        mode="inline"
                        theme="dark"
                    >
                    {
                        // this.getMenuNodes(menuList) /* 如果在这里调用的话，render()内的const openMenu = this.openMenu就会得不到数据，所以要先提上去 */
                        this.menuNodes
                    }
                    </Menu>
                </div>
            </div>
            
            
        )
    }
}

/* withRouter（高阶组件）：
    包装非路由组件，返回一个新的组件。
    新的组件向非路由组件传递三个属性：history/location/match
*/
export default withRouter(LeftNav);
// export default LeftNav;