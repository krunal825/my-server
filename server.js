const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json()); 
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Krunal@825',
  database: 'user-crud'
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching user data:', err);
      res.status(500).send('Error fetching user data');
      return;
    }
    console.log('User data fetched successfully');
    res.status(200).json(results);
  });
});

app.post('/users', (req, res) => {
  const userData = req.body; 
  const tableName = 'users'; 
 
  const experienceDetails = userData.experienceDetails;
 
  delete userData.experienceDetails;

  const fields = Object.keys(userData).join(', ');
  const values = Object.values(userData).map(value => typeof value === 'string' ? `'${value}'` : value).join(', ');
  const insertQuery = `INSERT INTO ${tableName} (${fields}, experienceDetails) VALUES (${values}, ?)`;

  connection.query(insertQuery, [JSON.stringify(experienceDetails)], (err, results) => {
    if (err) {
      console.error('Error saving user:', err);
      res.status(500).send('Error saving user');
      return;
    }
    console.log('User saved successfully');
    res.status(200).send('User saved successfully');
  });
});

app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  const experienceDetails = userData.experienceDetails;
  delete userData.experienceDetails;
  delete userData.id;

  let setClause = Object.keys(userData).map(key => `${key} = '${userData[key]}'`).join(', ');
  setClause += `, experienceDetails = '${JSON.stringify(experienceDetails)}'`; 

  const updateQuery = `UPDATE users SET ${setClause} WHERE id = '${userId}'`;

  connection.query(updateQuery, (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Error updating user');
      return;
    }
    console.log('User updated successfully');
    res.status(200).send('User updated successfully');
  });
});



app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  if (isNaN(userId)) {
    console.error('Invalid user ID:', userId);
    res.status(400).send('Invalid user ID');
    return;
  }
  connection.query('DELETE FROM users WHERE id = ?', userId, (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting user');
      return;
    }
    console.log('User deleted successfully');
    res.status(200).send('User deleted successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
