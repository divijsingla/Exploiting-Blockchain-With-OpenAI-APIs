// server.js

const express = require('express');
const multer = require('multer');
const path = require('path')
const pinFileToIPFS=require('./index')
const app = express();

app.post('/upload', (req, res) => {
  ;
  console.log("HI boy")
  console.log(res);
  pinFileToIPFS()
    .then(result => {
      res.json({ ipfsHash: result.IpfsHash });
      console.log(result.IpfsHash)
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    });
});



app.use(express.static(__dirname));
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'abcd.html');
    res.sendFile(filePath)

  });
