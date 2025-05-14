import React from 'react'
import { CustomTabs } from './style'
const TabsCompoent = ({items,onChange,...rests}) => {
    
    return (
        <CustomTabs 
            defaultActiveKey="1" 
            items={items} 
            onChange={onChange} 
            centered
            {...rests}
        />
  )
}

export default TabsCompoent