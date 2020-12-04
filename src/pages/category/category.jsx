/* 卡片card套表格table */
import React, { Component } from 'react';
import { Card,Button,Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './category.less'
import { reqCategories,reqAddCategory, reqUpdateCategory } from '../../api';
import AddCategory from './add-category';
import UpdateCategory from './update-category';

class Category extends Component {
    state = {
        categories: [], //一级分类列表，每个元素是一个对象
        loading: false,
        // 下面状态是用来判断是否点击的是二级分类
        parentId: '0'/* 当前需要显示的分类列表的一级分类ID（默认是请求一级分类列表） */,
        parentName: '', /* 当前需要显示的分类列表的一级分类名字 */
        subCategories: [],//二级分类列表

        showStatus: 0   
        //标识 添加/更新 的确认框是否显示（0：都不显示； 1：显示添加； 2：显示更新）

    }
    // 初始化Table所有列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: '25%',
                // dataIndex: '',
                // key: 'x',
                render: (category) => (//渲染某一行的“操作”列
                    /* 该函数会接收一个对象参数，该对象是每一行中的数据源 */
                    <span>
                        <a 
                            style={{margin: '0 5px'}}
                            onClick={() => {this.showUpdate(category)}}
                            >
                            修改分类
                        </a>
                        {this.state.parentId === '0'? 
                        <a onClick={() =>{this.showSubCategories(category)}} style={{margin: '0 5px'}}>查看子分类</a>: 
                        null}
                    </span>
                )
                },
            ];

    }
    // 显示一级分类列表
    showCategories = () => {
        // （不需要再次请求数据，因为state中的categories已经有数据了）
        this.setState({
            parentId: '0',
            parentName: '',
            subCategories:[]
        })
    }
    // 显示指定一级分类对象的二级分类列表
    showSubCategories = (category) => {
        // 先更新状态
        this.setState(
            {parentId: category._id, parentName: category.name}
        , () => {//该回调函数在状态更新且重新render()后执行
            // 获取二级分类列表
            this.getCategories()
            // console.log(this.state.parentId);/* setState是异步的，这里输出_id */
        })
        // console.log(this.state.parentId);/* setState是异步的，这里输出'0' */
    }
    // 定义异步获取一级/二级分类列表显示
    /* 参数parentId：如果没有指定该参数，则根据state中的parentId来请求数据， */
    getCategories = async (parentId) => {
        // 在发请求前，显示loading
        this.setState({loading:true})
        parentId = parentId || this.state.parentId  
        /* ↑
            在二级分类列表内添加一级分类为防止不跳转至一级分类列表时需要用，
            因为显示一级还是二级分类列表是根据state的parentId来判断的，（因为dataSource={parentId === '0'? categories: subCategories}）
            但我这里并没有修改state的parentId，修改state的parentId是需要点击左上角的一级分类按钮，
            这里只是修改state的categories数组
        */
        const result = await reqCategories(parentId)
        // 在请求完成后，隐藏loading
        this.setState({loading:false})
        console.log(result);
        if (result.status === 0) {
            // 取出分类列表的数组，可能是一级也可能是二级
            const categories = result.data
            if (parentId === '0' ) {
                this.setState({categories})
            }else {
                this.setState({subCategories: categories})
            }
        }else {
            message.error('请求一级分类列表失败')
        }
    }
    // 显示添加分类的确认框
    showAdd = () => {
        this.setState({showStatus: 1})
    }
    showUpdate = (category) => {
        // 保存category对象（给修改分类名字用）（没有必要放到state里）
        this.category = category
        // 更新状态
        this.setState({showStatus: 2})
    }
    handleCancel = () => {
        this.setState({showStatus: 0})
    }
    addCategory = () => {
        this.form.validateFields().then(async (values) => {
            // 隐藏对话框
            this.setState({showStatus: 0})
            // 收集数据并提交请求
            const {categoryName, parentId} = values
            // const {categoryName, parentId} = this.form.getFieldsValue(['categoryName','parentId'])
            console.log(`即将用于添加的categoryName和parentId分别为${categoryName}和${parentId}`)
            /* 此时在没有表单验证的情况下如果添加分类时不输入东西直接按ok的话，是传递过来一个空串 */
            /* 空串的话，categoryName即为没有值，而在发送请求时是必须有值的，所以就没成功添加一个分类 */
            const result = await reqAddCategory(categoryName, parentId)
            // 重新获取分类列表显示
            if (result.status === 0) {
                // 如果添加的是二级分类，则不用重新获取
                if (parentId === this.state.parentId) {
                    this.getCategories()
                } else if (parentId === '0') {//如果在二级分类列表内添加一级分类，则要重新获取，但不需要显示一级分类列表
                    this.getCategories('0')
                }
            }
        }).catch(errInfo => {
            message.error(errInfo.errorFields[0].errors)
        })
    }
    updateCategory = () => {
        this.form.validateFields().then(async (values) => {
            // 关闭对话框
            this.setState({showStatus: 0})
            // 发送请求更新分类
            const categoryId = this.category._id
            /*  ↓
                分类的名字categoryName需要从子组件获取，子组件传递数据给父组件
                只能通过父组件传递一个函数prop给子组件，子组件通过传参来
                传递数据给父组件了。
            */
            // const {categoryName} = this.form.getFieldsValue()
            const {categoryName} = values
            console.log('即将用于更新的categoryName',categoryName);
            const result = await reqUpdateCategory({categoryName, categoryId})
            // 重新显示列表
            if (result.status === 0) {
                this.getCategories()
            }
        }).catch(errInfo => {
            message.error(errInfo.errorFields[0].errors)
        })
    }
    UNSAFE_componentWillMount() {
        // 为第一次render准备数据
        this.initColumns()
    }
    componentDidMount() {
        // 发异步请求，获取一级分类列表
        this.getCategories()
    }
    render() { 
        const {categories,loading, parentId, parentName, subCategories, showStatus} = this.state
        // card的title
        const title = parentId === '0'? '一级分类列表': (
            <span>
                <a onClick={this.showCategories}>一级分类列表</a>
                <ArrowRightOutlined style={{margin: '0 10px'}}/>
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={this.showAdd}
                >
                添加
            </Button>
        )
        // 读取showUpdate()里保存的category对象
        const category = this.category || {}
        /* 
            加|| {} 是为了在还没点击按钮时，发送category给update-category标签时不报错，
            因为没点击添加分类按钮时，还没保存category对象，即this.category不存在 
        */

        return (
            <div className='ant-card-wrapper'>
                <Card title={title} extra={extra}>
                    {/* rotKey是指定每一行的key属性的值是对应哪个键值 */}
                   <Table 
                        rowKey='_id' 
                        bordered 
                        loading={loading}
                        dataSource={parentId === '0'? categories: subCategories}
                        /* dataSoure数据源是接收一个数组的 */ 
                        columns={this.columns} 
                        pagination={{defaultPageSize:5, showQuickJumper:true}}
                    />
                </Card>
                <Modal
                    title="添加分类"
                    visible={this.state.showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    >
                    <AddCategory 
                        categories={categories}
                        parentId={parentId}
                        setForm={(form)=>{this.form = form}}
                    >
                    </AddCategory>
                </Modal>    
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    >
                    <UpdateCategory 
                        categoryName={category.name}/* 传递此时点击行的分类名，以点击修改分类按钮时在弹出的文本框能显示对应的名字 */ 
                        setForm={(form)=>{this.form = form}}
                    >
                    </UpdateCategory>
                </Modal>    
            </div>
        )
    }
}
 
export default Category;