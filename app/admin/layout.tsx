import AdminLayout from "@/components/admin/AdminLayout";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export const metadata = {
    title: "GoCart. - Admin",
    description: "GoCart. - Admin",
};

export default function RootAdminLayout({ children }:{ children: React.ReactNode }) {

    return (
        <>
        <SignedIn>
            <AdminLayout>
                {children}
            </AdminLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn signUpFallbackRedirectUrl='/admin' routing="hash" />
                </div>
            </SignedOut>
        </>
    );
}