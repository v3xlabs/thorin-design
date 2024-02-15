import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/bundle.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        nodeResolve(),
        commonjs(),
        typescript(),
        copy({
            targets: [{ src: 'src/style.css', dest: 'dist' }],
        }),
    ],
};
