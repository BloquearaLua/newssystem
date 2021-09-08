import React,{ useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux'

import Home from '../views/Sandbox/Home'
import UserList from '../views/Sandbox/User-manage'
import RoleList from '../views/Sandbox/Right-manage/RoleList'
import RightList from '../views/Sandbox/Right-manage/RightList'
import NoPermission from '../views/Sandbox/Nopermission'
import AddNews from '../views/Sandbox/News-manage/AddNews'
import NewsCategory from '../views/Sandbox/News-manage/NewsCategory'
import NewsDraft from '../views/Sandbox/News-manage/NewsDraft'
import NewsPreview from '../views/Sandbox/News-manage/NewsPreview'
import NewsUpdate from '../views/Sandbox/News-manage/NewsUpdate'
import Audit from '../views/Sandbox/Audit-manage/Audit'
import AuditList from '../views/Sandbox/Audit-manage/AuditList'
import Unpublished from '../views/Sandbox/Publish-manage/Unpublished'
import Published from '../views/Sandbox/Publish-manage/Published'
import Sunset from '../views/Sandbox/Publish-manage/Sunset'


function NewRouter(props) {
    const [backRouteList, setBackRouteList] = useState([]);
    const RouteMap = {
        "/home": Home,
        "/user-manage/list": UserList,
        "/right-manage/role/list": RoleList,
        "/right-manage/right/list": RightList,
        "/news-manage/add": AddNews,
        "/news-manage/draft": NewsDraft,
        "/news-manage/category": NewsCategory,
        "/news-manage/preview/:id": NewsPreview,
        "/news-manage/update/:id": NewsUpdate,
        "/audit-manage/audit": Audit,
        "/audit-manage/list": AuditList,
        "/publish-manage/unpublished": Unpublished,
        "/publish-manage/published": Published,
        "/publish-manage/sunset": Sunset
    }
    useEffect(() => {
        Promise.all([
            axios.get(`/rights`),
            axios.get(`/children`)
        ]).then(res => {
            // console.log([...res[0].data,...res[1].data]);
            setBackRouteList([...res[0].data, ...res[1].data]);
        })
    }, []);
    // const ps = new PerfectScrollbar('#container', {
    //     wheelSpeed: 2,
    //     wheelPropagation: true,
    //     minScrollbarLength: 20
    //     });
    
    const { role:{rights} } = JSON.parse(localStorage.getItem("token"));
    // 查看是否有路由权限
    const checkRoute = item => {
        // RouterMap[item]：该路径是否是包含在映射里的
        // item.pagepermission：是否在左菜单栏显示
        return RouteMap[item.key] && (item.pagepermisson || item.routepermisson);
    };
    // 用户是否有访问权限
    const checkUserPermisssion = item => {
        return rights.includes(item.key);
    }

    const { isLoading } = props;
    return (
         <Spin size="large" spinning={isLoading} >
            <Switch>
                {
                    backRouteList.map(item => {
                        if(checkRoute(item) && checkUserPermisssion(item))
                            return <Route path={item.key} key={item.key} component={RouteMap[item.key]} exact />
                        return null;
                    })
                }

                {/* 如果登录了，就跳转到home主页，得是精确匹配，否则相当于/表示全部页面 */}
                    <Redirect from='/' to='/home' exact />
                {/* 如果路径写错了，即上面都没走，就跳转到404/403页面 */}
                {
                    // 在backRouteList的长度不为0时，再渲染没有权限那个页面，
                    // 要不然上面刷新后前几秒会出现这个页面，因为backRouteList一开始为空数组，
                    // 还没取完数据，就会跳到没权限这里
                    backRouteList.length > 0 && <Route path='*' component={NoPermission}/>  
                }
            </Switch>
        </Spin>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({
    isLoading
});

export default connect(mapStateToProps)(NewRouter);