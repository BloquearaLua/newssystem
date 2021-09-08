import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import * as echarts from 'echarts'
import _ from 'lodash'

const { Meta } = Card;
export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [allList, setAllList] = useState([]);
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"));
    const barRef = useRef();
    const pieRef = useRef();
        
    useEffect(() => {
        axios.get('/news?auditState=2&_expand=category&_sort=view&_order=desc&_limit=7').then(res => {
            // console.log(res.data);
            setViewList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get('/news?auditState=2&_expand=category&_sort=star&_order=desc&_limit=7').then(res => {
            // console.log(res.data);
            setStarList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // console.log(res.data);
            // 使用 _ 将数据转换成对应的数据【category：news】
            // console.log(_.groupBy(res.data, item => item.category.title));
            renderBar(_.groupBy(res.data, item => item.category.title));
            setAllList(res.data);
        });
        return () => {
            window.onresize = null;
        }
    }, []);

    const renderBar = (categoryObj) => {
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(barRef.current);

        // 指定图表的配置项和数据
        const option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['条数']
            },
            xAxis: {
                data: Object.keys(categoryObj),
                axisLabel: {
                    rotate: 45,
                    interval: 0
                }

            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '条数',
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                },
                data: Object.values(categoryObj).map(item => item.length)
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

        window.onresize = () => {
            myChart.resize();
        }
    }

    const renderPie = () => {
        const userList = allList.filter(item => item.author === username);
        // console.log(userList,allList);
        const myChart = echarts.init(pieRef.current);
        const groupUser = _.groupBy(userList, item => item.category.title);
        // console.log(groupUser);
        const objArr = [];
        for (const key in groupUser) {
            objArr.push({
                name: key,
                value: groupUser[key].length
            })
        }
        console.log(objArr);
        var option;
        option = {
            title: {
                text: '个人新闻统计',
                subtext: username,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    left: "70px",
                    data: objArr,
                    avoidLabelOverlap: true,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            label: {
                ellipsis:'break'
            }
        };
        option && myChart.setOption(option);
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={false}>
                        <List
                            size="small"
                            // header={<div>Header</div>}
                            // footer={<div>Footer</div>}
                            // bordered
                            dataSource={viewList}
                            renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={false}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        // style={{ width: 300 }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setTimeout(() => {
                                    setVisible(true);
                                    renderPie(); 
                                },0)
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={ username }
                            description={
                                <div>
                                    <span style={{ paddingRight:"20px"}}>{ roleName }</span>
                                    <span>{region ? region : '全球'}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                width="500px"
                title={`个人新闻分类`}
                placement="right"
                closable={false}
                onClose={()=>{setVisible(false)}}
                visible={visible}
            >
                <div ref={pieRef} style={{width:"100%",height:"400px"}}>
                </div>
            </Drawer>
            <div id="main" ref={barRef} style={
                {
                    width: "100%",
                    height: "400px"
                }
            }>
            </div>
        </div>
    )
}
