import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Popconfirm, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';

export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rightList, setRightList] = useState([]);
    const [curRights, setcurRights] = useState([]);
    const [curRightsId, setcurRightsId] = useState(0);

    const columns = [{
            title: 'ID', // 表头名
            dataIndex: 'id', // 返回数据对应的名字 
            render: (id) => { // 添加样式，可以直接获取参数id，前提要有dataIndex
                return <b> { id } </b>;   // 加粗
            }
        },
        {
            title: '角色名称', // 表头名
            dataIndex: 'roleName', // 返回数据对应的名字
        },
        {
            // 如果没有dataIndex就会传item对象进去，即当前点击的这个对象
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
                    axios.delete(`/roles/${item.id}`);
                }

                // 模态框
                const onOk = () => {
                    console.log(curRights);
                    // 同步DataSource
                    setDataSource(dataSource.map(one => {
                        if (curRightsId === one.id) {
                            return {...one, rights: curRights };
                        }
                        return one;
                    }));
                    axios.patch(`/roles/${curRightsId}`, {
                        rights: curRights
                    });
                    setIsModalVisible(false);
                }
                const onCancel = () => {
                    setIsModalVisible(false);
                }

                // 树形结构
                const onCheck = (checkedKeys, info) => {
                    // console.log('onCheck', checkedKeys, info);
                    setcurRights(checkedKeys);
                };

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
                    <Button type = "primary"
                    shape = "circle"
                    icon = { < UnorderedListOutlined/ > }
                    onClick = {
                        () => {
                            setIsModalVisible(true);
                            setcurRights(item.rights);
                            setcurRightsId(item.id);
                        }
                    } />
                    <Modal title = "权限分配"
                    visible = { isModalVisible }
                    onOk = { onOk }
                    onCancel = { onCancel } >
                    <Tree checkable checkStrictly treeData = { rightList }
                    checkedKeys = { curRights }
                    onCheck = { onCheck }/> 
                    </Modal>
                    </>
                )
            }
        }
    ];

    useEffect(() => {
        axios.get("/roles").then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, []);
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            setRightList(res.data);
        })
    }, []);
    return ( <div >
                <Table dataSource = { dataSource }
                columns = { columns }
                rowKey = { item => item.id }/> 
            </div>
    )
}