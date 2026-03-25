import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username")?.toLocaleLowerCase();
    if(!username){
    return NextResponse.json({ error: "Username is required" }, { status: 400 });   
    }
    const store  = await prisma.store.findUnique({
        where:{username: username,isActive:true},
        include:{
            Product:{include:{rating:true}}
        }
    })
    if(!store){
        return NextResponse.json({ error: "Store not found" }, { status: 404 });   
    }
    return NextResponse.json({ store });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
