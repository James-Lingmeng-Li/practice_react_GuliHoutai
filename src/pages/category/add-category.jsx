//  添加分类的form组件
/* 一些路由组件独有的非路由组件也可以放到pages文件夹的对应路由组件文件夹下 */
/* 不一定非要放在components文件夹下 */

import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';


class AddCategory extends Component {
    static propTypes = {
        categories: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired,
    }
    formRef = React.createRef()
    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }
    render() {
        const {categories, parentId} = this.props
        return (
            <Form 
                ref={this.formRef}
                initialValues={{parentId}}
                onValuesChange={this.handleAllChange}
                >
                <Form.Item>
                    <p>分类名称：</p>
                    <Form.Item name='parentId'>
                        <Select>
                            <Select.Option value='0'>一级分类</Select.Option>
                            {
                                categories.map(
                                    (value) => <Select.Option value={value._id} key={value._id}>{value.name}</Select.Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <p>添加分类：</p>
                    <Form.Item 
                        name='categoryName'
                        rules={[
                            {
                                required: true,
                                message: '请输入需要修改分类的名称!'
                            },
                        ]}    
                        > 
                        <Input 
                            placeholder='请输入分类名称'
                            autoFocus
                            >
                        </Input>
                    </Form.Item>
                </Form.Item>
            </Form>
        )
    }
}
 
export default AddCategory;