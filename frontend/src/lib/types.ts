export type ZoneType = "Public" | "Private";

export type RecordType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "TXT"
  | "MX"
  | "NS"
  | "PTR"
  | "SRV"
  | "CAA";

export const RECORD_TYPES: RecordType[] = [
  "A",
  "AAAA",
  "CNAME",
  "TXT",
  "MX",
  "NS",
  "PTR",
  "SRV",
  "CAA",
];

export const ROUTING_POLICIES = [
  "Simple",
  "Weighted",
  "Latency",
  "Failover",
  "Geolocation",
] as const;

export type TokenResponse = {
  access_token: string;
  token_type: string;
  username: string;
};

export type UserOut = {
  id: number;
  username: string;
};

export type HostedZone = {
  id: number;
  name: string;
  type: ZoneType;
  comment: string | null;
  record_count: number;
  created_at: string;
};

export type HostedZonePayload = {
  name: string;
  type: ZoneType;
  comment?: string | null;
};

export type DnsRecord = {
  id: number;
  hosted_zone_id: number;
  name: string;
  type: RecordType;
  ttl: number;
  value: string;
  routing_policy: string;
};

export type DnsRecordPayload = {
  name: string;
  type: RecordType;
  ttl: number;
  value: string;
  routing_policy: string;
};
