"use client";

import { LoaderCircle, MailX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TeamInvitation } from "../model/members.model";

export function RevokeInvitationDialog({
  invitation,
  busy,
  error,
  onOpenChange,
  onConfirm,
}: {
  invitation: TeamInvitation | null;
  busy: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={Boolean(invitation)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke this invitation?</DialogTitle>
          <DialogDescription>
            {invitation ? `The invitation sent to ${invitation.email} will no longer be valid.` : ""}
          </DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Keep invitation</Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <MailX className="size-4" />}
            Revoke invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
