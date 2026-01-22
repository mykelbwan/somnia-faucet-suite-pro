import "dotenv/config";

const { SERVER_ID, MYKEL } = process.env;

if (!SERVER_ID || !MYKEL) throw new Error("Invalid admin ID in ENV");

export const admin_id = [Number(MYKEL), Number(SERVER_ID)];
