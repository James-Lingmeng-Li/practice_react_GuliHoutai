import {
    HomeOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    SolutionOutlined,
    SwitcherOutlined,
    TagOutlined,
    ProjectOutlined
} from '@ant-design/icons';

const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: <HomeOutlined />,
        isPublic: true, /* 是公开的，大家都能看得见 */

    },
    {
        title: '商品',
        key: '/products',
        icon: <ShoppingCartOutlined />,
        subMenuList: [
            {
                title: '品类管理',
                key: '/category',
                icon: <TagOutlined />
            },
            {
                title: '商品管理',
                key: '/product',
                icon: <ProjectOutlined />
            }
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <UserOutlined />
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <SolutionOutlined />
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: <SwitcherOutlined />,
        subMenuList: [
            {
                title: '柱状图',
                key: '/charts/bar',
                icon: <SwitcherOutlined />
            },
            {
                title: '折线图',
                key: '/charts/line',
                icon: <SwitcherOutlined />
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: <SwitcherOutlined />
            },
        ]

    },
]

export default menuList