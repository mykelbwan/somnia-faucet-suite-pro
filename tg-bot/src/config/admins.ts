import "dotenv/config";

const { MYKEL, /* EMMANUEL */ } = process.env;

if (!MYKEL ) {
  throw new Error("Invalid Admin environment variables");
}

export const admin_ids = [Number(MYKEL)];
