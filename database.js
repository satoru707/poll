import pg from "pg";
const { Pool } = pg;
import 'dotenv/config'

// const pool = new Pool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'gunnawunna',
//   database: process.env.DB || 'projects',
//   port: process.env.DB_PORT || 5432,
//   ssl: {
//     rejectUnauthorized: true,
//     ca: `-----BEGIN CERTIFICATE-----
// MIIETTCCArWgAwIBAgIUbCkwc6ISFeMO+Kd9WWrlxITY7gMwDQYJKoZIhvcNAQEM
// BQAwQDE+MDwGA1UEAww1ZjAzZDI3NmYtYWI1OC00MDBmLTg2NGEtYzkxNmU4ZmQ3
// OThjIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwMzE2MDk0NzQwWhcNMzUwMzE0MDk0
// NzQwWjBAMT4wPAYDVQQDDDVmMDNkMjc2Zi1hYjU4LTQwMGYtODY0YS1jOTE2ZThm
// ZDc5OGMgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
// AYoCggGBANa8XkxGSCGMzcJ7+bP7dBdTfN+3GnfYIo6iMjvwLgiSdJkmUgNHPme6
// XRNPJFz9dJ8mlm8tGs2h5u/RfIWfn/S61yS/cY5Eg2qFeTtwyCDgCRPGKUhu98Dk
// 1tKiDuLQ82IlxqhmtBDGnTnf6mTgsN47O5HVUmCXJ57Ha91WGe63IRg42/9Bieq1
// cRgTApZyhc8GeJS1nN/78mma3JSeBFxEWiBtkjRMZh6Nb8UsQRRhiWooJ3QYeE97
// AH7cVPsGPAubrangjkkfRDPl1X8Mjv42HMXzLihai6FLkUG8dvfmzeF9VkyeEqwr
// n7H3jkEpqIIZm9jp6d2+ee2Y/KWaxvSq1z/Kbua5lGslWD7//6wkXHPEliP3+Iva
// I6p12nuwrpHZqaGDf89eS49iid94bBo3z/4bYv3sNyxUL+dN3cL76YT/WHywMFEg
// s81QWCCTY2TeUMlAf7QICWkO8EivlibnGXRnbjAdj5OFv8HbdQ1VyfEuE9JHrjuv
// MQGbPfc2tQIDAQABoz8wPTAdBgNVHQ4EFgQUo62P0wpsFQqaFbCz9h32zk8F1XQw
// DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
// AED3YKq68IimBwijNyJHqTejDl9oaX3npZnS+K9PR/JJAnffkOyVzWHn3uvi0nrv
// MhPV8UXEnfmiLXzo1btwbwB/Yi/a7xEvwQoLVrGUaOT6Bl5weiqUfVNzaZtq5qiI
// KdvdT4cybUnFZCgADjXppuWk2t9bgLQ5pIQcuvgIi8r+52EsJP1UJP7o8ZMpkEPQ
// KXOKtQMu64/wO9qpCN4HLACMNaHt6BeL9cAd4RPgjV/sK8AVpuvz3mLfgq8cxWJK
// 6HPOR41ojvMaT0t5O4YvJBJS72wf2P9z0tTLLWFy7125eCOSlizNaQ9PEa6Rl0qm 
// VFPVODoPqP0bX6EaZvUHodU6VgowQjZWA2QguXiBPCTV76alvUh+N3nolIKe2TZP
// 0D59YWwTDyH5LCNUpaLqGjEfaSC5W+zt9HUvNCE4oJa0buHwhStbheLYOLO8oYiF
// 55xrnEU2a48bxCbWP4INapFRWmzFjcx/znyFrkxESlyl1wPsgGE8ZK9M8BaIbGex
// RQ==
// -----END CERTIFICATE-----
// `
//   }
// }); 


const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'gunnawunna',
  database: 'projects',
  port: 5432})
  
const time = new Date();
const date = time.toLocaleString("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

async function addUser(email, password) {
  try {
    const query = `INSERT INTO users (email, password, datecreated,premium) VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [email, password, date, "false"]);

    return result.rows;
  } catch (error) {
    return error;
  }
}

async function checkUser(email) {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    return result.rows;
  } catch (error) {
    return error;
  }
}

async function addPoll(pollConfig, id) {
  let option;
  if (pollConfig.polltype == "yes/no") {
    option = ["Yes", "No"];
  } else {
    option = pollConfig.options;
  }
  try {
    const query = `INSERT INTO polldatac (polltype, question, options, codelink, datecreated, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * `;
    const result = await pool.query(query, [
      pollConfig.polltype,
      pollConfig.question,
      option,
      pollConfig.shareCode,
      date,
      id,
    ]);
    return result.rows;
  } catch (error) {
    return error;
  }
}

async function getDataFromPin(pin) {
  try {
    const query = `SELECT * FROM polldatac WHERE codelink = $1`;
    const result = await pool.query(query, [pin]);
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function viewedPoll(poll, id) {
  try {
    const query = `INSERT INTO polldatap (poll_id, codeLink, dateViewed, user_id) VALUES ($1, $2, $3, $4) RETURNING * `;
    await pool.query(query, [poll.id, poll.codelink, date, id]);
    return query.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function checkviewed(pollid, id) {
  try {
    const query = "SELECT * FROM polldatap WHERE poll_id = $1 and user_id = $2";
    const result = await pool.query(query, [pollid, id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getHistory(id, type) {
  try {
    const query =
      type == "created"
        ? `SELECT * FROM polldatac WHERE user_id = $1 `
        : `SELECT * FROM polldatap WHERE user_id = $1  `;
    const result = await pool.query(query, [id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function addOption(choice, code, id) {
  try {
    const query = `UPDATE polldatap SET choice = $1,datevoted = $2
       WHERE codelink = $3 and user_id = $4 RETURNING *`;
    const result = await pool.query(query, [choice, date, code, id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function collectVotes(code) {
  try {
    const query =
      "SELECT p.*, u.email FROM polldatap p INNER JOIN users u ON p.user_id = u.id WHERE p.codelink = $1";
    const result = await pool.query(query, [code]);
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function setPremium(user) {
  try {
    const query = `UPDATE users SET premium = $1 WHERE email = $2 `;
    const result = await pool.query(query, ["true", user]);
    return result.rows;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function checkPremium(user) {
  try {
    const query = `SELECT * FROM users WHERE email = $1 `;
    const result = await pool.query(query, [user]);
    return result.rows[0].premium;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export {
  addUser,
  checkUser,
  addPoll,
  getDataFromPin,
  viewedPoll,
  getHistory,
  checkviewed,
  addOption,
  collectVotes,
  setPremium,
  checkPremium,
};
