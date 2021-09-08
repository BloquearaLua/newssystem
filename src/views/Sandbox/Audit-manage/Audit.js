import React,{ useState, useEffect } from 'react'
import { Table, Button } from 'antd'
import axios from 'axios';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';


export default function Audit() {
    const[dataSource, setDataSource] = useState([]);
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            render: item => {
                return (
                    <div>
                        <Button type='primary' shape='circle' icon={<CheckOutlined />} onClick={() => handleAudit(item,2,1)}></Button>&nbsp;
                        <Button danger shape='circle' icon={<CloseOutlined />} onClick={() => handleAudit(item,3,0)}></Button>
                    </div>
                )
            }
        }, 
    ];

    const handleAudit = (item, auditState, publishState) => {
        setDataSource(dataSource.filter(one => item.id !== one.id));
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        })
    }

    const { username, region, roleId } = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios.get('/news?auditState=1&_expand=category').then(res => {
            let list = res.data;
            // console.log(list);
            setDataSource(roleId === 1 ? list : [
                ...list.filter(item => item.roleId > 1 && item.author !== username && item.region === region)
            ]);
        })
    },[region,roleId,username])
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{pageSize:5}}/>
        </div>
    )
}
