const { id, AccountFilterFlags } = require("tigerbeetle-node");
const { createClient } = require("tigerbeetle-node");

const client = createClient({
    cluster_id: 0n,
    replica_addresses: [process.env.TB_ADDRESS || "3000"],
  });

console.log(client)

const account1 = {
    id: 1n, // TigerBeetle time-based ID.
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
  
const account2 = {
  id: 2n, // TigerBeetle time-based ID.
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
  
const account_errors = await client.createAccounts([account1, account2]);

// const accounts = await client.lookupAccounts([1n]);

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
      const path = new URL(req.url).pathname;
  
      // respond with text/html
      if (path === "/") {
        const filter = {
          account_id: 1n,
          user_data_128: 0n, // No filter by UserData.
          user_data_64: 0n,
          user_data_32: 0,
          code: 0, // No filter by Code.
          timestamp_min: 0n, // No filter by Timestamp.
          timestamp_max: 0n, // No filter by Timestamp.
          limit: 10, // Limit to ten balances at most.
          flags: AccountFilterFlags.debits | // Include transfer from the debit side.
            AccountFilterFlags.credits | // Include transfer from the credit side.
            AccountFilterFlags.reversed, // Sort by timestamp in reverse-chronological order.
        };
        const txs = await client.getAccountTransfers(filter);

        return Response.json(txs);
      };
  
      if (path === "/trx") {
        const trx = {
          id: id(), // TigerBeetle time-based ID.
          debit_account_id: 1n,
          credit_account_id: 2n,
          amount: 10n,
          pending_id: 0n,
          user_data_128: 0n,
          user_data_64: 0n,
          user_data_32: 0,
          timeout: 0,
          ledger: 1,
          code: 720,
          flags: 0,
          timestamp: 0n,
        }
        await client.createTransfers([trx])

        return new Response(`${trx.id}`);
      }
    },
  });
  
  console.log(`Listening on localhost:${server.port}`);
