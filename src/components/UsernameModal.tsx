import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUsername, setUsername, validateUsername } from "@/lib/username";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (name: string) => void;
}

export default function UsernameModal({ open, onOpenChange, onSaved }: Props) {
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(getUsername() ?? "");
      setErr(null);
    }
  }, [open]);

  const submit = () => {
    const trimmed = name.trim();
    const e = validateUsername(trimmed);
    if (e) { setErr(e); return; }
    setUsername(trimmed);
    onSaved?.(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Bạn muốn được gọi là gì?</DialogTitle>
          <DialogDescription>
            Đặt một danh xưng thân thiện để cộng đồng nhận ra bạn. Không cần đăng ký tài khoản.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            autoFocus
            placeholder="vd: Bà Lan, chị Hoa, anh Minh..."
            value={name}
            onChange={(e) => { setName(e.target.value); setErr(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            maxLength={30}
          />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <p className="text-xs text-muted-foreground">
            Chỉ chữ, số, dấu <code>_</code> hoặc <code>-</code>. Tối đa 30 ký tự.
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-primary-foreground">
            Lưu danh xưng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
