import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Popconfirm, message, Switch, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function RightList() {
    // 初始化状态
    const [dataSource, setDataSource] = useState([]);
    // 获取表格内容，并封装到dataSource里
    useEffect(() => {
        axios.get("/rights?_embed=children").then(res => {
            //    console.log(res.data);
            const list = res.data;
            list.forEach(item => {
                if (item.children.length === 0) {
                    item.children = "";
                }
            });
            setDataSource(res.data);

        })
    }, [])

    // 表头
    const columns = [{
            title: 'ID', // 表头名
            dataIndex: 'id', // 返回数据对应的名字 
            render: (id) => { // 添加样式，可以直接获取参数id
                return <b> { id } </b>;   // 加粗
            }
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color = "orange" > { key } </Tag>;      // 加边框
            }
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
                    /* 注意：
                        filter只过滤一层，如果有两层，那么会受到影响，不是深拷贝。
                    */
                    if (item.grade === 1) {
                        // 一级菜单
                        const list = dataSource.filter(one => item.id !== one.id);
                        setDataSource(list);
                        axios.delete(`/rights/${item.id}`);
                    } else {
                        // 二级菜单
                        // 先获取当前点击项的前一级菜单，是一个数组
                        const list = dataSource.filter(one => item.rightId === one.id);
                        // 再遍历删去一级菜单中的那一项
                        list[0].children = list[0].children.filter(one => item.id !== one.id);
                        // console.log(list,[...dataSource]);

                        /*  
                            注意：
                                1. 因为是filter，它不是深拷贝，所以在改变list里面第二层的时候也被改变了；
                                2. 这里要使用展开运算符，因为setState是监测状态中地址值的改变，如果没有改变，那么状态也不会更新；这里使用展开运算符，相当于将dataSource赋予给了一个新的数组。 
                            */
                        setDataSource([...dataSource]);
                        // 修改后端数据
                        axios.delete(`/children/${item.id}`);
                    }
                }

                function switchMethod(item) {

                    // 取反pagepermission的值
                    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
                    setDataSource([...dataSource]);
                    console.log(item);
                    // 修改后端数据
                    if (item.grade === 1) {
                        axios.patch(`/rights/${item.id}`, {
                            pagepermisson: item.pagepermisson
                        });
                    } else {
                        axios.patch(`/children/${item.id}`, {
                            pagepermisson: item.pagepermisson
                        });
                    }
                }
                return ( 
                <>
                    <Popconfirm title = "确认删除吗？"
                        onConfirm = {
                            () => { confirm(item) } }
                        onCancel = { cancel }
                        okText = "Yes"
                        cancelText = "No" >
                        <Button danger shape = "circle"
                        icon = { < DeleteOutlined/ > }/> 
                    </Popconfirm> &nbsp;
                    <Tooltip title = {
                        () => ( <span style = {
                                { color: "black" } } > 配置项： <Switch checked = { item.pagepermisson }
                            onChange = {
                                () => { switchMethod(item) } } > </Switch></span> ) }
                            color = "white"
                            trigger = { item.pagepermisson === undefined ? '' : 'click'}>
                            <Button type = "primary"
                            shape = "circle"
                            icon = { <EditOutlined/ > }
                        disabled = { item.pagepermisson === undefined }/>
                    </Tooltip>
                </>
                )
            }
        }
    ];
    return ( <
        Table dataSource = { dataSource }
        columns = { columns }
        pagination = {
            { pageSize: 6 } }
        />
    )
}