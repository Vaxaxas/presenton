export interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  isSpeaker: boolean;
}

export interface BentoCard {
  tag?: string;
  title: string;
  description: string;
  highlight?: string;
  badge?: string;
}

export interface SectionContent {
  id: string;
  chapter: string;
  title: string;
  subtitle: string;
  camera: { pos: [number, number, number]; target: [number, number, number] };
  bentoCards: BentoCard[];
}

export interface DiscussionQuestion {
  id: string;
  letter: string;
  title: string;
  question: string;
  themeColor: string;
}

export const PRESENTATION_DATA = {
  meta: {
    course: "高師大通識教育《性別與文化》",
    instructor: "陳竹上 教授",
    group: "第 3 組 專題報告",
    textbook: "《臺灣性別100+問》Ch1 ~ Ch3",
    mainTitle: "話語中的權力與框架",
    mainSubtitle: "性別視角下的語言、溝通與社會習俗",
    quote: "「語言形塑認知，命名賦予權力。看見結構的重力，開啟自由平等的對話。」"
  },
  members: [
    { id: "01", name: "李昕澤", role: "專案研討", focus: "文獻研讀與論述協調", isSpeaker: false },
    { id: "02", name: "江沂絃", role: "文化考證", focus: "習俗儀式象徵分析", isSpeaker: false },
    { id: "03", name: "林季頻", role: "案例研究", focus: "語言客體化現象蒐集", isSpeaker: false },
    { id: "04", name: "林博閎", role: "資料統整", focus: "性平法制演進爬梳", isSpeaker: false },
    { id: "05", name: "林亨澤", role: "問卷反思", focus: "課堂討論題目設計", isSpeaker: false },
    { id: "06", name: "廖峻毅", role: "主講代表 1", focus: "導讀、生理迷思與雙性化溝通", isSpeaker: true },
    { id: "07", name: "陳品昊", role: "主講代表 2", focus: "性別辱罵、網路流行語與寒蟬效應", isSpeaker: true },
    { id: "08", name: "林展頡", role: "主講代表 3", focus: "概念命名史與男性幹話文化剖析", isSpeaker: true },
    { id: "09", name: "郭泓佑", role: "視覺架構", focus: "投影片邏輯架構協調", isSpeaker: false },
    { id: "10", name: "鄭傑尹", role: "提問綜理", focus: "性別盲點與結語收束", isSpeaker: false }
  ] as TeamMember[],
  sections: [
    {
      id: "structure",
      chapter: "Ch1 & Ch2 精華回顧",
      title: "體制常規與習俗中的隱形牢籠",
      subtitle: "個體往往不是惡意，只是順著「阻力最小的路」走",
      camera: { pos: [4, 2, 5], target: [0, 0, 0] },
      bentoCards: [
        {
          tag: "Allan Johnson 父權四大特徵",
          title: "結構的四重重力",
          description: "男性支配 (Dominated)、男性認同 (Identified)、男性中心 (Centered)、男性控制 (Controlled)。權力在無意識中被複製。",
          highlight: "制度是現成的遊戲規則"
        },
        {
          tag: "習俗象徵暴力",
          title: "婚俗中的排他隱喻",
          description: "丟扇、踩瓦、跨火爐。將女性預設為「帶有煞氣與壞脾氣的外人」與「潑出之水」，象徵斬斷原生家庭連帶。",
          highlight: "形式化為理所當然的儀式"
        },
        {
          tag: "平權里程碑",
          title: "原住民身分法違憲宣告",
          description: "過去強迫「姓氏綁身分」，抹煞原民多元命名文化。2022 年 111 年憲判字第 4 號正式宣告違憲，保障認同權。",
          badge: "憲判字第 4 號"
        }
      ]
    },
    {
      id: "communication-myths",
      chapter: "Ch3 語言溝通 · Q1",
      title: "男女溝通真的來自不同星球？",
      subtitle: "打破「火星與金星」的神話，看見後天社會化的雕刻刀",
      camera: { pos: [-3, 0, 4], target: [0, 0, 0] },
      bentoCards: [
        {
          tag: "神經科學真相",
          title: "生理決定論的破產",
          description: "男女大腦具高度神經可塑性。研究證實：同性別內的個體差異，遠大於兩性之間的平均值差異。",
          highlight: "大腦並無截然二分的性別硬體"
        },
        {
          tag: "Julia Wood 實證研究",
          title: "遊戲場上的社會化學習",
          description: "女性從小在扮家家酒中練習「關係連網（Rapport Talk）」；男性在競賽球類中被形塑為「報告型（Report Talk）」。",
          highlight: "溝通模式純屬後天文化習得"
        },
        {
          tag: "理想溝通典範",
          title: "雙性化溝通 (Androgynous)",
          description: "兼具直接堅定（Assertive）與細膩同理（Empathetic），徹底跨越性別刻板框架的完全體溝通素養。",
          badge: "當代溝通新標竿"
        }
      ]
    },
    {
      id: "hate-speech",
      chapter: "Ch3 語言溝通 · Q2",
      title: "髒話問候與網路流行語的性別階序",
      subtitle: "當辱罵針對女性器官與親屬，它是在重申誰的支配權？",
      camera: { pos: [0, -1, 3], target: [0, 0, 0] },
      bentoCards: [
        {
          tag: "語言人類學解析",
          title: "髒話中的客體化機制",
          description: "傳統三字經緊扣女性生殖器，並將母親、姐妹視為攻擊標的。古代男性視女性為私人財產，羞辱對方的女性等同挫敗男性的尊嚴。",
          highlight: "女性淪為男性權力角力的代罪羔羊"
        },
        {
          tag: "數位性別暴力",
          title: "PTT / Dcard 仇女流行語",
          description: "「母豬、台女、女拳、三寶、綠茶婊」。個別事件被無限上綱至群體羞辱，形成集體狂歡的厭女同溫層。",
          highlight: "標籤化抹煞了具體個人的主體性"
        },
        {
          tag: "實質社會代價",
          title: "寒蟬效應 (Chilling Effect)",
          description: "女性在公開網路社群發言時面臨更沉重的自我審查與防禦壓力，最終導致女性退出公共議題的討論空間。",
          badge: "數位發言權的結構性剝奪"
        }
      ]
    },
    {
      id: "naming-power",
      chapter: "Ch3 語言溝通 · Q3",
      title: "命名即權力：從「吃豆腐」到「性騷擾」",
      subtitle: "名詞的誕生物化了模糊的委屈，將其確立為不可侵犯的權利",
      camera: { pos: [0, 0, 2], target: [0, 0, 0] },
      bentoCards: [
        {
          tag: "名詞演進史",
          title: "從「吃豆腐、鹹豬手」的去罪化",
          description: "早期語言將越界行為粉飾為「無傷大雅的風流與玩笑」，受害者的不適被壓抑為個人小題大作，加害者毫無法律責任。",
          highlight: "缺乏法律詞彙的傷害，無法被伸張"
        },
        {
          tag: "1970 英國運動突破",
          title: "「性騷擾 (Sexual Harassment)」確立",
          description: "將模糊的不悅正名為「權力支配下的侵犯」，使受害經驗取得法律請求權與主體正當性。",
          highlight: "命名是奪回主體地位的第一步"
        },
        {
          tag: "現代概念再進化",
          title: "去污名化的正名工程",
          description: "「復仇式色情」正名為「未經同意散布私密影像」（消除檢討受害者）；「兩性平等」演進為涵蓋光譜的「性別平等」。",
          badge: "語言進步推動社會進步"
        }
      ]
    },
    {
      id: "straight-male",
      chapter: "Ch3 語言溝通 · Q4",
      title: "直男為什麼不聊心事？幹話背後的情感護甲",
      subtitle: "有毒男子氣概與恐同焦慮下，男性的替代性親密機制",
      camera: { pos: [2, -2, 4], target: [0, 0, 0] },
      bentoCards: [
        {
          tag: "男性社交模式",
          title: "任務導向 (Task-Oriented)",
          description: "相約打球、打電動、喝酒。男性的情感連結被規定必須寄生在「共同完成某件事」之上，鮮少能直接面對面袒露情感。",
          highlight: "只談目標，不談內心"
        },
        {
          tag: "陽剛規範的重擔",
          title: "脆弱作為最高禁忌",
          description: "傳統父權體制要求男性「堅毅、獨立、吞忍痛苦」，吐露心事或求助往往被同儕嘲笑為娘娘腔或軟弱無能。",
          highlight: "父權同時也是男性的牢籠"
        },
        {
          tag: "邊界防衛機制",
          title: "恐同焦慮下的「幹話與互虧」",
          description: "為了避免過於親密引來同性戀疑雲，直男透過嘴砲、互相嘲諷的粗魯互動，在「安全的距離」內建立男人的信任感。",
          badge: "幹話是無害的替代性擁抱"
        }
      ]
    }
  ] as SectionContent[],
  discussionQuestions: [
    {
      id: "q-a",
      letter: "問題 A",
      title: "發言權力與社會期待",
      question: "在大學課堂或公開會議中，踴躍舉手發言的往往是男性還是女性？背後可能有哪些從小被鼓勵或壓抑的社會化機制？",
      themeColor: "from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30"
    },
    {
      id: "q-b",
      letter: "問題 B",
      title: "婚俗與姓氏自主",
      question: "如果未來你有下一代，你會傾向堅持傳統父系姓氏與婚俗規矩，還是支持抽籤、從母姓或自創新平權儀式？核心考量點是什麼？",
      themeColor: "from-blue-500/20 to-cyan-500/10 text-cyan-300 border-cyan-500/30"
    },
    {
      id: "q-c",
      letter: "問題 C",
      title: "解構有毒男子氣概",
      question: "我們該如何創造一個允許男性坦然展示脆弱、允許女性果斷展現領導力的友善校園溝通環境？幹話文化能否轉化為真正的同理？",
      themeColor: "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30"
    }
  ] as DiscussionQuestion[],
  sceneWaypoints: [
    { id: "hero", camera: { pos: [0, 0, 7] as [number, number, number], target: [0, 0, 0] as [number, number, number] } },
    { id: "team", camera: { pos: [0, 0, 11] as [number, number, number], target: [0, 0, 0] as [number, number, number] } },
    { id: "structure", camera: { pos: [4, 2, 5] as [number, number, number], target: [0, 0, 0] as [number, number, number] } },
    { id: "communication-myths", camera: { pos: [-3, 0, 4] as [number, number, number], target: [0, 0, 0] as [number, number, number] } },
    { id: "hate-speech", camera: { pos: [0, -1, 3] as [number, number, number], target: [0, 0, 0] as [number, number, number] } },
    { id: "naming-power", camera: { pos: [0, 0, 2] as [number, number, number], target: [0, 0, 0] as [number, number, number] } },
    { id: "straight-male", camera: { pos: [2, -2, 4] as [number, number, number], target: [0, 0, 0] as [number, number, number] } },
    { id: "epilogue", camera: { pos: [0, 1.5, 6] as [number, number, number], target: [0, 0, 0] as [number, number, number] } }
  ]
};
