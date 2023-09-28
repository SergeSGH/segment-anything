// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext } from "react";
import * as _ from "underscore";
import Tool from "./Tool";
import { modelInputProps } from "./helpers/Interfaces";
import AppContext from "./hooks/createContext";
//import { useOpenCv } from 'opencv-react';

const Stage = () => {
  //let { loaded, cv } = useOpenCv();
  const {
    clicks: [clicks, setClicks],
    image: [image],
    maskImg: [, setMaskImg],
  } = useContext(AppContext)!;

  const getClick = (x: number, y: number, clickType: number): modelInputProps => {
    // const clickType = 1;
    return { x, y, clickType };
  };

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  const handleMouseMove = _.throttle((e: any) => {
    let el = e.nativeEvent.target;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const imageScale = image ? image.width / el.offsetWidth : 1;
    x *= imageScale;
    y *= imageScale;
    const click = getClick(x, y, 1);
    if (click) setClicks([click]);
  }, 15);

  const handleMouseClick = (e: any) => {
    e.preventDefault();
    let el = e.nativeEvent.target;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const imageScale = image ? image.width / el.offsetWidth : 1;
    x *= imageScale;
    y *= imageScale;
    let click;
    if (e.ctrlKey) 
      click = getClick(x, y, 2);  
    else
      click = getClick(x, y, 1);
    if (click) 
      if (clicks)
        setClicks([...clicks, click]);
      else
        setClicks([click]);
        document.getElementById('clear_masks')?.classList.remove('disabled');
        document.getElementById('get_polygons')?.classList.remove('disabled');
  };

  function clearMasks() {
    setClicks(null);
    setMaskImg(null)
    document.getElementById('clear_masks')?.classList.add('disabled');
    document.getElementById('get_polygons')?.classList.add('disabled');
  }

  document.getElementById('clear_masks')?.addEventListener('click', clearMasks);


  //function getPolygons() {
    // const script = document.createElement('script');
    // script.src = 'https://docs.opencv.org/master/opencv.js';
    // script.async = true;
    // script.onload = generatePolygons;
    // document.body.appendChild(script);

    // const inputImage = document.getElementById('maskImage');

    // const src = cv.imread(inputImage);
    // console.log('прочитали изображение CV');
    

    //console.log('высота', inputImage.height, 'ширина', inputImage.width);
    // const gray = new cv.Mat();
    // cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    // cv.threshold(gray, gray, 128, 255, cv.THRESH_BINARY);

    // // Создайте пустой массив для контуров
    // const contours = new cv.MatVector();

    // // Найдите контуры
    // cv.findContours(gray, contours, new cv.Mat(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // // Теперь contours содержит найденные контуры

    // // Освободите ресурсы
    // src.delete();
    // gray.delete();
    // contours.delete();
  //}

  //document.getElementById('get_polygons')?.addEventListener('click', getPolygons);

  const flexCenterClasses = "flex items-center justify-center";
  return (
    <div className={`${flexCenterClasses} w-full h-full`} style={{ flexDirection: 'column' }}>
      <div className={`${flexCenterClasses} relative w-[90%] h-[90%]`}>
        <Tool handleMouseClick={handleMouseClick} />
      </div>
        <button id="clear_masks" className="button">Очистить маски</button>
    </div>
  );
};

export default Stage;
