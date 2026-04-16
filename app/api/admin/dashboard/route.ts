import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
   
        try{
            const {userId} = await getAuth(request);
        const isAdmin = await authAdmin(userId!);
        if(!isAdmin){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        const orders = await prisma.order.count();
        const stores = await prisma.store.count();
        const allOrders = await prisma.order.findMany({
            select:{
                createdAt:true,
                total:true
            }
        })
        let totalRevenue = 0;
        allOrders.forEach(order => {
            totalRevenue += order.total;
        });
        const revenue = totalRevenue.toFixed(2);
        const product = await prisma.product.count();
        const dashboardData = {
            allOrders: allOrders,     
            stores: stores,
            revenue: revenue,
            products: product,
            orders:orders 
        }
        




       return NextResponse.json({dashboardData}, {status: 200});
        }
        catch(error){
            console.error(error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }
   
}