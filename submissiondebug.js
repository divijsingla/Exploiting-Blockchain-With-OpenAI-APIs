let startTime=0;
let difficulty=2 + Math.floor(Math.random() * 4);
let t = 20;
const currentdiff = ()=>{
    if(Date.now() - startTime >=5000){
        difficulty=2 + Math.floor(Math.random() * 4);
        startTime=Date.now();
        console.log("Difficulty: "+difficulty);
    }
    return difficulty;
}

let blockchain=[];

const crypto = require('crypto');
const cryptohash=(...inputs)=>{
   const hash= crypto.createHash('sha256');
   hash.update(inputs.sort().join(''));
   return (hash.digest("hex"));
}

function printBlocks(){
    for(let i=0;i<=t;i++){
        console.log(blockchain[i]);
    }
}


class block{
   constructor({data,nonce,hash,prevHash}){
       this.data=data;
       this.nonce=nonce;
       this.hash=hash;
       this.prevHash=prevHash;
   }

    static genesis(){
        let data="Genesis Block";
        let nonce=0;
        let prevHash="00";
        let hash;
        do{
            hash=cryptohash(data, nonce,prevHash) //in no particular order, as we are sorting the inputs anyway
            nonce++;
       } while(hash.substring(0,5)!=='0'.repeat(5));

       return new block({hash,data,nonce,prevHash});
    }

    static mineBlock = async(data)=>{

        let nonce=0;
        let prevHash = blockchain[blockchain.length - 1]["hash"];
        let hash =cryptohash(data, nonce,prevHash);
        let difficulty = currentdiff();
        console.log("Started Mining block of data: "+data+" With Difficulty "+difficulty);
        while(hash.substring(0,currentdiff())!=='0'.repeat(currentdiff())){
            prevHash = blockchain[blockchain.length - 1]["hash"];
            hash =cryptohash(data, nonce,prevHash);
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve("Promise resolved after 10ms");
                }, 10);
            });
            nonce++;
        }
        console.log("Block Mined with data "+data+" at "+Math.floor(Date.now() / 1000));
        const newBlock = new block({data,nonce,hash,prevHash});
        blockchain.push(newBlock);
        if(blockchain.length == t+1){
            printBlocks();
        }
    }
}

async function runLoop(){
    blockchain.push(block.genesis());
    for(let i=t;i>0;i--){
        block.mineBlock("Alice Paid Bob $"+i);
    }
}

runLoop()