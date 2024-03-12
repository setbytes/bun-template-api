type EnvironmentData = {
  ENVIRONMENT?: string,
  PORT: number,
  MYSQL: {
    HOST: string,
    PORT: number,
    USERNAME: string,
    PASSWORD: string,
    DATABASE: string
  },
  INTERNAL_WEB: {
    CHECKOUT: string,
    REDIRECT_PAYMENT: string
    BANKING_WEBHOOK_LISTENER: string
    PAYMENT_WEBHOOK_LISTENER: string
  },
  SMTP: {
    HOST: string
    PORT: number
    SECURITY: boolean
    USERNAME: string
    PASSWORD: string
  },
  STRIPE: {
    PUBLIC_KEY: string
    SECRET_KEY: string
    WEBHOOK_SECRET: string
  }
}

type EnvironmentType = "production" | "development" | "test";

type Environment = Record<string, EnvironmentData>

const env: Environment = {
  production: {
    ENVIRONMENT: "production",
    PORT: 8090,
    MYSQL: {
      HOST: "mysql-template-prod",
      PORT: 3306,
      USERNAME: "template",
      PASSWORD: "@template_123",
      DATABASE: "template_prod"
    },
    INTERNAL_WEB: {
      CHECKOUT: "https://app.template.com/v1/checkout",
      REDIRECT_PAYMENT: "https://app.template.com/v1/redirect-payment",
      BANKING_WEBHOOK_LISTENER: "https://app.template.com/v1/bankings/listeners/:token",
      PAYMENT_WEBHOOK_LISTENER: "https://app.template.com/v1/payments/listeners"
    },
    SMTP: {
      HOST: "smtp.sendgrid.net",
      PORT: 465,
      SECURITY: true,
      USERNAME: "apikey",
      PASSWORD: ""
    },
    STRIPE: {
      PUBLIC_KEY: "",
      SECRET_KEY: "",
      WEBHOOK_SECRET: ""
    }
  },
  development: {
    ENVIRONMENT: "development",
    PORT: 8090,
    MYSQL: {
      HOST: "localhost",
      PORT: 3307,
      USERNAME: "template",
      PASSWORD: "@template_123",
      DATABASE: "template_dev"
    },
    INTERNAL_WEB: {
      CHECKOUT: "https://dev-app.template.com/v1/checkout",
      REDIRECT_PAYMENT: "https://dev-app.template.com/v1/redirect-payment",
      BANKING_WEBHOOK_LISTENER: "https://dev-app.template.com/v1/bankings/listeners/:token",
      PAYMENT_WEBHOOK_LISTENER: "https://dev-app.template.com/v1/payments/listeners"
    },
    SMTP: {
      HOST: "smtp.sendgrid.net",
      PORT: 465,
      SECURITY: true,
      USERNAME: "apikey",
      PASSWORD: ""
    },
    STRIPE: {
      PUBLIC_KEY: "",
      SECRET_KEY: "",
      WEBHOOK_SECRET: ""
    }
  }
};

export const environmentResolver: EnvironmentType = (process.env.NODE_ENV == "production" ? process.env.NODE_ENV : "development") as EnvironmentType;
console.log("Environment(Server): %s", environmentResolver);
export const environment = env[environmentResolver];
