import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Coins, TrendingUp, TrendingDown, Zap } from "lucide-react";

export default function Wallet() {
  const { user, isAuthenticated } = useAuth();
  const { data: balanceData, isLoading: balanceLoading } = trpc.coin.getBalance.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: historyData, isLoading: historyLoading } = trpc.coin.history.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A10] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#cccccc] mb-4">Sign in to view your Anom Coin wallet</p>
        </div>
      </div>
    );
  }

  const balance = balanceData?.balance || "0";
  const transactions = historyData || [];

  return (
    <div className="min-h-screen bg-[#0A0A10] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#ff00c8] mb-2">Anom Coin Wallet</h1>
          <p className="text-[#cccccc]">Manage your digital currency and track your earnings</p>
        </div>

        {/* Balance Card */}
        <div
          className="rounded-lg border-2 border-[#00eaff] p-8 mb-8"
          style={{
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.28)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#cccccc] text-sm mb-2">Current Balance</p>
              <p className="text-5xl font-bold text-[#ff00c8]">{balance}</p>
              <p className="text-[#00eaff] text-sm mt-2">Anom Coins</p>
            </div>
            <Coins className="w-24 h-24 text-[#ff00c8] opacity-50" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold py-6">
            <Zap className="w-4 h-4 mr-2" />
            Earn Coins
          </Button>
          <Button className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold py-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Spend Coins
          </Button>
          <Button className="border-2 border-[#d8ae55] hover:bg-[#d8ae55]/10 text-[#d8ae55] font-bold py-6">
            <TrendingDown className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-2xl font-bold text-[#00eaff] mb-4">Transaction History</h2>
          {historyLoading ? (
            <div className="text-center py-8">
              <p className="text-[#cccccc]">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div
              className="rounded-lg border-2 border-[#cccccc] p-8 text-center"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
              }}
            >
              <p className="text-[#cccccc]">No transactions yet. Start earning Anom Coins!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-lg border-2 border-[#cccccc] p-4 flex items-center justify-between hover:border-[#00eaff] transition-colors"
                  style={{
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {transaction.type === "earn" ? (
                      <TrendingUp className="w-6 h-6 text-[#00eaff]" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-[#ff00c8]" />
                    )}
                    <div>
                      <p className="font-bold text-white capitalize">{transaction.reason}</p>
                      <p className="text-[#cccccc] text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${transaction.type === "earn" ? "text-[#00eaff]" : "text-[#ff00c8]"}`}>
                    {transaction.type === "earn" ? "+" : "-"}
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earning Guide */}
        <div className="mt-12 rounded-lg border-2 border-[#d8ae55] p-6" style={{ boxShadow: "0 6px 18px rgba(0, 0, 0, 0.45)" }}>
          <h3 className="text-xl font-bold text-[#d8ae55] mb-4">How to Earn Anom Coins</h3>
          <ul className="space-y-3 text-[#cccccc]">
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Complete Kids Corner lessons and activities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Help others in family and friend lounges</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Win mini-games (Trivia, Memory, Mood Matcher, Snack Vault Rush)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Achieve milestones and unlock achievements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#00eaff] font-bold">•</span>
              <span>Participate in community events and challenges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
