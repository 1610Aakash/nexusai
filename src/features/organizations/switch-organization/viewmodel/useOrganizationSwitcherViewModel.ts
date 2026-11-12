"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { switchOrganizationRequest } from "../model/switch-organization.model";

export function useOrganizationSwitcherViewModel(currentId: string) {
  const router = useRouter();
  const [error, setError] = useState("");

  const switchTo = async (organizationId: string) => {
    if (organizationId === currentId) return;
    setError("");
    try {
      await switchOrganizationRequest(organizationId);
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to switch workspace");
    }
  };

  return { switchTo, error };
}
