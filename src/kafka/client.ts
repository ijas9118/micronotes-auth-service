import { Kafka } from "kafkajs";

import env from "@/configs/validate-env.js";

export const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [env.KAFKA_BROKER],
});
