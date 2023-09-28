// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext, useEffect, useState, useRef } from "react";
import AppContext from "./hooks/createContext";
import { ToolProps } from "./helpers/Interfaces";
import * as _ from "underscore";


const ClicksCanvas = () => {
  const {
    clicks: [clicks],
    image: [image],
  } = useContext(AppContext)!;
  
  const [shouldFitToWidth, setShouldFitToWidth] = useState(true);
  const bodyEl = document.body;
  const fitToPage = () => {
    if (!image) return;
    const imageAspectRatio = image.width / image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    // setShouldFitToWidth(imageAspectRatio > screenAspectRatio);
    setShouldFitToWidth(false);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [image]);


  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        if (clicks) {
          for (let i = 0; i < clicks.length; i++) {
            if (clicks[i].clickType === 1)
              ctx.fillStyle = "blue";
            else if (clicks[i].clickType === 2)
              ctx.fillStyle = "red";
            const pointSize = 4;
            ctx.beginPath();
            ctx.arc(clicks[i].x, clicks[i].y, pointSize / 2, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
          }
        } else {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      
    }
    
  }, [clicks]) 

  const clicksCanvasClasses = `absolute opacity-40 pointer-events-none`;

  return (
    <canvas
      id='clicksCanvas'
      height={image?.height}
      width={image?.width}
      ref={canvasRef}
      className={`${
        shouldFitToWidth ? "w-full" : "h-full"
      } ${clicksCanvasClasses}`}
    ></canvas>
  )
}


const Tool = ({ handleMouseClick }: ToolProps) => {
  const {
    clicks: [clicks],
    image: [image],
    maskImg: [maskImg, setMaskImg],
  } = useContext(AppContext)!;

  // Determine if we should shrink or grow the images to match the
  // width or the height of the page and setup a ResizeObserver to
  // monitor changes in the size of the page
  const [shouldFitToWidth, setShouldFitToWidth] = useState(true);
  const bodyEl = document.body;
  const fitToPage = () => {
    if (!image) return;
    const imageAspectRatio = image.width / image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    // setShouldFitToWidth(imageAspectRatio > screenAspectRatio);
    setShouldFitToWidth(false);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });
  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [image]);

  const imageClasses = "";
  const maskImageClasses = `absolute opacity-40 pointer-events-none`;

  // Render the image and the predicted mask image on top
  return (
    <>
      {image && (
        <img
          onClick={handleMouseClick}
          src={image.src}
          className={`${
            shouldFitToWidth ? "w-full" : "h-full"
          } ${imageClasses}`}
        ></img>
      )}
      {maskImg && (
        <img
          id='maskImage'
          src={maskImg.src}
          className={`${
            shouldFitToWidth ? "w-full" : "h-full"
          } ${maskImageClasses}`}
        ></img>
      )}
      <ClicksCanvas />
    </>
  );
};

export default Tool;
