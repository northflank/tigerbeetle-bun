const { id } = require("tigerbeetle-node");
const { createClient } = require("tigerbeetle-node");

const client = createClient({
    cluster_id: 0n,
    replica_addresses: [process.env.TB_ADDRESS || "3000"],
  });

console.log(client)

const account = {
    id: id(), // TigerBeetle time-based ID.
    debits_pending: 0n,
    debits_posted: 0n,
    credits_pending: 0n,
    credits_posted: 0n,
    user_data_128: 0n,
    user_data_64: 0n,
    user_data_32: 0,
    reserved: 0,
    ledger: 1,
    code: 718,
    flags: 0,
    timestamp: 0n,
  };
  
const account_errors = await client.createAccounts([account]);

const accounts = await client.lookupAccounts([account.id]);

console.log(accounts)

const server = Bun.serve({
    port: 3000,
    fetch(request) {
      return new Response("Welcome to Bun!");
    },
  });
  
  console.log(`Listening on localhost:${server.port}`);