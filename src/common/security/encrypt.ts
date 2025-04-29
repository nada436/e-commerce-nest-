import * as CryptoJS from 'crypto-js';

export const Encrypt = (
  text: string,
  secret_key = process.env.secret_key,
): string => {
  return CryptoJS.AES.encrypt(text, secret_key).toString();
};

export const Decrypt = (
  ciphertext: string,
  secret_key = process.env.secret_key,
): string => {
  return CryptoJS.AES.decrypt(ciphertext, secret_key).toString(
    CryptoJS.enc.Utf8,
  );
};
