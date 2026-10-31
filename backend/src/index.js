import { bootstrap } from "./app.bootstrap.js";

bootstrap().catch((e) => {
    console.log(e)
    process.exit(1)
})