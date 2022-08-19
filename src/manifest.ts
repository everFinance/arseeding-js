
import {Manifest} from "./types";
import {promises, readFileSync} from "fs";
import p from "path";

export const generateManifest =  (config: { items: Map<string, string>, indexFile?: string }): Manifest => {
    const { items, indexFile } = config
    const manifest:Manifest = {
        manifest: "arweave/paths",
        version: "0.1.0",
        paths: {}
    }
    if (indexFile && items.has(indexFile)) {
        manifest["index"] = { path: indexFile }
    } else if(items.has("index.html")) {
        manifest["index"] = { path: "index.html"}
    }
    for (const [k, v] of items.entries()) {
        manifest.paths[k] = { id: v }
    }
    return manifest
}

export async function* walkpath(dir: string) :any {
    for await (const d of await promises.opendir(dir)) {
        const entry = p.join(dir, d.name);
        if (d.isDirectory()) yield* await walkpath(entry);
        else if (d.isFile()) yield entry;
    }
}

export async function checkPaths(path:string) {
    const files = []
    for await (const f of walkpath(path)) {
        files.push(f)
    }
    return files;
}

