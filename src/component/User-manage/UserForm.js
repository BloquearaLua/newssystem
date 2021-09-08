import React, { forwardRef,useState,useEffect } from 'react'
import { Form,Input,Select } from 'antd'

const { Option } = Select;
// 使用ref可以接收两个参数，props和ref
const UserForm = forwardRef((props,ref) => {
    const { rolesList, regionsList } = props;
    const [isDisable, setIsDisable] = useState(false);
    const { isUpdateDisable } = props;
    // console.log("ref:",ref);
    const { isUpdate } = props;

    useEffect(() => {
        setIsDisable(isUpdateDisable);
    },[isUpdateDisable])

    const { roleId,region } = JSON.parse(localStorage.getItem("token"));
    // console.log(token);
    /*
            如果点击的是更新表单：（isUpdate传过来的会是true，如果是创建表单会是undefined）
                只有管理员才可以更新表单，区域编辑，不可以进行表单更新，可以改密码和用户名；
            如果点击的是创建表单：
                区域编辑只可以创建当前的区域和区域编辑
        */
    // 检查模态框表单中地区选择项是否可用
    const checkRegionDiabled = (one) => {
        // console.log(one);
        if (isUpdate) {   // 更新表单
            return roleId === 1 ? false : true;
        } else {          // 创建表单
            return roleId === 1 ? false : one.value !== region;
        }
    }
    // 检查模态框表单中角色选择项是否可用
    const checkRoleDiabled = (one) => {
        console.log(one);
        if (isUpdate) {    // 更新表单
            return roleId === 1 ? false : true;
        } else {           // 创建表单
            return roleId === 1 ? false : one.id !== 3;
        }
    }

    return (
        <div>
            <Form
                ref={ref}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                modifier: 'public',
                }}
            >
                <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                    required: true,
                    message: '请输入用户名！',
                    },
                ]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                        required: true,
                        message: '请输入密码！',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="region"
                    label="区域"
                    rules={isDisable ? []:[
                        {
                        required: true,
                        message: '请选择区域！',
                        }
                    ]}
                >
                    <Select disabled={isDisable}>
                        {
                            regionsList.map((one) => {
                                return (
                                    <Option value={one.value} key={one.id} disabled={checkRegionDiabled(one)}>{one.title}</Option>
                                );
                            })
                        }        
                    </Select>
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[
                        {
                        required: true,
                        message: '请选择角色！',
                        },
                    ]}
                >
                    <Select onChange={(value) => {
                        // console.log(value);
                        if (value === 1) {
                            setIsDisable(true);
                            ref.current.setFieldsValue({
                                region: ""
                            })
                        } else {
                            setIsDisable(false);
                        }
                    }}>
                        {
                            rolesList.map((one) => {
                                return (
                                    <Option value={one.id} key={one.id} disabled={checkRoleDiabled(one)}>{one.roleName}</Option>
                                );
                            })
                        }        
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
})

export default UserForm;