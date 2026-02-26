# SEW THE SOUND - 配送受付フォーム

イベント「SEW THE SOUND」の会場（またはオンライン）で、お客様が配送先の住所や希望アイテム等を入力・送信するためのWeb受付フォームです。  
Next.js (App Router) をフロントエンドに採用し、送信されたデータはGoogle Apps Script (GAS) 経由でGoogleスプレッドシートに独自のヘッダー付きで追記される仕組みとなっています。

## 主な機能

- **URLパラメータ認証**: `?key=xxx` のような特定のキーがURLに含まれていない場合はアクセスをブロック。
- **動的フォーム**: 選択した「アイテム」に応じて、適切な「サイズ」「カラー」のみを選択肢として表示。対象外（カラーなし等）の場合は自動でUIが切り替わります。
- **住所の自動補完**: 郵便番号（7桁）を入力すると、自動で都道府県・市区町村が入力されます（[yubinbango-core2](https://github.com/yubinbango/yubinbango-core2) 使用）。
- **堅牢なバリデーション**: [Zod](https://zod.dev/) と [React Hook Form](https://react-hook-form.com/) により、正確なデータのみをGASへ送信します。
- **デバッグモード**: 環境変数でGASのURLが未設定の場合でも、開発時にはコンソールへJSONを出力させることで単体テストが可能です。

## 技術スタック

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validation**: Zod + React Hook Form
- **Backend / Database**: Google Apps Script (GAS) + Google Spreadsheet

## ディレクトリ構成

- `src/app/` : ページ（`/`, `/complete`, `/unauthorized`）やサーバーアクション
- `src/components/` : UIコンポーネント（汎用UI、フォーム本体、動的パーツ）
- `src/data/` : アイテム一覧やマッピング設定などの定数データ
- `src/lib/` : ZodスキーマやYubinBango初期化スクリプトなど
- `gas/` : ガス（Google Apps Script）用のコード `code.gs`

## セットアップとデプロイ手順

### 1. Google スプレッドシート + GAS の準備

1. 新規のGoogleスプレッドシートを作成し、「拡張機能」>「Apps Script」を開く。
2. 左記エディタに、当リポジトリ内の `gas/code.gs` の内容をすべてコピー＆ペーストして保存。
3. エディタ上部の関数メニューから `initializeSheet` を選び、「実行」をクリック。  
   （※シートに「Delivery」という名前のタブが生成され、A〜R列のヘッダーがセットされます）
4. 右上の「デプロイ」>「新しいデプロイ」を作成。
   - 種類: **ウェブアプリ**
   - アクセスできるユーザー: **全員** (誰でもアクセス可にする)
5. 発行された**ウェブアプリのURL**をコピーしておく。

### 2. 環境変数の設定

プロジェクトのルート（またはVercel等のホスティング環境のEnvironment Variables）に `.env.local` を作成し、以下を設定します。

```env
# 先ほど取得したGASのウェブアプリURL
NEXT_PUBLIC_GAS_ENDPOINT=https://script.google.com/macros/s/xxxx/exec

# フォームにアクセスするためのURLキー（任意）
NEXT_PUBLIC_AUTH_KEY=event_2026
```

※ 開発環境で `NEXT_PUBLIC_GAS_ENDPOINT` が未設定のまま送信すると、デバッグモードとしてコンソールにデータが出力されます。

### 3. Vercel へのデプロイ (推奨)

このプロジェクトはVercelへのデプロイに最適化されています。

1. GitHub等にこのリポジトリをプッシュする。
2. [Vercel](https://vercel.com/) にログインし、"Add New Project" からリポジトリをインポート。
3. デプロイ設定画面の **Environment Variables** にて、上記の2つの変数を追加。
4. "Deploy" をクリック。

### 4. ローカルでの開発

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000/?key=event_2026`（設定したキー）へアクセスしてください。

## ライセンス

This project is licensed under the MIT License.
