import React, { useRef } from 'react';
import { X, Printer, Gift } from 'lucide-react';
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
 background: #6955A5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
   .print-container { 
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
padding: 180px 50px;
  background: white;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
}
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 0 20px 0;
    }
    
    .logo-text {
      font-size: 42px;
      font-weight: bold;
      color: #F59E0B;
      margin-bottom: 40px;
      letter-spacing: -1px;
    }
    
    .dear-text {
      font-size: 18px;
      margin-bottom: 20px;
      color: #000;
    }
    
    .message-text {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
      color: #333;
    }
    
    .from-text {
      font-size: 18px;
      margin-bottom: 40px;
      color: #000;
    }
    
    .reward-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #FEFCE8; /* yellow-50 */
  border: 1px solid #FDE68A; /* yellow-200 */
}

.reward-box svg {
  width: 16px;
  height: 16px;
  color: #CA8A04; /* yellow-600 */
}

.reward-box span {
  font-size: 14px;
  color: #374151; /* gray-700 */
}

.reward-box span span {
  font-weight: 600;
}

  .qr-container {
  text-align: right;
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 12px;
}
    .qr-label {
      font-size: 14px;
      color: #F59E0B;
      font-weight: bold;
      margin-bottom: 8px;
      text-align: right;
    }
    
    svg {
      max-width: 120px;
      max-height: 120px;
      display: inline-block;
    }
    
    img {
  max-width: 150px !important;
  margin-left: 70px;
}
  .text-center img {
  max-width: 150px !important;
  margin-left: 30px !important;
  margin-bottom: 0 !important;
}

    @page {
      size: A4 portrait;
      margin: 0;
    }
    
  @media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  body { 
    margin: 0;
    padding: 0;
    display: flex;
    background: #6955A5 !important;
  }
      
      .print-container {
        max-width: 700px;
        margin: 0 auto;
     padding: 180px 50px;
        page-break-inside: avoid;
        background: white;
        box-shadow: none;
      }
      
      .logo {
        width: 80px;
        height: 80px;
        margin: 0 0 20px 0;
      }
      
      .logo-text {
        font-size: 42px;
        font-weight: bold;
        color: #F59E0B;
        margin-bottom: 40px;
      }
      
      .dear-text {
        font-size: 18px;
        margin-bottom: 20px;
          margin-top: 20px;
      }
      
      .message-text {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 30px;
      }
      
      .from-text {
        font-size: 18px;
        margin-bottom: 40px;
      }
      
     .qr-container {
  text-align: right;
  margin-top: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 12px;
}
      .qr-label {
        font-size: 14px;
        color: #F59E0B;
        font-weight: bold;
        margin-bottom: 8px;
        text-align: right;
      }
      
      svg {
        max-width: 120px;
        max-height: 120px;
        display: inline-block;
      }
        img {
  max-width: 150px !important;
  margin-left: 70px;
}
  .text-center img {
  max-width: 150px !important;
  margin-left: 50px !important;
  margin-bottom: 0 !important;
    margin-top: -110px !important;
}
    }
  `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<div style="background: #6955A5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 48px; position: relative;">');
        printWindow.document.write('<div style="position: absolute; top: 215px; left: 10%; transform: translate(-50%, -50%) rotate(-30deg); z-index: 10;"><img src="/card.svg" alt="Card Icon" style="width: 100px; height: auto;" /></div>');
        printWindow.document.write('<div class="print-container">');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</div>');
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
                <div className="flex-1 overflow-y-auto p-12 bg-[#6955A5] relative">
                    <div className="absolute top-19 left-[25.5%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <img
                            src="/card.svg"
                            alt="Card Icon"
                            style={{ width: '120px', height: 'auto', transform: 'rotate(-30deg)' }}
                        />
                    </div>
                    <div ref={printRef} className="bg-white p-10 max-w-[500px] mx-auto shadow-2xl relative overflow-hidden">
                        {/* UGive Logo Image - Centered */}
                        <div className="text-center mt-4 mb-16">
                            <img
                                src="/uGive_purple.png"
                                alt="UGive"
                                className="mx-auto"
                                style={{ maxWidth: '200px', height: 'auto' }}
                            />
                        </div>

                        {/* Dear Recipient */}
                        <div className="dear-text mb-6">
                            Dear {card.recipient_name}
                        </div>

                        {/* Message */}
                        <div className="message-text mb-8">
                            {card.message || 'No message provided'}
                        </div>

                        {/* From Sender */}
                        <div className="from-text mb-10">
                            From {card.sender_name}
                        </div>
                        {card.reward?.name && (
                            <div className="reward-box flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200">
                                <Gift className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-gray-700">
                                    <span className="font-semibold">Reward:</span> {card.reward.name}
                                </span>
                            </div>
                        )}



                        {/* QR Code */}
                        <div className="qr-container flex items-end gap-3 justify-end">
                            <div className="qr-label mb-2 text-[#F59E0B]">
                                Scan the QR code to<br />send your own message!
                            </div>
                            <div className="inline-block">
                                <QRCode
                                    value={JSON.stringify({
                                        cardId: card._id,
                                        recipientName: card.recipient_name,
                                        senderName: card.sender_name,
                                        reward: card.reward?.name || 'No Reward',
                                        status: card.status,
                                        sentAt: card.sent_at
                                    })}
                                    size={120}
                                    level="H"
                                />
                            </div>
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