import authSeller from "@/middlewares/authSeller";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";


export async function GET(request:NextRequest) {
    try{
   const {userId} = await getAuth(request);
   const storeId = await authSeller(userId!)
    }
    catch(error){
        console.log(error)
    }

} 