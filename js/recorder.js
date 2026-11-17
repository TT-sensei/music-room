    /**
     * ============================================================================
     * 1. ソプラノリコーダー 運指マスターデータ（C5=ド 〜 A6=高いラ）
     * ============================================================================
     * 穴インデックス配列 [0, 1, 2, 3, 4, 5, 6, 7]:
     *   0: 左手親指（裏穴）
     *   1: 左手人差し指
     *   2: 左手中指
     *   3: 左手薬指
     *   4: 右手人差し指
     *   5: 右手中指
     *   6: 右手薬指（ダブルホール）
     *   7: 右手小指（ダブルホール）
     * 状態値: 'closed'（閉）, 'open'（開）, 'half'（サミング / 半開き）
     */
    const RECORDER_NOTES = [
      {
        id: 'C5', midi: 72, name: 'ド', shortName: 'ド', subLabel: '低いド', isSharp: false,
        staffStep: -2, accidental: null, // 下第1加線
        german:  ['closed','closed','closed','closed','closed','closed','closed','closed'],
        baroque: ['closed','closed','closed','closed','closed','closed','closed','closed'],
        tip: 'すべての穴をすき間なくふさぎます。息を強く吹きすぎず、温かい息でやさしく「トゥー」と吹きましょう。'
      },
      {
        id: 'Cs5', midi: 73, name: 'ド#', shortName: 'ド#', subLabel: 'ド# / レ♭', isSharp: true,
        staffStep: -2, accidental: '#',
        german:  ['closed','closed','closed','closed','closed','closed','closed','half'],
        baroque: ['closed','closed','closed','closed','closed','closed','closed','half'],
        tip: '右手小指のダブルホールのうち、大きい穴だけをふさいで小さい穴をあけます。息はやさしく！'
      },
      {
        id: 'D5', midi: 74, name: 'レ', shortName: 'レ', subLabel: '低いレ', isSharp: false,
        staffStep: -1, accidental: null, // 第1線の下
        german:  ['closed','closed','closed','closed','closed','closed','closed','open'],
        baroque: ['closed','closed','closed','closed','closed','closed','closed','open'],
        tip: '右手小指（7番）だけをあけます。薬指（6番）のダブルホール2つがしっかり閉じているか確認しよう。'
      },
      {
        id: 'Ds5', midi: 75, name: 'レ#', shortName: 'レ#', subLabel: 'レ# / ミ♭', isSharp: true,
        staffStep: -1, accidental: '#',
        german:  ['closed','closed','closed','closed','closed','closed','half','open'],
        baroque: ['closed','closed','closed','closed','closed','closed','half','open'],
        tip: '右手薬指（6番）のダブルホールの片方だけをあけます。指の腹でそっとずらすと押さえやすいです。'
      },
      {
        id: 'E5', midi: 76, name: 'ミ', shortName: 'ミ', subLabel: '低いミ', isSharp: false,
        staffStep: 0, accidental: null, // 第1線
        german:  ['closed','closed','closed','closed','closed','closed','open','open'],
        baroque: ['closed','closed','closed','closed','closed','closed','open','open'],
        tip: '左手全部と、右手の人差し指・中指をおさえます。あけた薬指・小指は穴のすぐ近くで待機させよう。'
      },
      {
        id: 'F5', midi: 77, name: 'ファ', shortName: 'ファ', subLabel: '低いファ', isSharp: false,
        staffStep: 1, accidental: null, // 第1間
        german:  ['closed','closed','closed','closed','closed','open','open','open'],
        baroque: ['closed','closed','closed','closed','closed','open','closed','closed'],
        tip: '【重要】ジャーマン式は右手人差し指(4)だけ、バロック式は右手の薬指(6)・小指(7)もおさえます！'
      },
      {
        id: 'Fs5', midi: 78, name: 'ファ#', shortName: 'ファ#', subLabel: 'ファ# / ソ♭', isSharp: true,
        staffStep: 1, accidental: '#',
        german:  ['closed','closed','closed','closed','open','closed','closed','closed'],
        baroque: ['closed','closed','closed','closed','open','closed','closed','open'],
        tip: '右手人差し指(4)をあけて、中指(5)と薬指(6)をおさえます。息のスピードを一定に保ちましょう。'
      },
      {
        id: 'G5', midi: 79, name: 'ソ', shortName: 'ソ', subLabel: 'ソ', isSharp: false,
        staffStep: 2, accidental: null, // 第2線
        german:  ['closed','closed','closed','closed','open','open','open','open'],
        baroque: ['closed','closed','closed','closed','open','open','open','open'],
        tip: '左手（親指・人差し指・中指・薬指）だけでおさえます。右手は親指でリコーダーをしっかり支えよう。'
      },
      {
        id: 'Gs5', midi: 80, name: 'ソ#', shortName: 'ソ#', subLabel: 'ソ# / ラ♭', isSharp: true,
        staffStep: 2, accidental: '#',
        german:  ['closed','closed','closed','open','closed','closed','half','open'],
        baroque: ['closed','closed','closed','open','closed','closed','half','open'],
        tip: '左手薬指(3)をあけ、右手の人差し指(4)・中指(5)をおさえます。少し特殊な指づかいなのでゆっくり確認！'
      },
      {
        id: 'A5', midi: 81, name: 'ラ', shortName: 'ラ', subLabel: 'ラ', isSharp: false,
        staffStep: 3, accidental: null, // 第2間
        german:  ['closed','closed','closed','open','open','open','open','open'],
        baroque: ['closed','closed','closed','open','open','open','open','open'],
        tip: 'うら(0)・人差し指(1)・中指(2)の3つをおさえます。綺麗な音が出やすい基本の音です。'
      },
      {
        id: 'As5', midi: 82, name: 'シ♭', shortName: 'シ♭', subLabel: 'ラ# / シ♭', isSharp: true,
        staffStep: 4, accidental: 'b',
        german:  ['closed','closed','open','closed','closed','open','half','open'],
        baroque: ['closed','closed','open','closed','closed','open','open','open'],
        tip: '左手中指(2)だけをあけて、薬指(3)と右手人差し指(4)をおさえます。曲の中でよく登場する大切な運指です！'
      },
      {
        id: 'B5', midi: 83, name: 'シ', shortName: 'シ', subLabel: 'シ', isSharp: false,
        staffStep: 4, accidental: null, // 第3線
        german:  ['closed','closed','open','open','open','open','open','open'],
        baroque: ['closed','closed','open','open','open','open','open','open'],
        tip: 'うら(0)と左手人差し指(1)の2つだけをおさえます。リコーダーがぐらつかないよう右手親指で支えよう。'
      },
      {
        id: 'C6', midi: 84, name: '高いド', shortName: '高いド', subLabel: '高いド', isSharp: false,
        staffStep: 5, accidental: null, // 第3間
        german:  ['closed','open','closed','open','open','open','open','open'],
        baroque: ['closed','open','closed','open','open','open','open','open'],
        tip: 'うら(0)と左手中指(2)だけをおさえます。「シ」から「高いド」へ指をパッと入れ替える練習をしよう！'
      },
      {
        id: 'Cs6', midi: 85, name: '高いド#', shortName: '高いド#', subLabel: '高いド# / レ♭', isSharp: true,
        staffStep: 5, accidental: '#',
        german:  ['open','closed','closed','open','open','open','open','open'],
        baroque: ['open','closed','closed','open','open','open','open','open'],
        tip: 'うら(0)をあけて、左手人差し指(1)・中指(2)をおさえます。親指は管のすぐそばに置いて支えます。'
      },
      {
        id: 'D6', midi: 86, name: '高いレ', shortName: '高いレ', subLabel: '高いレ', isSharp: false,
        staffStep: 6, accidental: null, // 第4線
        german:  ['open','open','closed','open','open','open','open','open'],
        baroque: ['open','open','closed','open','open','open','open','open'],
        tip: 'うら(0)をあけて、左手中指(2)1本だけをおさえます！リコーダーが落ちないよう右手親指と下くちびるで支えよう。'
      },
      {
        id: 'Ds6', midi: 87, name: '高いレ#', shortName: '高いレ#', subLabel: '高いレ# / ミ♭', isSharp: true,
        staffStep: 6, accidental: '#',
        german:  ['open','open','closed','closed','closed','closed','closed','open'],
        baroque: ['open','open','closed','closed','closed','closed','closed','open'],
        tip: 'うら(0)と1番をあけ、2・3・4・5・6番をおさえます。息を少し速めにまっすぐ吹き込みましょう。'
      },
      {
        id: 'E6', midi: 88, name: '高いミ', shortName: '高いミ', subLabel: '高いミ（サミング）', isSharp: false,
        staffStep: 7, accidental: null, // 第4間
        german:  ['half','closed','closed','closed','closed','closed','open','open'],
        baroque: ['half','closed','closed','closed','closed','closed','open','open'],
        tip: '【サミング開始！】低いミの指づかいのまま、左手親指(0)の爪を立てるようにして裏穴をほんの少し（1〜2mm）あけます。'
      },
      {
        id: 'F6', midi: 89, name: '高いファ', shortName: '高いファ', subLabel: '高いファ（サミング）', isSharp: false,
        staffStep: 8, accidental: null, // 第5線
        german:  ['half','closed','closed','closed','closed','open','open','open'],
        baroque: ['half','closed','closed','closed','closed','open','closed','open'],
        tip: 'うら(0)を半分あけるサミングを使います。ジャーマン式とバロック式で右手の押さえ方が違うので確認しよう！'
      },
      {
        id: 'Fs6', midi: 90, name: '高いファ#', shortName: '高いファ#', subLabel: '高いファ#（サミング）', isSharp: true,
        staffStep: 8, accidental: '#',
        german:  ['half','closed','closed','closed','open','closed','open','closed'],
        baroque: ['half','closed','closed','closed','open','closed','open','open'],
        tip: 'うら(0)をサミングしつつ、左手1・2・3と右手中指(5)をおさえます。息を少し強めに「トゥー」と吹きます。'
      },
      {
        id: 'G6', midi: 91, name: '高いソ', shortName: '高いソ', subLabel: '高いソ（サミング）', isSharp: false,
        staffStep: 9, accidental: null, // 第5線の上
        german:  ['half','closed','closed','closed','open','open','open','open'],
        baroque: ['half','closed','closed','closed','open','open','open','open'],
        tip: 'ソの指づかいに加えて、うら(0)をサミング（半分あける）します。息のスピードを少し速くすると澄んだ音が出ます。'
      },
      {
        id: 'Gs6', midi: 92, name: '高いソ#', shortName: '高いソ#', subLabel: '高いソ#（サミング）', isSharp: true,
        staffStep: 9, accidental: '#',
        german:  ['half','closed','closed','closed','open','closed','closed','closed'],
        baroque: ['half','closed','closed','open','closed','open','open','open'],
        tip: 'うら(0)をサミングし、左手1・2と右手人差し指(4)をおさえます。（ジャーマン式では左手3と右手5・6・7もおさえます）'
      },
      {
        id: 'A6', midi: 93, name: '高いラ', shortName: '高いラ', subLabel: '高いラ（サミング）', isSharp: false,
        staffStep: 10, accidental: null, // 上第1加線
        german:  ['half','closed','closed','open','open','open','open','open'],
        baroque: ['half','closed','closed','open','open','open','open','open'],
        tip: 'うら(0)をサミングし、左手人差し指(1)・中指(2)をおさえます。力まずに細い息をまっすぐ入れよう！'
      }
    ];

    const HOLE_META = [
      { idx: 0, hand: '左手', finger: '親指（うら）', shortFinger: 'うら(0)' },
      { idx: 1, hand: '左手', finger: '人差し指', shortFinger: '左1' },
      { idx: 2, hand: '左手', finger: '中指', shortFinger: '左2' },
      { idx: 3, hand: '左手', finger: '薬指', shortFinger: '左3' },
      { idx: 4, hand: '右手', finger: '人差し指', shortFinger: '右4' },
      { idx: 5, hand: '右手', finger: '中指', shortFinger: '右5' },
      { idx: 6, hand: '右手', finger: '薬指（W穴）', shortFinger: '右6' },
      { idx: 7, hand: '右手', finger: '小指（W穴）', shortFinger: '右7' }
    ];

    // プリセット曲（7曲）
    const PRESET_SONGS = [
      {
        id: 'preset_twinkle',
        title: '1. きらきら星',
        isPreset: true,
        scoreText: 'ド ド ソ ソ ラ ラ ソ ー ファ ファ ミ ミ レ レ ド ー ソ ソ ファ ファ ミ ミ レ ー ソ ソ ファ ファ ミ ミ レ ー ド ド ソ ソ ラ ラ ソ ー ファ ファ ミ ミ レ レ ド ー'
      },
      {
        id: 'preset_mary',
        title: '2. メリーさんの羊',
        isPreset: true,
        scoreText: 'ミ レ ド レ ミ ミ ミ ー レ レ レ ー ミ ソ ソ ー ミ レ ド レ ミ ミ ミ ミ レ レ ミ レ ド ー'
      },
      {
        id: 'preset_tulip',
        title: '3. チューリップ',
        isPreset: true,
        scoreText: 'ド レ ミ ー ド レ ミ ー ソ ミ レ ド レ ミ レ ー ド レ ミ ー ド レ ミ ー ソ ミ レ ド レ ミ ド ー ソ ソ ミ ソ ラ ラ ソ ー ミ ミ レ レ ド ー'
      },
      {
        id: 'preset_saints',
        title: '4. 聖者の行進',
        isPreset: true,
        scoreText: 'ド ミ ファ ソ ー ド ミ ファ ソ ー ド ミ ファ ソ ミ ド ミ レ ー ミ ミ レ ド ド ミ ソ ソ ファ ー ミ ファ ソ ミ ド レ ド ー'
      },
      {
        id: 'preset_edelweiss',
        title: '5. エーデルワイス',
        isPreset: true,
        scoreText: 'ミ ー ソ 高いレ ー ー 高いド ー ソ ファ ー ー ミ ー ミ ミ ファ ソ ラ ー ー ソ ー ー ミ ー ソ 高いレ ー ー 高いド ー ソ ファ ー ー ミ ー ソ ソ ラ シ 高いド ー ー 高いド ー ー'
      },
      {
        id: 'preset_ode_to_joy',
        title: '6. 喜びの歌（交響曲第9番）',
        isPreset: true,
        scoreText: 'ミ ミ ファ ソ ソ ファ ミ レ ド ド レ ミ ミ ー レ レ ー ミ ミ ファ ソ ソ ファ ミ レ ド ド レ ミ レ ー ド ド ー'
      },
      {
        id: 'preset_high_notes',
        title: '7. 高い音の練習（サミング入門）',
        isPreset: true,
        scoreText: 'ソ ラ シ 高いド 高いレ 高いミ ー 高いファ ー 高いソ ー 高いラ ー 高いソ 高いファ 高いミ 高いレ 高いド ー'
      }
    ];

    /**
     * ============================================================================
     * 2. Web Audio API ソプラノリコーダー音源エンジン
     * ============================================================================
     */
    class RecorderAudioEngine {
      constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.noiseBuffer = null;
        this.enabled = true;
      }

      ensureContext() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(0.42, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);

          // 息のノイズ用ホワイトノイズバッファ生成
          const bufferSize = this.ctx.sampleRate * 1.5;
          this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = this.noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
      }

      // 優しいソプラノリコーダー音を単発再生（durationSec秒）
      playNote(midi, durationSec = 0.55) {
        if (!this.enabled) return;
        this.ensureContext();

        const now = this.ctx.currentTime;
        const freq = this.midiToFreq(midi);

        const noteGain = this.ctx.createGain();
        noteGain.gain.setValueAtTime(0.0001, now);
        // タンギングの柔らかい立ち上がり
        noteGain.gain.linearRampToValueAtTime(0.85, now + 0.045);
        noteGain.gain.setValueAtTime(0.78, now + Math.max(0.06, durationSec - 0.08));
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

        // 1. 基音（純粋で澄んだサイン波）
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        const gain1 = this.ctx.createGain();
        gain1.gain.setValueAtTime(0.75, now);

        // 2. 2倍音・3倍音（木管らしい温かみ）
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq, now);
        const gain2 = this.ctx.createGain();
        gain2.gain.setValueAtTime(0.22, now);

        // 3. 歌口を通るかすかな息のノイズ
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = this.noiseBuffer;
        noiseSrc.loop = true;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(Math.min(freq * 2.2, 4800), now);
        noiseFilter.Q.setValueAtTime(3.5, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.06, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.015, now + 0.12);

        // 4. わずかな息の揺らぎ（ビブラート）
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4.6, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(2.5, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        osc1.connect(gain1);
        osc2.connect(gain2);
        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);

        gain1.connect(noteGain);
        gain2.connect(noteGain);
        noiseGain.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc1.start(now);
        osc2.start(now);
        noiseSrc.start(now);
        lfo.start(now);

        const stopAt = now + durationSec + 0.03;
        osc1.stop(stopAt);
        osc2.stop(stopAt);
        noiseSrc.stop(stopAt);
        lfo.stop(stopAt);
      }

      // カウントイン用の優しいクリック音
      playClick(isAccent = false) {
        if (!this.enabled) return;
        this.ensureContext();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(isAccent ? 1046.5 : 784, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    }

    /**
     * ============================================================================
     * 3. ドレミ楽譜パーサー
     * ============================================================================
     */
    function parseDoremiScore(rawText) {
      if (!rawText || !rawText.trim()) return [];

      const normalized = rawText
        .replace(/＃/g, '#')
        .replace(/♯/g, '#')
        .replace(/♭/g, 'b')
        .replace(/－|―|—|〜/g, 'ー')
        .replace(/[　、，,/|・\r\n]+/g, ' ');

      const tokenRegex = /(高い|たかい|低い|ひくい)?(ド|レ|ミ|ファ|ソ|ラ|シ)(#|b)?(↑)?|(ー)|(休)/g;
      const semitoneMap = { 'ド': 0, 'レ': 2, 'ミ': 4, 'ファ': 5, 'ソ': 7, 'ラ': 9, 'シ': 11 };

      const items = [];
      let match;
      while ((match = tokenRegex.exec(normalized)) !== null) {
        const [, prefix, noteName, acc, arrow, extSym, restSym] = match;
        if (extSym) {
          items.push({ type: 'extend', label: 'ー', noteObj: null });
          continue;
        }
        if (restSym) {
          items.push({ type: 'rest', label: '休', noteObj: null });
          continue;
        }
        if (noteName) {
          let semi = semitoneMap[noteName];
          if (acc === '#') semi += 1;
          if (acc === 'b') semi -= 1;

          const isHigh = (prefix === '高い' || prefix === 'たかい' || arrow === '↑');
          const octave = isHigh ? 6 : 5;
          let midi = (octave + 1) * 12 + semi;

          // ソプラノリコーダー音域（C5=72 〜 A6=93）に収める
          if (midi < 72) midi = 72;
          if (midi > 93) midi = 93;

          const noteObj = RECORDER_NOTES.find(n => n.midi === midi) || RECORDER_NOTES[0];
          items.push({
            type: 'note',
            label: noteObj.shortName,
            noteObj
          });
        }
      }
      return items;
    }

    /**
     * ============================================================================
     * 4. アプリケーション状態管理
     * ============================================================================
     */
    const audio = new RecorderAudioEngine();

    const state = {
      soundEnabled: true,
      fingeringSystem: 'german', // 'german' | 'baroque'
      recColor: 'cream',         // 'cream' | 'wood' | 'blue' | 'pink'
      perspective: 'front',      // 'front'（正面） | 'self'（自分目線・反転）
      layout: 'vertical',        // 'vertical'（たて向き） | 'horizontal'（よこ向き）
      showFingerLabels: true,
      showAccidentals: false,

      currentNoteId: 'C5',
      customHoles: null,         // 自由確認モードで穴を直接クリックした際の配列 [0..7]

      mode: 'free',              // 'free' | 'step' | 'auto'
      songs: [],
      currentSongId: 'preset_twinkle',
      parsedNotes: [],
      stepIndex: 0,

      isAutoPlaying: false,
      autoTimer: null,
      bpm: 88,
      countInEnabled: true,
      repeatEnabled: false,

      editingSongId: null,
      pendingDeleteId: null
    };

    const WHITE_PC_KEYS = [
      { code: 'KeyA', label: 'A' },
      { code: 'KeyS', label: 'S' },
      { code: 'KeyD', label: 'D' },
      { code: 'KeyF', label: 'F' },
      { code: 'KeyG', label: 'G' },
      { code: 'KeyH', label: 'H' },
      { code: 'KeyJ', label: 'J' },
      { code: 'KeyK', label: 'K' },
      { code: 'KeyL', label: 'L' },
      { code: 'Semicolon', label: ';' },
      { code: 'Quote', label: "'" },
      { code: 'BracketRight', label: ']' },
      { code: 'Backslash', label: '\\' }
    ];

    const ALL_PC_KEYS = [
      { code: 'KeyA', label: 'A' }, // C5
      { code: 'KeyW', label: 'W' }, // C#5
      { code: 'KeyS', label: 'S' }, // D5
      { code: 'KeyE', label: 'E' }, // D#5
      { code: 'KeyD', label: 'D' }, // E5
      { code: 'KeyF', label: 'F' }, // F5
      { code: 'KeyT', label: 'T' }, // F#5
      { code: 'KeyG', label: 'G' }, // G5
      { code: 'KeyY', label: 'Y' }, // G#5
      { code: 'KeyH', label: 'H' }, // A5
      { code: 'KeyU', label: 'U' }, // A#5
      { code: 'KeyJ', label: 'J' }, // B5
      { code: 'KeyK', label: 'K' }, // C6
      { code: 'KeyO', label: 'O' }, // C#6
      { code: 'KeyL', label: 'L' }, // D6
      { code: 'KeyP', label: 'P' }, // D#6
      { code: 'Semicolon', label: ';' }, // E6
      { code: 'Quote', label: "'" }, // F6
      { code: 'BracketLeft', label: '[' }, // F#6
      { code: 'BracketRight', label: ']' }, // G6
      { code: 'Backslash', label: '\\' }, // G#6
      { code: 'Enter', label: 'Ent' } // A6
    ];

    let pcCodeToNoteId = new Map();

    function showToast(msg, type = 'info') {
      const container = document.getElementById('toastContainer');
      const el = document.createElement('div');
      const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';
      el.className = `${bg} text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-lg transition-all duration-300 translate-y-2 opacity-0`;
      el.textContent = msg;
      container.appendChild(el);
      requestAnimationFrame(() => el.classList.remove('translate-y-2', 'opacity-0'));
      setTimeout(() => {
        el.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => el.remove(), 300);
      }, 2400);
    }

    /**
     * ============================================================================
     * 5. ソプラノリコーダー SVG 描画エンジン（たて向き / よこ向き × 正面 / 自分目線）
     * ============================================================================
     */
    function getActiveHolesArray() {
      if (state.customHoles) return state.customHoles;
      const noteObj = RECORDER_NOTES.find(n => n.id === state.currentNoteId) || RECORDER_NOTES[0];
      return noteObj[state.fingeringSystem];
    }

    function renderRecorderSVG() {
      const stage = document.getElementById('recorderSvgStage');
      const holes = getActiveHolesArray();
      const isSelf = state.perspective === 'self';
      const isHoriz = state.layout === 'horizontal';

      // サミングバッジ表示更新（裏穴0がhalfのとき）
      const thumbingBadge = document.getElementById('thumbingBadge');
      if (holes[0] === 'half') {
        thumbingBadge.classList.remove('hidden');
      } else {
        thumbingBadge.classList.add('hidden');
      }

      // 向きキャプション更新
      const captionEl = document.getElementById('orientationCaption');
      if (!isHoriz) {
        captionEl.textContent = isSelf
          ? '🪞 自分目線（手元・左右反転：裏穴0は右側）'
          : '👀 正面から見た図（運指表：裏穴0は左側）';
      } else {
        captionEl.textContent = isSelf
          ? '🪞 よこ向き・自分目線（裏穴0は下側）'
          : '👀 よこ向き・正面（裏穴0は上側）';
      }

      if (!isHoriz) {
        stage.innerHTML = buildVerticalRecorderSVG(holes, isSelf);
      } else {
        stage.innerHTML = buildHorizontalRecorderSVG(holes, isSelf);
      }

      // 穴のクリックイベント（自由確認モードでの逆引き操作）
      stage.querySelectorAll('[data-hole-idx]').forEach(el => {
        const idx = Number(el.dataset.holeIdx);
        const meta = HOLE_META[idx];
        el.classList.add('hole-control');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', (meta ? meta.finger : '穴' + (idx + 1)) + '。タップして状態を切り替え');
        el.setAttribute('aria-pressed', String(holes[idx] !== 'open'));
        el.addEventListener('click', () => handleHoleDirectClick(idx));
        el.addEventListener('keydown', (e) => {
          if (e.code !== 'Enter' && e.code !== 'Space') return;
          e.preventDefault();
          e.stopPropagation();
          if (!e.repeat) handleHoleDirectClick(idx);
        });
      });
    }

    // 穴の状態に応じたSVG要素を生成するヘルパー
    function renderHoleGraphic(idx, cx, cy, r, holeState, isDouble = false) {
      const isClosed = holeState === 'closed';
      const isHalf = holeState === 'half';

      let svg = `<g data-hole-idx="${idx}" class="cursor-pointer group">`;

      // 当たり判定を広げる透明円
      svg += `<circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="transparent" />`;

      // 光るアンバーガイドリング（閉または半開のとき）
      if (isClosed || isHalf) {
        svg += `<circle cx="${cx}" cy="${cy}" r="${r + 4.5}" fill="none" stroke="#f59e0b" stroke-width="3" class="guide-halo" />`;
      }

      if (!isDouble) {
        // 単一穴（0〜5番）
        if (isClosed) {
          svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />`;
          svg += `<circle cx="${cx - r * 0.28}" cy="${cy - r * 0.28}" r="${r * 0.22}" fill="rgba(255,255,255,0.28)" />`;
        } else if (isHalf) {
          // サミング（左半分閉・右半分開）
          const clipId = `halfClip_${idx}_${Math.round(cx)}_${Math.round(cy)}`;
          svg += `
            <defs>
              <clipPath id="${clipId}">
                <rect x="${cx - r}" y="${cy - r}" width="${r}" height="${r * 2}" />
              </clipPath>
            </defs>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="#d97706" stroke-width="2.2" />
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="#1e293b" clip-path="url(#${clipId})" />
            <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#f59e0b" stroke-width="1.5" />
          `;
        } else {
          // 開
          svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="#64748b" stroke-width="2" class="group-hover:stroke-sky-500" />`;
        }
      } else {
        // ダブルホール（6番・7番：大小2つの穴が並ぶ）
        const offset = r * 0.56;
        const rLeft = r * 0.54;
        const rRight = r * 0.44;
        const leftClosed = isClosed || isHalf;
        const rightClosed = isClosed;

        svg += `<circle cx="${cx - offset}" cy="${cy}" r="${rLeft}" fill="${leftClosed ? '#1e293b' : '#ffffff'}" stroke="${leftClosed ? '#f59e0b' : '#64748b'}" stroke-width="1.8" />`;
        svg += `<circle cx="${cx + offset}" cy="${cy}" r="${rRight}" fill="${rightClosed ? '#1e293b' : '#ffffff'}" stroke="${rightClosed ? '#f59e0b' : '#64748b'}" stroke-width="1.8" />`;
      }

      svg += `</g>`;
      return svg;
    }

    // たて向きソプラノリコーダーSVG
    function buildVerticalRecorderSVG(holes, isSelf) {
      const w = 360;
      const h = 430;
      const cx = 180;

      // 正面なら裏穴0は左側(cx - 46)、自分目線なら右側(cx + 46)
      const thumbX = isSelf ? cx + 46 : cx - 46;
      const thumbLabelX = isSelf ? thumbX + 22 : thumbX - 22;
      const thumbAnchor = isSelf ? 'start' : 'end';

      // 指ガイドラベルは裏穴の反対側（または見やすい側）に配置
      const labelSideX = isSelf ? cx - 34 : cx + 34;
      const labelAnchor = isSelf ? 'end' : 'start';
      const handBracketX = isSelf ? cx - 118 : cx + 118;

      const yPositions = [132, 156, 194, 232, 282, 316, 350, 384];

      let fingerGuidesSvg = '';
      if (state.showFingerLabels) {
        // 左手・右手エリア括弧
        fingerGuidesSvg += `
          <line x1="${handBracketX}" y1="126" x2="${handBracketX}" y2="238" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
          <text x="${isSelf ? handBracketX - 6 : handBracketX + 6}" y="186" text-anchor="${labelAnchor}" fill="#0369a1" font-size="12" font-weight="800">左手</text>
          <line x1="${handBracketX}" y1="276" x2="${handBracketX}" y2="390" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" />
          <text x="${isSelf ? handBracketX - 6 : handBracketX + 6}" y="337" text-anchor="${labelAnchor}" fill="#b45309" font-size="12" font-weight="800">右手</text>
        `;

        // 裏穴0ラベル
        fingerGuidesSvg += `
          <text x="${thumbLabelX}" y="${yPositions[0] + 4}" text-anchor="${thumbAnchor}" fill="#1e293b" font-size="11.5" font-weight="800">0:親指(うら)</text>
        `;

        // 表穴1〜7ラベル
        for (let i = 1; i <= 7; i++) {
          const meta = HOLE_META[i];
          const isActive = holes[i] !== 'open';
          fingerGuidesSvg += `
            <text x="${labelSideX}" y="${yPositions[i] + 4}" text-anchor="${labelAnchor}" fill="${isActive ? '#0f172a' : '#64748b'}" font-size="11.5" font-weight="${isActive ? '800' : '600'}">${i}:${meta.finger}</text>
          `;
        }
      }

      return `
        <svg viewBox="0 0 ${w} ${h}" class="w-full max-w-[360px] h-auto max-h-[370px] select-none">
          <!-- 吹き口（ビーク） -->
          <path d="M ${cx - 14} 14 L ${cx + 14} 14 L ${cx + 18} 54 L ${cx - 18} 54 Z"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" stroke-linejoin="round" />
          <!-- 歌口（ウィンドウェイ窓） -->
          <rect x="${cx - 7}" y="58" width="14" height="16" rx="2" fill="var(--rec-window)" />
          <!-- 頭部管 -->
          <rect x="${cx - 19}" y="52" width="38" height="44" rx="4"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" />
          <!-- 頭部ジョイント装飾リング -->
          <rect x="${cx - 22}" y="94" width="44" height="10" rx="4"
                fill="var(--rec-ring)" stroke="var(--rec-stroke)" stroke-width="1.5" />

          <!-- 中部管（メインボディ） -->
          <rect x="${cx - 17}" y="104" width="34" height="222" rx="3"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" />

          <!-- 足部ジョイント装飾リング -->
          <rect x="${cx - 20}" y="324" width="40" height="9" rx="4"
                fill="var(--rec-ring)" stroke="var(--rec-stroke)" stroke-width="1.5" />

          <!-- 足部管（ベル部分） -->
          <path d="M ${cx - 17} 333 L ${cx + 17} 333 L ${cx + 22} 412 L ${cx - 22} 412 Z"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" stroke-linejoin="round" />
          <rect x="${cx - 24}" y="408" width="48" height="8" rx="4"
                fill="var(--rec-ring)" stroke="var(--rec-stroke)" stroke-width="1.5" />

          <!-- 裏穴0への接続点線 -->
          <line x1="${thumbX}" y1="${yPositions[0]}" x2="${cx - (isSelf ? -17 : 17)}" y2="${yPositions[0]}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2" />

          <!-- 8つの音孔描画 -->
          ${renderHoleGraphic(0, thumbX, yPositions[0], 11, holes[0], false)}
          ${renderHoleGraphic(1, cx, yPositions[1], 10, holes[1], false)}
          ${renderHoleGraphic(2, cx, yPositions[2], 10, holes[2], false)}
          ${renderHoleGraphic(3, cx, yPositions[3], 10, holes[3], false)}
          ${renderHoleGraphic(4, cx, yPositions[4], 10, holes[4], false)}
          ${renderHoleGraphic(5, cx, yPositions[5], 10, holes[5], false)}
          ${renderHoleGraphic(6, cx, yPositions[6], 10, holes[6], true)}
          ${renderHoleGraphic(7, cx, yPositions[7], 10, holes[7], true)}

          <!-- 指ガイドテキスト -->
          ${fingerGuidesSvg}
        </svg>
      `;
    }

    // よこ向きソプラノリコーダーSVG（左に歌口・右に足部管）
    function buildHorizontalRecorderSVG(holes, isSelf) {
      const w = 640;
      const h = 230;
      const cy = 115;

      // 正面なら裏穴0は上側(cy - 44)、自分目線なら下側(cy + 44)
      const thumbY = isSelf ? cy + 44 : cy - 44;
      const labelY = isSelf ? cy - 32 : cy + 36;
      const handBracketY = isSelf ? cy - 72 : cy + 72;

      const xPositions = [185, 222, 274, 326, 396, 446, 496, 546];

      let fingerGuidesSvg = '';
      if (state.showFingerLabels) {
        fingerGuidesSvg += `
          <line x1="212" y1="${handBracketY}" x2="336" y2="${handBracketY}" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
          <text x="274" y="${isSelf ? handBracketY - 8 : handBracketY + 16}" text-anchor="middle" fill="#0369a1" font-size="12" font-weight="800">左手</text>

          <line x1="386" y1="${handBracketY}" x2="556" y2="${handBracketY}" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" />
          <text x="471" y="${isSelf ? handBracketY - 8 : handBracketY + 16}" text-anchor="middle" fill="#b45309" font-size="12" font-weight="800">右手</text>

          <text x="${xPositions[0]}" y="${isSelf ? thumbY + 24 : thumbY - 18}" text-anchor="middle" fill="#1e293b" font-size="11.5" font-weight="800">0:親指(うら)</text>
        `;

        for (let i = 1; i <= 7; i++) {
          const meta = HOLE_META[i];
          const isActive = holes[i] !== 'open';
          fingerGuidesSvg += `
            <text x="${xPositions[i]}" y="${labelY}" text-anchor="middle" fill="${isActive ? '#0f172a' : '#64748b'}" font-size="11" font-weight="${isActive ? '800' : '600'}">${i}:${meta.shortFinger}</text>
          `;
        }
      }

      return `
        <svg viewBox="0 0 ${w} ${h}" class="w-full max-w-[640px] h-auto max-h-[250px] select-none">
          <!-- 左側：吹き口（ビーク） -->
          <path d="M 16 ${cy - 14} L 16 ${cy + 14} L 72 ${cy + 18} L 72 ${cy - 18} Z"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" stroke-linejoin="round" />
          <!-- 歌口 -->
          <rect x="78" y="${cy - 7}" width="20" height="14" rx="2" fill="var(--rec-window)" />
          <!-- 頭部管 -->
          <rect x="70" y="${cy - 19}" width="62" height="38" rx="4"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" />
          <!-- 頭部ジョイントリング -->
          <rect x="130" y="${cy - 22}" width="12" height="44" rx="4"
                fill="var(--rec-ring)" stroke="var(--rec-stroke)" stroke-width="1.5" />

          <!-- 中部管 -->
          <rect x="142" y="${cy - 17}" width="322" height="34" rx="3"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" />

          <!-- 足部ジョイントリング -->
          <rect x="462" y="${cy - 20}" width="11" height="40" rx="4"
                fill="var(--rec-ring)" stroke="var(--rec-stroke)" stroke-width="1.5" />

          <!-- 足部管 -->
          <path d="M 473 ${cy - 17} L 473 ${cy + 17} L 592 ${cy + 22} L 592 ${cy - 22} Z"
                fill="var(--rec-body)" fill-opacity="var(--rec-opacity)" stroke="var(--rec-stroke)" stroke-width="2" stroke-linejoin="round" />
          <rect x="588" y="${cy - 24}" width="10" height="48" rx="4"
                fill="var(--rec-ring)" stroke="var(--rec-stroke)" stroke-width="1.5" />

          <!-- 裏穴接続点線 -->
          <line x1="${xPositions[0]}" y1="${thumbY}" x2="${xPositions[0]}" y2="${cy - (isSelf ? -17 : 17)}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2" />

          <!-- 8つの音孔描画 -->
          ${renderHoleGraphic(0, xPositions[0], thumbY, 11, holes[0], false)}
          ${renderHoleGraphic(1, xPositions[1], cy, 10, holes[1], false)}
          ${renderHoleGraphic(2, xPositions[2], cy, 10, holes[2], false)}
          ${renderHoleGraphic(3, xPositions[3], cy, 10, holes[3], false)}
          ${renderHoleGraphic(4, xPositions[4], cy, 10, holes[4], false)}
          ${renderHoleGraphic(5, xPositions[5], cy, 10, holes[5], false)}
          ${renderHoleGraphic(6, xPositions[6], cy, 10, holes[6], true)}
          ${renderHoleGraphic(7, xPositions[7], cy, 10, holes[7], true)}

          <!-- 指ガイドテキスト -->
          ${fingerGuidesSvg}
        </svg>
      `;
    }

    /**
     * ============================================================================
     * 6. 五線譜（ト音記号）ミニSVG描画 ＆ 運指解説パネル更新
     * ============================================================================
     */
    function renderStaffSVG(noteObj) {
      const container = document.getElementById('staffSvgContainer');
      if (!noteObj) {
        container.innerHTML = `<span class="text-xs font-bold text-slate-400 py-4">（オリジナルの押さえ方）</span>`;
        return;
      }

      // 五線の基準Y座標（第1線=E4(staffStep=0) を y=74 に設定し、1ステップ=5.5pxずつ上へ）
      const baseLineY = 74;
      const stepPx = 5.5;
      const noteY = baseLineY - noteObj.staffStep * stepPx;
      const noteX = 135;

      // 五線（step = 0, 2, 4, 6, 8）
      let linesSvg = '';
      for (let s = 0; s <= 8; s += 2) {
        const y = baseLineY - s * stepPx;
        linesSvg += `<line x1="25" y1="${y}" x2="215" y2="${y}" stroke="#64748b" stroke-width="1.3" />`;
      }

      // 加線（低いド step=-2、高いラ step=10）
      let ledgerSvg = '';
      if (noteObj.staffStep <= -2) {
        const y = baseLineY - (-2) * stepPx;
        ledgerSvg += `<line x1="${noteX - 16}" y1="${y}" x2="${noteX + 16}" y2="${y}" stroke="#334155" stroke-width="1.6" />`;
      }
      if (noteObj.staffStep >= 10) {
        const y = baseLineY - 10 * stepPx;
        ledgerSvg += `<line x1="${noteX - 16}" y1="${y}" x2="${noteX + 16}" y2="${y}" stroke="#334155" stroke-width="1.6" />`;
      }

      // 臨時記号（# / ♭）
      let accSvg = '';
      if (noteObj.accidental === '#') {
        accSvg = `<text x="${noteX - 22}" y="${noteY + 5}" fill="#0f172a" font-size="16" font-weight="800">♯</text>`;
      } else if (noteObj.accidental === 'b') {
        accSvg = `<text x="${noteX - 22}" y="${noteY + 4}" fill="#0f172a" font-size="16" font-weight="800">♭</text>`;
      }

      // 符幹（第3線 step=4 以上は下向き、未満は上向き）
      const stemDown = noteObj.staffStep >= 4;
      const stemSvg = stemDown
        ? `<line x1="${noteX - 7.2}" y1="${noteY}" x2="${noteX - 7.2}" y2="${noteY + 26}" stroke="#0f172a" stroke-width="2" />`
        : `<line x1="${noteX + 7.2}" y1="${noteY}" x2="${noteX + 7.2}" y2="${noteY - 26}" stroke="#0f172a" stroke-width="2" />`;

      container.innerHTML = `
        <svg viewBox="0 0 240 105" class="w-full max-w-[240px] h-[95px]">
          ${linesSvg}
          <!-- ト音記号 -->
          <text x="32" y="75" fill="#1e293b" font-size="58" font-family="serif">𝄞</text>
          ${ledgerSvg}
          ${accSvg}
          <!-- 音符ヘッド -->
          <ellipse cx="${noteX}" cy="${noteY}" rx="8" ry="5.6" transform="rotate(-15 ${noteX} ${noteY})" fill="#0f172a" />
          ${stemSvg}
          <!-- 音名ラベル -->
          <text x="${noteX + 22}" y="${noteY + 4}" fill="#0284c7" font-size="12" font-weight="800">${noteObj.shortName}</text>
        </svg>
      `;
    }

    function updateNoteDetailPanel() {
      const holes = getActiveHolesArray();
      const matchedNote = state.customHoles
        ? findMatchingNoteByHoles(state.customHoles)
        : (RECORDER_NOTES.find(n => n.id === state.currentNoteId) || RECORDER_NOTES[0]);

      const nameEl = document.getElementById('currentNoteNameDisplay');
      const subEl = document.getElementById('currentNoteSubDisplay');
      const sysBadge = document.getElementById('currentSystemBadge');
      const summaryBox = document.getElementById('fingerSummaryBox');
      const tipText = document.getElementById('playingTipText');

      sysBadge.textContent = state.fingeringSystem === 'german' ? 'ジャーマン式' : 'バロック式';

      if (matchedNote) {
        nameEl.textContent = matchedNote.name;
        subEl.textContent = `(${matchedNote.subLabel})`;
        tipText.textContent = matchedNote.tip;
      } else {
        nameEl.textContent = '？';
        subEl.textContent = '（一致する運指なし）';
        tipText.textContent = '穴を直接クリックして確認中です。標準の運指と一致すると音名と吹き方が表示されます。';
      }

      renderStaffSVG(matchedNote);

      // おさえる指のテキストサマリー生成
      const thumbDesc = holes[0] === 'closed'
        ? '<span class="text-slate-900 font-extrabold">しっかりふさぐ</span>'
        : holes[0] === 'half'
          ? '<span class="text-amber-700 font-extrabold">半分あける（サミング）</span>'
          : '<span class="text-slate-400">あける</span>';

      const leftClosed = [1, 2, 3].filter(i => holes[i] === 'closed').map(i => HOLE_META[i].finger);
      const leftDesc = leftClosed.length > 0
        ? `<span class="text-sky-800 font-extrabold">${leftClosed.join('・')}</span>`
        : '<span class="text-slate-400">なし（全部あける）</span>';

      const rightClosed = [4, 5, 6, 7].filter(i => holes[i] !== 'open').map(i => {
        if (holes[i] === 'half') return `${HOLE_META[i].finger}[半分]`;
        return HOLE_META[i].finger;
      });
      const rightDesc = rightClosed.length > 0
        ? `<span class="text-amber-800 font-extrabold">${rightClosed.join('・')}</span>`
        : '<span class="text-slate-400">なし（全部あける）</span>';

      summaryBox.innerHTML = `
        <div>👍 <strong>うら(0)：</strong>${thumbDesc}</div>
        <div>✋ <strong>左手(1〜3)：</strong>${leftDesc}</div>
        <div>🤚 <strong>右手(4〜7)：</strong>${rightDesc}</div>
      `;
    }

    // 自由確認モード：穴をクリックして逆引き
    function handleHoleDirectClick(idx) {
      if (state.mode !== 'free') {
        showToast('穴の直接操作は「自由確認」モードで使えます', 'info');
        return;
      }

      const restoreFocus = document.activeElement?.dataset?.holeIdx === String(idx);
      const currentHoles = [...getActiveHolesArray()];
      const curState = currentHoles[idx];

      // 0番・6番・7番は open -> closed -> half -> open の3段階、1〜5番は open <-> closed
      if (idx === 0 || idx === 6 || idx === 7) {
        if (curState === 'open') currentHoles[idx] = 'closed';
        else if (curState === 'closed') currentHoles[idx] = 'half';
        else currentHoles[idx] = 'open';
      } else {
        currentHoles[idx] = curState === 'open' ? 'closed' : 'open';
      }

      state.customHoles = currentHoles;
      const matched = findMatchingNoteByHoles(currentHoles);
      if (matched) {
        state.currentNoteId = matched.id;
        audio.playNote(matched.midi, 0.55);
      }

      renderRecorderSVG();
      updateNoteDetailPanel();
      highlightActiveNoteButton(matched ? matched.id : null);
      if (restoreFocus) {
        document.querySelector('[data-hole-idx="' + idx + '"]')?.focus();
      }
    }

    function findMatchingNoteByHoles(holesArr) {
      return RECORDER_NOTES.find(note => {
        const ref = note[state.fingeringSystem];
        return ref.every((val, i) => val === holesArr[i]);
      }) || null;
    }

    /**
     * ============================================================================
     * 7. 音階選択 ＆ 音階ボタン・PCキーボード操作
     * ============================================================================
     */
    function selectNoteById(noteId, shouldPlaySound = true) {
      state.customHoles = null;
      state.currentNoteId = noteId;
      const noteObj = RECORDER_NOTES.find(n => n.id === noteId) || RECORDER_NOTES[0];

      if (shouldPlaySound) {
        audio.playNote(noteObj.midi, 0.55);
      }

      renderRecorderSVG();
      updateNoteDetailPanel();
      highlightActiveNoteButton(noteObj.id);
    }

    function renderNoteButtons() {
      const container = document.getElementById('noteButtonsContainer');
      container.innerHTML = '';
      pcCodeToNoteId.clear();

      const visibleNotes = state.showAccidentals
        ? RECORDER_NOTES
        : RECORDER_NOTES.filter(n => !n.isSharp);

      const keyMapList = state.showAccidentals ? ALL_PC_KEYS : WHITE_PC_KEYS;

      // グリッドカラム数の調整
      container.className = state.showAccidentals
        ? 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-1.5'
        : 'grid grid-cols-5 sm:grid-cols-7 md:grid-cols-13 gap-1.5 sm:gap-2';

      visibleNotes.forEach((noteObj, index) => {
        const pcKey = keyMapList[index];
        if (pcKey) {
          pcCodeToNoteId.set(pcKey.code, noteObj.id);
        }

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.noteId = noteObj.id;

        const isSharp = noteObj.isSharp;
        const isHigh = noteObj.midi >= 84; // 高いド以上

        let colorStyle = isSharp
          ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-900 shadow-[0_3px_0_#0f172a]'
          : isHigh
            ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300 shadow-[0_3px_0_#fcd34d]'
            : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border-sky-200 shadow-[0_3px_0_#bae6fd]';

        btn.className = `note-pad-btn rounded-xl border py-2 px-1 flex flex-col items-center justify-center ${colorStyle}`;

        const labelSpan = document.createElement('span');
        labelSpan.className = 'text-xs sm:text-sm font-extrabold leading-tight';
        labelSpan.textContent = noteObj.shortName;
        btn.appendChild(labelSpan);

        if (pcKey) {
          const keyBadge = document.createElement('span');
          keyBadge.className = `text-[10px] font-bold mt-0.5 px-1.5 rounded ${isSharp ? 'bg-slate-700 text-slate-300' : 'bg-white/80 text-slate-500'}`;
          keyBadge.textContent = pcKey.label;
          btn.appendChild(keyBadge);
        }

        btn.addEventListener('click', () => {
          handleNotePadTrigger(noteObj.id);
        });

        container.appendChild(btn);
      });

      highlightActiveNoteButton(state.customHoles ? null : state.currentNoteId);
    }

    function highlightActiveNoteButton(noteId) {
      document.querySelectorAll('.note-pad-btn').forEach(btn => {
        if (btn.dataset.noteId === noteId) {
          btn.classList.add('ring-2', 'ring-amber-500', 'scale-[1.03]');
        } else {
          btn.classList.remove('ring-2', 'ring-amber-500', 'scale-[1.03]');
        }
      });
    }

    function handleNotePadTrigger(noteId) {
      // ステップ練習モード中に、いま表示されている音階ボタンを押したら次の音へ進める便利機能
      if (state.mode === 'step') {
        const curItem = state.parsedNotes[state.stepIndex];
        if (curItem && curItem.type === 'note' && curItem.noteObj.id === noteId) {
          audio.playNote(curItem.noteObj.midi, 0.5);
          advanceStepPractice(1);
          return;
        }
      }
      selectNoteById(noteId, true);
    }

    /**
     * ============================================================================
     * 8. 楽譜管理・ステップ練習・自動ガイド再生
     * ============================================================================
     */
    function loadSongsFromStorage() {
      let custom = [];
      try {
        const raw = localStorage.getItem('soprano_recorder_songs_v1');
        if (raw) custom = JSON.parse(raw);
      } catch (e) {
        custom = [];
      }
      state.songs = [...PRESET_SONGS, ...custom];
    }

    function saveCustomSongsToStorage() {
      const customOnly = state.songs.filter(s => !s.isPreset);
      try {
        localStorage.setItem('soprano_recorder_songs_v1', JSON.stringify(customOnly));
      } catch (e) {
        showToast('ブラウザの保存容量がいっぱいです', 'error');
      }
    }

    function populateSongSelect() {
      const select = document.getElementById('songSelect');
      select.innerHTML = '';

      const presetGroup = document.createElement('optgroup');
      presetGroup.label = '🎵 プリセット練習曲';
      state.songs.filter(s => s.isPreset).forEach(song => {
        const opt = document.createElement('option');
        opt.value = song.id;
        opt.textContent = song.title;
        presetGroup.appendChild(opt);
      });
      select.appendChild(presetGroup);

      const customSongs = state.songs.filter(s => !s.isPreset);
      if (customSongs.length > 0) {
        const customGroup = document.createElement('optgroup');
        customGroup.label = '⭐ マイ楽譜（保存した曲）';
        customSongs.forEach(song => {
          const opt = document.createElement('option');
          opt.value = song.id;
          opt.textContent = song.title;
          customGroup.appendChild(opt);
        });
        select.appendChild(customGroup);
      }

      select.value = state.currentSongId;
      updateCustomSongActionsVisibility();
    }

    function updateCustomSongActionsVisibility() {
      const song = state.songs.find(s => s.id === state.currentSongId);
      const box = document.getElementById('customSongActions');
      if (song && !song.isPreset) {
        box.classList.remove('hidden');
        box.classList.add('flex');
      } else {
        box.classList.add('hidden');
        box.classList.remove('flex');
      }
    }

    function selectSong(songId) {
      stopAutoPlay();
      const song = state.songs.find(s => s.id === songId) || state.songs[0];
      state.currentSongId = song.id;
      state.parsedNotes = parseDoremiScore(song.scoreText);
      state.stepIndex = 0;

      if (state.mode === 'step') {
        skipNonPlayableInStepMode(1);
      }

      document.getElementById('currentSongTitleDisplay').textContent = song.title;
      document.getElementById('songSelect').value = song.id;
      updateCustomSongActionsVisibility();

      if (state.mode !== 'free') {
        syncRecorderToCurrentStep(false);
      }
      renderScoreRibbon();
      updatePracticeBadge();
    }

    function skipNonPlayableInStepMode(dir = 1) {
      while (
        state.stepIndex >= 0 &&
        state.stepIndex < state.parsedNotes.length &&
        state.parsedNotes[state.stepIndex].type !== 'note'
      ) {
        state.stepIndex += dir;
      }
      if (state.stepIndex < 0) state.stepIndex = 0;
    }

    function syncRecorderToCurrentStep(playSound = false) {
      const item = state.parsedNotes[state.stepIndex];
      if (item && item.type === 'note' && item.noteObj) {
        selectNoteById(item.noteObj.id, playSound);
      }
    }

    function advanceStepPractice(delta) {
      if (state.parsedNotes.length === 0) return;

      let nextIdx = state.stepIndex + delta;
      while (
        nextIdx >= 0 &&
        nextIdx < state.parsedNotes.length &&
        state.parsedNotes[nextIdx].type !== 'note'
      ) {
        nextIdx += delta;
      }

      if (nextIdx < 0) {
        showToast('最初の音です', 'info');
        return;
      }

      if (nextIdx >= state.parsedNotes.length) {
        showToast('🎉 最後まで練習できました！最初に戻ります', 'success');
        state.stepIndex = 0;
        skipNonPlayableInStepMode(1);
      } else {
        state.stepIndex = nextIdx;
      }

      syncRecorderToCurrentStep(true);
      renderScoreRibbon();
      updatePracticeBadge();
    }

    function renderScoreRibbon() {
      const ribbon = document.getElementById('scoreRibbon');
      ribbon.innerHTML = '';

      if (state.parsedNotes.length === 0) {
        ribbon.innerHTML = '<span class="text-xs text-slate-400 px-2">楽譜データがありません</span>';
        return;
      }

      state.parsedNotes.forEach((item, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.dataset.step = idx;

        const isCurrent = (state.mode !== 'free') && idx === state.stepIndex;
        const isPast = (state.mode !== 'free') && idx < state.stepIndex;

        let cls = 'shrink-0 px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm transition-all duration-150 min-w-[44px] text-center ';
        if (isCurrent) {
          cls += 'bg-amber-300 border-amber-500 text-slate-900 font-extrabold scale-110 shadow-sm ring-2 ring-amber-400/50';
        } else if (isPast) {
          cls += 'bg-slate-200/70 border-slate-200 text-slate-400 font-bold';
        } else if (item.type === 'extend') {
          cls += 'bg-sky-50 border-sky-200 text-sky-600 font-bold';
        } else if (item.type === 'rest') {
          cls += 'bg-slate-100 border-slate-200 text-slate-500 font-bold';
        } else {
          cls += 'bg-white hover:bg-sky-50 border-slate-200 text-slate-700 font-extrabold shadow-2xs';
        }

        chip.className = cls;
        chip.textContent = item.label;

        // 音符チップをクリックするとその音の運指へジャンプ
        chip.addEventListener('click', () => {
          if (item.type === 'note' && item.noteObj) {
            if (state.mode !== 'free') {
              stopAutoPlay();
              state.stepIndex = idx;
              renderScoreRibbon();
              updatePracticeBadge();
            }
            selectNoteById(item.noteObj.id, true);
          }
        });

        ribbon.appendChild(chip);
      });

      if (state.mode !== 'free') {
        const activeChip = ribbon.querySelector(`[data-step="${state.stepIndex}"]`);
        if (activeChip) {
          activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }

    function updatePracticeBadge() {
      const badge = document.getElementById('practiceStepBadge');
      const totalNotes = state.parsedNotes.filter(n => n.type === 'note').length;
      const doneNotes = state.parsedNotes.slice(0, state.stepIndex + 1).filter(n => n.type === 'note').length;
      badge.textContent = `${Math.min(doneNotes, totalNotes)} / ${totalNotes} 音目`;
    }

    function setPracticeMode(newMode) {
      stopAutoPlay();
      state.mode = newMode;
      state.stepIndex = 0;

      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.className = btn.dataset.mode === newMode
          ? 'mode-btn flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition bg-white text-sky-600 shadow-2xs'
          : 'mode-btn flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition';
      });

      const bar = document.getElementById('practiceControlBar');
      const stepGroup = document.getElementById('stepNavGroup');
      const autoGroup = document.getElementById('autoNavGroup');
      const hint = document.getElementById('modeHelperHint');

      if (newMode === 'free') {
        bar.classList.add('hidden');
        hint.textContent = '下の音階ボタンか穴をクリックして運指を確認できます';
      } else if (newMode === 'step') {
        bar.classList.remove('hidden');
        stepGroup.classList.remove('hidden');
        stepGroup.classList.add('flex');
        autoGroup.classList.add('hidden');
        autoGroup.classList.remove('flex');
        hint.textContent = 'Spaceキー / →キー /「次の音へ」で1音ずつ運指を確認できます';
        skipNonPlayableInStepMode(1);
        syncRecorderToCurrentStep(false);
      } else if (newMode === 'auto') {
        bar.classList.remove('hidden');
        stepGroup.classList.add('hidden');
        stepGroup.classList.remove('flex');
        autoGroup.classList.remove('hidden');
        autoGroup.classList.add('flex');
        hint.textContent = '速さを調整してリコーダーの運指ガイドを自動再生します';
        syncRecorderToCurrentStep(false);
      }

      renderScoreRibbon();
      updatePracticeBadge();
    }

    /**
     * 自動ガイド再生（4拍カウントイン・リピート対応）
     */
    function startAutoPlay() {
      if (state.isAutoPlaying || state.parsedNotes.length === 0) return;

      if (state.stepIndex >= state.parsedNotes.length) {
        state.stepIndex = 0;
      }

      state.isAutoPlaying = true;
      updateAutoPlayBtnUI();

      const beatMs = (60 / state.bpm) * 1000;

      if (state.countInEnabled && state.stepIndex === 0) {
        let count = 1;
        const countBadge = document.getElementById('countInDisplay');
        countBadge.classList.remove('hidden');
        countBadge.textContent = `カウント: ${count}`;
        audio.playClick(true);

        const runCountIn = () => {
          if (!state.isAutoPlaying) {
            countBadge.classList.add('hidden');
            return;
          }
          count++;
          if (count <= 4) {
            countBadge.textContent = `カウント: ${count}`;
            audio.playClick(false);
            state.autoTimer = setTimeout(runCountIn, beatMs);
          } else {
            countBadge.classList.add('hidden');
            runAutoStep();
          }
        };
        state.autoTimer = setTimeout(runCountIn, beatMs);
      } else {
        runAutoStep();
      }
    }

    function stopAutoPlay() {
      state.isAutoPlaying = false;
      if (state.autoTimer) {
        clearTimeout(state.autoTimer);
        state.autoTimer = null;
      }
      document.getElementById('countInDisplay').classList.add('hidden');
      updateAutoPlayBtnUI();
    }

    function updateAutoPlayBtnUI() {
      const btn = document.getElementById('autoPlayToggleBtn');
      if (state.isAutoPlaying) {
        btn.textContent = '⏸ ストップ';
        btn.className = 'px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-extrabold shadow-xs transition';
      } else {
        btn.textContent = '▶️ スタート';
        btn.className = 'px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-extrabold shadow-xs transition';
      }
    }

    function runAutoStep() {
      if (!state.isAutoPlaying) return;

      if (state.stepIndex >= state.parsedNotes.length) {
        if (state.repeatEnabled) {
          state.stepIndex = 0;
        } else {
          stopAutoPlay();
          state.stepIndex = 0;
          renderScoreRibbon();
          updatePracticeBadge();
          showToast('自動ガイド再生が終わりました 🎵', 'success');
          return;
        }
      }

      const item = state.parsedNotes[state.stepIndex];
      const beatMs = (60 / state.bpm) * 1000;

      // 連続する「ー」を結合して再生時間を算出
      let extendCount = 0;
      while (
        state.stepIndex + 1 + extendCount < state.parsedNotes.length &&
        state.parsedNotes[state.stepIndex + 1 + extendCount].type === 'extend'
      ) {
        extendCount++;
      }

      const totalSteps = 1 + extendCount;
      const durationSec = ((beatMs * totalSteps) / 1000) * 0.9;

      renderScoreRibbon();
      updatePracticeBadge();

      if (item.type === 'note' && item.noteObj) {
        state.customHoles = null;
        state.currentNoteId = item.noteObj.id;
        audio.playNote(item.noteObj.midi, durationSec);
        renderRecorderSVG();
        updateNoteDetailPanel();
        highlightActiveNoteButton(item.noteObj.id);
      }

      state.autoTimer = setTimeout(() => {
        state.stepIndex += totalSteps;
        runAutoStep();
      }, beatMs * totalSteps);
    }

    /**
     * ============================================================================
     * 9. 「＋ 楽譜を入れる」モーダル機能
     * ============================================================================
     */
    function renderModalNotePalette() {
      const palette = document.getElementById('modalNotePalette');
      palette.innerHTML = '';

      RECORDER_NOTES.filter(n => !n.isSharp).forEach(noteObj => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'py-1.5 px-1 rounded-lg bg-white hover:bg-sky-50 border border-slate-300 text-slate-800 text-xs font-extrabold shadow-2xs transition active:scale-95';
        btn.textContent = noteObj.shortName;
        btn.addEventListener('click', () => {
          appendScoreToken(noteObj.shortName);
          audio.playNote(noteObj.midi, 0.25);
        });
        palette.appendChild(btn);
      });
    }

    function appendScoreToken(token) {
      const ta = document.getElementById('customScoreTextarea');
      const cur = ta.value;
      const needsSpace = cur.length > 0 && !cur.endsWith(' ') && !cur.endsWith('\n');
      ta.value = cur + (needsSpace ? ' ' : '') + token;
      updateModalPreview();
    }

    function updateModalPreview() {
      const text = document.getElementById('customScoreTextarea').value;
      const parsed = parseDoremiScore(text);
      const chipsEl = document.getElementById('modalPreviewChips');
      const countLabel = document.getElementById('modalParseCountLabel');

      const noteCount = parsed.filter(n => n.type === 'note').length;
      countLabel.textContent = `解析プレビュー（合計 ${parsed.length} 拍 ／ ${noteCount} 音）`;

      chipsEl.innerHTML = '';
      if (parsed.length === 0) {
        chipsEl.innerHTML = '<span class="text-xs text-slate-400">ドレミを入力するとここに音符が表示されます</span>';
        return;
      }

      parsed.forEach(item => {
        const span = document.createElement('span');
        span.className = item.type === 'note'
          ? 'px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-900 text-xs font-extrabold'
          : 'px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-xs font-bold';
        span.textContent = item.label;
        chipsEl.appendChild(span);
      });
    }

    function openScoreModal(editSong = null) {
      stopAutoPlay();
      const modal = document.getElementById('scoreModal');
      const titleEl = document.getElementById('scoreModalTitle');
      const nameInput = document.getElementById('customSongTitleInput');
      const ta = document.getElementById('customScoreTextarea');

      if (editSong) {
        state.editingSongId = editSong.id;
        titleEl.textContent = '✏️ 楽譜を編集する';
        nameInput.value = editSong.title;
        ta.value = editSong.scoreText;
      } else {
        state.editingSongId = null;
        titleEl.textContent = '🎼 新しい楽譜を入れる';
        nameInput.value = '';
        ta.value = '';
      }

      renderModalNotePalette();
      updateModalPreview();
      modal.classList.remove('hidden');
    }

    function closeScoreModal() {
      document.getElementById('scoreModal').classList.add('hidden');
    }

    /**
     * ============================================================================
     * 10. イベントリスナー登録 ＆ 初期化
     * ============================================================================
     */
    function initRecorderApp() {
      loadSongsFromStorage();
      populateSongSelect();
      renderNoteButtons();
      selectSong('preset_twinkle');
      selectNoteById('C5', false);

      // ① 音声モード切替（音あり / 消音ガイドのみ）
      document.getElementById('soundToggleBtn').addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        audio.enabled = state.soundEnabled;

        const btn = document.getElementById('soundToggleBtn');
        const icon = document.getElementById('soundToggleIcon');
        const text = document.getElementById('soundToggleText');

        if (state.soundEnabled) {
          btn.className = 'px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-extrabold shadow-xs flex items-center gap-1.5 transition active:scale-95';
          icon.textContent = '🔊';
          text.textContent = '音あり';
          showToast('音声モード：音あり（リコーダー音）');
        } else {
          btn.className = 'px-3 py-1.5 rounded-xl bg-slate-600 hover:bg-slate-700 text-white text-xs sm:text-sm font-extrabold shadow-xs flex items-center gap-1.5 transition active:scale-95';
          icon.textContent = '🔇';
          text.textContent = '消音（ガイドのみ）';
          showToast('消音モード：音を出さずに運指ガイドのみ表示します');
        }
      });

      // ② 運指タイプ切替（ジャーマン式 / バロック式）
      document.querySelectorAll('.system-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.fingeringSystem = btn.dataset.system;
          state.customHoles = null;
          document.querySelectorAll('.system-btn').forEach(b => {
            b.className = b.dataset.system === state.fingeringSystem
              ? 'system-btn px-2.5 py-1 rounded-lg text-xs font-extrabold bg-white text-amber-700 shadow-2xs transition'
              : 'system-btn px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition';
          });
          renderRecorderSVG();
          updateNoteDetailPanel();
          showToast(`運指を「${state.fingeringSystem === 'german' ? 'ジャーマン式' : 'バロック式'}」に切り替えました`);
        });
      });

      // ③ 本体カラー選択
      document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.recColor = btn.dataset.color;
          document.body.setAttribute('data-rec-color', state.recColor);
          document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('ring-2'));
          btn.classList.add('ring-2');
          renderRecorderSVG();
        });
      });

      // ④ 見方（視点）の向き：正面 vs 自分目線（反転）
      document.querySelectorAll('.perspective-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.perspective = btn.dataset.perspective;
          document.querySelectorAll('.perspective-btn').forEach(b => {
            b.className = b.dataset.perspective === state.perspective
              ? 'perspective-btn px-2.5 py-1 rounded-lg text-xs font-extrabold bg-white text-sky-600 shadow-2xs transition'
              : 'perspective-btn px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition';
          });
          renderRecorderSVG();
        });
      });

      // ⑤ 配置の向き：たて向き vs よこ向き
      document.querySelectorAll('.layout-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.layout = btn.dataset.layout;
          document.querySelectorAll('.layout-btn').forEach(b => {
            b.className = b.dataset.layout === state.layout
              ? 'layout-btn px-2.5 py-1 rounded-lg text-xs font-extrabold bg-white text-amber-700 shadow-2xs transition'
              : 'layout-btn px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition';
          });
          renderRecorderSVG();
        });
      });

      // ⑥ 指ガイド表示ON/OFF
      document.getElementById('toggleFingerLabels').addEventListener('change', (e) => {
        state.showFingerLabels = e.target.checked;
        renderRecorderSVG();
      });

      // ⑦ 半音表示ON/OFF
      document.getElementById('toggleAccidentals').addEventListener('change', (e) => {
        state.showAccidentals = e.target.checked;
        renderNoteButtons();
      });

      // ⑧ 練習モード切替
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => setPracticeMode(btn.dataset.mode));
      });

      // ⑨ 曲選択
      document.getElementById('songSelect').addEventListener('change', (e) => {
        selectSong(e.target.value);
      });

      // ⑩ ステップ練習「もどる」「次へ」
      document.getElementById('stepPrevBtn').addEventListener('click', () => advanceStepPractice(-1));
      document.getElementById('stepNextBtn').addEventListener('click', () => advanceStepPractice(1));

      // ⑪ 自動ガイド再生コントロール
      document.getElementById('bpmSlider').addEventListener('input', (e) => {
        state.bpm = parseInt(e.target.value, 10);
        document.getElementById('bpmValue').textContent = `${state.bpm} BPM`;
      });
      document.getElementById('toggleCountIn').addEventListener('change', (e) => {
        state.countInEnabled = e.target.checked;
      });
      document.getElementById('toggleRepeat').addEventListener('change', (e) => {
        state.repeatEnabled = e.target.checked;
      });
      document.getElementById('autoPlayToggleBtn').addEventListener('click', () => {
        if (state.isAutoPlaying) stopAutoPlay();
        else startAutoPlay();
      });
      document.getElementById('autoResetBtn').addEventListener('click', () => {
        stopAutoPlay();
        state.stepIndex = 0;
        syncRecorderToCurrentStep(false);
        renderScoreRibbon();
        updatePracticeBadge();
      });

      // ⑫ 「＋ 楽譜を入れる」モーダル操作
      document.getElementById('openScoreModalBtn').addEventListener('click', () => openScoreModal(null));
      document.getElementById('closeScoreModalBtn').addEventListener('click', closeScoreModal);
      document.getElementById('cancelScoreModalBtn').addEventListener('click', closeScoreModal);

      document.getElementById('editSongBtn').addEventListener('click', () => {
        const song = state.songs.find(s => s.id === state.currentSongId);
        if (song && !song.isPreset) openScoreModal(song);
      });

      document.getElementById('deleteSongBtn').addEventListener('click', () => {
        const song = state.songs.find(s => s.id === state.currentSongId);
        if (!song || song.isPreset) return;
        state.pendingDeleteId = song.id;
        document.getElementById('deleteTargetName').textContent = `「${song.title}」を削除すると元に戻せません。`;
        document.getElementById('deleteConfirmModal').classList.remove('hidden');
      });

      document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        state.pendingDeleteId = null;
        document.getElementById('deleteConfirmModal').classList.add('hidden');
      });

      document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        if (state.pendingDeleteId) {
          state.songs = state.songs.filter(s => s.id !== state.pendingDeleteId);
          saveCustomSongsToStorage();
          populateSongSelect();
          selectSong('preset_twinkle');
          showToast('楽譜を削除しました');
        }
        state.pendingDeleteId = null;
        document.getElementById('deleteConfirmModal').classList.add('hidden');
      });

      document.querySelectorAll('.modal-insert-btn').forEach(btn => {
        btn.addEventListener('click', () => appendScoreToken(btn.dataset.insert));
      });

      document.getElementById('modalPadBackspace').addEventListener('click', () => {
        const ta = document.getElementById('customScoreTextarea');
        ta.value = ta.value.trimEnd().replace(/\S+$/, '').trimEnd();
        updateModalPreview();
      });

      document.getElementById('modalPadClear').addEventListener('click', () => {
        document.getElementById('customScoreTextarea').value = '';
        updateModalPreview();
      });

      document.getElementById('customScoreTextarea').addEventListener('input', updateModalPreview);

      document.getElementById('saveCustomScoreBtn').addEventListener('click', () => {
        const titleVal = document.getElementById('customSongTitleInput').value.trim();
        const scoreVal = document.getElementById('customScoreTextarea').value.trim();
        const parsed = parseDoremiScore(scoreVal);

        if (parsed.filter(n => n.type === 'note').length === 0) {
          showToast('ドレミを1音以上入力してください', 'error');
          return;
        }

        const finalTitle = titleVal || `マイ楽譜 ${state.songs.filter(s => !s.isPreset).length + 1}`;

        if (state.editingSongId) {
          const target = state.songs.find(s => s.id === state.editingSongId);
          if (target) {
            target.title = finalTitle;
            target.scoreText = scoreVal;
          }
        } else {
          const newSong = {
            id: `rec_custom_${Date.now()}`,
            title: finalTitle,
            isPreset: false,
            scoreText: scoreVal
          };
          state.songs.push(newSong);
          state.currentSongId = newSong.id;
        }

        saveCustomSongsToStorage();
        populateSongSelect();
        closeScoreModal();
        selectSong(state.currentSongId);
        if (state.mode === 'free') {
          setPracticeMode('step');
        }
        showToast(`「${finalTitle}」を保存しました！`, 'success');
      });

      // ⑬ PCキーボード操作（音階・Space/矢印キーでステップ進行）
      window.addEventListener('keydown', (e) => {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (!document.getElementById('scoreModal').classList.contains('hidden')) return;
        if (e.repeat) return;

        // ステップ練習時のSpace / 左右矢印キー操作
        if (state.mode === 'step') {
          if (e.code === 'Space' || e.code === 'ArrowRight') {
            e.preventDefault();
            advanceStepPractice(1);
            return;
          }
          if (e.code === 'ArrowLeft') {
            e.preventDefault();
            advanceStepPractice(-1);
            return;
          }
        }

        const noteId = pcCodeToNoteId.get(e.code);
        if (noteId) {
          e.preventDefault();
          const btn = document.querySelector(`.note-pad-btn[data-note-id="${noteId}"]`);
          if (btn) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 140);
          }
          handleNotePadTrigger(noteId);
        }
      });
    }

    window.addEventListener('DOMContentLoaded', initRecorderApp);