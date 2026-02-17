"use client";

import { useState, useEffect } from "react";
import { BoardCard, type BoardCardData } from "@/components/board-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, LayoutGrid } from "lucide-react";

const DEMO_BOARDS: BoardCardData[] = [
  {
    id: "demo-b1",
    name: "Fed Watchers",
    description: "Interest rate decisions and economic policy markets",
    marketCount: 8,
    pnl: 42.5,
    paperMode: true,
    isArchived: false,
  },
  {
    id: "demo-b2",
    name: "Election 2026",
    description: "Midterm election predictions and polling markets",
    marketCount: 12,
    pnl: -15.3,
    paperMode: true,
    isArchived: false,
  },
  {
    id: "demo-b3",
    name: "Crypto Plays",
    description: "Bitcoin, Ethereum, and crypto price target markets",
    marketCount: 5,
    pnl: 128.0,
    paperMode: false,
    isArchived: false,
  },
];

export default function BoardsPage() {
  const [boards, setBoards] = useState<BoardCardData[]>(DEMO_BOARDS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/boards")
      .then((r) => r.json())
      .then((data) => {
        if (data.boards && data.boards.length > 0) {
          setBoards(
            data.boards.map((b: Record<string, unknown>) => ({
              id: b.id,
              name: b.name,
              description: b.description,
              marketCount: Number(b.marketCount) || 0,
              pnl: Number(b.pnl) || 0,
              paperMode: b.paperMode,
              isArchived: b.isArchived,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const createBoard = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (data.board) {
        setBoards((prev) => [
          {
            id: data.board.id,
            name: data.board.name,
            description: data.board.description,
            marketCount: 0,
            pnl: 0,
            paperMode: true,
            isArchived: false,
          },
          ...prev,
        ]);
      }
      setName("");
      setDescription("");
      setOpen(false);
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Boards</h1>
          <p className="text-sm text-muted-foreground">
            Curated market collections with custom strategies
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Fed Watchers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What markets will this board track?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createBoard} disabled={creating || !name.trim()}>
                {creating ? "Creating..." : "Create Board"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>

      {boards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <LayoutGrid className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">
            No boards yet
          </p>
          <p className="mb-4 text-sm text-muted-foreground/70">
            Create your first board to start organizing markets
          </p>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Board
          </Button>
        </div>
      )}
    </div>
  );
}
