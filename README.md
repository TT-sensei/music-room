# みんなの音楽室

リコーダーと鍵盤ハーモニカの練習アプリ集（TT-sensei）。

公開ページ: https://tt-sensei.github.io/music-room/

## 構成

- `index.html` — 入り口。演奏する楽器（リコーダー／鍵盤ハーモニカ）を選ぶページ
- `recorder.html` — ソプラノリコーダー運指ガイド＆練習（ジャーマン式／バロック式対応、低いド〜高いラ）
- `pianica.html` — 鍵盤ハーモニカ32鍵盤練習（F3〜C6、光るガイド練習・お手本再生・ステップ録音）
- `css/u.css` — 自前ユーティリティCSS（外部CDN・外部フォントは使わない）
- `assets/` — 入り口用イラスト（ナビキャラ素材のWebP版）と画面写真

## 仕組み

- 音はWeb Audioでその場で合成（外部の音声ファイルなし）
- 自分の曲は端末内（localStorage）に保存：リコーダー `soprano_recorder_songs_v1`／鍵盤ハーモニカ `pianica_custom_songs_v1`
- ナビキャラの表情画像だけ、共通素材サイト（navi-character-）から読み込む
- リコーダーの運指は運指表（Dolmetsch／American Recorder Society／Yamaha系）と照合済み
