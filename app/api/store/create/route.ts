import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticator } from "@/lib/ImageKitAuthenticator";
import { upload } from "@imagekit/next";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
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

    // Check if store exists
    const existingStore = await prisma.store.findFirst({ where: { userId } });
    if (existingStore)
      return NextResponse.json({ status: existingStore.status });

    // Check if username taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });
    if (isUsernameTaken)
      return NextResponse.json({ error: "Username taken" }, { status: 400 });

    let imageUrl = "";

    // Fix for the TypeScript Errors
    if (image instanceof File) {
      const { signature, expire, token, publicKey } = await authenticator();

      const response = await upload({
        file: image,
        fileName: image.name,
        useUniqueFileName: true,
        tags: ["store-logo"],
        folder: "/store-logos",
        publicKey,
        signature,
        expire,
        token,
      });

      if (response.url) {
        imageUrl = response.url;
      }
    } else {
      return NextResponse.json(
        { error: "Invalid image file" },
        { status: 400 },
      );
    }

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
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
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
