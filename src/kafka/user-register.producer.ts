import logger from "@/configs/logger.js";

import { kafka } from "./client.js";

const producer = kafka.producer();

export async function sendUserRegistrationEvent(userData: {
  userId: string;
  email: string;
}) {
  try {
    await producer.connect();

    const message = {
      topic: "user-registration",
      messages: [
        {
          key: userData.userId,
          value: JSON.stringify({
            userId: userData.userId,
            email: userData.email,
          }),
        },
      ],
    };

    await producer.send(message);

    logger.info(`User registration event sent successfully: ${JSON.stringify(userData)}`);
  }
  catch (error) {
    logger.error("Failed to send user registration event:", error);
  }
  finally {
    await producer.disconnect();
  }
}
