import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Button, Popconfirm, message, Form, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function NewsCategory() {
    // 初始化状态
    const [dataSource, setDataSource] = useState([]);
    // 获取表格内容，并封装到dataSource里
    useEffect(() => {
        axios.get("/categories").then(res => {
            setDataSource(res.data);
        })
    }, [])

    const handleSave = (record) => {
        // console.log(record);
        setDataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: record.id,
                    title: record.title,
                    value: record.title
                };
            }
            return item;
        }))
        axios.patch(`/categories/${record.id}`, {
            title: record.title,
            value: record.title
        });
    }

    // 表头
    const columns = [{
            title: 'ID', // 表头名
            dataIndex: 'id', // 返回数据对应的名字 
            render: (id) => { // 添加样式，可以直接获取参数id
                return <b> { id } </b>;   // 加粗
            }
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave: handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => {
                function confirm(item) {
                    deleteItem(item);
                    message.success('Click on Yes');
                }

                function cancel(e) {
                    // console.log(e);
                    message.error('Click on No');
                }

                function deleteItem(item) {
                    const list = dataSource.filter(one => item.id !== one.id);
                    setDataSource(list);
                    axios.delete(`/categories/${item.id}`);
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
                </>
                )
            }
        }
    ];

    const EditableContext = React.createContext(null);
    const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
        </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
        
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                margin: 0,
                }}
                name={dataIndex}
                rules={[
                {
                    required: true,
                    message: `${title} is required.`,
                },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
        }
        return <td {...restProps}>{childNode}</td>;
    };
        
    return ( <
        Table dataSource = { dataSource }
        columns = { columns }
        pagination = {
            { pageSize: 6 }}
        rowKey={item => item.id}
        components={
            {
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                }
            }
        }
        rowClassName={() => 'editable-row'}
        />
    )
}