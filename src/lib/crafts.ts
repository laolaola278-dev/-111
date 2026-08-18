export type HeritageKind =
  | "unesco_representative"
  | "national_ich"
  | "provincial_ich"
  | "application_form"
  | "visual_motif"
  | "ai_recreation";

export type SourceRef = {
  title: string;
  publisher: string;
  url: string;
};

export type StatusTag = {
  kind: HeritageKind;
  label: string;
};

export type Craft = {
  id: string;
  name: string;
  short: string;
  description: string;
  example: string;
  accent: string;
  category: string;
  region: string;
  historical_context: string;
  source: SourceRef[];
  note: string;
  hierarchyLabel: string;
  statusTags: StatusTag[];
  visualHint: string;
};

const SRC = {
  gov2006: {
    title: "国务院关于公布第一批国家级非物质文化遗产名录的通知（国发〔2006〕18号）",
    publisher: "中国政府网 · 国务院公报",
    url: "https://www.gov.cn/gongbao/content/2006/content_334718.htm",
  },
  mct2006: {
    title: "国务院关于公布第一批国家级非物质文化遗产名录的通知（名录全文）",
    publisher: "中华人民共和国文化和旅游部",
    url: "https://www.mct.gov.cn/whzx/ggtz/200606/t20060609_694679.htm",
  },
  ihchinaList: {
    title: "国务院关于公布第一批国家级非物质文化遗产名录的通知",
    publisher: "中国非物质文化遗产网",
    url: "https://www.ihchina.cn/zhengce_details/11546",
  },
  unescoPaperCut: {
    title: "Chinese paper-cut",
    publisher: "UNESCO Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/RL/chinese-paper-cut-00219",
  },
  unescoPaperCutDecision: {
    title: "Decision of the Intergovernmental Committee: 4.COM 13.09",
    publisher: "UNESCO Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/decisions/4.COM/13.09",
  },
  ihchinaPaperCut: {
    title: "中国入选联合国教科文组织非物质文化遗产名录（名册）项目之中国剪纸",
    publisher: "中国非物质文化遗产网",
    url: "https://www.ihchina.cn/art/detail/id/22117.html",
  },
  ihchinaPaperCutHub: {
    title: "中国剪纸（人类非物质文化遗产代表作名录专题及国家级子项清单）",
    publisher: "中国非物质文化遗产网",
    url: "https://www.ihchina.cn/jianzhi.html",
  },
  ihchinaPaperCutData: {
    title: "非遗数据知多少 | 一刀一剪，现人间千种温情",
    publisher: "中国非物质文化遗产网",
    url: "https://www.ihchina.cn/project_details/24793",
  },
  ihchinaYuxian: {
    title: "剪纸（蔚县剪纸）",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/13924.html",
  },
  ihchinaYangzhou: {
    title: "剪纸（扬州剪纸）",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/20180.html",
  },
  ihchinaYueqing: {
    title: "剪纸（乐清细纹刻纸）",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/13929",
  },
  ihchinaGuangdong: {
    title: "剪纸（广东剪纸）",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/20176.html",
  },
  ihchinaFoshan: {
    title: "剪纸（广东剪纸）· 佛山",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/20177.html",
  },
  unescoShadow: {
    title: "Chinese shadow puppetry",
    publisher: "UNESCO Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/RL/chinese-shadow-puppetry-00421",
  },
  ihchinaShadowUnesco: {
    title: "中国皮影戏",
    publisher: "中国非物质文化遗产网 · 人类非物质文化遗产代表作名录",
    url: "https://www.ihchina.cn/directory_details/11905",
  },
  ihchinaTangshan: {
    title: "皮影戏（唐山皮影戏）",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/13392",
  },
  ihchinaNianhua: {
    title: "【非遗数据知多少】国家级非遗代表性项目：木版年画",
    publisher: "中国非物质文化遗产网",
    url: "https://www.ihchina.cn/news_1_details/9441.html",
  },
  ihchinaYangliuqing: {
    title: "杨柳青木版年画",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/13899",
  },
  ihchinaTaohuawu: {
    title: "桃花坞木版年画",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/13902/",
  },
  ihchinaYangjiabu: {
    title: "杨家埠木版年画",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/13904.html",
  },
  ihchinaJingdezhen: {
    title: "景德镇手工制瓷技艺",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/14270.html",
  },
  jdzGov: {
    title: "书写陶瓷文化遗产“活”文章",
    publisher: "景德镇市人民政府",
    url: "https://jdz.gov.cn/zmhd/hygq/t359810.shtml",
  },
  unescoYunjin: {
    title: "Craftsmanship of Nanjing Yunjin brocade",
    publisher: "UNESCO Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/RL/craftsmanship-of-nanjing-yunjin-brocade-00200",
  },
  ihchinaYunjinUnesco: {
    title: "南京云锦织造技艺",
    publisher: "中国非物质文化遗产网 · 人类非物质文化遗产代表作名录",
    url: "https://www.ihchina.cn/directory_details/11786",
  },
  ihchinaYunjin: {
    title: "南京云锦木机妆花手工织造技艺",
    publisher: "中国非物质文化遗产网 · 国家级代表性项目名录",
    url: "https://www.ihchina.cn/project_details/20105.html",
  },
} as const;

