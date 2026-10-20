import type { Buffer } from "node:buffer";
import {
  ready,
  to_base64,
  to_hex,
} from "libsodium-wrappers-sumo";
import * as console from "node:console";
import path from "node:path";
import { calcKeyFromPassword, decryptFile, encryptFile, generateNewSalt } from "./CryptoTool";

interface IEncryptModuleResult {
  crypt: {
    data: Uint8Array;
    name: string;
  };
  nonce: {
    data: Uint8Array;
    name: string;
  };
  salt: {
    data: Uint8Array;
    name: string;
  };
}

export async function encryptModuleZipFile(f: Buffer, password: string, filename: string): Promise<IEncryptModuleResult> {
  await ready;

  const salt = await generateNewSalt();
  console.log("salt", salt.length);
  console.log("salt_hex", to_hex(salt));
  console.log("salt_base64", to_base64(salt));
  const key = await calcKeyFromPassword(password, salt);
  console.log("key", key.length);
  console.log("key_hex", to_hex(key));
  console.log("key_base64", to_base64(key));
  const { ciphertext, nonce } = await encryptFile(f, key);

  console.log("nonce", nonce.length);
  console.log("nonce_hex", to_hex(nonce));
  console.log("nonce_base64", to_base64(nonce));
  console.log("ciphertext", ciphertext.length);

  const R: IEncryptModuleResult = {
    crypt: {
      data: ciphertext,
      name: `${path.basename(filename)}.crypt`,
    },
    nonce: {
      data: nonce,
      name: `${path.basename(filename)}.nonce`,
    },
    salt: {
      data: salt,
      name: `${path.basename(filename)}.salt`,
    },
  } as IEncryptModuleResult;

  const decrypted = await decryptFile(
    R.crypt.data,
    await calcKeyFromPassword(password, R.salt.data),
    R.nonce.data,
  );
  console.log("decrypted", decrypted.length);
  console.log(isEqual(decrypted, f));

  return R;
}
function isEqual(array1: Uint8Array, array2: Uint8Array): boolean {
  return array1.length === array2.length ? array1.every((value, index) => value === array2[index]) : false;
}
