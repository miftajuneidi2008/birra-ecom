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
        return NextResponse.json({isAdmin: true}, {status: 200});
    }catch(error){
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}