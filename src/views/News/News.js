import React, { useState, useEffect } from 'react';
import { PageHeader, Card, List, Row, Col } from 'antd';
import axios from 'axios'
import _ from 'lodash'

export default function News() {
    const [list, setList] = useState([]);
    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            // console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
            setList(Object.entries(_.groupBy(res.data, item => item.category.title)));
        })
    }, [])

    return (
        <div style={{width:"95%",margin:"0 auto"}}>
            <PageHeader
                className="site-page-header"
                title="全球新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16,16]}>
                    {
                        list.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={false} hoverable>
                                    <List
                                        // bordered
                                        size="small"
                                        dataSource={item[1]}
                                        renderItem={one => <List.Item><a href={`#/detail/${one.id}`}>{one.title}</a></List.Item>}
                                        pagination={{ pageSize: 5 }}
                                        split={false}
                                        />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )
}
