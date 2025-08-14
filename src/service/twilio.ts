import dotenv from "dotenv";
import twilio from 'twilio';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifySid = process.env.TWILIO_SERVICE_SID!;

const client = new twilio.Twilio(accountSid, authToken);

export const sendTwilioOTP = async (
  phone: string,
  channel: "sms" | "call" = "sms"
) => {
  return client.verify.v2.services(verifySid).verifications.create({
    to: `+88${phone}`,
    channel,
  });
};

export const verifyTwilioOtp = async (phone: string, code: string) => {
  return client.verify.v2.services(verifySid).verificationChecks.create({
    to: `+88${phone}`,
    code,
  });
};
