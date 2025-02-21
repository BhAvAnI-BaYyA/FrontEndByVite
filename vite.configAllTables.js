import { defineConfig, normalizePath, build } from 'vite';
import nunjucks from 'vite-plugin-nunjucks';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import path, { resolve } from 'path';
import { fileURLToPath } from 'url';

import { StartFunc as CreateFiles } from "./KCodeAllTables/CreateFiles/EntryFile.js";

import { StartFunc as StartFuncGetFiles } from "./KCodeAllTables/getFiles.js";
import { StartFunc as StartFuncGetVariables } from "./KCodeAllTables/generateVariables.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SrcTemplateHtmlsFolder = "src";
const SrcFolder = "srcAllTables";

const FrontEndDistFolder = "publicDir/bin";

const root = resolve(__dirname, SrcFolder);

CreateFiles({ inSrcPath: SrcFolder, inSrcTemplateHtmlsFolder: SrcTemplateHtmlsFolder });

let files = StartFuncGetFiles({ inSrcPath: SrcFolder });

build({
    configFile: false,
    build: {
        emptyOutDir: false,
        outDir: resolve(__dirname, `../../${FrontEndDistFolder}/assets/compiled/js`),
        lib: {
            name: 'app',
            formats: ['umd'],
            fileName: 'app',
            entry: './src/assets/js/app.js',
        },
        rollupOptions: {
            output: {
                entryFileNames: '[name].js'
            }
        }
    },
});

export default defineConfig((env) => ({
    publicDir: 'static',
    base: './',
    root,
    plugins: [
        viteStaticCopy({
            targets: [
                { src: normalizePath(resolve(__dirname, `./${SrcFolder}/assets/static`)), dest: "assets" }
            ],
            watch: {
                reloadPageOnChange: true
            }
        }),
        nunjucks({
            templatesDir: root,
            variables: StartFuncGetVariables({ mode: env.mode, inFilesArray: files }),
            nunjucksEnvironment: {
                filters: {
                    containString: (str, containStr) => {
                        if (!str.length) return false
                        return str.indexOf(containStr) >= 0
                    },
                    startsWith: (str, targetStr) => {
                        if (!str.length) return false
                        return str.startsWith(targetStr)
                    }
                }
            }
        })
    ],
    resolve: {
        alias: {
            '@': normalizePath(resolve(__dirname, 'src')),
            '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
            '~bootstrap-icons': resolve(__dirname, 'node_modules/bootstrap-icons'),
            '~perfect-scrollbar': resolve(__dirname, 'node_modules/perfect-scrollbar'),
            '~@fontsource': resolve(__dirname, 'node_modules/@fontsource'),
        }
    },
    build: {
        emptyOutDir: false,
        manifest: true,
        target: "chrome58",
        outDir: resolve(__dirname, FrontEndDistFolder),
        rollupOptions: {
            input: files,
            output: {
            }
        },
    }
}));