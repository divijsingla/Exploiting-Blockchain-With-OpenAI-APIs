const crypto = require('crypto');
const cryptohash=(...inputs)=>{
    const hash= crypto.createHash('sha256') 
    hash.update(inputs.sort().join('')) 
    return (hash.digest("hex"))
} 

class block{
    constructor({hash,data,nonce}){
        this.data=data
        this.hash=hash
        this.nonce=nonce
    }

    static mineBlock({data}){
        let difficulty=5
        let nonce =0;
        let hash;
        do{
            hash=cryptohash(data,nonce) //in no particular order as we are sorting the inputs anyway
            nonce++;
        } while(hash.substring(0,difficulty)!=='0'.repeat(difficulty));

        return new block({
            data:data,
            hash:hash, 
            nonce:nonce-1,
        })

    }
}

let t =10;
while(t--){
    const newBlock=block.mineBlock({data:`Alice Paid Bob $${t}`})
    console.log(newBlock)
}



