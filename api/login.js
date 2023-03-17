import uri from './db.js';
import { MongoClient } from 'mongodb';

const client = new MongoClient(uri);

async function run(username, password) {
  try {
    console.log('openning db...');
    await client.connect();
    const database = client.db('test');
    const users = database.collection('members');
    const query = { username: username, password: password };
    const options = {
      // Include only username field in the returned document
      projection: { _id: 0, username: 1 },
    };

    const result = await users.findOne(query, {options});

   if (result) {
     return true;
   } else {
    return false;
   }

  } catch (e) {
    console.error(e);
  } finally {
    console.log('closing db...');
    //Ensures that the client will close when you finish/error
    await client.close();
  }
}

export default async (req, res) => {
  if (req.body) {
    const { username, password } = req.body;

    const userFound = await run(username, password);

    res.setHeader('Content-Type', 'text/plain')
    if (userFound) {
      res.end('Login Succeeded!');
    } else {
      res.end('Login Failed!');
    }
  }
}
