"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/toast";
import type { DnsRecord, HostedZone, RecordType } from "@/lib/types";
import { RECORD_TYPES, ROUTING_POLICIES } from "@/lib/types";
import {
  DangerButton,
  Field,
  Modal,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/components/ui";

const PAGE_SIZE = 10;

export default function ZoneRecordsPage() {
  const params = useParams<{ id: string }>();
  const zoneId = Number(params.id);

  const [zone, setZone] = useState<HostedZone | null>(null);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | RecordType>("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<number | null>(null);
  const [bulkSelected, setBulkSelected] = useState<number[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    const handleCreateShortcut = () => {
      setCreateOpen(true);
    };

    window.addEventListener("route53:create", handleCreateShortcut);

    return () => {
      window.removeEventListener("route53:create", handleCreateShortcut);
    };
  }, []);

  const toast = useToast();

  const load = useCallback(
    async (term: string) => {
      if (!Number.isFinite(zoneId)) return;

      setLoading(true);
      setError(null);

      try {
        const [z, recs] = await Promise.all([
          api.getHostedZone(zoneId),
          api.listRecords(zoneId, term || undefined),
        ]);

        setZone(z);
        setRecords(recs);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.detail
            : "Failed to load records";

        setError(message);
        toast.error("Failed to load records", message);
      } finally {
        setLoading(false);
      }
    },
    [zoneId, toast]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      void load(search);
    }, 250);

    return () => clearTimeout(t);
  }, [search, load]);

  const filtered = useMemo(() => {
    if (typeFilter === "All") return records;

    return records.filter((r) => r.type === typeFilter);
  }, [records, typeFilter]);

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const pageItems = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const selectedRecord =
    records.find((r) => r.id === selected) ?? null;

  const pageRecordIds = pageItems.map((record) => record.id);

  const allPageSelected =
      pageRecordIds.length > 0 &&
      pageRecordIds.every((id) => bulkSelected.includes(id));
    
  function toggleBulkRecord(recordId: number) {
      setBulkSelected((current) =>
        current.includes(recordId)
          ? current.filter((id) => id !== recordId)
          : [...current, recordId],
      );
    }
    
  function toggleAllPageRecords() {
      setBulkSelected((current) => {
        if (allPageSelected) {
          return current.filter((id) => !pageRecordIds.includes(id));
        }
    
        return Array.from(new Set([...current, ...pageRecordIds]));
      });
    }

  function exportJson() {
    if (!zone) {
      toast.error("Unable to export", "Hosted zone information is not available.");
      return;
    }

    const exportData = {
      hostedZone: {
        id: zone.id,
        name: zone.name,
        type: zone.type,
        comment: zone.comment,
        record_count: zone.record_count,
        created_at: zone.created_at,
      },
      records: records.map((record) => ({
        id: record.id,
        name: record.name,
        type: record.type,
        ttl: record.ttl,
        value: record.value,
        routing_policy: record.routing_policy,
      })),
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeZoneName = zone.name
      .replace(/\.$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    link.href = url;
    link.download = `${safeZoneName || "hosted-zone"}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success(
      "Hosted zone exported",
      `${zone.name} was exported as a JSON file.`
    );
  }

  return (
    <div>
      <div className="mb-3 text-[13px] text-[#545b64]">
        <Link
          href="/hosted-zones"
          className="text-[#0073bb] hover:underline"
        >
          Hosted zones
        </Link>

        <span className="mx-1">/</span>

        <span>{zone?.name ?? "…"}</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-normal text-[#16191f]">
            Records
          </h1>

          <p className="text-[13px] text-[#545b64]">
            {zone
              ? `${zone.name} · ${zone.type} hosted zone · ${zone.record_count} records`
              : "Loading hosted zone…"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SecondaryButton
            onClick={exportJson}
            disabled={!zone || loading}
          >
            Export JSON
          </SecondaryButton>

          <SecondaryButton
            disabled={!selectedRecord}
            onClick={() => setEditOpen(true)}
          >
            Edit
          </SecondaryButton>

          <SecondaryButton
            disabled={!selectedRecord}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </SecondaryButton>

          {bulkSelected.length > 0 ? (
            <DangerButton onClick={() => setBulkDeleteOpen(true)}>
              Delete selected ({bulkSelected.length})
            </DangerButton>
          ) : null}

          <PrimaryButton onClick={() => setCreateOpen(true)}>
            Create record
          </PrimaryButton>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-end gap-3">
        <div className="min-w-[240px] flex-1">
          <div className="mb-1 text-[12px] font-bold">
            Search
          </div>

          <input
            className={inputClass}
            placeholder="Search by name, type, or value"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <div className="mb-1 text-[12px] font-bold">
            Record type
          </div>

          <select
            className={inputClass}
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(
                e.target.value as "All" | RecordType
              );
              setPage(1);
            }}
          >
            <option value="All">All types</option>

            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="mb-3 rounded-sm border border-[#d13212] bg-[#fdf3f1] px-3 py-2 text-[13px] text-[#d13212]">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-sm border border-[#d5dbdb] bg-white">
        <table className="aws-table w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#eaeded]">
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAllPageRecords}
                  aria-label="Select all records on this page"
                />
              </th>
              <th className="px-3 py-2">Record name</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Routing policy</th>
              <th className="px-3 py-2">TTL (seconds)</th>
              <th className="px-3 py-2">Value</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-[#545b64]"
                >
                  Loading records…
                </td>
              </tr>
            ) : pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-[#545b64]"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              pageItems.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[#eaeded]"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={bulkSelected.includes(record.id)}
                        onChange={() => toggleBulkRecord(record.id)}
                        aria-label={`Select ${record.name}`}
                      />

                      <input
                        type="radio"
                        name="record"
                        checked={selected === record.id}
                        onChange={() => setSelected(record.id)}
                        aria-label={`Choose ${record.name} for editing`}
                      />
                    </div>
                  </td>

                  <td className="px-3 py-2 font-medium">
                    {record.name}
                  </td>

                  <td className="px-3 py-2">
                    {record.type}
                  </td>

                  <td className="px-3 py-2">
                    {record.routing_policy}
                  </td>

                  <td className="px-3 py-2">
                    {record.ttl}
                  </td>

                  <td className="max-w-xs truncate px-3 py-2 font-mono text-[12px]">
                    {record.value}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-[#eaeded] bg-[#fafafa] px-3 py-2 text-[12px] text-[#545b64]">
          <span>
            {filtered.length} record
            {filtered.length === 1 ? "" : "s"}
          </span>

          <div className="flex items-center gap-2">
            <SecondaryButton
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </SecondaryButton>

            <span>
              Page {page} of {pageCount}
            </span>

            <SecondaryButton
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </SecondaryButton>
          </div>
        </div>
      </div>

      {createOpen ? (
        <RecordFormModal
          title="Create record"
          zoneId={zoneId}
          onClose={() => setCreateOpen(false)}
          onSaved={() => {
            setCreateOpen(false);
            void load(search);
          }}
        />
      ) : null}

      {editOpen && selectedRecord ? (
        <RecordFormModal
          title="Edit record"
          zoneId={zoneId}
          record={selectedRecord}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false);
            void load(search);
          }}
        />
      ) : null}

      {deleteOpen && selectedRecord ? (
        <Modal
          title="Delete record"
          onClose={() => setDeleteOpen(false)}
          footer={
            <>
              <SecondaryButton
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </SecondaryButton>

              <DangerButton
                onClick={async () => {
                  try {
                    await api.deleteRecord(
                      zoneId,
                      selectedRecord.id
                    );

                    toast.success(
                      "Record deleted",
                      `${selectedRecord.name} (${selectedRecord.type}) was deleted successfully.`
                    );

                    setDeleteOpen(false);
                    setSelected(null);

                    void load(search);
                  } catch (err) {
                    const message =
                      err instanceof ApiError
                        ? err.detail
                        : "Delete failed";

                    setError(message);

                    toast.error(
                      "Failed to delete record",
                      message
                    );

                    setDeleteOpen(false);
                  }
                }}
              >
                Delete
              </DangerButton>
            </>
          }
        >
          <p className="text-[13px]">
            Delete record{" "}
            <strong>{selectedRecord.name}</strong>{" "}
            ({selectedRecord.type})?
          </p>
        </Modal>
      ) : null}

      {bulkDeleteOpen ? (
        <Modal
          title="Delete selected records"
          onClose={() => {
            if (!bulkDeleting) {
              setBulkDeleteOpen(false);
            }
          }}
          footer={
            <>
              <SecondaryButton
                disabled={bulkDeleting}
                onClick={() => setBulkDeleteOpen(false)}
              >
                Cancel
              </SecondaryButton>

              <DangerButton
                disabled={bulkDeleting}
                onClick={async () => {
                  setBulkDeleting(true);

                  try {
                    await api.deleteRecordsBulk(zoneId, bulkSelected);

                    toast.success(
                      "Records deleted",
                      `${bulkSelected.length} DNS records were deleted successfully.`
                    );

                    setBulkSelected([]);
                    setBulkDeleteOpen(false);
                    setSelected(null);

                    await load(search);
                  } catch (err) {
                    const message =
                      err instanceof ApiError
                        ? err.detail
                        : "Bulk delete failed";

                    setError(message);

                    toast.error(
                      "Failed to delete records",
                      message
                    );
                  } finally {
                    setBulkDeleting(false);
                  }
                }}
              >
                {bulkDeleting ? "Deleting…" : "Delete"}
              </DangerButton>
            </>
          }
        >
          <p className="text-[13px]">
            Are you sure you want to delete{" "}
            <strong>{bulkSelected.length} DNS records</strong>?
          </p>

          <p className="mt-2 text-[13px] text-[#545b64]">
            This action cannot be undone.
          </p>
        </Modal>
      ) : null}
    </div>
  );
}

function RecordFormModal({
  title,
  zoneId,
  record,
  onClose,
  onSaved,
}: {
  title: string;
  zoneId: number;
  record?: DnsRecord;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(
    record?.name ?? ""
  );

  const [type, setType] = useState<RecordType>(
    record?.type ?? "A"
  );

  const [ttl, setTtl] = useState(
    String(record?.ttl ?? 300)
  );

  const [value, setValue] = useState(
    record?.value ?? ""
  );

  const [routingPolicy, setRoutingPolicy] = useState(
    record?.routing_policy ?? "Simple"
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const toast = useToast();

  async function save() {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name,
        type,
        ttl: Number(ttl),
        value,
        routing_policy: routingPolicy,
      };

      if (record) {
        await api.updateRecord(
          zoneId,
          record.id,
          payload
        );

        toast.success(
          "Record updated",
          `${name} (${type}) was updated successfully.`
        );
      } else {
        await api.createRecord(
          zoneId,
          payload
        );

        toast.success(
          "Record created",
          `${name} (${type}) was created successfully.`
        );
      }

      onSaved();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.detail
          : "Unable to save record";

      setError(message);

      toast.error(
        record
          ? "Failed to update record"
          : "Failed to create record",
        message
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <SecondaryButton onClick={onClose}>
            Cancel
          </SecondaryButton>

          <PrimaryButton
            disabled={
              saving ||
              !name.trim() ||
              !value.trim()
            }
            onClick={() => void save()}
          >
            {saving ? "Saving…" : "Save"}
          </PrimaryButton>
        </>
      }
    >
      {error ? (
        <div className="mb-3 rounded-sm border border-[#d13212] bg-[#fdf3f1] px-3 py-2 text-[13px] text-[#d13212]">
          {error}
        </div>
      ) : null}

      <Field label="Record name">
        <input
          className={inputClass}
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />
      </Field>

      <Field label="Record type">
        <select
          className={inputClass}
          value={type}
          onChange={(e) =>
            setType(
              e.target.value as RecordType
            )
          }
        >
          {RECORD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="TTL (seconds)">
        <input
          className={inputClass}
          type="number"
          min={0}
          value={ttl}
          onChange={(e) =>
            setTtl(e.target.value)
          }
        />
      </Field>

      <Field label="Value">
        <textarea
          className={inputClass}
          rows={3}
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          placeholder="192.0.2.1"
        />
      </Field>

      <Field label="Routing policy">
        <select
          className={inputClass}
          value={routingPolicy}
          onChange={(e) =>
            setRoutingPolicy(e.target.value)
          }
        >
          {ROUTING_POLICIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </Field>
    </Modal>
  );
}