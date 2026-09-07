"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { HostedZone, ZoneType } from "@/lib/types";
import { useToast } from "@/components/toast";
import {
  DangerButton,
  Field,
  Modal,
  PrimaryButton,
  SecondaryButton,
  inputClass,
} from "@/components/ui";

const PAGE_SIZE = 10;

export default function HostedZonesPage() {
  const router = useRouter();
  const toast = useToast();
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | ZoneType>("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listHostedZones(term || undefined);
      setZones(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Failed to load hosted zones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      void load(search);
    }, 250);
    return () => clearTimeout(t);
  }, [search, load]);

  const filtered = useMemo(() => {
    if (typeFilter === "All") return zones;
    return zones.filter((z) => z.type === typeFilter);
  }, [zones, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedZone = zones.find((z) => z.id === selected) ?? null;

  return (
    <div className="route53-hosted-zones-page">
      <div className="route53-breadcrumbs route53-hosted-zones-breadcrumb">
        <Link href="/hosted-zones">Route 53</Link>
        <span>›</span>
        <span>Hosted zones</span>
      </div>

      <section className="route53-hosted-zones-card">
        <div className="route53-hosted-zones-header">
          <h1>Hosted zones ({filtered.length})</h1>
          <div className="route53-hosted-zones-actions">
            <SecondaryButton onClick={() => void load(search)} aria-label="Refresh">↻</SecondaryButton>
            <SecondaryButton
              disabled={!selectedZone}
              onClick={() => {
                if (selectedZone) router.push(`/hosted-zones/${selectedZone.id}`);
              }}
            >
              View details
            </SecondaryButton>
            <SecondaryButton disabled={!selectedZone} onClick={() => setEditOpen(true)}>Edit</SecondaryButton>
            <SecondaryButton disabled={!selectedZone} onClick={() => setDeleteOpen(true)}>Delete</SecondaryButton>
            <PrimaryButton onClick={() => setCreateOpen(true)}>Create hosted zone</PrimaryButton>
          </div>
        </div>

        <div className="route53-automatic-mode">
          Automatic mode is the current search behavior optimized for best filter results.
          <span> To change modes go to settings.</span>
        </div>

        <div className="route53-hosted-zones-filter">
          <div className="route53-hosted-zones-search">
            <div className="route53-hosted-zones-label">Search</div>
            <div className="route53-search-field">
              <span>⌕</span>
              <input
                className={inputClass}
                placeholder="Filter records by property or value"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="route53-hosted-zones-type">
            <div className="route53-hosted-zones-label">Type</div>
            <select
              className={inputClass}
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as "All" | ZoneType);
                setPage(1);
              }}
            >
              <option value="All">All types</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="route53-alert route53-alert-error">{error}</div>
        ) : null}

        <div className="route53-hosted-zones-table">
          <table className="aws-table">
            <thead>
              <tr>
                <th className="route53-radio-column" />
                <th>Hosted zone name</th>
                <th>Type</th>
                <th>Record count</th>
                <th>Comment</th>
                <th>Created</th>
                <th>Hosted zone ID</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="route53-table-empty">Loading hosted zones…</td></tr>
              ) : pageItems.length === 0 ? (
                <tr><td colSpan={7} className="route53-table-empty">No hosted zones found.</td></tr>
              ) : (
                pageItems.map((zone) => (
                  <tr key={zone.id}>
                    <td className="route53-radio-column">
                      <input type="radio" name="zone" checked={selected === zone.id} onChange={() => setSelected(zone.id)} />
                    </td>
                    <td>
                      <Link href={`/hosted-zones/${zone.id}`} className="route53-zone-link">{zone.name}</Link>
                    </td>
                    <td>{zone.type}</td>
                    <td>{zone.record_count}</td>
                    <td className="route53-muted-cell">{zone.comment || "—"}</td>
                    <td className="route53-muted-cell">{new Date(zone.created_at).toLocaleString()}</td>
                    <td className="route53-zone-id">{zone.id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="route53-hosted-zones-pagination">
            <span>{filtered.length} hosted zone{filtered.length === 1 ? "" : "s"}</span>
            <div>
              <SecondaryButton disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</SecondaryButton>
              <span className="route53-page-number">Page {page} of {pageCount}</span>
              <SecondaryButton disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>Next</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {createOpen ? (
        <ZoneFormModal title="Create hosted zone" onClose={() => setCreateOpen(false)} onSaved={() => { setCreateOpen(false); void load(search); }} />
      ) : null}
      {editOpen && selectedZone ? (
        <ZoneFormModal title="Edit hosted zone" zone={selectedZone} onClose={() => setEditOpen(false)} onSaved={() => { setEditOpen(false); void load(search); }} />
      ) : null}
      {deleteOpen && selectedZone ? (
        <Modal
          title="Delete hosted zone"
          onClose={() => setDeleteOpen(false)}
          footer={
            <>
              <SecondaryButton onClick={() => setDeleteOpen(false)}>Cancel</SecondaryButton>
              <DangerButton onClick={async () => {
                try {
                  await api.deleteHostedZone(selectedZone.id);
                  toast.success("Hosted zone deleted", `${selectedZone.name} was deleted successfully.`);
                  setDeleteOpen(false);
                  setSelected(null);
                  void load(search);
                } catch (err) {
                  const message = err instanceof ApiError ? err.detail : "Delete failed";
                  setError(message);
                  toast.error("Failed to delete hosted zone", message);
                  setDeleteOpen(false);
                }
              }}>Delete</DangerButton>
            </>
          }
        >
          <p className="text-[13px]">Delete hosted zone <strong>{selectedZone.name}</strong>? All records in the zone will be removed.</p>
        </Modal>
      ) : null}
    </div>
  );
}

function ZoneFormModal({
  title,
  zone,
  onClose,
  onSaved,
}: {
  title: string;
  zone?: HostedZone;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState(zone?.name ?? "");
  const [type, setType] = useState<ZoneType>(zone?.type ?? "Public");
  const [comment, setComment] = useState(zone?.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
  
    try {
      if (zone) {
        await api.updateHostedZone(zone.id, { name, type, comment });
  
        toast.success(
          "Hosted zone updated",
          `${name} was updated successfully.`,
        );
      } else {
        await api.createHostedZone({ name, type, comment });
  
        toast.success(
          "Hosted zone created",
          `${name} was created successfully.`,
        );
      }
  
      onSaved();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.detail
          : "Unable to save hosted zone";
  
      setError(message);
  
      toast.error(
        zone
          ? "Failed to update hosted zone"
          : "Failed to create hosted zone",
        message,
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
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton disabled={saving || !name.trim()} onClick={() => void save()}>
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
      <Field label="Domain name" hint="For example, example.com">
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Type">
        <select
          className={inputClass}
          value={type}
          onChange={(e) => setType(e.target.value as ZoneType)}
        >
          <option value="Public">Public hosted zone</option>
          <option value="Private">Private hosted zone</option>
        </select>
      </Field>
      <Field label="Comment — optional">
        <textarea
          className={inputClass}
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Field>
    </Modal>
  );
}
