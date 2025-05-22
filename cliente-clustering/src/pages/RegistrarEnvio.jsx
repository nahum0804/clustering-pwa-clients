import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function QRCodeDisplay({ value }) {
  const canvasRef = useRef();

  const handleDownload = () => {
    const canvas = canvasRef.current.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "codigo-envio.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center my-4">
      <div ref={canvasRef}>
        <QRCodeCanvas value={value} size={200} />
      </div>
      <button
        onClick={handleDownload}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Descargar QR como PNG
      </button>
    </div>
  );
}

export default QRCodeDisplay;
