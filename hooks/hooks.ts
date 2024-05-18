import { randomBytes } from "crypto";

export function generateEmailHashToken() {
  return randomBytes(32).toString("hex");
}
export function getExpirationDate() {
  const ExpirationTime = new Date();
  ExpirationTime.setMinutes(ExpirationTime.getMinutes() + 5);
  return ExpirationTime;
}

export function generateOTP() {
  const otpLength = 6;
  let otp = "";

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10); // Generate a random digit from 0 to 9
  }

  return otp;
}



