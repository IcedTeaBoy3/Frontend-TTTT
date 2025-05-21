import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'
const DefaultLayout = ({ children }) => {
    return (
        <>
            <HeaderComponent />
            {children}
            <FooterComponent />
        </>
    )
}

export default DefaultLayout