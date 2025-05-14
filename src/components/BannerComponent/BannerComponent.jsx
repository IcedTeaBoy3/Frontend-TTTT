import React from 'react'
import InputComponent from '../InputComponent/InputComponent'

const BannerComponent = () => {
  return (
    <div style={{backgroundColor:'#1890ff',minHeight:'500px',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <h1 style={{color:'white',textAlign:'center'}}>Chào mừng bạn đến với MediCare</h1>
        <p style={{color:'white',fontSize:'16px'}}>Đặt khám với hơn 1000 bác sĩ, 25 bệnh viện, 100 phòng khám trên MediCare để có số thứ tự và khung giờ khám trước.</p>
        <InputComponent
            placeholder="Tìm kiếm bác sĩ, phòng khám, bệnh viện"
            onSearch={(value) => console.log(value)}
            size="large"
        
        />
    </div>
  )
}

export default BannerComponent