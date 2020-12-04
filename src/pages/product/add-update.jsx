/* 
    用于添加或更新商品信息
*/
import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqCategories, reqAddorUpdateProduct } from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';


class ProductAddUpdate extends Component {
    product = this.props.location.state
    state = {
        optionsList: [],
        isUpdate: !!this.product,  /* 进行一个强制类型转换，来作为一个布尔值。 */
        /* ↑用来判断现在是添加商品还是修改商品信息 */
        product: this.product || {}/* 用于点击修改商品时默认显示的值。加了“|| {}”是为了防止点击添加商品时不报错 */
    }
    formRef = React.createRef()
    imgs = React.createRef()
    editor = React.createRef()
    getCategories = async (parentId) => {
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            const categories = result.data /* 是个数组，每个数组包含一个对象 */
            if (parentId === '0') {/* 如果请求的是一级分类列表 */
                this.initOptionsList(categories)
            } else {//二级分类列表
                return categories   /* 注意该函数由于加了async所以其返回一个Promise对象 */
            }
        }
    }
    initOptionsList = async (categories) => {
        // 初始化时，先生成一级分类列表
        // 根据categories数组生成optionsList数组，optionList的格式如下，每个数组是个对象
        const optionsList = categories.map(value => ({
            value: value._id,
            label: value.name,
            isLeaf: false,/* 如果不是叶子，该选项后面会有个箭头，表示后面还有二级分类 */
        }))

        // 如果是一个属于二级分类的商品点击了“修改”按钮，则也要生成二级分类列表
        const {isUpdate, product} = this.state
        if (isUpdate && product.pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategories = await this.getCategories(product.pCategoryId)
            // 生成二级下拉列表
            const childOptions = subCategories.map(value => ({
                value: value._id,
                label: value.name,
                isLeaf: true,
            }))
            // 找到当前商品对应的一级option对象
            const targetOption = optionsList.find(value => value.value === product.pCategoryId)
            /* 这里请记住product是上一级路由组件传过来的数据，我们使用this.location.state接收了它 */
            
            // 关联到对应的一级optionsList上    
            // console.log('targetOption',targetOption);
            targetOption.children = childOptions
        } 



        this.setState({ optionsList })
    }
    onFinish = async () => {
        // 1.收集数据并封装成product对象
        // 利用ref从子组件PicturesWall搜集已上传了的图片的数据
        const imgs = this.imgs.current.getImgs()/* 该方法返回一个包含图片名的数组，这些图片是刚刚上传的 */
        const { name, desc, price, categoryIds} = this.formRef.current.getFieldsValue()
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const htmlValue = this.editor.current.getHtmlValue()
        const product = {name, desc, price, imgs, htmlValue, pCategoryId, categoryId}
        console.log('onFinish()', product);
        if(this.state.isUpdate) {/* 如果是更新商品，需要添加_id */
            product._id = this.state.product._id
        }
        // 2.调用接口请求函数去添加/更新
        const result = await reqAddorUpdateProduct(product)
        console.log(result);
        // 3. 根据结果提示
        if (result.status === 0) {
            message.success(`${this.state.isUpdate?'更新': '添加'}商品成功！`)
            this.props.history.goBack()
        }else {
            message.error(`${this.state.isUpdate?'更新': '添加'}商品失败！`)
        }

    }
    loadData = async selectedOptions => {/* selectedOptions是我们选中的选项，这里它认为我们可以同时选中多项，所以是个数组，但其实我们只选择一项 */
        const targetOption = selectedOptions[selectedOptions.length - 1];/* 这里其实即是[0] */
        // 显示loading效果
        targetOption.loading = true;

        // 获取被点击的分类的_id，来请求二级分类列表
        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false;
        if (subCategories && subCategories.length > 0) {/* 如果二级列表存在 */
            targetOption.children = subCategories.map(value => ({
                value: value._id,
                label: value.name,
                isLeaf: true,
            }))
        } else {/* 如果当前选中的分类没有二级分类 */
            targetOption.isLeaf = true
        }
        this.setState({ optionsList: [...this.state.optionsList] });
    };
    componentDidMount() {
        this.getCategories('0')
        // console.log(this.imgs);
    }
    render() {
        const { optionsList, isUpdate, product} = this.state
        console.log('render()',product);
        // 用来接收级联分类ID的数组
        const categoryIds = []
        if (isUpdate) {
            // 商品是一级分类商品
            if (product.pCategoryId === '0') {
                categoryIds.push(product.categoryId)
            }else { // 商品是二级分类商品
                categoryIds.push(product.pCategoryId)
                categoryIds.push(product.categoryId)
            }
        }
        
        const title = (
            <span style={{ fontWeight: 'bold' }}>
                <ArrowLeftOutlined
                    style={{ marginRight: 10, color: 'blue' }}
                    onClick={() => this.props.history.goBack()}
                /* 这个回来好像只能回到页码1 */
                />
                {isUpdate?'修改商品':'添加商品'}
            </span>
        )
        return (
            <Card title={title}>
                <Form
                    labelCol={{ span: 2 }} //左侧的名称所占栅格数，总栅格数为24
                    wrapperCol={{ span: 7 }} //右侧的表单输入控件所占栅格数，总栅格数为24
                    ref={this.formRef}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        label='商品名称：'
                        name='name'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品名称!'
                            }
                        ]}
                        initialValue={product.name}
                    >
                        <Input placeholder='请输入商品名称' />
                    </Form.Item>
                    <Form.Item
                        label='商品描述：'
                        name='desc'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品描述!'
                            }
                        ]}
                        initialValue={product.desc}
                    >
                        <Input.TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item
                        label='商品价格：'
                        name='price'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品价格!'
                            },
                            {
                                validator(rule, value) {
                                    if (!value || value > 0) {/* 注意前面这里加上“!value ||”是为了防止没有输入时，通知出现两条验证错误信息 */
                                        return Promise.resolve();
                                    }

                                    return Promise.reject('金额必须大于0！');
                                },
                            }
                        ]}
                        initialValue={product.price}
                    >
                        <Input type='number' prefix="￥" addonAfter="元" placeholder='请输入商品价格' />
                    </Form.Item>
                    <Form.Item 
                        label='商品分类：'
                        name='categoryIds'
                        rules={[
                            {
                                required: true,
                                message: '必须指定商品分类!'
                            }
                        ]}
                        initialValue={categoryIds}
                        >
                        <Cascader
                            options={optionsList} /* 需要显示的列表数据数组 */
                            loadData={this.loadData} /* 当选择某个列表项，加载下一级列表的事件回调 */
                            changeOnSelect 
                            placeholder='请指定商品分类！'
                            />
                    </Form.Item>
                    <Form.Item label='商品图片：'>
                        <PicturesWall 
                            ref={this.imgs}
                            imgs={product.imgs}/* 这是之前已经上传了的某商品的图片名信息，原本就在product里 */
                        />
                    </Form.Item>
                    <Form.Item 
                        label='商品详情：'
                        labelCol={{ span: 2 }} //左侧的名称所占栅格数，总栅格数为24
                        wrapperCol={{ span: 17 }} //右侧的表单输入控件所占栅格数，总栅格数为24
                        >
                        <RichTextEditor ref={this.editor} detail={product.detail}/>
                    </Form.Item>
                    <Form.Item label='提交'>
                        <Button type='primary' htmlType="submit">提交</Button>
                    </Form.Item>

                </Form>
            </Card>
        )
    }
}

export default ProductAddUpdate;