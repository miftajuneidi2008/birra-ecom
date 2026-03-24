import { authenticator } from "@/lib/ImageKitAuthenticator";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { upload } from "@imagekit/next";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const mrp = Number(formData.get("mrp"));
    const price = Number(formData.get("price"));
    const category = formData.get("category");
    const image = formData.getAll("image");
    if (
      !name ||
      !description ||
      !mrp ||
      !price ||
      !category ||
      image.length < 1
    ) {
      return NextResponse.json(
        { error: "Missing Product details" },
        { status: 400 },
      );
    }

    if (image.length > 4) {
      return NextResponse.json(
        { error: "Maximum 4 images allowed" },
        { status: 400 },
      );
    }
    const uploadPromises = image.map(async (image) => {
      if (!(image instanceof File)) {
        throw new Error("Invalid file type detected");
      }
      const { signature, expire, token, publicKey } = await authenticator();

      return upload({
        file: image,
        fileName: image.name,
        useUniqueFileName: true,
        tags: ["store-gallery"],
        folder: "/store-images",
        publicKey,
        signature,
        expire,
        token,
      });
    });

    const uploadResponses = await Promise.all(uploadPromises);
    const imageUrls = uploadResponses
      .map((res) => res.url)
      .filter((url): url is string => typeof url === "string");

     await prisma.product.create({
      data: {
        name: name.toString(),
        description: description.toString(),
        mrp: mrp,
        price: price,
        category: category.toString(),
        storeId: storeId,
        images: imageUrls,
      },
    });

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const products = await prisma.product.findMany({
      where: { storeId: storeId },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
