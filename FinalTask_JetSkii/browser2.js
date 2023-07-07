const anchor = require('@project-serum/anchor');
const web3 = require('@solana/web3.js');

// Constants for Solana Devnet
const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
const programId = new web3.PublicKey('GQ3B4PizWaDMFq85wyfPTMniABeddyH9KWMfbGmRNzj4');
const payerSecretKey = web3.Keypair.fromSecretKey(new Uint8Array(['65kh723E846GCFSwB3BHG9KN88Jwk8dTPN7PeHrgYrJcHnevMWWyWQ6Cw98RALTB4sskeTeYjs73Rcnz7Vto62vv']));

// Function to transfer the NFT
async function transferNFT(sellerWallet, buyerWallet, nftTokenAccount) {
  const provider = anchor.Provider.local(connection);
  const program = new anchor.Program(YOUR_PROGRAM_ID, programId, provider);

  // Load the seller's wallet
  const seller = new web3.Account(sellerWallet.secretKey);
  
  // Fetch the buyer's wallet using Solana Phantom or any other provider
  const buyer = await web3.PublicKey.findProgramAddress([Buffer.from('nft-transfer')], programId);

  // Create the transaction instructions
  const tx = new web3.Transaction();
  tx.add(
    anchor.web3.SystemProgram.transfer({
      fromPubkey: seller.publicKey,
      toPubkey: buyer.publicKey,
      lamports: web3.LAMPORTS_PER_SOL * 0.001, // Specify the desired amount to transfer
    })
  );

  // Specify the accounts involved in the transaction
  tx.feePayer = payerSecretKey.publicKey;
  tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

  // Sign and send the transaction
  tx.partialSign(seller);
  const signedTx = await connection.sendTransaction(tx, [seller]);

  console.log(`Transaction sent: ${signedTx}`);

  // Wait for the transaction confirmation
  await connection.confirmTransaction(signedTx);
  console.log(`Transaction confirmed: ${signedTx}`);
}

// Usage example
const sellerWallet = web3.Keypair.generate(); // Replace with the seller's wallet
const buyerWallet = web3.Keypair.generate(); // Replace with the buyer's wallet
const nftTokenAccount = 'BDw3FYFK3SWU766tqoVtNFqZss6eTksAPuW5wRJRbsBg'; // Replace with the NFT token account address

transferNFT(sellerWallet, buyerWallet, nftTokenAccount)
  .then(() => console.log('NFT transfer successful.'))
  .catch((error) => console.error('NFT transfer error:', error));
