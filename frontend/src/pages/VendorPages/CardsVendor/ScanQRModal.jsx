import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScanQRModal = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef(null);
    const [error, setError] = useState(null);
    const [scanStatus, setScanStatus] = useState('');
    const [scanProgress, setScanProgress] = useState(0);

    useEffect(() => {
        if (isOpen && !scannerRef.current) {
            setScanStatus('Initializing camera...');
            setScanProgress(0);

            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                false
            );

            // Camera initialization started
            setScanProgress(20);

            scanner.render(
                (decodedText) => {
                    // QR detected - set to 60%
                    setScanProgress(60);
                    setScanStatus('QR code detected! Processing...');

                    console.log("Decoded text:", decodedText);
                    console.log("Type:", typeof decodedText);

                    // Start verification - set to 80%
                    setScanProgress(80);
                    setScanStatus('Verifying with server...');

                    scanner.clear().catch(console.error);
                    scannerRef.current = null;

                    const qrString = typeof decodedText === 'string' ? decodedText : JSON.stringify(decodedText);

                    // Call API and track completion
                    onScanSuccess(qrString);

                    // Complete - will be set to 100% in parent after API success
                    setScanProgress(100);
                    setScanStatus('Verification complete!');
                },
                (errorMessage) => {
                    // Camera is actively scanning
                    if (errorMessage.includes('NotFound') || errorMessage.includes('NotFoundException')) {
                        setScanProgress(40); // Scanning in progress
                        setScanStatus('Scanning... Position QR code in frame');
                    }
                }
            );

            scannerRef.current = scanner;

            // Camera ready
            setTimeout(() => {
                setScanStatus('Camera ready - Position QR code');
                setScanProgress(40);
            }, 500);

            // Add cursor pointer to all buttons
            setTimeout(() => {
                const qrReader = document.getElementById('qr-reader');
                if (qrReader) {
                    const buttons = qrReader.querySelectorAll('button, input[type="file"], select, #html5-qrcode-button-file-selection');
                    buttons.forEach(btn => {
                        btn.style.cursor = 'pointer';
                    });
                }
            }, 100);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
            }
            setScanStatus('');
            setScanProgress(0);
        };
    }, [isOpen, onScanSuccess]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Scan QR Code
                        </h3>
                    </div>
                    <button
                        onClick={() => {
                            if (scannerRef.current) {
                                scannerRef.current.clear().catch(console.error);
                                scannerRef.current = null;
                            }
                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scanner */}
                <div className="p-6">
                    <div id="qr-reader" className="w-full [&>div]:!text-center [&>div>*]:!mx-auto"></div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Status indicator with progress */}
                    {scanStatus && (
                        <div className="mt-4 space-y-2">
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-blue-600 font-medium">
                                        {scanStatus}
                                    </p>
                                    <span className="text-xs text-blue-500 font-semibold">
                                        {scanProgress}%
                                    </span>
                                </div>
                                {/* Progress bar */}
                                <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${scanProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="mt-4 text-sm text-gray-500 text-center">
                        Position the QR code within the frame to scan
                    </p>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={() => {
                            if (scannerRef.current) {
                                scannerRef.current.clear().catch(console.error);
                                scannerRef.current = null;
                            }
                            onClose();
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanQRModal;