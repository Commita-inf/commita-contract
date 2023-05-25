"use client";

import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePadCompoenent = ({ setSigntureUrl }: any) => {
  const [sign, setSign] = useState<any>();
  const [url, setUrl] = useState<string>();

  const handleClear = () => {
    sign && sign.clear();
    setUrl("");
    setSigntureUrl("");
  };
  const handleGenerate = () => {
    setUrl(sign.getTrimmedCanvas().toDataURL("image/png"));
    setSigntureUrl(
      sign
        .getTrimmedCanvas()
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
    );
  };

  return (
    <div className="flex flex-col justify-center gap-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start justify-between">
        <div className="flex flex-col col-span-1 gap-2 border border-black w-full">
          <SignatureCanvas
            canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
            ref={(data) => setSign(data)}
            penColor="blue"
          />
        </div>
        <div className="col-span-1 flex items-center justify-center w-full h-full">
          <img
            src={url ? url : "/commita-logo-white.jpeg"}
            className="object-contoain h-[60px] text-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleClear}
          className="inline-flex items-center justify-center w-32 h-12 text-sm font-medium text-center text-red-500 border border-red-500 rounded-xl hover:bg-gray-200  dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800 shadow-md shadow-gray-400 active:translate-y-1"
        >
          Effacer
        </button>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center justify-center w-32 h-12 text-sm font-medium text-center text-amber-500 border border-amber-500 rounded-xl hover:bg-gray-200  dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800 shadow-md shadow-gray-400 active:translate-y-1"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default SignaturePadCompoenent;
