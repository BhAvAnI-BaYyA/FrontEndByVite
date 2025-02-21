import fs from 'fs'
import { resolve } from 'path'

const StartFunc = () => {
    const root = "src/HtmlFiles";
    let files = {}

    fs.readdirSync(root)
        .filter(filename => filename.endsWith('.html'))
        .forEach(filename => {
            let LoopInsideKeyName = filename.slice(0, -5);
            files[LoopInsideKeyName] = resolve(root, filename)
        });

    return files;
};

export { StartFunc };