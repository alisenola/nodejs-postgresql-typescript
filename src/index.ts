import path from "path";
import dotenv from "dotenv";

const envSuffix = process.env.NODE_ENV ? "." + process.env.NODE_ENV : "";
const envName = `../.env${envSuffix}`;
const envPath = path.join(__dirname, envName);

dotenv.config({ path: envPath });

import App from "./app/App";
import Postgresql from "./connection/database/Postgresql";

new Postgresql()
    .connect(
        process.env.DATABASE_USER!,
        process.env.DATABASE_PASS!,
        process.env.DATABASE_HOST!,
        process.env.DATABASE_DB!,
        +process.env.DATABASE_PORT!
    )
    .then(result => {
        if (!result.result) {
            console.log('database connect failed');
            return;
        }

        const app = new App(result.connection!);
        const port = +process.env.PORT!;
        
        app.start(port);
    })