import { initDB } from "./db/lowdb.init.";
import app from "./main";
import { processQueue } from "./services/queue.service";

// Railway provides the PORT via process.env.PORT
const PORT = process.env.PORT || 3300;

async function server() {
  // initialize db
  await initDB();

  // resume queue processing
  // We don't await this because we want the server to start accepting
  // new requests immediately while the background worker catches up.
  processQueue();

  app.listen(Number(PORT), "0.0.0.0", async () => {
    console.log(`Server running on PORT: http://localhost:${PORT}`);
  });
}

server();
