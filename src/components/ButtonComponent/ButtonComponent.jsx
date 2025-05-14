import React from 'react';
import { CustomButton } from './style';

const ButtonComponent = ({ size = 'middle', children, type = 'primary',styleButton,disabled, onClick, ...rests }) => {
  return (
    <CustomButton 
      size={size} 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      style={{
        ...styleButton,
        backgroundColor: disabled ? '#ccc' : styleButton?.backgroundColor,
        
      }} 
      {...rests}
    >
      {children}
    </CustomButton>
  );
};

export default ButtonComponent;
