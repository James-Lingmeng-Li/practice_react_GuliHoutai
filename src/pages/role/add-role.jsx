//  添加分类的form组件
/* 一些路由组件独有的非路由组件也可以放到pages文件夹的对应路由组件文件夹下 */
/* 不一定非要放在components文件夹下 */

import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';


class AddRole extends Component {
    static propTypes = {
        setForm: PropTypes.func.isRequired,
    }
    formRef = React.createRef()
    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }
    render() {
        return (
            <Form
                ref={this.formRef}
            >
                <Form.Item
                    name='roleName'
                    rules={[
                        {
                            required: true,
                            message: '请输入需要添加角色的名称!'
                        },
                    ]}
                    label='角色名称：'
                >
                    <Input
                        placeholder='请输入角色名称'
                        autoFocus
                    >
                    </Input>
                </Form.Item>
            </Form>
        )
    }
}

export default AddRole;