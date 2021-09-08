import React, { useState, useEffect, useRef } from 'react'
import { Table, Switch, message, Popconfirm, Button, Modal } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import axios from 'axios'
import UserForm from '../../../component/User-manage/UserForm';
export default function UserList() {
    // 状态
    const [dataSource, setDataSource] = useState([]); // 表格数据
    const [addVisible, setAddVisible] = useState(false); // 添加用户的模态框显示与否
    const [regionsList, setRegionList] = useState([]); // 地区数据
    const [rolesList, setRoleList] = useState([]); // 角色数据
    const [updateVisible, setUpdateVisible] = useState(false); // 更改用户数据的模态框显示与否
    const [isUpdateDisable, setIsUpdateDisable] = useState(false); // 判断是否禁用区域选项
    const [currentItem, setCurrentItem] = useState(null); // 更新时要保存当前的更改项对象
    const addFormRef = useRef(null);
    const updateFormRef = useRef(null);

    const columns = [{
            title: '区域',
            dataIndex: 'region',
            render: (region) => {
                return <b> { region ? region : '全球' } </b>
            },
            filters: [{
                    text: '全球',
                    value: ''
                },
                // 这里regionsList本身就是一个数组，所以这里要展开一下
                ...regionsList.map(item => ({
                    text: item.title,
                    value: item.value
                }))
            ],
            // record相当于item，相当于item.region === value
            // onFilter: (value, record) => record.region.indexOf(value) === 0,
            onFilter: (value, item) => {
                if (value === '全球') {
                    return item.region === '';
                }
                return item.region === value;
            }
        }, {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return <div> { role.roleName } </div>
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            render: (username) => {
                return <div> { username } </div>
            }
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => { // 第二个参数就是当前项
                return <Switch checked = { roleState }
                onChange = {
                    () => handleChange(item) }
                disabled = { item.default } > </Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return ( 
                <>
                    <Popconfirm title = "确认删除吗？"
                            onConfirm = {
                                () => { confirm(item) } }
                            onCancel = { cancel }
                            okText = "Yes"
                            cancelText = "No" >
                        <Button danger shape = "circle"
                                icon={< DeleteOutlined/>} />
                    </Popconfirm> &nbsp;
                    <Button type = "primary"
                        shape = "circle"
                        icon = { < EditOutlined/ > }
                        onClick = {() => handleUpdate(item)} />
                </>
                )
            }
        }
    ];

    // 更新项,显示模态框及信息
    const handleUpdate = item => {
        // 因为react中状态的改变时异步的，意味着把表单改变了，但是显示模态框的状态还没改变成功
        // 所以可能会报错，也不会显示表单信息，所以这里要把它变成同步的。
        setTimeout(() => {
            setUpdateVisible(true);
            /* 
                在这个地方会有一个问题，如果前面选择过超级管理员，又取消了，再次点击的时候，
                它的区域会是禁用的。
                猜想的原因：
                最开始的setIsUpdateDisable是false，点过超级管理员之后，UserForm里的的isDisable会被设置成true，即不可用；再次点击更新按钮，在这里的setIsUpdateDisable是false，所以前后的isUpdateDisable都是false。
                相当于状态没有改变，所以是不会再次渲染的。在这里取消之前先把状态取反，当代码执行到这里，会再次设置isUpdateDisable的值。
            */
            if (item.roleId === 1) {
                // 如果是超级管理员，禁用区域
                setIsUpdateDisable(true);
            } else {
                // 取消禁用
                setIsUpdateDisable(false);
            }
            // 把当前项的信息放到表单上去
            updateFormRef.current.setFieldsValue(item);
        }, 0);
        setCurrentItem(item);
    }

    // 删除项
    const deleteItem = item => {
        setDataSource(dataSource.filter(one => one.id !== item.id));
        axios.delete(`/users/${item.id}`);
    }
    const confirm = item => {
        // 删除项
        deleteItem(item);
        message.success('Click on Yes');
    }

    const cancel = e => {
        // console.log(e);
        message.error('Click on No');
    }


    // 用户状态的切换
    const handleChange = item => {
        // 对用户状态进行取反
        item.roleState = !item.roleState;
        setDataSource([...dataSource]);
        // console.log(item.roleState);
        axios.patch(`/users/${item.id}`, { roleState: item.roleState });
    };

    // 获取本地token
    const { roleId, region } = JSON.parse(localStorage.getItem("token"));
    // console.log(token);
    // 获取角色列表数据
    useEffect(() => {
        axios.get("/users?_expand=role").then(res => {
            // 如果是管理员，就获取全部数据，如果不是(区域管理员)就只显示本地的用户
            setDataSource(roleId === 1 ? res.data :
                res.data.filter(item => item.region === region)
            );
        });
    }, [roleId, region]);

    useEffect(() => {
        axios.get("/roles").then(res => {
            setRoleList(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get("/regions").then(res => {
            setRegionList(res.data);
        });
    }, []);

    const onCancel = () => {
        setAddVisible(false);
    }
    const addForm = () => {
        addFormRef.current.validateFields().then(value => {
            // console.log(value);
            setAddVisible(false);
            // 添加用户信息到后端，一定要先添加，否则删除就不能弄，因为不能自动添加id
            axios.post(`/users`, {
                ...value,
                "roleState": true,
                "default": false
            }).then(res => {
                // console.log(res.data);
                // 这里不能直接写res.data，因为前面也有数据嗷！也要加上，所以应该是：↓
                // 在这里还有一个问题，如果直接这样写还会发生连表的数据刷新之后才会出来
                // setDataSource([...dataSource, res.data]);
                // 所以要在这里加一个过滤，要将提前将连表的数据做好，然后再设置状态
                // 返回的数据是一个数据，要是数组的第一个对象，否则还是个数组（不加[0]的话）
                setDataSource([...dataSource, {...res.data, role: rolesList.filter(item => item.id === value.roleId)[0] }]);
            })
        }).catch(err => {
            console.log(err);
        })
    }
    const updateForm = () => {
        updateFormRef.current.validateFields().then(value => {
            setUpdateVisible(false);
            // console.log(value);
            // 更新修改之后的信息
            setDataSource(
                dataSource.map(item => {
                    if (item.id === currentItem.id) {
                        return {
                            ...item,
                            ...value,
                            role: rolesList.filter(one => one.id === value.roleId)[0]
                        };
                    }
                    return item;
                })
            );
            axios.patch(`/users/${currentItem.id}`, value);
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <div>
        <Button type = "primary" onClick = { () => { setAddVisible(true) }} style={{marginBottom:"10px"}}> 添加用户 </Button>
        <Modal visible = { addVisible }
            title = "添加新用户"
            okText = "确认"
            cancelText = "取消"
            onCancel = { onCancel }
            onOk = { addForm }
            destroyOnClose = { true } >
            <UserForm ref = { addFormRef }
                regionsList = { regionsList }
                rolesList = { rolesList }/>
        </Modal>
        <Modal visible={updateVisible}
                title = "更新用户"
                okText = "确认"
                cancelText = "取消"
                onCancel = {
                    () => {
                        setUpdateVisible(false);
                        setIsUpdateDisable(!isUpdateDisable);
                    }
                }
                onOk = { updateForm } >
            <UserForm ref = { updateFormRef }
                    regionsList = { regionsList }
                    rolesList = { rolesList }
                    isUpdateDisable = { isUpdateDisable }
                    isUpdate={true} />
        </Modal>
            <Table dataSource={dataSource}
                columns = { columns }
                rowKey = { item => item.id }
                pagination = {{ pageSize: 5 }} />
        </div>
    )
}