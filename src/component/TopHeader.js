import React from 'react'
import { Layout,Menu, Dropdown,Avatar  } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined  
} from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const { Header } = Layout;
function TopHeader(props) {
    const loginOut = () => {
        localStorage.removeItem('token');
        props.history.replace('/login');
    }
    // console.log(JSON.parse(localStorage.getItem("token")));;
    const { region,role: { roleName }, username} = JSON.parse(localStorage.getItem("token"))
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <span style={{marginRight:"10px"}}>{roleName}</span>
                <span>{region ? region : "全球"}</span>
            </Menu.Item>
            <Menu.Item key="0" danger onClick={loginOut}>退出</Menu.Item>
        </Menu>
    );
    const { isCollapsed, changeCollapsed } = props;
    return (
        <Header className="site-layout-background" style={{ padding: " 0 16px" }}>
            {
                isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} collapsed/>
            }
            <Dropdown overlay={menu} >
                <span style={{float:"right"}}>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来 <Avatar shape="square" size="large" icon={<UserOutlined />} /></span>
            </Dropdown>
          </Header>
    )
}
/* 
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(容器组件)
*/
const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {
    // console.log(state);
    return {
        isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed(){
        return {
            type: 'change_collapsed',
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader));
