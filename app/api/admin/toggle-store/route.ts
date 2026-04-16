import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
     const {userId}= await getAuth(request);
    const isAdmin = await authAdmin(userId!);
    if (!isAdmin){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});

    }
    try{
       const {storeId} = await request.json();
       if(!storeId){
        return NextResponse.json({error: "Store ID is required"}, {status: 400});
       }
       const store = await prisma.store.findUnique({where:{id: storeId}});
       if(!store){
        return NextResponse.json({error: "Store not found"}, {status: 404});
       }
       await prisma.store.update({
        where:{id: storeId},
        data:{isActive: !store.isActive}
       })
       return NextResponse.json({message: "Store status toggled successfully"}, {status: 200});
    }
    catch(error){
    console.error(error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}