import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CreditCard, ShoppingBag, TrendingUp, Settings, AlertCircle, Download, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function PaymentMerchManagement() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for demonstration
  const paymentMethods = [
    { id: 1, type: "Stripe", status: "connected", lastSync: "2 hours ago", revenue: "$12,450" },
    { id: 2, type: "PayPal Business", status: "connected", lastSync: "1 hour ago", revenue: "$8,320" },
    { id: 3, type: "Cash App Business", status: "pending", lastSync: "Never", revenue: "$0" },
    { id: 4, type: "Cash", status: "manual", lastSync: "N/A", revenue: "$1,200" },
  ];

  const vipTransactions = [
    { id: 1, user: "Alex", tier: "VIP", amount: "$10.00", method: "Stripe", date: "2026-05-15", status: "completed" },
    { id: 2, user: "Jordan", tier: "VIP Max", amount: "$25.00", method: "PayPal", date: "2026-05-15", status: "completed" },
    { id: 3, user: "Sam", tier: "VIP", amount: "$10.00", method: "Stripe", date: "2026-05-14", status: "pending" },
    { id: 4, user: "Casey", tier: "Free VIP", amount: "$0.00", method: "Free", date: "2026-05-14", status: "completed" },
  ];

  const merchOrders = [
    { id: 1, user: "Alex", design: "Neon Dragon Hoodie", amount: "$45.00", status: "pending_approval", date: "2026-05-15" },
    { id: 2, user: "Jordan", design: "Pixel Art T-Shirt", amount: "$25.00", status: "approved", date: "2026-05-14" },
    { id: 3, user: "Sam", design: "Custom Neon Hat", amount: "$35.00", status: "in_production", date: "2026-05-13" },
    { id: 4, user: "Casey", design: "Anom Logo Hoodie", amount: "$50.00", status: "shipped", date: "2026-05-10" },
  ];

  const handleConnectPayment = (method: string) => {
    toast.success(`${method} connection initiated. Redirecting to setup...`);
  };

  const handleApproveMerch = (id: number) => {
    toast.success("Merch order approved!");
  };

  const handleRejectMerch = (id: number) => {
    toast.error("Merch order rejected.");
  };

  const handleExportData = () => {
    toast.success("Exporting payment data...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#93c5fd] text-xl">Loading Payment Dashboard...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#c4b5fd]" />
          <p className="text-[#93c5fd] text-xl mb-4">Admin access required</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#93c5fd]">
      {/* Navigation */}
      <nav className="border-b border-[#334155] px-6 py-4 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#94a3b8]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-accent">Payment & Merch Management</h1>
          </div>
          <Button variant="outline" className="text-[#c4b5fd] border-[#334155] gap-2" onClick={handleExportData}>
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Revenue Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">VIP Revenue</p>
                <p className="text-3xl font-bold text-[#c4b5fd]">$21,770</p>
              </div>
              <CreditCard className="w-8 h-8 text-[#c4b5fd] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Merch Sales</p>
                <p className="text-3xl font-bold text-[#93c5fd]">$155,000</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-[#93c5fd] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-[#a5b4fc]">$176,770</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#a5b4fc] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Active VIP Members</p>
                <p className="text-3xl font-bold text-[#93c5fd]">247</p>
              </div>
              <Eye className="w-8 h-8 text-[#93c5fd] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#1e293b] border border-[#334155] mb-8">
            <TabsTrigger value="overview" className="text-[#93c5fd]">
              <CreditCard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-[#93c5fd]">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-[#93c5fd]">
              <TrendingUp className="w-4 h-4 mr-2" />
              VIP Transactions
            </TabsTrigger>
            <TabsTrigger value="merch" className="text-[#93c5fd]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Merch Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-[#93c5fd]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">Dashboard Overview</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1e293b] border border-[#334155] p-6">
                <h4 className="text-lg font-bold text-[#93c5fd] mb-4">Recent VIP Signups</h4>
                <div className="space-y-3">
                  {vipTransactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center pb-3 border-b border-[#334155]">
                      <div>
                        <p className="text-[#93c5fd] font-bold">{tx.user}</p>
                        <p className="text-xs text-[#94a3b8]">{tx.tier}</p>
                      </div>
                      <p className="text-[#c4b5fd] font-bold">{tx.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-[#1e293b] border border-[#334155] p-6">
                <h4 className="text-lg font-bold text-[#93c5fd] mb-4">Pending Merch Orders</h4>
                <div className="space-y-3">
                  {merchOrders.filter(o => o.status === "pending_approval").map((order) => (
                    <div key={order.id} className="flex justify-between items-center pb-3 border-b border-[#334155]">
                      <div>
                        <p className="text-[#93c5fd] font-bold">{order.design}</p>
                        <p className="text-xs text-[#94a3b8]">by {order.user}</p>
                      </div>
                      <p className="text-[#a5b4fc] font-bold">{order.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">Payment Methods</h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="bg-[#1e293b] border border-[#334155] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#93c5fd]">{method.type}</h4>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <p className="text-[#94a3b8]">Status</p>
                          <p className="text-[#93c5fd] font-bold capitalize">{method.status}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Last Sync</p>
                          <p className="text-[#93c5fd] font-bold">{method.lastSync}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Revenue</p>
                          <p className="text-[#c4b5fd] font-bold">{method.revenue}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      className={method.status === "connected" ? "btn-secondary" : "btn-primary"}
                      onClick={() => handleConnectPayment(method.type)}
                    >
                      {method.status === "connected" ? "Manage" : "Connect"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">VIP Subscription Transactions</h3>
            <div className="space-y-4">
              {vipTransactions.map((tx) => (
                <Card key={tx.id} className="bg-[#1e293b] border border-[#334155] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#93c5fd]">{tx.user}</h4>
                      <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                        <div>
                          <p className="text-[#94a3b8]">Tier</p>
                          <p className="text-[#93c5fd]">{tx.tier}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Amount</p>
                          <p className="text-[#c4b5fd] font-bold">{tx.amount}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Method</p>
                          <p className="text-[#93c5fd]">{tx.method}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Date</p>
                          <p className="text-[#93c5fd]">{tx.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {tx.status === "completed" && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {tx.status === "pending" && <Clock className="w-6 h-6 text-yellow-500" />}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Merch Orders Tab */}
          <TabsContent value="merch" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">Merch Orders</h3>
            <div className="space-y-4">
              {merchOrders.map((order) => (
                <Card key={order.id} className="bg-[#1e293b] border border-[#334155] p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[#93c5fd]">{order.design}</h4>
                      <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                        <div>
                          <p className="text-[#94a3b8]">Customer</p>
                          <p className="text-[#93c5fd]">{order.user}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Amount</p>
                          <p className="text-[#c4b5fd] font-bold">{order.amount}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Status</p>
                          <p className="text-[#93c5fd] capitalize">{order.status.replace(/_/g, " ")}</p>
                        </div>
                        <div>
                          <p className="text-[#94a3b8]">Date</p>
                          <p className="text-[#93c5fd]">{order.date}</p>
                        </div>
                      </div>
                    </div>
                    {order.status === "pending_approval" && (
                      <div className="flex gap-2">
                        <Button className="btn-secondary text-sm" onClick={() => handleApproveMerch(order.id)}>
                          Approve
                        </Button>
                        <Button variant="outline" className="text-[#c4b5fd] border-[#334155] text-sm" onClick={() => handleRejectMerch(order.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">Payment Settings</h3>
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Stripe API Key</label>
                  <Input placeholder="sk_live_..." className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]" />
                </div>

                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">PayPal Business Email</label>
                  <Input placeholder="business@paypal.com" className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]" />
                </div>

                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Cash App Business Tag</label>
                  <Input placeholder="$YourBusinessTag" className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]" />
                </div>

                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Cash Payment Instructions</label>
                  <textarea placeholder="Enter payment instructions for cash payments..." className="w-full bg-[#0f172a] border border-[#334155] text-[#93c5fd] p-3 rounded min-h-24" />
                </div>

                <Button className="w-full btn-primary">Save Settings</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
