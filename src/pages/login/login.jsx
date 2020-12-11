import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom';
import './login.less'
import logo from '../../assets/images/bg-logo.png'
import { reqLogin } from '../../api';/* 这里等同于../../api/index   因为引入时会自动引入文件夹中名为index.js的模块 */
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';

class Login extends Component {
    render() {
        // 如果用户已经登录，自动跳转到管理页面
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/'/>
        } 
        const onFinish = async (values) => {
            console.log('校验成功，即将发送数据请求到服务器',/*  values */);

            // 使用async和await来简化异步流程（注意await必须在async函数内）
            const result = await reqLogin(values.username, values.password)
            const remember = document.getElementById('normal_login_remember')
            console.log('请求成功啦', result); 
            if(result.status === 0) {//0为登录成功
                message.success('登录成功')
                // 跳转到后台管理界面（不需要再回退回来，所以用relace)
                /* 这里的history属性是react-router-dom包赋予的 */
                const user = result.data
                memoryUtils.user = user//保存在内存中
                if(remember.checked){/* 如果remember me 为选中状态，则↓ */
                    storageUtils.saveUser(user) //保存在本地
                }
                this.props.history.replace('/')
            } else {//1为登录失败
                // 提示错误信息
                message.error(result.msg)
            }
        };
        const onFinishFailed = (obj) => {
            console.log('校验失败', obj);
            // alert(obj.errorFields[0].errors)
        };
        return (
            <div className='login'>
                <header className='login-header'><img src={logo} alt='logo'/> React项目：后台管理系统</header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    {/* 这个Form组件其实还接收了form这个prop属性，该form属性有很多方法，可通过开发者工具查看 */}
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                            name="username"
                            validateFirst= {true}/* 当某一规则校验不通过时，停止剩下的规则的校验 */
                            rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                            {
                                min: 4,
                                message:'用户名长度至少4位'
                            },
                            {
                                max: 12,
                                message:'用户名长度至多是12位'
                            },
                            {
                                pattern: /^[a-zA-Z0-9_]+$/,
                                message:'用户名只能由字母、数字或下划线组成'
                            },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}}/>} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                            ]}
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" style={{color:'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" >
                            登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}
 
export default Login;