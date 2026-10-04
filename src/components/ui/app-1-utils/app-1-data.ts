import type { ChartConfig } from "@/components/ui/chart";

export const app1User = {
  name: "Giandri Aditio",
  initials: "GA",
  avatar: "/images/fotocv.jpg",
  role: "Administrator",
};

export const app1ChartConfig = {
  opened: { label: "Opened", color: "var(--color-chart-2)" },
  completed: { label: "Completed", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export const app1Chart = [
  { week: "W1", opened: 18, completed: 11 },
  { week: "W2", opened: 24, completed: 16 },
  { week: "W3", opened: 21, completed: 19 },
  { week: "W4", opened: 32, completed: 22 },
  { week: "W5", opened: 28, completed: 26 },
  { week: "W6", opened: 37, completed: 29 },
  { week: "W7", opened: 31, completed: 34 },
  { week: "W8", opened: 26, completed: 38 },
];

export type App1ProjectStatus = "In progress" | "In review" | "Planning";

export const app1Projects: {
  id: string;
  name: string;
  status: App1ProjectStatus;
  description: string;
  progress: number;
  dueDate: string;
  team: { name: string; initials: string }[];
}[] = [
  {
    id: "loggs-maps",
    name: "Loggs Maps",
    status: "In progress",
    description: "Interactive mapping app connecting coffee lovers with nearby cafés.",
    progress: 72,
    dueDate: "12 Aug",
    team: [
      { name: "Giandri Aditio", initials: "GA" },
      { name: "Rizky Pratama", initials: "RP" },
    ],
  },
  {
    id: "bws-portal",
    name: "Service Public Portal BWS Babel",
    status: "In review",
    description: "Public service portal for information access and request submission.",
    progress: 88,
    dueDate: "28 Jul",
    team: [
      { name: "Giandri Aditio", initials: "GA" },
      { name: "Maya Lestari", initials: "ML" },
      { name: "Andi Saputra", initials: "AS" },
    ],
  },
  {
    id: "attendance-bws",
    name: "Attendance Management BWS Babel",
    status: "In progress",
    description: "Web-based check-in system with real-time reports and clean dashboard.",
    progress: 54,
    dueDate: "30 Sep",
    team: [{ name: "Giandri Aditio", initials: "GA" }],
  },
  {
    id: "pt-bsm",
    name: "PT.BSM Company Profile",
    status: "Planning",
    description: "Company profile site blending elegant design with smooth performance.",
    progress: 15,
    dueDate: "14 Oct",
    team: [
      { name: "Giandri Aditio", initials: "GA" },
      { name: "Rizky Pratama", initials: "RP" },
    ],
  },
];

export const app1Activity: {
  id: string;
  person: { name: string; initials: string };
  action: string;
  time: string;
}[] = [
  {
    id: "a1",
    person: { name: "Rizky Pratama", initials: "RP" },
    action: "updated the summary of Loggs Maps",
    time: "12 minutes ago",
  },
  {
    id: "a2",
    person: { name: "Maya Lestari", initials: "ML" },
    action: "moved Service Public Portal to review",
    time: "1 hour ago",
  },
  {
    id: "a3",
    person: { name: "Andi Saputra", initials: "AS" },
    action: "added three new skills to the profile",
    time: "Yesterday",
  },
  {
    id: "a4",
    person: { name: "Giandri Aditio", initials: "GA" },
    action: "published a new experience entry",
    time: "2 days ago",
  },
];
