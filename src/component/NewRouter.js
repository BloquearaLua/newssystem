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
    
    const { role:{rights} } = JSON.parse(localStorage.getItem("token"));
    // ???????????????????????????
    const checkRoute = item => {
        return RouteMap[item.key] && (item.pagepermisson || item.routepermisson);
    };
    // ???????????????????????????
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

                {/* ??????????????????????????????home?????????????????????????????????????????????/?????????????????? */}
                    <Redirect from='/' to='/home' exact />
                {/* ?????????????????????????????????????????????????????????404/403?????? */}
                {
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
