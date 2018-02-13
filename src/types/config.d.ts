declare module 'config' {
  type Config = {
    PORT: number;
    MONGODB_URL: string;
    VERBOSE_LOGGING: boolean;
    SECURITY: {
      SALT_LENGTH: number;
      ITERATIONS: number;
      PASSWORD_LENGTH: number;
    };
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USERNAME: string;
    SMTP_PASSWORD: string;
    EMAIL_SENDER_ADDRESS: string;
    RESET_PASSWORD_EXPIRATION: string;
  };
  var c: Config;
  export = c;
}
