"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  soon?: boolean;
};

const topItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Hosted zones",
    href: "/hosted-zones",
  },
  {
    label: "Health checks",
    href: "/health-checks",
  },
];

const sections: {
  title: string;
  items: NavItem[];
}[] = [
  {
    title: "IP-based routing",
    items: [
      {
        label: "CIDR collections",
        href: "/cidr-collections",
        soon: true,
      },
    ],
  },
  {
    title: "Traffic flow",
    items: [
      {
        label: "Traffic policies",
        href: "/traffic-policies",
        soon: true,
      },
      {
        label: "Policy records",
        href: "/traffic-policies",
        soon: true,
      },
    ],
  },
  {
    title: "Domains",
    items: [
      {
        label: "Registered domains",
        href: "/registered-domains",
        soon: true,
      },
      {
        label: "Requests",
        href: "/requests",
        soon: true,
      },
    ],
  },
  {
    title: "Resolver",
    items: [
      {
        label: "VPCs",
        href: "/resolver",
        soon: true,
      },
      {
        label: "Inbound endpoints",
        href: "/resolver",
        soon: true,
      },
      {
        label: "Outbound endpoints",
        href: "/resolver",
        soon: true,
      },
      {
        label: "Rules",
        href: "/resolver",
        soon: true,
      },
      {
        label: "Query logging",
        href: "/resolver",
        soon: true,
      },
      {
        label: "Outposts",
        href: "/resolver",
        soon: true,
      },
    ],
  },
];

function SidebarLink({
  item,
  active,
  nested = false,
}: {
  item: NavItem;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={[
        "route53-sidebar-link",
        nested ? "route53-sidebar-link-nested" : "",
        active ? "route53-sidebar-link-active" : "",
      ].join(" ")}
    >
      <span>{item.label}</span>

      {item.soon && (
        <span className="route53-sidebar-soon">
          Soon
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="route53-sidebar">
      {/* Header */}
      <div className="route53-sidebar-header">
        <span className="route53-sidebar-title">
          Route 53
        </span>

        <button
          type="button"
          className="route53-sidebar-close"
          aria-label="Close navigation"
        >
          ×
        </button>
      </div>

      {/* Main navigation */}
      <nav className="route53-sidebar-nav">
        <div className="route53-sidebar-top">
          {topItems.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
            />
          ))}
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div
            key={section.title}
            className="route53-sidebar-section"
          >
            <div className="route53-sidebar-section-title">
              <span className="route53-sidebar-chevron">
                ▼
              </span>

              <span>{section.title}</span>
            </div>

            <div className="route53-sidebar-section-items">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  nested
                  active={isActive(item.href)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Profiles */}
        <div className="route53-sidebar-section route53-sidebar-profiles">
          <SidebarLink
            item={{
              label: "Profiles",
              href: "/profiles",
              soon: true,
            }}
            active={isActive("/profiles")}
          />
        </div>
      </nav>
    </aside>
  );
}