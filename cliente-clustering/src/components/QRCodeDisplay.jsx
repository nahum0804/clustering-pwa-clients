import { QRCodeCanvas } from "qrcode.react";

function QRCodeDisplay({ value }) {
  return (
    <div className="flex justify-center my-4">
      <QRCodeCanvas value={value} size={200} />
    </div>
  );
}

export default QRCodeDisplay;
