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
    const {storeId,status} = await request.json();

    if(status==="approved")
    {
        await prisma.store.update({
            where:{id: storeId},
            data:{status: "approved",isActive: true}
        })
    }
    
    else if (status==="rejected")
    {
        await prisma.store.update({
            where:{id: storeId},
            data:{status: "rejected"}
        })
    }
    return NextResponse.json({message:status + " successfully"}, {status: 200});
}
catch(error){
    console.error(error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
} 
}

export async function GET(request:NextRequest){
     const {userId}= await getAuth(request);
    const isAdmin = await authAdmin(userId!);
    if (!isAdmin){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});

    }
    try{
        const stores = await prisma.store.findMany({
            where:{status:{in:["pending","rejected"]}},
            include:{user:true}
        })
        console.log(stores);
       return NextResponse.json({stores}, {status: 200});
    }
    catch(error){
    console.error(error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}