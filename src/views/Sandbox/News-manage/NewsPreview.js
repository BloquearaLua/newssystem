import React,{ useEffect,useState } from 'react'
import { PageHeader, Descriptions } from 'antd' 
import axios from 'axios'
import moment from 'moment'
export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null);
    useEffect(() => {
        // console.log(props.match.params.id);
        const { id } = props.match.params;
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            setNewsInfo(res.data);
        })
    }, [props.match.params]);
    const auditList = ["未审核", "审核中", "已审核", "未通过"];
    const publishList = ["未发布", "待发布", "已发布", "已下线"];
    const colorList = ["orange", "green", "blue", "red"];
    
    return (
        <div className="site-page-header-ghost-wrapper">
            {
                newsInfo &&
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={newsInfo.category.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态"><span style={{color:colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                        <Descriptions.Item label="发布状态"><span style={{color:colorList[newsInfo.publishState]}}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                        <Descriptions.Item label="访问数量"><span style={{color:"blue"}}>{newsInfo.view}</span></Descriptions.Item>
                        <Descriptions.Item label="点赞数量"><span style={{color:"blue"}}>{newsInfo.star}</span></Descriptions.Item>
                        <Descriptions.Item label="评论数量"><span style={{color:"blue"}}>0</span></Descriptions.Item>
                    </Descriptions>
                </PageHeader>
            }
            <PageHeader
                ghost={false}
                title="新闻内容"
            >
                <div dangerouslySetInnerHTML={{__html:newsInfo?.content}}></div>
            </PageHeader>
                    
        </div>
    )
}
