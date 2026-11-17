/**
 * WINTER ARC TRACKER - CORE LOGIC & ENGINE
 * Author: JARVIS for Omar
 * Pure Vanilla JavaScript - 100% Offline Capable
 */

(function () {
  'use strict';

  // Storage Key
  const STORAGE_KEY = 'WINTER_ARC_TRACKER_DATA_V1';
  const TOTAL_DAYS = 180;

  // Sound Engine (Web Audio API)
  class SoundEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    }

    playTick() {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    }

    playChime() {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = this.ctx.currentTime + index * 0.08;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.45);
        });
      } catch (e) {}
    }

    playAlarm() {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.setValueAtTime(330, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      } catch (e) {}
    }

    playVictory() {
      if (!this.enabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4, E4, G4, C5, E5, G5
        notes.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = this.ctx.currentTime + index * 0.09;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.18, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.6);
        });
      } catch (e) {}
    }
  }

  // Confetti Particle Engine
  class ConfettiEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst() {
      if (!this.canvas) return;
      this.resize();
      const count = 90;
      const colors = ['#38bdf8', '#0284c7', '#2dd4bf', '#fbbf24', '#ffffff', '#818cf8'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
          y: this.canvas.height / 3 + (Math.random() - 0.5) * 100,
          w: Math.random() * 8 + 4,
          h: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 14,
          vy: Math.random() * -12 - 4,
          gravity: 0.35,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10,
          opacity: 1
        });
      }
      if (!this.animId) {
        this.loop();
      }
    }

    loop() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.opacity -= 0.012;

        if (p.opacity <= 0 || p.y > this.canvas.height) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.loop());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // Snowfall Engine (Winter Arc Ambient)
  class SnowEngine {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.flakes = [];
      this.enabled = true;
      this.resize();
      this.initFlakes();
      window.addEventListener('resize', () => this.resize());
      this.loop();
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    initFlakes() {
      const count = 45;
      this.flakes = [];
      for (let i = 0; i < count; i++) {
        this.flakes.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 2 + 0.8,
          density: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (!this.enabled) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      return this.enabled;
    }

    loop() {
      if (this.enabled) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ffffff';

        for (let i = 0; i < this.flakes.length; i++) {
          const f = this.flakes[i];
          this.ctx.beginPath();
          this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, false);
          this.ctx.fillStyle = `rgba(224, 242, 254, ${f.opacity})`;
          this.ctx.fill();

          f.y += Math.cos(f.density) + 0.7 + f.radius / 2;
          f.x += Math.sin(f.density) * 0.4;

          if (f.y > this.canvas.height) {
            f.y = -5;
            f.x = Math.random() * this.canvas.width;
          }
          if (f.x > this.canvas.width) {
            f.x = 0;
          } else if (f.x < 0) {
            f.x = this.canvas.width;
          }
        }
      }
      requestAnimationFrame(() => this.loop());
    }
  }

  // App Controller
  class WinterArcApp {
    constructor() {
      this.sound = new SoundEngine();
      this.confetti = new ConfettiEngine('confetti-canvas');
      this.snow = new SnowEngine('snow-canvas');

      this.activeTab = 'daily';
      this.activeMonthFilter = 'all';
      this.saveDebounceTimer = null;

      // Default Template Schema
      this.data = this.loadData();
      
      // Auto-Day Progression: calculate today's active day based on start date
      this.realWorldDay = this.calculateRealWorldDay();
      this.currentDay = this.realWorldDay;

      this.initDOMElements();
      this.bindEvents();
      this.render();
    }

    // Calculate Real-World Active Day from Start Date
    calculateRealWorldDay() {
      try {
        const start = new Date(this.data.startDate || '2026-11-15');
        const now = new Date();
        const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffMs = nowMidnight - startMidnight;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        return Math.min(Math.max(diffDays, 1), TOTAL_DAYS);
      } catch (e) {
        return 1;
      }
    }

    // Default State Factory (The 12 Iron Pillars of Winter Arc)
    getDefaultData() {
      return {
        startDate: '2026-11-15',
        customHabits: [
          { id: 'workout', label: 'تمرين رياضي / جيم (Workout)', category: 'الجسد', icon: '🏋️‍♂️' },
          { id: 'deepwork', label: 'العمل المركز على هدفي (Deep Work)', category: 'المستقبل', icon: '🎯' },
          { id: 'reading', label: 'قراءة وتغذية العقل (30 دقيقة)', category: 'العقل', icon: '📚' },
          { id: 'water_diet', label: 'شرب 3.5 لتر مياه + دايت نظيف', category: 'الصحة', icon: '💧' },
          { id: 'sleep_early', label: 'نوم 8 ساعات مبكر واستيقاظ منضبط', category: 'الانضباط', icon: '⏰' },
          { id: 'ghad_basar', label: 'غض البصر والصفر المطلق في الإباحية', category: 'الانضباط', icon: '⚡' },
          { id: 'cold_shower', label: 'الاستحمام بماء بارد (انضباط ودوبامين)', category: 'الجسد', icon: '❄️' },
          { id: 'silence', label: 'الصمت والسكوت (حفظ الطاقة واللسان)', category: 'العقل', icon: '🤫' },
          { id: 'calories_3500', label: 'احتياجي من السعرات 3500 سعرة', category: 'الجسد', icon: '🥩' },
          { id: 'protein_target', label: 'احتياج البروتين لبناء العضلات (150g+)', category: 'الجسد', icon: '🍗' },
          { id: 'no_phone_work', label: 'ممسكش التليفون وأقعد أقلب وأنا بشتغل', category: 'الانضباط', icon: '📵' },
          { id: 'authentic_self', label: 'أتصرف بطبيعتي بثقة وبدون تصنع', category: 'الهوية', icon: '🐺' }
        ],
        days: {}
      };
    }

    // Load Data from LocalStorage with Zero Data Loss Guarantee
    loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!parsed.days) parsed.days = {};
          if (!parsed.startDate) parsed.startDate = '2026-11-15';
          
          const defaultHabits = this.getDefaultData().customHabits;
          if (!parsed.customHabits || !Array.isArray(parsed.customHabits) || parsed.customHabits.length === 0) {
            parsed.customHabits = defaultHabits;
          } else {
            // Merge missing core pillars while preserving ALL user existing habits
            const existingLabels = parsed.customHabits.map(h => (h.label || '').toLowerCase());
            defaultHabits.forEach(defH => {
              const coreKeyword = defH.id;
              const alreadyHas = parsed.customHabits.some(h => h.id === coreKeyword || (h.label && h.label.includes(defH.label.split(' ')[0])));
              if (!alreadyHas) {
                parsed.customHabits.push(defH);
              }
            });
          }
          return parsed;
        }
      } catch (e) {
        console.error('Error loading stored Winter Arc data:', e);
      }
      return this.getDefaultData();
    }

    // Save Data to LocalStorage
    saveData(showPill = true) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        if (showPill) this.triggerAutoSavePill();
      } catch (e) {
        console.error('Error saving Winter Arc data:', e);
      }
    }

    triggerAutoSavePill() {
      const pill = document.getElementById('autosave-pill');
      if (!pill) return;
      pill.classList.add('show');
      clearTimeout(this.savePillTimeout);
      this.savePillTimeout = setTimeout(() => {
        pill.classList.remove('show');
      }, 1600);
    }

    // Get Day Object (or initialize empty default)
    getDay(dayNum) {
      if (!this.data.days[dayNum]) {
        this.data.days[dayNum] = {
          prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
          quran: { read: false, pages: '', note: '' },
          discipline: null, // 'adhered' | 'fallen'
          habits: {},
          rating: null, // 1 to 10
          satisfaction: null, // 'yes' | 'somewhat' | 'no'
          weather: null, // 'sunny' | 'clear' | 'cloudy' | 'rainy' | 'storm'
          journal_today: '',
          journal_goal: '',
          journal_feelings: '',
          journal_honest: '',
          azkar: { morning: false, evening: false },
          weight_kg: '',
          calories_target: false,
          water_liters: 0,
          cold_shower: false,
          deepwork_hours: 0,
          deepwork_task: '',
          percent: 0,
          updatedAt: Date.now()
        };
      }
      const day = this.data.days[dayNum];
      if (!day.azkar) day.azkar = { morning: false, evening: false };
      return day;
    }

    // Calculate Completion Percentage for a day
    calculatePercentage(dayNum) {
      const day = this.getDay(dayNum);
      let totalItems = 0;
      let completedItems = 0;

      // 1. Prayers (5 items)
      const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
      prayers.forEach(p => {
        totalItems++;
        if (day.prayers && day.prayers[p]) completedItems++;
      });

      // 2. Quran (1 item)
      totalItems++;
      if (day.quran && day.quran.read) completedItems++;

      // 3. Discipline / الابتعاد عن الذنوب (1 item)
      totalItems++;
      if (day.discipline === 'adhered') completedItems++;

      // 4. Custom Habits (each habit is 1 item)
      this.data.customHabits.forEach(h => {
        totalItems++;
        if (day.habits && day.habits[h.id]) completedItems++;
      });

      const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      const prevPercent = day.percent || 0;
      day.percent = percent;
      day.updatedAt = Date.now();

      // Check for celebration (hitting 100%)
      if (percent === 100 && prevPercent < 100) {
        this.sound.playChime();
        this.confetti.burst();
      }

      return percent;
    }

    // Calculate Global Statistics
    getGlobalStats() {
      let daysWithActivity = 0;
      let completedDays = 0; // days >= 70%
      let totalPercentSum = 0;
      let maxStreak = 0;
      let tempStreak = 0;

      for (let i = 1; i <= TOTAL_DAYS; i++) {
        const day = this.data.days[i];
        const pct = day ? day.percent || 0 : 0;

        if (pct > 0) {
          daysWithActivity++;
          totalPercentSum += pct;
        }

        if (pct >= 70) {
          completedDays++;
          tempStreak++;
          if (tempStreak > maxStreak) maxStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }

      // Calculate current active streak ending at current active day
      let activeStreak = 0;
      for (let i = this.currentDay; i >= 1; i--) {
        const pct = this.data.days[i] ? this.data.days[i].percent || 0 : 0;
        if (pct >= 70) {
          activeStreak++;
        } else {
          break;
        }
      }

      const avgPercent = daysWithActivity > 0 ? Math.round(totalPercentSum / daysWithActivity) : 0;
      const overallArcProgress = Math.round((totalPercentSum / (TOTAL_DAYS * 100)) * 100);

      return {
        completedDays,
        daysWithActivity,
        avgPercent,
        overallArcProgress,
        currentStreak: activeStreak,
        bestStreak: maxStreak
      };
    }

    // DOM Bindings
    initDOMElements() {
      this.viewDaily = document.getElementById('view-daily');
      this.viewMatrix = document.getElementById('view-matrix');
      this.viewSettings = document.getElementById('view-settings');
      this.viewCodex = document.getElementById('view-codex');

      this.currentDayBadge = document.querySelector('.current-day-badge');
      this.currentDayBadgeTitle = document.getElementById('current-day-badge-title');
      this.currentDayDate = document.getElementById('current-day-date');
      this.topProgressBar = document.getElementById('top-progress-bar');
      this.topProgressText = document.getElementById('top-progress-text');
      this.streakCountDisplay = document.getElementById('streak-count-display');

      this.tooltip = document.getElementById('grid-tooltip');

      this.modalOverlay = document.getElementById('modal-overlay');
      this.modalTitle = document.getElementById('modal-title');
      this.modalBody = document.getElementById('modal-body');
      this.modalConfirmBtn = document.getElementById('modal-confirm-btn');
      this.modalCancelBtn = document.getElementById('modal-cancel-btn');
    }

    // Event Listeners
    bindEvents() {
      // Tab Switching
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tab;
          this.switchTab(tab);
        });
      });

      // Quick Jump Modal when clicking current day badge
      if (this.currentDayBadge) {
        this.currentDayBadge.style.cursor = 'pointer';
        this.currentDayBadge.title = 'اضغط للانتقال السريع لأي يوم';
        this.currentDayBadge.addEventListener('click', () => {
          this.openJumpDayModal();
        });
      }

      // Day Navigation buttons
      document.getElementById('btn-prev-day').addEventListener('click', () => {
        if (this.currentDay > 1) {
          this.setDay(this.currentDay - 1);
          this.sound.playTick();
        }
      });

      document.getElementById('btn-next-day').addEventListener('click', () => {
        if (this.currentDay < TOTAL_DAYS) {
          this.setDay(this.currentDay + 1);
          this.sound.playTick();
        }
      });

      document.getElementById('btn-jump-today').addEventListener('click', () => {
        this.realWorldDay = this.calculateRealWorldDay();
        this.setDay(this.realWorldDay);
        this.sound.playTick();
      });

      // Sound Toggle
      const soundBtn = document.getElementById('btn-toggle-sound');
      soundBtn.addEventListener('click', () => {
        this.sound.enabled = !this.sound.enabled;
        soundBtn.classList.toggle('active', this.sound.enabled);
        soundBtn.title = this.sound.enabled ? 'الصوت مفعّل' : 'الصوت معطّل';
        if (this.sound.enabled) this.sound.playTick();
      });

      // Snow Toggle
      const snowBtn = document.getElementById('btn-toggle-snow');
      snowBtn.addEventListener('click', () => {
        const isSnow = this.snow.toggle();
        snowBtn.classList.toggle('active', isSnow);
      });

      // Daily Log: Prayers
      document.querySelectorAll('.prayer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const prayer = btn.dataset.prayer;
          const day = this.getDay(this.currentDay);
          day.prayers[prayer] = !day.prayers[prayer];
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      // Daily Log: Quran Checkbox
      const quranCheck = document.getElementById('quran-checkbox-container');
      quranCheck.addEventListener('click', () => {
        const day = this.getDay(this.currentDay);
        day.quran.read = !day.quran.read;
        this.sound.playTick();
        this.onDayDataChanged();
      });

      const quranPages = document.getElementById('quran-pages-input');
      quranPages.addEventListener('input', (e) => {
        const day = this.getDay(this.currentDay);
        day.quran.pages = e.target.value;
        this.debounceSave();
      });

      // Daily Log: Self-Discipline (الابتعاد عن الذنوب)
      document.querySelectorAll('.discipline-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const status = opt.dataset.status;
          const day = this.getDay(this.currentDay);
          day.discipline = day.discipline === status ? null : status;
          if (day.discipline === 'adhered') {
            day.habits['ghad_basar'] = true;
          }
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      // Daily Log: Azkar (الصباح والمساء)
      const azkarMorn = document.getElementById('azkar-morning-btn');
      if (azkarMorn) {
        azkarMorn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          day.azkar.morning = !day.azkar.morning;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      }
      const azkarEve = document.getElementById('azkar-evening-btn');
      if (azkarEve) {
        azkarEve.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          day.azkar.evening = !day.azkar.evening;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      }

      // Daily Log: Body & Fuel (الوزن، 3500 سعرة، المياه، الدش البارد)
      const calTargetBtn = document.getElementById('btn-calories-target');
      if (calTargetBtn) {
        calTargetBtn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          day.calories_target = !day.calories_target;
          day.habits['calories_3500'] = day.calories_target;
          day.habits['protein_target'] = day.calories_target;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      }

      const weightInput = document.getElementById('input-weight-kg');
      if (weightInput) {
        weightInput.addEventListener('input', (e) => {
          const day = this.getDay(this.currentDay);
          day.weight_kg = e.target.value;
          this.debounceSave();
        });
      }

      document.querySelectorAll('.water-cup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const liters = parseFloat(btn.dataset.liters);
          const day = this.getDay(this.currentDay);
          day.water_liters = day.water_liters === liters ? 0 : liters;
          day.habits['water_diet'] = day.water_liters >= 3;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      const coldShowerBtn = document.getElementById('btn-cold-shower');
      if (coldShowerBtn) {
        coldShowerBtn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          day.cold_shower = !day.cold_shower;
          day.habits['cold_shower'] = day.cold_shower;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      }

      // Daily Log: Deep Work (ساعات العمل العميق)
      document.querySelectorAll('.dw-hour-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const hours = parseInt(btn.dataset.hours, 10);
          const day = this.getDay(this.currentDay);
          day.deepwork_hours = day.deepwork_hours === hours ? 0 : hours;
          day.habits['deepwork'] = day.deepwork_hours >= 2;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      const dwTaskInput = document.getElementById('input-deepwork-task');
      if (dwTaskInput) {
        dwTaskInput.addEventListener('input', (e) => {
          const day = this.getDay(this.currentDay);
          day.deepwork_task = e.target.value;
          this.debounceSave();
        });
      }

      // Daily Log: Rating 1 to 10
      document.querySelectorAll('.rating-circle').forEach(circle => {
        circle.addEventListener('click', () => {
          const rate = parseInt(circle.dataset.rate, 10);
          const day = this.getDay(this.currentDay);
          day.rating = day.rating === rate ? null : rate;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      // Daily Log: Satisfaction
      document.querySelectorAll('.satisfaction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.value;
          const day = this.getDay(this.currentDay);
          day.satisfaction = day.satisfaction === val ? null : val;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      // Daily Log: Weather
      document.querySelectorAll('.weather-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const w = pill.dataset.weather;
          const day = this.getDay(this.currentDay);
          day.weather = day.weather === w ? null : w;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      // Daily Log: Journal textareas with auto-resize
      const textareas = ['journal_today', 'journal_goal', 'journal_feelings', 'journal_honest'];
      textareas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', (e) => {
            const day = this.getDay(this.currentDay);
            day[id] = e.target.value;
            this.autoResizeTextarea(el);
            this.debounceSave();
          });
        }
      });

      // Add Habit Button
      document.getElementById('btn-add-custom-habit').addEventListener('click', () => {
        this.openAddHabitModal();
      });

      // Matrix Month Filter Chips
      document.querySelectorAll('.month-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          document.querySelectorAll('.month-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          this.activeMonthFilter = chip.dataset.month;
          this.renderMatrixGrid();
        });
      });

      // Settings: Export Data
      document.getElementById('btn-export-json').addEventListener('click', () => {
        this.exportDataJSON();
      });

      // Settings: Import Data
      const importInput = document.getElementById('input-import-json');
      document.getElementById('btn-import-trigger').addEventListener('click', () => {
        importInput.click();
      });
      importInput.addEventListener('change', (e) => {
        this.importDataJSON(e.target.files[0]);
      });

      // Settings: Start Date picker
      const startDateInput = document.getElementById('settings-start-date');
      startDateInput.value = this.data.startDate || new Date().toISOString().split('T')[0];
      startDateInput.addEventListener('change', (e) => {
        this.data.startDate = e.target.value;
        this.saveData();
        this.render();
      });

      // Settings: Reset All Data
      document.getElementById('btn-reset-all').addEventListener('click', () => {
        this.openConfirmModal(
          'تصفير وحذف جميع البيانات',
          'هل أنت متأكد تماماً من رغبتك في تصفير كل بيانات الـ Winter Arc لجميع الأيام؟ لا يمكن التراجع عن هذه الخطوة إلا إذا كنت قد حمّلت نسخة احتياطية.',
          () => {
            this.data = this.getDefaultData();
            this.saveData();
            this.setDay(1);
            this.render();
          }
        );
      });

      // Settings: Demo Data Generator
      const demoBtn = document.getElementById('btn-load-demo-data');
      if (demoBtn) {
        demoBtn.addEventListener('click', () => {
          this.openConfirmModal(
            'تحميل بيانات تجريبية للمعاينة',
            'سيتم ملء أول 30 يوماً بنسب وإنجازات متنوعة (مثلاً 70%، 85%، 100%، 40%) لترى كيف تبدو الخريطة والمربعات السائلة. يمكنك التصفير في أي وقت.',
            () => {
              this.loadDemoData();
            }
          );
        });
      }

      // Settings: Print Day
      document.getElementById('btn-print-day').addEventListener('click', () => {
        window.print();
      });

      // Modal Close
      this.modalCancelBtn.addEventListener('click', () => {
        this.closeModal();
      });
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.closeModal();
      });

      // Emergency SOS Urge Protocol Init
      this.initEmergencySystem();
    }

    autoResizeTextarea(el) {
      el.style.height = 'auto';
      el.style.height = Math.max(95, el.scrollHeight) + 'px';
    }

    // Debounced Auto-save
    debounceSave() {
      clearTimeout(this.saveDebounceTimer);
      this.saveDebounceTimer = setTimeout(() => {
        this.saveData(true);
      }, 350);
    }

    // Called when any task or habit changes
    onDayDataChanged() {
      this.calculatePercentage(this.currentDay);
      this.saveData(true);
      this.renderDailyView();
      this.renderTopStats();
    }

    // Tab Switcher
    switchTab(tab) {
      this.activeTab = tab;
      document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
      });

      if (this.viewDaily) this.viewDaily.classList.toggle('active', tab === 'daily');
      if (this.viewMatrix) this.viewMatrix.classList.toggle('active', tab === 'matrix');
      if (this.viewSettings) this.viewSettings.classList.toggle('active', tab === 'settings');
      if (this.viewCodex) this.viewCodex.classList.toggle('active', tab === 'codex');

      if (tab === 'matrix') {
        this.renderMatrixView();
      } else if (tab === 'daily') {
        this.renderDailyView();
      } else if (tab === 'codex') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // Set Active Day
    setDay(dayNum) {
      this.currentDay = Math.min(Math.max(dayNum, 1), TOTAL_DAYS);
      this.renderTopStats();
      this.renderDailyView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Main Render Routine
    render() {
      this.renderTopStats();
      this.renderDailyView();
      if (this.activeTab === 'matrix') {
        this.renderMatrixView();
      }
    }

    // Render Top Banner & Stats
    renderTopStats() {
      const percent = this.calculatePercentage(this.currentDay);
      const stats = this.getGlobalStats();

      // Badge
      this.currentDayBadgeTitle.textContent = `اليوم (${this.currentDay})`;

      // Auto-Day Indicator Badge
      const autoIndicator = document.getElementById('auto-day-indicator');
      if (autoIndicator) {
        if (this.currentDay === this.realWorldDay) {
          autoIndicator.textContent = '● اليوم الفعلي (تلقائي)';
          autoIndicator.style.background = 'rgba(16, 185, 129, 0.16)';
          autoIndicator.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          autoIndicator.style.color = '#34d399';
        } else {
          autoIndicator.textContent = `أرشيف سابق (يوم ${this.currentDay})`;
          autoIndicator.style.background = 'rgba(245, 158, 11, 0.16)';
          autoIndicator.style.borderColor = 'rgba(245, 158, 11, 0.4)';
          autoIndicator.style.color = '#fbbf24';
        }
      }

      // Date calculation
      const startDate = new Date(this.data.startDate || '2026-11-15');
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + (this.currentDay - 1));
      
      const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      this.currentDayDate.textContent = targetDate.toLocaleDateString('ar-EG', dateOptions);

      // Top Progress Bar
      this.topProgressBar.style.width = `${percent}%`;
      this.topProgressText.textContent = `${percent}%`;

      // Streak
      this.streakCountDisplay.textContent = `${stats.currentStreak} أيام`;
    }

    // Calculate Consecutive Purity / Semen Retention Streak
    calculatePurityStreak() {
      let streak = 0;
      const todayNum = this.realWorldDay || 1;
      for (let i = todayNum; i >= 1; i--) {
        const d = this.data.days[i];
        if (d && d.discipline === 'adhered') {
          streak++;
        } else if (i === todayNum && (!d || !d.discipline)) {
          // If current day hasn't been logged yet, keep checking past streak
          continue;
        } else {
          break;
        }
      }
      return streak;
    }

    // Render Ghost Mode Phase Roadmap and Purity Badge
    renderGhostModeAndPurity() {
      // 1. Purity streak badge
      const purityBadge = document.getElementById('purity-streak-badge');
      if (purityBadge) {
        const purityStreak = this.calculatePurityStreak();
        purityBadge.textContent = `🛡️ ${purityStreak} أيام نقاء متواصلة`;
      }

      // 2. Ghost Mode Phase Roadmap - Evaluates actively viewed day
      const currentDay = this.currentDay;
      let phaseTitle = '';
      let phaseMotto = '';
      let phasePct = 0;

      if (currentDay <= 30) {
        phaseTitle = `المرحلة 1: كسر الإدمان، الصدمة، وتنظيف الدوبامين (الأيام 1 - 30)`;
        phaseMotto = `"الـ 6 شهور دول هتختفي فيهم عن الأنظار تماماً.. اللي هيشوفك بعدها مش هيعرفك."`;
        phasePct = Math.round((currentDay / 30) * 100);
      } else if (currentDay <= 90) {
        const dayInPhase = currentDay - 30;
        phaseTitle = `المرحلة 2: الصهر، بناء العضلات، والعمل المركز العميق (الأيام 31 - 90)`;
        phaseMotto = `"العضلات بتكبر، الدوبامين بيتعافى، والمستقبل المالي والبرمجي بيتبني في صمت تام."`;
        phasePct = Math.round((dayInPhase / 60) * 100);
      } else if (currentDay <= 150) {
        const dayInPhase = currentDay - 90;
        phaseTitle = `المرحلة 3: التصلب الحديدي، الانضباط الآلي، وثبات الهوية (الأيام 91 - 150)`;
        phaseMotto = `"الصعوبة اختفت.. الانضباط أصبح تنفسك الطبيعي. لا تراجع، لا استسلام، ولا انتكاس."`;
        phasePct = Math.round((dayInPhase / 60) * 100);
      } else {
        const dayInPhase = currentDay - 150;
        phaseTitle = `المرحلة 4: قمة التحول، السيادة، والاستعداد للظهور (الأيام 151 - 180)`;
        phaseMotto = `"نهاية الـ 180 يوم.. ولادة رجل جديد تماماً بجسد صلب، عقل حاد، وروح نقية تقود مستقبله."`;
        phasePct = Math.round((dayInPhase / 30) * 100);
      }

      const titleEl = document.getElementById('ghost-phase-title');
      const mottoEl = document.getElementById('ghost-phase-motto');
      const pctEl = document.getElementById('ghost-phase-pct');
      const barEl = document.getElementById('ghost-phase-bar');
      const statusPill = document.getElementById('ghost-phase-day-status');

      if (titleEl) titleEl.textContent = phaseTitle;
      if (mottoEl) mottoEl.textContent = phaseMotto;
      if (pctEl) pctEl.textContent = `${phasePct}%`;
      if (barEl) barEl.style.width = `${Math.min(100, Math.max(5, phasePct))}%`;

      if (statusPill) {
        statusPill.className = 'phase-day-status';
        if (this.currentDay === this.realWorldDay) {
          statusPill.classList.add('status-today');
          statusPill.textContent = '📍 اليوم الفعلي لك الآن';
        } else if (this.currentDay < this.realWorldDay) {
          statusPill.classList.add('status-past');
          statusPill.textContent = `⏪ مراجعة يوم سابق (يوم ${this.currentDay})`;
        } else {
          statusPill.classList.add('status-future');
          statusPill.textContent = `⏩ نظرة استباقية (يوم ${this.currentDay})`;
        }
      }
    }

    // Render View 1: Daily Journal
    renderDailyView() {
      const day = this.getDay(this.currentDay);

      // 0. Daily Tactical Directive Banner
      const directiveDayNum = document.getElementById('directive-day-num');
      const directiveText = document.getElementById('daily-directive-text');
      if (directiveDayNum) directiveDayNum.textContent = `اليوم ${this.currentDay}`;
      if (directiveText) directiveText.textContent = this.getDailyDirective(this.currentDay);

      // 1. Prayers
      document.querySelectorAll('.prayer-btn').forEach(btn => {
        const prayer = btn.dataset.prayer;
        const isChecked = day.prayers && day.prayers[prayer];
        btn.classList.toggle('checked', !!isChecked);
        const statusBox = btn.querySelector('.check-status');
        if (statusBox) statusBox.textContent = isChecked ? '✓' : '';
      });

      // 2. Quran & Azkar
      const quranBox = document.getElementById('quran-custom-checkbox');
      if (quranBox) {
        quranBox.classList.toggle('checked', !!(day.quran && day.quran.read));
        quranBox.textContent = (day.quran && day.quran.read) ? '✓' : '';
      }
      const quranPages = document.getElementById('quran-pages-input');
      if (quranPages) {
        quranPages.value = (day.quran && day.quran.pages) ? day.quran.pages : '';
      }
      const azkarMorn = document.getElementById('azkar-morning-btn');
      if (azkarMorn) {
        azkarMorn.classList.toggle('active', !!(day.azkar && day.azkar.morning));
      }
      const azkarEve = document.getElementById('azkar-evening-btn');
      if (azkarEve) {
        azkarEve.classList.toggle('active', !!(day.azkar && day.azkar.evening));
      }

      // 3. Discipline
      document.querySelectorAll('.discipline-option').forEach(opt => {
        const status = opt.dataset.status;
        opt.classList.remove('selected-positive', 'selected-negative');
        if (day.discipline === status) {
          if (status === 'adhered') opt.classList.add('selected-positive');
          if (status === 'fallen') opt.classList.add('selected-negative');
        }
      });

      // 4. Body & Fuel (الوزن، 3500 سعرة، المياه، الدش البارد)
      const calBtn = document.getElementById('btn-calories-target');
      if (calBtn) {
        const isCalDone = !!(day.calories_target || (day.habits && day.habits['calories_3500']));
        calBtn.classList.toggle('active', isCalDone);
      }
      const weightEl = document.getElementById('input-weight-kg');
      if (weightEl) {
        weightEl.value = day.weight_kg || '';
      }
      document.querySelectorAll('.water-cup-btn').forEach(btn => {
        const liters = parseFloat(btn.dataset.liters);
        btn.classList.toggle('active', (day.water_liters || 0) >= liters);
      });
      const coldBtn = document.getElementById('btn-cold-shower');
      if (coldBtn) {
        const isColdDone = !!(day.cold_shower || (day.habits && day.habits['cold_shower']));
        coldBtn.classList.toggle('active', isColdDone);
      }

      // 5. Deep Work Hours & Task
      document.querySelectorAll('.dw-hour-btn').forEach(btn => {
        const h = parseInt(btn.dataset.hours, 10);
        btn.classList.toggle('active', (day.deepwork_hours || 0) >= h);
      });
      const dwDisplay = document.getElementById('deepwork-display-val');
      if (dwDisplay) {
        dwDisplay.textContent = `${day.deepwork_hours || 0} ساعات`;
      }
      const dwTaskEl = document.getElementById('input-deepwork-task');
      if (dwTaskEl) {
        dwTaskEl.value = day.deepwork_task || '';
      }

      // 6. Custom Habits List
      this.renderHabitsList(day);

      // 7. Rating from 1 to 10
      document.querySelectorAll('.rating-circle').forEach(circle => {
        const rate = parseInt(circle.dataset.rate, 10);
        circle.classList.toggle('active', day.rating === rate);
      });

      // 8. Satisfaction
      document.querySelectorAll('.satisfaction-btn').forEach(btn => {
        btn.classList.toggle('active', day.satisfaction === btn.dataset.value);
      });

      // 9. Weather
      document.querySelectorAll('.weather-pill').forEach(pill => {
        pill.classList.toggle('active', day.weather === pill.dataset.weather);
      });

      // 10. Textareas
      const textareas = ['journal_today', 'journal_goal', 'journal_feelings', 'journal_honest'];
      textareas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.value = day[id] || '';
          this.autoResizeTextarea(el);
        }
      });

      // 11. Render Ghost Mode Roadmap & Purity Streak
      this.renderGhostModeAndPurity();
    }

    // Render Habits List dynamically
    renderHabitsList(day) {
      const container = document.getElementById('habits-container');
      if (!container) return;
      container.innerHTML = '';

      this.data.customHabits.forEach(habit => {
        const isDone = !!(day.habits && day.habits[habit.id]);
        const card = document.createElement('div');
        card.className = `habit-card ${isDone ? 'completed' : ''}`;
        card.innerHTML = `
          <div class="habit-info">
            <span class="habit-icon">${habit.icon || '⚡'}</span>
            <div>
              <div class="habit-name">${habit.label}</div>
              <div class="habit-category">${habit.category || 'Winter Arc'}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="custom-checkbox ${isDone ? 'checked' : ''}">${isDone ? '✓' : ''}</div>
            <button class="btn-delete-habit" title="حذف العادة" style="background:none; border:none; color: var(--text-muted); cursor:pointer; font-size: 0.9rem; padding: 0.2rem;">✕</button>
          </div>
        `;

        // Checkbox click
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-delete-habit')) return;
          if (!day.habits) day.habits = {};
          day.habits[habit.id] = !day.habits[habit.id];
          this.sound.playTick();
          this.onDayDataChanged();
        });

        // Delete button
        const delBtn = card.querySelector('.btn-delete-habit');
        if (delBtn) {
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openConfirmModal('حذف العادة', `هل تريد حذف عادة "${habit.label}"؟`, () => {
              this.data.customHabits = this.data.customHabits.filter(h => h.id !== habit.id);
              this.saveData();
              this.renderDailyView();
              this.renderTopStats();
            });
          });
        }

        container.appendChild(card);
      });
    }

    // Render View 2: 180-Day Matrix
    renderMatrixView() {
      const stats = this.getGlobalStats();

      document.getElementById('stat-completed-days').textContent = stats.completedDays;
      document.getElementById('stat-streak').textContent = `${stats.currentStreak} أيام`;
      document.getElementById('stat-avg-percent').textContent = `${stats.avgPercent}%`;
      document.getElementById('stat-arc-progress').textContent = `${stats.overallArcProgress}%`;

      this.renderMatrixGrid();
    }

    // Render Matrix Grid of 180 Boxes with Liquid Animation
    renderMatrixGrid() {
      const grid = document.getElementById('matrix-grid');
      if (!grid) return;
      grid.innerHTML = '';

      let start = 1;
      let end = TOTAL_DAYS;

      if (this.activeMonthFilter !== 'all') {
        const monthNum = parseInt(this.activeMonthFilter, 10);
        start = (monthNum - 1) * 30 + 1;
        end = monthNum * 30;
      }

      const fragment = document.createDocumentFragment();
      const fillElements = [];

      for (let i = start; i <= end; i++) {
        const day = this.getDay(i);
        const percent = day.percent || 0;

        let tierClass = 'tier-zero';
        if (percent > 0 && percent < 50) tierClass = 'tier-danger';
        else if (percent >= 50 && percent < 70) tierClass = 'tier-low';
        else if (percent >= 70 && percent < 90) tierClass = 'tier-warrior';
        else if (percent >= 90 && percent < 100) tierClass = 'tier-royal';
        else if (percent === 100) tierClass = 'tier-perfect';

        const isCurrentView = i === this.currentDay;
        const isRealToday = i === this.realWorldDay;

        let iconBadge = '';
        if (percent === 100) {
          iconBadge = '<span class="box-crown-icon" title="يوم أسطوري مكتمل 100%">👑</span>';
        } else if (percent >= 70) {
          iconBadge = '<span title="شعلة المحاربين (70%+)">🔥</span>';
        } else if (percent > 0 && percent < 50) {
          iconBadge = '<span title="منطقة الخطر (<50%)">⚠️</span>';
        }

        const box = document.createElement('div');
        box.className = `grid-box ${tierClass} ${isCurrentView ? 'current-day-highlight' : ''}`;
        box.dataset.day = i;
        box.dataset.percent = percent;

        box.innerHTML = `
          <div class="box-fill" style="height: 0%;"></div>
          <div class="box-top-row">
            <span class="box-day-num">${isRealToday ? '📍 اليوم ' + i : 'يوم ' + i}</span>
            ${iconBadge}
          </div>
          <div class="box-percent-badge">${percent > 0 ? percent + '%' : '0%'}</div>
        `;

        const fillEl = box.querySelector('.box-fill');
        fillElements.push({ el: fillEl, targetHeight: percent });

        // Click to navigate directly to that day
        box.addEventListener('click', () => {
          this.setDay(i);
          this.switchTab('daily');
          this.sound.playTick();
        });

        // Tooltip hover
        box.addEventListener('mouseenter', (e) => {
          this.showTooltip(e, i, day, percent);
        });

        box.addEventListener('mouseleave', () => {
          this.hideTooltip();
        });

        box.addEventListener('mousemove', (e) => {
          this.moveTooltip(e);
        });

        fragment.appendChild(box);
      }

      grid.appendChild(fragment);

      // Trigger smooth rising liquid animation for the boxes
      requestAnimationFrame(() => {
        fillElements.forEach((item, idx) => {
          setTimeout(() => {
            if (item.el) {
              item.el.style.height = `${item.targetHeight}%`;
            }
          }, Math.min(idx * 8, 400));
        });
      });
    }

    // Tooltip Handlers
    showTooltip(e, dayNum, day, percent) {
      if (!this.tooltip) return;

      const startDate = new Date(this.data.startDate);
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + (dayNum - 1));
      const dateStr = targetDate.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });

      let prayersCount = 0;
      if (day.prayers) {
        Object.values(day.prayers).forEach(v => { if (v) prayersCount++; });
      }

      this.tooltip.innerHTML = `
        <div class="tooltip-day">اليوم ${dayNum} (${dateStr})</div>
        <div class="tooltip-row"><span>نسبة الإنجاز:</span><span class="val">${percent}%</span></div>
        <div class="tooltip-row"><span>الصلوات:</span><span class="val">${prayersCount}/5</span></div>
        <div class="tooltip-row"><span>القرآن:</span><span class="val">${day.quran && day.quran.read ? 'أُنجز ✓' : 'لم يقرأ'}</span></div>
        <div class="tooltip-row"><span>تقييم اليوم:</span><span class="val">${day.rating ? day.rating + '/10' : '-'}</span></div>
      `;

      this.moveTooltip(e);
      this.tooltip.classList.add('show');
    }

    moveTooltip(e) {
      if (!this.tooltip) return;
      const x = e.clientX + 14;
      const y = e.clientY + 14;
      this.tooltip.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
      this.tooltip.style.top = `${Math.min(y, window.innerHeight - 150)}px`;
    }

    hideTooltip() {
      if (!this.tooltip) return;
      this.tooltip.classList.remove('show');
    }

    // Quick Jump to Day Modal
    openJumpDayModal() {
      this.modalTitle.textContent = 'الانتقال المباشر لأي يوم';
      this.modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <label style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 700;">أدخل رقم اليوم (من 1 إلى 180):</label>
          <input type="number" id="modal-jump-input" class="text-input-field" min="1" max="180" value="${this.currentDay}" style="width: 100%; font-size: 1.1rem; text-align: center;" />
        </div>
      `;
      this.modalConfirmBtn.textContent = 'انتقل';
      this.modalConfirmBtn.onclick = () => {
        const val = parseInt(document.getElementById('modal-jump-input').value, 10);
        if (val >= 1 && val <= TOTAL_DAYS) {
          this.setDay(val);
          this.closeModal();
        }
      };
      this.modalOverlay.classList.add('active');
    }

    // Add Habit Modal
    openAddHabitModal() {
      this.modalTitle.textContent = 'إضافة عادة جديدة لـ Winter Arc';
      this.modalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          <div>
            <label style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; margin-bottom: 0.35rem; display: block;">اسم العادة:</label>
            <input type="text" id="modal-habit-name" class="text-input-field" style="width: 100%;" placeholder="مثال: الاستحمام بماء بارد، كودينج ساعتين..." />
          </div>
          <div>
            <label style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; margin-bottom: 0.35rem; display: block;">أيقونة العادة (إيموجي):</label>
            <input type="text" id="modal-habit-icon" class="text-input-field" style="width: 100%;" value="⚡" />
          </div>
          <div>
            <label style="font-size: 0.8rem; color: var(--text-secondary); font-weight: 700; margin-bottom: 0.35rem; display: block;">التصنيف:</label>
            <select id="modal-habit-cat" class="text-input-field" style="width: 100%;">
              <option value="الجسد">الجسد واللياقة</option>
              <option value="العقل">العقل والتعلم</option>
              <option value="الانضباط">الانضباط والروح</option>
              <option value="المستقبل">العمل والمستقبل</option>
            </select>
          </div>
        </div>
      `;

      this.modalConfirmBtn.textContent = 'إضافة العادة';
      this.modalConfirmBtn.onclick = () => {
        const name = document.getElementById('modal-habit-name').value.trim();
        const icon = document.getElementById('modal-habit-icon').value.trim() || '⚡';
        const cat = document.getElementById('modal-habit-cat').value;
        if (!name) return;

        const id = 'habit_' + Date.now();
        this.data.customHabits.push({ id, label: name, category: cat, icon });
        this.saveData();
        this.closeModal();
        this.renderDailyView();
        this.renderTopStats();
      };

      this.modalOverlay.classList.add('active');
    }

    openConfirmModal(title, message, onConfirm) {
      this.modalTitle.textContent = title;
      this.modalBody.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${message}</p>`;
      this.modalConfirmBtn.textContent = 'تأكيد';
      this.modalConfirmBtn.onclick = () => {
        onConfirm();
        this.closeModal();
      };
      this.modalOverlay.classList.add('active');
    }

    closeModal() {
      this.modalOverlay.classList.remove('active');
    }

    // Load Demo Data for preview
    loadDemoData() {
      const demoPercentages = [100, 85, 70, 75, 90, 100, 60, 80, 100, 70, 85, 90, 100, 50, 70, 100, 85, 90, 70, 100, 80, 65, 75, 100, 90, 85, 70, 100, 95, 100];
      for (let i = 1; i <= demoPercentages.length; i++) {
        const pct = demoPercentages[i - 1];
        const day = this.getDay(i);
        day.percent = pct;
        day.rating = Math.min(10, Math.max(5, Math.round(pct / 10)));
        day.satisfaction = pct >= 80 ? 'yes' : (pct >= 60 ? 'somewhat' : 'no');
        day.discipline = pct >= 70 ? 'adhered' : 'fallen';
        day.prayers = {
          fajr: pct >= 50,
          dhuhr: pct >= 60,
          asr: pct >= 70,
          maghrib: pct >= 80,
          isha: pct >= 90
        };
        day.quran = { read: pct >= 60, pages: '4 صفحات', note: 'تدبر سورة الكهف' };
        day.journal_today = `اليوم ${i}: التزام قوي بتمارين الـ Winter Arc، تقدم ملحوظ في التركيز والصلابة الذهنية.`;
        day.journal_goal = 'أنجزت ساعتين عمل عميق ورفعت أوزان التمرين.';
        day.journal_feelings = 'شعور بالثقة والانتصار الداخلي.';
        day.journal_honest = 'الرحلة بدأت تظهر ثمارها، الاستمرارية هي المفتاح الوحيد.';
      }
      this.saveData();
      this.render();
      this.switchTab('matrix');
      this.sound.playChime();
    }

    // Export Data as JSON
    exportDataJSON() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data, null, 2));
      const downloadAnchor = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `winter_arc_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    // ==========================================
    // DAILY TACTICAL DIRECTIVE ENGINE (180 DAYS)
    // ==========================================
    getDailyDirective(dayNum) {
      const milestoneDirectives = {
        1: "اليوم الأول: بداية نقطة الصفر.. انسَ كل وعودك القديمة. كل لحظة تقضيها النهارده بدون تليفون وبدون شهوة هي حجر أساس لرجولتك القادمة.",
        2: "اليوم الثاني: صدمة الانسحاب بتبدأ.. مخك هيلح عليك ويقولك 'يوم واحد مش هيفرق'. دي كذبة الدوبامين الرخيص، اثبت مكانك.",
        3: "اليوم الثالث: المعركة الحقيقية.. 3 أيام بدون انتكاس بتعيد تنظيم أول مستقبلات دوبامين في قشرة الدماغ الجبهية. لا تتراجع شبر واحد.",
        4: "اليوم الرابع: ألم التمرين في الجيم هو الطريقة الوحيدة لتفريغ هرمون التستوستيرون في بناء عضلي حقيقي بدل تضييعه في العدم.",
        5: "اليوم الخامس: الصمت التام.. متقولش لحد إنك بتعمل Winter Arc. السر قوة، والظهور بدون نتيجة ضعف. اختفِ واشتغل.",
        7: "اليوم السابع (نهاية الأسبوع 1): انتصرت في أول جولة.. التستوستيرون الطبيعي بيقفز بنسبة 45%. احتفظ بالقوة دي واكسر الأوزان في الجيم.",
        10: "اليوم العاشر: غض البصر هو الدرع.. أي نظرة عابرة في الشارع أو على السوشيال ميديا هي عود ثقاب بيولع في غابة إرادتك.",
        14: "اليوم الرابع عشر (أسبوعين نقاء): الضباب الفكري بدأ يتبدد.. عينيك بقت أصفى، وصوتك بقى أعمق. متسمحش لذرة تهاون تدمر اللي بنيته.",
        21: "اليوم الواحد والعشرون: المسارات العصبية القديمة بتموت.. العادات بتتغير بالتدريج. الصلاة في وقتها مش رفاهية، هي المرساة الروحية لحياتك.",
        30: "اليوم الثلاثون (ختام المرحلة 1): كسر الإدمان والصدمة الأولى.. شهر كامل عدّى وأنت واقف صلب. أنت رسمياً دخلت مرحلة بناء الوحش.",
        45: "اليوم الخامس والأربعون: نصف المرحلة الثانية.. عضلاتك محتاجة 3500 سعرة يومياً. كل وجبة هي رصاصة في وجه الكسل وجسد الضعف.",
        60: "اليوم الستون (شهران في الظلام): مهاراتك البرمجية والتركيز العميق (Deep Work) هما اللي هيخلوك تملك مستقبلك المالي. صمت، تركيز، وتنفيذ.",
        75: "اليوم الخامس والسبعون: الشهوات القديمة بتفقد سيطرتها التامة.. عقلك بقى أداة حادة بتطيعك مش العكس.",
        90: "اليوم التسعون (منتصف الـ Winter Arc): 90 يوماً من النقاء والحديد والقرآن.. نص الرحلة انتهى، وبدأت ملامح الرجل الذي لا يُقهر.",
        100: "اليوم المائة: نادي المائة.. 100 يوم من الاختفاء والعمل المتواصل. الانضباط مبقاش مجهود، ده أسلوب حياتك الطبيعي.",
        120: "اليوم المائة والعشرون: أربعة أشهر من الصهر.. اللي هيشوفك دلوقتي هيبدأ يلاحظ الفارق الضخم في هيبتك ونبرتك وجسدك.",
        150: "اليوم المائة والخمسون: ختام مرحلة التصلب.. بقيت على بعد شهر واحد من الظهور الكامل. متسمحش للغرور يتسرب لقلبك، كمّل كأنك في اليوم الأول.",
        180: "اليوم المائة والثمانون (نهاية الرحلة والظهور): 6 شهور من الاختفاء الكامل.. من القاع إلى قمة السيادة. لقد انتصرت وولدت من جديد يا عمر."
      };

      if (milestoneDirectives[dayNum]) {
        return milestoneDirectives[dayNum];
      }

      // Dynamic phase-based directives for intervening days
      const phase1Pool = [
        "الفص الجبهي في مخك بيعيد بناء نفسه دقيقة بدقيقة.. استمر في الصمود ولا ترضخ لأي وسوسة.",
        "الماء البارد كل صباح هو رسالة لعقلك: أنا القائد، والجسد هو من يطيع.",
        "النظرة الأولى لك، والثانية عليك.. احمِ عينيك لحماية صفاء ذهنك وطاقتك الحيوية.",
        "الرجولة الحقيقية هي قدرتك على قول 'لا' لأتفه رغباتك الحيوانية لتبني أعظم أهدافك.",
        "الـ 3500 سعرة والبروتين هما وقود الوحش القادم.. لا تفوت وجبة واحدة اليوم.",
        "كل تكرار حديد في الجيم يطرد سموم 3 سنوات من الخمول والضياع.",
        "صلاتك هي حصنك الوحيد.. بدونها أنت عارٍ أمام وساوس نفسك والضعف البشري."
      ];

      const phase2Pool = [
        "العمل العميق (Deep Work) بدون تشتت لمدة 3 ساعات ينتج ما يعجز عنه الآخرون في شهر كامل.",
        "عضلاتك تُصنع في هدوء المطبخ وصالة الجيم.. لا تبحث عن تصفيق أو إعجاب أحد الآن.",
        "النقاء ليس مجرد امتناع، بل هو طاقة هائلة متفجرة توجهها نحو مستقبلك البرمجي والمالي.",
        "المعاناة المؤقتة في الانضباط أهون بألف مرة من ألم الندم الأبدي في القاع.",
        "تحدّث أقل، استمع أكثر، ونفّذ بصمت.. دع الأفعال والأرقام هي من تتكلم عنك.",
        "القوة العقلية تُبنى عندما تستمر في العمل في الأيام التي تشعر فيها بالكسل التام."
      ];

      const phase3Pool = [
        "أنت لست الشخص الذي بدأ هذه الرحلة.. عقلك حاد، وجسدك صلب، وهويتك لا تتزعزع.",
        "الانضباط الآلي: افعل ما يجب عليك فعله بغض النظر عما تشعر به.",
        "لقد اجتزت أصعب مراحل المقاومة العصبية.. أنت الآن في طور البناء الاستراتيجي للسيادة.",
        "لا تنظر إلى الخلف أبداً.. القاع القديم لم يعد مكاناً يليق برجل مثلك.",
        "كل يوم تلتزم فيه بالقرآن والصلوات والأهداف يرفعك درجات فوق ملايين المستسلمين."
      ];

      const phase4Pool = [
        "العد التنازلي للظهور العظيم.. أيام معدودة وتخرج للعالم كنسخة لا يمكن التعرف عليها.",
        "الهدوء المطلق والسكينة هما علامة القوة السيادية.. أكمل الأيام الأخيرة بأعلى درجات الدقة.",
        "التحول تم بنجاح.. الآن ثبت هذه القواعد لتكون أسلوب حياتك لما بعد الـ Winter Arc.",
        "استحضر دائماً كيف كنت في اليوم الأول وكيف أصبحت الآن.. فضل الله عليك عظيم."
      ];

      let pool;
      if (dayNum <= 30) pool = phase1Pool;
      else if (dayNum <= 90) pool = phase2Pool;
      else if (dayNum <= 150) pool = phase3Pool;
      else pool = phase4Pool;

      return pool[dayNum % pool.length];
    }

    // ==========================================
    // EMERGENCY SOS RELAPSE INTERVENTION SYSTEM
    // ==========================================
    initEmergencySystem() {
      this.sosModal = document.getElementById('emergency-modal');
      this.btnCloseSos = document.getElementById('btn-close-sos');
      this.btnHeaderSos = document.getElementById('btn-emergency-sos');
      this.btnInlineSos = document.getElementById('btn-trigger-sos-inline');
      
      this.breathCircle = document.getElementById('breath-circle');
      this.breathText = document.getElementById('breath-text');
      this.breathTimer = document.getElementById('breath-timer');
      this.btnStartBreath = document.getElementById('btn-start-breath');

      this.urgeTimerDisplay = document.getElementById('urge-timer-display');
      this.urgeTimerGuidance = document.getElementById('urge-timer-guidance');
      this.urgeTimerBarFill = document.getElementById('urge-timer-bar-fill');
      this.btnStartUrgeTimer = document.getElementById('btn-start-urge-timer');
      this.btnUrgeDefeated = document.getElementById('btn-urge-defeated');

      this.breathInterval = null;
      this.urgeTimerInterval = null;
      this.urgeSecondsLeft = 300; // 5 minutes

      // Open Modal Handlers
      if (this.btnHeaderSos) {
        this.btnHeaderSos.addEventListener('click', () => this.openEmergencyModal());
      }
      if (this.btnInlineSos) {
        this.btnInlineSos.addEventListener('click', () => this.openEmergencyModal());
      }

      // Close Modal Handler
      if (this.btnCloseSos) {
        this.btnCloseSos.addEventListener('click', () => this.closeEmergencyModal());
      }

      // Close when clicking overlay backdrop outside container
      if (this.sosModal) {
        this.sosModal.addEventListener('click', (e) => {
          if (e.target === this.sosModal) {
            this.closeEmergencyModal();
          }
        });
      }

      // Breath Exercise Handler
      if (this.btnStartBreath) {
        this.btnStartBreath.addEventListener('click', () => this.startBreathExercise());
      }

      // Urge Surfing Timer Handler
      if (this.btnStartUrgeTimer) {
        this.btnStartUrgeTimer.addEventListener('click', () => this.startUrgeSurfingTimer());
      }

      // Urge Defeated Victory Handler
      if (this.btnUrgeDefeated) {
        this.btnUrgeDefeated.addEventListener('click', () => this.handleUrgeDefeated());
      }
    }

    openEmergencyModal() {
      if (!this.sosModal) return;
      this.sound.playAlarm();
      this.sosModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Reset Urge Timer display
      this.urgeSecondsLeft = 300;
      this.updateUrgeTimerUI();
      if (this.urgeTimerBarFill) this.urgeTimerBarFill.style.width = '100%';
    }

    closeEmergencyModal() {
      if (!this.sosModal) return;
      this.sosModal.classList.remove('active');
      document.body.style.overflow = '';
      this.stopBreathExercise();
      this.stopUrgeSurfingTimer();
    }

    // Physiological Sigh Cycle: 4s Inhale -> 1s Hold -> 6s Exhale (x3 Cycles)
    startBreathExercise() {
      this.stopBreathExercise();
      let cycle = 1;
      const totalCycles = 3;
      let phase = 'inhale'; // inhale (4s), hold (1s), exhale (6s)
      let phaseSeconds = 4;

      if (this.btnStartBreath) {
        this.btnStartBreath.disabled = true;
        this.btnStartBreath.innerHTML = '<span>⏳</span> جاري تمرين التنفس...';
      }

      const applyPhase = () => {
        if (!this.breathCircle || !this.breathText || !this.breathTimer) return;
        this.breathCircle.classList.remove('inhale', 'hold', 'exhale');

        if (phase === 'inhale') {
          this.breathCircle.classList.add('inhale');
          this.breathText.textContent = `شهيق عميق (${phaseSeconds}s)`;
          this.breathTimer.textContent = `دورة ${cycle} من ${totalCycles} • املأ الرئتين`;
        } else if (phase === 'hold') {
          this.breathCircle.classList.add('hold');
          this.breathText.textContent = `احبس النفس`;
          this.breathTimer.textContent = `دورة ${cycle} من ${totalCycles} • هدوء تام`;
        } else if (phase === 'exhale') {
          this.breathCircle.classList.add('exhale');
          this.breathText.textContent = `زفير بطيء (${phaseSeconds}s)`;
          this.breathTimer.textContent = `دورة ${cycle} من ${totalCycles} • فرّغ التوتر`;
        }
      };

      applyPhase();
      this.sound.playTick();

      this.breathInterval = setInterval(() => {
        phaseSeconds--;

        if (phase === 'inhale') {
          if (phaseSeconds <= 0) {
            phase = 'hold';
            phaseSeconds = 1;
            applyPhase();
          } else {
            if (this.breathText) this.breathText.textContent = `شهيق عميق (${phaseSeconds}s)`;
          }
        } else if (phase === 'hold') {
          if (phaseSeconds <= 0) {
            phase = 'exhale';
            phaseSeconds = 6;
            applyPhase();
          }
        } else if (phase === 'exhale') {
          if (phaseSeconds <= 0) {
            cycle++;
            if (cycle > totalCycles) {
              this.stopBreathExercise();
              if (this.breathCircle) {
                this.breathCircle.classList.remove('inhale', 'hold', 'exhale');
              }
              if (this.breathText) this.breathText.textContent = 'أحسنت! 🫁';
              if (this.breathTimer) this.breathTimer.textContent = 'الأكسجين عاد لفصك الجبهي.. الآن اكبح الرغبة بالكامل!';
              if (this.btnStartBreath) {
                this.btnStartBreath.disabled = false;
                this.btnStartBreath.innerHTML = '<span>🔄</span> إعادة تمرين التنفس الفسيولوجي';
              }
              this.sound.playChime();
              return;
            }
            phase = 'inhale';
            phaseSeconds = 4;
            applyPhase();
            this.sound.playTick();
          } else {
            if (this.breathText) this.breathText.textContent = `زفير بطيء (${phaseSeconds}s)`;
          }
        }
      }, 1000);
    }

    stopBreathExercise() {
      if (this.breathInterval) {
        clearInterval(this.breathInterval);
        this.breathInterval = null;
      }
      if (this.btnStartBreath) {
        this.btnStartBreath.disabled = false;
        this.btnStartBreath.innerHTML = '<span>▶️</span> ابدأ تمرين التنفس الفسيولوجي (3 دورات)';
      }
    }

    // 5-Minute Urge Surfing Timer
    startUrgeSurfingTimer() {
      this.stopUrgeSurfingTimer();
      this.urgeSecondsLeft = 300;
      this.updateUrgeTimerUI();

      if (this.btnStartUrgeTimer) {
        this.btnStartUrgeTimer.disabled = true;
        this.btnStartUrgeTimer.innerHTML = '<span>⏱️</span> المؤقت يعمل الآن.. اثبت!';
      }

      this.urgeTimerInterval = setInterval(() => {
        this.urgeSecondsLeft--;
        this.updateUrgeTimerUI();

        if (this.urgeSecondsLeft <= 0) {
          this.stopUrgeSurfingTimer();
          if (this.urgeTimerGuidance) {
            this.urgeTimerGuidance.textContent = '🎉 مرت الـ 5 دقائق! انكسرت موجة الدوبامين الرخيصة.. اضغط على زر النصر بالأسفل!';
            this.urgeTimerGuidance.style.color = '#34d399';
          }
          this.sound.playVictory();
        }
      }, 1000);
    }

    stopUrgeSurfingTimer() {
      if (this.urgeTimerInterval) {
        clearInterval(this.urgeTimerInterval);
        this.urgeTimerInterval = null;
      }
      if (this.btnStartUrgeTimer) {
        this.btnStartUrgeTimer.disabled = false;
        this.btnStartUrgeTimer.innerHTML = '<span>⏳</span> ابدأ مؤقت الصمود (5 دقائق)';
      }
    }

    updateUrgeTimerUI() {
      const minutes = Math.floor(this.urgeSecondsLeft / 60);
      const seconds = this.urgeSecondsLeft % 60;
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (this.urgeTimerDisplay) {
        this.urgeTimerDisplay.textContent = formatted;
      }

      if (this.urgeTimerBarFill) {
        const pct = (this.urgeSecondsLeft / 300) * 100;
        this.urgeTimerBarFill.style.width = `${pct}%`;
      }

      if (this.urgeTimerGuidance) {
        if (this.urgeSecondsLeft > 240) {
          this.urgeTimerGuidance.textContent = 'الموجة في ذروتها.. قف الآن وارمِ الهاتف بعيداً واغسل وجهك بالماء البارد!';
        } else if (this.urgeSecondsLeft > 180) {
          this.urgeTimerGuidance.textContent = 'تنفس بعمق.. الدم يعود تدريجياً للفص الجبهي.. عقلك يستعيد السيطرة الكاملة!';
        } else if (this.urgeSecondsLeft > 120) {
          this.urgeTimerGuidance.textContent = 'المستقبل الذي تحلم به في الـ Winter Arc لا يُباع مقابل 10 ثوانٍ من الذل.. اثبت مكانك!';
        } else if (this.urgeSecondsLeft > 60) {
          this.urgeTimerGuidance.textContent = 'الموجة الكيميائية بدأت تنكسر.. ضربات قلبك تهدأ، جسمك ينتصر على الاندفاع!';
        } else if (this.urgeSecondsLeft > 0) {
          this.urgeTimerGuidance.textContent = 'آخر ثوانٍ.. أنت سحقت شهوتك وأثبتت سيادتك.. استعد لإعلان النصر ورفع رأسك!';
        }
      }
    }

    handleUrgeDefeated() {
      this.sound.playVictory();
      this.confetti.burst();

      // Automatically mark today's discipline as adhered and ghad basar habit
      const day = this.getDay(this.currentDay);
      day.discipline = 'adhered';
      if (!day.habits) day.habits = {};
      day.habits['ghad_basar'] = true;
      this.saveData();
      this.render();

      if (this.btnUrgeDefeated) {
        this.btnUrgeDefeated.innerHTML = '<span>🏆</span> نصر ساحق! تم تثبيت النقاء في سجل اليوم';
        this.btnUrgeDefeated.style.background = 'linear-gradient(135deg, #059669, #10b981)';
      }

      setTimeout(() => {
        this.closeEmergencyModal();
        if (this.btnUrgeDefeated) {
          this.btnUrgeDefeated.innerHTML = '<span>🛡️</span> انتصرت وسحقت الشهوة!';
          this.btnUrgeDefeated.style.background = '';
        }
      }, 2200);
    }

    // Import Data from JSON
    importDataJSON(file) {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && typeof parsed === 'object') {
            this.data = parsed;
            this.saveData();
            this.setDay(1);
            this.render();
            alert('تم استرجاع النسخة الاحتياطية لـ Winter Arc بنجاح!');
          }
        } catch (err) {
          alert('الملف المحدد غير صالح. يرجى اختيار ملف JSON صحيح.');
        }
      };
      reader.readAsText(file);
    }
  }

  // Initialize on DOM Ready
  window.addEventListener('DOMContentLoaded', () => {
    window.winterArcApp = new WinterArcApp();
    initPWA();
  });

  // PWA Support & Service Worker Registration with Auto-Update
  function initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').then((reg) => {
          console.log('Winter Arc ServiceWorker registered:', reg.scope);
          reg.update();
        }).catch((err) => {
          console.warn('Winter Arc ServiceWorker registration failed:', err);
        });
      });

      // Reload smoothly when new Service Worker version activates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    let deferredPrompt = null;
    const installBtn = document.getElementById('btn-install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            installBtn.style.display = 'none';
          }
          deferredPrompt = null;
        } else {
          alert('لتثبيت Winter Arc كأيقونة تطبيق:\n• على الكمبيوتر (Chrome/Edge): اضغط على أيقونة التثبيت (Install) التي تظهر في نهاية شريط الرابط بالأعلى.\n• على آيفون (Safari): اضغط زر المشاركة (Share) ثم اختر "إضافة إلى الشاشة الرئيسية (Add to Home Screen)".\n• على أندرويد: اضغط القائمة (⋮) ثم "تثبيت التطبيق".');
        }
      });
    }

    window.addEventListener('appinstalled', () => {
      if (installBtn) installBtn.style.display = 'none';
    });
  }
})();
