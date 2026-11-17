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

- 音は実録音サンプル（`assets/audio/` に同梱、詳しくは下記「音源について」）。読み込めない場合はWeb Audioのシンセ音で代替
- 自分の曲は端末内（localStorage）に保存：リコーダー `soprano_recorder_songs_v1`／鍵盤ハーモニカ `pianica_custom_songs_v1`
- ナビキャラの表情画像だけ、共通素材サイト（navi-character-）から読み込む
- リコーダーの運指は運指表（Dolmetsch／American Recorder Society／Yamaha系）と照合済み

## 楽譜ファイル（JSON）の書き出し・読み込み

両アプリとも、曲の選択欄の横に「📤 書き出し」「📥 読み込み」ボタンがあります。

- 書き出し：マイ楽譜をまとめて1つのJSONファイルに保存（マイ楽譜がないときは選択中の曲を1曲だけ保存）。別のタブレットへの移行やバックアップ用
- 読み込み：JSONファイルを読み込んでマイ楽譜に追加。同名の曲は「（2）」付きで追加
- 形式：`{ "format": "music-room-song", "version": 1, "songs": [ { "title": "曲名", "score": "ド レ ミ ー" } ] }`（scoreはドレミ表記。単一曲の形や `scoreText` キーでも読み込み可）
- 他のAIに楽譜ファイルを作ってもらうための指示文は、各アプリの「🤖 AIに作ってもらう」ボタンからその場でコピーできます（楽器専用の内容）。両楽器ぶんをまとめた保存版は [song-prompt.md](song-prompt.md) にあります

## 音源について

リコーダーと鍵盤ハーモニカの音は、実録音サンプルを使用しています（読み込めない場合は従来のシンセ音で代替）。

- リコーダー：FreePats "Wooden Recorder"（Eugene Vlaskin 録音、CC0）
- 鍵盤ハーモニカ：fese "Hohner Melodica"（Freesound、CC BY 4.0）

出典・ライセンス・加工内容の詳細は [assets/audio/README.md](assets/audio/README.md) に記載しています。
