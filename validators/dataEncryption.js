import CryptoJS from "crypto-js";
import { CRYPTO_KEY } from "../config/environmentVariables.js";
export const encryptAES = (data) => {
  if (data) {
    return CryptoJS.AES.encrypt(data, CRYPTO_KEY).toString();
  }
  return data;
};
export const decryptionAES = (data) => {
  if (data) {
    let bytes = CryptoJS.AES.decrypt(data, CRYPTO_KEY);
    let decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (decryptedText) {
      return decryptedText;
    } else {
      return '';
    }
  }
  return data;
};
