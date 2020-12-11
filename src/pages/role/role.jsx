import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd';
import { PAGE_SIZE } from '../../utils/constants';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api';
import AddRole from './add-role';
import SetAuth from './set-auth';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { formateDate } from '../../utils/dateUtils';
class Role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roles: [],// 所有角色的列表
            role: {}, //选中的role
            isShowAdd: false,//是否显示添加界面
            isShowAuth: false,
            confirmLoading: false
        }
        this.initColumns()
        this.auth = React.createRef()/* 为了得到子组件SetAuth的数据 */
    }
    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
                /* 把时间戳格式化 */
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ]
    }
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            this.setState({ roles: result.data })
        }
    }
    onRow = (role) => {/* 这是Table的api，并且其中设置了点击某一行的事件回调函数 */
        return {
            onClick: event => {
                // 这里的参数role是datasource数组的每一个元素，即存储了角色所有信息的对象
                this.setState({ role })
            }
        }
    }
    addRole = () => {
        this.form.validateFields()
            .then(async (values) => {
                // 收集输入的数据
                const { roleName } = values /* 这里的roleName已经是文本框的值了 */
                this.setState({ confirmLoading: true })
                // 请求添加
                const result = await reqAddRole(roleName)
                // 根据结果提示/更新提示
                if (result.status === 0) {
                    message.success('添加角色成功！')
                    this.getRoles()/* 这里也可以不发请求来更新数据，因为返回的result.data就是新产生的角色的信息，我们把它添加到状态里的roles数组的后面就行，即更新状态 */
                    this.setState({ isShowAdd: false })
                    this.setState({ confirmLoading: false })
                } else {
                    message.error('添加角色失败！')
                }
            })
    }
    setAuth = async () => {
        this.setState({isShowAuth:false})
        const role = this.state.role/* 当前选中的role */
        // 得到最新的role
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username/* 设置授权人 */
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            /* 这里由于role的指向的是roles的一个元素，所以都是指向同一个对象，所以不需要发送请求也能看到权限更新 */
            // 如果当前账号更新的自己所属角色的权限，则强制退出
            if (role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}/* 清空内存的数据 */
                storageUtils.removeUser()/* 移除浏览器localStorage的数据 */
                this.props.history.replace('/login')
                message.success('当前用户权限已修改，您需要重新登录')
            } else {
                message.success('角色权限更新成功')
            }

            
        } else {
            message.success('角色权限更新失败')
        }


    }
    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role, isShowAdd, confirmLoading, isShowAuth } = this.state
        const title = (
            <span>
                <Button
                    type='primary'
                    onClick={() => { this.setState({ isShowAdd: true }) }}
                >创建角色
                </Button> &nbsp;&nbsp;
                <Button
                    type='primary'
                    disabled={!role._id}
                    onClick={() => { this.setState({ isShowAuth: true }) }}
                >设置角色权限
                    </Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({ role })
                        }
                    }}/* selectedRowKeys:指定选中项的 key值。这里的key那么其实就是role的_id，因为rowKey='_id'.这里是数组是因为还可能有复选框的存在 */
                    /* ↑上面这里是根据role的_id来显示单选框是否选中。即我要根据某key值来显示对应行的单选框 */
                    /* ↑单独指定了单选框选中的key，就不能点击按钮来选中了。此时通过rowSelection内的onSelect来解决这个bug */
                    onRow={this.onRow}/* 行属性，值是一个函数。这里是间接用来点击时某一行任意位置时能选择对应的单选框 */

                >
                </Table>
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => { this.setState({ isShowAdd: false }) }}
                    destroyOnClose={true}
                    confirmLoading={confirmLoading}
                >
                    <AddRole setForm={(form) => { this.form = form }} />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.setAuth}
                    onCancel={() => { this.setState({ isShowAuth: false }) }}
                    // destroyOnClose={true}/* 设置为true可以销毁该组件的子元素，重新显示这些子元素就能重新渲染 */
                >
                    <SetAuth role={role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}

export default Role;