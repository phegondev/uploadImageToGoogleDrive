import React, { useState } from "react";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("http://localhost:5050/uploadToGoogleDrive", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setResultMessage({ type: "success", message: result });
    } catch (error) {
      console.error("Error uploading image:", error.message);
      setResultMessage({ type: "error", message: error.message });
    }
    setTimeout(() => setResultMessage(null), 5000);
  };

  return (
    <div className="app">
      {resultMessage && (
        <div>
          {resultMessage.message.status == 200
            ? `Success: ${resultMessage.message.message}`
            : `Error: ${resultMessage.message.message}`}
        </div>
      )}
      <h1>Image Uploader</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile}>
        Upload Image
      </button>

    </div>
  );
};

export default App;







