import React from 'react'
import { Flex } from 'antd'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { DeleteOutlined } from '@ant-design/icons'
import { useState} from 'react'
const Hospital = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const handleDeleteAllDoctor = () => {

    }
    return (
        <>
            <Flex gap="middle" align="center" justify='space-between' style={{marginBottom:'20px'}}>
                <ButtonComponent
                    size='small'
                    disabled={selectedRowKeys.length == 0}
                    icon={<DeleteOutlined></DeleteOutlined>}
                    onClick={handleDeleteAllDoctor}
                >
                    Xoá tất cả
                </ButtonComponent>
                <ButtonComponent
                    size='small'
                    styleButton={{
                        backgroundColor: 'green'
                    }}
                >
                    Thêm bác sĩ
                </ButtonComponent>
                <Flex gap="middle">

                <ButtonComponent
                    size='small'
                    styleButton={{

                    backgroundColor: 'green'
                    
                    }}
                >
                    Export
                </ButtonComponent>
                <ButtonComponent
                    size='small'
                >
                    Import
                </ButtonComponent>
                </Flex>
            </Flex>
        </>
    )
}

export default Hospital