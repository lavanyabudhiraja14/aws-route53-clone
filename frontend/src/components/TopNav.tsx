"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { AwsSmile } from "@/components/AwsLogo";

export function TopNav() {
  const { username, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <header className="aws-topnav">
      {/* AWS */}
      <div className="aws-topnav-logo">
        <AwsSmile className="aws-logo-image" />
      </div>

      {/* Services */}
      <button
        type="button"
        className="aws-topnav-services"
      >
        <span className="services-grid">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>

        <span>Services</span>
      </button>

      {/* Search */}
      <div className="aws-topnav-search">
        <span className="aws-search-icon">⌕</span>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search"
          aria-label="Search"
        />

        <span className="aws-search-shortcut">
          [Alt+S]
        </span>
      </div>

      {/* Right side */}
      <div className="aws-topnav-right">

        {/* CloudShell */}
        <button
          type="button"
          className="aws-topnav-icon"
          aria-label="CloudShell"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 5h16v14H4z" />
            <path d="m8 9 3 3-3 3" />
            <path d="M13 15h3" />
          </svg>
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="aws-topnav-icon"
          aria-label="Notifications"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        </button>

        {/* Help */}
        <button
          type="button"
          className="aws-topnav-icon"
          aria-label="Help"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.9.7-1.7 1.2-1.7 2.7" />
            <circle
              cx="12"
              cy="16.5"
              r=".7"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Settings */}
        <button
          type="button"
          className="aws-topnav-icon aws-settings-button"
          aria-label="Settings"
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20h-2v-.3a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1A1.7 1.7 0 0 0 7.2 15a1.7 1.7 0 0 0-1.6-1H5v-2h.6a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.5-1.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V6h2v.3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.3v2h-.3a1.7 1.7 0 0 0-1.6 1Z" />
          </svg>
        </button>

        {/* Region */}
        <button
          type="button"
          className="aws-topnav-menu-button"
        >
          <span>Global</span>
          <span className="aws-chevron">▼</span>
        </button>

        {/* Account */}
        <div className="aws-account">
          <button
            type="button"
            className="aws-topnav-account"
            onClick={() => setAccountOpen((value) => !value)}
          >
            <span>{username || "Account"}</span>
            <span className="aws-chevron">▼</span>
          </button>

          {accountOpen && (
            <div className="aws-account-dropdown">
              <div className="aws-account-header">
                <span>Signed in as</span>
                <strong>{username || "admin"}</strong>
              </div>

              <button
                type="button"
                className="aws-signout"
                onClick={() => {
                  setAccountOpen(false);
                  void logout();
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}