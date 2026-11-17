    /**
     * ============================================================================
     * 1. Web Audio API 鍵盤ハーモニカ（リード楽器）サウンドエンジン
     * ============================================================================
     */
    class PianicaAudioEngine {
      constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.compressor = null;
        this.activeVoices = new Map(); // midi -> voice object
        this.volume = 0.75;
        this.timbre = 'standard'; // 'standard' | 'soft' | 'accordion'
      }

      // ユーザー操作時にAudioContextを初期化・再開
      ensureContext() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          this.ctx = new AudioCtx();

          // 和音演奏時の音割れを防ぐコンプレッサー
          this.compressor = this.ctx.createDynamicsCompressor();
          this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
          this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
          this.compressor.ratio.setValueAtTime(4, this.ctx.currentTime);
          this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
          this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.volume * 0.45, this.ctx.currentTime);

          this.compressor.connect(this.masterGain);
          this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setTargetAtTime(this.volume * 0.45, this.ctx.currentTime, 0.02);
        }
      }

      setTimbre(timbre) {
        this.timbre = timbre;
      }

      midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
      }

      // 指定MIDIノートの音を鳴らし始める（押している間持続）
      noteOn(midi) {
        this.ensureContext();
        if (this.activeVoices.has(midi)) return;

        const now = this.ctx.currentTime;
        const freq = this.midiToFreq(midi);

        // ボイス全体のエンベロープ用Gain
        const voiceGain = this.ctx.createGain();
        voiceGain.gain.setValueAtTime(0.0001, now);

        // リード楽器らしい倍音整形フィルター（ローパス＋フォルマント感）
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';

        // リードの芯を補う穏やかな共鳴ピーク。音量を上げすぎず倍音の輪郭を整える。
        const reedBody = this.ctx.createBiquadFilter();
        reedBody.type = 'peaking';
        reedBody.frequency.setValueAtTime(Math.min(2600, Math.max(900, freq * 2.7)), now);
        reedBody.Q.setValueAtTime(0.85, now);
        reedBody.gain.setValueAtTime(this.timbre === 'soft' ? 1.4 : 2.4, now);

        // 音色プリセットごとのパラメータ設定
        let attackTime = 0.028;
        let sawLevel = 0.45;
        let triLevel = 0.45;
        let sqLevel = 0.18;
        let detuneCents = 4;
        let baseCutoff = freq * 4.2;
        let peakCutoff = freq * 7.5;
        let filterQ = 2.2;

        if (this.timbre === 'soft') {
          // やわらか（メロディオン風）
          attackTime = 0.04;
          sawLevel = 0.25;
          triLevel = 0.65;
          sqLevel = 0.08;
          detuneCents = 2;
          baseCutoff = freq * 2.8;
          peakCutoff = freq * 4.5;
          filterQ = 1.2;
        } else if (this.timbre === 'accordion') {
          // アコーディオン風（ミュゼットデチューン強め）
          attackTime = 0.032;
          sawLevel = 0.50;
          triLevel = 0.30;
          sqLevel = 0.25;
          detuneCents = 11;
          baseCutoff = freq * 4.8;
          peakCutoff = freq * 8.2;
          filterQ = 2.6;
        }

        // 高音域でフィルターが極端に高くなりすぎないよう制限
        baseCutoff = Math.min(baseCutoff, 5200);
        peakCutoff = Math.min(peakCutoff, 7500);

        filter.Q.setValueAtTime(filterQ, now);
        filter.frequency.setValueAtTime(baseCutoff * 0.7, now);
        // 息を吹き込んだ瞬間の明るい立ち上がり
        filter.frequency.exponentialRampToValueAtTime(peakCutoff, now + attackTime + 0.03);
        filter.frequency.exponentialRampToValueAtTime(baseCutoff, now + attackTime + 0.22);

        // オシレーター1: Sawtooth（金属リードの豊かな倍音）
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, now);
        const gain1 = this.ctx.createGain();
        gain1.gain.setValueAtTime(sawLevel, now);

        // オシレーター2: Triangle（基音の温かみと芯）
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq, now);
        const gain2 = this.ctx.createGain();
        gain2.gain.setValueAtTime(triLevel, now);

        // オシレーター3: Square/Detuned（わずかなリードの揺らぎ・厚み）
        const osc3 = this.ctx.createOscillator();
        osc3.type = this.timbre === 'accordion' ? 'sawtooth' : 'square';
        osc3.frequency.setValueAtTime(freq, now);
        osc3.detune.setValueAtTime(detuneCents, now);
        const gain3 = this.ctx.createGain();
        gain3.gain.setValueAtTime(sqLevel, now);

        // 息の自然なビブラート（LFO）
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4.8, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(0, now);
        // 0.25秒後からゆっくりビブラートがかかる
        lfoGain.gain.linearRampToValueAtTime(0, now + 0.25);
        lfoGain.gain.linearRampToValueAtTime(3.5, now + 0.7);

        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);

        // 接続
        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);

        gain1.connect(filter);
        gain2.connect(filter);
        gain3.connect(filter);

        filter.connect(reedBody);
        reedBody.connect(voiceGain);
        voiceGain.connect(this.compressor);

        // ADSR エンベロープ（アタック〜サステイン）
        voiceGain.gain.linearRampToValueAtTime(1.0, now + attackTime);
        voiceGain.gain.linearRampToValueAtTime(0.86, now + attackTime + 0.12);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        lfo.start(now);

        this.activeVoices.set(midi, {
          osc1, osc2, osc3, lfo, voiceGain, reedBody
        });
      }

      // 鍵盤を離したときに音を止める
      noteOff(midi) {
        const voice = this.activeVoices.get(midi);
        if (!voice || !this.ctx) return;

        const now = this.ctx.currentTime;
        const releaseTime = 0.075;

        voice.voiceGain.gain.cancelScheduledValues(now);
        voice.voiceGain.gain.setValueAtTime(Math.max(voice.voiceGain.gain.value, 0.001), now);
        voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);

        setTimeout(() => {
          try {
            voice.osc1.stop();
            voice.osc2.stop();
            voice.osc3.stop();
            voice.lfo.stop();
            voice.osc1.disconnect();
            voice.osc2.disconnect();
            voice.osc3.disconnect();
            voice.lfo.disconnect();
            voice.voiceGain.disconnect();
            voice.reedBody.disconnect();
          } catch (e) {
            // 既に停止済みの場合は無視
          }
        }, (releaseTime + 0.03) * 1000);

        this.activeVoices.delete(midi);
      }

      // すべての音を即座に停止
      stopAll() {
        for (const midi of Array.from(this.activeVoices.keys())) {
          this.noteOff(midi);
        }
      }
    }

    /**
     * ============================================================================
     * 2. 32鍵盤（F3〜C6）データ定義 ＆ ドレミ楽譜パーサー
     * ============================================================================
     */
    const NOTE_NAMES_JP = ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ'];

    // F3(53) 〜 C6(84) の32鍵盤マスターデータ生成
    const KEYS_DATA = [];
    let whiteKeyCounter = 0;
    for (let midi = 53; midi <= 84; midi++) {
      const pitchClass = midi % 12;
      const octave = Math.floor(midi / 12) - 1; // MIDI 60 = C4
      const isBlack = [1, 3, 6, 8, 10].includes(pitchClass);
      const baseName = NOTE_NAMES_JP[pitchClass];

      // オクターブ記号（C4〜B4を基準とし、低い音に↓、高い音に↑、C6に↑↑）
      let octSuffix = '';
      if (octave === 3) octSuffix = '↓';
      else if (octave === 5) octSuffix = '↑';
      else if (octave >= 6) octSuffix = '↑↑';

      const displayName = `${baseName}${octSuffix}`;

      KEYS_DATA.push({
        midi,
        pitchClass,
        octave,
        isBlack,
        baseName,
        octSuffix,
        displayName,
        whiteIndex: isBlack ? whiteKeyCounter - 1 : whiteKeyCounter
      });

      if (!isBlack) {
        whiteKeyCounter++;
      }
    }
    const TOTAL_WHITE_KEYS = whiteKeyCounter; // 19白鍵

    // 内蔵プリセット曲（6曲）
    const PRESET_SONGS = [
      {
        id: 'preset_twinkle',
        title: 'きらきら星',
        isPreset: true,
        scoreText: 'ド ド ソ ソ ラ ラ ソ ー ファ ファ ミ ミ レ レ ド ー ソ ソ ファ ファ ミ ミ レ ー ソ ソ ファ ファ ミ ミ レ ー ド ド ソ ソ ラ ラ ソ ー ファ ファ ミ ミ レ レ ド ー'
      },
      {
        id: 'preset_tulip',
        title: 'チューリップ',
        isPreset: true,
        scoreText: 'ド レ ミ ー ド レ ミ ー ソ ミ レ ド レ ミ レ ー ド レ ミ ー ド レ ミ ー ソ ミ レ ド レ ミ ド ー ソ ソ ミ ソ ラ ラ ソ ー ミ ミ レ レ ド ー'
      },
      {
        id: 'preset_frog',
        title: 'カエルの合唱',
        isPreset: true,
        scoreText: 'ド レ ミ ファ ミ レ ド ー ミ ファ ソ ラ ソ ファ ミ ー ド ー ド ー ド ー ド ー ド レ ミ ファ ミ レ ド ー'
      },
      {
        id: 'preset_saints',
        title: '聖者の行進',
        isPreset: true,
        scoreText: 'ド ミ ファ ソ ー ド ミ ファ ソ ー ド ミ ファ ソ ミ ド ミ レ ー ミ ミ レ ド ド ミ ソ ソ ファ ー ミ ファ ソ ミ ド レ ド ー'
      },
      {
        id: 'preset_ode_to_joy',
        title: '喜びの歌（交響曲第9番）',
        isPreset: true,
        scoreText: 'ミ ミ ファ ソ ソ ファ ミ レ ド ド レ ミ ミ ー レ レ ー ミ ミ ファ ソ ソ ファ ミ レ ド ド レ ミ レ ー ド ド ー'
      },
      {
        id: 'preset_mary',
        title: 'メリーさんの羊',
        isPreset: true,
        scoreText: 'ミ レ ド レ ミ ミ ミ ー レ レ レ ー ミ ソ ソ ー ミ レ ド レ ミ ミ ミ ミ レ レ ミ レ ド ー'
      }
    ];

    /**
     * 柔軟なドレミテキストパーサー
     * 「ド」「高いド」「低いソ」「ド↑」「ド↓」「ド↑↑」「ファ#」「シ♭」「ー」「休」などを解析
     */
    function parseDoremiText(rawText) {
      if (!rawText || !rawText.trim()) return [];

      // 全角英数字・記号の正規化
      let normalized = rawText
        .replace(/＃/g, '#')
        .replace(/♯/g, '#')
        .replace(/♭/g, 'b')
        .replace(/－|―|—|〜/g, 'ー')
        .replace(/[　、，,/|・\r\n]+/g, ' ');

      // トークン抽出用正規表現（スペースがなくても連続ドレミを切り出せる）
      const tokenRegex = /(一番高い|いちばんたかい|高い|たかい|低い|ひくい)?(ド|レ|ミ|ファ|ソ|ラ|シ)(#|b)?(↑↑|↑|↓)?|(ー)|(休)/g;

      const pitchMap = {
        'ド': 0,
        'レ': 2,
        'ミ': 4,
        'ファ': 5,
        'ソ': 7,
        'ラ': 9,
        'シ': 11
      };

      const notes = [];
      let match;

      while ((match = tokenRegex.exec(normalized)) !== null) {
        const [full, prefix, noteName, accidental, arrow, extendSymbol, restSymbol] = match;

        if (extendSymbol) {
          // 前の音を伸ばす「ー」
          notes.push({
            type: 'extend',
            label: 'ー',
            midi: null
          });
          continue;
        }

        if (restSymbol) {
          // 休符「休」
          notes.push({
            type: 'rest',
            label: '休',
            midi: null
          });
          continue;
        }

        if (noteName) {
          let semitone = pitchMap[noteName];
          if (accidental === '#') semitone += 1;
          if (accidental === 'b') semitone -= 1;

          // デフォルトオクターブは4（真ん中のド C4 = 60）
          let octave = 4;
          if (prefix === '低い' || prefix === 'ひくい' || arrow === '↓') {
            octave = 3;
          } else if (prefix === '一番高い' || prefix === 'いちばんたかい' || arrow === '↑↑') {
            octave = 6;
          } else if (prefix === '高い' || prefix === 'たかい' || arrow === '↑') {
            octave = 5;
          }

          let midi = (octave + 1) * 12 + semitone;

          // 32鍵盤の範囲（F3=53 〜 C6=84）に自動クランプして安全に鳴らす
          if (midi < 53) midi = 53;
          if (midi > 84) midi = 84;

          const keyInfo = KEYS_DATA.find(k => k.midi === midi);
          notes.push({
            type: 'note',
            midi,
            label: keyInfo ? keyInfo.displayName : noteName
          });
        }
      }

      return notes;
    }

    /**
     * ============================================================================
     * 3. アプリケーション状態管理 ＆ UIコントローラー
     * ============================================================================
     */
    const audio = new PianicaAudioEngine();

    const state = {
      mode: 'free', // 'free' | 'guide' | 'auto'
      songs: [],
      currentSongId: 'preset_twinkle',
      parsedNotes: [],
      stepIndex: 0, // 現在の楽譜インデックス
      isAutoPlaying: false,
      autoPlayTimer: null,
      bpm: 105,
      showDoremi: true,
      showKeyLabel: true,
      keyShiftWhiteIndex: 4, // デフォルトは4（C4＝真ん中のドから開始）
      zoomMode: 'fit', // 'fit' | 'large'
      pointerActiveMidis: new Map(), // pointerId -> MIDI（タッチ・マウス共通）
      keyboardActiveMidis: new Map(), // code -> midi
      accessibilityActiveMidi: null, // Tab移動した鍵盤でEnter / Spaceを押している音
      autoNoteOffTimer: null, // 自動演奏中の離鍵予約
      isStepRecording: false,
      editingSongId: null,
      padOctave: 'mid',
      pendingDeleteId: null
    };

    // PCキーボードのマッピング定義（下段＝白鍵、上段＝右上の黒鍵）
    const WHITE_KEY_CODES = [
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
      { code: 'Quote', label: "'" }
    ];

    const BLACK_KEY_CODES = [
      { code: 'KeyW', label: 'W' },
      { code: 'KeyE', label: 'E' },
      { code: 'KeyR', label: 'R' },
      { code: 'KeyT', label: 'T' },
      { code: 'KeyY', label: 'Y' },
      { code: 'KeyU', label: 'U' },
      { code: 'KeyI', label: 'I' },
      { code: 'KeyO', label: 'O' },
      { code: 'KeyP', label: 'P' },
      { code: 'BracketLeft', label: '[' }
    ];

    let codeToMidiMap = new Map();
    let midiToKeyLabelMap = new Map();

    // 現在のシフト位置に応じてPCキー割り当てを再計算
    function rebuildKeyboardMapping() {
      codeToMidiMap.clear();
      midiToKeyLabelMap.clear();

      const whiteKeys = KEYS_DATA.filter(k => !k.isBlack);
      const startWhiteIdx = state.keyShiftWhiteIndex;

      // 黒鍵はE-F / B-Cの間には存在しないため、見つかった黒鍵だけを順番に割り当てる。
      let blackIndex = 0;
      WHITE_KEY_CODES.forEach((wk, i) => {
        const targetWhite = whiteKeys[startWhiteIdx + i];
        if (!targetWhite) return;

        codeToMidiMap.set(wk.code, targetWhite.midi);
        midiToKeyLabelMap.set(targetWhite.midi, wk.label);

        const rightBlack = KEYS_DATA.find(k => k.midi === targetWhite.midi + 1 && k.isBlack);
        if (rightBlack && BLACK_KEY_CODES[blackIndex]) {
          const blackCode = BLACK_KEY_CODES[blackIndex++];
          codeToMidiMap.set(blackCode.code, rightBlack.midi);
          midiToKeyLabelMap.set(rightBlack.midi, blackCode.label);
        }
      });
    }

    // トースト通知表示
    function showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';
      toast.className = `${bgClass} text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-lg transition-all duration-300 transform translate-y-2 opacity-0`;
      toast.textContent = message;
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      });

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 2600);
    }

    /**
     * ============================================================================
     * 4. 32鍵盤UIの描画と視覚更新
     * ============================================================================
     */
    function makeKeyboardKeyAccessible(keyEl, keyObj) {
      keyEl.setAttribute('role', 'button');
      // Tabでは鍵盤群に1か所だけ入り、矢印キーで音ごとに移動する。
      keyEl.setAttribute('tabindex', keyObj.midi === 60 ? '0' : '-1');
      keyEl.setAttribute('aria-label', keyObj.displayName + 'の鍵盤');
      keyEl.setAttribute('aria-pressed', 'false');
      keyEl.addEventListener('keydown', (e) => {
        const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 12, ArrowDown: -12 };
        if (Object.prototype.hasOwnProperty.call(moves, e.code)) {
          e.preventDefault();
          e.stopPropagation();
          const targetMidi = keyObj.midi + moves[e.code];
          const nextKey = document.querySelector('#keyboardStage [data-midi="' + targetMidi + '"]');
          if (nextKey) {
            keyEl.tabIndex = -1;
            nextKey.tabIndex = 0;
            nextKey.focus({ preventScroll: true });
            nextKey.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
          return;
        }
        if (e.code !== 'Enter' && e.code !== 'Space') return;
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) {
          state.accessibilityActiveMidi = keyObj.midi;
          triggerNoteOn(keyObj.midi, 'user');
        }
      });
      keyEl.addEventListener('keyup', (e) => {
        if (e.code !== 'Enter' && e.code !== 'Space') return;
        e.preventDefault();
        e.stopPropagation();
        if (state.accessibilityActiveMidi === keyObj.midi) {
          state.accessibilityActiveMidi = null;
          triggerNoteOff(keyObj.midi);
        }
      });
      keyEl.addEventListener('blur', () => {
        if (state.accessibilityActiveMidi === keyObj.midi) {
          state.accessibilityActiveMidi = null;
          triggerNoteOff(keyObj.midi);
        }
      });
    }

    function renderKeyboard() {
      const stage = document.getElementById('keyboardStage');
      stage.innerHTML = '';
      rebuildKeyboardMapping();

      // ズームモードに応じたステージ幅設定
      if (state.zoomMode === 'large') {
        stage.style.width = '1120px';
      } else {
        stage.style.width = '100%';
        stage.style.minWidth = '640px';
      }

      const whiteWidthPercent = 100 / TOTAL_WHITE_KEYS;
      const blackWidthPercent = whiteWidthPercent * 0.62;

      // 1. 白鍵を描画
      KEYS_DATA.filter(k => !k.isBlack).forEach((keyObj, idx) => {
        const keyEl = document.createElement('div');
        keyEl.dataset.midi = keyObj.midi;
        keyEl.className = 'white-key absolute top-0 bottom-0 flex flex-col justify-end items-center pb-2 sm:pb-3 cursor-pointer z-10';
        keyEl.style.left = `${idx * whiteWidthPercent}%`;
        keyEl.style.width = `${whiteWidthPercent}%`;
        makeKeyboardKeyAccessible(keyEl, keyObj);

        // ガイド用「ここ！」マーカー
        const guideMarker = document.createElement('div');
        guideMarker.className = 'guide-badge hidden absolute top-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] sm:text-[10px] font-extrabold shadow animate-bounce pointer-events-none';
        guideMarker.textContent = 'ここ!';
        keyEl.appendChild(guideMarker);

        // PCキーラベル
        const pcLabel = midiToKeyLabelMap.get(keyObj.midi);
        const pcBadge = document.createElement('span');
        pcBadge.className = `pc-key-label text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.2 rounded bg-slate-200/85 text-slate-600 mb-1 pointer-events-none ${state.showKeyLabel && pcLabel ? '' : 'hidden'}`;
        pcBadge.textContent = pcLabel || '';
        keyEl.appendChild(pcBadge);

        // ドレミラベル
        const doremiSpan = document.createElement('span');
        const isMiddleC = keyObj.midi === 60;
        doremiSpan.className = `doremi-label text-xs sm:text-sm font-extrabold pointer-events-none leading-none ${isMiddleC ? 'text-sky-600 underline decoration-2' : 'text-slate-700'} ${state.showDoremi ? '' : 'hidden'}`;
        doremiSpan.textContent = keyObj.displayName;
        keyEl.appendChild(doremiSpan);

        stage.appendChild(keyEl);
      });

      // 2. 黒鍵を描画
      KEYS_DATA.filter(k => k.isBlack).forEach((keyObj) => {
        const keyEl = document.createElement('div');
        keyEl.dataset.midi = keyObj.midi;
        keyEl.className = 'black-key absolute top-0 h-[58%] flex flex-col justify-end items-center pb-2 cursor-pointer z-20';

        // 対応する左白鍵の右端にまたがるように配置
        const leftPos = (keyObj.whiteIndex + 1) * whiteWidthPercent - (blackWidthPercent / 2);
        keyEl.style.left = `${leftPos}%`;
        keyEl.style.width = `${blackWidthPercent}%`;
        makeKeyboardKeyAccessible(keyEl, keyObj);

        // ガイド用「ここ！」マーカー
        const guideMarker = document.createElement('div');
        guideMarker.className = 'guide-badge hidden absolute top-1.5 px-1 py-0.2 rounded-full bg-yellow-300 text-slate-900 text-[8px] font-extrabold shadow animate-bounce pointer-events-none';
        guideMarker.textContent = '▼';
        keyEl.appendChild(guideMarker);

        // PCキーラベル
        const pcLabel = midiToKeyLabelMap.get(keyObj.midi);
        const pcBadge = document.createElement('span');
        pcBadge.className = `pc-key-label text-[9px] sm:text-[10px] font-extrabold px-1 rounded bg-slate-700 text-slate-200 mb-1 pointer-events-none ${state.showKeyLabel && pcLabel ? '' : 'hidden'}`;
        pcBadge.textContent = pcLabel || '';
        keyEl.appendChild(pcBadge);

        // ドレミラベル（黒鍵は#表記をコンパクトに）
        const doremiSpan = document.createElement('span');
        doremiSpan.className = `doremi-label text-[9px] sm:text-[10px] font-bold text-slate-100 text-center leading-tight pointer-events-none ${state.showDoremi ? '' : 'hidden'}`;
        doremiSpan.textContent = keyObj.displayName;
        keyEl.appendChild(doremiSpan);

        stage.appendChild(keyEl);
      });

      updateGuideHighlights();
    }

    // 鍵盤の押下ビジュアル更新
    function setKeyVisualPressed(midi, isPressed) {
      const keyEl = document.querySelector(`[data-midi="${midi}"]`);
      if (!keyEl) return;
      if (isPressed) {
        keyEl.classList.add('active');
      } else {
        keyEl.classList.remove('active');
      }
      keyEl.setAttribute('aria-pressed', String(isPressed));

      // 発音中インジケーターと吹き口の反応
      const anyActive = audio.activeVoices.size > 0;
      const breathInd = document.getElementById('activeBreathIndicator');
      const mouthpiece = document.getElementById('mouthpieceVisual');
      if (anyActive) {
        breathInd.classList.remove('hidden');
        mouthpiece.classList.add('breathing');
      } else {
        breathInd.classList.add('hidden');
        mouthpiece.classList.remove('breathing');
      }
    }

    // 発音トリガー（共通処理：音出し＋UI更新＋練習判定＋ステップ録音）
    function triggerNoteOn(midi, source = 'user') {
      const keyInfo = KEYS_DATA.find(k => k.midi === midi);
      if (!keyInfo) return;

      audio.noteOn(midi);
      setKeyVisualPressed(midi, true);

      document.getElementById('lastPlayedNoteDisplay').textContent = `いま弾いた音: ${keyInfo.displayName}`;

      // ステップ録音モード中の場合、楽譜テキストに追記
      if (state.isStepRecording && source === 'user') {
        appendTokenToScoreEditor(keyInfo.displayName);
      }

      // 「光るガイド練習モード」の判定
      if (state.mode === 'guide' && source === 'user') {
        handleGuideModeInput(midi, keyInfo);
      }
    }

    function triggerNoteOff(midi) {
      audio.noteOff(midi);
      setKeyVisualPressed(midi, false);
    }

    /**
     * ============================================================================
     * 5. 楽譜データ管理・楽譜モニター・練習＆自動再生ロジック
     * ============================================================================
     */
    function loadSongsFromStorage() {
      let customSongs = [];
      try {
        const saved = localStorage.getItem('pianica_custom_songs_v1');
        if (saved) customSongs = JSON.parse(saved);
      } catch (e) {
        customSongs = [];
      }
      state.songs = [...PRESET_SONGS, ...customSongs];
    }

    function saveCustomSongsToStorage() {
      const customOnly = state.songs.filter(s => !s.isPreset);
      try {
        localStorage.setItem('pianica_custom_songs_v1', JSON.stringify(customOnly));
      } catch (e) {
        showToast('ブラウザの保存容量がいっぱいです', 'error');
      }
    }

    function populateSongSelect() {
      const select = document.getElementById('songSelect');
      select.innerHTML = '';

      const presetGroup = document.createElement('optgroup');
      presetGroup.label = '🎵 内蔵プリセット曲';
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
      updateCustomSongButtons();
    }

    function updateCustomSongButtons() {
      const song = state.songs.find(s => s.id === state.currentSongId);
      const actionsEl = document.getElementById('customSongActions');
      if (song && !song.isPreset) {
        actionsEl.classList.remove('hidden');
        actionsEl.classList.add('flex');
      } else {
        actionsEl.classList.add('hidden');
        actionsEl.classList.remove('flex');
      }
    }

    function selectSong(songId) {
      stopAutoPlay();
      state.currentSongId = songId;
      const song = state.songs.find(s => s.id === songId) || state.songs[0];
      state.currentSongId = song.id;
      state.parsedNotes = parseDoremiText(song.scoreText);
      state.stepIndex = 0;

      // ガイドモードで最初が「ー」や「休」の場合は最初の実音符まで進める
      if (state.mode === 'guide') {
        advanceToNextPlayableNote();
      }

      document.getElementById('currentSongTitleDisplay').textContent = song.title;
      document.getElementById('songSelect').value = song.id;
      updateCustomSongButtons();
      renderScoreRibbon();
      updatePracticeStatusUI();
      updateGuideHighlights();
    }

    // ガイド練習モード用：実際に鍵盤を押すべき次の音符（type === 'note'）までインデックスを進める
    function advanceToNextPlayableNote() {
      while (
        state.stepIndex < state.parsedNotes.length &&
        state.parsedNotes[state.stepIndex].type !== 'note'
      ) {
        state.stepIndex++;
      }
    }

    // 楽譜モニター（横スクロールリボン）描画
    function renderScoreRibbon() {
      const ribbon = document.getElementById('scoreRibbon');
      ribbon.innerHTML = '';

      if (state.parsedNotes.length === 0) {
        ribbon.innerHTML = '<span class="text-xs text-slate-400 px-2">楽譜データがありません</span>';
        return;
      }

      state.parsedNotes.forEach((item, idx) => {
        const chip = document.createElement('div');
        chip.dataset.step = idx;

        const isCurrent = (state.mode !== 'free') && idx === state.stepIndex;
        const isPast = (state.mode !== 'free') && idx < state.stepIndex;

        let baseStyle = 'shrink-0 px-2.5 py-1.5 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center min-w-[44px] ';
        if (isCurrent) {
          baseStyle += 'bg-amber-300 border-amber-500 text-slate-900 font-extrabold scale-110 shadow-md ring-2 ring-amber-400/50';
        } else if (isPast) {
          baseStyle += 'bg-slate-200/70 border-slate-200 text-slate-400 font-bold';
        } else if (item.type === 'extend') {
          baseStyle += 'bg-sky-50 border-sky-200 text-sky-600 font-bold';
        } else if (item.type === 'rest') {
          baseStyle += 'bg-slate-100 border-slate-200 text-slate-500 font-bold';
        } else {
          baseStyle += 'bg-white border-slate-200 text-slate-700 font-extrabold shadow-2xs';
        }

        chip.className = baseStyle;

        const noteText = document.createElement('span');
        noteText.className = 'text-xs sm:text-sm leading-tight';
        noteText.textContent = item.label;
        chip.appendChild(noteText);

        // PCキーヒントを小さく表示（音符のみ）
        if (item.type === 'note' && state.showKeyLabel) {
          const keyChar = midiToKeyLabelMap.get(item.midi);
          if (keyChar) {
            const keyHint = document.createElement('span');
            keyHint.className = `text-[9px] leading-none mt-0.5 ${isCurrent ? 'text-amber-900 font-extrabold' : 'text-slate-400'}`;
            keyHint.textContent = keyChar;
            chip.appendChild(keyHint);
          }
        }

        ribbon.appendChild(chip);
      });

      // 現在の音符カードを中央へスムーズスクロール
      if (state.mode !== 'free') {
        const activeChip = ribbon.querySelector(`[data-step="${state.stepIndex}"]`);
        if (activeChip) {
          activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }
    }

    // 鍵盤の光るガイドハイライト更新
    function updateGuideHighlights() {
      // 既存のハイライト解除
      document.querySelectorAll('.guide-target').forEach(el => el.classList.remove('guide-target'));
      document.querySelectorAll('.guide-badge').forEach(el => el.classList.add('hidden'));

      if (state.mode === 'free') return;

      const currentItem = state.parsedNotes[state.stepIndex];
      if (!currentItem || currentItem.type !== 'note') return;

      const targetKeyEl = document.querySelector(`[data-midi="${currentItem.midi}"]`);
      if (targetKeyEl) {
        targetKeyEl.classList.add('guide-target');
        const badge = targetKeyEl.querySelector('.guide-badge');
        if (badge) badge.classList.remove('hidden');

        // 鍵盤エリアが横スクロールしている場合、光る鍵盤が見える位置へ自動スクロール
        targetKeyEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // 練習進捗バッジ更新
    function updatePracticeStatusUI() {
      const badge = document.getElementById('practiceBadge');
      const progressText = document.getElementById('practiceProgressText');

      const totalNotes = state.parsedNotes.filter(n => n.type === 'note').length;
      const completedNotes = state.parsedNotes.slice(0, state.stepIndex).filter(n => n.type === 'note').length;
      progressText.textContent = `${completedNotes} / ${totalNotes} 音`;

      const currentItem = state.parsedNotes[state.stepIndex];
      if (!currentItem) {
        badge.textContent = '🎉 完走！';
        badge.className = 'px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold';
      } else {
        const keyHint = currentItem.midi ? midiToKeyLabelMap.get(currentItem.midi) : null;
        badge.textContent = `次の音: ${currentItem.label}${keyHint ? ` [${keyHint}]` : ''}`;
        badge.className = 'px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-extrabold';
      }
    }

    // 光るガイド練習モードの正誤判定
    function handleGuideModeInput(pressedMidi, keyInfo) {
      const targetItem = state.parsedNotes[state.stepIndex];
      if (!targetItem) return;

      const feedbackEl = document.getElementById('feedbackMessage');

      if (pressedMidi === targetItem.midi) {
        // 正解！
        feedbackEl.style.opacity = '0';
        state.stepIndex++;
        advanceToNextPlayableNote();

        renderScoreRibbon();
        updatePracticeStatusUI();
        updateGuideHighlights();

        // 最後まで弾ききったらクリア画面表示
        if (state.stepIndex >= state.parsedNotes.length) {
          const song = state.songs.find(s => s.id === state.currentSongId);
          document.getElementById('clearSongNameText').textContent = `「${song ? song.title : ''}」クリアおめでとう！`;
          document.getElementById('clearOverlay').classList.remove('hidden');
        }
      } else {
        // 違う鍵盤を押したとき
        const wrongKeyEl = document.querySelector(`[data-midi="${pressedMidi}"]`);
        if (wrongKeyEl) {
          wrongKeyEl.classList.add('key-wrong');
          setTimeout(() => wrongKeyEl.classList.remove('key-wrong'), 280);
        }
        feedbackEl.textContent = `おしい！いま「${keyInfo.displayName}」を押したよ（次は「${targetItem.label}」）`;
        feedbackEl.style.opacity = '1';
      }
    }

    /**
     * お手本自動再生エンジン
     */
    function startAutoPlay() {
      if (state.isAutoPlaying) return;
      if (state.parsedNotes.length === 0) return;

      if (state.stepIndex >= state.parsedNotes.length) {
        state.stepIndex = 0;
      }

      state.isAutoPlaying = true;
      updateAutoPlayButtonUI();
      playAutoStep();
    }

    function stopAutoPlay() {
      state.isAutoPlaying = false;
      if (state.autoPlayTimer) {
        clearTimeout(state.autoPlayTimer);
        state.autoPlayTimer = null;
      }
      if (state.autoNoteOffTimer !== null) {
        clearTimeout(state.autoNoteOffTimer);
        state.autoNoteOffTimer = null;
      }
      audio.stopAll();
      document.querySelectorAll('.white-key.active, .black-key.active').forEach(el => {
        el.classList.remove('active');
        el.setAttribute('aria-pressed', 'false');
      });
      updateAutoPlayButtonUI();
    }

    function updateAutoPlayButtonUI() {
      const btn = document.getElementById('autoPlayToggleBtn');
      if (state.isAutoPlaying) {
        btn.textContent = '⏸ 一時停止';
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-sm transition';
      } else {
        btn.textContent = '▶️ 再生スタート';
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-sm transition';
      }
    }

    function playAutoStep() {
      if (!state.isAutoPlaying) return;

      if (state.stepIndex >= state.parsedNotes.length) {
        stopAutoPlay();
        state.stepIndex = 0;
        renderScoreRibbon();
        updatePracticeStatusUI();
        updateGuideHighlights();
        showToast('お手本演奏が終わりました 🎵', 'success');
        return;
      }

      const currentItem = state.parsedNotes[state.stepIndex];
      const beatMs = (60 / state.bpm) * 1000;

      // 連続する「ー」の数を数えて音の持続時間を計算
      let extendCount = 0;
      while (
        state.stepIndex + 1 + extendCount < state.parsedNotes.length &&
        state.parsedNotes[state.stepIndex + 1 + extendCount].type === 'extend'
      ) {
        extendCount++;
      }

      const totalSteps = 1 + extendCount;
      const totalDurationMs = beatMs * totalSteps;

      renderScoreRibbon();
      updatePracticeStatusUI();
      updateGuideHighlights();

      if (currentItem.type === 'note') {
        const midi = currentItem.midi;
        triggerNoteOn(midi, 'auto');

        // 次の音と綺麗に区切るため、総再生時間の88%で離鍵
        const holdMs = totalDurationMs * 0.88;
        if (state.autoNoteOffTimer !== null) {
          clearTimeout(state.autoNoteOffTimer);
        }
        state.autoNoteOffTimer = setTimeout(() => {
          triggerNoteOff(midi);
          state.autoNoteOffTimer = null;
        }, holdMs);
      }

      state.autoPlayTimer = setTimeout(() => {
        state.stepIndex += totalSteps;
        playAutoStep();
      }, totalDurationMs);
    }

    // 演奏モード切替
    function setPlayMode(newMode) {
      stopAutoPlay();
      state.mode = newMode;
      state.stepIndex = 0;
      document.getElementById('feedbackMessage').style.opacity = '0';

      // タブUI更新
      document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.dataset.mode === newMode) {
          btn.className = 'mode-btn flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition bg-white text-sky-600 shadow-sm';
        } else {
          btn.className = 'mode-btn flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition';
        }
      });

      const controlBar = document.getElementById('practiceControlBar');
      const tempoGroup = document.getElementById('tempoControlGroup');
      const autoBtn = document.getElementById('autoPlayToggleBtn');

      if (newMode === 'free') {
        controlBar.classList.add('hidden');
      } else {
        controlBar.classList.remove('hidden');
        if (newMode === 'guide') {
          tempoGroup.classList.add('hidden');
          tempoGroup.classList.remove('flex');
          autoBtn.classList.add('hidden');
          advanceToNextPlayableNote();
        } else if (newMode === 'auto') {
          tempoGroup.classList.remove('hidden');
          tempoGroup.classList.add('flex');
          autoBtn.classList.remove('hidden');
        }
      }

      renderScoreRibbon();
      updatePracticeStatusUI();
      updateGuideHighlights();
    }

    /**
     * ============================================================================
     * 6. マウス・マルチタッチ・PCキーボード入力ハンドリング
     * ============================================================================
     */
    function getMidiFromPoint(clientX, clientY) {
      const el = document.elementFromPoint(clientX, clientY);
      if (!el) return null;
      const keyEl = el.closest('[data-midi]');
      return keyEl ? parseInt(keyEl.dataset.midi, 10) : null;
    }

    function setupPointerAndTouchEvents() {
      const stage = document.getElementById('keyboardStage');
      const activePointers = state.pointerActiveMidis;

      function getMidiAtPoint(clientX, clientY) {
        const el = document.elementFromPoint(clientX, clientY);
        if (!el) return null;
        const keyEl = el.closest('[data-midi]');
        return keyEl ? Number(keyEl.dataset.midi) : null;
      }

      function isMidiHeld(midi) {
        return Array.from(activePointers.values()).some(value => value === midi);
      }

      function updatePointer(e) {
        const nextMidi = getMidiAtPoint(e.clientX, e.clientY);
        const previousMidi = activePointers.get(e.pointerId);
        if (previousMidi === nextMidi) return;

        if (previousMidi !== undefined) {
          activePointers.delete(e.pointerId);
          if (!isMidiHeld(previousMidi)) triggerNoteOff(previousMidi);
        }

        if (nextMidi !== null) {
          const alreadyHeld = isMidiHeld(nextMidi);
          activePointers.set(e.pointerId, nextMidi);
          if (!alreadyHeld) triggerNoteOn(nextMidi, 'user');
        }
      }

      function releasePointer(e) {
        const midi = activePointers.get(e.pointerId);
        if (midi !== undefined) {
          activePointers.delete(e.pointerId);
          if (!isMidiHeld(midi)) triggerNoteOff(midi);
        }
      }

      // Pointer Eventsに統一。タップ・複数指の和音に対応しつつ、
      // 横スワイプはブラウザ標準の鍵盤スクロールに任せる。
      stage.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (getMidiAtPoint(e.clientX, e.clientY) === null) return;
        updatePointer(e);
        try {
          stage.setPointerCapture(e.pointerId);
        } catch (_) {
          // Pointer Captureに対応しないブラウザでは通常のイベント伝播を利用する。
        }
      });

      stage.addEventListener('pointermove', (e) => {
        if (activePointers.has(e.pointerId)) updatePointer(e);
      });
      stage.addEventListener('pointerup', releasePointer);
      stage.addEventListener('pointercancel', releasePointer);
      stage.addEventListener('lostpointercapture', releasePointer);
    }

    // PCキーボード演奏イベント
    function setupKeyboardEvents() {
      window.addEventListener('keydown', (e) => {
        // テキスト入力中は演奏キーを無効化
        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
          return;
        }
        // モーダルが開いていてステップ録音中でなければ無効化
        const modalOpen = !document.getElementById('scoreModal').classList.contains('hidden');
        if (modalOpen && !state.isStepRecording) return;

        if (e.repeat) return;

        const midi = codeToMidiMap.get(e.code);
        if (midi !== undefined) {
          e.preventDefault();
          state.keyboardActiveMidis.set(e.code, midi);
          triggerNoteOn(midi, 'user');
        }
      });

      window.addEventListener('keyup', (e) => {
        const midi = state.keyboardActiveMidis.get(e.code);
        if (midi !== undefined) {
          state.keyboardActiveMidis.delete(e.code);
          triggerNoteOff(midi);
        }
      });

      // ウィンドウからフォーカスが外れたら全音停止
      window.addEventListener('blur', () => {
        state.keyboardActiveMidis.clear();
        state.pointerActiveMidis.clear();
        audio.stopAll();
        document.querySelectorAll('.white-key.active, .black-key.active').forEach(el => el.classList.remove('active'));
      });
    }

    /**
     * ============================================================================
     * 7. 楽譜追加・編集・ステップ録音モーダル機能
     * ============================================================================
     */
    function renderNotePalette() {
      const container = document.getElementById('notePaletteButtons');
      container.innerHTML = '';

      const notes = ['ド', 'ド#', 'レ', 'レ#', 'ミ', 'ファ', 'ファ#', 'ソ', 'ソ#', 'ラ', 'ラ#', 'シ'];

      notes.forEach(n => {
        // F3〜C6の範囲外（低いド〜低いミ）はスキップ
        if (state.padOctave === 'low' && ['ド', 'ド#', 'レ', 'レ#', 'ミ'].includes(n)) {
          return;
        }

        let token = n;
        if (state.padOctave === 'low') token = `${n}↓`;
        if (state.padOctave === 'high') token = `${n}↑`;

        const isSharp = n.includes('#');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = isSharp
          ? 'py-1.5 px-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-2xs transition active:scale-95'
          : 'py-1.5 px-1 rounded-lg bg-white hover:bg-sky-50 border border-slate-300 text-slate-800 text-xs font-extrabold shadow-2xs transition active:scale-95';
        btn.textContent = token;

        btn.addEventListener('click', () => {
          appendTokenToScoreEditor(token);
          // タップ時に該当の音を軽くプレビュー発音
          const parsed = parseDoremiText(token);
          if (parsed[0] && parsed[0].midi) {
            audio.noteOn(parsed[0].midi);
            setTimeout(() => audio.noteOff(parsed[0].midi), 220);
          }
        });

        container.appendChild(btn);
      });
    }

    function appendTokenToScoreEditor(token) {
      const textarea = document.getElementById('customScoreTextarea');
      const current = textarea.value;
      if (token === '\n') {
        textarea.value = current + '\n';
      } else {
        const needsSpace = current.length > 0 && !current.endsWith(' ') && !current.endsWith('\n');
        textarea.value = current + (needsSpace ? ' ' : '') + token;
      }
      updateModalScorePreview();
    }

    function updateModalScorePreview() {
      const text = document.getElementById('customScoreTextarea').value;
      const parsed = parseDoremiText(text);
      const previewEl = document.getElementById('modalPreviewRibbon');
      const statusLabel = document.getElementById('parseStatusLabel');

      const noteCount = parsed.filter(n => n.type === 'note').length;
      statusLabel.textContent = `プレビュー（合計 ${parsed.length} 拍 ／ ${noteCount} 音）`;

      previewEl.innerHTML = '';
      if (parsed.length === 0) {
        previewEl.innerHTML = '<span class="text-xs text-slate-400">ドレミを入力するとここに音符が表示されます</span>';
        return;
      }

      parsed.forEach(item => {
        const span = document.createElement('span');
        span.className = item.type === 'note'
          ? 'px-2 py-0.5 rounded-md bg-white border border-sky-200 text-sky-900 text-xs font-extrabold'
          : 'px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-xs font-bold';
        span.textContent = item.label;
        previewEl.appendChild(span);
      });
    }

    function openScoreModal(editSong = null) {
      stopAutoPlay();
      const modal = document.getElementById('scoreModal');
      const titleEl = document.getElementById('scoreModalTitle');
      const nameInput = document.getElementById('customSongTitleInput');
      const scoreTextarea = document.getElementById('customScoreTextarea');

      if (editSong) {
        state.editingSongId = editSong.id;
        titleEl.textContent = '✏️ 楽譜を編集する';
        nameInput.value = editSong.title;
        scoreTextarea.value = editSong.scoreText;
      } else {
        state.editingSongId = null;
        titleEl.textContent = '🎼 新しい楽譜を入れる';
        nameInput.value = '';
        scoreTextarea.value = '';
      }

      renderNotePalette();
      updateModalScorePreview();
      modal.classList.remove('hidden');
    }

    function closeScoreModal() {
      document.getElementById('scoreModal').classList.add('hidden');
      stopStepRecording(false);
    }

    // 鍵盤ステップ録音モード開始・終了
    function startStepRecording() {
      state.isStepRecording = true;
      document.getElementById('scoreModal').classList.add('hidden');
      document.getElementById('stepRecordBanner').classList.remove('hidden');
      showToast('鍵盤を弾いてドレミを入力してください！', 'info');
    }

    function stopStepRecording(reopenModal = true) {
      state.isStepRecording = false;
      document.getElementById('stepRecordBanner').classList.add('hidden');
      if (reopenModal) {
        document.getElementById('scoreModal').classList.remove('hidden');
        updateModalScorePreview();
      }
    }

    /**
     * ============================================================================
     * 8. イベントバインディング ＆ 初期化
     * ============================================================================
     */
    function initApp() {
      loadSongsFromStorage();
      populateSongSelect();
      renderKeyboard();
      selectSong('preset_twinkle');
      setupPointerAndTouchEvents();
      setupKeyboardEvents();

      // バックグラウンドやページ離脱時に音と自動演奏を確実に停止する。
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          stopAutoPlay();
          state.pointerActiveMidis.clear();
          audio.stopAll();
        }
      });
      window.addEventListener('pagehide', () => {
        stopAutoPlay();
        state.pointerActiveMidis.clear();
        audio.stopAll();
      });

      // 音色変更
      document.getElementById('timbreSelect').addEventListener('change', (e) => {
        audio.setTimbre(e.target.value);
        showToast(`音色を「${e.target.options[e.target.selectedIndex].text}」に変更しました`);
      });

      // 音量変更
      document.getElementById('volumeSlider').addEventListener('input', (e) => {
        audio.setVolume(parseInt(e.target.value, 10) / 100);
      });

      // カラーテーマ切替
      document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const theme = btn.dataset.setTheme;
          document.body.setAttribute('data-theme', theme);
          document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('ring-2'));
          btn.classList.add('ring-2');
        });
      });

      // 演奏モード切替
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          setPlayMode(btn.dataset.mode);
        });
      });

      // 曲選択
      document.getElementById('songSelect').addEventListener('change', (e) => {
        selectSong(e.target.value);
      });

      // BPMテンポ変更
      document.getElementById('bpmSlider').addEventListener('input', (e) => {
        state.bpm = parseInt(e.target.value, 10);
        document.getElementById('bpmValue').textContent = `${state.bpm} BPM`;
      });

      // お手本自動再生トグル
      document.getElementById('autoPlayToggleBtn').addEventListener('click', () => {
        if (state.isAutoPlaying) {
          stopAutoPlay();
        } else {
          startAutoPlay();
        }
      });

      // 最初からリセット
      document.getElementById('resetSongBtn').addEventListener('click', () => {
        stopAutoPlay();
        state.stepIndex = 0;
        if (state.mode === 'guide') advanceToNextPlayableNote();
        document.getElementById('feedbackMessage').style.opacity = '0';
        renderScoreRibbon();
        updatePracticeStatusUI();
        updateGuideHighlights();
      });

      // ドレミ表示トグル
      document.getElementById('toggleDoremi').addEventListener('change', (e) => {
        state.showDoremi = e.target.checked;
        document.querySelectorAll('.doremi-label').forEach(el => {
          el.classList.toggle('hidden', !state.showDoremi);
        });
      });

      // PCキー表示トグル
      document.getElementById('toggleKeyLabel').addEventListener('change', (e) => {
        state.showKeyLabel = e.target.checked;
        renderKeyboard();
        renderScoreRibbon();
      });

      // 鍵盤ズーム切替
      document.querySelectorAll('.zoom-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.zoomMode = btn.dataset.zoom;
          document.querySelectorAll('.zoom-btn').forEach(b => {
            b.className = b.dataset.zoom === state.zoomMode
              ? 'zoom-btn px-2 py-0.5 rounded-md text-[11px] font-bold bg-white text-slate-800 shadow-xs'
              : 'zoom-btn px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-600';
          });
          renderKeyboard();
        });
      });

      // PCキーボード位置シフト
      document.querySelectorAll('.shift-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.keyShiftWhiteIndex = parseInt(btn.dataset.shift, 10);
          document.querySelectorAll('.shift-btn').forEach(b => {
            b.className = parseInt(b.dataset.shift, 10) === state.keyShiftWhiteIndex
              ? 'shift-btn px-2 py-1 rounded-lg text-[11px] font-extrabold bg-white text-sky-600 shadow-xs transition'
              : 'shift-btn px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 hover:text-slate-900 transition';
          });
          renderKeyboard();
          renderScoreRibbon();
          updatePracticeStatusUI();
        });
      });

      // クリアオーバーレイ操作
      document.getElementById('replayAfterClearBtn').addEventListener('click', () => {
        document.getElementById('clearOverlay').classList.add('hidden');
        state.stepIndex = 0;
        advanceToNextPlayableNote();
        renderScoreRibbon();
        updatePracticeStatusUI();
        updateGuideHighlights();
      });

      document.getElementById('closeClearOverlayBtn').addEventListener('click', () => {
        document.getElementById('clearOverlay').classList.add('hidden');
      });

      // 楽譜モーダル開閉
      document.getElementById('openScoreModalBtn').addEventListener('click', () => openScoreModal(null));
      document.getElementById('closeScoreModalBtn').addEventListener('click', closeScoreModal);
      document.getElementById('cancelScoreModalBtn').addEventListener('click', closeScoreModal);

      // カスタム曲編集
      document.getElementById('editSongBtn').addEventListener('click', () => {
        const song = state.songs.find(s => s.id === state.currentSongId);
        if (song && !song.isPreset) openScoreModal(song);
      });

      // カスタム曲削除確認モーダル
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
          showToast('楽譜を削除しました', 'info');
        }
        state.pendingDeleteId = null;
        document.getElementById('deleteConfirmModal').classList.add('hidden');
      });

      // モーダル内オクターブ切替
      document.querySelectorAll('.pad-oct-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          state.padOctave = btn.dataset.padOct;
          document.querySelectorAll('.pad-oct-btn').forEach(b => {
            b.className = b.dataset.padOct === state.padOctave
              ? 'pad-oct-btn px-2 py-0.5 rounded-md font-extrabold bg-sky-500 text-white'
              : 'pad-oct-btn px-2 py-0.5 rounded-md font-bold text-slate-600';
          });
          renderNotePalette();
        });
      });

      // パレット記号ボタン
      document.querySelectorAll('.pad-symbol-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          appendTokenToScoreEditor(btn.dataset.insertToken);
        });
      });

      document.getElementById('padBackspaceBtn').addEventListener('click', () => {
        const ta = document.getElementById('customScoreTextarea');
        ta.value = ta.value.trimEnd().replace(/\S+$/, '').trimEnd();
        updateModalScorePreview();
      });

      document.getElementById('padClearBtn').addEventListener('click', () => {
        document.getElementById('customScoreTextarea').value = '';
        updateModalScorePreview();
      });

      document.getElementById('customScoreTextarea').addEventListener('input', updateModalScorePreview);

      // ステップ録音コントロール
      document.getElementById('startStepRecordBtn').addEventListener('click', startStepRecording);
      document.getElementById('recInsertRestBtn').addEventListener('click', () => {
        appendTokenToScoreEditor('休');
        showToast('休符を追加しました');
      });
      document.getElementById('recInsertExtendBtn').addEventListener('click', () => {
        appendTokenToScoreEditor('ー');
        showToast('のばし（ー）を追加しました');
      });
      document.getElementById('recBackspaceBtn').addEventListener('click', () => {
        const ta = document.getElementById('customScoreTextarea');
        ta.value = ta.value.trimEnd().replace(/\S+$/, '').trimEnd();
        showToast('1つ戻しました');
      });
      document.getElementById('recFinishBtn').addEventListener('click', () => stopStepRecording(true));

      // モーダル内試聴ボタン
      let previewTimer = null;
      document.getElementById('previewPlayBtn').addEventListener('click', () => {
        if (previewTimer) {
          clearTimeout(previewTimer);
          previewTimer = null;
          audio.stopAll();
        }
        const parsed = parseDoremiText(document.getElementById('customScoreTextarea').value);
        if (parsed.length === 0) {
          showToast('試聴するドレミを入力してください', 'error');
          return;
        }
        let idx = 0;
        const playNext = () => {
          if (idx >= parsed.length) return;
          const item = parsed[idx];
          let ext = 0;
          while (idx + 1 + ext < parsed.length && parsed[idx + 1 + ext].type === 'extend') {
            ext++;
          }
          const dur = 380 * (1 + ext);
          if (item.type === 'note') {
            audio.noteOn(item.midi);
            setTimeout(() => audio.noteOff(item.midi), dur * 0.85);
          }
          idx += (1 + ext);
          previewTimer = setTimeout(playNext, dur);
        };
        playNext();
      });

      // カスタム楽譜の保存
      document.getElementById('saveCustomScoreBtn').addEventListener('click', () => {
        const titleInput = document.getElementById('customSongTitleInput').value.trim();
        const scoreText = document.getElementById('customScoreTextarea').value.trim();
        const parsed = parseDoremiText(scoreText);

        if (parsed.filter(n => n.type === 'note').length === 0) {
          showToast('ドレミを1音以上入力してください', 'error');
          return;
        }

        const songTitle = titleInput || `マイ楽譜 ${state.songs.filter(s => !s.isPreset).length + 1}`;

        if (state.editingSongId) {
          const target = state.songs.find(s => s.id === state.editingSongId);
          if (target) {
            target.title = songTitle;
            target.scoreText = scoreText;
          }
        } else {
          const newSong = {
            id: `custom_${Date.now()}`,
            title: songTitle,
            isPreset: false,
            scoreText
          };
          state.songs.push(newSong);
          state.currentSongId = newSong.id;
        }

        saveCustomSongsToStorage();
        populateSongSelect();
        closeScoreModal();
        selectSong(state.currentSongId);

        // 保存後はすぐに練習できるよう光るガイド練習モードへ切替
        if (state.mode === 'free') {
          setPlayMode('guide');
        }
        showToast(`「${songTitle}」を保存しました！`, 'success');
      });
    }

    window.addEventListener('DOMContentLoaded', initApp);