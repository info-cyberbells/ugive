import React, { useRef } from 'react';
import { X, Printer, Gift } from 'lucide-react';
import QRCode from 'react-qr-code';

const PrintPreviewModal = ({ isOpen, onClose, card }) => {
  const printRef = useRef();

  //   const handlePrint = () => {
  //     const printContent = printRef.current;
  //     const printWindow = window.open('', '', 'height=900,width=800');

  //     printWindow.document.write('<html><head><title>Print Card</title>');
  //     printWindow.document.write('<style>');
  //     printWindow.document.write(`
  //     * {
  //       margin: 0;
  //       padding: 0;
  //       box-sizing: border-box;
  //     }

  //     body { 
  //       font-family: Arial, sans-serif;
  //       padding: 0;
  //       margin: 0;
  //  background: #6955A5;
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       min-height: 100vh;
  //     }

  //    .print-container { 
  //   max-width: 600px;
  //   width: 100%;
  //   margin: 0 auto;
  // padding: 180px 50px;
  //   background: white;
  //   box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  //   position: relative;
  //   overflow: hidden;
  // }
  //     .logo {
  //       width: 80px;
  //       height: 80px;
  //       margin: 0 0 20px 0;
  //     }

  //     .logo-text {
  //       font-size: 42px;
  //       font-weight: bold;
  //       color: #F59E0B;
  //       margin-bottom: 40px;
  //       letter-spacing: -1px;
  //     }

  //     .dear-text {
  //       font-size: 18px;
  //       margin-bottom: 20px;
  //       color: #000;
  //     }

  //     .message-text {
  //       font-size: 16px;
  //       line-height: 1.6;
  //       margin-bottom: 30px;
  //       color: #333;
  //     }

  //     .from-text {
  //       font-size: 18px;
  //       margin-bottom: 40px;
  //       color: #000;
  //     }

  //     .reward-box {
  //   display: flex;
  //   align-items: center;
  //   gap: 8px;
  //   margin-bottom: 24px;
  //   padding: 8px 12px;
  //   border-radius: 8px;
  //   background: #FEFCE8; /* yellow-50 */
  //   border: 1px solid #FDE68A; /* yellow-200 */
  // }

  // .reward-box svg {
  //   width: 16px;
  //   height: 16px;
  //   color: #CA8A04; /* yellow-600 */
  // }

  // .reward-box span {
  //   font-size: 14px;
  //   color: #374151; /* gray-700 */
  // }

  // .reward-box span span {
  //   font-weight: 600;
  // }

  //   .qr-container {
  //   text-align: right;
  //   margin-top: 40px;
  //   display: flex;
  //   justify-content: flex-end;
  //   align-items: flex-end;
  //   gap: 12px;
  // }
  //     .qr-label {
  //       font-size: 14px;
  //       color: #F59E0B;
  //       font-weight: bold;
  //       margin-bottom: 8px;
  //       text-align: right;
  //     }

  //     svg {
  //       max-width: 120px;
  //       max-height: 120px;
  //       display: inline-block;
  //     }

  //     img {
  //   max-width: 150px !important;
  //   margin-left: 70px;
  // }
  //   .text-center img {
  //   max-width: 150px !important;
  //   margin-left: 30px !important;
  //   margin-bottom: 0 !important;
  // }

  //     @page {
  //       size: A4 portrait;
  //       margin: 0;
  //     }

  //   @media print {
  //   * {
  //     -webkit-print-color-adjust: exact !important;
  //     print-color-adjust: exact !important;
  //     color-adjust: exact !important;
  //   }

  //   body { 
  //     margin: 0;
  //     padding: 0;
  //     display: flex;
  //     background: #6955A5 !important;
  //   }

  //       .print-container {
  //         max-width: 600px;
  //         margin: 0 auto;
  //      padding: 120px 50px;
  //         page-break-inside: avoid;
  //         background: white;
  //         box-shadow: none;
  //       }

  //       .logo {
  //         width: 80px;
  //         height: 80px;
  //         margin: 0 0 20px 0;
  //       }

  //       .logo-text {
  //         font-size: 42px;
  //         font-weight: bold;
  //         color: #F59E0B;
  //         margin-bottom: 40px;
  //       }

  //       .dear-text {
  //         font-size: 18px;
  //         margin-bottom: 20px;
  //           margin-top: 50px;
  //       }

  //       .message-text {
  //         font-size: 16px;
  //         line-height: 1.6;
  //         margin-bottom: 30px;
  //       }

  //       .from-text {
  //         font-size: 18px;
  //         margin-bottom: 40px;
  //       }

  //      .qr-container {
  //   text-align: right;
  //   margin-top: 80px;
  //   display: flex;
  //   justify-content: flex-end;
  //   align-items: flex-end;
  //   gap: 12px;
  // }
  //       .qr-label {
  //         font-size: 14px;
  //         color: #F59E0B;
  //         font-weight: bold;
  //         margin-bottom: 8px;
  //         text-align: right;
  //       }

  //       svg {
  //         max-width: 120px;
  //         max-height: 120px;
  //         display: inline-block;
  //       }
  //         img {
  //   max-width: 150px !important;
  //   margin-left: 70px;
  // }
  //   .text-center img {
  //   max-width: 180px !important;
  //   margin-left: 120px !important;
  //   margin-bottom: 0 !important;
  //     margin-top: -60px !important;
  // }
  //     }
  //   `);
  //     printWindow.document.write('</style></head><body>');
  //     printWindow.document.write('<div style="background: #6955A5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 48px; position: relative;">');
  //     printWindow.document.write('<div style="position: absolute; top: 160px; left: 6.5%; transform: translate(-50%, -50%); z-index: 10;"><img src="/card_image.png" alt="Card Icon" style="width: 100px; height: auto;" /></div>');
  //     printWindow.document.write('<div class="print-container">');
  //     printWindow.document.write(printContent.innerHTML);
  //     printWindow.document.write('</div>');
  //     printWindow.document.write('</div>');
  //     printWindow.document.write('</body></html>');

  //     printWindow.document.close();
  //     printWindow.focus();

  //     setTimeout(() => {
  //       printWindow.print();
  //       printWindow.close();
  //     }, 500);
  //   };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=900,height=1000');
    const baseUrl = window.location.origin;

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Card</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
 
          body {
            font-family: Arial, sans-serif;
            background: #6955A5;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
 
          .page {
            background: #6955A5;
            min-height: 100vh;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            padding: 12px;
          }
 
          .floating-icon {
            position: absolute;
            top: 120px;
            left: 16%;
            transform: translate(-50%, -50%) rotate(-15deg);
            width: 230px;
            z-index: 5;
          }
 
          .card {
            background: #ffffff;
            width: 100%;
            max-width: 600px;
            // min-height: 760px;
            min-height: 940px;
            padding: 40px;
            display: flex;
            flex-direction: column;
          }
 
          .logo {
            text-align: center;
            margin-bottom: 30px;
          }
 
          .logo img {
            max-width: 280px;
          }
 
          .content {
            flex: 1;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;   /* vertical center */
          }
 
          .dear {
            font-size: 20px;
            letter-spacing: 1px;
            margin-bottom: 12px;
            color: #000;
          }
 
          .message {
            font-size: 20px;
            text-align: justify;
            hyphens: auto;
            letter-spacing: 0.8px;
            color: #333;
            white-space: pre-wrap;
          }
 
          .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            // border-top: 1px solid #eee;
            padding-top: 20px;
          }
 
          .from {
            margin-Top: 12px;
            letter-spacing: 1px;
            font-size: 20px;
            color: #000;
            margin-bottom: 10px;
          }
 
          .reward {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background: #FEFCE8;
            border: 1px solid #FDE68A;
            border-radius: 6px;
              color: #B45309;
            font-size: 14px;
            margin: 8px auto 0;          /* center horizontally */
            width: fit-content;
          }
 
          .gift-icon {
            width: 16px;
            height: 16px;
            color: #B45309;
          }
 
          .qr-area {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            text-align: right;
          }
 
          .qr-label {
            font-size: 18px;
            font-weight: bold;
            color: #F59E0B;
            line-height: 1.2;
          }
 
          svg {
            width: 120px;
            height: 120px;
          }
 
          @page {
            size: A4 portrait;
            margin: 0;
          }
 
          @media print {
            body {
              background: #6955A5;
            }
          }
        </style>
      </head>
 
      <body>
        <div class="page">
          <img src="${baseUrl}/card_image.png" class="floating-icon" />
 
          <div class="card">
            <div class="logo">
              <img src="${baseUrl}/uGive_purple.png" />
            </div>
 
            <div class="content">
              <div class="dear">Dear, ${card.recipient_name}</div>
              <div class="message">${card.message || 'No message provided'}</div>
               <div class="from">From ${card.sender_name}</div>
                ${card.reward?.name
        ? `<div class="reward"> <svg class="gift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"></polyline>
    <rect x="2" y="7" width="20" height="5"></rect>
    <line x1="12" y1="22" x2="12" y2="7"></line>
    <path d="M12 7c-1.5 0-3-1-3-2.5S10.5 2 12 4c1.5-2 3-1.5 3 0S13.5 7 12 7z"></path>
  </svg><strong>Reward:</strong> ${card.reward.name}</div>`
        : ''
      }
            </div>
 
            <div class="footer">
              <div>
               
              </div>
 
              <div class="qr-area">
                <div class="qr-label">
                  Scan the QR code to<br/>send your own message!
                </div>
                ${printRef.current.querySelector('.qr-container svg').outerHTML}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 800);
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
              src="/card_image.png"
              alt="Card Icon"
              style={{ width: '160px', height: 'auto' }}
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
                {/* qr code data to show use data if i scan}
                {/* <QRCode
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
                /> */}

                <QRCode
                  value="https://ugive.com.au"
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