const isDevelopment: boolean = process.env.DEVELOPMENT === "true";

const Environment = {
    port: Number(process.env.PORT) || 4000,
    isDevelopment,
    isProduction: !isDevelopment,
    seqUname:process.env.SEQ_UNAME || "postgres",
    seqPass:process.env.SEQ_PASS || "postgres",
    database:process.env.DB_NAME || "crownstacktest",
    jwt: {
        secret: process.env.JWT_SECRET || "0abc921!z5ef0552c-07e5dfd8-440gh23x96bpo"
    },
    roles: ['Admin', 'User'],
};

export { Environment };
