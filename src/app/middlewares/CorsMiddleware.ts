import { CorsOptions } from "cors";

export class CorsMiddleware {
  public static apply(request: any, callback: (error: Error | null, cors: CorsOptions) => void): any {
    const allowlist = ["*"];

    const corsOptions: CorsOptions = {
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "Access-Control-Request-Headers"],
      credentials: true
    };
    if (allowlist.some(item => String(request.header("Origin")).includes(item)) || allowlist.includes("*")) {
      corsOptions.origin = true;
    }
    callback(null, corsOptions);
  }
}
