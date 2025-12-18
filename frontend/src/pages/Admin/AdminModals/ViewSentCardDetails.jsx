import { X } from "lucide-react";

const ViewCardModal = ({ isOpen, onClose, card }) => {
  if (!isOpen || !card) return null;

  const hasValue = (v) =>
    v !== undefined && v !== null && String(v).trim() !== "";

  const Row = ({ label, value, badge = false }) => {
    if (!hasValue(value)) return null;

    return (
      <div className="grid grid-cols-[140px_1fr] gap-2 py-1.5">
        <span className="text-[11px] uppercase tracking-wide text-gray-400">
          {label}
        </span>

        {badge ? (
          <span
            className="inline-block w-fit px-2 py-0.5 rounded-full
                       text-[11px] font-semibold
                       bg-indigo-100 text-indigo-700"
          >
            {value}
          </span>
        ) : (
          <span className="text-sm text-gray-900 break-words">
            {value}
          </span>
        )}
      </div>
    );
  };

  const Section = ({ title, children }) => (
    <div className="rounded-lg bg-gray-50">
      <div
        className="px-3 py-1.5 text-[11px] font-semibold
                   uppercase tracking-wide text-gray-600 bg-gray-100 rounded-t-lg"
      >
        {title}
      </div>
      <div className="px-3 py-2 divide-y divide-gray-200">
        {children}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 overflow-y-auto">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-xl
                   max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b">
          <h2 className="text-sm font-semibold text-gray-900">
            Card Details
          </h2>
          <button onClick={onClose}>
            <X className="w-4.5 h-4.5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-3 overflow-y-auto text-sm">

          {/* Message */}
          {hasValue(card.message) && (
            <Section title="Message">
              <div className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                {card.message}
              </div>
            </Section>
          )}

          {/* Details */}
          {(hasValue(card.status) || hasValue(card.college_name)) && (
            <Section title="Details">
              <Row label="Status" value={card.status} badge />
              <Row label="College House" value={card.college_name} />
            </Section>
          )}

          {/* Sender */}
          {(hasValue(card.sender_name) || hasValue(card.sender?.email)) && (
            <Section title="Sender">
              <Row label="Name" value={card.sender_name} />
              <Row label="Email" value={card.sender?.email} />
            </Section>
          )}

          {/* Receiver */}
          {(hasValue(card.receiver_id?.name) ||
            hasValue(card.receiver_id?.email)) && (
            <Section title="Recipient Details">
              <Row label="Full Name" value={`${card.recipient_name}${card.recipient_last_name ? ` ${card.recipient_last_name}` : ""}`} />
              <Row label="Email" value={card.receiver_id?.email} />
            </Section>
          )}

          {/* Timeline */}
          {hasValue(card.sent_at) && (
            <Section title="Timeline">
              <Row
                label="Sent At"
                value={new Date(card.sent_at).toLocaleString()}
              />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCardModal;
