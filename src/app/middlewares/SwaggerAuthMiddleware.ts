import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export class SwaggerAuthMiddleware {
  public static apply(): any {
    const options = {
      definition: {
        openapi: "3.1.0",
        info: {
          title: "Setbytes",
          version: "1.0.0",
          description: ""
        }
      },
      apis: ["./src/app/adapters/**/*.ts"]
    };
    const swaggerSpec = swaggerJSDoc(options);
    return swaggerUi.setup(swaggerSpec);
  }
}
