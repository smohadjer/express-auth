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

    const result = await users.findOne(query, options);

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

    const userIsFound = await run(username, password);

    res.setHeader('Content-Type', 'text/plain')
    if (userIsFound) {
      res.cookie('loggedIn', true, {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000) // expires in 8 hours
      });
      res.writeHead(302, {
        'Location': '/private/protected.html'
        //add other headers here...
      });
      res.end();
      //res.end('Login Succeeded!');
    } else {
      res.writeHead(302, {
        'Location': '/login.html'
        //add other headers here...
      });
      res.end('Login Failed!');
    }
  }
}
