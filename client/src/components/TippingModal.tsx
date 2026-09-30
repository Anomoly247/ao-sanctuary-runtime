import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Heart, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface TippingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TippingModal({ isOpen, onClose }: TippingModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [tipType, setTipType] = useState<"one_time" | "recurring">("one_time");

  const createTip = trpc.membership.createTip.useMutation({
    onSuccess: () => {
      toast.success("Thank you for your support! 💜");
      setSelectedAmount(null);
      setCustomAmount("");
      setMessage("");
      onClose();
    },
    onError: () => {
      toast.error("Failed to process tip");
    },
  });

  if (!isOpen) return null;

  const tipAmounts = [1, 5, 10, 25, 50];
  const finalAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);

  const handleSubmit = () => {
    if (finalAmount <= 0) {
      toast.error("Please select or enter an amount");
      return;
    }

    createTip.mutate({
      amount: finalAmount,
      message,
      tipType,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#1e293b] border border-[#c4b5fd] w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#c4b5fd]" />
              <h2 className="text-2xl font-bold text-[#c4b5fd]">Support Anom Artsy</h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#94a3b8] hover:text-[#93c5fd] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Description */}
          <p className="text-[#94a3b8] mb-6">
            Your support helps us continue building amazing features and supporting our community.
          </p>

          {/* Tip Type */}
          <div className="mb-6">
            <p className="text-sm font-bold text-[#93c5fd] mb-3">Tip Type</p>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  checked={tipType === "one_time"}
                  onChange={() => setTipType("one_time")}
                  className="w-4 h-4"
                />
                <span className="text-[#94a3b8]">One-Time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  checked={tipType === "recurring"}
                  onChange={() => setTipType("recurring")}
                  className="w-4 h-4"
                />
                <span className="text-[#94a3b8]">Monthly</span>
              </label>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-6">
            <p className="text-sm font-bold text-[#93c5fd] mb-3">Select Amount</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {tipAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`p-3 rounded-lg border-2 font-bold transition-colors ${
                    selectedAmount === amount
                      ? "border-[#c4b5fd] bg-[#c4b5fd]/20 text-[#c4b5fd]"
                      : "border-[#334155] bg-[#0f172a] text-[#94a3b8] hover:border-[#93c5fd]"
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="flex gap-2">
              <DollarSign className="w-5 h-5 text-[#94a3b8] mt-2" />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                placeholder="Custom amount"
                min="1"
                step="0.01"
                className="flex-1 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-[#93c5fd] placeholder-[#94a3b8] focus:border-[#c4b5fd] focus:outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-[#93c5fd] mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message of support..."
              maxLength={500}
              className="w-full h-20 px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-[#93c5fd] placeholder-[#94a3b8] focus:border-[#c4b5fd] focus:outline-none resize-none"
            />
            <p className="text-xs text-[#94a3b8] mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Summary */}
          {finalAmount > 0 && (
            <div className="bg-[#0f172a] rounded-lg p-4 mb-6 border border-[#334155]">
              <div className="flex justify-between items-center">
                <span className="text-[#94a3b8]">Total Amount:</span>
                <span className="text-2xl font-bold text-[#93c5fd]">
                  ${finalAmount.toFixed(2)}
                </span>
              </div>
              {tipType === "recurring" && (
                <p className="text-xs text-[#94a3b8] mt-2">
                  Billed monthly until canceled
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-[#94a3b8] border-[#334155]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createTip.isPending || finalAmount <= 0}
              className="flex-1 bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold disabled:opacity-50"
            >
              <Heart className="w-4 h-4 mr-2" />
              Tip ${finalAmount.toFixed(2)}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
