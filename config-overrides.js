const {override, fixBabelImports,addLessLoader} = require('customize-cra')

module.exports = override(
    // 针对antd实现按需打包：根据import了什么来打包
    fixBabelImports('import', { /* 该行的'import'是指，babel-plugin插件的一个叫improt的插件 */
        libraryName: 'antd',    
        libraryDirectory: 'es',
        style: true    
    }),
    addLessLoader({
        lessOptions:{
            javascriptEnabled: true,
            modifyVars: {'@primary-color': '#1890ff'},/* 修改less变量 */
        }
    }),
)
