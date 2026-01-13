import StoreLayout from '@/components/store/StoreLayout';
import React from 'react'
export const metadata = {
    title: "GoCart. - Store Dashboard",
    description: "GoCart. - Store Dashboard",
};
const RootAdminLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <StoreLayout>{children}</StoreLayout> 
  )
}

export default RootAdminLayout