import * as shell from "shelljs";
shell.cp("./pm2.config.json", "./dist/pm2.config.json");
shell.cp("-R", "./src/assets", "./dist/src");
shell.cp("-R", "package.json", "./dist/package.json");
shell.cp("tsconfig*.json", "./dist");
shell.rm("-R", "./dist/test");
