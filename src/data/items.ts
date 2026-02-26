export type ItemConfig = {
    sizes: readonly string[];
    colors: readonly string[];
    hasColor: boolean;
};

export const ITEM_MAP: Record<string, ItemConfig> = {
    "ロンT": {
        sizes: ["M", "L", "XL", "その他"],
        colors: ["白", "グレー", "その他"],
        hasColor: true,
    },
    "Tシャツ": {
        sizes: ["S", "M", "L", "XL", "その他"],
        colors: ["白", "黒", "その他"],
        hasColor: true,
    },
    "キッズT": {
        sizes: ["110", "130", "その他"],
        colors: ["ナチュラル", "白", "ブルー", "イエロー"],
        hasColor: true,
    },
    "トートバッグ": {
        sizes: ["F"],
        colors: [],
        hasColor: false,
    },
    "ジッパーポーチ": {
        sizes: ["F"],
        colors: [],
        hasColor: false,
    },
    "持ち込み品": {
        sizes: ["F"],
        colors: [],
        hasColor: false,
    },
} as const;

export const ITEM_NAMES = Object.keys(ITEM_MAP) as string[];
