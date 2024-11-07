// Import required modules
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

// Create a new Express.js app
const app = express();

// Connect to the MongoDB database
MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB');

    // Create a new collection to store user data
    const db = client.db();
    const usersCollection = db.collection('users');

    // Handle user login requests
    app.post('/login', (req, res) => {
      const { username, password } = req.body;

      // Find the user in the database
      usersCollection.findOne({ username }, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: 'Error logging in' });
        } else if (!user) {
          res.status(401).send({ message: 'Invalid username or password' });
        } else {
          // Compare the provided password with the hashed password stored in the database
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send({ message: 'Error logging in' });
            } else if (!result) {
              res.status(401).send({ message: 'Invalid username or password' });
            } else {
              // Login successful, return a success message
              res.send({ message: 'Login successful' });
            }
          });
        }
      });
    });

    // Handle user registration requests
    app.post('/register', (req, res) => {
      const { username, password } = req.body;

      // Hash the password using bcrypt
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: 'Error registering user' });
        } else {
          // Create a new user document
          const user = { username, password: hash };

          // Insert the user document into the database
          usersCollection.insertOne(user, (err, result) => {
            if (err) {
              console.log(err);
              res.status(500).send({ message: 'Error registering user' });
            } else {
              // Registration successful, return a success message
              res.send({ message: 'Registration successful' });
            }
          });
        }
      });
    });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
  console.log('MongoDb is connected');
});