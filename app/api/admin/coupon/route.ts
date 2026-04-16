import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request:NextRequest){
    try{
        const {userId} =  getAuth(request);
        const isAdmin = await authAdmin(userId!);
        
        if (!isAdmin){
            return new Response(JSON.stringify({message: "Unauthorized"}), {status: 401})
        }

        const {coupon} = await request.json();
        coupon.code = coupon.code.toUpperCase();
        await prisma.coupon.create({
            data: coupon
        }).then(async(coupon)=>{
            await inngest.send({
                name: "app/coupon.expired",
                data: {
                    code: coupon.code,
                    expiresAt: coupon.expiresAt
                }
            })
        })
        return new Response(JSON.stringify({message: "Coupon created successfully"}), {status: 201})
    }
    catch(error){
        return new Response(JSON.stringify({message: "Error creating coupon"}), {status: 500})
    }
}

//delete coupon 

export async function  DELETE(request:NextRequest){
    try{
        const {userId} =  getAuth(request);
        const isAdmin = await authAdmin(userId!);
        
        if (!isAdmin){
            return new Response(JSON.stringify({message: "Unauthorized"}), {status: 401})
        }
        const  {searchParams} = request.nextUrl;
        const code = searchParams.get('code');
        if (!code){
            return new Response(JSON.stringify({message: "Coupon code is required"}), {status: 400})
        }
        await prisma.coupon.delete({
            where: {
                code: code.toUpperCase()
            }
        })
        return new Response(JSON.stringify({message: "Coupon deleted successfully"}), {status: 200})
     }
    catch(error){
        return new Response(JSON.stringify({message: "Error deleting coupon"}), {status: 500})
    }
}

//get all coupons

export async function GET(request: NextRequest) {
    try {
        // 1. Modern Clerk auth for App Router
        const { userId } = getAuth(request);
        
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Check if user is admin
        const isAdmin = await authAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
    
        // 3. Fetch data
        const coupons = await prisma.coupon.findMany();

        // 4. Use NextResponse.json (Cleaner than new Response)
        return NextResponse.json({ coupons }, { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ message: "Error fetching coupons" }, { status: 500 });
    }
}