import React  from 'react'
import {Button} from 'antd'
import NewsTable from '../../../component/Publish-manage/NewsTable'
import usePublish from '../../../component/Publish-manage/usePublish'


export default function Unpublished() {
    const { dataSource,handlePublish } = usePublish(1);
    return (
        <>
            <NewsTable dataSource={dataSource} button={ id => <Button type='primary' onClick={()=>handlePublish(id)}>发布</Button>}/>
        </>
    )
}
