import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

class AddUser extends Component {
    static propTypes = {
        roles: PropTypes.array.isRequired,
        setForm: PropTypes.func.isRequired,
        user: PropTypes.object
    }
    formRef = React.createRef()
    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }
    render() {
        const { roles, user } = this.props
        // console.log(user);
        return (
            <Form
                ref={this.formRef}
                onValuesChange={this.handleAllChange}
                labelCol={{ span: 4, offset: 2 }}
                labelAlign='left'
                wrapperCol={{ span: 16, offset: 0 }}
                initialValues={{
                    username: user.username,
                    phone: user.phone,
                    email: user.email,
                    role_id: user.role_id,
                }}
            >
                <Form.Item
                    label='用户名'
                    name='username'
                    validateFirst={true}/* 当某一规则校验不通过时，停止剩下的规则的校验 */
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名!'
                        },
                        {
                            min: 4,
                            message: '用户名长度至少4位'
                        },
                        {
                            max: 12,
                            message: '用户名长度至多是12位'
                        },
                        {
                            pattern: /^[a-zA-Z0-9_]+$/,
                            message: '用户名只能由字母、数字或下划线组成'
                        },
                    ]}
                >
                    <Input
                        placeholder='请输入用户名'
                        autoFocus
                    >
                    </Input>
                </Form.Item>
                {
                    user._id ? null : 
                    (<Form.Item
                        label='密码：'
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!'
                            },
                        ]}
                    >
                        <Input
                            type='password'
                            placeholder='请输入密码！'
                        >
                        </Input>
                    </Form.Item>)
                }
                <Form.Item
                    label='手机号码：'
                    name='phone'
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号码!'
                        },
                    ]}
                >
                    <Input
                        placeholder='请输入手机号码！'
                    >
                    </Input>
                </Form.Item>
                <Form.Item
                    label='邮箱'
                    name='email'
                    rules={[
                        {
                            required: true,
                            message: '请输入邮箱!'
                        },
                    ]}
                >
                    <Input
                        placeholder='请输入邮箱！'
                    >
                    </Input>
                </Form.Item>
                <Form.Item
                    label='角色'
                    name='role_id'
                    rules={[
                        {
                            required: true,
                            message: '请输入角色!'
                        },
                    ]}
                >
                    <Select placeholder='请选择角色分类！'>
                        {
                            roles.map(value => (
                                <Select.Option key={value._id} value={value._id}>{value.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}

export default AddUser;