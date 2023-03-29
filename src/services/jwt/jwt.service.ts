import jwt from "jsonwebtoken";
import crypto, { randomBytes } from "crypto";

import IService from "../../interfaces/IService";
import IJwtService from "./interfaces/IJwtService";

const secret = "secretkye123";

const algorithm = "aes-256-cbc";
const key = randomBytes(32);
const iv = randomBytes(16);

const SERVER_ERROR = {
  accepted: false,
  error: { status: 500, message: "Server Error" },
};

const INVALID_REFRESH = {
  accepted: false,
  error: {
    status: 403,
    message: "You are logged out due to security reasons. Please login again",
  },
};

const INVALID_TOKEN = {
  accepted: false,
  error: {
    status: 403,
    message: "Session expired. Please login again",
  },
};

export default class JwtService implements IJwtService {
  async sign(
    payload: Record<string, any>,
    refreshPayload: Record<string, any>
  ): IService<{ token: string; refresh: string }> {
    try {
      const token = jwt.sign(payload, secret, { expiresIn: "1h" });
      const enhancedRefreshPayload = { ...refreshPayload, token };

      const refresh = this.encrypt(
        jwt.sign(enhancedRefreshPayload, secret, { expiresIn: "14 days" })
      );

      return { accepted: true, data: { token, refresh } };
    } catch (err) {
      return SERVER_ERROR;
    }
  }
  async refresh(
    token: string,
    refresh: string
  ): IService<{ token: string; refresh: string }> {
    try {
      const decryptedRefresh = this.decrypt(refresh);
      const verifyRefresh = await this.verify(decryptedRefresh);
      if (!verifyRefresh.accepted) return INVALID_REFRESH;

      const refreshPayload = verifyRefresh.data!;
      if (refreshPayload.token !== token) return INVALID_REFRESH;

      const tokenPayload = jwt.decode(token) as Record<string, any>;
      return this.sign(tokenPayload, refreshPayload);
    } catch (err) {
      return SERVER_ERROR;
    }
  }
  async verify(token: string): IService<Record<string, any>> {
    try {
      const tokenPayload = jwt.verify(token, secret) as Record<string, any>;
      if (!tokenPayload) return INVALID_TOKEN;

      return { accepted: true, data: tokenPayload };
    } catch (err) {
      return INVALID_TOKEN;
    }
  }

  private encrypt(text: string): string {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString("hex");
  }

  private decrypt(text: string): string {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

    const buffer = Buffer.from(text, "hex");
    const decrypted = Buffer.concat([
      decipher.update(buffer),
      decipher.final(),
    ]);

    return decrypted.toString();
  }
}
