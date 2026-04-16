import prisma from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
     const {userId}= await getAuth(request);
    const isAdmin = await authAdmin(userId!);
    if (!isAdmin){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});

    }
    try{
        const stores = await prisma.store.findMany({
            where:{status:"approved"},
            include:{user:true}
        })
       return NextResponse.json({stores}, {status: 200});
    }
    catch(error){
    console.error(error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}