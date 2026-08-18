export type Craft = {
  id: string;
  name: string;
  short: string;
  description: string;
  example: string;
  accent: string;
};

export const CRAFTS: Craft[] = [
  {
    id: "jianzhi",
    name: "剪纸",
    short: "镂空之美",
    description: "北方民间剪纸，线条流畅，阳刻阴刻结合，正负形清晰。",
    example: "赛博朋克龙",
    accent: "from-cinnabar to-cinnabar-deep",
  },
  {
    id: "chuanghua",
    name: "窗花",
    short: "团花喜庆",
    description: "圆形辐射对称的团花窗花，纹样密集镂空，年味十足。",
    example: "福建土楼与海浪",
    accent: "from-cinnabar to-gold",
  },
  {
    id: "piying",
    name: "皮影",
    short: "光影剪影",
    description: "皮影戏侧面剪影，镂空雕刻，线条分明，轮廓动感。",
    example: "敦煌飞天",
    accent: "from-ink-soft to-jade",
  },
  {
    id: "nianhua",
    name: "年画",
    short: "民俗吉祥",
    description: "木版年画，构图饱满，色彩鲜明，寓意吉祥如意。",
    example: "年年有余的锦鲤",
    accent: "from-cinnabar to-gold",
  },
  {
    id: "qinghua",
    name: "青花",
    short: "蓝白清雅",
    description: "青花瓷纹样，缠枝莲与云纹，蓝白配色，清雅流畅。",
    example: "缠枝莲与喜鹊",
    accent: "from-jade to-ink-soft",
  },
  {
    id: "yunjin",
    name: "云锦",
    short: "织锦华贵",
    description: "云锦织锦纹样，繁复华贵，云纹与缠枝，金线点缀。",
    example: "祥云与凤凰",
    accent: "from-gold to-cinnabar",
  },
];

export function craftById(id: string | undefined | null): Craft {
  return CRAFTS.find((c) => c.id === id) ?? CRAFTS[0];
}
