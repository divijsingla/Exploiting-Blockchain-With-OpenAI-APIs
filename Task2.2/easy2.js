const crypto = require('crypto');
const cryptohash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  hash.update(inputs.sort().join(''));
  return hash.digest('hex');
};

//delay function for making the while loops async
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

 const GENESIS_DATA={
    prevHash:"0x00",
    data:"Genesis Block",
    nonce:0,
    hash: cryptohash('0x00','GenesisBlock',0)
}

let starti = Date.now();
let Mdifficulty = 2+Math.floor(Math.random() * 4);

const currentdiff = ()=>{
     if(Date.now()-starti>=5000){
          Mdifficulty = 2+Math.floor(Math.random() * 4);
          console.log(`Difficulty: ${Mdifficulty}`);
          starti = Date.now();
     }
     return Mdifficulty;
}

class Block {
  constructor({ data, nonce, prevHash, hash }) {
    this.data = data;
    this.nonce = nonce;
    this.prevHash = prevHash;
    this.hash = hash;
  }

  static genesis(){
    return new Block(GENESIS_DATA);
  } 

  static mineBlock = async (data, prevHash) => {

    let main = Date.now();
    let nonce = 0;
    let hash = cryptohash(prevHash, data, nonce);
    let difficulty = currentdiff();
    console.log("Started mining", data,difficulty);
    while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
      nonce++;
      hash = cryptohash(prevHash, data, nonce);
      await delay(10);
      prevHash = blockchain[blockchain.length - 1].hash;
      difficulty = currentdiff();
  }
  const block = new Block({ data, nonce, prevHash, hash });
  console.log(`block with data ${data} was mined after ${(Date.now()-main)/1000 }s. Nonce: ${nonce}. Difficulty: ${difficulty}`)
  //   console.log(block)
    blockchain.push(block);
  }

}

const blockchain = [];
blockchain.push(Block.genesis());
console.log('Genesis Block mined!');

let t=50
const mineNextBlock = async () => {
    
  const prevBlock = blockchain[blockchain.length - 1];
  const data = `Alice Paid bob $ ${t}`;
  Block.mineBlock(data, prevBlock.hash);
  t--;
  if(t!=0) await mineNextBlock();
};


mineNextBlock();

const executeRepeatedly = () => {
    // Perform your desired actions here
    if(blockchain.length==51){
        console.log(blockchain);
    }
    else setTimeout(executeRepeatedly, 100);
  };
  
executeRepeatedly();