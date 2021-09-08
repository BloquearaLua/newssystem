import React,{ useEffect,useState } from 'react'
import { PageHeader, Descriptions } from 'antd' 
import axios from 'axios'
import moment from 'moment'
import { HeartOutlined } from '@ant-design/icons'

export default function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState(null);
    const [star, setStar] = useState(0);
    const [ifStar, setifStar] = useState(false);
    useEffect(() => {
        // console.log(props.match.params.id);
        const { id } = props.match.params;
        axios.get(`/news/${id}?_expand=category`).then(res => {
            // console.log(res.data);
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1  
            });
            setStar(res.data.star);
            return res.data
        }).then(res => {
            axios.patch(`/news/${id}`, {
                view: res.view + 1
            });
        })
    }, [props.match.params]);

    const addStar = () => {
        const { id } = props.match.params;
        axios.patch(`/news/${id}`, {
            star: star + 1
        }).then(() => {
            setNewsInfo({ ...newsInfo, star: star + 1 });
            setifStar(true);
        });
        
    }
    
    return (
        <div className="site-page-header-ghost-wrapper" style={{padding: "10px 50px"}}>
            {
                newsInfo &&
                <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={<div>
                    <span style={{marginRight:"10px"}}>{newsInfo.category.title}</span>
                    <HeartOutlined onClick={() => { addStar() }} style={{
                        color: ifStar ? "#eb2f96" : ""
                    }}/>
                </div>}
                    
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"}</Descriptions.Item>
                        <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
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
