var CryptoJS = require("crypto-js");
const CRYPTO_KEY = process.env.CRYPTO_SECRET;
 const encryptAES = (data) =>{
    if(data){
       return CryptoJS.AES.encrypt(data,CRYPTO_KEY).toString();
    }
    return data
}
const decryptionAES = (data) =>{
    if(data){
        let bytes  = CryptoJS.AES.decrypt(data, CRYPTO_KEY);
        let decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if(decryptedText){
            return decryptedText
        }else{
            return '';
        }
    }
    return data
}
module.exports = { encryptAES , decryptionAES};