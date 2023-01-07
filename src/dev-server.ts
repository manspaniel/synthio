import path, { join } from "path";
import { createServer as createViteServer, Plugin } from "vite";
import express from "express";
import react from "@vitejs/plugin-react";
import { globby } from "globby";

type Options = {
  root: string;
  host: string;
  port: number;
};

const BASE_INDEX = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>synthio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="_entry.tsx"></script>
  </body>
</html>
`;

export default async function createDevServer(opts: Options) {
  const app = express();

  const mainFileLookup = await globby(
    path.resolve(opts.root, "src/main.{tsx,ts,js,jsx}")
  );
  const mainFile = mainFileLookup[0];

  if (!mainFile) {
    throw new Error(
      "Couldn't find a main.{js,jsx,ts,tsx} file in the src directory."
    );
  }

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: opts.root,
    resolve: {
      alias: {
        _main: mainFile,
      },
    },
    plugins: [react(), glslPlugin(), entryPlugin()],
  });

  app.use(vite.middlewares);

  app.use("/", async (req, res) => {
    const html = await vite.transformIndexHtml("/", BASE_INDEX);

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  });
  // const server = await createServer({
  //   mode: "development",
  //   root: opts.root,
  //   server: {
  //     host: opts.host,
  //     port: opts.port,
  //   },
  //   plugins: [react()],
  // });
  // await server.listen();

  // server.printUrls();

  app.listen(opts.port, opts.host, () => {
    console.log(
      `Server running at http://${opts.host ?? "127.0.0.1"}:${opts.port}`
    );
  });
}

function glslPlugin(): Plugin {
  return {
    name: "synthio-glsl",
    transform(code, id, options) {
      if (id.match(/.(glsl|vert|frag)$/i)) {
        let imports: string[] = [];
        code = code.replace(/#include <?(.+)>?/g, (_, p1) => {
          const name = "$" + imports.length;
          imports.push(`import ${name} from './${p1}'`);
          return "${" + name + "}";
        });
        const output = imports.join("\n") + `\nexport default \`${code}\``;
        return output;
      }
    },
  };
}

function entryPlugin(): Plugin {
  return {
    name: "synthio-entry",
    resolveId(id) {
      if (id === "/_entry.tsx") {
        return "\0SYNTHIO_ENTRY";
      }
    },
    load(id) {
      if (id === "\0SYNTHIO_ENTRY") {
        return `
          import start from 'synthio/dist/client-entry'
          start();
        `;
      }
    },
  };
}
