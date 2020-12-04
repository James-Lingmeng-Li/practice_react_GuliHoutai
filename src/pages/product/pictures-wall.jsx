import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { reqDeltePicture } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    constructor(props) {
        super(props)
        let fileList = []
        const {imgs} = this.props
        if (imgs && imgs.length > 0) {/* 如果imgs数组存在并且该数组有值 */
            fileList = imgs.map((value, index) => ({/* value是图片名，即数组里的每个元素 */
                uid: -index,/* 相当于id，每张图片都要有一个独一无二的uid，官方建议为负数 */
                name: value,
                status: 'done',/* 图片状态。done：已上传；uploading:上传中；removed：.. */
                url: BASE_IMG_URL + value,

            }))
        }
        this.state = {
            previewVisible: false,/* 标识是否显示大图预览 */
            previewImage: '',/* 预览大图的地址 */
            previewTitle: '',
            fileList
        };
    }


    // 获取所有已上传图片名的数组(提供给父组件使用，即AddUpdate组件)
    getImgs = () => {
        return this.state.fileList.map(value => value.name)/* 最终返回的是包含所有图片名的数组 */
    }
    
    handleCancel = () => this.setState({ previewVisible: false });/* 其实就是隐藏modal对话框 */

    handlePreview = async file => {
        //   显示指定file的大图
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    /* 
        file:当前操作的图片文件
        fileList:所有已上传图片文件的数组
    */
    handleChange = async ({ file, fileList }) => {/* 接收一个对象， */
        /* console.log('handleChange()',file, fileList); */
        // 一旦上传成功，将当前上传的file的信息修正.(file参数的name不对;file参数没有url)
        /* 上传的图片名不应该是客户的主机的图片的文件名，所以要修正 */
        if (file.status === 'done') {
            /* 顺便提一句，只有done时file参数才会有这个response */
            const result = file.response    //{status: 0, data:{name:'xxx.jpg', url: '图片地址'}}
            if (result.status === 0) {
                message.success('图片上传成功！')
                const {name, url} = result.data
                /* 
                    注意：file对象在'done'时与fileList数组最后一个元素虽然内容一样，但是它们并不是同一对象。
                    但是我们setState的是fileList，所以我们要把变量file的引用改为 fileList[fileList.length - 1]的地址。
                */
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('图片上传失败！')
            }
        } else if (file.status === 'removed') {//这里只是界面删除了图片，现在还要进行服务器图片的删除
            const result = await reqDeltePicture(file.name)
            /* 参数不能用fileList，因为fileList此时已经不存在这张图片了 */
            /* 这里的file其实是用了fileList[fileList.length-1]，file.name也修正了 */
            if (result.status === 0) {
                message.success('删除图片成功！')
            } else {
                message.error('删除图片失败！')
            }
        }
        this.setState({ fileList })
    };/* 上传中、完成、失败都会调用这个函数 */ /* “上传中”不是只调一次，是多次，因为它需要在上传中不断地渲染更新页面 */

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
        );
        return (
            <>
                <Upload
                    action="/manage/img/upload"/* 这里地址不用写前面的东西，因为代理服务器已经弄了 */
                    accept='image/*'/* 只接受图片格式 */
                    listType="picture-card"/* 卡片样式 */
                    name='image' /* 发到后台的文件参数名。这里需要看后台给我们的api*/
                    fileList={fileList}/* 所有已上传图片文件对象的数组 */
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}{/* 可上传图片的数量 */}
                </Upload>
                <Modal
                    visible={previewVisible}/* 用于预览图片 */
                    title={previewTitle}
                    footer={null}/* 这是对话框里底部那些确认和取消按钮，它隐藏了 */
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}
