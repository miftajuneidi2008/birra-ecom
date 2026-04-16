import { auth, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { upload } from "@imagekit/next";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!, 
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log(userId, "User ID from Auth");  
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const username = formData.get("username")?.toString();
    const description = formData.get("description")?.toString();
    const email = formData.get("email")?.toString();
    const contact = formData.get("contact")?.toString();
    const address = formData.get("address")?.toString();
    const image = formData.get("image"); // This is a File/Blob

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "Missing Store Information" },
        { status: 400 },
      );
    }

   
    const existingStore = await prisma.store.findFirst({ where: { userId } });
    if (existingStore)
      return NextResponse.json({ status: existingStore.status });
    console.log(existingStore, "Existing Store");
    // Check if username taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });
    if (isUsernameTaken)
      return NextResponse.json({ error: "Username taken" }, { status: 400 });
  let imageUrl = "";

    // 2. Server-side Upload Logic
    if (image instanceof File) {
      // Convert File to Buffer for the Node.js environment
      const buffer = Buffer.from(await image.arrayBuffer());

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: image.name,
        useUniqueFileName: true,
        tags: ["store-logo"],
        folder: "/store-logos",
      });

      imageUrl = uploadResponse.url;
    } else {
      return NextResponse.json(
        { error: "Invalid image file" },
        { status: 400 },
      );
    }
    console.log("Image uploaded to ImageKit:");
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        username: username.toLowerCase(),
        description,
        email,
        contact,
        address,
        logo: imageUrl,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "Applied, pending approval" });
  } catch (error) {
    console.error("Store Creation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const store = await prisma.store.findFirst({ where: { userId } });
    if (!store) {
      return NextResponse.json(
  { status: null },
  { status: 200 }
);        
    }
    return NextResponse.json({ status: store.status });
  } catch (error) {
    console.error("Store Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
