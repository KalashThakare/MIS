import { Sequelize } from "sequelize";
import { env } from "./env";
import { logger } from "../shared/logger/pino";

const sequelize = new Sequelize(env.database.db_uri, {
    dialect: "postgres",
    protocol: "postgres",
    logging: env.nodeEnv === "development" ? console.log : false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
    },
});

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        logger.info("Database connected successfully.");
    } catch (error) {
        logger.error( {error },"Unable to connect Database:");
        process.exit(1);
    }
};

export default sequelize;