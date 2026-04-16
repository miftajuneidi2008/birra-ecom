// lib/authenticator.ts
import { getUploadAuthParams } from "@imagekit/next/server";

export const getImageKitAuth = () => {
  const authParams = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  return {
    ...authParams,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string, // Add this line
  };
};