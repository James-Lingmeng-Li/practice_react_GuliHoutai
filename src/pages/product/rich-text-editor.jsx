/* 用来指定商品详情的富文本编辑器 */
import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'/* 这个是根据已有html结构转换为内容 */
import PropTypes from 'prop-types'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"


export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    constructor(props) {
        super(props)
        const html = this.props.detail
        if (html) {/* 如果html有值,则在编辑区显示出来 */
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {/* 判断格式是否正确，你要去掉也可去掉 */
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty(),/* 创建一个没有内容的编辑对象 */
            }
        }
    }

    onEditorStateChange = (editorState) => {/* 输入过程中实时的回调函数 */
        this.setState({
            editorState,
        })
    }
    // 提供给父组件调用的方法，以在父组件获取到编辑器的标签结构
    getHtmlValue = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }
    uploadImageCallBack = file => {
        return new Promise(
          (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/manage/img/upload');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {/* 图片上传成功后的回调函数 */
              const response = JSON.parse(xhr.responseText);
              const url = response.data.url
              resolve({data: {link: url}});/* 这是这个库上传图片时的一个格式 */
            });
            xhr.addEventListener('error', () => {
              const error = JSON.parse(xhr.responseText);
              reject(error);
            });
          }
        );
      }
    render() {
        const { editorState } = this.state
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"/* 这里两行是指定类名，然后可以通过在css指定类名来修改样式 */
                    /* 我们也可以通过下面这种方式来设置样式 */
                    editorStyle={{ width: 700, minHeight: 170, border: '1px solid black', padding: '0 8px' }}
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />

                {/* 下面这个是实时生成编辑器内容对应的html结构 */}
                {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
            </div>
        )
    }
}