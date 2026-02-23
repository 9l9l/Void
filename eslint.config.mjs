import { defineConfig } from "eslint/config";
import header from "eslint-plugin-simple-header";
import tseslint from "typescript-eslint";

export default defineConfig(
    { ignores: ["dist", "node_modules"] },
    {
        files: ["src/**/*.{tsx,ts,mts,mjs,js,jsx}"],
        plugins: {
            "simple-header": header,
        },
        languageOptions: {
            parser: tseslint.parser,
        },
        rules: {
            "simple-header/header": [
                "error",
                {
                    "files": [`${import.meta.dirname}/scripts/header.txt`],
                    "templates": { "author": [".*", "Void contributors"] },
                },
            ],
        },
    },
);
