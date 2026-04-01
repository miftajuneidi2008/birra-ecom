import authSeller from "@/middlewares/authSeller";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);
    const storeId = await authSeller(userId!);
    const orders = await prisma.order.findMany({
      where: {
        storeId: storeId! || undefined,
      },
    });
    const products = await prisma.product.findMany({
        where:{
            storeId: storeId! || undefined,  
        }
    })
    const ratings = await prisma.rating.findMany({
        where:{
            productId:{in:products.map(product=>product.id)} 
        }
    })
    const dashboardData = {
        totalOrders: orders.length,
        ratings,
        totalEarning:Math.round(orders.reduce((acc, order) => acc + order.total, 0)) ,  
        totalProducts: products.length,

    }
    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
