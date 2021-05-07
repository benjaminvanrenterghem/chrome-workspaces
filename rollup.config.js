import typescript from "@rollup/plugin-typescript"

export default {
    input: "src/background/serviceWorker.ts",
    output: {
      file: "src/serviceWorker.js",
      format: "cjs"
    },
    plugins: [
      typescript()
    ]
  };