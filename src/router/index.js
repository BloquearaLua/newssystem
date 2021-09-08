import React from 'react'
import { HashRouter,Switch,Route,Redirect } from 'react-router-dom'
import Login from '../views/Login'
import NewsSandbox from '../views/Sandbox'
import News from '../views/News/News'
import Detail from '../views/News/Detail'

export default function IndexRouter() {
    return (
        <HashRouter>
            {/* 处理登录页面，如果已授权就进去登录页面，如果没授权就直接跳转到登录页面 */}
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/news" component={News}/>
                <Route path="/detail/:id" component={Detail}/>
                {/* 如果获取得到token，就说明已经授权了，如果没授权，那么就直接跳转到登录页面 */}
                <Route path='/' render={() => 
                    localStorage.getItem("token") ? <NewsSandbox/> : <Redirect to='/login'/>
                } />
            </Switch>
        </HashRouter>
    )
}
