import React, { useEffect, useState } from "react";

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>();
  const [fileType, setFileType] = useState<string>("");
  const [buffer, setBuffer] = useState<Uint8Array | null>(null);

  const displayResult = () => {
    if (!buffer) return <></>;
    let currBuffer: Uint8Array = buffer as Uint8Array;

    const uint8ToHex = (i: number): string => {
      const lowerBits = i & 0x0f;
      const higherBits = (i & 0xf0) >> 4;
      const convert = (base10: number) => base10.toString(16);
      return `${convert(higherBits)}${convert(lowerBits)}`;
    };

    const NUM_COLS_HEX = 8;
    const NUM_COLS_ASCII = NUM_COLS_HEX * 2; // bc 1 col for hex is actually 2 hex digits = 1 byte = 1 ascii

    const rawAscii: string = new TextDecoder().decode(currBuffer);
    let hexStr: string = "";
    let asciiStr: string = "";
    let counterHex: number = 0;
    let counterAscii: number = 0;
    let newHex: string;
    let newAscii: string;

    for (let i = 0; i < currBuffer.length; i++) {
      counterHex++;
      counterAscii++;
      newHex = uint8ToHex(currBuffer[i]);
      newAscii = rawAscii[i];
      if (counterHex < NUM_COLS_HEX) {
        hexStr = hexStr + newHex + " ";
      } else {
        counterHex = 0;
        hexStr = hexStr + newHex + "\n";
      }

      if (counterAscii < NUM_COLS_ASCII) {
        if (counterAscii < NUM_COLS_ASCII) {
          asciiStr = asciiStr + newAscii;
        }
      } else {
        counterAscii = 0;
        asciiStr = asciiStr + newAscii + "\n";
      }
    }

    const exportStrAsDownload = (s: string, fileName: string) => {
      const blob = new Blob([s], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = fileName;
      link.href = url;
      link.click();
    };
    const hexDownload = () =>
      exportStrAsDownload(hexStr, `${file?.name}-hexDump.txt`);
    const asciiDownload = () =>
      exportStrAsDownload(asciiStr, `${file?.name}-asciiDump.txt`);

    return (
      <div>
        <h1 className="flex justify-center text-lg font-mono py-5">
          Image length in bytes: {currBuffer.length}
        </h1>
        <div className="grid grid-cols-2 mx-auto px-5">
          <div className="flex flex-col justify-center">
            <h1 className="text-center text-2xl font-bold font-mono">Hex</h1>
            <button
              className="bg-blue-400 hover:bg-blue-500 rounded p-5 m-3 font-sans"
              onClick={hexDownload}
            >
              Download Hex (.txt)
            </button>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-center text-2xl font-bold font-mono">Ascii</h1>
            <button
              className="bg-blue-400 hover:bg-blue-500 rounded p-5 m-3 font-sans"
              onClick={asciiDownload}
            >
              Download Ascii (.txt)
            </button>
          </div>
          <div
            id="hex"
            className="text-center font-mono bg-slate-300 whitespace-pre-wrap rounded-xl mx-2"
          >
            {hexStr}
          </div>
          <div
            id="ascii"
            className="text-center font-mono bg-slate-400 whitespace-pre-wrap rounded-xl mx-2"
          >
            {asciiStr}
          </div>
        </div>
      </div>
    );
  };

  const saveInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      // Update file state
      const file = files[0];
      setFile(file);

      // Update filetype state
      if (file.type.startsWith("image/")) {
        setFileType("image");
      } else if (file.type.startsWith("application/pdf")) {
        setFileType("pdf");
      } else if (file.type.startsWith("application/octet-stream")) {
        setFileType("binary");
      } else if (file.type.startsWith("text/")) {
        setFileType("text");
      } else {
        setFileType("unknown");
      }
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      return;
    }

    setIsSubmitting(true);
  };

  const clear = () => {
    setFile(null);
    setFileType("");
    setBuffer(null);
  };

  useEffect(() => {
    if (isSubmitting) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const buffer = fileReader.result as ArrayBuffer;
        setBuffer(new Uint8Array(buffer));
        setIsSubmitting(false);
      };

      fileReader.readAsArrayBuffer(file as Blob);
    }
  }, [file, isSubmitting]);

  return (
    <>
      <h1 className="flex justify-center text-5xl font-bold underline p-5">
        Submit a file to see its byte values as hex and ascii
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <input
            type="file"
            onChange={saveInput}
            required={true}
            className="bg-gray-500 rounded block p-3 m-3"
          ></input>
        </div>

        <div className="flex justify-center mx-auto gap-2">
          <button
            id="submit"
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 text-bold rounded hover:bg-green-600 p-3"
          >
            {isSubmitting ? "Running in your browser..." : "Submit"}
          </button>
          <button
            id="clear"
            type="reset"
            onClick={clear}
            className="bg-red-500 hover:bg-red-600 text-bold rounded p-3"
          >
            Clear
          </button>
        </div>
      </form>
      {fileType === "image" && (
        <div className="flex flex-col justify-center w-1/5 h-1/5 mx-auto py-3">
          <h1 className="font-sans">Image uploaded:</h1>
          <img alt="img" src={URL.createObjectURL(file as File)}></img>
        </div>
      )}
      {fileType === "pdf" && (
        <div className="flex justify-center w-1/5 h-1/5 mx-auto py-3">
          PDF document uploaded.
        </div>
      )}
      {fileType === "binary" && (
        <div className="flex justify-center w-1/5 h-1/5 mx-auto py-3">
          Binary file uploaded.
        </div>
      )}
      {fileType === "text" && (
        <div className="flex justify-center w-1/5 h-1/5 mx-auto py-3">
          Text file uploaded.
        </div>
      )}
      {fileType === "unknown" && (
        <div className="flex justify-center w-1/5 h-1/5 mx-auto py-3">
          File uploaded.
        </div>
      )}
      {buffer && displayResult()}
    </>
  );
}

export default App;
