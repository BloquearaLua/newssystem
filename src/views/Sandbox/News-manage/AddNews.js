import React,{ useState,useEffect,useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd'
import axios from 'axios'

import './css/AddNews.css'
import NewsDraft from '../../../component/News-manage/NewsEditor'

const { Step } = Steps;
const { Option } = Select;
export default function AddNews(props) {
    const [currentStep, setCurrentStep] = useState(0);          // 当前步骤条的值
    const [categoriesList, setCategoriesList] = useState([]);   // categories选择项
    const [formMsg, setFormMsg] = useState({});   // 编写的基本信息
    const [content, setContent] = useState({});     // 编写的新闻内容
    const formRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("token"));

    const handleNext = () => {
        if (currentStep === 0) {
            formRef.current.validateFields().then(res => {
                // console.log(res);
                setFormMsg(res);
                setCurrentStep(currentStep + 1);
            }).catch(err => {
                console.log(err);
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空！");
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    }
    const handlePrev = () => {
        setCurrentStep(currentStep - 1);
    }
    // 保存到草稿箱
    const handleSave = (auditState) => {
        // console.log(formMsg, content);
        axios.post(`/news`, {
            ...formMsg,
            "content": content,
            "region": user.region ? user.region : "全球",
            "author": user.username,
            "roleId": user.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');
            notification.info({
                message: `通知`,
                description: `您可以到${auditState === 0 ? `草稿箱` : `【审核列表/审核】`}中查看您的新闻`,
                placement:'bottomRight',
            });
        }).catch(err => {
            message.error('保存失败！');
        })
    }
    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoriesList(res.data);
        })
    }, [])
    return (
        <div>
            <PageHeader
                title="撰写新闻"
                subTitle="This is a subtitle"
            />

            <Steps current={currentStep} responsive>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            <div className={currentStep === 0 ? "showForm" : "hiddenForm"} style={{marginTop: '40px'}} >
                <Form
                    name="basic"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}
                    ref = {formRef}
                    >
                    <Form.Item
                        label="新闻标题"
                        name="title"
                        rules={[{ required: true, message: '请输入新闻标题！' }]}
                        
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="新闻分类"
                        name="categoryId"
                        rules={[{ required: true, message: '请选择新闻分类！' }]}
                    >
                        <Select >
                            {
                                categoriesList.map(item => 
                                    <Option value={item.id} key={item.id}>{item.title}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>

            <div className={currentStep === 1 ? "showForm" : "hiddenForm"}>
                <NewsDraft getContent={(value) => { setContent(value); }}></NewsDraft>
            </div>
            <div className={currentStep === 2 ? "showForm" : "hiddenForm"}> 
            </div>
            <div className="stepsButtons">
                {
                    currentStep > 0 && <Button className="stepBtn" onClick={handlePrev}>上一步</Button>
                }
                {
                    currentStep < 2 &&
                    <span>
                        <Button className="stepBtn" type="primary" onClick={handleNext}>下一步</Button>
                    </span>
                }
                {
                    currentStep === 2 &&
                    <span >
                        <Button className="stepBtn" type="primary" onClick={()=>{handleSave(0)}}>保存草稿箱</Button>
                        <Button className="stepBtn" type="danger" onClick={()=>{handleSave(1)}}>提交审核</Button>
                    </span>
                }
            </div>

        </div>
    )
}
