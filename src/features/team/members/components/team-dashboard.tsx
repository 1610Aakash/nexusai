"use client";

import { useState } from "react";
import { LoaderCircle, MailPlus, MoreHorizontal, RefreshCw, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InviteMemberDialog } from "./invite-member-dialog";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { RevokeInvitationDialog } from "./revoke-invitation-dialog";
import { useTeamViewModel } from "../viewmodel/useTeamViewModel";
import type { TeamInvitation, TeamMember } from "../model/members.model";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

export function TeamDashboard({ ownerId }: { ownerId: string }) {
  const team = useTeamViewModel();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const [revoking, setRevoking] = useState<TeamInvitation | null>(null);
  const [actionError, setActionError] = useState("");
  const [busyMemberId, setBusyMemberId] = useState("");
  const [busyInvitation, setBusyInvitation] = useState(false);
  const activeAdmins = team.members.filter((member) => member.role === "admin" && member.status === "active").length;

  const changeMember = async (member: TeamMember, patch: { role?: TeamMember["role"]; status?: TeamMember["status"] }) => {
    setActionError("");
    setBusyMemberId(member.id);
    try {
      await team.changeMember(member.id, patch);
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : "Unable to update member");
    } finally {
      setBusyMemberId("");
    }
  };

  const confirmRemove = async () => {
    if (!removing) return;
    setBusyMemberId(removing.id);
    setActionError("");
    try {
      await team.remove(removing.id);
      setRemoving(null);
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : "Unable to remove member");
    } finally {
      setBusyMemberId("");
    }
  };

  const confirmRevokeInvitation = async () => {
    if (!revoking) return;
    setActionError("");
    setBusyInvitation(true);
    try {
      await team.revoke(revoking.id);
      setRevoking(null);
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : "Unable to revoke invitation");
    } finally {
      setBusyInvitation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-700">Organization</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Team members</h1>
          <p className="mt-1 text-sm text-slate-500">Manage membership and invitations for the current workspace.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void team.refresh()} disabled={team.loading}>
            <RefreshCw data-icon="inline-start" className={team.loading ? "animate-spin" : ""} /> Refresh
          </Button>
          <Button onClick={() => setInviteOpen(true)}><MailPlus data-icon="inline-start" /> Invite member</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active members", value: team.members.filter((member) => member.status === "active").length, icon: UsersRound },
          { label: "Administrators", value: activeAdmins, icon: ShieldCheck },
          { label: "Pending invitations", value: team.invitations.length, icon: MailPlus },
        ].map((item) => (
          <Card key={item.label} className="flex flex-row items-center gap-4 rounded-2xl border-slate-200 p-5 shadow-none">
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><item.icon className="size-5" /></span>
            <div><p className="text-xl font-semibold text-slate-950">{item.value}</p><p className="text-xs text-slate-500">{item.label}</p></div>
          </Card>
        ))}
      </div>

      {(team.error || actionError) && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{actionError || team.error}</span>
          <Button variant="ghost" size="sm" onClick={() => { setActionError(""); void team.refresh(); }}>Try again</Button>
        </div>
      )}

      <Card className="gap-0 rounded-2xl border-slate-200 p-0 shadow-none">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div><h2 className="font-semibold text-slate-900">Members</h2><p className="mt-1 text-xs text-slate-500">Organization roles apply only to this workspace.</p></div>
          <Badge variant="secondary">{team.members.length} members</Badge>
        </div>
        {team.loading ? (
          <div role="status" className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><LoaderCircle className="size-4 animate-spin" /> Loading members…</div>
        ) : team.members.length === 0 ? (
          <div className="p-12 text-center"><UsersRound className="mx-auto size-8 text-slate-300" /><p className="mt-3 font-medium text-slate-800">No team members yet</p><p className="mt-1 text-sm text-slate-500">Invite a teammate to collaborate in this workspace.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="hidden md:table-cell">Joined</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
              <TableBody>
                {team.members.map((member) => {
                  const isOwner = member.userId === ownerId;
                  const isLastAdmin = member.role === "admin" && member.status === "active" && activeAdmins <= 1;
                  const isBusy = busyMemberId === member.id;
                  return (
                    <TableRow key={member.id}>
                      <TableCell className="min-w-[220px]">
                        <div className="flex items-center gap-3">
                          <Avatar><AvatarFallback className="bg-slate-100 text-xs font-medium text-slate-600">{member.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</AvatarFallback></Avatar>
                          <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-900">{member.name}{isOwner && <span className="ml-2 text-[10px] text-slate-400">Owner</span>}</p><p className="truncate text-xs text-slate-500">{member.email}</p></div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          aria-label={`Role for ${member.name}`}
                          value={member.role}
                          disabled={isOwner || isBusy || (isLastAdmin && member.role === "admin")}
                          onChange={(event) => {
                            const role = event.target.value;
                            if (role === "admin" || role === "agent") {
                              void changeMember(member, { role });
                            }
                          }}
                          className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <option value="admin">Admin</option><option value="agent">Agent</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={member.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-xs text-slate-500 md:table-cell">{formatDate(member.joinedAt)}</TableCell>
                      <TableCell>
                        {isBusy ? <LoaderCircle className="size-4 animate-spin text-slate-400" /> : !isOwner && (
                          <details className="group relative">
                            <summary aria-label={`Actions for ${member.name}`} className="flex size-8 cursor-pointer list-none items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"><MoreHorizontal className="size-4" /></summary>
                            <div className="absolute right-0 top-9 z-20 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                              <button type="button" onClick={() => void changeMember(member, { status: member.status === "active" ? "suspended" : "active" })} disabled={isLastAdmin && member.status === "active"} className="w-full rounded-md px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                                {member.status === "active" ? "Suspend access" : "Restore access"}
                              </button>
                              <button type="button" onClick={() => { setActionError(""); setRemoving(member); }} disabled={isLastAdmin} className="w-full rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 disabled:opacity-50">
                                Remove from team
                              </button>
                            </div>
                          </details>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="gap-0 rounded-2xl border-slate-200 p-0 shadow-none">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div><h2 className="font-semibold text-slate-900">Pending invitations</h2><p className="mt-1 text-xs text-slate-500">Invitation links expire after seven days.</p></div>
          <Badge variant="secondary">{team.invitations.length} pending</Badge>
        </div>
        {team.invitations.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No pending invitations.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {team.invitations.map((invitation) => (
              <div key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar><AvatarFallback className="bg-sky-50 text-sky-700"><UserRound className="size-4" /></AvatarFallback></Avatar>
                  <div className="min-w-0"><p className="truncate text-sm font-medium text-slate-800">{invitation.email}</p><p className="text-xs text-slate-500">Invited as {invitation.role} · Expires {formatDate(invitation.expiresAt)}</p></div>
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => { setActionError(""); setRevoking(invitation); }}>Revoke</Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={team.invite} />
      <RemoveMemberDialog
        member={removing}
        busy={Boolean(busyMemberId)}
        error={actionError}
        onOpenChange={(open) => { if (!open) setRemoving(null); }}
        onConfirm={() => void confirmRemove()}
      />
      <RevokeInvitationDialog
        invitation={revoking}
        busy={busyInvitation}
        error={actionError}
        onOpenChange={(open) => { if (!open) setRevoking(null); }}
        onConfirm={() => void confirmRevokeInvitation()}
      />
    </div>
  );
}
