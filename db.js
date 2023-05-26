const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');

// Read the contents of the .env file
const envFile = fs.readFileSync('.env');

// Parse the contents into an object
const envConfig = dotenv.parse(envFile);

// Load the environment variables
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}
// Replace the uri string with your connection string.
const uri = process.env['db'];

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('mulan');
    const movies = database.collection('matches');

    // Query for a movie that has the title 'Back to the Future'
    const query = { teams: 'Test vs Naveen' };
    const movie = await matches.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
module.exports = run
