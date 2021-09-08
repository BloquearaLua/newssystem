import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
    HomeOutlined,
    TeamOutlined,
    UserOutlined,
    TableOutlined,
    SolutionOutlined,
    PicRightOutlined,
    EditOutlined,
    DeleteOutlined,
    AppstoreOutlined,
    CheckSquareOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    SendOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    GlobalOutlined
} from '@ant-design/icons'
// import PerfectScrollbar from 'perfect-scrollbar'
import "./index.css"
import axios from 'axios'
import {connect} from 'react-redux'

const { Sider } = Layout;
const { SubMenu } = Menu;

// 模拟后台传回来的数据结构
// 这里key传为路径，方便点击，且唯一
// const menuList = [
//     { key: "/home", title: "首页", icon: <UserOutlined/> },
//     {
//         key: "/user-manager", title: "用户权限", icon: <UserOutlined/>,
//         children: [{key: "/user-manager/list", title: "用户列表", icon: <UserOutlined/>}]
//     },
//     {
//         key: "/right-manager", title: "权限管理", icon: <UserOutlined/>,
//         children: [{ key: "/role-manager/list", title: "角色列表", icon: <UserOutlined /> },
//                 { key: "/right-manager/list", title: "权限列表", icon: <UserOutlined /> },
//             ]
//     },
// ]

// 后台返回的接口数据没图标，设置图标数组
const iconList = {
    '/home': < HomeOutlined/ > ,
    '/user-manage': < TeamOutlined/ > ,
    '/user-manage/list': < UserOutlined/ > ,
    '/right-manage': < TableOutlined/ > ,
    '/right-manage/role/list': < SolutionOutlined/ > ,
    '/right-manage/right/list': < SolutionOutlined/ > ,
    '/news-manage': < PicRightOutlined/ > ,
    '/news-manage/add': < EditOutlined/ > ,
    '/news-manage/draft': < DeleteOutlined/ > ,
    '/news-manage/category': < AppstoreOutlined/ > ,
    '/audit-manage': < CheckSquareOutlined/ > ,
    '/audit-manage/audit': < UnorderedListOutlined/ > ,
    '/audit-manage/list': < OrderedListOutlined/ > ,
    '/publish-manage': < SendOutlined/ > ,
    '/publish-manage/unpublished': < ClockCircleOutlined/ > ,
    '/publish-manage/published': < CheckCircleOutlined/ > ,
    '/publish-manage/sunset': < CloseCircleOutlined/ > ,
}

function SideMenu(props) {
    // console.log(props);
    // const [openKeys, setOpenKeys] = React.useState([]);
    const [menuList, setMenuList] = React.useState([]);
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"));

    // 获取接口数据并设置状态
    useEffect(() => {
        // 通过axiso获取接口数据
        axios.get("/rights?_embed=children").then(res => {
            // console.log(res.data);
            // 设置menuList的状态为返回回来的接口数据
            setMenuList(res.data);
        })
    }, []);

    // 是否为左菜单，这里要返回布尔值，要不然会因为递归，最后会把返回值渲染到菜单上去
    const ifPagepermisson = item => (item.pagepermisson ? true : false) && (rights.includes(item.key));

    // 渲染左菜单
    const renderMenu = (menuList) => {
        // 遍历menuList，渲染侧边栏导航
        return menuList.map((one) => {
            // console.log(1);
            // 如果存在子节点且为左菜单项，那么就返回SubMenu
            if (one.children?.length > 0 && ifPagepermisson(one)) {
                return <SubMenu key = { one.key }
                            icon = { iconList[one.key] }
                            title = { one.title } > { /* 使用遍历的方式渲染子节点 */ } 
                            { renderMenu(one.children) } 
                        </SubMenu>
            }
            
            // 不存在子节点且为左菜单项，返回Menu.Item
            return (ifPagepermisson(one) &&
                <Menu.Item key={one.key}
                    icon = { iconList[one.key] }
                    onClick = {
                        () => props.history.push(one.key)
                    }> {one.title}
                </Menu.Item >);
            })
    }
    
    // 初始选中的菜单项
    const selectedKey = [props.location.pathname];
    // 初始展开的菜单项，应该是一个截取后的路径
    // const openKey = ["/" + props.location.pathname.split("/")[1]];
    const openKey = ['/' + selectedKey[0].split('/')[1]];

    const { isCollapsed } = props;
    return (
        <Sider trigger={null} collapsible collapsed={ isCollapsed } >
            <div style = {
                { display: "flex", height: "100%", flexDirection: "column" } } >
                {
                    isCollapsed ? <div className="icons-list logo" ><GlobalOutlined /></div>  :
                    <div className="title"> 全球新闻发布管理系统 </div>
                }
                <Menu className="example-1 scrollbar-light-blue bordered-deep-purple thin"
                    theme = "dark"
                    mode = "inline"
                    defaultOpenKeys = { openKey }
                    defaultSelectedKeys = { selectedKey }
                    style = {
                    { flex: 1, overflow: "auto" } } > { renderMenu(menuList) } 
                </Menu>
            </div> 
        </Sider>
    )
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
    isCollapsed
})
// 高阶组件，如果使用withRouter，在这里会注入路由组件的所有props属性
export default connect(mapStateToProps)(withRouter(SideMenu));