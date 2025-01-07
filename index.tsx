const { id } = require("tigerbeetle-node");
const { createClient } = require("tigerbeetle-node");

const client = createClient({
    cluster_id: 0n,
    replica_addresses: [process.env.TB_ADDRESS || "3000"],
  });

console.log(client)

const accounts = await client.lookupAccounts();

console.log(accounts)

const server = Bun.serve({
    port: 3000,
    fetch(request) {
      return new Response("Welcome to Bun!");
    },
  });
  
  console.log(`Listening on localhost:${server.port}`);