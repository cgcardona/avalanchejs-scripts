import createHash from 'create-hash';
import { SHA3 } from 'sha3';
import { Keccak } from 'sha3';

const main = async (): Promise<any> => {
  const sha224: string = createHash('sha224').update('hello').digest('hex')
  console.log(`SHA-224: ${sha224}`)

  const sha256: string = createHash('sha256').update('hello').digest('hex')
  console.log(`SHA-256: ${sha256}`)

  const sha3_224: string = new SHA3(224).update('hello').digest('hex');
  console.log(`SHA3-224: ${sha3_224}`)

  const sha3_384: string = new SHA3(384).update('hello').digest('hex');
  console.log(`SHA3-384: ${sha3_384}`)

  const keccak_384: string = new Keccak(384).update('hello').digest('hex');
  console.log(`Keccak-384: ${keccak_384}`)
}
  
main()