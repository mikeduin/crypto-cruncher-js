module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
    // connection: 'postgres://localhost/crypto-cruncher'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }

};
