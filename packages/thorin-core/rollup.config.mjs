import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/bundle.js",
            format: "esm",
            sourcemap: true,
        },
    ],
    plugins: [
        nodeResolve(),
        typescript(),
        copy({
            targets: [{ src: "src/style.css", dest: "dist" }],
        }),
    ],
};
