"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcut";

export function KeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts({
    onHelp: () => setOpen(true),

    onEscape: () => setOpen(false),

    onSearch: () => {
      const searchInput = document.querySelector(
        'input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="Filter"]'
      ) as HTMLInputElement | null;

      searchInput?.focus();
    },

    onNew: () => {
      // Don't trigger "Create" while the shortcuts help modal is open.
      if (open) return;

      // Let the current page decide what "Create" means.
      window.dispatchEvent(new CustomEvent("route53:create"));
    },

    onGoHostedZones: () => {
      setOpen(false);
      router.push("/hosted-zones");
    },

    onGoDashboard: () => {
      setOpen(false);
      router.push("/dashboard");
    },

    onGoResolver: () => {
      setOpen(false);
      router.push("/resolver");
    },

    onGoTrafficPolicies: () => {
      setOpen(false);
      router.push("/traffic-policies");
    },
  });

  if (!open) return null;

  return (
    <div
      className="route53-modal-overlay"
      onMouseDown={() => setOpen(false)}
    >
      <div
        className="route53-modal"
        style={{ maxWidth: "620px" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="route53-modal-header">
          <div>
            <h2>Keyboard shortcuts</h2>
            <p>
              Use these shortcuts to navigate the Route 53 console faster.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          <ShortcutRow
            keys={["?"]}
            description="Open keyboard shortcuts"
          />

          <ShortcutRow
            keys={["/"]}
            description="Focus search"
          />

          <ShortcutRow
            keys={["Esc"]}
            description="Close modal"
          />

          <div
            style={{
              margin: "18px 0 10px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Navigation
          </div>

          <ShortcutRow
            keys={["g", "h"]}
            description="Go to Hosted Zones"
          />

          <ShortcutRow
            keys={["g", "d"]}
            description="Go to Dashboard"
          />

          <ShortcutRow
            keys={["g", "r"]}
            description="Go to Resolver"
          />

          <ShortcutRow
            keys={["g", "t"]}
            description="Go to Traffic Policies"
          />

          <div
            style={{
              margin: "18px 0 10px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Actions
          </div>

          <ShortcutRow
            keys={["n"]}
            description="Create new item"
          />
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        padding: "10px 0",
        borderBottom: "1px solid var(--route53-border, #e5e7eb)",
      }}
    >
      <span>{description}</span>

      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        {keys.map((key, index) => (
          <span key={`${key}-${index}`}>
            {index > 0 && (
              <span
                style={{
                  marginRight: "6px",
                  opacity: 0.6,
                }}
              >
                then
              </span>
            )}

            <kbd
              style={{
                display: "inline-flex",
                minWidth: "30px",
                height: "28px",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 8px",
                border: "1px solid var(--route53-border, #cbd5e1)",
                borderRadius: "4px",
                background: "var(--route53-surface, #f8fafc)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {key}
            </kbd>
          </span>
        ))}
      </span>
    </div>
  );
}