import React,{ useState,useEffect } from 'react'
import { Table, Button, Tag, notification, message } from 'antd'
import axios from 'axios'

export default function AuditList(props) {
    const [dataSource, setDataSource] = useState([]);
    const auditList = ['未审核', '待审核', '已通过', '不通过'];
    // const operateList = ['', '', '', '']
    const colorList = ['orange','blue','green','red']
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
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                return (<Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>)
            }
        },
        {
            title: '操作',
            render: item => {
                const auditState = item.auditState;
                return (
                    <div>
                        { auditState === 1 && <Button onClick={ () => { handleCancel(item.id) }}>撤销</Button> }
                        { auditState === 2 && <Button danger onClick={ () => { handlePublish(item.id) } }>发布</Button>}
                        { auditState === 3 && <Button type='primary' onClick={()=>{ handleUpdate(item.id) }}>更新</Button>}
                    </div>
                )
            }
        }, 
    ];

    const handleCancel = id => {
        setDataSource(dataSource.filter(one => id !== one.id));
        axios.patch(`/news/${id}`, {
            auditState: 0
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以到草稿箱中查看您的新闻`,
                placement:'bottomRight',
            });
        }).catch(err => {
            message.error('保存失败！');
        })
    }
    const handleUpdate = id => {
        props.history.push(`/news-manage/update/${id}`);
    }

    const handlePublish = id => {
        setDataSource(dataSource.filter(one => id !== one.id));
        axios.patch(`/news/${id}`, {
            publishState: 2,
            createTime: Date.now()
        }).then(res => {
            notification.info({
                message: `通知`,
                description: `您可以到【发布管理/已发布】中查看您的新闻`,
                placement:'bottomRight',
            });
        })
    }

    const { username } = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, [username]);
    return (
        <div>
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{pageSize:5}}/>
        </div>
    )
}