export const CRAFTS: Craft[] = [
  {
    id: "jianzhi",
    name: "剪纸",
    short: "镂空造型",
    description:
      "参考中国民间剪纸常见的单色镂空、阴阳刻关系与对称构图，做数字化再创作。中国剪纸流布广泛，南北及多民族地区风格不同，本风格不代表某一产地。",
    example: "赛博朋克龙",
    accent: "from-cinnabar to-cinnabar-deep",
    category: "传统剪纸 / 民间美术",
    region: "流布广泛；各地风格不同，不限定单一产地",
    historical_context:
      "剪纸是以剪刀或刻刀在纸上剪刻花纹、用于装点生活或配合民俗活动的民间艺术。2006 年，「剪纸」列入第一批国家级非物质文化遗产名录（Ⅶ—16），其后多地项目陆续扩展。2009 年，「中国剪纸」列入联合国教科文组织人类非物质文化遗产代表作名录。中国非物质文化遗产网专题页列出蔚县、扬州、乐清细纹刻纸、广东剪纸（含佛山、潮州、汕头）等多地子项，说明南北风格并立。窗花、喜花、门笺等是剪纸的常见用途，不是与剪纸并列的独立工艺门类。",
    source: [
      SRC.unescoPaperCut,
      SRC.gov2006,
      SRC.ihchinaPaperCutHub,
      SRC.ihchinaYuxian,
      SRC.ihchinaYangzhou,
      SRC.ihchinaYueqing,
      SRC.ihchinaGuangdong,
      SRC.ihchinaFoshan,
    ],
    note: "生成结果属于 AI 辅助创作，不是剪纸原作，也不对应某一位传承人或某一产地的专属样式。",
    hierarchyLabel: "传统剪纸",
    statusTags: [
      {
        kind: "unesco_representative",
        label: "人类非物质文化遗产代表作名录：中国剪纸（2009）",
      },
      {
        kind: "national_ich",
        label: "国家级名录项目「剪纸」（Ⅶ—16，2006，后有扩展）",
      },
      { kind: "ai_recreation", label: "本页纹样为 AI 再创作" },
    ],
    visualHint: "单色镂空、阴阳刻、对称与正负形",
  },
  {
    id: "chuanghua",
    name: "窗花",
    short: "剪纸应用",
    description:
      "窗花是剪纸常见的张贴用途，多用于窗格装饰，常见团花与辐射对称。它不是与剪纸并列的独立传统工艺门类。本风格参考这一应用形式的视觉特征。",
    example: "土楼轮廓与海浪",
    accent: "from-cinnabar to-gold",
    category: "传统剪纸的应用形式",
    region: "随剪纸传统广泛分布于各地，不对应单一产地",
    historical_context:
      "据中国非物质文化遗产网对「中国剪纸」的介绍，剪纸常被用作居家装饰，窗花与墙花、喜花、棚顶花等同属张贴类用途。联合国教科文组织对「中国剪纸」的说明也提到，剪纸可用于室内装饰（包括窗户等）。国家级项目卡「剪纸（蔚县剪纸）」写明当地剪纸又称「窗花」，这是地方别称与常见用途，不能把全国窗花等同于蔚县剪纸，也不能把窗花写成独立非遗项目。",
    source: [
      SRC.ihchinaPaperCut,
      SRC.unescoPaperCut,
      SRC.ihchinaYuxian,
      SRC.ihchinaPaperCutHub,
    ],
    note: "请勿将「窗花」理解为单独的国家级或人类非遗项目名称。相关名录项目是「剪纸 / 中国剪纸」。",
    hierarchyLabel: "传统剪纸 → 窗花（应用）",
    statusTags: [
      {
        kind: "application_form",
        label: "剪纸的常见应用形式，非独立非遗项目",
      },
      { kind: "ai_recreation", label: "本页纹样为 AI 再创作" },
    ],
    visualHint: "团花、辐射对称、窗格装饰感",
  },
  {
    id: "piying",
    name: "皮影",
    short: "影偶剪影",
    description:
      "参考皮影影偶常见的侧面轮廓、镂空关节与剪影感，做平面纹样再创作。皮影戏是表演艺术，本站只借用其造型语言，不是在复原演出。",
    example: "飞天姿态剪影",
    accent: "from-ink-soft to-jade",
    category: "传统戏剧 / 影偶造型参考",
    region: "流布广泛；国家级名录含唐山、冀南、孝义、海宁、华县等多地子项",
    historical_context:
      "中国皮影戏是以皮制或纸制影偶，配合灯光、音乐与演唱进行表演的戏剧形式。2006 年，「皮影戏」列入第一批国家级非物质文化遗产名录（Ⅳ—91），包含唐山、冀南、孝义、海宁、华县等多地子项。2011 年，「中国皮影戏」列入联合国教科文组织人类非物质文化遗产代表作名录。国家级项目卡「皮影戏（唐山皮影戏）」写明「皮影戏的形成时代尚无确考」，本站因此不作断代。",
    source: [
      SRC.unescoShadow,
      SRC.ihchinaShadowUnesco,
      SRC.ihchinaTangshan,
      SRC.gov2006,
    ],
    note: "本风格只参考影偶的平面造型，不涉及唱腔、操纵或剧目史实，也不指定某一地方流派。",
    hierarchyLabel: "皮影戏 · 造型参考",
    statusTags: [
      {
        kind: "unesco_representative",
        label: "人类非物质文化遗产代表作名录：中国皮影戏（2011）",
      },
      {
        kind: "national_ich",
        label: "国家级名录项目「皮影戏」（Ⅳ—91，2006，含多地子项）",
      },
      { kind: "ai_recreation", label: "本页纹样为 AI 再创作" },
    ],
    visualHint: "侧面剪影、关节镂空、轮廓分明",
  },
  {
    id: "nianhua",
    name: "年画",
    short: "民俗画意",
    description:
      "参考民间木版年画常见的饱满构图、鲜明配色与吉祥题材，做数字化视觉演绎。年画不是单一产地、单一项目，各地画种差异很大。",
    example: "莲与鱼的吉祥组合",
    accent: "from-cinnabar to-gold",
    category: "民间美术 / 木版年画视觉参考",
    region: "多地并立，如天津杨柳青、苏州桃花坞、山东杨家埠等",
    historical_context:
      "第一批国家级非物质文化遗产名录中，木版年画以多个独立项目列入，例如杨柳青木版年画（Ⅶ—1）、桃花坞木版年画（Ⅶ—3）、杨家埠木版年画（Ⅶ—5）等。本站「年画」风格是综合视觉参考，不对应其中任何单一产地，也不把各地年画混称为同一种工艺。",
    source: [
      SRC.gov2006,
      SRC.ihchinaYangliuqing,
      SRC.ihchinaTaohuawu,
      SRC.ihchinaYangjiabu,
      SRC.ihchinaNianhua,
    ],
    note: "不要把本风格理解成杨柳青、桃花坞或其他任何一地年画的复原。",
    hierarchyLabel: "木版年画 · 综合参考",
    statusTags: [
      {
        kind: "national_ich",
        label: "多项木版年画分别列入国家级名录，并非单一项目",
      },
      { kind: "visual_motif", label: "本风格为综合视觉参考" },
      { kind: "ai_recreation", label: "本页纹样为 AI 再创作" },
    ],
    visualHint: "构图饱满、色彩鲜明、吉祥寓意",
  },
  {
    id: "qinghua",
    name: "青花",
    short: "蓝白纹样",
    description:
      "参考瓷器装饰中常见的青花蓝白关系、缠枝与云纹等视觉语言。青花是装饰手法，不是织锦，也不是单独以「青花」为名的国家级非遗项目。",
    example: "缠枝莲与喜鹊",
    accent: "from-jade to-ink-soft",
    category: "历史文化视觉元素 / 瓷器装饰语言",
    region: "以景德镇等地制瓷传统为主要参考，不限定单一窑口纹样",
    historical_context:
      "与本风格相关、且可核对的名录项目是「景德镇手工制瓷技艺」（第一批国家级名录 Ⅷ—7，2006）。景德镇市人民政府网站介绍，当地另有「传统青花瓷制作技艺」等项目列入省级名录。本站不把「青花瓷」写成单独的国家级或人类非遗项目名称，只借用其蓝白纹样作为创作灵感。",
    source: [SRC.gov2006, SRC.ihchinaList, SRC.jdzGov],
    note: "生成图不是瓷器，也不模拟拉坯、分水、烧窑等真实工艺。",
    hierarchyLabel: "青花纹样 · 装饰语言",
    statusTags: [
      {
        kind: "national_ich",
        label: "相关项目：景德镇手工制瓷技艺（Ⅷ—7，2006）",
      },
      {
        kind: "provincial_ich",
        label: "当地政府公开信息：传统青花瓷制作技艺列入省级名录",
      },
      { kind: "visual_motif", label: "青花是装饰语言，非独立国家级项目名称" },
      { kind: "ai_recreation", label: "本页纹样为 AI 再创作" },
    ],
    visualHint: "青花蓝、瓷白、缠枝与云纹",
  },
  {
    id: "yunjin",
    name: "云锦",
    short: "织锦纹样",
    description:
      "参考南京云锦织物常见的云纹、缠枝与金彩对比等装饰特征，做平面纹样演绎。云锦是织造技艺，不是剪纸，本站不模拟木机妆花工艺。",
    example: "祥云与凤凰",
    accent: "from-gold to-cinnabar",
    category: "传统织造技艺 / 织物纹样参考",
    region: "江苏省南京市",
    historical_context:
      "2006 年，「南京云锦木机妆花手工织造技艺」列入第一批国家级非物质文化遗产名录（Ⅷ—13）。2009 年，「南京云锦织造技艺」列入联合国教科文组织人类非物质文化遗产代表作名录。名录保护的是织造技艺与相关知识，不是某一张数字化纹样。",
    source: [
      SRC.unescoYunjin,
      SRC.ihchinaYunjinUnesco,
      SRC.ihchinaYunjin,
      SRC.gov2006,
    ],
    note: "生成图不是云锦实物，也不使用金线、孔雀羽线或木机织造。",
    hierarchyLabel: "南京云锦 · 纹样参考",
    statusTags: [
      {
        kind: "unesco_representative",
        label: "人类非物质文化遗产代表作名录：南京云锦织造技艺（2009）",
      },
      {
        kind: "national_ich",
        label: "国家级名录项目「南京云锦木机妆花手工织造技艺」（Ⅷ—13，2006）",
      },
      { kind: "ai_recreation", label: "本页纹样为 AI 再创作" },
    ],
    visualHint: "云纹、缠枝、朱红与金彩对比",
  },
];

export function craftById(id: string | undefined | null): Craft {
  return CRAFTS.find((c) => c.id === id) ?? CRAFTS[0];
}

export function heritageKindClass(kind: HeritageKind): string {
  switch (kind) {
    case "unesco_representative":
      return "border-gold/40 bg-gold/10 text-gold-deep";
    case "national_ich":
      return "border-cinnabar/30 bg-cinnabar-soft/70 text-cinnabar-deep";
    case "provincial_ich":
      return "border-jade/35 bg-jade/10 text-jade";
    case "application_form":
    case "visual_motif":
      return "border-ink/15 bg-paper-deep text-ink-soft";
    case "ai_recreation":
      return "border-ink/10 bg-paper text-ink-faint";
    default:
      return "border-ink/15 bg-paper-deep text-ink-soft";
  }
}
