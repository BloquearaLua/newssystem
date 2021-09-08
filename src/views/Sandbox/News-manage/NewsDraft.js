import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Popconfirm, notification } from 'antd'
import { DeleteOutlined, HighlightOutlined, UploadOutlined } from '@ant-design/icons';

export default function NewsDraft(props) {
    const [dataSource, setDataSource] = useState([]);

    const columns = [{
            title: 'ID',
            dataIndex: 'id', 
            render: (id) => { 
                return <b> { id } </b>;   
            }
        },
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
            render: category => {
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            render: (item) => {
                function confirm(item) {
                    // 删除项
                    deleteItem(item);
                    message.success('Click on Yes');
                }

                function cancel(e) {
                    // console.log(e);
                    message.error('Click on No');
                }

                function deleteItem(item) {
                    setDataSource(dataSource.filter(one => item.id !== one.id));
                    axios.delete(`/news/${item.id}`);
                }

                return (
                    <>
                        <Popconfirm title = "确认删除吗？"
                            onConfirm = {
                                () => { confirm(item) } }
                            onCancel = { cancel }
                            okText = "Yes"
                            cancelText = "No" >
                            <Button danger shape = "circle" icon = { < DeleteOutlined/ > }/> 
                        </Popconfirm> &nbsp;
                        <Button
                            shape="circle"
                            icon={<HighlightOutlined />} href={`#/news-manage/update/${item.id}`}/> &nbsp;
                        <Button type="primary"
                            shape="circle"
                            icon={<UploadOutlined />} onClick={ ()=>handleCheck(item.id)}/>
                    </>
                )
            }
        }
    ];
    const { username } = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
            setDataSource(res.data);
        })
    }, [username]);

    const handleCheck = id => {
        axios.patch(`/news/${id}`,
            { auditState: 1 }
        ).then(res => {
            props.history.push('/audit-manage/list');
            notification.info({
                message: `通知`,
                description: `您可以到审核列表中查看您的新闻`,
                placement:'bottomRight',
            });
        }).catch(err => {
            message.error('点击失败！');
        })
        
    }
    
    return ( <div >
                <Table dataSource = { dataSource }
                columns = { columns }
                rowKey = { item => item.id }/> 
            </div>
    )
}