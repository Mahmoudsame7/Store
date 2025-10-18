This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Advanced error UI (toasts/retry).

- To check this try login with invalid credentials (Applied across all app components)

## Dark mode / complex theming.

- Toggle dark mode from profile screen

##  Specific category

- The products screen have all categories you can filter products by choosing specific category 

##  Admin user

User: admin@store.com
Password: any text

## Trade-offs and “if I had more time.”

- Fix installing react-native-mmkv it takes me two days to try installing it on different react native versions and switching between between old and new architecture and browsing issues on library on github but unfortunately it didn't work , I used react-native-async-storage to persist data local.

- Apply more ui and file architecture enchancements




