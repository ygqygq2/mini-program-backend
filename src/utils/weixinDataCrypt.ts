import { createDecipheriv } from "crypto";

function WXBizDataCrypt(appId: string, sessionKey: string) {
  this.appId = appId;
  this.sessionKey = sessionKey;
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  const sessionKey = new Buffer.from(this.sessionKey, "base64");
  encryptedData = new Buffer.from(encryptedData, "base64");
  iv = new Buffer.from(iv, "base64");

  try {
    // 解密
    const decipher = createDecipheriv("aes-128-cbc", sessionKey, iv);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    // 问题是cipher.update(data, 'binary')输出一个缓冲区，该缓冲区自动字符串化为十六进制编码的字符串
    const decoded = decipher.update(encryptedData, "binary", "utf8");
    // 这里有一个错误发生：
    // error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt
    // 本质是由于sessionKey与code不匹配造成的
    decoded += decipher.final("utf8");
    decoded = JSON.parse(decoded);
  } catch (err) {
    console.log("err", err);
    throw new Error("Illegal Buffer");
  }

  if (decoded.watermark.appid !== this.appId) {
    throw new Error("Illegal Buffer");
  }

  return decoded;
};

export default WXBizDataCrypt;
