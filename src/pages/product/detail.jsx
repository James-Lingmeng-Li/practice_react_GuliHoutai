/* 
    商品信息详情
*/
import React, { Component } from 'react';
import { Card, List } from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import { BASE_IMG_URL } from '../../utils/constants';
import { reqCategoryName } from '../../api';


class Detail extends Component {
    state = {
        cName1: '',//一级分类名称
        cName2: '',//二级分类名称
    }
    async componentDidMount() {
        // 得到当前商品的分类ID
        const {pCategoryId, categoryId} = this.props.location.state.product
        if (pCategoryId === '0') {
            const result = await reqCategoryName(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
            const result = await reqCategoryName(categoryId)
            const cName1 = result.data.categoryname
            const cName2 = result.data.name
            this.setState({cName1, cName2})

        }
    }
    render() {
        // 读取携带过来的商品信息数据
        // console.log(this.props.location.state)
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state
        const title = (
            <span style={{fontWeight: 'bold'}}>
                <ArrowLeftOutlined 
                    style={{ marginRight: 10, color: 'blue'}}
                    onClick={() => this.props.history.goBack()}
                    /* 这个回来好像只能回到页码1 */
                />商品详情
            </span>
        )
        return (
            <Card title={title} style={{ width: 'auto' }}>
                <List
                    bordered
                    className='product-detail'
                >
                    <List.Item>
                        <span className='left'>商品名称：</span>
                        {name}
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品描述：</span>
                        {desc}
                    </List.Item>
                    <List.Item>
                        <span className='left'>商品价格：</span>
                        {price}元
                    </List.Item>
                    <List.Item  className='ant-list-item-no-flex'>
                        <span className='left'>所属分类：</span>
                        <span>{cName1} {cName2 ? '-> ' + cName2: ''}</span>
                        {/* 这里需要重新发送ajax请求获取，因为我们只有分类的id */}
                    </List.Item>
                    <List.Item className='ant-list-item-no-flex'> 
                        <span className='left'>商品图片：</span>
                        {
                            imgs.map((value, index) => {
                                return (
                                    <img src={BASE_IMG_URL+value} alt="img" key={index}/>
                                )
                         })
                        }
                    </List.Item>
                    <List.Item className='ant-list-item-no-flex'>
                        <span className='left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}></span>    
                        {/* <span dangerouslySetInnerHTML={{__html:'<h3 style="color:red">商品详情内容<h3>'}}></span>     */}
                        {/* dangerouslySetInnerHTML是react的api,用于替换innerHtml */}
                    </List.Item>
                </List>
            </Card>
        )
    }
}
 
export default Detail;