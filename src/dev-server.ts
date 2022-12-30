import path, { join } from "path";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";

type Options = {
  root: string;
  host: string;
  port: number;
};

export default async function createDevServer(opts: Options) {
  const server = await createServer({
    mode: "development",
    root: opts.root,
    server: {
      host: opts.host,
      port: opts.port,
    },
    plugins: [react()],
  });
  await server.listen();

  server.printUrls();
}
