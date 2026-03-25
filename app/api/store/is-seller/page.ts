import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const storeInfo = await prisma.store.findUnique({
      where: {
        userId: userId,
      },
    });
    return NextResponse.json({ isSeller, storeInfo });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });   
  }
}
