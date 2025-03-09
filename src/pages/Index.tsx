
import React, { useState } from "react";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFileSelect = () => {
    // In a real app, this would handle file selection
    console.log("File selected");
  };
  
  const handleUploadAndProcess = () => {
    // Simulate upload and processing
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }, 2000);
  };
  
  return (
    <main className="main-content">
      <div className="container-custom">
        <div className="neuralscan-container">
          <div className="ct-scan-section">
            <div className="upload-section">
              <h2 className="upload-title">Upload CT Scan Images</h2>
              
              <div className="glass-card mb-6">
                <div className="file-input-container mb-4">
                  <label className="file-input-label">
                    Choose DICOM Files
                    <input 
                      type="file" 
                      className="file-input" 
                      onChange={handleFileSelect}
                      multiple
                      accept=".dcm"
                    />
                  </label>
                </div>
                
                <button 
                  className="button-primary w-full mb-4"
                  onClick={handleUploadAndProcess}
                  disabled={isUploading || isProcessing}
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : isProcessing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Upload & Process"
                  )}
                </button>
                
                <button className="button-secondary w-full">
                  View 3D Render
                </button>
              </div>
              
              <div className="glass-card-light p-4">
                <p className="text-sm text-gray-300 mb-2">Using ML-enhanced CT reconstruction to:</p>
                <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                  <li>Fill in missing slices between scans</li>
                  <li>Reduce radiation exposure</li>
                  <li>Improve 3D model quality</li>
                  <li>Enable faster diagnoses</li>
                </ul>
              </div>
            </div>
            
            <div className="process-section">
              <div className="process-step">
                <div className="image-container">
                  <img src="/lovable-uploads/a8bd27c8-73c4-4fac-8865-1b6ffa1256c2.png" alt="Original CT Scans" className="ct-image" />
                </div>
                <p className="text-sm text-center mt-2 text-gray-300">Original CT Scan Images</p>
              </div>
              
              <div className="process-arrow">↓</div>
              
              <div className="process-step">
                <div className="image-container">
                  <img src="https://i.imgur.com/FBQxOt2.png" alt="Fourier Transform" className="ct-image" />
                </div>
                <p className="text-sm text-center mt-2 text-gray-300">Fourier Transform Applied</p>
              </div>
              
              <div className="process-arrow">↓</div>
              
              <div className="process-step">
                <div className="neural-network">
                  <svg width="100%" height="100%" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(20,20)">
                      {/* Input layer */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <g key={`input-${i}`}>
                          <circle cx="20" cy={30 + i * 30} r="8" fill="#A456F0" />
                          {/* Connections to hidden layer 1 */}
                          {[0, 1, 2, 3, 4].map((j) => (
                            <path
                              key={`conn-in-h1-${i}-${j}`}
                              d={`M 28 ${30 + i * 30} L 92 ${30 + j * 30}`}
                              stroke="rgba(164, 86, 240, 0.3)"
                              strokeWidth="1"
                            />
                          ))}
                        </g>
                      ))}
                      
                      {/* Hidden layer 1 */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <g key={`hidden1-${i}`}>
                          <circle cx="100" cy={30 + i * 30} r="8" fill="#A456F0" />
                          {/* Connections to hidden layer 2 */}
                          {[0, 1, 2, 3, 4].map((j) => (
                            <path
                              key={`conn-h1-h2-${i}-${j}`}
                              d={`M 108 ${30 + i * 30} L 172 ${30 + j * 30}`}
                              stroke="rgba(164, 86, 240, 0.3)"
                              strokeWidth="1"
                            />
                          ))}
                        </g>
                      ))}
                      
                      {/* Hidden layer 2 */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <g key={`hidden2-${i}`}>
                          <circle cx="180" cy={30 + i * 30} r="8" fill="#A456F0" />
                          {/* Connections to output layer */}
                          {[0, 1, 2, 3, 4].map((j) => (
                            <path
                              key={`conn-h2-out-${i}-${j}`}
                              d={`M 188 ${30 + i * 30} L 252 ${30 + j * 30}`}
                              stroke="rgba(164, 86, 240, 0.3)"
                              strokeWidth="1"
                            />
                          ))}
                        </g>
                      ))}
                      
                      {/* Output layer */}
                      {[0, 1, 2, 3, 4].map((i) => (
                        <g key={`output-${i}`}>
                          <circle cx="260" cy={30 + i * 30} r="8" fill="#A456F0" />
                        </g>
                      ))}
                    </g>
                  </svg>
                </div>
                <p className="text-sm text-center mt-2 text-gray-300">Neural Network Processing</p>
              </div>
              
              <div className="process-arrow">↓</div>
              
              <div className="process-step">
                <div className="render-3d">
                  <img src="https://i.imgur.com/uCZjrz3.png" alt="3D Model" className="w-full h-auto" />
                </div>
                <p className="text-sm text-center mt-2 text-gray-300">Enhanced 3D Model Reconstruction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;
