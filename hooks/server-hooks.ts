"use server";

import CryptoJS from "crypto-js";

export async function getUser(email: string) {
  const response = await prisma?.user.findUnique({
    where: {
      email: email,
    },
  });
  return response;
}

export async function updateProfileImage(userId: string, image: string) {
  try {
    if (
      await prisma?.user.findUnique({
        where: {
          id: userId,
        },
      })
    ) {
      await prisma?.user.update({
        where: {
          id: userId,
        },
        data: {
          picture: image,
        },
      });
      return "Updated the Profile Pic";
    } else {
      return "User Not Found";
    }
  } catch (error) {
    return "Internal Server Error";
  }
}

export async function encryptImageString(image: string) {
  const encryptionKey = CryptoJS.enc.Utf8.parse(process.env.AES_KEY!);

  const encryptedImage = CryptoJS.AES.encrypt(image, encryptionKey, {
    mode: CryptoJS.mode.ECB,
  });

  return encryptedImage.ciphertext.toString(CryptoJS.enc.Base64);
}

export async function decryptImageString(image: string) {
  const encryptionKey = CryptoJS.enc.Utf8.parse(process.env.AES_KEY!);

  const decryptedImage = CryptoJS.AES.decrypt(image, encryptionKey, {
    mode: CryptoJS.mode.ECB,
  });

  return decryptedImage.toString(CryptoJS.enc.Utf8);
}
