import React from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import FormLogin from '../../components/FormLogin/FormLogin'
const AuthenticationPage = () => {
 
  
  return (
    <>
      <HeaderComponent />
      <div style={{backgroundColor:'#e5e7eb',minHeight:'80vh', display:'flex',alignItems:'center',justifyContent:'space-around'}}>
        <img src="mylogo.webp" alt="" width={400} />
        <FormLogin />

      </div>
    </>
  )
}

export default AuthenticationPage