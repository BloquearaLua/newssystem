// css
import './index.css'

import React,{useEffect} from 'react'
import SideMenu from '../../component/SideMenu'
import TopHeader from '../../component/TopHeader'
// antd
import { Layout } from 'antd';
import NewRouter from '../../component/NewRouter'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'

import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const { Content } = Layout;

export default function Sandbox() {
    NProgress.start();
    useEffect(() => {
        NProgress.done();
    })

    useEffect(() => {
        const ps = new PerfectScrollbar('#container', {
            suppressScrollX :true
        });
        ps.update();
        return () => {
            ps.destroy();
        }
    },[])
    return (
        <Layout>
            {/* 固定头部 和 侧边导航 */}
            <SideMenu />

            <Layout className="site-layout">
                <TopHeader />
                {/* 可切换部分 */}
                <Content className="site-layout-background" style={{margin: '24px 16px', padding: 24, minHeight: 280,}} id="container">
                    <NewRouter></NewRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
