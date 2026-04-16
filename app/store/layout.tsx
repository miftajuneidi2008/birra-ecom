import StoreLayout from '@/components/store/StoreLayout';
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import React from 'react'
export const metadata = {
    title: "GoCart. - Store Dashboard",
    description: "GoCart. - Store Dashboard",
};
const RootAdminLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
    <SignedIn>
    <StoreLayout>
      {children}
      </StoreLayout>
      </SignedIn>
          <SignedOut>
                      <div className="min-h-screen flex items-center justify-center">
                          <SignIn signUpFallbackRedirectUrl='/store' routing="hash" />
                      </div>
                  </SignedOut>
      </>
  )
}

export default RootAdminLayout