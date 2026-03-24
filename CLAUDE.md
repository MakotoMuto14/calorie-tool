# life-calc14 プロジェクト

## 目的
不労所得を目的としたWebツール・ゲームの開発。Google AdSenseによる広告収益化がメイン。

## 技術スタック
- フロントエンド: 静的HTML / CSS / JavaScript（フレームワークなし）
- ホスティング: GitHub Pages
- ドメイン: life-calc14.com（お名前.com で取得・DNS設定済み）
- アナリティクス: Google Analytics（G-09VDQ8K3P7）
- 収益化: Google AdSense（審査中）
- DB: Firebase Firestore（プロジェクト: lockdown-game-d2db7）

## リポジトリ
- GitHub: https://github.com/MakotoMuto14/calorie-tool
- ローカル: /Users/mutoumakoto/Documents/Works/calorie-tool
- ブランチ: main
- デプロイ: git push origin main で GitHub Pages に自動反映

## 公開URL
- メイン: https://life-calc14.com
- GitHub Pages: https://makotomuto14.github.io/calorie-tool/

## 既存ツール

### /index.html カロリー計算ツール
- メインページ
- AdSense設置済み

### /bmi/ BMI計算ツール
- サブツール

### /escape/ 脱出ゲーム「深夜の研究所〜LOCKDOWN〜」
- 全10ステージ（難易度が徐々に上昇）
- Firebase Firestoreでオンラインランキング実装済み
- X・LINEシェアボタン付き
- Firebase APIキーはlife-calc14.comとmakotomuto14.github.ioに制限済み
- ステージ構成:
  1. 入口ホール: 1234×2 → 2468
  2. 廊下: 等差数列(6,9,12,?) → 15
  3. 会議室: サイコロ底面の合計 → 11
  4. 資料室: 数列(2,5,10,17,26,?) → 37
  5. 実験室: フィボナッチ数列 → 21
  6. 所長室: 4と7の公倍数・2桁最大 → 84
  7. サーバールーム: 2進数変換(01001000) → 72
  8. 休憩室: 119の素因数・大きい方 → 17
  9. 制御室: 2の累乗暗号(CAFE) → 53
  10. 非常口: Stage1の答えを思い出す → 2468

## 開発ルール
- 新しいツールは /ツール名/ のサブパスで追加
- 全ファイルは静的HTML/CSS/JS（サーバー不要）
- AdSenseコードは各ページのheadに追加する

## TODO（未完了）
- [ ] DNS反映後にGoogle Search Console登録（ドメイン認証）
- [ ] サイトマップ作成・Search Consoleに送信
- [ ] SEOキーワード戦略の検討
- [ ] AdSense審査通過の確認

## セッション履歴
- life-calc14-1〜13: カロリー計算ツール・BMIツールの設計・開発・デプロイ
- life-calc14-14: 脱出ゲーム開発、Firebase連携、難易度調整、SEO準備
