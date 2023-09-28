// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import * as React from "react";
import { createRoot } from "react-dom/client";
import AppContextProvider from "./components/hooks/context";
import App from "./App";
import 'bulma/css/bulma.css';
//import { OpenCvProvider } from 'opencv-react';

// const express = require('express');
// const path = require('path');

// const app = express();

// // Указываем Express использовать статические файлы из корневой директории
// app.use(express.static(path.join(__dirname, 'public')));



const container = document.getElementById("root");
const root = createRoot(container!);
// root.render(
//   <AppContextProvider>
//     <OpenCvProvider>
//       <App/>
//     </OpenCvProvider>
//   </AppContextProvider>
// );
root.render(
  <AppContextProvider>
    <App/>
  </AppContextProvider>
);
