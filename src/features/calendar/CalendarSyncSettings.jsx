import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  HiOutlineClipboard,
  HiOutlineGlobeAlt,
  HiOutlineDownload,
  HiOutlineTrash,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoomIcalUrl } from "../../services/apiRooms";
import { updateCabinIcalUrl } from "../../services/apiCabins";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

const SUPABASE_FUNCTIONS_URL =
  "https://kckngulhvwryekywvutn.supabase.co/functions/v1";

const StyledSyncSettings = styled.div`
  background-color: var(--color-grey-50);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem;
  margin-top: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
`;

const SyncSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

const UrlBox = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  background-color: var(--color-grey-0);
  padding: 1.2rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-sm);
  font-family: monospace;
  font-size: 1.2rem;
  word-break: break-all;
  color: var(--color-grey-600);
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: var(--color-brand-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-brand-50);
  }
`;

function CalendarSyncSettings({ item, type }) {
  const [inboundUrl, setInboundUrl] = useState(item.icalUrl || "");
  const queryClient = useQueryClient();

  // Outbound URL (Generated)
  const outboundUrl = `${SUPABASE_FUNCTIONS_URL}/ical?${type === "room" ? "roomId" : "cabinId"}=${item.id}`;

  const { mutate, isLoading } = useMutation({
    mutationFn: (newUrl) => {
      const updateFn = type === "room" ? updateRoomIcalUrl : updateCabinIcalUrl;
      return updateFn(item.id, newUrl);
    },
    onSuccess: () => {
      toast.success("Sync settings updated successfully");
      queryClient.invalidateQueries({
        queryKey: [type === "room" ? "rooms" : "cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    setInboundUrl(item.icalUrl || "");
  }, [item.icalUrl]);

  function handleCopy() {
    navigator.clipboard.writeText(outboundUrl);
    toast.success("Outbound link copied to clipboard");
  }

  function handleSave(e) {
    e.preventDefault();
    if (inboundUrl && !inboundUrl.startsWith("http")) {
      toast.error("Please enter a valid URL starting with http");
      return;
    }
    mutate(inboundUrl || null);
  }

  return (
    <StyledSyncSettings>
      <Heading as="h3">Sync Management: {item.name}</Heading>

      <SyncSection>
        <SectionTitle>
          <HiOutlineDownload /> Outbound Sync (Your site → OTA)
        </SectionTitle>
        <p style={{ fontSize: "1.2rem", color: "var(--color-grey-500)" }}>
          Copy this link and paste it into the "Calendar Sync" or "Export"
          setting in MMT, Goibibo, or Airbnb.
        </p>
        <UrlBox>
          <span style={{ flex: 1 }}>{outboundUrl}</span>
          <CopyButton title="Copy to clipboard" onClick={handleCopy}>
            <HiOutlineClipboard />
          </CopyButton>
        </UrlBox>
      </SyncSection>

      <SyncSection>
        <SectionTitle>
          <HiOutlineGlobeAlt /> Inbound Sync (OTA → Your site)
        </SectionTitle>
        <p style={{ fontSize: "1.2rem", color: "var(--color-grey-500)" }}>
          Paste the iCal/Calendar link provided by the OTA dashboard here to
          show their blocks on your calendar.
        </p>
        <form
          onSubmit={handleSave}
          style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}
        >
          <Input
            type="url"
            placeholder="https://platform.com/calendar.ics"
            value={inboundUrl}
            onChange={(e) => setInboundUrl(e.target.value)}
            disabled={isLoading}
          />
          <div style={{ display: "flex", gap: "1.2rem" }}>
            <Button
              type="submit"
              size="medium"
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? "Saving..." : "Save Sync URL"}
            </Button>
            {item.ical_url && (
              <Button
                type="button"
                variation="danger"
                size="medium"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to clear this sync URL?",
                    )
                  ) {
                    mutate(null);
                    setInboundUrl("");
                  }
                }}
                disabled={isLoading}
              >
                <HiOutlineTrash />
              </Button>
            )}
          </div>
        </form>
      </SyncSection>
    </StyledSyncSettings>
  );
}

export default CalendarSyncSettings;
