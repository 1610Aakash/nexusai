"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchTeam,
  inviteMember,
  removeMember,
  revokeInvitation,
  updateMember,
  type InvitationFormValues,
  type TeamInvitation,
  type TeamMember,
} from "../model/members.model";

export function useTeamViewModel() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    try {
      const data = await fetchTeam();
      setMembers(data.members);
      setInvitations(data.invitations);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTeam()
      .then((data) => {
        setMembers(data.members);
        setInvitations(data.invitations);
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "Unable to load team");
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  const invite = async (values: InvitationFormValues) => {
    await inviteMember(values);
    await refresh();
  };

  const revoke = async (invitationId: string) => {
    await revokeInvitation(invitationId);
    await refresh();
  };

  const changeMember = async (
    memberId: string,
    patch: { role?: TeamMember["role"]; status?: TeamMember["status"] },
  ) => {
    await updateMember(memberId, patch);
    await refresh();
  };

  const remove = async (memberId: string) => {
    await removeMember(memberId);
    await refresh();
  };

  return {
    members,
    invitations,
    loading,
    error,
    refresh,
    invite,
    revoke,
    changeMember,
    remove,
  };
}
