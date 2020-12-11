import React, { Component } from 'react';
import { Card, Button, Modal, Table, message } from 'antd';
import AddUser from './add-user';
import { formateDate } from '../../utils/dateUtils';
import { PAGE_SIZE } from '../../utils/constants';
import { reqUsers, reqDeleteUser, reqAddorUpdateUser } from '../../api';

class User extends Component {
    state = {
        users: [],   //所有用户列表
        roles: [],   //所有角色列表，这是获取所有用户列表的接口返回的数据中里面的roles
        isShow: false
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                render: (role_id) => this.roleNames[role_id]/* 用该方法就不会每次都要遍历roles数组 */
                /* ↑原本是显示角色的id，现在要将其转换为对应的角色名 */
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <a
                            style={{ marginRight: 10 }}
                            onClick={() => this.showUpdate(user)}

                        >修改</a>
                        <a
                            onClick={() => this.deleteUser(user)}
                        >删除</a>
                    </span>
                )
            },
        ];
    }
    // 根据roles的数组，生成包含所有角色名的对象（属性名为角色id），方便“所属角色”的渲染
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name/* role是数组的每个元素，在这里是包含role信息的对象 */
            return pre
        }, {})/* 初始值是一个空对象，作为第一次调用callback的第一个参数pre，所以上两行的pre已经是一个对象 */
        // 保存到组件对象内，然后供initColumn()调用
        this.roleNames = roleNames
    }
    showUpdate = (user) => {
        this.user = user/* 存储这个user，提供给其他方法或标签使用 */
        this.setState({ isShow: true })
    }
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({ users, roles })
        }

    }
    addOrUpdateUser = async () => {
        // 收集数据
        const user = this.form.getFieldsValue()
        console.log(user);
        // 如果此时是更新，需要给user额外指定一个_id属性(因为此时收集到的数据是不包含_id数据的)
        if (this.user) {
            user._id = this.user._id
        }
        // 提交请求
        const result = await reqAddorUpdateUser(user)
        this.setState({ isShow: false })
        if (result.status === 0) {
            message.success(`${user._id ? '更新' : '添加'}用户成功！`)
            this.getUsers()
        }

    }
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }
            },
        });
    }

    UNSAFE_componentWillMount() {
        // 为第一次render准备数据
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }
    render() {
        const { users, isShow, roles } = this.state
        const user = this.user || {}    /* 为避免AddUser组件出错 */
        const title = (
            <Button
                type='primary'
                onClick={() => {
                    this.setState({ isShow: true })
                    this.user = null    //该行用来 在点击该按钮后对话框标题能显示为“添加用户”，而不受点击修改按钮后的干扰。
                }}
            >创建用户</Button>
        )
        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    bordered
                    dataSource={users}/* dataSoure数据源是接收一个数组的 */
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                />
                <Modal
                    title={user._id ? '更新用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({ isShow: false })
                    }}
                    destroyOnClose={true}
                >
                    <AddUser
                        roles={roles}/* 向该组件传入角色信息，让其知道可选择的角色有哪些 */
                        user={user}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}

export default User;