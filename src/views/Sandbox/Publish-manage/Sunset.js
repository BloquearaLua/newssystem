import React from 'react'
import {Button} from 'antd'
import NewsTable from '../../../component/Publish-manage/NewsTable'
import usePublish from '../../../component/Publish-manage/usePublish'

export default function Sunset() {
    const { dataSource,handleDelete } = usePublish(3);

    return (
        <>
            <NewsTable dataSource={dataSource} button={ id => <Button danger onClick={()=>handleDelete(id)}>删除</Button>}/>
        </>
    )
}
