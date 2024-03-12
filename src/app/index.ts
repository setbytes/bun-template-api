import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { CorsMiddleware } from "@/app/middlewares/CorsMiddleware";
import { SwaggerAuthMiddleware } from "@/app/middlewares/SwaggerAuthMiddleware";
import { environment } from "@/infra/configs/environment";
import { AccountControllerAdapter } from "@/app/adapters/AccountControllerAdapter";
import { AuthenticationControllerAdapter } from "@/app/adapters/AuthenticationControllerAdapter";
import { WebStaticControllerAdapter } from "@/app/adapters/WebStaticControllerAdapter";
import { ProductControllerAdapter } from "@/app/adapters/ProductControllerAdapter";
import { SubscriptionControllerAdapter } from "@/app/adapters/SubscriptionControllerAdapter";
import { PaymentListenerControllerAdapter } from "@/app/adapters/PaymentListenerControllerAdapter";

const app = express();

// middleware
app.use(cookieParser());
app.use(cors(CorsMiddleware.apply));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, SwaggerAuthMiddleware.apply());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../presentation/pages"));

// controllers
AuthenticationControllerAdapter.add(app);
AccountControllerAdapter.add(app);
WebStaticControllerAdapter.add(app);
PaymentListenerControllerAdapter.add(app);
ProductControllerAdapter.add(app);
SubscriptionControllerAdapter.add(app);

app.use("/public", express.static(path.join(__dirname, "../presentation/public")));
app.get("/v1/health", (request, response) => response.status(200).json({ message: "ok" }));

// exports
app.listen(environment.PORT, () => console.log("SERVER START PORT:", environment.PORT));
