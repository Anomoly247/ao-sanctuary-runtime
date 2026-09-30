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
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#94a3b8] mb-4">Sign in to view your Anom Coin wallet</p>
        </div>
      </div>
    );
  }

  const balance = balanceData?.balance || "0";
  const transactions = historyData || [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#c4b5fd] mb-2">Anom Coin Wallet</h1>
          <p className="text-[#94a3b8]">Manage your digital currency and track your earnings</p>
        </div>

        {/* Balance Card */}
        <div
          className="rounded-lg border-2 border-[#c4b5fd] p-8 mb-8"
          style={{
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.28)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94a3b8] text-sm mb-2">Current Balance</p>
              <p className="text-5xl font-bold text-[#c4b5fd]">{balance}</p>
              <p className="text-[#93c5fd] text-sm mt-2">Anom Coins</p>
            </div>
            <Coins className="w-24 h-24 text-[#c4b5fd] opacity-50" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button className="bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-white font-bold py-6">
            <Zap className="w-4 h-4 mr-2" />
            Earn Coins
          </Button>
          <Button className="bg-[#93c5fd] hover:bg-[#93c5fd]/80 text-[#0f172a] font-bold py-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            Spend Coins
          </Button>
          <Button className="border-2 border-[#a5b4fc] hover:bg-[#a5b4fc]/10 text-[#a5b4fc] font-bold py-6">
            <TrendingDown className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-2xl font-bold text-[#93c5fd] mb-4">Transaction History</h2>
          {historyLoading ? (
            <div className="text-center py-8">
              <p className="text-[#94a3b8]">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div
              className="rounded-lg border-2 border-[#94a3b8] p-8 text-center"
              style={{
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
              }}
            >
              <p className="text-[#94a3b8]">No transactions yet. Start earning Anom Coins!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-lg border-2 border-[#94a3b8] p-4 flex items-center justify-between hover:border-[#c4b5fd] transition-colors"
                  style={{
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {transaction.type === "earn" ? (
                      <TrendingUp className="w-6 h-6 text-[#93c5fd]" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-[#c4b5fd]" />
                    )}
                    <div>
                      <p className="font-bold text-white capitalize">{transaction.reason}</p>
                      <p className="text-[#94a3b8] text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${transaction.type === "earn" ? "text-[#93c5fd]" : "text-[#c4b5fd]"}`}>
                    {transaction.type === "earn" ? "+" : "-"}
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earning Guide */}
        <div className="mt-12 rounded-lg border-2 border-[#a5b4fc] p-6" style={{ boxShadow: "0 6px 18px rgba(15, 23, 42, 0.22)" }}>
          <h3 className="text-xl font-bold text-[#a5b4fc] mb-4">How to Earn Anom Coins</h3>
          <ul className="space-y-3 text-[#94a3b8]">
            <li className="flex items-start gap-3">
              <span className="text-[#93c5fd] font-bold">•</span>
              <span>Complete Kids Corner lessons and activities</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#93c5fd] font-bold">•</span>
              <span>Help others in family and friend lounges</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#93c5fd] font-bold">•</span>
              <span>Win mini-games (Trivia, Memory, Mood Matcher, Snack Vault Rush)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#93c5fd] font-bold">•</span>
              <span>Achieve milestones and unlock achievements</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#93c5fd] font-bold">•</span>
              <span>Participate in community events and challenges</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
