import React from 'react'
import {Button} from 'antd'
import NewsTable from '../../../component/Publish-manage/NewsTable'
import usePublish from '../../../component/Publish-manage/usePublish'

export default function Published() {
    
    const { dataSource,handleSunset } = usePublish(2);
    return (
        <>
            <NewsTable dataSource={dataSource} button={ id => <Button type='primary' onClick={()=>handleSunset(id)}>下线</Button>}/>
        </>
    )
}
