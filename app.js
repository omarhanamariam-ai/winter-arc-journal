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

  // ==========================================
  // GOGGINS 180-DAY DOSSIER ENGINE (DAILY CODEX)
  // ==========================================
  const GOGGINS_DOSSIER_ENGINE = {
    // Phase metadata
    phases: {
      1: { name: 'المرحلة الأولى: كسر الصدمة والانسحاب الدوباميني', range: 'الأيام 1 - 30', badge: '💥 صدمة البداية' },
      2: { name: 'المرحلة الثانية: مصنع الكالوس الذهني وحاجز الـ 40%', range: 'الأيام 31 - 90', badge: '🔨 مصنع الحديد' },
      3: { name: 'المرحلة الثالثة: وضع الشبح والفتك الصامت', range: 'الأيام 91 - 150', badge: '🔱 وضع الشبح' },
      4: { name: 'المرحلة الرابعة: التحول الكامل والولادة كشخص لا يُقهر', range: 'الأيام 151 - 180', badge: '👑 الهيمنة التامة' }
    },

    // Curated high-impact dossiers for specific days
    milestones: {
      1: {
        title: 'نقطة الصفر ومواجهة المرآة العارية',
        slap: 'أنت في القاع. لا تجمل الحقيقة لنفسك. David Goggins كان يزن 136 كجم ويرش الحشرات ليلاً. لم يبكِ على ماضيه، بل وقف أمام المرآة وكتب الحقيقة البشعة على أوراق لاصقة. اليوم ليس يوم حماس عابر، بل يوم إعلان الحرب على نسختك الفاشلة.',
        tactical: 'قف أمام المرآة لمدة 3 دقائق كاملة في صمت تام. انظر في عينيك واعترف بكل شيء فشلت فيه. ثم ابدأ صلاتك الأولى وتمرنك الأول دون تأخير دقيقة واحدة.',
        barrier: 'عقلك سيحاول أن يقنعك بالبدء يوم السبت أو أول الشهر. هذا صوت الشيطان والكسل. اكسر الحاجز بالوضوء والصلاة فوراً.',
        prayer: 'صلاة الفجر في وقتها: قال ﷺ: «مَن صَلَّى الصُّبْحَ فَهو في ذِمَّةِ اللهِ». هذا أول درع عصبي وروحي تضعه اليوم. تروية الفص الجبهي في السجود تمنحك الثبات.',
        mirror: 'هل واجهت حقيقتك اليوم بصدق، أم ما زلت تبحث عن أعذار تبرر بها ضعفك القديم؟'
      },
      2: {
        title: 'فضح الصوت الكذاب الداخلي',
        slap: 'في اليوم الثاني، سيبدأ الصوت الداخلي بالهمس: "يوم واحد كافٍ، لن يضرك التقليب قليلاً أو تفويت صلاة". هذا الصوت ليس أنت؛ هذا صوت الإدمان المحتضر. حين تسمعه، تذكر أن كل استسلام سابق بدأ بهذه الهمسة.',
        tactical: 'تدريب السكوت التام: اقضِ ساعتين كاملتين بدون فتح أي منصة تواصل، وبدون أي موسيقى أو مشتت. ركز فقط في عملك وتمرينك.',
        barrier: 'الرغبة الملحة (Urge) ستهاجمك وقت الفراغ. تذكر قاعدة الـ 10 دقائق: اضغط زر SOS في الموقع، تنفس بعمق، وقم بالوضوء فوراً.',
        prayer: 'صلاة الظهر: تفريغ الإجهاد العصبي التراكمي في منتصف اليوم. اسجد وأطل السجود لتخفيض نشاط اللوزة الدماغية واستعادة السيطرة.',
        mirror: 'كم مرة كذب عليك عقلك اليوم؟ وهل سمعت كلامه أم فرضت إرادتك عليه؟'
      },
      3: {
        title: 'تنظيف المستقبلات وبدء الانسحاب الدوباميني',
        slap: 'اليوم الثالث هو مقبرة الضعفاء؛ فيه تبدأ أعراض الانسحاب الحقيقية: صداع، ملل، ضيق صدر. هذا دليل قاطع على أن مخك بدأ يتعافى ويعيد بناء مستقبلات الدوبامين التي أحرقتها بالشهوات والتفاهة. افرح بهذا الألم لأنه صوت التعافي.',
        tactical: 'أكمل تمريناً بدنياً قاسياً حتى التعرق الكامل. اشرب 3 لترات ماء على الأقل ونظف أكلك من السكر الأبيض تماماً.',
        barrier: 'الشعور بالملل والفراغ. العقل المدمن يعتبر الملل حالة طوارئ. اكسر هذا الوهم بقراءة ورد القرآن والعمل العميق.',
        prayer: 'صلاة العصر: ﴿حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ﴾. وقت انكسار الهمة البدنية العصرية؛ الصلاة هنا تشحنك بتركيز لا نظير له.',
        mirror: 'هل صمدت أمام الملل، أم بحثت عن دوبامين رخيص يسكن ألم الانسحاب؟'
      },
      7: {
        title: 'نهاية الأسبوع الأول — بناء القشرة العظمية الأولى',
        slap: 'أسبوع كامل في الجحيم وأنت ما زلت واقفاً. 90% ممن يتحدثون عن التغيير يستسلمون قبل اليوم السابع. أنت تجاوزت أول مرحلة تصفية. لكن احذر من فخ "المكافأة": لا تكافئ نفسك بالانتكاس!',
        tactical: 'مراجعة أسبوعية صارمة: انظر في مصفوفة الـ 180 يوماً وتأكد من أن الأيام السبعة خالية من أي نقطة حمراء.',
        barrier: 'نشوة الإنجاز المزيفة. عقلك سيقول لك: "أنت بطل، تستحق أن ترتاح قليلاً اليوم". قل له: "الوحوش لا ترتاح في بداية المعركة".',
        prayer: 'السنن والرواتب: لا تكتفِ بالفرائض اليوم. أضف ركعتي الضحى وركعتي الوتر كختام عسكري حديدي لأسبوعك الأول.',
        mirror: 'هل بنيت عادة حديدية هذا الأسبوع، أم أنك كنت تترنح وتنتظر الفرصة للتراجع؟'
      },
      14: {
        title: 'اليوم الرابع عشر — أسبوعان في الظلام الإيجابي',
        slap: '14 يوماً من الصمت والعمل. شكلك بدأ يتغير، عيناك أصبحت أكثر حدة وتركيزاً، وتشتتك الذهني تراجع. لكنك الآن تدخل منطقة "الروتين الممل". هنا يختبر الرجال الحقيقيون: عندما يختفي الحماس ولا يتبقى إلا الانضباط البارد.',
        tactical: 'زد عدات التمرين بمقدار 10% اليوم. ارفع دقيقة إضافية في تمرين البلانك واكتب فصلاً كاملاً في مهمتك المهنية.',
        barrier: 'فخ الرتابة والملل. الحماس مات، والآن يبدأ عمل المقاتل البارد.',
        prayer: 'ركعتين قيام ليل قبل الفجر بربع ساعة: جرب لذة مناجاة الله والناس نيام؛ هذا ما يصنع الهيبة والصلابة الداخلية.',
        mirror: 'هل قمت بمهامك اليوم بحرارة الانضباط أم ببرود التكاسل والتأجيل؟'
      },
      21: {
        title: 'اليوم الحادي والعشرون — ترويض المسارات العصبية القديمة',
        slap: '21 يوماً تكفي بيولوجياً لبداية تفكك المسارات العصبية للإدمان القديم (Synaptic Pruning). عقلك القديم يفقد سيطرته عليك خطوة بخطوة. صوت الضعف أصبح بعيداً، لكن لا تغتر أبداً؛ الذئب لا يزال يتربص.',
        tactical: 'صيام اليوم (صيام تطوع إن أمكن أو صيام متقطع 16 ساعة) لزيادة الالتهام الذاتي (Autophagy) وتنقية الخلايا والذهن.',
        barrier: 'ثقة مفرطة غير مبررة. أخطر ما يهددك الآن هو أن تقول لنفسك: "أنا شفيت تماماً ويمكنني اختبار نفسي". ابتعد عن الشبهات.',
        prayer: 'الخشوع في الفاتحة: اقرأ كل آية وتوقف عندها واستحضر جواب الله لك: «حمِدني عبدي، أثنى عليّ عبدي».',
        mirror: 'هل راقبت أفكارك وحافظت على مسافتك من مسببات الانتكاس، أم تساهلت؟'
      },
      30: {
        title: 'اليوم الثلاثون — نهاية المرحلة الأولى واقتلاع الجذور',
        slap: 'شهر كامل! 30 يوماً من العذاب الطوعي. لقد دفنت نسختك القديمة رسمياً. 30 يوماً بدون استسلام = دليل علمي قطعي على أنك قادر على التحكم المطلق في كيمياء دماغك. المرحلة القادمة ليست دفاعاً، بل هجوم كاسح لبناء الوحش.',
        tactical: 'جلسة تدقيق شهرية كاملة: اكتب إحصائياتك: كم يوماً صليت الفجر في وقته؟ كم كيلو جراماً اكتسبت أو خسرت؟ كم صفحة قرأت؟',
        barrier: 'الاعتقاد بأن المعركة انتهت. أنت لم تنهِ إلا 16% فقط من خطة الـ 180 يوماً. الوحش الحقيقي يبدأ الآن.',
        prayer: 'سجدة شكر طويلة لله تعالى على توفيقه بالثبات طوال 30 يوماً، مع الدعاء بالثبات حتى اليوم 180.',
        mirror: 'قف أمام المرآة الليلة وقارن بين صورتك اليوم وصورتك قبل 30 يوماً. هل تشعر بالفخر بما بنيته حتى الآن؟'
      },
      45: {
        title: 'اليوم الخامس والأربعون — اقتحام حاجز الـ 40%',
        slap: 'أنت في منتصف المرحلة الثانية. هنا يصطدم معظم الناس بحائط الجهد التراكمي. عضلاتك متعبة، ذهنك يطلب راحة. Goggins يقول: عندما تشعر أنك انتهيت تماماً، تذكر أنك لم تستهلك سوى 40% من طاقتك الحقيقية. الـ 60% المتبقية مخبأة خلف هذا الجدار.',
        tactical: 'أضف شوطاً إضافياً في تمرينك حتى الفشل العضلي التام. عندما يقول عقلك "توقف عند العدة 8"، اجبرها لتصل إلى 12.',
        barrier: 'الإرهاق البدني الذهني الوهمي. مخك يرسل إشارات كاذبة بالخطر لحمايتك؛ تجاوز هذه الإشارات عمداً.',
        prayer: 'صلاة المغرب: اجمع فيها ذهنك تماماً بعد نهار شاق، واجعلها بوابة الانتقال للعمل العميق المسائي.',
        mirror: 'كم مرة دفعت نفسك اليوم لتجاوز النقطة التي كنت تريد التوقف عندها؟'
      },
      60: {
        title: 'اليوم الستون — ثلث الطريق وعمودية الانضباط',
        slap: '60 يوماً. شهران كاملان في الخفاء. أصبح الانضباط هو هويتك الجديدة، ولم يعد مجرد مهمة على جدول. أنت الآن لست ذلك الشخص المتردد؛ أنت ماكينة تنفيذ. لا تلتفت خلفك ولا تحسب كم تبقى؛ ركز فقط في إتقان اليوم.',
        tactical: 'نفذ 3 ساعات عمل عميق متواصل بدون لمس الهاتف وبدون شرب سوى الماء والقهوة السوداء.',
        barrier: 'التطبيع مع الإنجاز: أن يصبح التزامك روتينياً بلا روح. اشحن شغفك بإعادة قراءة أهدافك الكبرى.',
        prayer: 'الوتر بركعات خاشعة ودعاء طويل في السجود: اسأل الله العزيمة على الرشد وشكر النعمة.',
        mirror: 'هل صلاتك وتدريبك اليوم كانا بحضور قلبي وتركيز، أم تحولا إلى حركة ميكانيكية؟'
      },
      90: {
        title: 'اليوم التسعون — منتصف الـ 180 وبداية وضع الشبح المطلق',
        slap: 'نصف المسافة! 90 يوماً كاملة من التحول. أنت الآن شخص مختلف بيولوجياً وعقلياً ونفسياً. مستويات هرموناتك استقرت، تركيزك تضاعف، وعقلك أصبح محكوماً بإرادتك. من الآن وحتى اليوم 150 تدخل أشرس مراحل الـ Winter Arc: وضع الشبح التام.',
        tactical: 'اختبار اللياقة الشامل: قس قدرتك على الركض، التكرارات القصوى، ونفذ جلسة مرآة مطولة لتقييم أهدافك المالية والدراسية.',
        barrier: 'الظهور المبكر للناس للاستعراض. إياك أن تفسد تحولك بالاستعراض على وسائل التواصل. ابقَ في الظل حتى يكتمل البناء.',
        prayer: 'المحافظة على صلاة الجماعة في المسجد لكل الصلوات الممكنة، لتثبيت الدرع الروحي بين الصالحين.',
        mirror: 'هل أنت مستعد للأيام الـ 90 القادمة بكل وحشية، أم بدأت تشعر بالاكتفاء؟'
      },
      120: {
        title: 'اليوم المائة والعشرون — الفتك في صمت الجليد',
        slap: 'أربعة أشهر في عزلة التطوير. لا أحد يعلم ما تفعله، ولا أحد يعرف كم تعاني وتتطور يومياً. هذا هو سحر الـ Winter Arc: المفاجأة التامة لمن حولك عندما تعود للحياة. كن قاسياً مع أخطائك، رحيماً فقط مع هدفك.',
        tactical: 'اقضِ اليوم بأكمله بدون كلمة لغو واحدة؛ صمت تام إلا في ذكر الله والعمل الضروري.',
        barrier: 'الاشتياق لحياة التفاهة والراحة القديمة. عندما تشتاق للماضي، تذكر كم كنت تحتقر نفسك حينها.',
        prayer: 'أذكار الصباح والمساء بيقين وتدبر لكل كلمة: «أصبحنا وأصبح الملك لله...».',
        mirror: 'ما هو الشيء الذي كان يهزمك قبل 4 أشهر وأصبحت تبتسم اليوم حين تتذكره؟'
      },
      150: {
        title: 'اليوم المائة والخمسون — بداية الخروج والتحول غير القابل للكسر',
        slap: '5 أشهر كاملة! 150 يوماً من الصقل والنحت. أنت تقترب من خط النهاية، ولكن كما يقول Goggins: السباق لا ينتهي حتى تعبر الخط. الشهر الأخير هو شهر التتويج: تثبيت هذا التحول ليكون نمط حياة للأبد، وليس مجرد تحدٍ ينتهي.',
        tactical: 'تدريب التحمل الأقصى: تمرين مزدوج (Double Session) — صباحاً كارديو مكثف ومساءً حديد شاق.',
        barrier: 'الاسترخاء في الأمتار الأخيرة. أخطر نقطة في الماراثون هي آخر 5 كيلومترات. زد سرعتك الآن ولا تبطئ.',
        prayer: 'صلاة قيام الليل مع قراءة أجزاء طويلة بتدبر، ليكون قلبك متصلاً بربك في أعلى درجات القرب.',
        mirror: 'هل أنت نفس الشخص الذي بدأ في اليوم الأول؟ اكتب الفارق الجذري بين نسختك اليوم وتلك النسخة القديمة.'
      },
      180: {
        title: 'اليوم المائة والثمانون — اليوم الأخير: ولادة الوحش الذي لا يُقهر',
        slap: '180 يوماً. نصف عام كامل في النار. لقد فعلتها. دخلت هذا التحدي مكسوراً ومشتتاً ومدمراً، وتخرج منه اليوم رجلاً حديدياً ذا بأس وإيمان وصلابة تحني لها الصعاب. أنت الآن تثبت لنفسك ولكل العالم: لا وجود للمستحيل أمام إنسان قرر أن يمسك زمام أمره بالله ثم بإرادته. STAY HARD للأبد!',
        tactical: 'اكتب بيان حياتك المستقبلي (Personal Manifesto): كيف ستعيش بقية حياتك بهذا الانضباط؟ هذا ليس نهاية المطاف، بل بداية حقبتك الذهبية.',
        barrier: 'الانتكاس بعد انتهاء التحدي. الـ Winter Arc لم يكن هدفاً مؤقتاً؛ الـ Winter Arc كان إعادة برمجة أبدية لشخصيتك.',
        prayer: 'صلاة شكر ودعاء واستغفار: اسجد واحمد الله الذي هداك لهذا وما كنت لتهتدي لولا أن هداك الله.',
        mirror: 'انظر في المرآة الآن. من هذا الرجل الذي يقف أمامك؟ بارك الله فيك، لقد انتصرت على نسختك الضعيفة للأبد!'
      }
    },

    // Procedural generation for any other day
    getDayProtocol(dayNum) {
      const d = Math.min(Math.max(parseInt(dayNum, 10) || 1, 1), 180);
      
      // Determine Phase
      let phaseId = 1;
      if (d > 150) phaseId = 4;
      else if (d > 90) phaseId = 3;
      else if (d > 30) phaseId = 2;
      
      const phaseInfo = this.phases[phaseId];

      // If explicit milestone exists, return it merged with phase info
      if (this.milestones[d]) {
        const m = this.milestones[d];
        return {
          day: d,
          code: 'DAY-' + String(d).padStart(3, '0'),
          phaseId: phaseId,
          phaseName: phaseInfo.name,
          phaseRange: phaseInfo.range,
          phaseBadge: phaseInfo.badge,
          title: m.title,
          slap: m.slap,
          tactical: m.tactical,
          barrier: m.barrier,
          prayer: m.prayer,
          mirror: m.mirror
        };
      }

      // Procedural generator with high thematic variety based on phase
      const dayThemes = {
        1: [
          { title: 'كسر حاجز الخمول والانتصار على الوسواس', focus: 'الثبات في وجه أعراض الانسحاب', mission: 'ركز في إتمام صلواتك في وقتها دون تأخير دقيقة واحدة، ونفذ تمرين اليوم بعزيمة شرسة.' },
          { title: 'تحطيم قيود الدوبامين الرخيص وتطهير العينين', focus: 'غض البصر والابتعاد عن الشاشات الفارغة', mission: 'أغلق كل إشعار غير ضروري. اعمل 90 دقيقة بنظام بومودورو صارم بدون تشتت.' },
          { title: 'إعادة ضبط الساعة البيولوجية والاستيقاظ الحاسم', focus: 'الاستيقاظ قبل الفجر وعدم العودة للنوم', mission: 'انهض من الفراش فور سماع المنبه كالرصاصة، توضأ بماء بارد واشحن ذهنك بالصلاة.' },
          { title: 'بناء الانضباط الصامت ومحاربة الأعذار', focus: 'كتمان الإنجاز وعدم التحدث للناس عما تفعله', mission: 'لا تخبر أحداً بما تنوي فعله اليوم؛ دع عرقك وأرقامك ونتائجك تتحدث عنك لاحقاً.' },
          { title: 'مقاومة هبوط الهمة والتمسك بالقوانين الستة', focus: 'التغلب على التعب العضلي والذهني الطارئ', mission: 'حتى لو كنت مرهقاً بنسبة 90%، نفذ تمرينك على الأقل بنسبة 100% تركيز.' }
        ],
        2: [
          { title: 'تصلب الكالوس العقلي في مواجهة الملل الروتيني', focus: 'كسر الرتابة بالضغط على النفس في التمرين', mission: 'أضف وزناً إضافياً أو دقيقة بلانك زائدة. حارب النقطة التي تقول لك فيها نفسك "كفى".' },
          { title: 'التغذية الصارمة وتزويد الجسم بـ 3500 سعرة نظيفة', focus: 'الالتزام الكامل بالوقود العضلي وتجنب السكر', mission: 'احسب بروتينك اليومي بدقة، وتناول طعامك كوقود لمعركة وليس لتسلية لسانك.' },
          { title: 'التركيز الفولاذي وسحق التسويف في المهام المعقدة', focus: 'إنهاء أصعب مهمة على جدولك في الصباح الباكر', mission: 'ابدأ بمهمتك الأثقل أولاً (Eat The Frog) قبل أن تمس أي شيء سهل أو مريح.' },
          { title: 'السيطرة على النفس عند الغضب والضغوط اليومية', focus: 'تحويل طاقة الغضب والإحباط إلى وقود في الجيم', mission: 'إذا واجهت موقفاً مستفزاً اليوم، اكتم غيظك وفرغ الشحنة بالكامل في تدريبك الحديدي.' },
          { title: 'ترسيخ عادة قراءة القرآن وتدبر آيات الثبات', focus: 'قراءة صفحتين على الأقل بتأمل وتطبيق', mission: 'افتح المصحف بعد صلاة الفجر أو العصر واقرأ آيات الصبر والجهاد بتدبر عميق.' }
        ],
        3: [
          { title: 'غرق تام في وضع الشبح وعزل المشتتات', focus: 'العمل في الظلام بدون أي رغبة في الإطراء', mission: 'ابتعد تماماً عن متابعة أخبار الآخرين؛ كل طاقتك موجهة حصراً لمشروعك ومستقبلك.' },
          { title: 'سحق الشكوك الذاتية وبنك الكوكيز الذهني', focus: 'تذكر الانتصارات السابقة وقدرتك على الصمود', mission: 'عندما تشك في قدرتك، افتح بنك الكوكيز وتذكر أنك صمدت لأكثر من 100 يوم حتى الآن.' },
          { title: 'الأداء تحت الضغط واحتراف تحمل المشاق', focus: 'ممارسة المهام الصعبة في أسوأ الظروف المزاجية', mission: 'لا تنتظر المزاج الجيد أبداً؛ تصرف كجندي في ميدان المعركة ينفذ الأمر بغض النظر عن شعوره.' },
          { title: 'توسيع الفارق بينك وبين نسختك القديمة', focus: 'رؤية التطور الهائل في قوتك البدنية والذهنية', mission: 'راقب كيف أصبحت تدير وقتك وتحكمك في شهواتك مقارنة بـ 99% من الناس حولك.' },
          { title: 'تطهير القلب والارتقاء في درجات الخشوع', focus: 'الصلاة بحضور كامل واستحضار عظمة الخالق', mission: 'اجعل كل ركعة اليوم أطول من المعتاد؛ ركز في كل حرف تقوله في التشهد والسجود.' }
        ],
        4: [
          { title: 'تثبيت هوية المقاتل الذي لا يقبل بالهزيمة', focus: 'عدم السماح لأي تراخٍ في الأمتار الأخيرة', mission: 'نفذ جدولك بدقة متناهية كأنك في اليوم الأول من التحدي؛ الحذر حتى خط النهاية.' },
          { title: 'التحول من مرحلة الدفاع إلى مرحلة الهيمنة', focus: 'تحقيق أهدافك الكبرى في العمل والدراسة والجسد', mission: 'ضع خطة للمرحلة التي تلي التحدي؛ هذا الانضباط ليس مؤقتاً بل دستور حياتك الجديد.' },
          { title: 'الصلابة الروحية التي لا تهزها عواصف الحياة', focus: 'اليقين التام بأن التوفيق من الله والجهد عليك', mission: 'اشكر الله في سجودك على القوة والهدى الذي منحك إياه لاجتياز هذه الأشهر الشاقة.' },
          { title: 'الاستعداد للخروج الكامل وشهادة العالم على تحولك', focus: 'إظهار النتائج الواقعية دون تكبر بل بوقار', mission: 'اجعل وقارك وهدوءك وثقتك بنفسك هي التي تلفت الأنظار، وليس كثرة الكلام.' }
        ]
      };

      const themes = dayThemes[phaseId];
      const themeIndex = (d - 1) % themes.length;
      const theme = themes[themeIndex];

      const phaseSlaps = {
        1: 'أنت في مرحلة بناء الأساس. كل خلية في جسمك تشتاق للراحة والكسل. David Goggins لم يصل إلى ما وصل إليه لأنه كان مميزاً، بل لأنه قبل أن يعيش في الألم عندما كان الباقون يهربون. اثبت مكانك، صلاتك خط أحمر، وتمرينك أمر عسكري.',
        2: 'مرحلة الكالوس الذهني تتطلب تكراراً بلا توقف. الحماس انتهى منذ زمن، والآن فقط يظهر الفرق بين الهواة والمحترفين. عندما تشعر بالثقل والملل، تذكر: هذا هو بالضبط المكان الذي ينسحب فيه الآخرون، وهذا هو المكان الذي تتقدم فيه أنت.',
        3: 'وضع الشبح يعني أنك غير مرئي للعالم، لكن نتائجك تتحدث كالصواعق. لا تبحث عن إعجاب أحد ولا تنتظر تشجيعاً. الله يراك ويعلم جهدك، وأنت تعلم أنك تصنع معجزة شخصية في هدوء الليل.',
        4: 'أنت الآن في النخبة التي لا تتجاوز 1% ممن يبدأون. لا تتراخَ ولا تظن أنك وصلت؛ الخطر الحقيقي يبدأ عندما يظن المرء أنه انتصر. حافظ على يقظتك، احرس صلاتك، وأنهِ هذا اليوم كما ينبغي لمحارب حقيقي.'
      };

      const phaseBarriers = {
        1: 'عقلك سيحاول أن يختبرك برغبة مفاجئة في التصفح أو تفويت الصلاة بدعوى التعب. اكسر هذا الصوت فوراً بحركة بدنية سريعة والوضوء.',
        2: 'حاجز الـ 40% سيظهر في منتصف تمرينك أو أثناء عملك العميق حين تشعر برغبة في ترك المهمة قبل نهايتها بربع ساعة. اضغط على نفسك وأكملها للنهاية.',
        3: 'حاجز الفراغ والشعور بالوحدة في وضع الشبح. استبدل هذا الفراغ بذكر الله وقراءة ورد القرآن والتركيز في تطوير مهاراتك.',
        4: 'حاجز الغرور والتهاون في الأمتار الأخيرة. حارب هذا التهاون بالتواضع أمام الله وتذكر من أين بدأت في اليوم الأول.'
      };

      const phasePrayers = {
        1: 'المحافظة على صلاة الفجر والعصر في وقتها: تروية الفص الجبهي في السجود تمنحك إرادة حديدية لمقاومة الشهوات طوال ساعات اليوم.',
        2: 'إطالة الركوع والسجود لتنشيط العصب الحائر وتخفيض ضغط الدم والتوتر: «أرحنا بها يا بلال» ليست شعاراً بل علاجاً عصبياً حقيقياً.',
        3: 'صلاة قيام الليل ولو بركعتين مع الوتر: هذا هو الوقود السري الذي يمنحك هيبة وصفاءً ذهنياً لا يملكه من ينام ملء جفنيه.',
        4: 'استحضار عظمة الله في كل ركعة وشكره على نعمة الثبات؛ الصلاة هي حبل النجاة الذي يضمن استمرار هذا التحول للأبد.'
      };

      return {
        day: d,
        code: 'DAY-' + String(d).padStart(3, '0'),
        phaseId: phaseId,
        phaseName: phaseInfo.name,
        phaseRange: phaseInfo.range,
        phaseBadge: phaseInfo.badge,
        title: 'اليوم ' + d + ': ' + theme.title,
        slap: phaseSlaps[phaseId],
        tactical: theme.mission,
        barrier: phaseBarriers[phaseId],
        prayer: phasePrayers[phaseId],
        mirror: 'هل كنت صادقاً مع نفسك اليوم بنسبة 100% في صلاتك وتدريبك وعملك، أم قدمت أعذاراً لم تكن لتقبلها من غيرك؟'
      };
    }
  };


  // 🔱 BULK & ROOTING COMMAND ENGINE CONFIGURATION
  const BULK_FOODS = {
    bread: { name: 'رغيف بلدي', cal: 260, pro: 8.5, unit: 'رغيف' },
    rice: { name: 'أرز مصري مطبوخ', cal: 130, pro: 2.7, unit: 'مغرفة (100g)' },
    pasta: { name: 'مكرونة مسلوقة', cal: 155, pro: 5.5, unit: 'مغرفة (100g)' },
    gizzards: { name: 'قوانص فراخ', cal: 150, pro: 26.0, unit: 'حصة (100g)' },
    milk: { name: 'لبن كامل الدسم', cal: 150, pro: 8.0, unit: 'مج (250ml)' },
    peanut: { name: 'فول سوداني / زبدة', cal: 170, pro: 7.5, unit: '2 ملعقة ك' },
    batata: { name: 'بطاطا مشوية', cal: 160, pro: 3.0, unit: 'حبة متوسطة' },
    eggs: { name: 'بيض مسلوق/مقلي', cal: 75, pro: 6.5, unit: 'بيضة' }
  };

  const WORKOUT_SPLITS = {
    upper_a: {
      title: 'Upper A — الدفع والسحب العلوي الثقيل (Heavy Upper Anchor)',
      notes: 'تركيز على التثبيت الجذري للأطراف الطويلة (185 سم)، قبضة مريحة، ثبات الجذع، وعدم قفل المفاصل لحماية الأوتار مع الأيزوتريتينوين.',
      exercises: [
        { name: 'Incline Dumbbell Press (تجميع مائل بالدمبل)', sets: '3', reps: '6-8', rir: '1-2', rest: '2-3 دقائق', cue: 'دكة مائلة 30 درجة، كتم النفس والبطن مشدودة (IAP)، هبوط بطيء 3 ثوانٍ' },
        { name: 'Lat Pulldown (سحب عالي قبضة محايدة)', sets: '3', reps: '6-8', rir: '1-2', rest: '2-3 دقائق', cue: 'سحب بالمرفقين لأسفل، تثبيت الفخذين بقوة تحت المسند، ثبات الجذع' },
        { name: 'Seated Cable Row (سحب أرضي كابل)', sets: '3', reps: '8-10', rir: '1-2', rest: '2 دقيقة', cue: 'جذع عمودي ثابت، سحب نحو السرة وعصر اللاتس في القمة' },
        { name: 'Dumbbell Lateral Raise (رفرفة جانبي دمبل)', sets: '3', reps: '12-15', rir: '1', rest: '90 ثانية', cue: 'ميل خفيف بالجذع للأمام، رفع من الكوع وليس الكف' },
        { name: 'Incline Dumbbell Curl (بايسبس دمبل دكة مائلة)', sets: '3', reps: '10-12', rir: '1', rest: '90 ثانية', cue: 'إطالة كاملة في الأسفل بدون أرجحة، عصر البايسبس في القمة' },
        { name: 'Cable Triceps Pushdown (ترايسبس كابل مستقيم/حبل)', sets: '3', reps: '10-12', rir: '1', rest: '90 ثانية', cue: 'تثبيت المرفقين بجانب الجذع تماماً وعزل التراي' }
      ]
    },
    lower_a: {
      title: 'Lower A — التجذير الأرضي والسكوات والكرات الثقيلة (Heavy Rooting)',
      notes: 'علاج خفة الكتلة على الأرض: رفع الكعبين 2 سم في السكوات، تثبيت مثلث القدم (Tripod Foot)، مشي المزارع الثقيل لزيادة الكثافة العضلية.',
      exercises: [
        { name: 'Heel-Elevated Goblet / Barbell Squat (سكوات بكعب مرفوع)', sets: '3', reps: '6-8', rir: '2', rest: '3 دقائق', cue: 'كعب مرفوع 2 سم، ركبتان للخارج باتجاه الأصابع، نزول عميق تحت التوازي، صدر مرفوع' },
        { name: 'Romanian Deadlift (RDL ديدلفت روماني بالبار)', sets: '3', reps: '8-10', rir: '2', rest: '2-3 دقائق', cue: 'دفع الحوض للخلف كأنك تقفل باباً بمؤخرتك، بار ملامس للساقين، أوتار ركبة مشدودة' },
        { name: 'Leg Press (مكبس أرجل قدم عريضة)', sets: '3', reps: '10-12', rir: '1-2', rest: '2 دقيقة', cue: 'قدمان في منتصف المنصة بعرض الكتفين، عدم قفل الركبة في الأعلى' },
        { name: 'Lying Leg Curl (خلفيات فخذ جهاز نائم)', sets: '3', reps: '10-12', rir: '1', rest: '90 ثانية', cue: 'تثبيت الحوض على البنش، نزول في 3 ثوانٍ' },
        { name: 'Farmer\'s Walk (مشي المزارع بدمبلين ثقال)', sets: '3 جولات', reps: '30-40 متر', rir: 'فشل قبضة', rest: '2 دقيقة', cue: 'أثقل دمبل تقدر عليه، خطوات بطيئة متزنة، الصدر مرفوع والبطن متحجرة' },
        { name: 'Standing Calf Raise (سمانة واقف)', sets: '4', reps: '12-15', rir: '1', rest: '60 ثانية', cue: 'توقف ثانيتين في أقصى إطالة بالأسفل وثانية في القمة' }
      ]
    },
    upper_b: {
      title: 'Upper B — الضخ الحجمي، سحب الصدر، والأكتاف (Hypertrophy & Width)',
      notes: 'تركيز على زيادة المدى الحركي وإطالة العضلة تحت الحمل (Stretch-mediated hypertrophy) لبناء عرض وثخانة حقيقية.',
      exercises: [
        { name: 'Flat Barbell / DB Bench Press (بنش برس مستوي)', sets: '3', reps: '8-10', rir: '1-2', rest: '2-3 دقائق', cue: 'تقويس خفيف طبيعي للظهر، لوحي الكتف مثبتين للخلف ولأسفل، عصر الصدر' },
        { name: 'Chest-Supported T-Bar / DB Row (سحب بالدمبل مسنود للصدر)', sets: '3', reps: '8-10', rir: '1-2', rest: '2 دقيقة', cue: 'عزل أسفل الظهر تماماً والتركيز على منتصف وأعلى الظهر' },
        { name: 'Overhead Shoulder Press (كتف دمبل جالس)', sets: '3', reps: '8-10', rir: '1-2', rest: '2 دقيقة', cue: 'دكة بزاوية 75-80 درجة لحماية مفصل الكتف، دفع عمودي قوي' },
        { name: 'Cable Lateral Raise (رفرفة جانبي كابل خلف الجسم)', sets: '3', reps: '12-15', rir: '0-1', rest: '60 ثانية', cue: 'مقاومة مستمرة طوال المدى الحركي لإشعال الرأس الجانبي' },
        { name: 'Face Pulls with Rope (فيس بول بالحبل لأعلى)', sets: '3', reps: '15-20', rir: '1', rest: '60 ثانية', cue: 'سحب باتجاه الجبهة وتدوير خارجي للكتف الخلفي وصحة المفصل' },
        { name: 'Hammer Curls + Skull Crushers (سوبر سيت باي هامر وتراي)', sets: '3', reps: '10-12', rir: '1', rest: '90 ثانية', cue: 'سماكة الذراع ومفاصل الكوع' }
      ]
    },
    lower_b: {
      title: 'Lower B — القوة المركزية، حمل الأوزان الأحادية، وثبات الحوض (Anti-Fall Armor)',
      notes: 'بناء درع منع السقوط: تمرين أرجحية الرجل الواحدة (Bulgarian) يمنع الاختلال الحركي ويقوي مثبتات الحوض والركبة للأطراف الطويلة.',
      exercises: [
        { name: 'Bulgarian Split Squat (سكوات بلغاري دمبل)', sets: '3 لكل رجل', reps: '8-10', rir: '1-2', rest: '2 دقيقة', cue: 'ميل خفيف بالجذع للأمام، النزول حتى تلامس الركبة الخلفية الأرض' },
        { name: 'Zercher Squat / Carry (زيرشر سكوات أو حمل بالذراعين)', sets: '3', reps: '6-8 أو 30م', rir: '2', rest: '2-3 دقائق', cue: 'البار في تجويف المرفقين، يجبر الجذع والبطن على الصمود الصلب' },
        { name: 'Leg Extension (أمامي جهاز كوادز)', sets: '3', reps: '12-15', rir: '1', rest: '90 ثانية', cue: 'توقف ثانية في قمة الانقباض، نزول بطيء في 3 ثوانٍ' },
        { name: 'Seated Leg Curl (خلفيات جالس)', sets: '3', reps: '10-12', rir: '1', rest: '90 ثانية', cue: 'إطالة قصوى لأوتار الركبة مع تثبيت الفخذين' },
        { name: 'Suitcase Carry (مشي الشنطة بدمبل فردي)', sets: '3 لكل جهة', reps: '30 متر', rir: 'ثبات الجذع', rest: '90 ثانية', cue: 'حمل دمبل في يد واحدة دون أي ميلان في الجذع، يقوي عضلات الخصر والمثبتات' },
        { name: 'Standing Calf Raise (سمانة واقف وزن ثقيل)', sets: '4', reps: '10-12', rir: '1', rest: '60 ثانية', cue: 'قوة وتر أخيل وثبات القدم على الأرض' }
      ]
    }
  };

    const RECIPES_DATA = {
    gizzards_meal: {
      name: 'طاسة قوانص الدجاج بالثوم والبطاطس',
      portions: { gizzards: 1, batata: 2, bread: 2 },
      cals: 780,
      pro: 45
    },
    mackerel_meal: {
      name: 'سمك ماكريل مشوي بالأرز المصري',
      portions: { rice: 2, bread: 1 },
      cals: 820,
      pro: 48
    },
    koshary_meal: {
      name: 'الكشري المصري العضلي المتكامل',
      portions: { rice: 2, pasta: 2 },
      cals: 750,
      pro: 32
    }
  };


  // 🥋 POSTURE & NECK ARCHITECTURE CONFIGURATION
  const POSTURE_STEPS = [
    {
      minute: 1,
      name: 'Chin Tucks (دفع الذقن وعصر الرقبة الخلفية)',
      badge: 'المرحلة 1 من 5 • دقيقة 1',
      cue: 'ادفع ذقنك للخلف باعتدال كأنك تصنع ذقناً مزدوجاً (Double Chin) وعصر عضلات الرقبة الخلفية 15 مرة. يصحح انحناء الرأس للأمام (Nerd Neck) ويبرز خط الفك.',
      visualText: 'Chin Tucks (15 تكرار)'
    },
    {
      minute: 2,
      name: 'Wall Angels (فرد الأكتاف على الحائط)',
      badge: 'المرحلة 2 من 5 • دقيقة 2',
      cue: 'الصق ظهرك وكتفيك ومرفقيك بالحائط، وحرك ذراعيك لأعلى ولأسفل ببطء 15 مرة مع عصر لوحي الكتف. يعالج انحناء الأكتاف ويفتح القفص الصدري.',
      visualText: 'Wall Angels (عصر لوحي الكتف)'
    },
    {
      minute: 3,
      name: 'Thoracic Extension & Chest Opener (تمديد الصدر وأعلى الظهر)',
      badge: 'المرحلة 3 من 5 • دقيقة 3',
      cue: 'ضع ساعديك على إطار الباب وتقدم خطوة للأمام لتمديد عضلة الصدر وإرجاع الكتفين لمكانهما الطبيعي. تنفس بعمق من البطن.',
      visualText: 'تمديد الصدر وفتح الشاسيه'
    },
    {
      minute: 4,
      name: 'Isometric Neck Holds (مقاومة الرقبة المحورية)',
      badge: 'المرحلة 4 من 5 • دقيقة 4',
      cue: 'ضع كفك على جبهتك وقاوم رأسك للأمام 10 ثوانٍ، ثم اليمين، ثم الشمال، ثم من الخلف. يثبت ويثخن عضلات الرقبة لإعطاء هيبة محاربة.',
      visualText: 'مقاومة الرقبة 4 اتجاهات'
    },
    {
      minute: 5,
      name: 'Tripod Rooting & Military Stature (وقفة الهيبة العسكرية)',
      badge: 'المرحلة 5 من 5 • دقيقة 5',
      cue: 'قف كالجندي: ثبت مثلث القدم في الأرض، اسحب البطن للداخل، ارفع القفص الصدري، وانظر للأفق. هذه هي وقفتك الطبيعية التي ستملأ بها المكان.',
      visualText: 'الوقوف الصخري والتجذير'
    }
  ];

  // 📸 GHOST VAULT 8 MILESTONES CONFIGURATION
  const VAULT_MILESTONES = [
    { key: 'w0', week: 0, day: 1, label: 'الأسبوع 0 (نقطة البداية 60 كجم)', targetKg: 60.0, desc: 'تسجيل نقطة البداية قبل بدء الـ Winter Arc' },
    { key: 'w2', week: 2, day: 15, label: 'الأسبوع 2 (كسر الانسداد)', targetKg: 61.0, desc: 'بداية تجاوب الجهاز الهضمي والشهية' },
    { key: 'w4', week: 4, day: 30, label: 'الأسبوع 4 (نهاية الصدمة)', targetKg: 62.5, desc: 'تعافي الدوبامين واستقرار الأوزان' },
    { key: 'w8', week: 8, day: 60, label: 'الأسبوع 8 (سماكة الظهر والأكتاف)', targetKg: 65.0, desc: 'بداية ظهور الكتلة الحجرية وثقل الأرض' },
    { key: 'w12', week: 12, day: 90, label: 'الأسبوع 12 (نصف المعركة)', targetKg: 67.5, desc: 'نضارة الجلد واستقامة القامة الكاملة' },
    { key: 'w16', week: 16, day: 120, label: 'الأسبوع 16 (تصلب النسيج)', targetKg: 70.0, desc: 'تغير ملامح الفك وعرض الرقبة والهيبة' },
    { key: 'w20', week: 20, day: 150, label: 'الأسبوع 20 (اقتراب الهدف)', targetKg: 72.0, desc: 'تجاوز حاجز الـ 72 كجم بنقاء عضلي' },
    { key: 'w24', week: 24, day: 180, label: 'الأسبوع 24 (قمة التحول والصدمة)', targetKg: 74.0, desc: 'نهاية الاختفاء والظهور بهيئة غير قابلة للتعرف' }
  ];

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

    // Default State Factory (Preloaded with Omar's 180 Days Master Baseline)
    getDefaultData() {
      const baseDays = {"1": {"prayers": {"fajr": false, "dhuhr": false, "asr": true, "maghrib": true, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": "fallen", "habits": {"workout": true, "deepwork": true, "reading": true, "sleep_early": true, "habit_1794748098944": true, "habit_1794748134334": true, "water_diet": true, "habit_1794748170613": true, "habit_1794770224367": true, "habit_1794770261470": true, "habit_1794770280778": true, "habit_1794770242974": true}, "rating": 7, "satisfaction": "somewhat", "weather": "clear", "journal_today": "انا صحيت بدري ودا كويس وصليت بس مش ملتزم 100% ان شاء الله التزم بكرا واقرا لسا الطريق طويل بس انا مش هستسلم انا احسن واحد وواثق اني هتعافي منها اللعينة تلت سنين مستعبداني وواقف مكاني بس من النهاردة انا مش هقف ساكت ولما تنقح عليا مش هعملها وهغض البصر غصب عني ", "journal_goal": "صحيت بدري ودا كويس وصليت بس مش ملتزم 100% ان شاء الله التزم بكرا وجباتي حلوة شوية بس مش 100% لازم هدف ال 3500 سعرة ", "journal_feelings": "متحمس بس الحماس هيروح ف لازم يبقي قرار نابع اتالم عادي جدا دا الطبيعي اصل اي الي هيحصل افتكر ", "journal_honest": "عاوز انجز", "percent": 70, "updatedAt": 1794903957987, "azkar": {"morning": false, "evening": false}}, "2": {"prayers": {"fajr": true, "dhuhr": true, "asr": true, "maghrib": true, "isha": true}, "quran": {"read": true, "pages": "اول صفحة من البقره ", "note": ""}, "discipline": "adhered", "habits": {"sleep_early": true, "deepwork": true, "reading": true, "habit_1794770261470": true, "habit_1794770280778": true, "habit_1794772802679": true, "water_diet": true, "habit_1794748098944": true, "habit_1794770224367": true, "habit_1794770242974": true, "workout": true, "habit_1794748170613": true, "habit_1794748134334": true}, "rating": 10, "satisfaction": "yes", "weather": "sunny", "journal_today": "انا النهاردة انجزت كل الانجازات صليت الخمس فروض وكلت وجباتي و اتمرنت برجولة وبشدة و دش ساقع ونمت و معملتش ال وساخة و واتعلمت تثقيف النهاردة انجاز ", "journal_goal": "الي قربني صليت الخمس فروض وكلت وجباتي و اتمرنت برجولة وبشدة و دش ساقع ونمت و معملتش ال وساخة و واتعلمت تثقيف والي بعدني اني لسا متعمقتش ف الالم انا حاليا بغوص ف التحفيز فقط لسا الانضباط جاي ", "journal_feelings": "انا حاسس اني ماشي تمام طبعا الموضوع عشان جديد ف صعب وواثق ف ربنا انو مش هيضيع تعبي ", "journal_honest": "انا خايف لاقع ف الذنب بس والله ما هقف ساكت هحارب ويا انا يا انا ", "percent": 100, "updatedAt": 1794903965062, "azkar": {"morning": false, "evening": false}}, "3": {"prayers": {"fajr": false, "dhuhr": true, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": "adhered", "habits": {"habit_1794748170613": true, "habit_1794772802679": true, "ghad_basar": true, "water_diet": false, "calories_3500": true, "protein_target": true, "deepwork": true, "sleep_early": true, "habit_1794748098944": false, "habit_1794770224367": true, "habit_1794770242974": true, "habit_1794770280778": true, "authentic_self": true}, "rating": 5, "satisfaction": "no", "weather": "storm", "journal_today": "الصلاه عقلي كان بيقولي متصليش وانا طاوعتة ومصليتش اغلب الفروض وقلبت ف التلفون ومغضيتش البصر يوم سيئ بس انا عرفت الثغرة فين بس المهم ان انا ثابت معملتش وساخة ", "journal_goal": "اني مسمعش لعقلي اني اقعد اركز جامد وموضوع النوم اني لازم اقاوم ", "journal_feelings": "كلت كويس بس مش اوي يعني مش 3500 ", "journal_honest": "هغض البصر وهتمرن بشدة وهقرا وهستحمي بمية تلج ", "percent": 48, "updatedAt": 1795004150119, "azkar": {"morning": false, "evening": false}, "weight_kg": "59.8", "water_liters": 1, "calories_target": true, "deepwork_hours": 1}, "4": {"prayers": {"fajr": false, "dhuhr": false, "asr": true, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 5, "updatedAt": 1795008053896, "azkar": {"morning": false, "evening": false}}, "5": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "6": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "7": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "8": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "9": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "10": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "11": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "12": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "13": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133603, "azkar": {"morning": false, "evening": false}}, "14": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "15": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "16": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "17": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "18": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "19": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "20": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "21": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "22": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "23": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "24": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "25": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "26": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "27": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "28": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "29": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "30": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "31": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "32": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "33": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "34": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "35": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "36": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "37": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "38": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "39": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "40": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794931298597, "azkar": {"morning": false, "evening": false}}, "41": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "42": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "43": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "44": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "45": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "46": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "47": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "48": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "49": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "50": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "51": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "52": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "53": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "54": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "55": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "56": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "57": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "58": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "59": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "60": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "61": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "62": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "63": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "64": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "65": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "66": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "67": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "68": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "69": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "70": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "71": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "72": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "73": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "74": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "75": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "76": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "77": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "78": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133604, "azkar": {"morning": false, "evening": false}}, "79": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "80": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "81": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "82": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "83": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "84": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "85": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "86": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "87": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "88": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "89": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "90": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "91": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "92": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "93": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "94": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "95": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "96": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "97": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "98": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "99": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "100": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "101": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "102": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "103": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "104": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "105": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "106": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "107": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "108": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "109": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "110": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "111": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "112": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "113": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "114": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "115": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "116": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "117": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "118": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794906879530, "azkar": {"morning": false, "evening": false}}, "119": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "120": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794904350536, "azkar": {"morning": false, "evening": false}}, "121": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "122": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "123": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "124": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133605, "azkar": {"morning": false, "evening": false}}, "125": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "126": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "127": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "128": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "129": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "130": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "131": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "132": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794910276125, "azkar": {"morning": false, "evening": false}}, "133": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "134": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "135": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "136": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "137": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "138": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "139": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "140": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "141": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "142": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "143": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "144": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "145": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "146": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "147": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "148": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "149": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "150": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "151": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "152": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "153": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "154": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "155": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "156": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "157": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "158": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "159": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "160": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "161": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "162": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "163": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "164": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "165": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "166": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "167": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "168": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "169": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "170": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "171": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "172": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "173": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "174": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "175": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "176": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "177": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "178": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "179": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794734133606, "azkar": {"morning": false, "evening": false}}, "180": {"prayers": {"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}, "quran": {"read": false, "pages": "", "note": ""}, "discipline": null, "habits": {}, "rating": null, "satisfaction": null, "weather": null, "journal_today": "", "journal_goal": "", "journal_feelings": "", "journal_honest": "", "percent": 0, "updatedAt": 1794906907556, "azkar": {"morning": false, "evening": false}}};
      return {
        startDate: '2026-11-15',
        customHabits: [
          {
                    "id": "workout",
                    "label": "تمرين رياضي / جيم (Workout)",
                    "category": "الجسد",
                    "icon": "🏋️‍♂️"
          },
          {
                    "id": "deepwork",
                    "label": "العمل المركز على هدفي (Deep Work)",
                    "category": "المستقبل",
                    "icon": "🎯"
          },
          {
                    "id": "reading",
                    "label": "قراءة وتغذية العقل (30 دقيقة)",
                    "category": "العقل",
                    "icon": "📚"
          },
          {
                    "id": "water_diet",
                    "label": "شرب 3 لتر مياه + دايت نظيف",
                    "category": "الصحة",
                    "icon": "💧"
          },
          {
                    "id": "sleep_early",
                    "label": "نوم مبكر واستيقاظ منضبط",
                    "category": "الانضباط",
                    "icon": "⏰"
          },
          {
                    "id": "habit_1794748098944",
                    "label": "غض البصر",
                    "category": "الانضباط",
                    "icon": "⚡"
          },
          {
                    "id": "habit_1794748134334",
                    "label": "الاستحمام بماء بارد",
                    "category": "الجسد",
                    "icon": "⚡"
          },
          {
                    "id": "habit_1794748170613",
                    "label": "الصمت السكوت",
                    "category": "العقل",
                    "icon": "⚡"
          },
          {
                    "id": "habit_1794770224367",
                    "label": "احتياجي من السعرات 3500",
                    "category": "الجسد",
                    "icon": "⚡"
          },
          {
                    "id": "habit_1794770242974",
                    "label": "احتياج البروتين للالياف العضلية",
                    "category": "الجسد",
                    "icon": "⚡"
          },
          {
                    "id": "habit_1794770261470",
                    "label": "ممسكش التلفون واقعد اقلب وانا بشتغل",
                    "category": "الجسد",
                    "icon": "⚡"
          },
          {
                    "id": "habit_1794770280778",
                    "label": "اتصرف بطبيعتي",
                    "category": "الجسد",
                    "icon": "⚡"
          },
          {
                    "id": "habit_1794772802679",
                    "label": "نوم 8 ساعات",
                    "category": "الجسد",
                    "icon": "⚡"
          },
          {
                    "id": "authentic_self",
                    "label": "أتصرف بطبيعتي بثقة وبدون تصنع",
                    "category": "الهوية",
                    "icon": "🐺"
          },
          {
                    "id": "skin_shield",
                    "label": "درع البشرة والأيزوتريتينوين (مرطب + واقي شمس + دهون صحية)",
                    "category": "الصحة والجمال",
                    "icon": "🛡️"
          },
          {
                    "id": "posture_armor",
                    "label": "تمرين تصحيح القوام ودرع الرقبة والجاذبية (5 دقائق)",
                    "category": "الهيبة والقوام",
                    "icon": "👑"
          },
          {
                    "id": "ghost_silence",
                    "label": "صمت الشبح والاختفاء عن السوشيال ميديا (Ghost Mode)",
                    "category": "الانضباط والغموض",
                    "icon": "🥷"
          }
],
        bulkCommand: {
          profile: {
            startWeight: 60.0,
            targetWeightPhase1: 72.0,
            finalTargetWeight: 80.0,
            heightCm: 185
          },
          weightLogs: [
            { week: 0, day: 1, date: '2026-11-18', weight: 60.0, waistCm: 74, neckCm: 35.5, status: 'نقطة الانطلاق (Baseline)' }
          ],
          currentDaySplit: 'upper_a',
          exerciseLogs: {}
        },
        vaultPhotos: {},
        days: baseDays
      };
    }

    // Load Data from LocalStorage with Zero Data Loss Guarantee
    loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (!parsed.days || Object.keys(parsed.days).length === 0) {
            parsed.days = this.getDefaultData().days;
          }
          if (!parsed.startDate) parsed.startDate = '2026-11-15';
          if (!parsed.bulkCommand) {
            parsed.bulkCommand = this.getDefaultData().bulkCommand;
          }
          if (!parsed.vaultPhotos) {
            parsed.vaultPhotos = {};
          }
          
          // PRESERVE ALL USER HABITS
          if (!parsed.customHabits || !Array.isArray(parsed.customHabits) || parsed.customHabits.length === 0) {
            parsed.customHabits = this.getDefaultData().customHabits;
          } else {
            const defaultHabits = this.getDefaultData().customHabits;
            defaultHabits.forEach(defH => {
              if (!parsed.customHabits.some(h => h.id === defH.id || h.label === defH.label)) {
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
          prayers: { dhuhr: false, asr: false, maghrib: false, isha: false },
          sleep: { hours: 0, sunlight: false, quality: 'good' },
          skin: { moisturizer: false, sunscreen: false, roaccutane: false },
          posture_done: false,
          ghost_silence: false,
          bulkDaily: {
            calories: 0,
            protein: 0,
            portions: { bread: 0, rice: 0, pasta: 0, gizzards: 0, milk: 0, peanut: 0, batata: 0, eggs: 0 }
          },
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
      if (!day.sleep) day.sleep = { hours: 0, sunlight: false, quality: 'good' };
      if (!day.bulkDaily) day.bulkDaily = { calories: 0, protein: 0, portions: { bread: 0, rice: 0, pasta: 0, gizzards: 0, milk: 0, peanut: 0, batata: 0, eggs: 0 } };
      if (!day.skin) day.skin = { moisturizer: false, sunscreen: false, roaccutane: false };
      if (typeof day.posture_done !== 'boolean') day.posture_done = false;
      if (typeof day.ghost_silence !== 'boolean') day.ghost_silence = false;
      return day;
    }

    // Calculate Completion Percentage for a day
    calculatePercentage(dayNum) {
      const day = this.getDay(dayNum);
      let totalItems = 0;
      let completedItems = 0;

      // 1. Prayers (4 items - Fajr removed as requested)
      const prayers = ['dhuhr', 'asr', 'maghrib', 'isha'];
      prayers.forEach(p => {
        totalItems++;
        if (day.prayers && day.prayers[p]) completedItems++;
      });

      // 2. Quran: Removed as requested (not counted in completion)

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
      this.viewBulk = document.getElementById('view-bulk');
      this.viewVault = document.getElementById('view-vault');

      // Posture Coach Modal DOM
      this.postureModal = document.getElementById('posture-modal');
      this.btnClosePosture = document.getElementById('btn-close-posture');
      this.btnOpenPostureCoach = document.getElementById('btn-open-posture-coach');
      this.btnQuickTogglePosture = document.getElementById('btn-quick-toggle-posture');
      this.btnPostureStart = document.getElementById('btn-posture-start');
      this.btnPosturePause = document.getElementById('btn-posture-pause');
      this.btnPostureComplete = document.getElementById('btn-posture-complete');
      this.postureTimerText = document.getElementById('posture-timer-text');
      this.posturePhaseName = document.getElementById('posture-phase-name');
      this.postureStepTitle = document.getElementById('posture-step-title');
      this.postureStepBadge = document.getElementById('posture-step-badge');
      this.postureCueText = document.getElementById('posture-cue-text');
      this.postureCircle = document.getElementById('posture-circle');
      this.postureSecondsLeft = 300;
      this.postureTimerInterval = null;

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

      // Goggins Daily Dossier DOM Elements
      this.dossierSection = document.getElementById('codex-daily-dossier');
      this.dossierDaySelect = document.getElementById('dossier-day-select');
      this.dossierPrevBtn = document.getElementById('dossier-prev-btn');
      this.dossierNextBtn = document.getElementById('dossier-next-btn');
      this.dossierTodayBtn = document.getElementById('dossier-today-btn');
      this.btnOpenDailyCodex = document.getElementById('btn-open-daily-codex');
      this.btnPrayerScienceShortcut = document.getElementById('btn-prayer-science-shortcut');
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

      // Dossier Navigation Events
      if (this.dossierPrevBtn) {
        this.dossierPrevBtn.addEventListener('click', () => {
          if (this.activeDossierDay > 1) {
            this.setDossierDay(this.activeDossierDay - 1);
            this.sound.playTick();
          }
        });
      }
      if (this.dossierNextBtn) {
        this.dossierNextBtn.addEventListener('click', () => {
          if (this.activeDossierDay < TOTAL_DAYS) {
            this.setDossierDay(this.activeDossierDay + 1);
            this.sound.playTick();
          }
        });
      }
      if (this.dossierTodayBtn) {
        this.dossierTodayBtn.addEventListener('click', () => {
          this.setDossierDay(this.currentDay);
          this.sound.playChime();
        });
      }
      if (this.dossierDaySelect) {
        this.dossierDaySelect.addEventListener('change', (e) => {
          const d = parseInt(e.target.value, 10);
          if (d) {
            this.setDossierDay(d);
            this.sound.playTick();
          }
        });
      }
      if (this.btnOpenDailyCodex) {
        this.btnOpenDailyCodex.addEventListener('click', () => {
          this.switchTab('codex');
          this.setDossierDay(this.currentDay);
          const el = document.getElementById('codex-daily-dossier');
          if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
          }
        });
      }
      if (this.btnPrayerScienceShortcut) {
        this.btnPrayerScienceShortcut.addEventListener('click', () => {
          this.switchTab('codex');
          const el = document.getElementById('chapter-prayer');
          if (el) {
            setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
          }
        });
      }

      document.getElementById('btn-jump-today').addEventListener('click', () => {
        this.realWorldDay = this.calculateRealWorldDay();
        this.setDay(this.realWorldDay);
        this.sound.playTick();
      });

      // Sound Toggle
      // Force Refresh Cache Button
      const forceRefreshBtn = document.getElementById('btn-force-refresh-cache');
      if (forceRefreshBtn) {
        forceRefreshBtn.addEventListener('click', () => {
          if (confirm('هل ترغب في تفريغ الذاكرة المؤقتة (Cache) وإعادة تحميل التطبيق بالكامل؟')) {
            if ('caches' in window) {
              caches.keys().then(names => Promise.all(names.map(name => caches.delete(name)))).then(() => {
                if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
                  navigator.serviceWorker.getRegistrations().then(regs => {
                    Promise.all(regs.map(r => r.unregister())).then(() => {
                      window.location.reload(true);
                    });
                  });
                } else {
                  window.location.reload(true);
                }
              });
            } else {
              window.location.reload(true);
            }
          }
        });
      }

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

      // Daily Log: Quran Checkbox (Safeguarded if element removed)
      const quranCheck = document.getElementById('quran-checkbox-container');
      if (quranCheck) {
        quranCheck.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          if (!day.quran) day.quran = { read: false, pages: '', note: '' };
          day.quran.read = !day.quran.read;
          this.sound.playTick();
          this.onDayDataChanged();
        });
      }

      const quranPages = document.getElementById('quran-pages-input');
      if (quranPages) {
        quranPages.addEventListener('input', (e) => {
          const day = this.getDay(this.currentDay);
          if (!day.quran) day.quran = { read: false, pages: '', note: '' };
          day.quran.pages = e.target.value;
          this.debounceSave();
        });
      }

      // Circadian Sleep Widget
      document.querySelectorAll('.sleep-hour-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const h = parseInt(btn.dataset.hours, 10);
          const day = this.getDay(this.currentDay);
          if (!day.sleep) day.sleep = { hours: 0, sunlight: false, quality: 'good' };
          day.sleep.hours = day.sleep.hours === h ? 0 : h;
          if (day.habits) {
            day.habits['sunlight_anchor'] = (day.sleep.hours >= 8 && day.sleep.sunlight);
          }
          this.sound.playTick();
          this.onDayDataChanged();
        });
      });

      const sunlightBtn = document.getElementById('btn-sunlight-anchor');
      if (sunlightBtn) {
        sunlightBtn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          if (!day.sleep) day.sleep = { hours: 0, sunlight: false, quality: 'good' };
          day.sleep.sunlight = !day.sleep.sunlight;
          if (day.habits) {
            day.habits['sunlight_anchor'] = (day.sleep.hours >= 8 && day.sleep.sunlight);
          }
          this.sound.playTick();
          this.onDayDataChanged();
        });
      }

      document.querySelectorAll('.sleep-quality-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.dataset.quality;
          const day = this.getDay(this.currentDay);
          if (!day.sleep) day.sleep = { hours: 0, sunlight: false, quality: 'good' };
          day.sleep.quality = day.sleep.quality === q ? null : q;
          this.sound.playTick();
          this.onDayDataChanged();
        });
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

      // Daily Log: Body & Fuel (الوزن، 2850 سعرة تضخيم نظيف، 4L مياه، الدش البارد)
      const calTargetBtn = document.getElementById('btn-calories-target');
      if (calTargetBtn) {
        calTargetBtn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          day.calories_target = !day.calories_target;
          if (!day.habits) day.habits = {};
          day.habits['calories_bulk'] = day.calories_target;
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
          if (!day.habits) day.habits = {};
          day.habits['water_hydration'] = day.water_liters >= 4;
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
      
      // ==========================================
      // 🔱 BULK & ROOTING COMMAND EVENT LISTENERS
      // ==========================================
      document.querySelectorAll('.portion-card').forEach(card => {
        const food = card.dataset.food;
        const btnInc = card.querySelector('.btn-inc');
        const btnDec = card.querySelector('.btn-dec');

        if (btnInc) {
          btnInc.addEventListener('click', () => {
            const day = this.getDay(this.currentDay);
            if (!day.bulkDaily) day.bulkDaily = { calories: 0, protein: 0, portions: {} };
            if (!day.bulkDaily.portions) day.bulkDaily.portions = {};
            day.bulkDaily.portions[food] = (day.bulkDaily.portions[food] || 0) + 1;
            this.recalcBulkDaily(day);
            this.sound.playTick();
            this.onDayDataChanged();
            this.renderBulkView();
          });
        }

        if (btnDec) {
          btnDec.addEventListener('click', () => {
            const day = this.getDay(this.currentDay);
            if (!day.bulkDaily) day.bulkDaily = { calories: 0, protein: 0, portions: {} };
            if (!day.bulkDaily.portions) day.bulkDaily.portions = {};
            if ((day.bulkDaily.portions[food] || 0) > 0) {
              day.bulkDaily.portions[food]--;
              this.recalcBulkDaily(day);
              this.sound.playTick();
              this.onDayDataChanged();
              this.renderBulkView();
            }
          });
        }
      });

      const shakeBtn = document.getElementById('btn-quick-add-shake');
      if (shakeBtn) {
        shakeBtn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          if (!day.bulkDaily) day.bulkDaily = { calories: 0, protein: 0, portions: {} };
          if (!day.bulkDaily.portions) day.bulkDaily.portions = {};
          day.bulkDaily.portions.milk = (day.bulkDaily.portions.milk || 0) + 1;
          day.bulkDaily.portions.peanut = (day.bulkDaily.portions.peanut || 0) + 1;
          day.bulkDaily.portions.batata = (day.bulkDaily.portions.batata || 0) + 1;
          this.recalcBulkDaily(day);
          this.sound.playChime();
          this.confetti.burst();
          this.onDayDataChanged();
          this.renderBulkView();
        });
      }

      const resetPortionsBtn = document.getElementById('btn-reset-portions');
      if (resetPortionsBtn) {
        resetPortionsBtn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          if (day.bulkDaily) {
            day.bulkDaily.portions = { bread: 0, rice: 0, pasta: 0, gizzards: 0, milk: 0, peanut: 0, batata: 0, eggs: 0 };
            this.recalcBulkDaily(day);
            this.sound.playTick();
            this.onDayDataChanged();
            this.renderBulkView();
          }
        });
      }

      const saveWeighBtn = document.getElementById('btn-save-weekly-weigh');
      if (saveWeighBtn) {
        saveWeighBtn.addEventListener('click', () => {
          const kgInput = document.getElementById('input-saturday-weight');
          const waistInput = document.getElementById('input-saturday-waist');
          const kgVal = parseFloat(kgInput ? kgInput.value : '');
          const waistVal = parseFloat(waistInput ? waistInput.value : '') || null;
          const neckInput = document.getElementById('input-saturday-neck');
          const neckVal = parseFloat(neckInput ? neckInput.value : '') || null;

          if (!kgVal || isNaN(kgVal) || kgVal < 45 || kgVal > 120) {
            alert('يرجى إدخال وزن صحيح بين 45 و 120 كجم');
            return;
          }

          if (!this.data.bulkCommand) this.data.bulkCommand = this.getDefaultData().bulkCommand;
          if (!this.data.bulkCommand.weightLogs) this.data.bulkCommand.weightLogs = [];

          const currentWeekNum = Math.floor((this.currentDay - 1) / 7) + 1;
          const todayIso = new Date().toISOString().split('T')[0];

          this.data.bulkCommand.weightLogs.push({
            week: currentWeekNum,
            day: this.currentDay,
            date: todayIso,
            weight: kgVal,
            waistCm: waistVal,
            neckCm: neckVal,
            status: 'تسجيل سبت معتمد'
          });

          // Sync weight with day's weight
          const day = this.getDay(this.currentDay);
          day.weight_kg = String(kgVal);

          this.sound.playVictory();
          this.saveData();
          this.renderBulkView();
          if (kgInput) kgInput.value = '';
          if (waistInput) waistInput.value = '';
        });
      }

      document.querySelectorAll('.split-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const split = btn.dataset.split;
          if (!this.data.bulkCommand) this.data.bulkCommand = this.getDefaultData().bulkCommand;
          this.data.bulkCommand.currentDaySplit = split;
          this.sound.playTick();
          this.renderWorkoutSplit();
        });
      });

      document.querySelectorAll('.btn-add-recipe-portions').forEach(btn => {
        btn.addEventListener('click', () => {
          const recipeKey = btn.dataset.recipe;
          const recipe = RECIPES_DATA[recipeKey];
          if (recipe && recipe.portions) {
            const day = this.getDay(this.currentDay);
            if (!day.bulkDaily) day.bulkDaily = { calories: 0, protein: 0, portions: {} };
            if (!day.bulkDaily.portions) day.bulkDaily.portions = {};
            for (const [food, count] of Object.entries(recipe.portions)) {
              day.bulkDaily.portions[food] = (day.bulkDaily.portions[food] || 0) + count;
            }
            this.recalcBulkDaily(day);
            this.sound.playChime();
            this.onDayDataChanged();
            this.renderBulkView();
          }
        });
      });

      

      
      // ==========================================
      // 🧴 GLOW-UP ARCHITECTURE EVENT LISTENERS
      // ==========================================

      // 1. Skin & Roaccutane Shield
      document.querySelectorAll('.skin-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.dataset.skin;
          const day = this.getDay(this.currentDay);
          if (!day.skin) day.skin = { moisturizer: false, sunscreen: false, roaccutane: false };
          day.skin[type] = !day.skin[type];
          this.sound.playTick();
          this.onDayDataChanged();
          this.renderSkinCard(day);
        });
      });

      // 2. Posture Coach Trigger & Quick Toggle
      if (this.btnOpenPostureCoach) {
        this.btnOpenPostureCoach.addEventListener('click', () => {
          this.openPostureModal();
        });
      }
      if (this.btnClosePosture) {
        this.btnClosePosture.addEventListener('click', () => {
          this.closePostureModal();
        });
      }
      if (this.btnQuickTogglePosture) {
        this.btnQuickTogglePosture.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          day.posture_done = !day.posture_done;
          this.sound.playTick();
          if (day.posture_done) {
            this.sound.playChime();
            this.confetti.burst();
          }
          this.onDayDataChanged();
          this.renderPostureCard(day);
        });
      }

      // Posture Modal Controls
      if (this.btnPostureStart) {
        this.btnPostureStart.addEventListener('click', () => {
          this.startPostureTimer();
        });
      }
      if (this.btnPosturePause) {
        this.btnPosturePause.addEventListener('click', () => {
          this.pausePostureTimer();
        });
      }
      if (this.btnPostureComplete) {
        this.btnPostureComplete.addEventListener('click', () => {
          this.completePostureSession();
        });
      }

      // 3. Social Ghost Mode Silence Toggle
      const ghostBtn = document.getElementById('btn-ghost-silence');
      if (ghostBtn) {
        ghostBtn.addEventListener('click', () => {
          const day = this.getDay(this.currentDay);
          day.ghost_silence = !day.ghost_silence;
          this.sound.playTick();
          if (day.ghost_silence) {
            this.sound.playChime();
          }
          this.onDayDataChanged();
          this.renderGhostSilenceCard(day);
        });
      }

      // 4. Ghost Vault Comparison Selectors
      const selBefore = document.getElementById('vault-select-before');
      const selAfter = document.getElementById('vault-select-after');
      if (selBefore) {
        selBefore.addEventListener('change', () => this.updateVaultComparisonView());
      }
      if (selAfter) {
        selAfter.addEventListener('change', () => this.updateVaultComparisonView());
      }


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
      if (this.viewBulk) this.viewBulk.classList.toggle('active', tab === 'bulk');
      if (this.viewVault) this.viewVault.classList.toggle('active', tab === 'vault');

      if (tab === 'matrix') {
        this.renderMatrixView();
      } else if (tab === 'daily') {
        this.renderDailyView();
      } else if (tab === 'codex') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'bulk') {
        this.renderBulkView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'vault') {
        this.renderVaultView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }


    // Populate Dossier 180-day Dropdown
    initDossierSelect() {
      if (!this.dossierDaySelect || this.dossierDaySelect.children.length > 0) return;
      const frag = document.createDocumentFragment();
      for (let i = 1; i <= TOTAL_DAYS; i++) {
        const proto = GOGGINS_DOSSIER_ENGINE.getDayProtocol(i);
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = proto.title;
        frag.appendChild(opt);
      }
      this.dossierDaySelect.appendChild(frag);
    }

    // Set Active Dossier Day (independent of or synced with currentDay)
    setDossierDay(dayNum) {
      this.activeDossierDay = Math.min(Math.max(dayNum, 1), TOTAL_DAYS);
      this.renderDailyDossier();
    }

    // Render Daily Dossier Card in Codex
    renderDailyDossier() {
      if (!this.dossierSection) return;
      this.initDossierSelect();

      const dayNum = this.activeDossierDay || this.currentDay || 1;
      const proto = GOGGINS_DOSSIER_ENGINE.getDayProtocol(dayNum);

      const elMissionCode = document.getElementById('dossier-mission-code');
      const elMissionTitle = document.getElementById('dossier-mission-title');
      const elMorningSlap = document.getElementById('dossier-morning-slap-text');
      const elTactical = document.getElementById('dossier-tactical-text');
      const elBarrier = document.getElementById('dossier-barrier-text');
      const elPrayer = document.getElementById('dossier-prayer-text');
      const elMirror = document.getElementById('dossier-mirror-text');
      const elDayTitle = document.getElementById('dossier-day-title');
      const elPhaseTag = document.getElementById('dossier-phase-tag');

      if (elMissionCode) elMissionCode.textContent = 'BATTLE PROTOCOL • ' + proto.code;
      if (elMissionTitle) elMissionTitle.textContent = proto.title;
      if (elMorningSlap) elMorningSlap.textContent = proto.slap;
      if (elTactical) elTactical.textContent = proto.tactical;
      if (elBarrier) elBarrier.textContent = proto.barrier;
      if (elPrayer) elPrayer.textContent = proto.prayer;
      if (elMirror) elMirror.textContent = proto.mirror;
      if (elDayTitle) elDayTitle.textContent = 'اليوم ' + dayNum + ' من ' + TOTAL_DAYS;
      if (elPhaseTag) elPhaseTag.textContent = proto.phaseBadge;

      if (this.dossierDaySelect) {
        this.dossierDaySelect.value = String(dayNum);
      }

      if (this.dossierPrevBtn) {
        this.dossierPrevBtn.disabled = (dayNum <= 1);
        this.dossierPrevBtn.style.opacity = (dayNum <= 1) ? '0.4' : '1';
      }
      if (this.dossierNextBtn) {
        this.dossierNextBtn.disabled = (dayNum >= TOTAL_DAYS);
        this.dossierNextBtn.style.opacity = (dayNum >= TOTAL_DAYS) ? '0.4' : '1';
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

      // 4. Body & Fuel (الوزن، 2850 سعرة تضخيم نظيف، 4L مياه، الدش البارد)
      const calBtn = document.getElementById('btn-calories-target');
      if (calBtn) {
        const isCalDone = !!(day.calories_target || (day.habits && (day.habits['calories_bulk'] || day.habits['calories_3500'])));
        calBtn.classList.toggle('active', isCalDone);
      }

      // Circadian Sleep Widget Rendering
      if (day.sleep) {
        document.querySelectorAll('.sleep-hour-btn').forEach(btn => {
          const h = parseInt(btn.dataset.hours, 10);
          btn.classList.toggle('active', (day.sleep.hours || 0) === h || (h === 9 && (day.sleep.hours || 0) >= 9));
        });
        const sunlightBtn = document.getElementById('btn-sunlight-anchor');
        if (sunlightBtn) {
          sunlightBtn.classList.toggle('active', !!day.sleep.sunlight);
        }
        document.querySelectorAll('.sleep-quality-btn').forEach(btn => {
          btn.classList.toggle('active', day.sleep.quality === btn.dataset.quality);
        });
        const sleepDisplay = document.getElementById('sleep-display-val');
        if (sleepDisplay) {
          sleepDisplay.textContent = `${day.sleep.hours || 0} ساعات (${day.sleep.sunlight ? 'مع ضوء شمس ☀️' : 'بدون شمس'})`;
        }
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
    // GOGGINS DAILY DIRECTIVE ENGINE (180 DAYS)
    // Raw, real, no BS. Each day a unique message.
    // ==========================================
    getDailyDirective(dayNum) {
      const gogginsDirectives = {

        // DAY 1-10: PHASE 1 - Breaking the Shell
        1:  "اليوم الأول — STAY HARD. أنت وصلت للقاع. تمام. David Goggins وصل لـ 136 كيلو وفشل في كل حاجة. الفرق الوحيد بينك وبينه: هو قرر يتحرك. النهارده إنت بتتخذ نفس القرار. مفيش حماس، مفيش تحفيز — بس قرار حديدي.",
        2:  "اليوم التاني — مخك هيكذب عليك. هيقولك 'يوم واحد مش هيفرق'. ده مش مخك، دي الشهوة بتتكلم. Goggins قال: 'عقلك بيستسلم قبل جسمك بكتير.' اثبت مكانك وكمّل.",
        3:  "اليوم التالت — 3 أيام. ده إنجاز حقيقي لأن معظم الناس بتفشل في الأول 72 ساعة. مستقبلات الدوبامين في مخك بدأت تتعافى. الألم موقت، الندم أبدي.",
        4:  "اليوم الرابع — روح الجيم حتى لو مش حاسس بأي حاجة. الـ Goggins ما كانش بيتمرن لما يحب، كان بيتمرن عشان ده الشغل. 'تعمل الصح لأن ده الصح.'",
        5:  "اليوم الخامس — الصمت سلاح. لا تقول لحد إنك بتعمل إيه. Goggins ما كانش بيعلن، كان بيشتغل في الظلام. دع النتائج تتكلم عنك في الربيع.",
        6:  "اليوم السادس — النقاء مش بس امتناع، ده طاقة بتتجمع. كل يوم نظيف هو رصاصة أضافتها لمخزنك. متفضّيهاش.",
        7:  "الأسبوع الأول خلص — STAY HARD. 7 أيام من الصمت والعمل. التستوستيرون الطبيعي بقفز 45% بعد أسبوع من النقاء. استخدم الطاقة دي تحمل أوزان أثقل اليوم.",
        8:  "اليوم التامن — الصلاة مش رفاهية. هي الـ Accountability Mirror بتاعتك مع ربنا. كل صلاة بتسأل فيها: هل أنا بشتغل بجد؟ هل أنا محافظ على نفسي؟ خش الصلاة بجد.",
        9:  "اليوم التاسع — الدش البارد النهارده مش اختياري. لما تقف تحت الميه الباردة، مخك هيصرخ 'اخرج!'. ابقَ 2 دقيقة. ده تدريب إرادة، مش تدريب جسم.",
        10: "اليوم العاشر — 10 أيام. أنت في الـ 95% من الناس اللي بتستسلم قبل هنا. Goggins وصل لأكثر من 100 مرة وقف عندها. كل مرة استمر. إنت بتعلم نفس الشيء.",
        // DAY 11-20
        11: "اليوم الحداشر — الـ Calluses بتتبني. كل يوم بتتألم فيه ولا بتستسلم بيضيف مسماراً عقلياً جديداً. المسامير دي هي اللي هتجعلك تكمل لما يجي اليوم الـ 90.",
        12: "اليوم التناشر — Goggins قال: 'من أنت حين لا يراك أحد؟ هذا هو حجمك الحقيقي.' اليوم حين تكون لوحدك في الأوضة والإشارة موجودة، هتختار مين تبقى؟",
        13: "اليوم الثالت عشر — صلاة الفجر مش فيها أعذار. لا برودة، لا تعب. Goggins كان بيتمرن الساعة 3 الصبح في الشتاء. الصلاة أسهل من كده بمراحل.",
        14: "أسبوعان من النقاء — الضباب العقلي بدأ يتبدد. عينيك بقت أصفى، صوتك أعمق. الدوبامين الحقيقي بدأ يرجع. متسمحش لأي شيء يكسر اللي بنيته.",
        15: "اليوم الخمستاشر — نص الشهر الأول. اكتب في السجل بصدق: هل أنت أفضل من اليوم الأول؟ لو الإجابة آه، كمّل. لو لأ، شوف فين الكذب على نفسك.",
        16: "اليوم الستاشر — Goggins قال: 'الناس بتقول إنهم لا وقت عندهم. الحقيقة أن عندهم وقت للتلفزيون ولأفضل وقت للتليفون.' كم ساعة تليفون عملتها النهارده؟",
        17: "اليوم السباتاشر — اليوم ارفع أوزان أثقل من المرة اللي فاتت. المسافة الوحيدة بين جسمك دلوقتي والجسم اللي عايزه هي الـ Reps اللي لسه ما عملتهاش.",
        18: "اليوم التماناشر — أذكار الصباح مش تكرار فاضي. دي برمجة عقلية صباحية بتقول لمخك: أنا محمي، أنا قادر، أنا عبد لله مش عبد لشهوتي.",
        19: "اليوم التساتاشر — العشرين قريبة. 1 أيام وتكون ثلث الشهر الأول. الشخص اللي وصل هنا ماش في اتجاه صح. متقفش.",
        20: "اليوم العشرين — 20 يوم من الصمود. David Goggins وصل لليوم العشرين في تدريب SEAL وكان مكسور جسمياً. استمر لأن 'الآخرون يراقبون حتى لو لم تر أحداً.'",
        // DAY 21-30
        21: "21 يوم — المسارات العصبية القديمة بدأت تضعف. الـ Habit Loop بيتغير. لكن التغيير مش هيبقى ثابت لحد ما تعدي الـ 66 يوم (وليس 21 كما يُشاع). استمر.",
        22: "اليوم التنين واتنين — الـ 4% Rule: اقضِ 4% من يومك (تقريباً ساعة) في الألم الطوعي. تمرين، قراءة صعبة، تعلم مهارة جديدة. هذه الـ 4% تبني نسختك القادمة.",
        23: "اليوم التلاتة وعشرين — الصلاة بتقطع دورة الأفكار السلبية كل 2-4 ساعات. حين يبدأ الوسواس يشتد، قم فوراً وضّأ وصلِّ. ده مش هروب، ده تكتيك.",
        24: "اليوم الأربعة وعشرين — 4 ساعات Deep Work من غير تليفون هتصنع مستقبلك. 4 ساعات بالتليفون هتدمره. إنت بتختار كل يوم.",
        25: "اليوم الخمسة وعشرين — الصدق مع النفس هو أصعب تمرين. Goggins كان بيكتب قائمة بكل حاجة بيكرهها في نفسه ويحطها على المرآة. اليوم اكتب قائمتك.",
        26: "اليوم الستة وعشرين — 'Never finished' — Goggins. 4 أيام متبقية في الشهر الأول. مفيش راحة، مفيش احتفال قبل الـ 180.",
        27: "اليوم السبعة وعشرين — اليوم قاوم شيئاً تحبه اختياراً. امتنع عن أكل بتحبه، أو قاوم جلسة تليفون. 'التضحية الطوعية تبني الشخصية.'",
        28: "اليوم التمانية وعشرين — 4 أسابيع من العمل الصامت. الناس بيتسائلوا فين اختفيت. الإجابة: كنت بتحول نفسي بينما هم كانوا بيتكلموا عن الأحلام.",
        29: "اليوم التسعة وعشرين — غداً اليوم الثلاثون. استعد نفسياً لمرحلة جديدة أصعب وأثقل. ده مش تهديد، ده وعد. المرحلة القادمة هتكون حيث تتشكل.",
        30: "اليوم الثلاثون — PHASE 1 COMPLETE. شهر كامل عدّى وأنت صامد. Goggins قال: 'الشهر الأول فقط يثبت أنك جاد.' أنت أثبتت. المرحلة الحقيقية بتبدأ دلوقتي.",
        // DAY 31-60: PHASE 2 - THE FORGE
        31: "اليوم الواحد والتلاتين — مرحباً في المرحلة الثانية. 'The Forge.' هنا بيتميز الجاد من المتحمس. الحماس انتهى، ابدأ الميكانيكية.",
        32: "اليوم الاتنين والتلاتين — الـ Flatline هيجي. فترة ما بين اليوم 30 و60 بتبدو عادية جداً، من غير حماس، ومن غير إحساس بتغيير. ده مش فشل، ده إعادة تشبيك الدماغ. كمّل.",
        33: "اليوم التلاتة والتلاتين — اليوم زود وزن في الجيم. 5 كيلو إضافية على أي تمرين. 'You got to do it right now. Not tomorrow.'",
        34: "اليوم الأربعة والتلاتين — الصلاة بتنهى عن الفحشاء والمنكر (سورة العنكبوت). مش كلام ديني فقط، ده علم نفسي: الالتزام الديني بيرفع الـ Self-Control بشكل مقاس.",
        35: "اليوم الخمسة والتلاتين — 'Don't stop when you're tired. Stop when you're done.' هل اتعبت؟ تمام. اشتغل أكتر 20 دقيقة بعد التعب.",
        36: "اليوم الستة والتلاتين — اكتب قائمة بكل شيء ما أتعملش في آخر 7 أيام. ده مش للعقاب، ده للوضوح. ما يتقاش لا يتحسن.",
        37: "اليوم السبعة والتلاتين — النوم سلاح مش رفاهية. 8 ساعات نوم = 20% تحسن في الأداء الرياضي، 35% تحسن في الذاكرة. 'Recovery is part of the work.'",
        38: "اليوم التمانية والتلاتين — اليوم ابقَ جائعاً حرفياً لمدة 3 ساعات بين الوجبات. 'Intermittent discomfort keeps the mind sharp.'",
        39: "اليوم التسعة والتلاتين — Goggins وصل لليوم الأربعين في تدريب Navy SEAL بعد كسر 2 من عظام قدمه وكسر مائة ضلع من التعب. واصل. أنت عندك أقل من كده بكتير.",
        40: "اليوم الأربعين — الـ 40 day mark. إحصائياً أقل من 10% من الناس بتعدي هذا اليوم في أي تحدي جدي. أنت في العشرة بالمية الأوائل. دلوقتي.",
        41: "اليوم الواحد والأربعين — الصمت مش عزلة. الصمت تركيز. كل ساعة بتمضيها في محادثات بدون هدف هي ساعة مسروقة من مستقبلك.",
        42: "اليوم الاتنين والأربعين — 6 أسابيع من العمل. الناس بتبدأ تلاحظ. لا تتكلم، لا تشرح. ابسم وكمّل.",
        43: "اليوم التلاتة والأربعين — Accountability: اسأل نفسك كل يوم: 'هل الشخص اللي أنا بالمعايشة معاه اليوم كان كافياً؟' لو الإجابة لأ، تعرف اللي لازم تعمله بكرا.",
        44: "اليوم الأربعة والأربعين — الماء البارد في الصبح مش مجرد تمرين جسدي. الـ Cold Exposure بيرفع النورإبينفرين 300% وبيشغّل الفص الجبهي فوراً. 10 دقائق = يوم أوضح.",
        45: "اليوم الخمسة والأربعين — نص المرحلة الثانية. 'Never be satisfied.' — Goggins. الرضا المؤقت عدوك. العضلات بتكبر في عدم الراحة.",
        46: "اليوم الستة والأربعين — سورة التوبة: 'وقل اعملوا فسيرى الله عملكم.' ربنا شايف كل لحظة بتشتغل فيها في السر. ده وحده كافي.",
        47: "اليوم السبعة والأربعين — 'The only person you should try to be better than is the person you were yesterday.' كنت أحسن من امبارح؟",
        48: "اليوم التمانية والأربعين — تخيل اللي هتبقى عليه في اليوم الـ 180 لو اشتغلت بجد من دلوقتي. دلوقتي تخيل إنك وقفت. إيه الفرق؟ الفرق هو ده.",
        49: "اليوم التسعة والأربعين — 7 أسابيع. الجسم بيتغير فعلاً. العقل أوضح. الصلوات أعمق. الشغل أحسن. أنت في منطقة بناء حقيقية.",
        50: "اليوم الخمسين — 50 يوم من الصمود. إيه اللي بتقوله للنفس حين لا أحد يرى؟ Goggins بيقول: دي هي نفسك الحقيقية، مش الماسك اللي بتتظاهر بيه.",
        51: "اليوم الواحد والخمسين — الكسل عدو بيلبس ملابس التعب. تعرف عليه. لما تقول 'أنا تعبان'، اسأل: هل أنا فعلاً تعبان ولا بس خايف من الصعب؟",
        52: "اليوم الاتنين والخمسين — العمل الصامت يبني الثقة اللي لا أحد يقدر يسرقها. 'Confidence comes from doing the things you said you'd do.'",
        53: "اليوم التلاتة والخمسين — اقرأ أو استمع لشيء يتحداك فكرياً اليوم. العقل كالجسم، لو ما تدربتوش يضعف.",
        54: "اليوم الأربعة والخمسين — الـ Goggins كان بيستمع لـ'Who's Gonna Carry the Boats?' كل يوم قبل أصعب تمرين. إيه اللي بتسمعه إنت قبل تتمرن؟",
        55: "اليوم الخمسة والخمسين — ربنا بيحب المداومة على العمل الصالح حتى لو قل. 'أحب الأعمال إلى الله أدومها وإن قل.' — رواه البخاري. الاستمرارية فوق الكمية.",
        56: "اليوم الستة والخمسين — 8 أسابيع. لو عندك وجع قديم أو ألم جديد في الجيم، اشتغل حواليه مش منه. الإصابة بتوقفك، الألم بيبنيك.",
        57: "اليوم السبعة والخمسين — Goggins قال: 'الناس بتعتقد إن الموهبة تصنع النجاح. الموهبة بس بتفتح الباب. العمل هو اللي بيدخل.'",
        58: "اليوم التمانية والخمسين — كل صلاة عصر بتصليها في وقتها هي ركيزة في جدارك الحديدي. الجدار ما بيتبنيش بالأحلام، بيتبنى بحجر حجر.",
        59: "اليوم التسعة والخمسين — شهر كمان بكرا تتعدي الـ 60. 'The mind is the most powerful thing you possess. Train it like a muscle.'",
        60: "اليوم الستين — شهران كاملان. أنت فعلت ما يعجز عنه معظم البشر. لكن Goggins بيقول: 'Don't celebrate too long. The race is long.' كمّل.",
        // DAY 61-90
        61: "اليوم الواحد والستين — قاعدة الـ 1%: تحسن 1% كل يوم = 37 ضعف بعد سنة. الحساب المركب ده اللي Goggins بيتكلم عنه حين بيقول 'Never be finished.'",
        62: "اليوم الاتنين والستين — اكتب 3 انتصارات حققتها في الأيام الستين الماضية. ده مش للتفاخر، ده لتذكّر نفسك بأنك قادر.",
        63: "اليوم التلاتة والستين — الـ Accountability Mirror: انظر في عيونك في المرآة وقول بصوت عالٍ: 'أنا أقوى مما أعتقد.' 3 مرات. مش هبل، ده علم أعصاب.",
        64: "اليوم الأربعة والستين — الصلوات الخمس هي نظام الـ Check-in اليومي مع نفسك ومع ربنا. كل واحدة فرصة لإعادة ضبط النية والاتجاه.",
        65: "اليوم الخمسة والستين — 'You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.' — Goggins.",
        66: "اليوم الستة والستين — الـ 66 يوم! الأبحاث تثبت أن العادة الجديدة بتتثبت في المتوسط بعد 66 يوم (Phillippa Lally, UCL). أنت وصلت لنقطة التثبيت.",
        67: "اليوم السبعة والستين — اليوم ابقَ صامتاً أكثر من المعتاد. الصمت يوضح الأفكار ويقوي التركيز. كمّل شغلك بدون كلام زيادة.",
        68: "اليوم التمانية والستين — تذكر لماذا بدأت. مش الحماس، الحماس مات. لكن الـ Why، السبب الحقيقي خلف القرار. ده هو اللي بيكمّل.",
        69: "اليوم التسعة والستين — غداً اليوم الـ 70. ما وصلوش هنا إلا الجادين. 'Talent is a gift. Work ethic is a choice.'",
        70: "اليوم السبعين — 70 يوم من العمل الصامت. الفارق بينك وبين أي شخص كسول دلوقتي = 70 يوم من القرارات الصح. ده الفارق الحقيقي.",
        71: "اليوم الواحد والسبعين — الشيطان بيوسوس حين تكون في أضعف لحظاتك. متواجهوش بالتفكير. واجهه بالحركة. قوم واتحرك.",
        72: "اليوم الاتنين والسبعين — 'Some people pray in the rain. Some just get wet.' الصلاة بخشوع مش مجرد حركات جسمانية، هي تواصل حقيقي مع الله.",
        73: "اليوم التلاتة والسبعين — اليوم حاول تكمّل تمرينك بعد ما يقولك عقلك وقف. 10 تكرارات إضافية. هذه العشرة هي الـ 40% الباقية.",
        74: "اليوم الأربعة والسبعين — 'Don't have time?' Then quit watching TV, quit watching the news, quit social media. See how much time you found.' — Goggins.",
        75: "اليوم الخمسة والسبعين — ثلاثة أرباع المرحلة الثانية. الشهوات القديمة ضعفت فعلاً. مخك بقى أداة بتطيعك أكثر مما بتطيع الغرائز. استمر.",
        76: "اليوم الستة والسبعين — سجد وشكر الله على أنك مكملت لحد هنا. الشكر بيفتح أبواباً. الجاحد بيغلق أبواباً.",
        77: "اليوم السبعة والسبعين — اقرأ نصف صفحة من Can't Hurt Me أو استمع لأي Podcast لـ Goggins. اشحن نفسك بمن يفعل ما تريد.",
        78: "اليوم التمانية والسبعين — الـ Goggins لم يُولد قوياً. كان يتبوّل على نفسه من الخوف في الطفولة. القوة مش هبة، دي قرار متكرر.",
        79: "اليوم التسعة والسبعين — بكرا اليوم الـ 80. أي شخص وصل لـ 80 يوم ما وصل بالصدفة. وصل بقرارات يومية مؤلمة وصحيحة. انت ده.",
        80: "اليوم الثمانين — 'Most people quit during their most difficult moment. That's the worst time to quit.' لو اليوم كان صعب، ده بالظبط السبب إنك لازم تكمّل.",
        81: "اليوم الواحد والثمانين — 9 أيام على اليوم الـ 90. ابدأ تحضر نفسك. مش للاحتفال، لمرحلة أصعب جديدة.",
        82: "اليوم الاتنين والثمانين — العدالة الإلهية: 'إن الله لا يضيع أجر من أحسن عملاً.' كل جهد حقيقي بتبذله في السر، ربنا شايفه.",
        83: "اليوم التلاتة والثمانين — الألم اللي بتحس بيه في الجيم ده ألم بناء. الألم اللي كنت بتحس بيه في القاع كان ألم تدمير. اختر ألمك.",
        84: "اليوم الأربعة والثمانين — 12 أسبوع كامل. الجسم بيتغير بشكل واضح. العقل أحد. الروح أقرب لربنا. الثلاثة بيتبنوا مع بعض.",
        85: "اليوم الخمسة والثمانين — 5 أيام على الـ 90. 'Comfort zone is a beautiful place, but nothing ever grows there.'",
        86: "اليوم الستة والثمانين — Goggins لما عجزت قدمه في سباق 100 ميل، ربطها وكمّل الـ 70 ميل الباقية. مش بيقول اعمل كده. بيقول: قرارك أنت وحدك.",
        87: "اليوم السبعة والثمانين — اليوم اكتب خطاب قصير لنفسك في اليوم الـ 180. إيه اللي بتتمنى تكون حققته؟ ده مش حلم، ده خريطة.",
        88: "اليوم التمانية والثمانين — 'You are more than what you've allowed yourself to be.' أنت أكبر من كل محدودياتك القديمة.",
        89: "اليوم التسعة والثمانين — اليوم الأخير في مرحلة الصهر. استعد نفسياً. المرحلة الجاية مش أسهل، هي أعمق.",
        90: "اليوم التسعين — 90 يوم. الدوبامين بيتعافى بنسبة 80%. الجسم تغير. العقل حاد. الروح أنقى. PHASE 2 COMPLETE. الوحش بدأ يتشكل.",
        // DAY 91-150: PHASE 3 - HARDENING
        91: "اليوم الواحد والتسعين — PHASE 3: THE HARDENING. الانضباط مش هيبقى مجهود تاني. هيبقى هويتك. ده هو الفرق الحقيقي بين المرحلة دي وما قبلها.",
        92: "اليوم الاتنين والتسعين — 'Some of you want something you've never had, but you're not willing to do something you've never done.' اليوم اعمل شيئاً لم تعمله من قبل.",
        93: "اليوم التلاتة والتسعين — الـ Goggins قرر يصبح Navy SEAL في 3 أشهر رغم إنه كان مستحيل بالمقاييس العادية. القرار الجامد يفوق الموهبة دايماً.",
        94: "اليوم الأربعة والتسعين — الصلاة في السجود زي مش عادي. الدم بيتدفق للمخ 7-10% أكثر. كل سجدة بتعطيك وضوحاً فكرياً حرفياً. استغل السجود.",
        95: "اليوم الخمسة والتسعين — 'Everything in life is a mind game.' — Goggins. مشكلتك مش الجسم، مشكلتك في الـ Self-Talk. ابدأ تتكلم لنفسك بكلام محارب.",
        96: "اليوم الستة والتسعين — الغرور أخطر مرحلتك دلوقتي. Goggins حذّر من الـ Comfort Zone المقنّع بالإنجاز. 'Stay paranoid. Stay hungry.'",
        97: "اليوم السبعة والتسعين — هل تعمل بجد حتى في الأيام التي لا تشعر بالرغبة؟ لو آه، أنت تبني هوية. لو لأ، أنت بتكرر عادة.",
        98: "اليوم التمانية والتسعين — كمّل في الصمت. لا Stories، لا تبرير، لا شرح. العالم سيرى النتائج في اليوم الـ 180.",
        99: "اليوم التسعة والتسعين — غداً المائة. لا تتوقف. 'The most dangerous phrase in the language is we've always done it this way.' غيّر، طور، ثمّن.",
        100: "اليوم المائة — 100 يوم من الالتزام الحقيقي. أنت في نادي النخبة دلوقتي. 'The best view comes after the hardest climb.' حتى لو لم تر النتائج بعد.",
        101: "اليوم المية وواحد — 'Pain unlocks a secret doorway in the mind.' كل إحساس بالوجع في التدريب هو مفتاح لطبقة أعمق من قوتك.",
        110: "اليوم المية وعشرة — أنت تتجاوز معظم الناس الآن بمسافات ضخمة. ما تشوفش النتائج دايماً لكن التغيير تحت السطح ضخم جداً.",
        120: "اليوم المية وعشرين — 4 أشهر. الناس بيلاحظوا. صوتك أعمق، هيبتك أكبر، جسدك أقوى. ده مش انطباع، ده تغيير حقيقي في الكيمياء والهرمونات.",
        130: "اليوم المية وتلاتين — 'Don't stop when it's hard. Stop when you're done.' هل خلصت؟ لأ. كمّل.",
        140: "اليوم المية وأربعين — 'The only way you can grow is if you get comfortable with the uncomfortable.' الراحة عدوك في هذه المرحلة.",
        150: "اليوم المية وخمسين — PHASE 3 COMPLETE. أنت في الـ 1% العالمية دلوقتي. شهر واحد باقي. ما تقفش عند 150. العودة للقمة من 150 أسهل من الوصول للـ 180 من الصفر.",
        // DAY 151-180: PHASE 4 - EMERGENCE
        151: "اليوم المية وواحد وخمسين — PHASE 4: EMERGENCE. الشهر الأخير. أصعب شهر لأن الإغراء الأكبر هو التوقف والاحتفال مبكراً. لا توقف.",
        160: "اليوم المية وستين — 20 يوماً فقط. تخيل إنك وقفت الآن. تخيل الندم. تخيل إنك كملت. الفرق هذا — اختره.",
        170: "اليوم المية وسبعين — 10 أيام. في هذه اللحظة، أنت أقرب للنسخة اللي تريدها من أي وقت مضى. لا تبيعها عشان 10 أيام.",
        175: "اليوم المية وخمسة وسبعين — 5 أيام. 'When you think you're done, you're only 40% done.' — Goggins. اللمسة الأخيرة هي الأهم.",
        178: "اليوم المية وثمانية وسبعين — يومين. لا نوم قبل الميعاد، لا تهاون، لا 'خلاص فرقت'. اكمل بالمعيار الأعلى.",
        179: "اليوم المية وتسعة وسبعين — غداً اليوم الأخير. هيجيلك وسواس إنك 'خلصت'. أنت لم تخلص. الـ 180 هي البداية مش النهاية.",
        180: "اليوم المية وثمانين — STAY HARD. الرحلة ما انتهتش، تحولت. من انتكاس وقاع لبناء وصهر لتصلب لظهور. أنت الآن شخص آخر تماماً. لكن Goggins يقول: هذا فقط هو البداية الحقيقية. Never finished."
      };

      if (gogginsDirectives[dayNum]) {
        return gogginsDirectives[dayNum];
      }

      // Phase-based pool for days not explicitly defined
      const phase1Pool = [
        "STAY HARD — اثبت مكانك. الكسل بيتكلم بصوت الراحة والعذر. الفص الجبهي بيعيد بناء نفسه. كمّل.",
        "الماء البارد الصبح رسالة لمخك: أنا القائد والجسد بيطيع. لا تفاوض. لا تدفئة أول.",
        "النظرة الأولى عليك، والثانية عليك أنت. احمِ عقلك زي ما بتحمي موبايلك من الكسر.",
        "Goggins بيقول: 'المشكلة مش مشكلتك — ردة فعلك على المشكلة هي المشكلة.' كيف ترد اليوم؟",
        "الـ 3500 سعرة والبروتين مش رفاهية. دي وقود الوحش اللي بتبنيه.",
        "كل تكرار في الجيم هو رد على كل سنة ضايعة. الحساب بيتسدد تكرار تكرار.",
        "الصلاة حصن. بدونها عارٍ أمام وساوس نفسك. بيها محمي ومتصل بأقوى قوة في الكون."
      ];
      const phase2Pool = [
        "4 ساعات Deep Work من غير تليفون تساوي مستقبلك كله. 4 ساعات بالتليفون تبيعه.",
        "العضلات بتكبر في الصمت والتعب والوقود الصح. مش في الكلام والتفاخر.",
        "النقاء طاقة متجمعة. كل يوم نظيف هو صاروخ إضافي في وجهتك.",
        "المعاناة المؤقتة في الانضباط أهون من ألم الندم الأبدي لمن عاش كسولاً.",
        "لا تتكلم عن أحلامك. اشغل الوقت ده في تنفيذها. النتائج هي الكلام.",
        "القوة العقلية بتتبني حين تستمر في يوم ما تحب فيه تقوم من السرير."
      ];
      const phase3Pool = [
        "الانضباط بقى هويتك. مش مجهود، هوية. الفرق هذا يغير كل شيء.",
        "لا تقف. في الـ Goggins Method مفيش 'خلصت'. في دايماً مستوى تاني.",
        "الغرور أخطر أعدائك دلوقتي. ابقَ جائعاً. ابقَ متواضعاً. ابقَ شاكراً.",
        "أنت مش اللي بدأ هذه الرحلة. ده شخص أضعف. الشخص الحالي أقوى.",
        "كل صلاة في وقتها هي انتصار صغير يُضاف لرصيدك اليومي."
      ];
      const phase4Pool = [
        "العد التنازلي للظهور. كمّل بأعلى معيار. اللمسة الأخيرة هي الأهم.",
        "مفيش احتفال قبل الـ 180. بعده ابدأ الـ 180 الجديدة.",
        "ثبّت العادات الجديدة كأسلوب حياة أبدي، مش كتحدي وخلاص.",
        "STAY HARD. ده مش مجرد شعار، ده طريقة حياة حتى اليوم الأخير."
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


        // ==========================================
    // 🔱 BULK & ROOTING COMMAND CORE METHODS
    // ==========================================
    recalcBulkDaily(day) {
      if (!day.bulkDaily) day.bulkDaily = { calories: 0, protein: 0, portions: {} };
      if (!day.bulkDaily.portions) day.bulkDaily.portions = {};
      let totalCal = 0;
      let totalPro = 0;
      for (const [foodKey, count] of Object.entries(day.bulkDaily.portions)) {
        const item = BULK_FOODS[foodKey];
        if (item && count > 0) {
          totalCal += item.cal * count;
          totalPro += item.pro * count;
        }
      }
      day.bulkDaily.calories = Math.round(totalCal);
      day.bulkDaily.protein = Math.round(totalPro * 10) / 10;

      // Automatically sync with daily habits & fuel target
      day.calories_target = totalCal >= 2850;
      if (!day.habits) day.habits = {};
      day.habits['calories_bulk'] = totalCal >= 2850;
      day.habits['calories_3500'] = totalCal >= 2850;
      day.habits['protein_target'] = totalPro >= 135;
    }

    renderBulkView() {
      if (!this.data.bulkCommand) this.data.bulkCommand = this.getDefaultData().bulkCommand;
      const cmd = this.data.bulkCommand;
      const day = this.getDay(this.currentDay);

      // 1. Current Weight & Mass Density
      let latestWeight = 60.0;
      if (cmd.weightLogs && cmd.weightLogs.length > 0) {
        latestWeight = cmd.weightLogs[cmd.weightLogs.length - 1].weight || 60.0;
      }
      if (day.weight_kg && !isNaN(parseFloat(day.weight_kg))) {
        latestWeight = parseFloat(day.weight_kg);
      }

      const heightM = 1.85;
      const currentDensity = (latestWeight / heightM).toFixed(1);

      const currWeightEl = document.getElementById('bulk-curr-weight');
      const densityDisplayEl = document.getElementById('density-val-display');
      const densityGaugeFillEl = document.getElementById('density-gauge-fill');

      if (currWeightEl) currWeightEl.textContent = `${latestWeight} كجم`;
      if (densityDisplayEl) {
        let densityStatus = 'كتلة خفيفة (خطر السقوط)';
        if (currentDensity >= 35 && currentDensity < 39) densityStatus = 'مرحلة التجذير والتصلب';
        else if (currentDensity >= 39) densityStatus = 'كتلة جبارة وارتكاز حديدي';
        densityDisplayEl.textContent = `${currentDensity} كجم/متر (${densityStatus})`;
      }
      if (densityGaugeFillEl) {
        const densityPct = Math.min(100, Math.max(10, Math.round(((currentDensity - 30) / (44 - 30)) * 100)));
        densityGaugeFillEl.style.width = `${densityPct}%`;
      }

      // 2. Portion Tracker UI
      const bulkDaily = day.bulkDaily || { calories: 0, protein: 0, portions: {} };
      const portions = bulkDaily.portions || {};

      document.querySelectorAll('.portion-card').forEach(card => {
        const food = card.dataset.food;
        const valSpan = card.querySelector('.portion-count-val');
        if (valSpan && portions) {
          valSpan.textContent = portions[food] || 0;
        }
      });

      const cals = bulkDaily.calories || 0;
      const pros = bulkDaily.protein || 0;

      const calsCountEl = document.getElementById('bulk-cals-count');
      const protCountEl = document.getElementById('bulk-prot-count');
      const calsBarEl = document.getElementById('bulk-cals-bar');
      const protBarEl = document.getElementById('bulk-prot-bar');

      if (calsCountEl) calsCountEl.textContent = `${cals} / 2850 kcal`;
      if (protCountEl) protCountEl.textContent = `${pros} / 135 g`;

      const calPct = Math.min(100, Math.round((cals / 2850) * 100));
      const proPct = Math.min(100, Math.round((pros / 135) * 100));

      if (calsBarEl) calsBarEl.style.width = `${calPct}%`;
      if (protBarEl) protBarEl.style.width = `${proPct}%`;

      // 3. Decision Advice Pill
      const decisionPill = document.getElementById('bulk-decision-pill');
      if (decisionPill) {
        const logs = cmd.weightLogs || [];
        if (logs.length >= 2) {
          const lastLog = logs[logs.length - 1];
          const prevLog = logs[logs.length - 2];
          const delta = (lastLog.weight - prevLog.weight).toFixed(2);
          const dVal = parseFloat(delta);
          if (dVal < 0.25) {
            decisionPill.innerHTML = `⚠️ <span>نصيحة المعايرة: الزيادة بطيئة (+${dVal} كجم) — زِد رغيف بلدي وملعقة فول سوداني (+200 سعرة)</span>`;
            decisionPill.style.borderColor = 'rgba(245, 158, 11, 0.4)';
          } else if (dVal <= 0.50) {
            decisionPill.innerHTML = `🎯 <span>نصيحة المعايرة: الزيادة في المنطقة الذهبية العضلية (+${dVal} كجم) — استمر بنفس الحصص تماماً!</span>`;
            decisionPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
          } else {
            decisionPill.innerHTML = `⚠️ <span>نصيحة المعايرة: زيادة سريعة (+${dVal} كجم) — دهون زائدة أو احتباس مائي! خفض ربع رغيف (-150 سعرة)</span>`;
            decisionPill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }
        } else {
          decisionPill.innerHTML = `💡 <span>نصيحة شجرة القرارات: سجّل وزنك كل سبت صباحاً قبل الإفطار للمعايرة التلقائية لمعدل الزيادة العضلية</span>`;
        }
      }

      // 4. Workout Split
      this.renderWorkoutSplit();

      // 5. Canvas Trendline Chart
      this.renderBulkChart();
    }

    renderWorkoutSplit() {
      const cmd = this.data.bulkCommand || this.getDefaultData().bulkCommand;
      const splitKey = cmd.currentDaySplit || 'upper_a';
      const splitData = WORKOUT_SPLITS[splitKey];
      if (!splitData) return;

      document.querySelectorAll('.split-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.split === splitKey);
      });

      const container = document.getElementById('workout-exercises-container');
      if (!container) return;

      let html = `
        <div style="margin-bottom: 1rem; padding: 0.85rem; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.06);">
          <h4 style="color: #38bdf8; font-size: 1rem; margin-bottom: 0.35rem; font-weight: 700;">${splitData.title}</h4>
          <p style="color: var(--text-dim); font-size: 0.85rem; line-height: 1.5; margin: 0;">${splitData.notes}</p>
        </div>
        <div class="exercise-cards-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
      `;

      splitData.exercises.forEach((ex, i) => {
        html += `
          <div class="exercise-item-card glass-panel" style="padding: 0.85rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.25);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="background: var(--accent-gold); color: #000; font-weight: 800; font-size: 0.8rem; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">${i + 1}</span>
                <span style="color: #fff; font-weight: 700; font-size: 0.95rem;">${ex.name}</span>
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.82rem;">
                <span style="color: var(--accent-gold); font-weight: 700;">${ex.sets} مجموعات</span>
                <span style="color: var(--text-dim);">•</span>
                <span style="color: #38bdf8; font-weight: 600;">${ex.reps} تكرار</span>
                <span style="color: var(--text-dim);">•</span>
                <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; padding: 2px 6px; border-radius: 4px;">RIR ${ex.rir}</span>
                <span style="color: var(--text-dim);">•</span>
                <span style="color: #94a3b8;">راحة ${ex.rest}</span>
              </div>
            </div>
            <div style="font-size: 0.82rem; color: #cbd5e1; background: rgba(255,255,255,0.02); padding: 0.5rem 0.75rem; border-radius: 6px; border-right: 3px solid var(--accent-gold);">
              <span style="color: var(--accent-gold); font-weight: 600;">⚡ تكنيك التجذير:</span> ${ex.cue}
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;
    }

    renderBulkChart() {
      const canvas = document.getElementById('bulk-weight-chart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 700;
      const h = canvas.height = 200;

      ctx.clearRect(0, 0, w, h);

      const paddingLeft = 45;
      const paddingRight = 30;
      const paddingTop = 25;
      const paddingBottom = 35;

      const chartW = w - paddingLeft - paddingRight;
      const chartH = h - paddingTop - paddingBottom;

      const minWeek = 0;
      const maxWeek = 24;
      const minWeight = 58;
      const maxWeight = 74;

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Segoe UI, sans-serif';
      ctx.textAlign = 'right';

      for (let weight = 60; weight <= 74; weight += 2) {
        const y = paddingTop + chartH - ((weight - minWeight) / (maxWeight - minWeight)) * chartH;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(paddingLeft + chartW, y);
        ctx.stroke();
        ctx.fillText(`${weight}k`, paddingLeft - 6, y + 4);
      }

      ctx.textAlign = 'center';
      for (let week = 0; week <= 24; week += 4) {
        const x = paddingLeft + (week / maxWeek) * chartW;
        ctx.beginPath();
        ctx.moveTo(x, paddingTop);
        ctx.lineTo(x, paddingTop + chartH);
        ctx.stroke();
        ctx.fillText(`أسبوع ${week}`, x, h - 10);
      }

      // Draw Target Trajectory Line (Dashed Gold)
      const targetStartX = paddingLeft;
      const targetStartY = paddingTop + chartH - ((60 - minWeight) / (maxWeight - minWeight)) * chartH;
      const targetEndX = paddingLeft + chartW;
      const targetEndY = paddingTop + chartH - ((72 - minWeight) / (maxWeight - minWeight)) * chartH;

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(targetStartX, targetStartY);
      ctx.lineTo(targetEndX, targetEndY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 10px Segoe UI, sans-serif';
      ctx.fillText('هدف 72 كجم (شهر 6)', targetEndX - 60, targetEndY - 8);

      // Plot Actual Weight Logs
      const cmd = this.data.bulkCommand || this.getDefaultData().bulkCommand;
      const logs = cmd.weightLogs || [];

      if (logs.length > 0) {
        ctx.strokeStyle = '#10b981';
        ctx.fillStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const points = [];
        logs.forEach(log => {
          const week = log.week || 0;
          const weight = log.weight || 60;
          const x = paddingLeft + Math.min(1, Math.max(0, week / maxWeek)) * chartW;
          const y = paddingTop + chartH - Math.min(1, Math.max(0, (weight - minWeight) / (maxWeight - minWeight))) * chartH;
          points.push({ x, y, weight, week });
        });

        points.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        points.forEach(pt => {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 10px Segoe UI, sans-serif';
          ctx.fillText(`${pt.weight}`, pt.x, pt.y - 8);
        });
      }
    }

    



    // ==========================================
    // 🧴 GLOW-UP ARCHITECTURE & GHOST VAULT METHODS
    // ==========================================

    renderSkinCard(day) {
      if (!day.skin) day.skin = { moisturizer: false, sunscreen: false, roaccutane: false };
      const skin = day.skin;

      const btnMoist = document.getElementById('btn-skin-moisturizer');
      const btnSun = document.getElementById('btn-skin-sunscreen');
      const btnRoacc = document.getElementById('btn-skin-roaccutane');
      const badge = document.getElementById('skin-shield-badge');

      if (btnMoist) btnMoist.classList.toggle('active', !!skin.moisturizer);
      if (btnSun) btnSun.classList.toggle('active', !!skin.sunscreen);
      if (btnRoacc) btnRoacc.classList.toggle('active', !!skin.roaccutane);

      const allDone = skin.moisturizer && skin.sunscreen && skin.roaccutane;
      if (badge) {
        badge.classList.toggle('active', allDone);
        if (allDone) {
          badge.textContent = '🛡️ شيلد البشرة مفعّل (Glass Skin On)';
        } else {
          const count = (skin.moisturizer ? 1 : 0) + (skin.sunscreen ? 1 : 0) + (skin.roaccutane ? 1 : 0);
          badge.textContent = `${count} / 3 مكتمل`;
        }
      }
    }

    renderPostureCard(day) {
      const isDone = !!day.posture_done;
      const badge = document.getElementById('posture-status-badge');
      const quickCheck = document.getElementById('posture-quick-check');

      if (badge) {
        badge.classList.toggle('completed', isDone);
        badge.textContent = isDone ? '✓ تم ضبط الشاسيه والهيبة' : 'غير منجز';
      }
      if (quickCheck) {
        quickCheck.textContent = isDone ? '✅' : '◻️';
      }
    }

    calculateGhostStreak() {
      let streak = 0;
      const todayNum = this.realWorldDay || 1;
      for (let i = todayNum; i >= 1; i--) {
        const d = this.data.days[i];
        if (d && d.ghost_silence) {
          streak++;
        } else if (i === todayNum && (!d || !d.ghost_silence)) {
          continue;
        } else {
          break;
        }
      }
      return streak;
    }

    renderGhostSilenceCard(day) {
      const isSilent = !!day.ghost_silence;
      const ghostBtn = document.getElementById('btn-ghost-silence');
      const badge = document.getElementById('ghost-streak-badge');

      if (ghostBtn) {
        ghostBtn.classList.toggle('active', isSilent);
      }
      if (badge) {
        const streak = this.calculateGhostStreak();
        badge.textContent = `👻 ${streak} أيام اختفاء رقمي`;
      }
    }

    // Posture Modal & Timer Engine
    openPostureModal() {
      if (!this.postureModal) return;
      this.postureModal.classList.add('show');
      this.postureSecondsLeft = 300;
      this.updatePostureTimerUI();
      if (this.btnPostureStart) this.btnPostureStart.style.display = 'inline-flex';
      if (this.btnPosturePause) this.btnPosturePause.style.display = 'none';
      if (this.btnPostureComplete) this.btnPostureComplete.style.display = 'none';
    }

    closePostureModal() {
      if (!this.postureModal) return;
      this.pausePostureTimer();
      this.postureModal.classList.remove('show');
    }

    startPostureTimer() {
      if (this.postureTimerInterval) clearInterval(this.postureTimerInterval);
      if (this.btnPostureStart) this.btnPostureStart.style.display = 'none';
      if (this.btnPosturePause) {
        this.btnPosturePause.style.display = 'inline-flex';
        this.btnPosturePause.innerHTML = '<span>⏸️</span> إيقاف مؤقت';
      }

      this.sound.playTick();
      this.postureTimerInterval = setInterval(() => {
        this.postureSecondsLeft--;
        this.updatePostureTimerUI();

        if (this.postureSecondsLeft <= 0) {
          clearInterval(this.postureTimerInterval);
          this.postureTimerInterval = null;
          this.completePostureSession();
        }
      }, 1000);
    }

    pausePostureTimer() {
      if (this.postureTimerInterval) {
        clearInterval(this.postureTimerInterval);
        this.postureTimerInterval = null;
      }
      if (this.btnPostureStart) {
        this.btnPostureStart.style.display = 'inline-flex';
        this.btnPostureStart.innerHTML = '<span>▶️</span> استئناف الجلسة';
      }
      if (this.btnPosturePause) this.btnPosturePause.style.display = 'none';
    }

    updatePostureTimerUI() {
      const minutes = Math.floor(this.postureSecondsLeft / 60);
      const seconds = this.postureSecondsLeft % 60;
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (this.postureTimerText) this.postureTimerText.textContent = formatted;

      // Determine step based on time passed: 300 total seconds
      // Minute 1: 300 to 241 -> index 0
      // Minute 2: 240 to 181 -> index 1
      // Minute 3: 180 to 121 -> index 2
      // Minute 4: 120 to 61 -> index 3
      // Minute 5: 60 to 0 -> index 4
      const elapsed = 300 - this.postureSecondsLeft;
      const stepIdx = Math.min(4, Math.floor(elapsed / 60));
      const step = POSTURE_STEPS[stepIdx];

      if (step) {
        if (this.postureStepTitle) this.postureStepTitle.textContent = step.name;
        if (this.postureStepBadge) this.postureStepBadge.textContent = step.badge;
        if (this.postureCueText) this.postureCueText.textContent = step.cue;
        if (this.posturePhaseName) this.posturePhaseName.textContent = step.visualText;
      }

      // Check chime on phase switch
      if (this.postureSecondsLeft > 0 && this.postureSecondsLeft % 60 === 0 && elapsed > 0) {
        this.sound.playChime();
      }
    }

    completePostureSession() {
      if (this.postureTimerInterval) {
        clearInterval(this.postureTimerInterval);
        this.postureTimerInterval = null;
      }

      this.sound.playVictory();
      this.confetti.burst();

      const day = this.getDay(this.currentDay);
      day.posture_done = true;
      this.saveData();
      this.renderPostureCard(day);

      if (this.postureStepTitle) this.postureStepTitle.textContent = '🏆 أحسنت! تم تعديل الشاسيه وتثبيت القامة';
      if (this.postureCueText) this.postureCueText.textContent = 'أكتافك مفرودة، رقبتك مثبتة، وصدرك مرفوع. حافظ على هذه الهيبة طوال ساعات يومك!';
      if (this.btnPosturePause) this.btnPosturePause.style.display = 'none';
      if (this.btnPostureStart) this.btnPostureStart.style.display = 'none';
      if (this.btnPostureComplete) {
        this.btnPostureComplete.style.display = 'inline-flex';
        this.btnPostureComplete.innerHTML = '<span>✓</span> تم الحفظ بنجاح.. إغلاق';
        this.btnPostureComplete.onclick = () => this.closePostureModal();
      }
    }

    // Ghost Vault Rendering & Logic
    renderVaultView() {
      const container = document.getElementById('vault-milestones-grid');
      if (!container) return;

      if (!this.data.vaultPhotos) this.data.vaultPhotos = {};
      const photos = this.data.vaultPhotos;

      // Populate comparison selectors
      this.populateVaultComparisonDropdowns();

      // Render milestones cards
      container.innerHTML = '';
      VAULT_MILESTONES.forEach(m => {
        const photoData = photos[m.key];
        const hasPhoto = !!(photoData && photoData.photo);

        const card = document.createElement('div');
        card.className = `vault-card ${hasPhoto ? 'active-milestone' : ''}`;
        card.innerHTML = `
          <div class="vault-thumb-box">
            ${hasPhoto ? 
              `<img src="${photoData.photo}" alt="${m.label}" class="vault-thumb-img">` :
              `<div class="vault-empty-placeholder">
                <span class="icon">📷</span>
                <span>بانتظار توثيق ${m.label}</span>
              </div>`
            }
          </div>
          <div class="vault-card-body">
            <div class="vault-card-header">
              <span class="vault-card-title">${m.label}</span>
              <span class="vault-card-badge ${hasPhoto ? 'has-photo' : ''}">
                ${hasPhoto ? 'موثقة ✓' : 'شاغرة'}
              </span>
            </div>
            <p style="font-size: 0.78rem; color: var(--text-dim); margin: 0; line-height: 1.4;">
              ${m.desc} • هدف الوزن: <strong style="color: var(--accent-gold);">${m.targetKg} كجم</strong>
            </p>
            <div class="vault-card-controls">
              <label class="vault-upload-btn">
                <span>📸</span>
                <span>${hasPhoto ? 'تغيير الصورة' : 'التقاط / رفع صورة'}</span>
                <input type="file" accept="image/*" class="vault-hidden-file-input" data-key="${m.key}" style="display: none;">
              </label>
              ${hasPhoto ? 
                `<button type="button" class="vault-delete-btn" data-key="${m.key}" title="حذف الصورة">🗑️</button>` : 
                ''
              }
            </div>
          </div>
        `;
        container.appendChild(card);
      });

      // Bind file upload inputs
      container.querySelectorAll('.vault-hidden-file-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const key = input.dataset.key;
          const file = e.target.files[0];
          if (file) {
            this.handleVaultPhotoUpload(key, file);
          }
        });
      });

      // Bind delete buttons
      container.querySelectorAll('.vault-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.key;
          if (confirm('هل أنت متأكد من حذف صورة هذه المحطة؟')) {
            delete this.data.vaultPhotos[key];
            this.saveData();
            this.sound.playTick();
            this.renderVaultView();
          }
        });
      });

      // Update comparison view
      this.updateVaultComparisonView();
    }

    handleVaultPhotoUpload(key, file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);

          if (!this.data.vaultPhotos) this.data.vaultPhotos = {};
          this.data.vaultPhotos[key] = {
            key: key,
            date: new Date().toISOString().split('T')[0],
            day: this.currentDay,
            photo: dataUrl
          };

          this.sound.playChime();
          this.confetti.burst();
          this.saveData();
          this.renderVaultView();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    populateVaultComparisonDropdowns() {
      const selBefore = document.getElementById('vault-select-before');
      const selAfter = document.getElementById('vault-select-after');
      if (!selBefore || !selAfter) return;

      const photos = this.data.vaultPhotos || {};
      const savedBefore = selBefore.value;
      const savedAfter = selAfter.value;

      selBefore.innerHTML = '';
      selAfter.innerHTML = '';

      VAULT_MILESTONES.forEach(m => {
        const hasPhoto = !!(photos[m.key] && photos[m.key].photo);
        const optB = document.createElement('option');
        optB.value = m.key;
        optB.textContent = `${m.label} ${hasPhoto ? '✓' : '(فارغة)'}`;
        selBefore.appendChild(optB);

        const optA = document.createElement('option');
        optA.value = m.key;
        optA.textContent = `${m.label} ${hasPhoto ? '✓' : '(فارغة)'}`;
        selAfter.appendChild(optA);
      });

      if (savedBefore) selBefore.value = savedBefore;
      if (savedAfter) selAfter.value = savedAfter;
      else {
        // default after to latest milestone with photo or w24
        selAfter.value = 'w24';
      }
    }

    updateVaultComparisonView() {
      const selBefore = document.getElementById('vault-select-before');
      const selAfter = document.getElementById('vault-select-after');
      const emptyBox = document.getElementById('vault-compare-empty');
      const viewSplit = document.getElementById('vault-compare-view');
      const imgBefore = document.getElementById('compare-img-before');
      const imgAfter = document.getElementById('compare-img-after');
      const labelBefore = document.getElementById('compare-label-before');
      const labelAfter = document.getElementById('compare-label-after');

      if (!selBefore || !selAfter || !emptyBox || !viewSplit) return;

      const photos = this.data.vaultPhotos || {};
      const keyBefore = selBefore.value;
      const keyAfter = selAfter.value;

      const photoB = photos[keyBefore] ? photos[keyBefore].photo : null;
      const photoA = photos[keyAfter] ? photos[keyAfter].photo : null;

      if (!photoB && !photoA) {
        emptyBox.style.display = 'block';
        viewSplit.style.display = 'none';
        return;
      }

      emptyBox.style.display = 'none';
      viewSplit.style.display = 'grid';

      const mBefore = VAULT_MILESTONES.find(m => m.key === keyBefore);
      const mAfter = VAULT_MILESTONES.find(m => m.key === keyAfter);

      if (imgBefore) imgBefore.src = photoB || '';
      if (imgAfter) imgAfter.src = photoA || '';
      if (labelBefore) labelBefore.textContent = mBefore ? mBefore.label : 'قبل';
      if (labelAfter) labelAfter.textContent = mAfter ? mAfter.label : 'بعد';
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
    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
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
