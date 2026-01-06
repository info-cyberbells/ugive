import React, { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import QRCode from 'react-qr-code';

const PrintPreviewModal = ({ isOpen, onClose, card }) => {
    const printRef = useRef();

    const handlePrint = () => {
        const printContent = printRef.current;
        const printWindow = window.open('', '', 'height=900,width=800');

        printWindow.document.write('<html><head><title>Print Card</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body { 
      font-family: Arial, sans-serif;
      padding: 0;
      margin: 0;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    .print-container { 
      max-width: 700px;
      width: 100%;
      margin: 0 auto;
      padding: 30px;
    }
    
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    
    @media print {
      body { 
        margin: 0;
        padding: 0;
        display: block;
      }
      
      .print-container {
        max-width: 100%;
        margin: 0 auto;
        padding: 20px;
        page-break-inside: avoid;
      }
      
      h1 { 
        font-size: 32px !important;
        margin-bottom: 8px !important;
        text-align: center;
      }
      
      h3 { 
        font-size: 16px !important;
        margin-bottom: 10px !important;
      }
      
      .section {
        padding: 15px !important;
        margin-bottom: 12px !important;
        page-break-inside: avoid;
      }
      
      .info-row {
        display: flex;
        margin-bottom: 8px;
      }
      
      .info-label {
        font-weight: bold;
        min-width: 120px;
      }
      
      .qr-section {
        padding: 20px !important;
        margin-top: 15px !important;
        text-align: center;
      }
      
      canvas, svg {
        max-width: 200px !important;
        max-height: 200px !important;
        margin: 0 auto;
        display: block;
      }
      
      .header-section {
        text-align: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 4px solid #4F46E5;
      }
      
      .footer-section {
        text-align: center;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #E5E7EB;
      }
    }
  `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<div class="print-container">');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</div>');
        printWindow.document.write('</body></html>');

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <Printer className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Print Preview
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Preview Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div ref={printRef} className="bg-white p-6 rounded-lg shadow-sm">
                        {/* Header */}
                        <div className="header-section text-center mb-6 border-b-4 border-indigo-600 pb-4">
                            <h1 className="text-4xl font-bold text-indigo-600 mb-2">
                                Reward Card
                            </h1>
                            <p className="text-sm text-gray-500 font-mono">
                                Card ID: {card._id}
                            </p>
                        </div>

                        {/* Sender Info */}
                        <div className="section bg-gray-50 p-5 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                Sender Information
                            </h3>
                            <div className="space-y-2">
                                <div className="info-row flex">
                                    <span className="info-label font-semibold text-gray-700 w-32">Name:</span>
                                    <span className="text-gray-900">{card.sender_name}</span>
                                </div>
                                <div className="info-row flex">
                                    <span className="info-label font-semibold text-gray-700 w-32">Email:</span>
                                    <span className="text-gray-900">{card.sender?.email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recipient Info */}
                        <div className="section bg-gray-50 p-5 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                Recipient Information
                            </h3>
                            <div className="space-y-2">
                                <div className="info-row flex">
                                    <span className="info-label font-semibold text-gray-700 w-32">Name:</span>
                                    <span className="text-gray-900">
                                        {card.recipient_name} {card.recipient_last_name || ''}
                                    </span>
                                </div>
                                <div className="info-row flex">
                                    <span className="info-label font-semibold text-gray-700 w-32">Email:</span>
                                    <span className="text-gray-900">{card.recipient_email || 'N/A'}</span>
                                </div>
                                <div className="info-row flex">
                                    <span className="info-label font-semibold text-gray-700 w-32">College:</span>
                                    <span className="text-gray-900">{card.college_name || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Reward Info */}
                        {card.reward && (
                            <div className="section bg-indigo-50 p-5 rounded-lg mb-4 border-2 border-indigo-200">
                                <h3 className="text-lg font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                    Reward Details
                                </h3>
                                <div className="info-row flex">
                                    <span className="info-label font-semibold text-indigo-700 w-32">Reward:</span>
                                    <span className="text-indigo-900 font-medium">{card.reward?.name || 'N/A'}</span>
                                </div>
                            </div>
                        )}

                        {/* Message */}
                        {card.message && (
                            <div className="section bg-amber-50 p-5 rounded-lg mb-4 border-2 border-amber-200">
                                <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                                    Message
                                </h3>
                                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                    {card.message}
                                </p>
                            </div>
                        )}

                        {/* Status & Date */}
                        <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-4">
                            <div>
                                <span className="font-semibold text-gray-700">Status: </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${card.status === 'printed'
                                    ? 'bg-green-100 text-green-800'
                                    : card.status === 'delivered'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Sent: </span>
                                <span className="text-gray-900">
                                    {new Date(card.sent_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="qr-section text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Scan QR Code for Verification
                            </h3>
                            <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                                <QRCode
                                    value={JSON.stringify({
                                        cardId: card._id,
                                        recipientName: card.recipient_name,
                                        senderName: card.sender_name,
                                        reward: card.reward?.name || 'No Reward',
                                        status: card.status,
                                        sentAt: card.sent_at
                                    })}
                                    size={200}
                                    level="H"
                                    style={{ height: "auto", maxWidth: "100%", width: "100%", display: "block", margin: "0 auto" }}
                                />
                            </div>
                            <p className="mt-3 text-xs text-gray-500 font-mono">
                                {card._id}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="footer-section mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                            <p className="font-semibold text-base">University Rewards System</p>
                            <p className="text-xs mt-1">
                                Printed on: {new Date().toLocaleString('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Printer className="w-5 h-5" />
                        Print Card
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintPreviewModal;