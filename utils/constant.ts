import { TelegramColorIcon } from "@/ui/components/icon/footer/TelegramColorIcon";
import { TwitterColorIcon } from "@/ui/components/icon/footer/TwitterColorIcon";
import { FlashIcon } from "@/ui/components/icon/FlashIcon";
import { SearchIcon } from "@/ui/components/icon/SearchIcon";

export const HEADER_MENU_LIST = [
  {
    icon: "/img/hand.svg",
    iconType: "svg",
    name: "Say GM today",
    link: "/?tab=gm",
    tab: "gm",
    external: false,
  },
  {
    icon: FlashIcon,
    iconType: "component",
    name: "Deploy Smart Contract",
    link: "/?tab=deploy",
    tab: "deploy",
    external: false,
  },
  {
    icon: '/img/goal.svg',
    iconType: 'svg',
    name: 'Quest on GM',
    link: '/quest',
    external: false,
  },
];

export const FOOTER_MENU_LIST = [
  { name: "Say GM Today", link: "/?tab=gm", external: false },
  { name: "Deploy Smart Contract", link: "/?tab=deploy", external: false },
  { name: "Quest on GM", link: "/quest", external: false},
  { name: "Documentation", link: "https://doc.gm.cheap", external: true },
];

// footer assets
export const SOCIAL_LIST = [
  { icon: TwitterColorIcon, link: "https://x.com/gmcheap" },
  { icon: TelegramColorIcon, link: "https://t.me/gmcheap" },
];

export interface RewardInfo {
  level: number;
  refer: number;
  reward: number;
  color: string;
  percent: number;
}

export const REWARDS: RewardInfo[] = [
  { level: 1, refer: 1, reward: 5, color: "#1C96FD", percent: 0 },
  { level: 2, refer: 10, reward: 10, color: "#33E360", percent: 25 },
  { level: 3, refer: 30, reward: 15, color: "#F4C630", percent: 50 },
  { level: 4, refer: 60, reward: 20, color: "#CB1245", percent: 75 },
  { level: 5, refer: 100, reward: 25, color: "#AD00FE", percent: 100 },
];

export interface GMDashboardInfo {
  level: number;
  gm: number;
  color: string;
  percent: number;
}

export const GM_DASHBOARD: GMDashboardInfo[] = [
  { level: 1, gm: 1, color: "#1C96FD", percent: 0 },
  { level: 2, gm: 10, color: "#33E360", percent: 20 },
  { level: 3, gm: 100, color: "#F4C630", percent: 40 },
  { level: 4, gm: 500, color: "#CB1245", percent: 60 },
  { level: 5, gm: 2000, color: "#AD00FE", percent: 80 },
  { level: 6, gm: 9000, color: "#33E360", percent: 100 },
];

export interface DeployDashboardInfo {
  level: number;
  deploy: number;
  color: string;
  percent: number;
}

export const DEPLOY_DASHBOARD: DeployDashboardInfo[] = [
  { level: 1, deploy: 1, color: "#1C96FD", percent: 0 },
  { level: 2, deploy: 10, color: "#33E360", percent: 20 },
  { level: 3, deploy: 100, color: "#F4C630", percent: 40 },
  { level: 4, deploy: 1000, color: "#CB1245", percent: 60 },
  { level: 5, deploy: 2000, color: "#AD00FE", percent: 80 },
  { level: 6, deploy: 5000, color: "#1C96FD", percent: 100 },
];
