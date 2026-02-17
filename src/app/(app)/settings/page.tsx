"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Key, Shield, Bell, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [memberId, setMemberId] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  const [maxWager, setMaxWager] = useState("10");
  const [maxDailyExposure, setMaxDailyExposure] = useState("100");
  const [maxConcentration, setMaxConcentration] = useState("25");

  const connectKalshi = async () => {
    if (!apiKey.trim() || !memberId.trim()) return;
    setConnecting(true);
    setError("");
    try {
      const res = await fetch("/api/kalshi/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, memberId }),
      });
      const data = await res.json();
      if (data.success) {
        setConnected(true);
        setApiKey("");
      } else {
        setError(data.error || "Failed to connect");
      }
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, API connections, and risk parameters
        </p>
      </div>

      {/* Kalshi API Connection */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4 text-primary" />
            Kalshi API Connection
            {connected && (
              <Badge className="ml-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <CheckCircle className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your Kalshi account to enable live trading. Your API key is
            encrypted and stored securely.
          </p>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="memberId">Member ID</Label>
              <Input
                id="memberId"
                placeholder="Your Kalshi member ID"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Your Kalshi API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <Button
            onClick={connectKalshi}
            disabled={connecting || !apiKey.trim() || !memberId.trim()}
            className="w-full"
          >
            {connecting ? "Connecting..." : "Connect Kalshi Account"}
          </Button>
        </CardContent>
      </Card>

      {/* Default Risk Parameters */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-primary" />
            Default Risk Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Set default risk limits for new boards. These can be overridden
            per-board.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="maxWager">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-3 w-3" />
                  Max Wager
                </span>
              </Label>
              <Input
                id="maxWager"
                type="number"
                value={maxWager}
                onChange={(e) => setMaxWager(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxExposure">Daily Exposure</Label>
              <Input
                id="maxExposure"
                type="number"
                value={maxDailyExposure}
                onChange={(e) => setMaxDailyExposure(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxConc">Concentration %</Label>
              <Input
                id="maxConc"
                type="number"
                value={maxConcentration}
                onChange={(e) => setMaxConcentration(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          <Button variant="secondary" className="w-full">
            Save Risk Defaults
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification preferences coming soon. You&apos;ll be able to set up
            alerts for edge signals, trade fills, and settlement events.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
