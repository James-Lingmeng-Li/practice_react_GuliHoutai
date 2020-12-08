import React, { Component } from 'react';
import { Input, Tree, Form } from 'antd';
import PropTypes from 'prop-types';
import menuList from '../../config/menuConfig';

const getTreeNodes = (menuList) => {
    return menuList.map(value => (
        {
            title: value.title,
            key: value.key,
            children: value.subMenuList ? getTreeNodes(value.subMenuList) : null
        }
    ))
}
const treeData = [
    {
        title: '平台权限',/* 根节点 */
        key: 'all',
        children: getTreeNodes(menuList)
    },
];


class SetAuth extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {
            defaultCheckedKeys: this.props.role.menus,
            newCheckedKeys: undefined
        }
    }
    // 为父组件提供最新的menus的方法
    getMenus = () => {
        this.setState({ newCheckedKeys: undefined })
        return this.state.newCheckedKeys
    }

    // 勾选复选框时的回调函数
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        this.setState({ newCheckedKeys: checkedKeys })/* 原来勾选非默认选中的复选框时，是不能选中的，加了这行还有设置了一些状态就可以了*/
    };
    static getDerivedStateFromProps(newprops, state) {
        const menus = newprops.role.menus
        return ({ defaultCheckedKeys: menus })
    }
    render() {
        const { role } = this.props
        const { newCheckedKeys, defaultCheckedKeys } = this.state
        return (
            <Form>
                <Form.Item label='角色名称'>
                    <Input value={role.name} disabled />
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    onCheck={this.onCheck}
                    treeData={treeData}
                    checkedKeys={newCheckedKeys ? newCheckedKeys : defaultCheckedKeys}/* 指定哪些复选框应该被选中 */
                />
            </Form>
        )
    }
}

export default SetAuth;