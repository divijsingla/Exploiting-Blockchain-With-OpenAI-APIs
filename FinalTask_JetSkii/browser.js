
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function handleImageInput(event) {
    var input = event.target;
    var preview = document.getElementById('preview');

    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
      
        const file = URL.createObjectURL(input.files[0])
        
        fetch('/upload', {
            method: 'POST',
            body: file
          })
          .then(response => response.json())
          .then(data => {
            // console.log(data.ipfsHash);
            const ipfs = document.getElementById('ipfs');
            ipfs.innerHTML="IPFS Hash: "+data.ipfsHash;
            console.log("IPFS Hash: "+ipfs.innerHTML)

            console.log(`https://gateway.pinata.cloud/ipfs/${data.ipfsHash}`);
            const elem = document.getElementById('jj');
            elem.innerHTML+=`<div class="col-md-6">
            <a type="button" data-ipfs=${data.ipfsHash} class="btn btn-primary btn_detail all-attributes w-100" onclick="publish(this)">
                Publish your minted NFT!
            </a>
        </div>`
            console.log("success"); // Handle the response from the server
          })
          .catch(error => {
            console.error(error);
          });
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }

function preview(){

  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = handleImageInput;
  input.click();
    

}
const axios = require('axios');


async function publish(target){
  target.style.display = 'none';
  const ipfsh = target.dataset.ipfs;

  const url = 'https://staging.crossmint.com/api/2022-06-09/collections/default/nfts';
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-client-secret': 'sk_test.67bb3f1b.3727516c82befa46f6adfd456143adc8',
    'x-project-id': '4036a6f4-8141-454d-a13c-5223945b11bd'
  };
  const data = {
    recipient: 'solana:BDw3FYFK3SWU766tqoVtNFqZss6eTksAPuW5wRJRbsBg',
    metadata: {
      name: 'My first Mint API NFT',
      image: `https://gateway.pinata.cloud/ipfs/${ipfsh}`,
      description: 'My NFT created via the mint API!'
    }
  };
let id;
   fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      id = data.id;
      console.log(data)
      setTimeout(()=>{
        const url = `https://staging.crossmint.com/api/2022-06-09/collections/default-solana/nfts/${id}`;
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-client-secret': 'sk_test.67bb3f1b.3727516c82befa46f6adfd456143adc8',
            'x-project-id': '4036a6f4-8141-454d-a13c-5223945b11bd'
          }
        };
        
        fetch(url, options)
          .then(res => res.json())
          .then(json => {
            console.log(json);
            let nftaddress;
            const cont = document.getElementById("cont");
          cont.innerHTML+= `<div class="col-md-2 col-sm-3 col-xs-6 container-punk-event-large">
          <div class="punk-image-container">
              <div><a title="My First NFT" href="/cryptopunks/details/5822" ><img src=${json.metadata.image} width="144" height="144" alt="Punk 5822" class="pixelated" style="background: #638596"></a></div>
              <div class="punk-image-overlay-top-left punk-image-overlay-text">1</div>
          </div>
          <div class="m-t-10"><a href="/cryptopunks/details/5822">Logo</a></div>
          <div>3K&Xi; ($2.7M)</div>
          <div style="color:#9c9c9c;">Fri 23 Jun, 2023</div>
          <a type="button" data-nft=${nftaddress} class="btn btn-primary btn_detail top-owners w-100" href='/cryptopunks/leaderboard'>
              Buy Now
          </a>
        </div>`
          })
          .catch(err => console.error('error:' + err));
      }, 20000)
      
      
    })
    .catch(error => console.error('Error:', error));

  

// https://gateway.pinata.cloud/ipfs/Qme3sbhuwzvgNTPatiM1jLsHQQAd6sFCKj7B2Nkg9ZpRWp

  

}
