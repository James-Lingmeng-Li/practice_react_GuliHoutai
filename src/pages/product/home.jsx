/* 
    Product的默认子路由组件
*/
import React, { Component } from 'react';
import { Card, Table, Select, Input, Button, message } from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index';
import { PAGE_SIZE } from '../../utils/constants';

class ProductHome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],//商品的数组
            total: 0,//商品的数量
            loading: false,
            // 以下是收集表格左上角需要搜索的类型和关键字数据（注意这里未使用表单）
            searchName: '',/* 搜索的关键字 */
            searchType: 'productName',/* 搜索类型。默认值:根据商品名称搜索 */
        }
        this.initColumns()
    }
    // 设置表格头
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',/* dataIndex的值对应着数据源中的键名 */
                align: 'center',
                // key: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                align: 'center',
                // key: 'age'
            },
            {
                title: '价格',
                dataIndex: 'price',
                align: 'center',
                render: (price) => '¥'+ price
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status', /* 不能写dataIndex，因为写了就获取不到pruductId */
                align: 'center',
                render: (product) => {
                    const {status, _id} = product
                    return (
                        <span>
                            <Button 
                                type='primary'
                                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
                                >
                                {status === 1 ? '下架':'上架'}
                            </Button>
                            <span 
                                style={{display: "block"}}
                                >
                                {status === 1 ? '在售':'已下架'}
                            </span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                align: 'center',
                render: (product) => (
                    <span>
                        <a 
                            style={{display:'block', cursor:'pointer'}}
                            onClick={() => this.props.history.push('/product/detail', {product})}
                            /* ↑因为此时ProductHome是路由组件，所以可以用push */
                            /* 这里路由组件向下一路由组件发送product没有利用props，而是react-router的一个history的api */
                        >详情</a>
                        <a 
                            style={{display:'block', cursor:'pointer'}}
                            onClick={() => {this.props.history.push('/product/addupdate', product)}}
                        >修改</a>
                    </span>
                )
            },
        ];
    }
    //  更新商品状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('状态更改成功')
            this.getProducts(this.pageNum)
        } else {
            message.error('状态更改失败')
        }
    }

    // 获取指定页码的列表数据显示（）
    getProducts = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum，让其它方法看到(其实是给更新商品状态时使用，为的是更新状态后跳转到更新了的商品的页面）
        this.setState({loading: true})
        const {searchName, searchType} = this.state
        let result
        // 如果搜索框有值，则获取列表
        if (searchName) {
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        } else {//一般分页
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({loading: false})//发送完请求后，隐藏loading
        if (result.status === 0) {
            // 取出分页数据，更新状态使显示分页列表
            const {total, list} = result.data
            this.setState({
                total,
                products: list,
            })
        }
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        // 取出state内的数据
        const {products, total,loading, searchName, searchType} = this.state
        const title = (
            <span >
                <Select 
                    value={searchType}/* 该行的value是指定默认选中的option */
                    onChange={value => this.setState({searchType: value})}/* 这里的onChange是Select的api。value是option标签的value */
                >
                    <Select.Option value='productName'>按名称搜索</Select.Option>
                    <Select.Option value='productDesc'>按描述搜索</Select.Option>
                </Select>
                <Input 
                    placeholder='关键字' 
                    style={{width: 200, margin:'0 10px'}}
                    value={searchName}/* 如果state的searchName不发生改变，则此时在input中打的字会显示不了。 */
                    onChange={event => {
                        this.setState({searchName: event.target.value})
                        console.log(event)}}/* 这里的onChange是Input的api。如果不知道参数event有什么东西的话，可以console一下 */
                ></Input>
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
                {/* 注意这里使用受控组件的方式，来获取Select和input的值 */}
            </span>
        ) 

        return (
            <Card 
                title={title} 
                extra={<Button 
                            type="primary" 
                            onClick={() => {this.props.history.push('/product/addupdate')}}
                            ><PlusOutlined/>添加商品
                        </Button>} 
                style={{ width: '100%' }}>
                <Table 
                    bordered
                    dataSource={products} 
                    columns={this.columns}
                    rowKey='_id' /* 指定了rowKey就不用指定columns的key了 */
                    pagination={//分页器
                        {
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            total,
                            onChange: this.getProducts,//是下面的简化写法
                            /* onChange: (pageNum) => {
                                this.getProducts(pageNum)
                            } */
                            /* 
                                页码改变的回调，参数是改变后的页码及每页条数。
                                应该是自动传入你此刻点击的页码。
                            */
                        }
                    }
                    loading={loading}
                />
            </Card>
        )
    }
}
 
export default ProductHome;