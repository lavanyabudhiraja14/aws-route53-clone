"use client";

import { useEffect } from "react";

type ShortcutHandlers = {
  onHelp?: () => void;
  onEscape?: () => void;
  onSearch?: () => void;
  onNew?: () => void;
  onGoHostedZones?: () => void;
  onGoDashboard?: () => void;
  onGoResolver?: () => void;
  onGoTrafficPolicies?: () => void;
};

export function useKeyboardShortcuts({
  onHelp,
  onEscape,
  onSearch,
  onNew,
  onGoHostedZones,
  onGoDashboard,
  onGoResolver,
  onGoTrafficPolicies,
}: ShortcutHandlers) {
  useEffect(() => {
    let sequence = "";
    let sequenceTimeout: ReturnType<typeof setTimeout> | null = null;

    const isTyping = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;

      if (!element) return false;

      const tag = element.tagName?.toLowerCase();

      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape should always work.
      if (event.key === "Escape") {
        onEscape?.();
        sequence = "";
        return;
      }

      // Don't activate shortcuts while typing.
      if (isTyping(event.target)) {
        return;
      }

      // ? → keyboard shortcuts
      if (event.key === "?") {
        event.preventDefault();
        onHelp?.();
        return;
      }

      // / → search
      if (event.key === "/") {
        event.preventDefault();
        onSearch?.();
        return;
      }

      // n → new
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        onNew?.();
        return;
      }

      // g → navigation sequence
      if (event.key.toLowerCase() === "g") {
        sequence = "g";

        if (sequenceTimeout) {
          clearTimeout(sequenceTimeout);
        }

        sequenceTimeout = setTimeout(() => {
          sequence = "";
        }, 1000);

        return;
      }

      if (sequence === "g") {
        const key = event.key.toLowerCase();

        switch (key) {
          case "h":
            onGoHostedZones?.();
            break;

          case "d":
            onGoDashboard?.();
            break;

          case "r":
            onGoResolver?.();
            break;

          case "t":
            onGoTrafficPolicies?.();
            break;
        }

        sequence = "";

        if (sequenceTimeout) {
          clearTimeout(sequenceTimeout);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
    };
  }, [
    onHelp,
    onEscape,
    onSearch,
    onNew,
    onGoHostedZones,
    onGoDashboard,
    onGoResolver,
    onGoTrafficPolicies,
  ]);
}