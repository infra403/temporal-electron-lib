# 1. Install Dependencies
```sh
yarn install
```

# 2. Start the Program
The program starts up without issues

```sh
npm run start
```

# 3. Package the Program
```shell
npm run make
```

There will be numerous errors; you can see the details by executing the command."

```shell
WARNING in ./node_modules/@swc/core/binding.js 100:40-77
Module not found: Error: Can't resolve '@swc/core-win32-arm64-msvc' in 'my-new-app/node_modules/@swc/core'
 @ ./node_modules/@swc/core/index.js 62:104-124
 @ ./node_modules/terser-webpack-plugin/dist/utils.js 487:14-34
 @ ./node_modules/terser-webpack-plugin/dist/index.js 14:4-22
 @ ./node_modules/webpack/lib/config/defaults.js 1338:25-57
 @ ./node_modules/webpack/lib/index.js 345:10-66
 @ ./node_modules/@temporalio/worker/lib/workflow/bundler.js 36:18-36
 @ ./node_modules/@temporalio/worker/lib/index.js 62:16-45
 @ ./src/worker.ts 33:17-46
 @ ./src/index.ts 4:17-36
```

