'use client'

import { AdminSideBar } from "@/components/admin/AdminSideBar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}){
    const {user}= useAuth();
    const router= useRouter();

    useEffect(()=>{
        if(!user){
            router.replace("/sign-in");
        }else if(user.role!="ADMIN"){
            router.replace("/");
        }
        router.push('/admin/dashboard');
    },[user, router]);
/*

    if(!user || user.role!="ADMIN"){
        return null;
    }
*/

    return(
        <div className="flex min-h-screen bg-[#0D0D0D] ">
            <AdminSideBar/>
            <main className="flex-1  overflow-auto ">
                <div className="p-4 lg:p-6 pt-16 lg:pt-6">
                    {children}
                </div>
            </main>
        </div>
    )

}