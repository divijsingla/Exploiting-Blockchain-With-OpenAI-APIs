// require('dotenv').config();
const { Web3 } = require('web3');
var axios = require('axios');

const apikey = process.env['apikey']
const network = 'goerli';
const node=  `https://eth.getblock.io/${apikey}/${network}/`
const web3 = new Web3(node);
const PINATA_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlY2RiZTBmMC03Mzg5LTQ3MjEtYTBkOC0yYWI3ZjBlNzFiM2MiLCJlbWFpbCI6ImRpdmlqc2luZ2xhMTAwMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNzRkZWNjZWYwZTU0NTZiOTUyNmQiLCJzY29wZWRLZXlTZWNyZXQiOiIzODBlMDdkODI5NmE2MGQwYzI5OGU2YTUwYTNkMzEzNzY4NzFkNjBlZmRhMTU5OTFkMjFhNmRhNzkwNmM0MzQ4IiwiaWF0IjoxNjg3NTEwMDE3fQ.rHcYCJzleoXf4S4-eLSxfoRpF3JmetqsvOriF43RnMc"
const imagePath = 'logoaca.jpeg';

var config = {
  method: 'get',
  url: 'https://api.pinata.cloud/data/testAuthentication',
  headers: { 
    'Authorization': 'Bearer '+PINATA_JWT
  }
};
async function connect(){
    try{

        const res = await axios(config)
        // console.log(res.data);
    }
    catch{
        console.log("error");
    }
}

connect();


const FormData = require('form-data')
const fs = require('fs')
const JWT = 'Bearer '+PINATA_JWT

const pinFileToIPFS = async () => {
    // connect();
    const formData = new FormData();
    const src = "jamboa.jpeg";
    // console.log(src);
    
    const file = fs.createReadStream(src)
    formData.append('file', file)
    
    const metadata = JSON.stringify({
      name: 'File name',
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data);
      return res.data;
      // console.log(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
    } catch (error) {
      console.log(error);
    }
}

module.exports=pinFileToIPFS;

