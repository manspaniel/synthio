import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export default function () {
  yargs(hideBin(process.argv))
    .command(
      "dev",
      "start the dev server",
      (yargs) => {
        return yargs
          .option("port", {
            alias: "p",
            type: "number",
            default: 1597,
          })
          .option("host", {
            type: "string",
          });
      },
      async (argv) => {
        const createDevServer = (await import("./dev-server.js")).default;
        createDevServer({
          root: process.cwd(),
          port: argv.port,
          host: argv.host!,
        });
      }
    )
    .command(
      "build",
      "build the project",
      (yargs) => {},
      (argv) => {
        console.log("Building");
      }
    )
    .parseAsync();
}
