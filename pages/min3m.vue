<template>
  <button
    class="theme-toggle"
    type="button"
    aria-label="تبديل مظهر الموقع"
    aria-pressed="false"
    title="تبديل مظهر الموقع"
  >
    <span class="theme-toggle-sun" aria-hidden="true">☀</span>
    <span class="theme-toggle-moon" aria-hidden="true">☾</span>
    <span class="theme-toggle-label">المظهر</span>
  </button>
  <main>
    <header class="site-header">
      <div class="container nav-wrap">
        <a href="#top" class="brand" aria-label="إسلام سلامة — الرئيسية">
          <span class="teacher-monogram teacher-brand-mark" aria-hidden="true">
            <!-- <img src="/eslam-salama-logo.webp" alt="" width="480" height="480" loading="lazy" decoding="async" srcSet="/eslam-salama-logo.webp 640w, /eslam-salama-logo.webp 750w, /eslam-salama-logo.webp 828w" sizes="46px" data-nimg="1"/> -->
          </span>
          <span>
            <b lang="en">Gamma Physics</b>
            <small
              >إسلام سلامة
              <!-- -->
              ·
              <!-- -->
              مدرس الفيزياء للمرحلة الثانوية</small
            >
          </span>
        </a>
        <nav class="desktop-nav" aria-label="التنقل الرئيسي">
          <a href="/courses">الكورسات</a>
          <a href="/library">المذكرات</a>
          <a href="/blog">المدونة</a>
          <a href="/about">عن مستر إسلام</a>
          <a href="#app-status">التطبيق</a>
        </nav>
        <div class="nav-actions">
          <a href="/login" class="login-link">دخول الطالب</a>
          <a href="/register" class="button button-small">
            إنشاء حساب <span>←</span>
          </a>
        </div>
        <details class="mobile-menu">
          <summary aria-label="فتح القائمة">
            <i></i>
            <i></i>
            <i></i>
          </summary>
          <nav>
            <a href="/courses">الكورسات</a>
            <a href="/library">المذكرات</a>
            <a href="/blog">المدونة</a>
            <a href="/about">عن مستر إسلام</a>
            <a href="#app-status">التطبيق</a>
            <a href="/login">دخول الطالب</a>
            <a href="/register">إنشاء حساب</a>
          </nav>
        </details>
      </div>
    </header>
    <section class="home-hero" id="top" aria-labelledby="home-hero-title">
      <div class="container home-hero-layout">
        <div class="home-hero-copy">
          <p class="home-hero-kicker">
            Gamma Physics · فيزياء المرحلة الثانوية
          </p>
          <h1 id="home-hero-title">
            <span>
              افهم الفيزياء من أصلها
              <!-- -->
              <em>وتحلّها بثقة.</em>
            </span>
          </h1>
          <p class="home-hero-description">
            شرح منظم وتدريب متدرج لطلاب أولى وثانية وثالثة ثانوي؛ من تأسيس
            الفكرة لحد تطبيقها في أسئلة الامتحان.
          </p>
          <div class="home-hero-actions">
            <a class="home-hero-primary" href="#courses">
              اختار صفك<span aria-hidden="true">←</span>
            </a>
            <a href="/about" class="home-hero-secondary">
              عن مستر إسلام<span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <figure class="home-hero-media">
          <!-- <img src="/_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=1086&amp;q=75" alt="الأستاذ إسلام سلامة مدرس الفيزياء" width="1086" height="1448" loading="eager" fetchPriority="high" decoding="async" srcSet="/_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=640&amp;q=75 640w, /_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=750&amp;q=75 750w, /_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=828&amp;q=75 828w, /_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=1080&amp;q=75 1080w, /_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=1200&amp;q=75 1200w, /_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=1920&amp;q=75 1920w, /_vinext/image?url=%2Feslam-salama-teacher-cutout-v2.png&amp;w=2048&amp;q=75 2048w" sizes="(max-width: 980px) min(100vw - 32px, 560px), 44vw" data-nimg="1"/> -->
        </figure>
      </div>
    </section>
    <section class="section courses home-course-showcase" id="courses">
      <div class="container">
        <div class="section-heading split-heading" data-motion-reveal="up">
          <div>
            <span class="section-tag">اختار نقطة البداية</span>
            <h2>
              ابدأ من صفك.<br />
              وكمل <em>بخطة واضحة.</em>
            </h2>
          </div>
          <p>
            كل صف له منهجه وسرعته. اختار مرحلتك الأول عشان تشوف الكورسات
            والمراجعات المناسبة ليك فقط.
          </p>
        </div>
        <div
          class="home-course-picker"
          data-motion-reveal="up"
          data-motion-order="1"
        >
          <div>
            <span>خطوتك الأولى</span>
            <h3 id="home-course-audience-title">أنت في أنهي صف؟</h3>
            <p id="home-course-audience-help">
              اختار مرحلتك علشان نعرض لك مسارها فقط.
            </p>
          </div>
          <div
            class="home-course-audiences"
            role="group"
            aria-labelledby="home-course-audience-title"
            aria-describedby="home-course-audience-help"
          >
            <button
              type="button"
              aria-pressed="false"
              aria-controls="home-course-results"
              class=""
            >
              <span class="stage-option-index" aria-hidden="true">01</span>
              <span class="stage-option-label">الصف الأول الثانوي</span>
              <small>قريبًا</small>
            </button>
            <button
              type="button"
              aria-pressed="false"
              aria-controls="home-course-results"
              class=""
            >
              <span class="stage-option-index" aria-hidden="true">02</span>
              <span class="stage-option-label">الصف الثاني الثانوي</span>
              <small>قريبًا</small>
            </button>
            <button
              type="button"
              aria-pressed="false"
              aria-controls="home-course-results"
              class=""
            >
              <span class="stage-option-index" aria-hidden="true">03</span>
              <span class="stage-option-label">الصف الثالث الثانوي</span>
            </button>
          </div>
        </div>
        <div
          class="home-course-result is-empty"
          id="home-course-results"
          data-motion-reveal="up"
          data-motion-order="2"
        >
          <div
            class="home-course-empty"
            role="region"
            aria-labelledby="home-course-empty-title"
          >
            <span class="home-course-empty-step" aria-hidden="true">01</span>
            <div>
              <span>البداية من هنا</span>
              <h3 id="home-course-empty-title">اختار صفك من فوق</h3>
              <p>
                هنظهر لك خطة الصف والكورسات المتاحة من غير ما نخلط لك مناهج باقي
                المراحل.
              </p>
            </div>
            <span class="home-course-empty-arrow" aria-hidden="true">↑</span>
          </div>
        </div>
        <a href="/courses#course-catalog" class="all-courses">
          صفحة كل الكورسات
          <!-- -->
          <span>←</span>
        </a>
      </div>
    </section>
    <section class="home-notes-section" id="notes">
      <div class="container">
        <div class="home-editorial-heading" data-motion-reveal="up">
          <div>
            <span>مكتبة مستقلة</span>
            <h2>
              اختار مذكرتك.<br />
              على حسب <em>احتياجك.</em>
            </h2>
          </div>
          <p>
            كل مذكرة منتج مستقل عن الكورسات؛ شوف محتواها، اختار مطبوعة أو رقمية،
            وخد فقط اللي محتاجه.
          </p>
        </div>
        <article
          class="home-notes-feature"
          data-motion-reveal="scale"
          data-motion-order="1"
        >
          <div class="home-notes-cover">
            <span>GAMMA NOTES 03</span>
            <strong>المذكرة الشاملة في الفيزياء</strong>
            <small
              >الصف الثالث الثانوي
              <!-- -->
              ·
              <!-- -->
              320
              <!-- -->
              صفحة</small
            >
            <i> 320<b>ج.م مطبوعة</b> </i>
          </div>
          <div class="home-notes-copy">
            <span
              >مذكرة مستقلة ·
              <!-- -->
              الصف الثالث الثانوي</span
            >
            <h3>شرح ومراجعة فيزياء الثانوية العامة</h3>
            <p>
              مرجع مستقل للعام الكامل يجمع شرح القوانين، أمثلة محلولة، أفكار
              الربط وملخصات المراجعة النهائية.
              <!-- -->
              تقدر تختارها وحدها بدون الاشتراك في أي كورس.
            </p>
            <ul>
              <li>
                <b>01</b>
                مستقلة عن الكورسات
              </li>
              <li>
                <b>02</b>
                نسخة رقمية داخل التطبيق
              </li>
              <li>
                <b>03</b>
                نسخة مطبوعة وتوصيل
              </li>
            </ul>
            <div>
              <a
                href="/library/physics-secondary-3-complete-notes"
                class="home-notes-primary"
              >
                تفاصيل المذكرة <span>←</span>
              </a>
              <a href="/library" class="home-notes-secondary">كل المذكرات</a>
            </div>
          </div>
        </article>
      </div>
    </section>
    <section class="home-blog-section" id="blog-preview">
      <div class="container">
        <div
          class="home-editorial-heading home-blog-heading"
          data-motion-reveal="up"
        >
          <div>
            <span>من مدونة Gamma</span>
            <h2>
              ذاكر بذكاء.<br />
              وحل <em>بهدوء.</em>
            </h2>
          </div>
          <div class="home-blog-intro">
            <p>
              مقالات عملية عن فهم الفيزياء، تحليل المسائل، وتنظيم المراجعة قبل
              الامتحان.
            </p>
            <a href="/blog">كل مقالات المدونة ←</a>
          </div>
        </div>
        <div class="home-blog-grid">
          <article
            class="home-blog-card home-blog-navy"
            data-motion-reveal="up"
            data-motion-order="0"
          >
            <a href="/blog/study-physics-with-understanding">
              <header>
                <span>أسلوب المذاكرة</span>
                <b>01</b>
              </header>
              <strong>فهم</strong>
              <div>
                <small>6 دقائق قراءة</small>
                <h3>تذاكر الفيزياء بفهم، مش بحفظ القوانين</h3>
                <p>
                  طريقة عملية تخليك تربط القانون بمعناه، وتعرف إمتى تستخدمه قبل
                  ما تبدأ في حل عدد كبير من المسائل.
                </p>
                <span class="home-blog-read"> اقرأ المقال <i>←</i> </span>
              </div>
            </a>
          </article>
          <article
            class="home-blog-card home-blog-blue"
            data-motion-reveal="up"
            data-motion-order="1"
          >
            <a href="/blog/analyze-physics-problem-in-five-steps">
              <header>
                <span>حل المسائل</span>
                <b>02</b>
              </header>
              <strong>05</strong>
              <div>
                <small>7 دقائق قراءة</small>
                <h3>حلّل مسألة الفيزياء في 5 خطوات قبل ما تبدأ الحل</h3>
                <p>
                  روتين ثابت لقراءة المسألة، ترتيب المعطيات، اختيار القانون
                  ومراجعة الناتج من غير تسرّع أو عشوائية.
                </p>
                <span class="home-blog-read"> اقرأ المقال <i>←</i> </span>
              </div>
            </a>
          </article>
          <article
            class="home-blog-card home-blog-coral"
            data-motion-reveal="up"
            data-motion-order="2"
          >
            <a href="/blog/physics-revision-plan-before-exam">
              <header>
                <span>المراجعة والامتحان</span>
                <b>03</b>
              </header>
              <strong>7D</strong>
              <div>
                <small>6 دقائق قراءة</small>
                <h3>خطة مراجعة الفيزياء قبل الامتحان من غير توتر</h3>
                <p>
                  خطة مرنة ترتب المنهج والأسئلة والأخطاء في الأيام الأخيرة،
                  وتترك لك وقتًا للنوم والمراجعة الهادئة.
                </p>
                <span class="home-blog-read"> اقرأ المقال <i>←</i> </span>
              </div>
            </a>
          </article>
        </div>
      </div>
    </section>
    <section class="experience" id="experience">
      <div class="container experience-grid">
        <div class="experience-copy" data-motion-reveal="up">
          <span class="section-tag light">رحلة التعلم مع مستر إسلام</span>
          <h2>
            أربع خطوات.<br />
            رحلة واحدة <em>مترابطة.</em>
          </h2>
          <p>
            شرح مبسّط، تطبيق مستمر، اختبارات دورية ومتابعة تساعدك تمشي في
            الفيزياء بخطة واضحة.
          </p>
          <a href="/learn" class="button button-light">
            شاهد نموذج الطالب <span>←</span>
          </a>
        </div>
        <div class="benefit-list">
          <article data-motion-reveal="up" data-motion-order="0">
            <span>01</span>
            <div>
              <h3>شرح مبسّط</h3>
              <p>الفكرة والقانون بخطوات مرتبة وواضحة.</p>
            </div>
            <i aria-hidden="true">↙</i>
          </article>
          <article data-motion-reveal="up" data-motion-order="1">
            <span>02</span>
            <div>
              <h3>تطبيق مستمر</h3>
              <p>مسائل متدرجة تساعدك تثبّت الفكرة بعد شرحها.</p>
            </div>
            <i aria-hidden="true">↙</i>
          </article>
          <article data-motion-reveal="up" data-motion-order="2">
            <span>03</span>
            <div>
              <h3>اختبارات دورية</h3>
              <p>محطات مراجعة تقيس استيعابك أثناء المذاكرة.</p>
            </div>
            <i aria-hidden="true">↙</i>
          </article>
          <article data-motion-reveal="up" data-motion-order="3">
            <span>04</span>
            <div>
              <h3>متابعة دورية</h3>
              <p>تنظيم مستمر يخليك عارف خلّصت إيه وإيه اللي جاي.</p>
            </div>
            <i aria-hidden="true">↙</i>
          </article>
        </div>
      </div>
    </section>
    <section class="section story" id="about">
      <div class="container story-grid">
        <div class="story-visual" data-motion-reveal="scale">
          <div class="quote-mark" aria-hidden="true">“</div>
          <p>
            الفيزياء مش قوانين للحفظ؛ الفهم يبدأ من معنى القانون وطريقة استخدامه
            في المسألة.
          </p>
          <div class="metric">
            <strong>20+</strong>
            <span> سنة خبرة في<br />تدريس الفيزياء </span>
          </div>
        </div>
        <div class="story-copy" data-motion-reveal="side" data-motion-order="1">
          <span class="section-tag">عن مستر إسلام</span>
          <h2>خبرة تتجاوز <em>20 سنة.</em></h2>
          <p>
            إسلام سلامة
            <!-- -->
            مدرس فيزياء للمرحلة الثانوية، ويقدّم محتوى أولى وثانية وثالثة ثانوي
            تحت اسم
            <!-- -->
            Gamma Physics
            <!-- -->
            .
          </p>
          <ul>
            <li>شرح مبسّط للمفاهيم والقوانين</li>
            <li>تطبيق واختبارات بصورة دورية</li>
            <li>متابعة منظمة للطالب</li>
          </ul>
          <a href="/about" class="story-link">تعرف على مستر إسلام ←</a>
        </div>
      </div>
    </section>
    <section class="app-status-section" id="app-status">
      <div class="container app-status-grid">
        <div class="app-status-copy" data-motion-reveal="up">
          <span class="section-tag light">Android وiPhone</span>
          <h2>
            ذاكر على الويب.<br />
            <em>وكمّل من التطبيق.</em>
          </h2>
          <p>
            استعرض الكورسات والمذكرات على الموقع، وحمّل تطبيق مستر إسلام على
            نظام موبايلك.
          </p>
          <div>
            <a
              class="button"
              href="https://play.google.com/store/apps/details?id=com.aboelezz.eslam.salama"
              target="_blank"
              rel="noreferrer"
            >
              حمّل Android <span>←</span>
            </a>
            <a
              class="app-status-link"
              href="https://tr.ee/vhXRhcPAjc"
              target="_blank"
              rel="noreferrer"
              >حمّل iPhone</a
            >
            <a href="/open-in-app" class="app-status-link">كل طرق المتابعة</a>
          </div>
        </div>
        <figure
          class="app-status-phone app-status-real-shot"
          data-motion-reveal="scale"
          data-motion-order="1"
        >
          <!-- <img src="/eslam-salama-app-screen.webp" alt="لقطة حقيقية من تطبيق إسلام سلامة تعرض الكورسات" width="380" height="675" loading="lazy" decoding="async" srcSet="/eslam-salama-app-screen.webp 640w, /eslam-salama-app-screen.webp 750w" sizes="(max-width: 620px) 74vw, 290px" data-nimg="1"/> -->
          <figcaption>لقطة حقيقية من التطبيق</figcaption>
        </figure>
      </div>
    </section>
    <section class="section faq-section" id="faq">
      <div class="container faq-grid">
        <div class="faq-title" data-motion-reveal="up">
          <span class="section-tag">عندك سؤال؟</span>
          <h2>
            الإجابة<br />
            <em>ببساطة.</em>
          </h2>
          <p>
            اختار صفك الأول، وهتلاقي الكورسات والمذكرات المناسبة ليك من غير خلط.
          </p>
          <a href="https://wa.me/201507659697" target="_blank" rel="noreferrer"
            >اسألنا على واتساب ←</a
          >
        </div>
        <div class="faq-list" data-motion-reveal="side" data-motion-order="1">
          <details open="">
            <summary>الموقع مناسب لأنهي صفوف؟ <span>+</span></summary>
            <p>
              المنصة مخصصة لطلاب أولى وثانية وثالثة ثانوي، وكل صف له مساره
              المستقل.
            </p>
          </details>
          <details>
            <summary>إيه المحتوى المتاح حاليًا؟ <span>+</span></summary>
            <p>
              المتاح حاليًا كورس تأسيسي مجاني وكورس الشهر الأول لثالثة ثانوي،
              ويضم 18 فيديو و5 ملفات ورقية.
            </p>
          </details>
          <details>
            <summary>أقدر أذاكر من الموبايل؟ <span>+</span></summary>
            <p>
              نعم، تقدر تستخدم الموقع أو تحمّل التطبيق من روابط Android وiPhone.
            </p>
          </details>
          <details>
            <summary>إنشاء الحساب شغال؟ <span>+</span></summary>
            <p>
              في العرض الحالي تقدر تجرّب الخطوات وتدخل مساحة الطالب بدون حفظ أو
              إرسال أي بيانات.
            </p>
          </details>
          <details>
            <summary>فين المذكرات؟ <span>+</span></summary>
            <p>
              صفحة المذكرات تعرض منتجات مستقلة لكل صف؛ تقدر تختار نسخة مطبوعة أو
              تشاهد تجربة القراءة الرقمية داخل التطبيق.
            </p>
          </details>
        </div>
      </div>
    </section>
    <section class="cta-section" id="contact">
      <div class="container cta-panel" data-motion-reveal="up">
        <span class="cta-line">جاهز تبدأ؟</span>
        <h2>
          افهم القانون.<br />
          <em>وطبّقه صح.</em>
        </h2>
        <p>اختار صفك وشوف الكورسات والمذكرات المناسبة لمرحلتك.</p>
        <div>
          <a class="button button-light" href="#courses">
            اختار صفك <span>←</span>
          </a>
          <a href="/register" class="whatsapp">أنشئ حسابك</a>
        </div>
      </div>
    </section>
    <footer>
      <div class="container footer-grid">
        <div class="footer-brand" data-motion-reveal="up">
          <a href="#top" class="brand" aria-label="إسلام سلامة — الرئيسية">
            <span
              class="teacher-monogram teacher-brand-mark"
              aria-hidden="true"
            >
              <!-- <img src="/eslam-salama-logo.webp" alt="" width="480" height="480" loading="lazy" decoding="async" srcSet="/eslam-salama-logo.webp 640w, /eslam-salama-logo.webp 750w, /eslam-salama-logo.webp 828w" sizes="46px" data-nimg="1"/> -->
            </span>
            <span>
              <b lang="en">Gamma Physics</b>
              <small
                >إسلام سلامة
                <!-- -->
                ·
                <!-- -->
                مدرس الفيزياء للمرحلة الثانوية</small
              >
            </span>
          </a>
          <p>
            شرح فيزياء منظم لطلاب أولى وثانية وثالثة ثانوي، من فهم القانون إلى
            تحليل المسألة.
          </p>
          <address class="site-contact-details" aria-label="بيانات التواصل">
            <a href="tel:+201008474507" dir="ltr">01008474507</a>
            <a href="mailto:eslamsalama507@gmail.com" dir="ltr"
              >eslamsalama507@gmail.com</a
            >
            <span>الدقهلية — المنصورة</span>
          </address>
          <div
            class="site-social-block"
            aria-label="حسابات المدرس على السوشيال ميديا"
          >
            <b
              >تابع
              <!-- -->
              مستر إسلام</b
            >
            <div class="site-socials" role="list">
              <a
                href="https://www.facebook.com/profile.php?id=100054647100716"
                target="_blank"
                rel="noreferrer"
                role="listitem"
                aria-label="فيسبوك — يفتح في نافذة جديدة"
              >
                <i aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M14 8h3V4.2c-.5-.1-2.2-.2-4-.2-3.9 0-6.5 2.4-6.5 6.7V14H3v4h3.5v6h4.3v-6h3.6l.6-4h-4.2v-2.9C10.8 10 11.1 8 14 8Z"
                    ></path>
                  </svg>
                </i>
                <span>فيسبوك</span>
              </a>
              <a
                href="https://www.instagram.com/mreslamsalama"
                target="_blank"
                rel="noreferrer"
                role="listitem"
                aria-label="إنستجرام — يفتح في نافذة جديدة"
              >
                <i aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6ZM18.3 6.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </i>
                <span>إنستجرام</span>
              </a>
              <a
                href="https://wa.me/201507659697"
                target="_blank"
                rel="noreferrer"
                role="listitem"
                aria-label="واتساب — يفتح في نافذة جديدة"
              >
                <i aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M20.5 3.5A11.7 11.7 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L.2 24l6.4-1.7c1.7.9 3.6 1.4 5.5 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6-3.4-8.4Zm-8.4 18.2c-1.7 0-3.4-.5-4.9-1.3l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 1 1 8.3 4.6Zm5.3-7.3c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6L9 7.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.8 6 5.3 2.2 1 3 .9 4.1.8.7-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4Z"
                    ></path>
                  </svg>
                </i>
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>
        <div data-motion-reveal="up" data-motion-order="1">
          <b>استكشف</b>
          <a href="/courses">الكورسات</a>
          <a href="/library">المذكرات</a>
          <a href="/blog">المدونة</a>
          <a href="/about">عن مستر إسلام</a>
          <a href="#app-status">التطبيق</a>
        </div>
        <div data-motion-reveal="up" data-motion-order="2">
          <b>مساحة الطالب</b>
          <a href="/learn">مساحة الطالب</a>
          <a href="/login">تسجيل الدخول</a>
          <a href="/register">إنشاء حساب</a>
        </div>
      </div>
      <div class="container footer-bottom">
        <span
          >© 2026
          <!-- -->
          إسلام سلامة
          <!-- -->
          . جميع الحقوق محفوظة.</span
        >
        <nav class="footer-legal-links" aria-label="السياسات القانونية">
          <a href="/privacy">سياسة الخصوصية</a>
          <a href="/terms">الشروط والأحكام</a>
        </nav>
        <span>Powered by EduHub</span>
      </div>
    </footer>
  </main>
</template>

<style>
@import "https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap";
:root {
  --ink: #081b3a;
  --deep: #061147;
  --teal: #28366c;
  --mint: #ddebff;
  --cream: #f2f6fc;
  --paper: #fbfcff;
  --coral: #0867d4;
  --gold: #ffb000;
  --line: #081b3a24;
  --heading: "Cairo", sans-serif;
  --body: "Tajawal", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--body);
  margin: 0;
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

button,
summary {
  font: inherit;
}

.container {
  width: min(1180px, 100% - 48px);
  margin: auto;
}

.site-header {
  z-index: 20;
  color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.nav-wrap {
  border-bottom: 1px solid #ffffff2e;
  align-items: center;
  gap: 42px;
  height: 92px;
  display: flex;
}

.brand {
  align-items: center;
  gap: 11px;
  display: flex;
}

.brand img {
  object-fit: cover;
  background: #fff;
  border: 2px solid #ffffffbf;
  border-radius: 50%;
  width: 45px;
  height: 45px;
}

.brand span {
  flex-direction: column;
  display: flex;
}

.brand b {
  font: 900 17px/1 var(--heading);
  letter-spacing: 0.04em;
}

.brand small {
  color: #ffffffad;
  margin-top: 6px;
  font-size: 10px;
}

.desktop-nav {
  gap: 30px;
  margin-inline: auto;
  display: flex;
}

.desktop-nav a,
.login-link {
  color: #ffffffd1;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
}

.desktop-nav a:hover,
.login-link:hover {
  color: #fff;
}

.nav-actions {
  align-items: center;
  gap: 18px;
  display: flex;
}

.button {
  background: var(--coral);
  color: #fff;
  min-height: 55px;
  font-family: var(--heading);
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  gap: 22px;
  padding: 0 25px;
  font-size: 14px;
  font-weight: 800;
  transition: transform 0.2s, background 0.2s;
  display: inline-flex;
  box-shadow: 0 16px 32px -20px #00000080;
}

.button:hover {
  background: #df6751;
  transform: translateY(-3px);
}

.button span {
  font-size: 20px;
}

.button-small {
  gap: 12px;
  min-height: 43px;
  padding-inline: 18px;
  font-size: 12px;
}

.mobile-menu {
  display: none;
}

.hero {
  background: var(--deep);
  color: #fff;
  min-height: 790px;
  padding-top: 92px;
  position: relative;
  overflow: hidden;
}

.hero:before {
  content: "";
  background: linear-gradient(140deg, #cae5de14, #0000 55%);
  width: 44%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.hero-orbit {
  border: 1px solid #ffffff17;
  border-radius: 50%;
  position: absolute;
}

.orbit-one {
  width: 640px;
  height: 640px;
  top: 30px;
  right: -340px;
}

.orbit-two {
  width: 400px;
  height: 400px;
  top: 150px;
  right: -220px;
}

.hero-grid {
  grid-template-columns: 1.03fr 0.97fr;
  align-items: center;
  gap: 70px;
  min-height: 615px;
  display: grid;
  position: relative;
}

.hero-copy {
  padding: 52px 0 58px;
}

.kicker {
  color: #f5cf82;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
}

.kicker:before {
  content: "";
  background: var(--gold);
  width: 44px;
  height: 2px;
}

.hero h1,
.section h2,
.experience h2,
.faq-title h2,
.cta-panel h2 {
  font: 900 clamp(48px, 5.15vw, 76px) / 1.16 var(--heading);
  letter-spacing: -0.045em;
  margin: 22px 0;
}

.hero h1 em,
.section h2 em,
.experience h2 em,
.faq-title h2 em,
.cta-panel h2 em {
  color: var(--coral);
  font-style: normal;
  position: relative;
}

.hero-copy > p {
  color: #ffffffbd;
  max-width: 600px;
  margin: 0;
  font-size: 18px;
  line-height: 1.9;
}

.hero-actions {
  align-items: center;
  gap: 28px;
  margin-top: 32px;
  display: flex;
}

.text-action {
  align-items: center;
  gap: 11px;
  font-size: 14px;
  font-weight: 800;
  display: flex;
}

.text-action i {
  border: 1px solid #ffffff42;
  border-radius: 50%;
  place-items: center;
  width: 38px;
  height: 38px;
  font-size: 10px;
  font-style: normal;
  display: grid;
}

.student-proof {
  align-items: center;
  gap: 15px;
  margin-top: 42px;
  display: flex;
}

.avatars {
  direction: ltr;
  display: flex;
}

.avatars span {
  width: 34px;
  height: 34px;
  color: var(--ink);
  border: 2px solid var(--deep);
  background: #e7c788;
  border-radius: 50%;
  place-items: center;
  margin-left: -8px;
  font-size: 10px;
  font-weight: 900;
  display: grid;
}

.avatars span:nth-child(2) {
  background: #d3e7e2;
}

.avatars span:nth-child(3) {
  background: #ef8a75;
}

.avatars span:last-child {
  background: #fff;
  width: 48px;
}

.student-proof p {
  color: #ffffff9e;
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
}

.student-proof b {
  color: #fff;
}

.hero-visual {
  align-self: end;
  height: 540px;
  position: relative;
}

.image-frame {
  background: #dbe9e5;
  border-radius: 260px 260px 16px 16px;
  position: absolute;
  inset: 34px 28px 0 0;
  overflow: hidden;
}

.image-frame:after {
  content: "";
  background: linear-gradient(#0000 60%, #09262e47);
  position: absolute;
  inset: 0;
}

.image-frame img {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
}

.floating-card {
  z-index: 2;
  color: var(--ink);
  background: #fff;
  position: absolute;
  box-shadow: 0 24px 50px #0822283d;
}

.progress-card {
  width: 152px;
  padding: 17px;
  top: 80px;
  left: -34px;
}

.mini-label {
  color: #71868b;
  font-size: 10px;
}

.progress-card strong {
  font: 900 27px var(--heading);
  color: var(--teal);
  margin: 4px 0;
  display: block;
}

.spark {
  align-items: end;
  gap: 5px;
  height: 25px;
  display: flex;
}

.spark i {
  background: var(--mint);
  width: 10px;
  height: 30%;
  display: block;
}

.spark i:nth-child(2) {
  height: 48%;
}

.spark i:nth-child(3) {
  height: 42%;
}

.spark i:nth-child(4) {
  height: 70%;
}

.spark i:nth-child(5) {
  height: 62%;
}

.spark i:nth-child(6) {
  background: var(--coral);
  height: 100%;
}

.lesson-card {
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  display: flex;
  bottom: 48px;
  right: -10px;
}

.play-dot {
  background: var(--coral);
  color: #fff;
  border-radius: 50%;
  place-items: center;
  width: 36px;
  height: 36px;
  font-size: 10px;
  display: grid;
}

.lesson-card span:last-child {
  flex-direction: column;
  display: flex;
}

.lesson-card small {
  color: #789095;
  font-size: 9px;
}

.lesson-card b {
  font: 800 11px var(--heading);
  margin-top: 3px;
}

.scribble {
  font: 700 12px var(--heading);
  color: #f5cf82;
  position: absolute;
  top: 6px;
  right: -5px;
  transform: rotate(-5deg);
}

.trust-row {
  color: #ffffffb8;
  border-top: 1px solid #ffffff24;
  justify-content: space-between;
  align-items: center;
  height: 83px;
  font-size: 12px;
  display: flex;
}

.trust-row span {
  color: #f3d28f;
  font-weight: 800;
}

.trust-row b {
  font-weight: 600;
}

.section {
  padding: 120px 0;
}

.split-heading {
  grid-template-columns: 1.35fr 0.65fr;
  align-items: end;
  gap: 90px;
  display: grid;
}

.section-tag {
  color: var(--teal);
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 800;
  display: flex;
}

.section-tag:before {
  content: "";
  background: var(--coral);
  width: 29px;
  height: 2px;
}

.section h2,
.experience h2,
.faq-title h2 {
  margin: 14px 0 0;
  font-size: clamp(38px, 4.1vw, 58px);
}

.split-heading > p {
  color: #687e83;
  margin: 0 0 8px;
  font-size: 16px;
  line-height: 1.9;
}

.course-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  display: grid;
}

.course-card {
  border: 1px solid var(--line);
  background: #fff;
  transition: transform 0.25s, box-shadow 0.25s;
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 24px 54px -34px #12313980;
}

.course-cover {
  background: #d8e9e5;
  height: 226px;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.course-cover:before {
  content: "";
  border: 1px solid #1231392b;
  border-radius: 50%;
  width: 230px;
  height: 230px;
  position: absolute;
  bottom: -90px;
  left: -50px;
}

.course-card.coral .course-cover {
  color: #fff;
  background: #ed806b;
}

.course-card.blue .course-cover {
  background: #bcdadc;
}

.course-card.gold .course-cover {
  background: #edcf8e;
}

.course-code {
  font: 800 10px var(--heading);
  letter-spacing: 0.15em;
}

.course-index {
  font: 700 11px var(--heading);
  position: absolute;
  top: 18px;
  left: 20px;
}

.course-mark {
  font: 900 152px/1 var(--heading);
  opacity: 0.16;
  position: absolute;
  bottom: -25px;
  right: 26px;
}

.level-pill {
  color: var(--ink);
  background: #ffffffe0;
  padding: 7px 11px;
  font-size: 10px;
  font-weight: 800;
  position: absolute;
  bottom: 18px;
  right: 20px;
}

.course-content {
  padding: 25px;
}

.teacher {
  color: var(--coral);
  font-size: 11px;
  font-weight: 800;
}

.course-content h3 {
  font: 800 21px/1.35 var(--heading);
  margin: 7px 0 10px;
}

.course-content p {
  color: #6b7e82;
  min-height: 68px;
  margin: 0;
  font-size: 13px;
  line-height: 1.75;
}

.course-footer {
  border-top: 1px solid var(--line);
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 18px;
  font-size: 12px;
  font-weight: 800;
  display: flex;
}

.course-footer a {
  background: var(--ink);
  color: #fff;
  place-items: center;
  width: 38px;
  height: 38px;
  font-size: 18px;
  transition: all 0.2s;
  display: grid;
}

.course-footer a:hover {
  background: var(--coral);
}

.all-courses {
  border-bottom: 1px solid;
  gap: 18px;
  width: max-content;
  margin: 36px auto 0;
  padding-bottom: 7px;
  font-size: 13px;
  font-weight: 800;
  display: flex;
}

.experience {
  background: var(--deep);
  color: #fff;
  padding: 120px 0;
  position: relative;
  overflow: hidden;
}

.experience:after {
  content: "PHYSICS";
  font: 900 170px var(--heading);
  color: #ffffff06;
  white-space: nowrap;
  position: absolute;
  bottom: -80px;
  left: -30px;
}

.experience-grid {
  grid-template-columns: 0.8fr 1.2fr;
  align-items: center;
  gap: 120px;
  display: grid;
}

.section-tag.light {
  color: #f2cb7a;
}

.experience-copy > p {
  color: #ffffffa8;
  font-size: 16px;
  line-height: 1.9;
}

.button-light {
  color: var(--ink);
  box-shadow: none;
  background: #fff;
  margin-top: 20px;
}

.button-light:hover {
  background: var(--mint);
}

.benefit-list article {
  border-bottom: 1px solid #ffffff26;
  grid-template-columns: 52px 1fr 28px;
  align-items: start;
  gap: 18px;
  padding: 25px 0;
  display: grid;
}

.benefit-list article > span {
  font: 700 12px var(--heading);
  color: #f3ce82;
}

.benefit-list h3 {
  font: 800 23px var(--heading);
  margin: 0 0 5px;
}

.benefit-list p {
  color: #fff9;
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.benefit-list i {
  color: var(--coral);
  font-size: 20px;
  font-style: normal;
}

.story {
  background: var(--cream);
}

.story-grid {
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 100px;
  display: grid;
}

.story-visual {
  background: var(--mint);
  flex-direction: column;
  justify-content: center;
  min-height: 480px;
  padding: 80px 58px;
  display: flex;
  position: relative;
}

.story-visual:after {
  content: "";
  border: 12px solid var(--coral);
  width: 95px;
  height: 95px;
  position: absolute;
  bottom: -26px;
  left: -26px;
}

.quote-mark {
  color: var(--teal);
  opacity: 0.5;
  font: 900 90px/1 Georgia;
  position: absolute;
  top: 30px;
  right: 48px;
}

.story-visual > p {
  font: 800 clamp(28px, 3vw, 41px) / 1.55 var(--heading);
  max-width: 410px;
  margin: 0;
}

.metric {
  align-items: center;
  gap: 14px;
  margin-top: 55px;
  display: flex;
}

.metric strong {
  font: 900 43px var(--heading);
  color: var(--coral);
}

.metric span {
  color: #5f777b;
  font-size: 11px;
  line-height: 1.5;
}

.story-copy > p {
  color: #60777c;
  font-size: 16px;
  line-height: 2;
}

.story-copy ul {
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.story-copy li {
  border-bottom: 1px solid var(--line);
  padding: 14px 30px 14px 0;
  font-weight: 700;
  position: relative;
}

.story-copy li:before {
  content: "✓";
  color: var(--coral);
  position: absolute;
  right: 0;
}

.faq-section {
  background: #fff;
}

.faq-grid {
  grid-template-columns: 0.65fr 1.35fr;
  gap: 120px;
  display: grid;
}

.faq-title p {
  color: #718387;
  line-height: 1.8;
}

.faq-title > a {
  color: var(--coral);
  margin-top: 12px;
  font-weight: 800;
  display: inline-block;
}

.faq-list details {
  border-bottom: 1px solid var(--line);
  padding: 0;
}

.faq-list summary {
  cursor: pointer;
  font: 800 17px var(--heading);
  justify-content: space-between;
  gap: 20px;
  padding: 24px 0;
  list-style: none;
  display: flex;
}

.faq-list summary::-webkit-details-marker {
  display: none;
}

.faq-list summary span {
  color: var(--coral);
  font-size: 22px;
  transition: all 0.2s;
}

.faq-list details[open] summary span {
  transform: rotate(45deg);
}

.faq-list details p {
  color: #677d82;
  max-width: 700px;
  margin: 0;
  padding: 0 0 26px;
  line-height: 1.9;
}

.cta-section {
  background: var(--cream);
  padding: 0 0 100px;
}

.cta-panel {
  background: var(--coral);
  color: #fff;
  text-align: center;
  padding: 80px 30px;
  position: relative;
  overflow: hidden;
}

.cta-panel:before,
.cta-panel:after {
  content: "";
  border: 1px solid #ffffff38;
  border-radius: 50%;
  position: absolute;
}

.cta-panel:before {
  width: 400px;
  height: 400px;
  top: -140px;
  right: -260px;
}

.cta-panel:after {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -210px;
}

.cta-line {
  font-size: 12px;
  font-weight: 800;
}

.cta-panel h2 {
  margin: 12px 0;
  font-size: clamp(42px, 5vw, 68px);
}

.cta-panel p {
  color: #fffc;
  font-size: 16px;
}

.cta-panel > div {
  justify-content: center;
  align-items: center;
  gap: 28px;
  display: flex;
}

.cta-panel .button-light {
  margin-top: 18px;
}

.whatsapp {
  border-bottom: 1px solid #ffffffa6;
  margin-top: 18px;
  padding-bottom: 6px;
  font-size: 13px;
  font-weight: 800;
}

footer {
  color: #fff;
  background: #102e36;
  padding-top: 70px;
}

.footer-grid {
  grid-template-columns: 2fr 1fr 1fr;
  gap: 100px;
  padding-bottom: 55px;
  display: grid;
}

.footer-brand .brand {
  width: max-content;
}

.footer-brand p {
  color: #ffffff85;
  max-width: 350px;
  margin-top: 22px;
  font-size: 13px;
  line-height: 1.8;
}

.footer-grid > div:not(:first-child) {
  flex-direction: column;
  gap: 13px;
  display: flex;
}

.footer-grid > div > b {
  font: 800 14px var(--heading);
  color: #f0cb81;
  margin-bottom: 8px;
}

.footer-grid > div > a {
  color: #ffffff9e;
  font-size: 13px;
}

.footer-bottom {
  color: #ffffff6b;
  border-top: 1px solid #ffffff1a;
  justify-content: space-between;
  padding: 22px 0;
  font-size: 10px;
  display: flex;
}

@media (width<=900px) {
  .desktop-nav,
  .login-link {
    display: none;
  }

  .nav-actions {
    margin-right: auto;
  }

  .hero-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .hero {
    padding-bottom: 0;
  }

  .hero-copy {
    padding-bottom: 10px;
  }

  .hero-visual {
    width: min(560px, 100%);
    margin: auto;
  }

  .trust-row {
    justify-content: flex-start;
    gap: 32px;
    margin-top: 40px;
    overflow: auto;
  }

  .split-heading,
  .experience-grid,
  .story-grid,
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .course-grid {
    grid-template-columns: 1fr 1fr;
  }

  .course-card:last-child {
    grid-column: 1/-1;
  }

  .experience-grid {
    gap: 55px;
  }

  .story-grid {
    gap: 70px;
  }

  .faq-grid {
    gap: 45px;
  }
}

@media (width<=620px) {
  .container {
    width: min(100% - 30px, 1180px);
  }

  .site-header .button-small {
    display: none;
  }

  .mobile-menu {
    margin-right: auto;
    display: block;
    position: relative;
  }

  .mobile-menu summary {
    border: 1px solid #ffffff40;
    place-content: center;
    gap: 4px;
    width: 42px;
    height: 42px;
    list-style: none;
    display: grid;
  }

  .mobile-menu summary::-webkit-details-marker {
    display: none;
  }

  .mobile-menu summary i {
    background: #fff;
    width: 18px;
    height: 2px;
    display: block;
  }

  .mobile-menu nav {
    width: 230px;
    color: var(--ink);
    background: #fff;
    flex-direction: column;
    padding: 14px;
    display: flex;
    position: absolute;
    top: 50px;
    left: 0;
    box-shadow: 0 18px 40px #0003;
  }

  .mobile-menu nav a {
    border-bottom: 1px solid var(--line);
    padding: 11px;
    font-weight: 700;
  }

  .nav-wrap {
    height: 76px;
  }

  .brand img {
    width: 39px;
    height: 39px;
  }

  .hero {
    min-height: 0;
    padding-top: 76px;
  }

  .hero-grid {
    min-height: 0;
  }

  .hero-copy {
    padding: 58px 0 20px;
  }

  .hero h1 {
    font-size: 45px;
  }

  .hero-copy > p {
    font-size: 16px;
  }

  .hero-actions {
    flex-wrap: wrap;
    gap: 18px;
  }

  .student-proof {
    margin-top: 32px;
  }

  .hero-visual {
    height: 430px;
  }

  .image-frame {
    inset: 35px 10px 0;
  }

  .progress-card {
    top: 72px;
    left: -2px;
  }

  .lesson-card {
    bottom: 25px;
    right: 0;
  }

  .trust-row {
    height: 76px;
    margin-top: 25px;
  }

  .section,
  .experience {
    padding: 82px 0;
  }

  .section h2,
  .experience h2,
  .faq-title h2 {
    font-size: 38px;
  }

  .split-heading {
    gap: 24px;
  }

  .course-grid {
    grid-template-columns: 1fr;
  }

  .course-card:last-child {
    grid-column: auto;
  }

  .course-cover {
    height: 205px;
  }

  .story-visual {
    min-height: 390px;
    padding: 65px 28px;
  }

  .story-grid {
    gap: 55px;
  }

  .faq-list summary {
    font-size: 14px;
  }

  .cta-section {
    padding-bottom: 60px;
  }

  .cta-panel {
    padding: 64px 20px;
  }

  .cta-panel > div {
    flex-direction: column;
    gap: 8px;
  }

  .whatsapp {
    margin-top: 5px;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 45px 30px;
  }

  .footer-brand {
    grid-column: 1/-1;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .experience:after {
    font-size: 90px;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  * {
    transition: none !important;
  }
}

.auth-page {
  background: #fff;
  grid-template-columns: 1.05fr 0.95fr;
  min-height: 100dvh;
  display: grid;
}

.auth-visual {
  background: var(--deep);
  color: #fff;
  flex-direction: column;
  padding: 44px 7vw;
  display: flex;
  position: relative;
  overflow: hidden;
}

.auth-brand {
  align-items: center;
  gap: 12px;
  width: max-content;
  display: flex;
}

.auth-brand img {
  border: 2px solid #ffffffb3;
  border-radius: 50%;
  width: 48px;
  height: 48px;
}

.auth-brand span {
  flex-direction: column;
  display: flex;
}

.auth-brand b {
  font: 900 18px var(--heading);
}

.auth-promise {
  z-index: 2;
  max-width: 580px;
  margin: auto 0;
  position: relative;
}

.auth-promise > span,
.auth-kicker {
  color: #f1cc80;
  font-size: 12px;
  font-weight: 800;
}

.auth-promise h1 {
  font: 900 clamp(48px, 5.4vw, 78px) / 1.18 var(--heading);
  letter-spacing: -0.05em;
  margin: 20px 0;
}

.auth-promise h1 em {
  color: var(--coral);
  font-style: normal;
}

.auth-promise > p {
  color: #ffffffa8;
  max-width: 500px;
  font-size: 17px;
  line-height: 1.9;
}

.auth-proof {
  align-items: center;
  gap: 14px;
  margin-top: 40px;
  display: flex;
}

.auth-proof b {
  font: 900 32px var(--heading);
  color: #f1cc80;
}

.auth-proof span {
  color: #fff9;
  font-size: 11px;
}

.auth-shape {
  border: 1px solid #ffffff14;
  border-radius: 50%;
  width: 460px;
  height: 460px;
  position: absolute;
  bottom: -200px;
  left: -250px;
}

.auth-shape:before,
.auth-shape:after {
  content: "";
  border: inherit;
  border-radius: 50%;
  position: absolute;
}

.auth-shape:before {
  inset: 65px;
}

.auth-shape:after {
  background: #ef775f1a;
  inset: 145px;
}

.auth-form-side {
  place-items: center;
  padding: 45px;
  display: grid;
}

.auth-card {
  width: min(440px, 100%);
}

.auth-card h2 {
  font: 900 34px var(--heading);
  margin: 12px 0;
}

.auth-card > p {
  color: #718589;
  margin-bottom: 28px;
  line-height: 1.8;
}

.auth-primary {
  background: var(--deep);
  color: #fff;
  width: 100%;
  min-height: 58px;
  font: 800 14px var(--heading);
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 0 20px;
  transition: all 0.2s;
  display: flex;
}

.auth-primary:hover {
  background: var(--teal);
  transform: translateY(-2px);
}

.auth-primary b {
  margin-right: auto;
}

.auth-provider {
  width: 28px;
  height: 28px;
  color: var(--deep);
  background: #fff;
  border-radius: 50%;
  place-items: center;
  display: grid;
}

.auth-separator {
  color: #9aa9ac;
  align-items: center;
  gap: 14px;
  margin: 28px 0;
  font-size: 10px;
  display: flex;
}

.auth-separator:before,
.auth-separator:after {
  content: "";
  background: var(--line);
  flex: 1;
  height: 1px;
}

.auth-benefits {
  gap: 18px;
  display: grid;
}

.auth-benefits > div {
  gap: 12px;
  display: flex;
}

.auth-benefits i {
  background: var(--mint);
  width: 28px;
  height: 28px;
  color: var(--teal);
  border-radius: 50%;
  place-items: center;
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
  display: grid;
}

.auth-benefits span {
  flex-direction: column;
  display: flex;
}

.auth-benefits b {
  font: 800 13px var(--heading);
}

.auth-benefits small {
  color: #849599;
  margin-top: 3px;
}

.auth-terms {
  text-align: center;
  color: #a4b0b2;
  margin-top: 28px;
  font-size: 9px;
  display: block;
}

.student-app {
  color: #173840;
  background: #f5f7f5;
  min-height: 100dvh;
  display: flex;
}

.student-sidebar {
  z-index: 12;
  color: #fff;
  background: #143f4b;
  flex-direction: column;
  width: 244px;
  height: 100dvh;
  padding: 25px 18px;
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
}

.student-logo {
  border-bottom: 1px solid #ffffff1c;
  align-items: center;
  gap: 11px;
  padding: 0 8px 25px;
  display: flex;
}

.student-logo img {
  border: 2px solid #ffffffb3;
  border-radius: 50%;
  width: 42px;
  height: 42px;
}

.student-logo span {
  flex-direction: column;
  display: flex;
}

.student-logo b {
  font: 900 16px var(--heading);
}

.student-logo small {
  color: #ffffff8c;
  margin-top: 3px;
  font-size: 9px;
}

.student-nav {
  gap: 5px;
  margin-top: 24px;
  display: grid;
}

.student-nav a {
  color: #ffffff9e;
  border-radius: 5px;
  align-items: center;
  gap: 13px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
}

.student-nav a i {
  text-align: center;
  width: 24px;
  font-size: 17px;
  font-style: normal;
}

.student-nav a:hover,
.student-nav a.active {
  color: #fff;
  background: #ffffff1a;
}

.student-nav a.active {
  box-shadow: inset -3px 0 var(--coral);
}

.sidebar-support {
  background: #ffffff12;
  border: 1px solid #ffffff14;
  margin-top: auto;
  padding: 18px;
}

.sidebar-support > span {
  background: var(--coral);
  border-radius: 50%;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: 12px;
  font-weight: 900;
  display: grid;
}

.sidebar-support b {
  font: 800 12px var(--heading);
}

.sidebar-support p {
  color: #ffffff87;
  font-size: 10px;
  line-height: 1.7;
}

.sidebar-support a {
  color: #f3cd7d;
  font-size: 10px;
  font-weight: 800;
}

.back-to-site {
  color: #ffffff73;
  padding: 17px 7px 0;
  font-size: 10px;
}

.student-main {
  width: calc(100% - 244px);
  min-width: 0;
  margin-right: 244px;
}

.student-topbar {
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #e5e9e6;
  align-items: center;
  gap: 25px;
  height: 78px;
  padding: 0 clamp(22px, 4vw, 58px);
  display: flex;
  position: sticky;
  top: 0;
}

.student-search {
  background: #f3f6f4;
  border: 1px solid #e6ebe8;
  align-items: center;
  gap: 9px;
  width: min(440px, 48%);
  height: 43px;
  padding: 0 14px;
  display: flex;
}

.student-search span {
  color: #7a9196;
  font-size: 20px;
}

.student-search input {
  width: 100%;
  font-family: var(--body);
  color: var(--ink);
  background: 0 0;
  border: 0;
  outline: 0;
}

.topbar-actions {
  align-items: center;
  gap: 20px;
  margin-right: auto;
  display: flex;
}

.topbar-actions > button {
  width: 38px;
  height: 38px;
  color: var(--ink);
  background: #f3f6f4;
  border: 0;
  font-size: 17px;
  position: relative;
}

.topbar-actions > button i {
  background: var(--coral);
  border-radius: 50%;
  width: 7px;
  height: 7px;
  position: absolute;
  top: 7px;
  right: 8px;
}

.student-user {
  align-items: center;
  gap: 9px;
  display: flex;
}

.student-user > span {
  background: var(--mint);
  width: 38px;
  height: 38px;
  color: var(--deep);
  font: 900 14px var(--heading);
  border-radius: 50%;
  place-items: center;
  display: grid;
}

.student-user div {
  flex-direction: column;
  display: flex;
}

.student-user b {
  font: 800 11px var(--heading);
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 160px;
  overflow: hidden;
}

.student-user small {
  color: #84969a;
  font-size: 9px;
}

.mobile-student-brand,
.student-mobile-nav {
  display: none;
}

.student-content {
  max-width: 1500px;
  margin: auto;
  padding: 38px clamp(22px, 4vw, 58px) 60px;
}

.dashboard-greeting {
  justify-content: space-between;
  align-items: end;
  margin-bottom: 28px;
  display: flex;
}

.dashboard-greeting > div > span,
.inner-title > span {
  color: var(--coral);
  font-size: 11px;
  font-weight: 800;
}

.dashboard-greeting h1,
.inner-title h1 {
  font: 900 30px var(--heading);
  margin: 5px 0;
}

.dashboard-greeting p,
.inner-title p {
  color: #778b8f;
  margin: 0;
  font-size: 13px;
}

.study-streak {
  background: #fff;
  border: 1px solid #e2e8e4;
  align-items: center;
  gap: 9px;
  padding: 11px 15px;
  display: flex;
}

.study-streak > span {
  font-size: 22px;
}

.study-streak div {
  flex-direction: column;
  display: flex;
}

.study-streak b {
  font: 800 12px var(--heading);
}

.study-streak small {
  color: #8a9b9e;
  font-size: 9px;
}

.continue-panel {
  background: var(--deep);
  color: #fff;
  grid-template-columns: 1.3fr 0.7fr;
  min-height: 270px;
  margin-bottom: 28px;
  display: grid;
  position: relative;
  overflow: hidden;
}

.continue-panel:after {
  content: "";
  border: 1px solid #ffffff14;
  border-radius: 50%;
  width: 350px;
  height: 350px;
  position: absolute;
  top: -150px;
  left: -180px;
}

.continue-copy {
  z-index: 2;
  padding: 34px 40px;
  position: relative;
}

.eyebrow-app {
  color: #f1cb7e;
  font-size: 10px;
  font-weight: 800;
}

.continue-copy h2 {
  font: 800 clamp(22px, 2.6vw, 34px) var(--heading);
  margin: 9px 0 2px;
}

.continue-copy > p {
  color: #ffffff94;
  font-size: 11px;
}

.continue-progress {
  align-items: center;
  gap: 12px;
  margin: 24px 0 20px;
  display: flex;
}

.continue-progress > span {
  background: #ffffff24;
  width: 190px;
  height: 5px;
}

.continue-progress i {
  background: var(--coral);
  height: 100%;
  display: block;
}

.continue-progress b {
  color: #ffffffa6;
  font-size: 9px;
}

.continue-copy > a {
  background: var(--coral);
  font: 800 11px var(--heading);
  align-items: center;
  gap: 18px;
  padding: 12px 18px;
  display: inline-flex;
}

.continue-art {
  color: var(--deep);
  background: #c9e1dc;
  place-items: center;
  display: grid;
  position: relative;
  overflow: hidden;
}

.continue-art > span {
  font: 900 180px/1 var(--heading);
  opacity: 0.13;
}

.continue-art > i {
  background: #fff;
  border-radius: 50%;
  place-items: center;
  width: 62px;
  height: 62px;
  font-style: normal;
  display: grid;
  position: absolute;
  box-shadow: 0 15px 30px #0f37402e;
}

.continue-art > small {
  color: #fff;
  background: #143f4bd9;
  padding: 6px 9px;
  position: absolute;
  bottom: 18px;
  left: 18px;
}

.dashboard-grid {
  grid-template-columns: 1.45fr 0.55fr;
  gap: 25px;
  display: grid;
}

.dashboard-section,
.weekly-card {
  background: #fff;
  border: 1px solid #e1e7e3;
  padding: 24px;
}

.app-section-head {
  justify-content: space-between;
  align-items: end;
  margin-bottom: 20px;
  display: flex;
}

.app-section-head h2 {
  font: 800 18px var(--heading);
  margin: 0;
}

.app-section-head p {
  color: #8a9b9e;
  margin: 2px 0 0;
  font-size: 10px;
}

.app-section-head a {
  color: var(--coral);
  font-size: 10px;
  font-weight: 800;
}

.mini-course-grid {
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  display: grid;
}

.mini-course {
  border: 1px solid #e5e9e6;
  grid-template-columns: 94px 1fr;
  min-width: 0;
  display: grid;
}

.mini-cover {
  background: #e4eee9;
  place-items: center;
  min-height: 110px;
  display: grid;
  position: relative;
  overflow: hidden;
}

.mini-course.coral .mini-cover {
  background: #ef806a;
}

.mini-course.mint .mini-cover {
  background: #bcdad5;
}

.mini-course.gold .mini-cover {
  background: #e7c879;
}

.mini-cover > span {
  font: 900 78px var(--heading);
  opacity: 0.15;
}

.mini-cover small {
  background: #fff;
  padding: 4px 6px;
  font-weight: 900;
  position: absolute;
  bottom: 7px;
  right: 7px;
}

.mini-course > div:last-child {
  flex-direction: column;
  min-width: 0;
  padding: 15px 13px;
  display: flex;
}

.mini-course > div > b {
  font: 800 12px var(--heading);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.mini-course > div > small {
  color: #819397;
  margin-top: 4px;
  font-size: 9px;
}

.tiny-progress {
  background: #edf0ee;
  height: 4px;
  margin-top: auto;
}

.tiny-progress i {
  background: var(--coral);
  height: 100%;
  display: block;
}

.weekly-total strong {
  font: 900 32px var(--heading);
}

.weekly-total span {
  color: #839599;
  margin-right: 6px;
  font-size: 9px;
}

.week-bars {
  justify-content: space-between;
  align-items: end;
  height: 130px;
  margin-top: 16px;
  display: flex;
}

.week-bars > div {
  flex-direction: column;
  justify-content: end;
  align-items: center;
  gap: 6px;
  height: 100%;
  display: flex;
}

.week-bars i {
  background: #dce9e5;
  width: 13px;
  min-height: 7px;
  display: block;
}

.week-bars i.peak {
  background: var(--coral);
}

.week-bars small {
  color: #839599;
  font-size: 8px;
}

.quick-stats {
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 25px;
  display: grid;
}

.quick-stats article {
  background: #fff;
  border: 1px solid #e1e7e3;
  align-items: center;
  gap: 12px;
  padding: 17px;
  display: flex;
}

.quick-stats article > span {
  width: 40px;
  height: 40px;
  color: var(--teal);
  background: #e1efeb;
  place-items: center;
  font-weight: 900;
  display: grid;
}

.quick-stats article div {
  flex-direction: column;
  display: flex;
}

.quick-stats b {
  font: 900 18px var(--heading);
}

.quick-stats small {
  color: #839599;
  font-size: 9px;
}

.inner-title {
  margin-bottom: 28px;
}

.library-filters {
  border-bottom: 1px solid #dfe5e1;
  gap: 6px;
  margin-bottom: 22px;
  display: flex;
}

.library-filters button {
  color: #71868a;
  cursor: pointer;
  background: 0 0;
  border: 0;
  padding: 11px 15px;
  font-weight: 800;
}

.library-filters button.active {
  color: var(--deep);
  border-bottom: 2px solid var(--coral);
}

.library-filters b {
  background: #e8edeb;
  border-radius: 8px;
  margin-right: 5px;
  padding: 2px 6px;
}

.library-grid {
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  display: grid;
}

.library-course {
  background: #fff;
  border: 1px solid #dfe6e1;
  grid-template-columns: 190px 1fr;
  display: grid;
}

.library-cover {
  background: #c9dfdb;
  place-items: center;
  min-height: 230px;
  display: grid;
  position: relative;
  overflow: hidden;
}

.library-cover.coral {
  background: #ee806a;
}

.library-cover.mint {
  background: #bedbd6;
}

.library-cover.gold {
  background: #e8ca81;
}

.library-cover > span {
  font: 900 150px var(--heading);
  opacity: 0.15;
}

.library-cover > div {
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
}

.library-cover small {
  font-weight: 900;
}

.library-cover i {
  background: #ffffff73;
  height: 4px;
  margin-top: 5px;
  display: block;
}

.library-cover i b {
  background: #fff;
  height: 100%;
  display: block;
}

.library-body {
  flex-direction: column;
  padding: 24px;
  display: flex;
}

.library-body > span {
  color: var(--coral);
  font-size: 9px;
  font-weight: 800;
}

.library-body h2 {
  font: 800 19px var(--heading);
  margin: 5px 0 8px;
}

.library-body p {
  color: #72878b;
  font-size: 11px;
  line-height: 1.7;
}

.library-body > div {
  border-top: 1px solid #e5eae7;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  display: flex;
}

.library-body small {
  color: #829397;
}

.library-body a {
  color: var(--coral);
  font-size: 10px;
  font-weight: 800;
}

.course-hero-app {
  min-height: 260px;
  color: var(--deep);
  justify-content: space-between;
  align-items: center;
  padding: 34px 42px;
  display: flex;
  position: relative;
  overflow: hidden;
}

.course-hero-app.coral {
  color: #fff;
  background: #ef806a;
}

.course-hero-app.mint {
  background: #c5dfda;
}

.course-hero-app.gold {
  background: #eacb81;
}

.course-hero-app > div:first-child {
  z-index: 2;
  max-width: 650px;
  position: relative;
}

.course-hero-app a {
  opacity: 0.65;
  font-size: 9px;
  font-weight: 800;
}

.course-hero-app > div > span {
  margin-top: 28px;
  font-size: 10px;
  font-weight: 800;
  display: block;
}

.course-hero-app h1 {
  font: 900 34px var(--heading);
  margin: 4px 0;
}

.course-hero-app p {
  opacity: 0.75;
  font-size: 12px;
  line-height: 1.7;
}

.course-hero-meta {
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  font-size: 9px;
  display: flex;
}

.course-hero-meta i {
  background: currentColor;
  border-radius: 50%;
  width: 3px;
  height: 3px;
}

.course-letter {
  font: 900 220px/1 var(--heading);
  opacity: 0.12;
  margin-left: 35px;
}

.course-layout {
  grid-template-columns: 1fr 280px;
  gap: 25px;
  margin-top: 28px;
  display: grid;
}

.module-card {
  background: #fff;
  border: 1px solid #e0e6e2;
  margin-bottom: 12px;
}

.module-card > summary {
  cursor: pointer;
  grid-template-columns: 38px 1fr 20px;
  align-items: center;
  gap: 12px;
  padding: 17px 20px;
  list-style: none;
  display: grid;
}

.module-card > summary::-webkit-details-marker {
  display: none;
}

.module-card > summary > span {
  width: 38px;
  height: 38px;
  color: var(--teal);
  font: 800 10px var(--heading);
  background: #e1efeb;
  place-items: center;
  display: grid;
}

.module-card summary div {
  flex-direction: column;
  display: flex;
}

.module-card summary b {
  font: 800 13px var(--heading);
}

.module-card summary small {
  color: #87979a;
  font-size: 9px;
}

.module-card summary > i {
  font-style: normal;
}

.module-card > div {
  border-top: 1px solid #e5eae7;
}

.web-lesson {
  border-bottom: 1px solid #edf0ee;
  grid-template-columns: 42px 1fr auto 18px;
  align-items: center;
  gap: 13px;
  padding: 14px 20px;
  display: grid;
}

.web-lesson:last-child {
  border: 0;
}

.web-lesson:hover {
  background: #f7f9f7;
}

.lesson-kind {
  width: 40px;
  height: 40px;
  color: var(--teal);
  background: #e6efec;
  place-items: center;
  font-size: 9px;
  font-weight: 900;
  display: grid;
}

.lesson-kind.pdf {
  color: var(--coral);
  background: #fbe4df;
}

.lesson-kind.quiz {
  color: #967323;
  background: #f4e8c9;
}

.web-lesson > div {
  flex-direction: column;
  display: flex;
}

.web-lesson > div > b {
  font: 800 11px var(--heading);
}

.web-lesson > div > small {
  color: #8a9a9d;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 520px;
  font-size: 9px;
  overflow: hidden;
}

.web-lesson > em {
  color: #819397;
  font-size: 9px;
  font-style: normal;
}

.web-lesson > i {
  font-style: normal;
}

.web-lesson.done > em {
  color: #3c8577;
  font-weight: 800;
}

.overall-progress,
.teacher-note {
  background: #fff;
  border: 1px solid #e0e6e2;
  margin-bottom: 15px;
  padding: 22px;
}

.overall-progress > span {
  font-size: 10px;
  font-weight: 800;
}

.overall-progress strong {
  font: 900 35px var(--heading);
  margin: 7px 0;
  display: block;
}

.overall-progress > i {
  background: #e9eeeb;
  height: 6px;
  display: block;
}

.overall-progress > i b {
  background: var(--coral);
  height: 100%;
  display: block;
}

.overall-progress p {
  color: #829397;
  font-size: 9px;
  line-height: 1.7;
}

.teacher-note {
  gap: 11px;
  display: flex;
}

.teacher-note > span {
  background: var(--mint);
  border-radius: 50%;
  flex: none;
  place-items: center;
  width: 42px;
  height: 42px;
  font-weight: 900;
  display: grid;
}

.teacher-note div b {
  font: 800 11px var(--heading);
}

.teacher-note div p {
  color: #829397;
  font-size: 9px;
  line-height: 1.6;
}

.watch-breadcrumb {
  color: #849699;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 9px;
  display: flex;
}

.watch-breadcrumb a {
  color: var(--coral);
  font-weight: 800;
}

.watch-layout {
  grid-template-columns: minmax(0, 1fr) 315px;
  gap: 20px;
  display: grid;
}

.watch-main {
  min-width: 0;
}

.video-player {
  aspect-ratio: 16/9;
  background: #0b2229;
  position: relative;
  overflow: hidden;
}

.video-player > img,
.video-player video {
  object-fit: cover;
  opacity: 0.32;
  width: 100%;
  height: 100%;
}

.video-overlay {
  color: #fff;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  position: absolute;
  inset: 0;
}

.video-overlay > span {
  background: var(--coral);
  border-radius: 50%;
  place-items: center;
  width: 68px;
  height: 68px;
  padding-right: 3px;
  font-size: 20px;
  display: grid;
}

.video-overlay b {
  font: 800 16px var(--heading);
  margin-top: 14px;
}

.video-overlay small {
  color: #ffffffa6;
  margin-top: 4px;
}

.video-watermark {
  color: #ffffff3d;
  direction: ltr;
  font-size: 8px;
  position: absolute;
  top: 12px;
  left: 15px;
}

.lesson-heading {
  background: #fff;
  border: 1px solid #e0e6e2;
  border-top: 0;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  display: flex;
}

.lesson-heading > div:first-child > span {
  color: var(--coral);
  font-size: 9px;
  font-weight: 800;
}

.lesson-heading h1 {
  font: 800 22px var(--heading);
  margin: 5px 0;
}

.lesson-heading p {
  color: #7f9296;
  margin: 0;
  font-size: 10px;
}

.lesson-controls {
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  display: flex;
}

.lesson-controls button {
  color: #647b80;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dce3df;
  height: 37px;
  padding: 0 11px;
  font-size: 9px;
  font-weight: 800;
}

.lesson-controls button:first-child {
  background: var(--deep);
  color: #fff;
  border-color: var(--deep);
}

.lesson-controls button.completed {
  background: #398273;
  border-color: #398273;
}

.lesson-controls button.favorite {
  color: var(--coral);
  border-color: #efb5aa;
}

.lesson-tabs {
  background: #fff;
  border: 1px solid #e0e6e2;
  border-top: 0;
  gap: 26px;
  padding: 0 22px;
  display: flex;
}

.lesson-tabs button {
  color: #7b8f93;
  background: 0 0;
  border: 0;
  padding: 16px 0;
  font-size: 10px;
  font-weight: 800;
}

.lesson-tabs button.active {
  color: var(--deep);
  border-bottom: 2px solid var(--coral);
}

.lesson-tabs b {
  background: #e8edeb;
  border-radius: 8px;
  padding: 1px 5px;
}

.lesson-overview {
  background: #fff;
  border: 1px solid #e0e6e2;
  border-top: 0;
  padding: 25px;
}

.lesson-overview h2 {
  font: 800 16px var(--heading);
  margin: 0 0 8px;
}

.lesson-overview > p {
  color: #71868a;
  font-size: 11px;
  line-height: 1.8;
}

.lesson-resources {
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
  display: grid;
}

.lesson-resources article {
  border: 1px solid #e0e6e2;
  grid-template-columns: 38px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 12px;
  display: grid;
}

.lesson-resources article > span {
  width: 38px;
  height: 38px;
  color: var(--coral);
  background: #f8e3df;
  place-items: center;
  font-size: 9px;
  font-weight: 900;
  display: grid;
}

.lesson-resources article div {
  flex-direction: column;
  display: flex;
}

.lesson-resources article b {
  font: 800 10px var(--heading);
}

.lesson-resources article small {
  color: #829397;
  font-size: 8px;
}

.lesson-resources button {
  color: #9ba8aa;
  background: 0 0;
  border: 0;
  font-size: 9px;
}

.lesson-nav {
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  display: flex;
}

.lesson-nav a {
  background: #fff;
  border: 1px solid #e0e6e2;
  flex-direction: column;
  min-width: 230px;
  padding: 13px 16px;
  display: flex;
}

.lesson-nav a:last-child {
  text-align: left;
}

.lesson-nav span {
  color: #8a9a9d;
  font-size: 8px;
}

.lesson-nav b {
  font: 800 10px var(--heading);
  margin-top: 3px;
}

.lesson-playlist {
  background: #fff;
  border: 1px solid #e0e6e2;
  align-self: start;
  max-height: calc(100dvh - 125px);
  position: sticky;
  top: 95px;
  overflow: auto;
}

.lesson-playlist > div {
  justify-content: space-between;
  padding: 18px 17px 8px;
  display: flex;
}

.lesson-playlist > div span {
  font: 800 12px var(--heading);
}

.lesson-playlist > div b {
  color: #84969a;
  font-size: 9px;
}

.lesson-playlist > i {
  background: #e8edeb;
  height: 4px;
  margin: 0 17px 15px;
  display: block;
}

.lesson-playlist > i b {
  background: var(--coral);
  height: 100%;
  display: block;
}

.lesson-playlist nav section h3 {
  font: 800 10px var(--heading);
  background: #f4f7f5;
  margin: 0;
  padding: 12px 16px;
}

.lesson-playlist nav a {
  border-bottom: 1px solid #edf0ee;
  grid-template-columns: 30px 1fr 18px;
  align-items: center;
  gap: 9px;
  padding: 11px 13px;
  display: grid;
}

.lesson-playlist nav a.active {
  box-shadow: inset -3px 0 var(--coral);
  background: #eef5f2;
}

.lesson-playlist nav a > span {
  background: #e4eeeb;
  place-items: center;
  width: 28px;
  height: 28px;
  font-size: 7px;
  font-weight: 900;
  display: grid;
}

.lesson-playlist nav a > div {
  flex-direction: column;
  min-width: 0;
  display: flex;
}

.lesson-playlist nav a > div b {
  font: 800 9px var(--heading);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.lesson-playlist nav a small {
  color: #89999c;
  font-size: 7px;
}

.lesson-playlist nav a > i {
  color: #398273;
  font-size: 9px;
  font-style: normal;
}

.exam-page-grid {
  grid-template-columns: 1.2fr 0.8fr;
  gap: 22px;
  display: grid;
}

.exam-intro,
.quiz-live,
.exam-result,
.upcoming-exams {
  background: #fff;
  border: 1px solid #dfe6e1;
  padding: 32px;
}

.exam-intro > span {
  color: var(--coral);
  font-size: 10px;
  font-weight: 800;
}

.exam-intro h2,
.exam-result h2 {
  font: 800 25px var(--heading);
  margin: 7px 0;
}

.exam-intro > p,
.exam-result p {
  color: #758a8e;
  font-size: 12px;
  line-height: 1.8;
}

.exam-intro > div {
  background: #f3f6f4;
  grid-template-columns: repeat(3, auto 1fr);
  align-items: center;
  gap: 5px 9px;
  margin: 25px 0;
  padding: 18px;
  display: grid;
}

.exam-intro > div b {
  font: 900 22px var(--heading);
}

.exam-intro > div small {
  color: #849699;
  font-size: 8px;
}

.exam-intro > button,
.exam-result button {
  background: var(--coral);
  color: #fff;
  cursor: pointer;
  border: 0;
  padding: 13px 25px;
  font-weight: 800;
}

.quiz-top {
  color: #758a8e;
  justify-content: space-between;
  font-size: 10px;
  display: flex;
}

.quiz-top b {
  color: var(--coral);
}

.quiz-live > i {
  background: #e9eeeb;
  height: 5px;
  margin: 15px 0 30px;
  display: block;
}

.quiz-live > i b {
  background: var(--coral);
  height: 100%;
  display: block;
}

.quiz-live h2 {
  font: 800 20px/1.6 var(--heading);
  margin-bottom: 25px;
}

.quiz-live > div:last-child {
  gap: 9px;
  display: grid;
}

.quiz-live > div:last-child button {
  text-align: right;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dfe5e1;
  align-items: center;
  gap: 11px;
  padding: 13px;
  font-weight: 700;
  display: flex;
}

.quiz-live > div:last-child button:hover {
  border-color: var(--teal);
  background: #f0f6f4;
}

.quiz-live > div:last-child span {
  background: #e6efec;
  place-items: center;
  width: 30px;
  height: 30px;
  font-weight: 900;
  display: grid;
}

.exam-result {
  text-align: center;
}

.exam-result > span {
  background: var(--mint);
  width: 60px;
  height: 60px;
  color: var(--teal);
  border-radius: 50%;
  place-items: center;
  margin: auto;
  font-size: 24px;
  display: grid;
}

.exam-result strong {
  font: 900 56px var(--heading);
  color: var(--coral);
  display: block;
}

.upcoming-exams h2 {
  font: 800 17px var(--heading);
  margin-top: 0;
}

.upcoming-exams article {
  border-bottom: 1px solid #e5eae7;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  display: grid;
}

.upcoming-exams article > span {
  text-align: center;
  background: #e8f1ee;
  padding: 7px 4px;
  font-size: 8px;
}

.upcoming-exams article > span b {
  font: 900 16px var(--heading);
  display: block;
}

.upcoming-exams article div {
  flex-direction: column;
  display: flex;
}

.upcoming-exams article div b {
  font: 800 10px var(--heading);
}

.upcoming-exams article small {
  color: #859699;
  font-size: 8px;
}

.upcoming-exams article > i {
  color: var(--coral);
  font-size: 9px;
  font-style: normal;
}

.upcoming-exams > a {
  color: var(--coral);
  margin-top: 22px;
  font-size: 10px;
  font-weight: 800;
  display: inline-block;
}

.favorite-list {
  gap: 10px;
  display: grid;
}

.favorite-list a {
  background: #fff;
  border: 1px solid #dfe6e1;
  grid-template-columns: 42px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 16px;
  display: grid;
}

.favorite-list a > span {
  width: 40px;
  height: 40px;
  color: var(--coral);
  background: #f8e3df;
  place-items: center;
  display: grid;
}

.favorite-list div {
  flex-direction: column;
  display: flex;
}

.favorite-list b {
  font: 800 12px var(--heading);
}

.favorite-list small {
  color: #84969a;
  font-size: 9px;
}

.favorite-list i {
  font-style: normal;
}

.empty-state {
  text-align: center;
  background: #fff;
  border: 1px solid #dfe6e1;
  padding: 70px 30px;
}

.empty-state > span {
  color: var(--coral);
  font-size: 45px;
}

.empty-state h2 {
  font: 800 20px var(--heading);
}

.empty-state p {
  color: #819397;
}

.empty-state a {
  background: var(--deep);
  color: #fff;
  padding: 12px 18px;
  font-size: 10px;
  font-weight: 800;
  display: inline-block;
}

.profile-layout {
  grid-template-columns: 0.7fr 1.3fr;
  gap: 22px;
  display: grid;
}

.profile-card,
.profile-settings {
  background: #fff;
  border: 1px solid #dfe6e1;
  padding: 28px;
}

.profile-head {
  align-items: center;
  gap: 14px;
  display: flex;
}

.profile-head > span {
  background: var(--mint);
  width: 64px;
  height: 64px;
  color: var(--deep);
  font: 900 23px var(--heading);
  border-radius: 50%;
  place-items: center;
  display: grid;
}

.profile-head h2 {
  font: 800 18px var(--heading);
  margin: 0;
}

.profile-head p {
  color: #7d9094;
  direction: ltr;
  margin: 3px 0;
  font-size: 10px;
}

.profile-head small {
  color: #398273;
  background: #e4f0ed;
  padding: 3px 7px;
  font-size: 8px;
}

.profile-stats {
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin-top: 28px;
  display: grid;
}

.profile-stats div {
  text-align: center;
  background: #f4f7f5;
  padding: 14px 4px;
}

.profile-stats b {
  font: 900 20px var(--heading);
  display: block;
}

.profile-stats span {
  color: #839599;
  font-size: 8px;
}

.profile-settings h2 {
  font: 800 17px var(--heading);
  margin-top: 0;
}

.profile-settings label {
  flex-direction: column;
  gap: 6px;
  margin-top: 15px;
  display: flex;
}

.profile-settings label span {
  color: #6e8488;
  font-size: 9px;
  font-weight: 800;
}

.profile-settings input {
  height: 44px;
  font-family: var(--body);
  color: #536c71;
  background: #f6f8f6;
  border: 1px solid #dfe5e1;
  padding: 0 12px;
}

.two-fields {
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  display: grid;
}

.profile-settings > p {
  color: #8a999c;
  font-size: 8px;
}

.signout {
  color: var(--coral);
  border: 1px solid #e7aaa0;
  margin-top: 15px;
  padding: 10px 18px;
  font-size: 10px;
  font-weight: 800;
  display: inline-block;
}

@media (width<=1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .weekly-card {
    display: none;
  }

  .library-grid,
  .watch-layout {
    grid-template-columns: 1fr;
  }

  .lesson-playlist {
    max-height: none;
    position: static;
  }

  .course-layout {
    grid-template-columns: 1fr;
  }

  .course-aside {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    display: grid;
  }

  .exam-page-grid {
    grid-template-columns: 1fr;
  }
}

@media (width<=820px) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .auth-visual {
    min-height: 390px;
    padding: 30px;
  }

  .auth-form-side {
    padding: 45px 24px;
  }

  .student-sidebar {
    display: none;
  }

  .student-main {
    width: 100%;
    margin: 0;
  }

  .student-topbar {
    height: 66px;
    padding: 0 16px;
  }

  .mobile-student-brand {
    align-items: center;
    gap: 7px;
    display: flex;
  }

  .mobile-student-brand img {
    border-radius: 50%;
    width: 34px;
    height: 34px;
  }

  .mobile-student-brand b {
    font: 900 12px var(--heading);
  }

  .student-search,
  .student-user div {
    display: none;
  }

  .student-content {
    padding: 24px 16px 90px;
  }

  .student-mobile-nav {
    z-index: 20;
    background: #fff;
    border-top: 1px solid #dfe5e1;
    justify-content: space-around;
    height: 68px;
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .student-mobile-nav a {
    color: #839599;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    min-width: 55px;
    font-size: 8px;
    display: flex;
  }

  .student-mobile-nav i {
    font-size: 17px;
    font-style: normal;
  }

  .student-mobile-nav a.active {
    color: var(--coral);
  }

  .continue-panel {
    grid-template-columns: 1fr;
  }

  .continue-art {
    display: none;
  }

  .mini-course-grid {
    grid-template-columns: 1fr;
  }

  .quick-stats {
    grid-template-columns: 1fr 1fr;
  }

  .library-course {
    grid-template-columns: 130px 1fr;
  }

  .course-hero-app {
    padding: 28px;
  }

  .course-letter {
    position: absolute;
    left: -10px;
  }

  .course-layout {
    margin-top: 18px;
  }

  .web-lesson > div > small {
    max-width: 280px;
  }

  .watch-breadcrumb {
    display: none;
  }

  .lesson-heading {
    flex-direction: column;
  }

  .lesson-controls {
    justify-content: flex-start;
  }

  .lesson-resources,
  .profile-layout {
    grid-template-columns: 1fr;
  }
}

@media (width<=520px) {
  .auth-visual {
    min-height: 330px;
  }

  .auth-promise h1 {
    font-size: 42px;
  }

  .auth-promise > p {
    font-size: 14px;
  }

  .auth-proof {
    margin-top: 22px;
  }

  .dashboard-greeting {
    align-items: start;
  }

  .study-streak {
    display: none;
  }

  .continue-copy {
    padding: 28px 24px;
  }

  .continue-progress > span {
    width: 140px;
  }

  .quick-stats {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .quick-stats article {
    padding: 11px;
  }

  .library-course {
    grid-template-columns: 1fr;
  }

  .library-cover {
    min-height: 145px;
  }

  .library-cover > span {
    font-size: 100px;
  }

  .library-body {
    padding: 18px;
  }

  .course-hero-app {
    min-height: 230px;
  }

  .course-hero-app h1 {
    font-size: 27px;
  }

  .course-hero-meta {
    flex-wrap: wrap;
  }

  .course-aside {
    grid-template-columns: 1fr;
  }

  .web-lesson {
    grid-template-columns: 38px 1fr 18px;
  }

  .web-lesson > em {
    display: none;
  }

  .web-lesson > div > small {
    max-width: 190px;
  }

  .video-overlay small {
    padding: 0 25px;
  }

  .lesson-tabs {
    gap: 16px;
    overflow: auto;
  }

  .lesson-tabs button {
    white-space: nowrap;
  }

  .lesson-nav a {
    min-width: 0;
  }

  .exam-intro,
  .quiz-live,
  .exam-result,
  .upcoming-exams {
    padding: 22px;
  }

  .profile-stats,
  .two-fields {
    grid-template-columns: 1fr;
  }
}

.catalog-site {
  background: #fbfaf5;
  min-height: 100dvh;
}

.catalog-header {
  z-index: 20;
  background: #fff;
  border-bottom: 1px solid #e5e7e1;
  height: 82px;
  position: relative;
}

.catalog-nav {
  align-items: center;
  gap: 40px;
  height: 100%;
  display: flex;
}

.catalog-brand {
  align-items: center;
  gap: 10px;
  display: flex;
}

.catalog-brand img {
  border: 1px solid #d9e0dd;
  border-radius: 50%;
  width: 43px;
  height: 43px;
}

.catalog-brand span {
  flex-direction: column;
  display: flex;
}

.catalog-brand b {
  font: 900 15px var(--heading);
}

.catalog-brand small {
  color: #829397;
  font-size: 9px;
}

.catalog-nav > nav {
  gap: 26px;
  margin-inline: auto;
  display: flex;
}

.catalog-nav > nav a,
.catalog-nav > div > a:first-child {
  color: #657b80;
  font-size: 12px;
  font-weight: 700;
}

.catalog-nav > nav a.active {
  color: var(--coral);
}

.catalog-nav > div {
  align-items: center;
  gap: 18px;
  display: flex;
}

.catalog-cta {
  background: var(--deep);
  height: 40px;
  font: 800 11px var(--heading);
  align-items: center;
  padding: 0 17px;
  display: flex;
  color: #fff !important;
}

.catalog-hero {
  background: var(--deep);
  color: #fff;
  padding: 76px 0 70px;
  position: relative;
  overflow: hidden;
}

.catalog-hero:before {
  content: "";
  border: 1px solid #ffffff14;
  border-radius: 50%;
  width: 520px;
  height: 520px;
  position: absolute;
  top: -250px;
  left: -300px;
}

.catalog-hero:after {
  content: "COURSES";
  font: 900 110px var(--heading);
  color: #ffffff09;
  letter-spacing: 0.04em;
  position: absolute;
  bottom: -48px;
  left: 4%;
}

.catalog-hero > .container {
  z-index: 2;
  grid-template-columns: 1.25fr 0.75fr;
  align-items: end;
  gap: 80px;
  display: grid;
  position: relative;
}

.catalog-hero > div > div > span {
  color: #efcb82;
  font-size: 11px;
  font-weight: 800;
}

.catalog-hero h1 {
  font: 900 clamp(44px, 5vw, 66px) / 1.14 var(--heading);
  letter-spacing: -0.04em;
  margin: 12px 0 0;
}

.catalog-hero h1 em {
  color: var(--coral);
  font-style: normal;
}

.catalog-hero p {
  color: #ffffffa6;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
}

.catalog-main {
  padding: 54px 0 100px;
}

.catalog-tools {
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 26px;
  display: flex;
}

.catalog-filters {
  flex-wrap: wrap;
  gap: 6px;
  display: flex;
}

.catalog-filters button {
  color: #687e83;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dfe4df;
  height: 40px;
  padding: 0 16px;
  font-size: 11px;
  font-weight: 800;
}

.catalog-filters button.active {
  background: var(--deep);
  border-color: var(--deep);
  color: #fff;
}

.catalog-tools > label {
  background: #fff;
  border: 1px solid #dfe4df;
  align-items: center;
  gap: 8px;
  width: 285px;
  height: 42px;
  padding: 0 12px;
  display: flex;
}

.catalog-tools > label span {
  color: #829397;
  font-size: 18px;
}

.catalog-tools input {
  width: 100%;
  font-family: var(--body);
  background: 0 0;
  border: 0;
  outline: 0;
  font-size: 10px;
}

.catalog-count {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  display: flex;
}

.catalog-count span {
  font: 800 13px var(--heading);
}

.catalog-count small {
  color: #89999c;
  font-size: 9px;
}

.public-course-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  display: grid;
}

.public-course-card {
  background: #fff;
  border: 1px solid #dfe5e1;
  min-width: 0;
  transition: transform 0.22s, box-shadow 0.22s;
}

.public-course-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 50px -36px #12313980;
}

.public-course-cover {
  height: 210px;
  color: var(--ink);
  background: #c9dfda;
  padding: 19px;
  display: block;
  position: relative;
  overflow: hidden;
}

.public-course-cover.coral {
  color: #fff;
  background: #ef806a;
}

.public-course-cover.mint {
  background: #bedbd6;
}

.public-course-cover.gold {
  background: #e9cb83;
}

.public-course-cover.violet {
  background: #d2c8df;
}

.public-course-cover.sky {
  background: #bcd8e2;
}

.public-course-cover.deep {
  color: #fff;
  background: #245866;
}

.public-course-cover:before {
  content: "";
  border: 1px solid #12313924;
  border-radius: 50%;
  width: 220px;
  height: 220px;
  position: absolute;
  bottom: -110px;
  left: -60px;
}

.public-course-code {
  font: 800 9px var(--heading);
  letter-spacing: 0.14em;
}

.public-course-num {
  font: 800 10px var(--heading);
  position: absolute;
  top: 18px;
  left: 19px;
}

.public-course-cover > b {
  font: 900 155px/1 var(--heading);
  opacity: 0.15;
  position: absolute;
  bottom: -35px;
  right: 24px;
}

.public-course-cover > em {
  color: var(--ink);
  background: #ffffffe0;
  padding: 7px 10px;
  font-size: 9px;
  font-style: normal;
  font-weight: 800;
  position: absolute;
  bottom: 17px;
  right: 18px;
}

.public-course-body {
  padding: 20px;
}

.public-rating {
  justify-content: space-between;
  display: flex;
}

.public-rating span {
  color: #a77a21;
  font-size: 9px;
  font-weight: 900;
}

.public-rating small {
  color: #89999c;
  font-size: 8px;
}

.public-category {
  color: var(--coral);
  margin-top: 16px;
  font-size: 9px;
  font-weight: 800;
  display: block;
}

.public-course-body h2 {
  font: 800 19px var(--heading);
  margin: 4px 0 7px;
}

.public-course-body > p {
  color: #71868a;
  min-height: 54px;
  margin: 0;
  font-size: 10px;
  line-height: 1.75;
}

.public-course-meta {
  color: #7f9296;
  gap: 14px;
  margin: 16px 0;
  font-size: 8px;
  display: flex;
}

.public-course-bottom {
  border-top: 1px solid #e7ebe8;
  justify-content: space-between;
  align-items: end;
  padding-top: 16px;
  display: flex;
}

.public-course-bottom > div {
  flex-direction: column;
  display: flex;
}

.public-course-bottom del {
  color: #9ba7aa;
  font-size: 8px;
}

.public-course-bottom strong {
  font: 900 20px var(--heading);
}

.public-course-bottom strong small {
  font-size: 9px;
}

.public-course-bottom > a {
  color: var(--coral);
  font-size: 10px;
  font-weight: 800;
}

.catalog-empty {
  text-align: center;
  background: #fff;
  border: 1px solid #dfe5e1;
  padding: 70px;
}

.catalog-empty > span {
  color: #829397;
  font-size: 40px;
}

.catalog-empty h2 {
  font: 800 20px var(--heading);
}

.catalog-empty p {
  color: #819397;
}

.catalog-empty button {
  background: var(--deep);
  color: #fff;
  border: 0;
  padding: 11px 18px;
  font-weight: 800;
}

.catalog-help {
  background: #e2eee9;
  padding: 46px 0;
}

.catalog-help > .container {
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  display: flex;
}

.catalog-help span {
  color: var(--coral);
  font-size: 10px;
  font-weight: 800;
}

.catalog-help h2 {
  font: 800 25px var(--heading);
  margin: 4px 0;
}

.catalog-help a {
  background: var(--deep);
  color: #fff;
  font: 800 11px var(--heading);
  white-space: nowrap;
  padding: 14px 20px;
}

.catalog-footer {
  margin-top: 0;
}

.public-detail-hero {
  background: #c9dfda;
  padding: 45px 0 70px;
  overflow: hidden;
}

.public-detail-hero.coral {
  color: #fff;
  background: #ed806b;
}

.public-detail-hero.mint {
  background: #c4dfda;
}

.public-detail-hero.gold {
  background: #e8ca81;
}

.public-detail-hero.violet {
  background: #d2c8df;
}

.public-detail-hero.sky {
  background: #bcd8e2;
}

.public-detail-hero.deep {
  color: #fff;
  background: #245866;
}

.detail-hero-grid {
  grid-template-columns: 1.25fr 0.75fr;
  align-items: center;
  gap: 70px;
  display: grid;
}

.detail-copy {
  z-index: 2;
  position: relative;
}

.detail-breadcrumb {
  opacity: 0.7;
  align-items: center;
  gap: 8px;
  margin-bottom: 35px;
  font-size: 8px;
  display: flex;
}

.detail-breadcrumb a {
  font-weight: 800;
}

.detail-badge {
  color: var(--ink);
  background: #ffffffd4;
  padding: 6px 10px;
  font-size: 9px;
  font-weight: 800;
  display: inline-block;
}

.detail-copy h1 {
  font: 900 clamp(38px, 4.5vw, 60px) / 1.16 var(--heading);
  letter-spacing: -0.04em;
  margin: 14px 0 0;
}

.detail-copy h2 {
  font: 800 17px var(--heading);
  opacity: 0.72;
  margin: 5px 0 14px;
}

.detail-copy > p {
  opacity: 0.76;
  max-width: 670px;
  font-size: 14px;
  line-height: 1.9;
}

.detail-teacher {
  align-items: center;
  gap: 10px;
  margin-top: 27px;
  display: flex;
}

.detail-teacher > span {
  width: 44px;
  height: 44px;
  color: var(--deep);
  background: #fff;
  border-radius: 50%;
  place-items: center;
  font-weight: 900;
  display: grid;
}

.detail-teacher > div {
  flex-direction: column;
  display: flex;
}

.detail-teacher small {
  opacity: 0.65;
  font-size: 8px;
}

.detail-teacher b {
  font: 800 10px var(--heading);
}

.detail-teacher b em {
  font-style: normal;
  font: 500 8px var(--body);
  opacity: 0.65;
}

.detail-teacher > i {
  opacity: 0.2;
  background: currentColor;
  width: 1px;
  height: 30px;
  margin-inline: 8px;
}

.detail-art {
  border: 1px solid #12313929;
  place-items: center;
  height: 330px;
  display: grid;
  position: relative;
  overflow: hidden;
}

.detail-art:before,
.detail-art:after {
  content: "";
  border: 1px solid #1231391f;
  border-radius: 50%;
  position: absolute;
}

.detail-art:before {
  width: 320px;
  height: 320px;
}

.detail-art:after {
  width: 190px;
  height: 190px;
}

.detail-art > span {
  font: 800 10px var(--heading);
  letter-spacing: 0.16em;
  position: absolute;
  top: 20px;
  right: 22px;
}

.detail-art > b {
  font: 900 210px/1 var(--heading);
  opacity: 0.16;
}

.detail-art > small {
  font-weight: 800;
  position: absolute;
  bottom: 20px;
  left: 22px;
}

.course-detail-main {
  background: #fbfaf5;
  padding-bottom: 100px;
}

.detail-layout {
  grid-template-columns: minmax(0, 1fr) 330px;
  align-items: start;
  gap: 50px;
  display: grid;
}

.detail-content {
  min-width: 0;
}

.detail-tabs {
  z-index: 5;
  background: #fbfaf5;
  border-bottom: 1px solid #dfe4df;
  align-items: center;
  gap: 34px;
  height: 70px;
  display: flex;
  position: sticky;
  top: 0;
}

.detail-tabs a {
  color: #71868a;
  font-size: 10px;
  font-weight: 800;
}

.detail-tabs a:first-child {
  color: var(--coral);
}

.detail-content > article {
  border-bottom: 1px solid #dfe4df;
  padding: 58px 0;
}

.detail-section-tag {
  color: var(--coral);
  font-size: 10px;
  font-weight: 800;
}

.detail-content > article > h2 {
  font: 800 29px/1.5 var(--heading);
  margin: 8px 0 14px;
}

.detail-content > article > h2 em {
  color: var(--coral);
  font-style: normal;
}

.detail-content > article > p {
  color: #657c81;
  max-width: 790px;
  font-size: 13px;
  line-height: 2;
}

.detail-numbers {
  background: #fff;
  border: 1px solid #dfe5e1;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 30px;
  display: grid;
}

.detail-numbers div {
  border-left: 1px solid #e3e8e4;
  padding: 20px;
}

.detail-numbers div:last-child {
  border-left: 0;
}

.detail-numbers strong {
  font: 900 23px var(--heading);
  display: block;
}

.detail-numbers span {
  color: #84969a;
  font-size: 8px;
}

.outcomes-grid {
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  display: grid;
}

.outcomes-grid > div {
  background: #fff;
  border: 1px solid #dfe5e1;
  gap: 13px;
  padding: 17px;
  display: flex;
}

.outcomes-grid span {
  width: 32px;
  height: 32px;
  color: var(--teal);
  font: 800 9px var(--heading);
  background: #e1efeb;
  flex: none;
  place-items: center;
  display: grid;
}

.outcomes-grid p {
  color: #5f777b;
  margin: 0;
  font-size: 11px;
  line-height: 1.65;
}

.public-syllabus {
  gap: 8px;
  display: grid;
}

.public-syllabus details {
  background: #fff;
  border: 1px solid #dfe5e1;
}

.public-syllabus summary {
  cursor: pointer;
  grid-template-columns: 38px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  list-style: none;
  display: grid;
}

.public-syllabus summary::-webkit-details-marker {
  display: none;
}

.public-syllabus summary > span {
  width: 36px;
  height: 36px;
  font: 800 9px var(--heading);
  background: #e5efec;
  place-items: center;
  display: grid;
}

.public-syllabus summary div {
  flex-direction: column;
  display: flex;
}

.public-syllabus summary b {
  font: 800 12px var(--heading);
}

.public-syllabus summary small {
  color: #84969a;
  font-size: 8px;
}

.public-syllabus summary > i {
  font-style: normal;
}

.public-syllabus details > div {
  border-top: 1px solid #e8ece9;
  padding: 8px 66px 14px;
}

.public-syllabus details > div p {
  color: #71868a;
  margin: 0;
  padding: 5px 0;
  font-size: 9px;
}

.public-syllabus details > div p:before {
  content: "✓";
  color: var(--coral);
  margin-left: 8px;
}

.public-teacher {
  align-items: center;
  display: flex;
  gap: 20px !important;
}

.public-teacher > span {
  background: var(--mint);
  width: 88px;
  height: 88px;
  font: 900 27px var(--heading);
  border-radius: 50%;
  flex: none;
  place-items: center;
  display: grid;
}

.public-teacher > div small {
  color: var(--coral);
  font-size: 9px;
  font-weight: 800;
}

.public-teacher > div h2 {
  font: 800 21px var(--heading);
  margin: 4px 0 !important;
}

.public-teacher > div p {
  margin: 0 !important;
  font-size: 11px !important;
}

.enroll-card {
  z-index: 7;
  background: #fff;
  border: 1px solid #dfe5e1;
  margin-top: -48px;
  padding: 14px 22px 22px;
  position: sticky;
  top: 24px;
  box-shadow: 0 28px 55px -45px #1231398c;
}

.enroll-cover {
  background: #c9dfda;
  place-items: center;
  height: 170px;
  margin: 0 -8px 20px;
  display: grid;
  position: relative;
  overflow: hidden;
}

.enroll-cover.coral {
  color: #fff;
  background: #ed806b;
}

.enroll-cover.gold {
  background: #e8ca81;
}

.enroll-cover.violet {
  background: #d2c8df;
}

.enroll-cover.sky {
  background: #bcd8e2;
}

.enroll-cover.deep {
  color: #fff;
  background: #245866;
}

.enroll-cover > b {
  font: 900 125px/1 var(--heading);
  opacity: 0.13;
}

.enroll-cover > span {
  width: 50px;
  height: 50px;
  color: var(--deep);
  background: #fff;
  border-radius: 50%;
  place-items: center;
  display: grid;
  position: absolute;
  box-shadow: 0 12px 28px #12313933;
}

.enroll-cover > small {
  color: #fff;
  background: #143f4bd1;
  padding: 5px 8px;
  font-size: 8px;
  position: absolute;
  bottom: 12px;
}

.enroll-price {
  flex-direction: column;
  display: flex;
}

.enroll-price del {
  color: #99a6a8;
  font-size: 9px;
}

.enroll-price strong {
  font: 900 30px var(--heading);
}

.enroll-price strong small {
  font-size: 11px;
}

.enroll-card ul {
  border-top: 1px solid #e5e9e6;
  margin: 8px 0;
  padding: 13px 0;
  list-style: none;
}

.enroll-card li {
  color: #657c81;
  padding: 6px 22px 6px 0;
  font-size: 10px;
  position: relative;
}

.enroll-card li:before {
  content: "✓";
  color: #3f897b;
  font-weight: 900;
  position: absolute;
  right: 0;
}

.placement-note {
  background: #f7edda;
  gap: 10px;
  margin-bottom: 13px;
  padding: 11px;
  display: flex;
}

.placement-note > span {
  color: #a87b26;
  font-weight: 900;
}

.placement-note p {
  flex-direction: column;
  margin: 0;
  display: flex;
}

.placement-note b {
  font: 800 9px var(--heading);
}

.placement-note small {
  color: #8a7a5d;
  font-size: 7px;
}

.enroll-card > a {
  background: var(--coral);
  color: #fff;
  height: 48px;
  font: 800 12px var(--heading);
  justify-content: center;
  align-items: center;
  display: flex;
}

.enroll-card > p {
  text-align: center;
  color: #8c9a9d;
  font-size: 8px;
}

.enroll-card > p a {
  color: var(--teal);
  font-weight: 800;
}

.detail-final {
  background: var(--deep);
  color: #fff;
  text-align: center;
  padding: 75px 0;
}

.detail-final h2 {
  font: 900 35px var(--heading);
  margin: 0;
}

.detail-final h2 em {
  color: var(--coral);
  font-style: normal;
}

.detail-final p {
  color: #fff9;
}

.detail-final a {
  color: var(--deep);
  background: #fff;
  margin-top: 10px;
  padding: 13px 22px;
  font-weight: 800;
  display: inline-flex;
}

.catalog-footer {
  color: #fff;
  background: #102e36;
  padding-top: 70px;
}

@media (width<=980px) {
  .catalog-nav > nav {
    display: none;
  }

  .catalog-nav > div {
    margin-right: auto;
  }

  .catalog-hero > .container,
  .detail-hero-grid {
    grid-template-columns: 1fr;
  }

  .detail-art {
    display: none;
  }

  .public-course-grid {
    grid-template-columns: 1fr 1fr;
  }

  .detail-layout {
    grid-template-columns: 1fr;
  }

  .enroll-card {
    grid-row: 1;
    margin: 30px 0 0;
    position: static;
  }

  .detail-content {
    grid-row: 2;
  }

  .enroll-cover {
    height: 220px;
  }

  .course-detail-main {
    padding-top: 25px;
  }
}

@media (width<=680px) {
  .catalog-header {
    height: 70px;
  }

  .catalog-nav {
    gap: 12px;
  }

  .catalog-nav > div > a:first-child {
    display: none;
  }

  .catalog-cta {
    height: 37px;
    padding-inline: 12px;
  }

  .catalog-hero {
    padding: 55px 0;
  }

  .catalog-hero > .container {
    gap: 20px;
  }

  .catalog-hero h1 {
    font-size: 43px;
  }

  .catalog-tools {
    flex-direction: column;
    align-items: stretch;
  }

  .catalog-filters {
    flex-wrap: nowrap;
    padding-bottom: 4px;
    overflow: auto;
  }

  .catalog-filters button {
    white-space: nowrap;
  }

  .catalog-tools > label {
    width: 100%;
  }

  .catalog-count small {
    display: none;
  }

  .public-course-grid {
    grid-template-columns: 1fr;
  }

  .public-course-cover {
    height: 190px;
  }

  .catalog-help > .container {
    flex-direction: column;
    align-items: flex-start;
  }

  .catalog-help h2 {
    font-size: 21px;
  }

  .detail-copy h1 {
    font-size: 38px;
  }

  .detail-teacher {
    flex-wrap: wrap;
  }

  .detail-hero-grid {
    gap: 30px;
  }

  .detail-layout {
    gap: 20px;
  }

  .detail-tabs {
    gap: 22px;
    overflow: auto;
  }

  .detail-tabs a {
    white-space: nowrap;
  }

  .detail-content > article {
    padding: 42px 0;
  }

  .detail-content > article > h2 {
    font-size: 24px;
  }

  .detail-numbers {
    grid-template-columns: 1fr 1fr;
  }

  .detail-numbers div:nth-child(2) {
    border-left: 0;
  }

  .detail-numbers div:nth-child(-n + 2) {
    border-bottom: 1px solid #e3e8e4;
  }

  .outcomes-grid {
    grid-template-columns: 1fr;
  }

  .public-syllabus details > div {
    padding-right: 25px;
  }

  .public-teacher {
    align-items: flex-start !important;
  }

  .public-teacher > span {
    width: 64px;
    height: 64px;
  }

  .detail-final h2 {
    font-size: 29px;
  }
}

.auth-mode-switch {
  text-align: center !important;
  color: #849599 !important;
  margin: 24px 0 0 !important;
  font-size: 10px !important;
}

.auth-mode-switch a {
  color: var(--coral);
  font-weight: 900;
}

.auth-card-tools {
  justify-content: flex-end;
  margin-bottom: 18px;
  display: flex;
}

.auth-card-tools .theme-toggle {
  width: 44px;
  min-width: 44px;
  height: 44px;
  padding: 0;
  position: static;
}

.register-visual {
  background: linear-gradient(145deg, #143f4b, #1f5c69);
}

.register-steps {
  gap: 25px;
  margin-top: 40px;
  display: flex;
}

.register-steps > div {
  border-right: 1px solid #ffffff29;
  flex-direction: column;
  padding-right: 14px;
  display: flex;
}

.register-steps b {
  font: 900 18px var(--heading);
  color: #f0cb80;
}

.register-steps span {
  color: #ffffffa6;
  margin-top: 2px;
  font-size: 9px;
}

.register-includes {
  background: #f5f8f6;
  margin-top: 26px;
  padding: 18px;
}

.register-includes h3 {
  font: 800 12px var(--heading);
  margin: 0 0 12px;
}

.register-includes > div {
  color: #647b80;
  gap: 8px;
  padding: 6px 0;
  font-size: 10px;
  display: flex;
}

.register-includes > div span {
  color: #3c8577;
  font-weight: 900;
}

.platform-badge {
  color: #397e70;
  width: max-content;
  font: 800 7px var(--body);
  background: #e2f0ec;
  border: 0;
  margin-top: 5px;
  padding: 3px 6px;
  display: block;
}

.platform-badge.app {
  color: #78558c;
  background: #eee6f6;
}

.platform-badge.both {
  color: #98752f;
  background: #f6edd7;
}

.app-only-gate {
  color: #fff;
  text-align: center;
  background: linear-gradient(145deg, #143f4b, #1b5360);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 520px;
  padding: 55px;
  display: flex;
  position: relative;
  overflow: hidden;
}

.app-only-gate:before {
  content: "";
  border: 1px solid #ffffff14;
  border-radius: 50%;
  width: 420px;
  height: 420px;
  position: absolute;
}

.app-gate-mark {
  z-index: 2;
  background: #fff;
  border-radius: 50%;
  width: 75px;
  height: 75px;
  padding: 8px;
  position: relative;
}

.app-gate-mark img {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}

.app-only-gate > span {
  color: #efca7e;
  margin-top: 18px;
  font-size: 10px;
  font-weight: 800;
  position: relative;
}

.app-only-gate h1 {
  font: 900 27px var(--heading);
  margin: 8px 0;
  position: relative;
}

.app-only-gate > p {
  color: #ffffffa6;
  max-width: 550px;
  font-size: 12px;
  line-height: 1.8;
  position: relative;
}

.app-only-gate > div:not(.app-gate-mark) {
  gap: 10px;
  margin-top: 15px;
  display: flex;
  position: relative;
}

.app-only-gate > div a {
  color: var(--deep);
  background: #fff;
  padding: 12px 18px;
  font-size: 10px;
  font-weight: 800;
}

.app-only-gate > div a:first-child {
  background: var(--coral);
  color: #fff;
}

.app-only-gate > small {
  color: #ffffff73;
  margin-top: 18px;
  position: relative;
}

.library-public-hero {
  background: #f0e6cf;
  padding: 75px 0;
  overflow: hidden;
}

.library-public-hero > .container {
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 60px;
  display: grid;
}

.library-public-hero > div > div:first-child > span {
  color: #a77728;
  font-size: 11px;
  font-weight: 800;
}

.library-public-hero h1 {
  font: 900 clamp(44px, 5vw, 66px) / 1.2 var(--heading);
  letter-spacing: -0.04em;
  margin: 12px 0;
}

.library-public-hero h1 em {
  color: var(--coral);
  font-style: normal;
}

.library-public-hero p {
  color: #687e82;
  max-width: 580px;
  line-height: 1.9;
}

.hero-books {
  justify-content: center;
  align-items: end;
  height: 300px;
  display: flex;
  position: relative;
}

.hero-books i {
  background: #245866;
  border: 4px solid #ffffffa6;
  width: 130px;
  height: 230px;
  display: block;
  position: absolute;
  transform: rotate(-7deg);
  box-shadow: 0 28px 40px -26px #1231398c;
}

.hero-books i:nth-child(2) {
  z-index: 2;
  background: #ef806a;
  height: 260px;
  transform: none;
}

.hero-books i:nth-child(3) {
  background: #bcd9d4;
  transform: rotate(8deg);
}

.hero-books i:before {
  content: "إسلام سلامة";
  color: #ffffffd9;
  font: 900 10px var(--heading);
  padding: 17px;
  display: block;
}

.hero-books span {
  z-index: 3;
  background: #fff;
  padding: 9px 14px;
  font-size: 9px;
  font-weight: 800;
  position: absolute;
  bottom: -13px;
}

.public-library-main {
  padding: 85px 0 100px;
}

.library-intro {
  justify-content: space-between;
  align-items: end;
  margin-bottom: 35px;
  display: flex;
}

.library-intro > div > span {
  color: var(--coral);
  font-size: 10px;
  font-weight: 800;
}

.library-intro h2 {
  font: 800 30px var(--heading);
  margin: 5px 0;
}

.format-legend {
  color: #71868a;
  gap: 18px;
  font-size: 9px;
  display: flex;
}

.format-legend span {
  align-items: center;
  gap: 6px;
  display: flex;
}

.format-legend i {
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.format-legend i.digital {
  background: #77578a;
}

.format-legend i.printed {
  background: #3e8778;
}

.book-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  display: grid;
}

.book-card {
  background: #fff;
  border: 1px solid #dfe5e1;
}

.book-cover {
  background: #c6ddd8;
  flex-direction: column;
  height: 285px;
  margin: 18px 35px 0;
  padding: 24px;
  display: flex;
  position: relative;
  overflow: hidden;
  box-shadow: 9px 11px #1231391a;
}

.book-cover.coral {
  color: #fff;
  background: #ed806b;
}

.book-cover.mint {
  background: #bcd9d4;
}

.book-cover.violet {
  background: #d3c9df;
}

.book-cover.gold {
  background: #e9cc86;
}

.book-cover.sky {
  background: #bad7e0;
}

.book-cover.deep {
  color: #fff;
  background: #245866;
}

.book-cover:before {
  content: "";
  border: 1px solid #12313921;
  border-radius: 50%;
  width: 220px;
  height: 220px;
  position: absolute;
  bottom: -90px;
  left: -110px;
}

.book-cover > span {
  font: 800 9px var(--heading);
  letter-spacing: 0.13em;
}

.book-cover > b {
  font: 900 25px/1.55 var(--heading);
  z-index: 2;
  margin: auto 0;
  position: relative;
}

.book-cover > small {
  opacity: 0.7;
  font-size: 8px;
  font-weight: 800;
}

.book-cover > em {
  color: var(--ink);
  background: #fff;
  padding: 6px 8px;
  font-size: 8px;
  font-style: normal;
  font-weight: 800;
  position: absolute;
  top: 14px;
  left: 14px;
}

.book-body {
  padding: 24px;
}

.book-body > span {
  color: var(--coral);
  font-size: 8px;
  font-weight: 800;
}

.book-body h2 {
  font: 800 18px var(--heading);
  margin: 4px 0 7px;
}

.book-body > p {
  color: #71868a;
  min-height: 52px;
  font-size: 10px;
  line-height: 1.7;
}

.book-formats {
  border-top: 1px solid #e5e9e6;
  border-bottom: 1px solid #e5e9e6;
  grid-template-columns: 1fr 1fr;
  margin: 16px 0;
  display: grid;
}

.book-formats > div {
  padding: 11px;
}

.book-formats > div:first-child {
  border-left: 1px solid #e5e9e6;
}

.book-formats small {
  color: #87979a;
  font-size: 7px;
  display: block;
}

.book-formats b {
  font: 900 14px var(--heading);
}

.book-details {
  color: var(--coral);
  justify-content: space-between;
  font-size: 10px;
  font-weight: 800;
  display: flex;
}

.library-app-note {
  color: #fff;
  background: #143f4b;
  padding: 52px 0;
}

.library-app-note > .container {
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: 20px;
  display: grid;
}

.app-note-icon {
  background: #fff;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  padding: 7px;
}

.app-note-icon img {
  border-radius: 50%;
}

.library-app-note span {
  color: #efcb82;
  font-size: 9px;
  font-weight: 800;
}

.library-app-note h2 {
  font: 800 24px var(--heading);
  margin: 4px 0;
}

.library-app-note p {
  color: #ffffff94;
  margin: 0;
  font-size: 10px;
}

.library-app-note > a {
  color: var(--deep);
  white-space: nowrap;
  background: #fff;
  padding: 13px 18px;
  font-size: 10px;
  font-weight: 800;
}

.book-detail-hero {
  background: #f0e7d3;
  padding: 60px 0;
}

.book-detail-grid {
  grid-template-columns: 350px 1fr;
  align-items: center;
  gap: 90px;
  display: grid;
}

.large-book-cover,
.order-book-cover {
  background: #c5ddd8;
  flex-direction: column;
  height: 440px;
  padding: 35px;
  display: flex;
  position: relative;
  box-shadow: 16px 19px #1231391c;
}

.large-book-cover.coral,
.order-book-cover.coral {
  color: #fff;
  background: #ed806b;
}

.large-book-cover.mint,
.order-book-cover.mint {
  background: #bcd9d4;
}

.large-book-cover.violet,
.order-book-cover.violet {
  background: #d3c9df;
}

.large-book-cover.gold,
.order-book-cover.gold {
  background: #e9cc86;
}

.large-book-cover.sky,
.order-book-cover.sky {
  background: #bad7e0;
}

.large-book-cover.deep,
.order-book-cover.deep {
  color: #fff;
  background: #245866;
}

.large-book-cover > span,
.order-book-cover > span {
  font: 800 10px var(--heading);
  letter-spacing: 0.15em;
}

.large-book-cover > b,
.order-book-cover > b {
  font: 900 34px/1.55 var(--heading);
  margin: auto 0;
}

.large-book-cover > small,
.order-book-cover > small {
  opacity: 0.65;
  font-size: 9px;
  font-weight: 800;
}

.book-detail-badge {
  color: var(--coral);
  background: #fff;
  padding: 6px 9px;
  font-size: 9px;
  font-weight: 800;
  display: inline-block;
}

.book-detail-copy h1 {
  font: 900 43px/1.3 var(--heading);
  margin: 12px 0 0;
}

.book-detail-copy h2 {
  font: 700 16px var(--heading);
  color: #6b8084;
  margin: 4px 0 17px;
}

.book-detail-copy > p {
  color: #61777c;
  max-width: 700px;
  line-height: 1.9;
}

.book-author {
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  display: flex;
}

.book-author > span {
  background: #fff;
  border-radius: 50%;
  place-items: center;
  width: 43px;
  height: 43px;
  font-weight: 900;
  display: grid;
}

.book-author > div {
  flex-direction: column;
  display: flex;
}

.book-author small {
  color: #839397;
  font-size: 8px;
}

.book-author b {
  font: 800 10px var(--heading);
}

.book-author > i {
  background: #bbc5c1;
  width: 1px;
  height: 28px;
  margin-inline: 10px;
}

.book-detail-main {
  padding: 65px 0 100px;
}

.book-info-layout {
  grid-template-columns: 1fr 350px;
  align-items: start;
  gap: 55px;
  display: grid;
}

.book-info-content > article {
  border-bottom: 1px solid #dfe5e1;
  margin-bottom: 55px;
  padding: 0 0 55px;
}

.book-info-content h2 {
  font: 800 28px var(--heading);
  margin: 7px 0;
}

.book-info-content > article > p {
  color: #657c81;
  font-size: 13px;
  line-height: 2;
}

.book-feature-grid {
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 25px;
  display: grid;
}

.book-feature-grid > div {
  background: #fff;
  border: 1px solid #dfe5e1;
  gap: 11px;
  padding: 16px;
  display: flex;
}

.book-feature-grid span {
  color: #3f8275;
  width: 30px;
  height: 30px;
  font: 800 8px var(--heading);
  background: #e3efeb;
  flex: none;
  place-items: center;
  display: grid;
}

.book-feature-grid p {
  color: #61777c;
  margin: 5px 0;
  font-size: 10px;
}

.book-chapters {
  background: #fff;
  border: 1px solid #dfe5e1;
}

.book-chapters > div {
  border-bottom: 1px solid #e7ebe8;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 16px;
  display: grid;
}

.book-chapters > div:last-child {
  border: 0;
}

.book-chapters span {
  font: 800 9px var(--heading);
  color: var(--coral);
}

.book-chapters b {
  font: 800 11px var(--heading);
}

.book-chapters small {
  color: #89999c;
  font-size: 8px;
}

.digital-policy {
  background: #e3efeb;
  display: flex;
  border: 0 !important;
  gap: 18px !important;
  padding: 27px !important;
}

.digital-policy > span {
  color: #77578a;
  background: #fff;
  flex: none;
  place-items: center;
  width: 50px;
  height: 50px;
  font-size: 20px;
  display: grid;
}

.digital-policy h2 {
  margin: 0 !important;
  font-size: 19px !important;
}

.digital-policy p {
  margin: 5px 0 !important;
  font-size: 10px !important;
}

.digital-policy a {
  color: #77578a;
  font-size: 9px;
  font-weight: 800;
}

.book-buy-card {
  background: #fff;
  border: 1px solid #dfe5e1;
  padding: 24px;
  position: sticky;
  top: 25px;
}

.book-buy-card > h2 {
  font: 800 18px var(--heading);
  margin: 0 0 15px;
}

.book-format-option {
  border: 1px solid #dfe5e1;
  margin-bottom: 12px;
  padding: 15px;
}

.book-format-option > div {
  gap: 10px;
  display: flex;
}

.book-format-option > div > span {
  color: #77578a;
  background: #eee7f4;
  place-items: center;
  width: 36px;
  height: 36px;
  display: grid;
}

.book-format-option.print > div > span {
  color: #3f8275;
  background: #e3efeb;
}

.book-format-option p {
  flex-direction: column;
  margin: 0;
  display: flex;
}

.book-format-option p b {
  font: 800 11px var(--heading);
}

.book-format-option p small {
  color: #89999c;
  font-size: 8px;
}

.book-format-option > strong {
  font: 900 24px var(--heading);
  margin-top: 12px;
  display: block;
}

.book-format-option > strong small {
  font-size: 9px;
}

.book-format-option ul {
  border-top: 1px solid #e6eae7;
  padding: 10px 0;
  list-style: none;
}

.book-format-option li {
  color: #71868a;
  padding: 4px 15px 4px 0;
  font-size: 8px;
  position: relative;
}

.book-format-option li:before {
  content: "✓";
  color: #3e8476;
  position: absolute;
  right: 0;
}

.book-format-option > a {
  color: #fff;
  background: #77578a;
  justify-content: center;
  align-items: center;
  height: 42px;
  font-size: 9px;
  font-weight: 800;
  display: flex;
}

.book-format-option.print > a {
  background: var(--deep);
}

.book-buy-card > p {
  text-align: center;
  color: #89999c;
  font-size: 8px;
}

.order-page {
  background: #f4f6f3;
  min-height: calc(100dvh - 82px);
  padding: 60px 0 90px;
}

.order-layout {
  grid-template-columns: 340px 1fr;
  align-items: start;
  gap: 55px;
  display: grid;
}

.order-product > a {
  color: var(--coral);
  font-size: 9px;
  font-weight: 800;
}

.order-book-cover {
  height: 390px;
  margin-top: 18px;
}

.order-product > div:last-child {
  margin-top: 25px;
}

.order-product > div:last-child > span {
  color: var(--coral);
  font-size: 8px;
  font-weight: 800;
}

.order-product h2 {
  font: 800 17px var(--heading);
  margin: 4px 0;
}

.order-product p {
  color: #7c8f93;
  font-size: 9px;
  line-height: 1.7;
}

.order-form {
  background: #fff;
  border: 1px solid #dfe5e1;
  padding: 35px;
}

.order-heading > span {
  color: var(--coral);
  font-size: 9px;
  font-weight: 800;
}

.order-heading h1 {
  font: 900 27px var(--heading);
  margin: 5px 0;
}

.order-heading p {
  color: #71868a;
  font-size: 10px;
}

.order-form section {
  border-top: 1px solid #e5e9e6;
  margin-top: 25px;
  padding-top: 20px;
}

.order-form section h2 {
  font: 800 13px var(--heading);
  margin: 0 0 12px;
}

.order-two {
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  display: grid;
}

.order-form label:not(.payment-options label) {
  flex-direction: column;
  gap: 6px;
  display: flex;
}

.order-form label > span {
  color: #697f84;
  font-size: 8px;
  font-weight: 800;
}

.order-form input:not([type="radio"]) {
  height: 44px;
  font-family: var(--body);
  background: #f7f9f7;
  border: 1px solid #dce3df;
  outline: 0;
  padding: 0 11px;
}

.shipping-hint {
  color: #846d42;
  background: #f7eedb;
  padding: 8px;
  font-size: 8px;
}

.payment-options {
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  display: grid;
}

.payment-options label {
  cursor: pointer;
  border: 1px solid #dce3df;
  gap: 8px;
  padding: 11px;
  display: flex;
}

.payment-options label:has(input:checked) {
  border-color: var(--teal);
  background: #f0f6f4;
}

.payment-options input {
  accent-color: var(--teal);
}

.payment-options span {
  flex-direction: column;
  display: flex;
}

.payment-options b {
  font: 800 9px var(--heading);
}

.payment-options small {
  color: #89999c;
  margin-top: 2px;
  font-size: 7px;
}

.order-summary {
  background: #f5f7f5;
  margin-top: 22px;
  padding: 16px;
}

.order-summary > div {
  color: #6d8286;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 9px;
  display: flex;
}

.order-summary .total {
  color: var(--ink);
  border-top: 1px solid #dfe5e1;
  margin-top: 5px;
  padding-top: 12px;
}

.order-summary .total b {
  font: 900 18px var(--heading);
}

.submit-order {
  background: var(--coral);
  color: #fff;
  width: 100%;
  height: 50px;
  font: 800 11px var(--heading);
  cursor: pointer;
  border: 0;
  margin-top: 15px;
}

.submit-order:disabled {
  opacity: 0.6;
}

.order-terms {
  text-align: center;
  color: #929fa2;
  margin-top: 10px;
  font-size: 7px;
  display: block;
}

.order-error {
  color: #a34f43;
  background: #fbe6e2;
  padding: 9px;
  font-size: 9px;
}

.order-success {
  text-align: center;
  background: #fff;
  border: 1px solid #dfe5e1;
  padding: 65px;
}

.order-success > span {
  color: #3f8476;
  background: #e2efeb;
  border-radius: 50%;
  place-items: center;
  width: 65px;
  height: 65px;
  margin: auto;
  font-size: 25px;
  display: grid;
}

.order-success h1 {
  font: 900 28px var(--heading);
}

.order-success p {
  color: #71868a;
}

.order-success p b {
  direction: ltr;
  display: inline-block;
}

.order-success > strong {
  font: 900 36px var(--heading);
  color: var(--coral);
  display: block;
}

.order-success > small {
  color: #71868a;
  max-width: 500px;
  margin: 8px auto 20px;
  display: block;
}

.order-success > div {
  justify-content: center;
  gap: 10px;
  display: flex;
}

.order-success a {
  background: var(--deep);
  color: #fff;
  padding: 11px 16px;
  font-size: 9px;
  font-weight: 800;
}

.order-success a:last-child {
  color: var(--deep);
  background: #eef3f0;
}

@media (width<=980px) {
  .book-grid {
    grid-template-columns: 1fr 1fr;
  }

  .book-detail-grid {
    grid-template-columns: 280px 1fr;
    gap: 45px;
  }

  .large-book-cover {
    height: 370px;
  }

  .book-info-layout {
    grid-template-columns: 1fr;
  }

  .book-buy-card {
    grid-row: 1;
    position: static;
  }

  .book-info-content {
    grid-row: 2;
  }

  .order-layout {
    grid-template-columns: 260px 1fr;
  }

  .order-book-cover {
    height: 330px;
  }
}

@media (width<=680px) {
  .register-steps {
    flex-direction: column;
    gap: 10px;
  }

  .library-public-hero > .container {
    grid-template-columns: 1fr;
  }

  .hero-books {
    display: none;
  }

  .library-intro {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .format-legend {
    flex-direction: column;
    gap: 6px;
  }

  .book-grid {
    grid-template-columns: 1fr;
  }

  .book-cover {
    height: 260px;
    margin-inline: 45px;
  }

  .library-app-note > .container {
    grid-template-columns: 52px 1fr;
  }

  .app-note-icon {
    width: 52px;
    height: 52px;
  }

  .library-app-note > a {
    grid-column: 1/-1;
    width: max-content;
  }

  .book-detail-grid {
    grid-template-columns: 1fr;
  }

  .large-book-cover {
    width: min(310px, 90%);
    height: 390px;
    margin: auto;
  }

  .book-detail-copy h1 {
    font-size: 34px;
  }

  .book-info-layout {
    gap: 25px;
  }

  .book-feature-grid {
    grid-template-columns: 1fr;
  }

  .book-chapters > div {
    grid-template-columns: 32px 1fr;
  }

  .book-chapters small {
    display: none;
  }

  .book-buy-card {
    padding: 16px;
  }

  .order-layout {
    grid-template-columns: 1fr;
  }

  .order-product {
    display: none;
  }

  .order-form {
    padding: 22px;
  }

  .order-two,
  .payment-options {
    grid-template-columns: 1fr;
  }

  .order-success {
    padding: 45px 20px;
  }

  .app-only-gate {
    min-height: 430px;
    padding: 35px 20px;
  }

  .app-only-gate > div:not(.app-gate-mark) {
    flex-direction: column;
  }
}

.profile-actions {
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  display: flex;
}

.profile-actions .profile-edit,
.profile-actions .signout {
  margin-top: 0;
  padding: 10px 18px;
  font-size: 10px;
  font-weight: 800;
  display: inline-block;
}

.profile-edit {
  background: var(--deep);
  color: #fff;
}

.profile-actions .signout {
  color: var(--coral);
  cursor: pointer;
  background: 0 0;
  border: 1px solid #e7aaa0;
}

.platform-key {
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 0 15px;
  display: flex;
}

.platform-key > span {
  color: #70858a;
  align-items: center;
  gap: 6px;
  font-size: 8px;
  display: flex;
}

.platform-key i {
  border-radius: 50%;
  width: 8px;
  height: 8px;
}

.platform-key i.web {
  background: #3e8879;
}

.platform-key i.app {
  background: #77578a;
}

.platform-key i.preview {
  background: #c89535;
}

.public-syllabus mark {
  border: 0;
  margin-left: 6px;
  padding: 2px 5px;
  font-size: 7px;
  font-weight: 800;
}

.public-syllabus mark.web {
  color: #3e8879;
  background: #e1f0eb;
}

.public-syllabus mark.app {
  color: #77578a;
  background: #eee7f4;
}

.public-syllabus mark.preview {
  color: #9a752d;
  background: #f6edd8;
}

.theme-toggle {
  z-index: 1000;
  left: max(18px, env(safe-area-inset-left));
  bottom: max(18px, env(safe-area-inset-bottom));
  color: #081b3a;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  cursor: pointer;
  min-width: 54px;
  height: 48px;
  font: 800 10px var(--heading);
  background: #fbfcfff0;
  border: 1px solid #081b3a29;
  border-radius: 999px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 0 15px;
  transition: transform 0.2s, background 0.2s, color 0.2s, border-color 0.2s;
  display: inline-flex;
  position: fixed;
  box-shadow: 0 14px 35px -18px #0206178c;
}

.theme-toggle:hover {
  transform: translateY(-2px);
}

.theme-toggle:focus-visible {
  outline-offset: 3px;
  outline: 3px solid #ffb000;
}

.theme-toggle-sun,
.theme-toggle-moon {
  width: 19px;
  font-size: 18px;
  line-height: 1;
}

.theme-toggle-moon {
  display: none;
}

html[data-theme="dark"] {
  --lightningcss-light: ;
  --lightningcss-dark: initial;
  color-scheme: dark;
  --ink: #f2f7ff;
  --deep: #061147;
  --teal: #5ba8ff;
  --mint: #182a4c;
  --cream: #050d1f;
  --paper: #020617;
  --line: #cfe0ff21;
  --dark-bg: #020617;
  --dark-surface: #081126;
  --dark-surface-2: #0d1b35;
  --dark-surface-3: #142545;
  --dark-line: #cfe0ff21;
  --dark-text: #f2f7ff;
  --dark-muted: #b4c3db;
  --dark-subtle: #899bb7;
}

html[data-theme="dark"] body {
  background: var(--dark-bg);
  color: var(--dark-text);
}

html[data-theme="dark"] .theme-toggle {
  color: var(--dark-text);
  border-color: var(--dark-line);
  background: #111d21f0;
  box-shadow: 0 14px 38px -16px #000000d9;
}

html[data-theme="dark"] .theme-toggle-sun {
  display: none;
}

html[data-theme="dark"] .theme-toggle-moon {
  display: inline-block;
}

html[data-theme="dark"] .courses,
html[data-theme="dark"] .faq-section {
  background: var(--dark-bg);
}

html[data-theme="dark"] .story,
html[data-theme="dark"] .cta-section {
  background: #050b1c;
}

html[data-theme="dark"] .course-card,
html[data-theme="dark"] .faq-list details {
  background: var(--dark-surface);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .course-card:hover {
  box-shadow: 0 24px 54px -28px #000c;
}

html[data-theme="dark"] .course-content p,
html[data-theme="dark"] .split-heading > p,
html[data-theme="dark"] .story-copy > p,
html[data-theme="dark"] .faq-title p,
html[data-theme="dark"] .faq-list details p {
  color: var(--dark-muted);
}

html[data-theme="dark"] .story-visual {
  background: var(--dark-surface-3);
}

html[data-theme="dark"] .story-copy li,
html[data-theme="dark"] .faq-list details {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .button-light {
  background: var(--dark-surface);
  color: var(--dark-text);
}

html[data-theme="dark"] .button-light:hover {
  background: var(--dark-surface-3);
}

html[data-theme="dark"] .mobile-menu nav {
  background: var(--dark-surface);
  color: var(--dark-text);
}

html[data-theme="dark"] .mobile-menu nav a {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .course-cover {
  color: var(--dark-text);
  background: #123462;
}

html[data-theme="dark"] .course-card.blue .course-cover {
  background: #103059;
}

html[data-theme="dark"] .course-card.gold .course-cover {
  background: #4b3a17;
}

html[data-theme="dark"] .level-pill {
  background: var(--dark-surface);
  color: var(--dark-text);
}

html[data-theme="dark"] .catalog-site,
html[data-theme="dark"] .catalog-main,
html[data-theme="dark"] .course-detail-main,
html[data-theme="dark"] .public-library-main,
html[data-theme="dark"] .book-detail-main {
  background: var(--dark-bg);
  color: var(--dark-text);
}

html[data-theme="dark"] .catalog-header {
  background: var(--dark-surface);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .catalog-brand small,
html[data-theme="dark"] .catalog-nav > nav a,
html[data-theme="dark"] .catalog-nav > div > a:first-child {
  color: var(--dark-muted);
}

html[data-theme="dark"] .catalog-filters button,
html[data-theme="dark"] .catalog-tools > label,
html[data-theme="dark"] .public-course-card,
html[data-theme="dark"] .catalog-empty,
html[data-theme="dark"] .detail-numbers,
html[data-theme="dark"] .outcomes-grid > div,
html[data-theme="dark"] .public-syllabus details,
html[data-theme="dark"] .enroll-card,
html[data-theme="dark"] .book-card,
html[data-theme="dark"] .book-feature-grid > div,
html[data-theme="dark"] .book-chapters,
html[data-theme="dark"] .book-buy-card {
  background: var(--dark-surface);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .catalog-filters button {
  color: var(--dark-muted);
}

html[data-theme="dark"] .catalog-filters button.active {
  background: var(--teal);
  border-color: var(--teal);
  color: #061147;
}

html[data-theme="dark"] .public-course-cover {
  color: var(--dark-text);
  background: #123462;
}

html[data-theme="dark"] .public-course-cover.mint {
  background: #153a6a;
}

html[data-theme="dark"] .public-course-cover.gold {
  background: #4c3a17;
}

html[data-theme="dark"] .public-course-cover.violet {
  background: #242a50;
}

html[data-theme="dark"] .public-course-cover.sky {
  background: #12345f;
}

html[data-theme="dark"] .public-course-cover.deep {
  background: #0a2850;
}

html[data-theme="dark"] .public-course-cover > em {
  background: var(--dark-surface);
  color: var(--dark-text);
}

html[data-theme="dark"] .catalog-tools input,
html[data-theme="dark"] .student-search input {
  color: var(--dark-text);
}

html[data-theme="dark"] .public-course-body > p,
html[data-theme="dark"] .public-course-meta,
html[data-theme="dark"] .public-rating small,
html[data-theme="dark"] .catalog-count small,
html[data-theme="dark"] .detail-tabs a,
html[data-theme="dark"] .detail-content > article > p,
html[data-theme="dark"] .outcomes-grid p,
html[data-theme="dark"] .public-syllabus summary small,
html[data-theme="dark"] .public-syllabus details > div p,
html[data-theme="dark"] .enroll-card li,
html[data-theme="dark"] .enroll-card > p,
html[data-theme="dark"] .library-public-hero p,
html[data-theme="dark"] .format-legend,
html[data-theme="dark"] .book-body > p,
html[data-theme="dark"] .book-formats small,
html[data-theme="dark"] .book-detail-copy > p,
html[data-theme="dark"] .book-detail-copy h2,
html[data-theme="dark"] .book-info-content > article > p,
html[data-theme="dark"] .book-feature-grid p {
  color: var(--dark-muted);
}

html[data-theme="dark"] .public-course-bottom,
html[data-theme="dark"] .detail-tabs,
html[data-theme="dark"] .detail-content > article,
html[data-theme="dark"] .detail-numbers div,
html[data-theme="dark"] .public-syllabus details > div,
html[data-theme="dark"] .enroll-card ul,
html[data-theme="dark"] .book-formats,
html[data-theme="dark"] .book-formats > div:first-child,
html[data-theme="dark"] .book-info-content > article,
html[data-theme="dark"] .book-chapters > div {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .detail-tabs {
  background: var(--dark-bg);
}

html[data-theme="dark"] .catalog-help {
  background: var(--dark-surface-3);
}

html[data-theme="dark"] .library-public-hero,
html[data-theme="dark"] .book-detail-hero {
  background: #0d1b32;
}

html[data-theme="dark"] .hero-books span,
html[data-theme="dark"] .book-cover > em,
html[data-theme="dark"] .book-detail-badge,
html[data-theme="dark"] .detail-badge {
  background: var(--dark-surface);
  color: var(--dark-text);
}

html[data-theme="dark"] .book-cover,
html[data-theme="dark"] .large-book-cover,
html[data-theme="dark"] .order-book-cover {
  color: var(--dark-text);
  background: #123462;
}

html[data-theme="dark"] .book-cover.mint,
html[data-theme="dark"] .large-book-cover.mint,
html[data-theme="dark"] .order-book-cover.mint {
  background: #153a6a;
}

html[data-theme="dark"] .book-cover.violet,
html[data-theme="dark"] .large-book-cover.violet,
html[data-theme="dark"] .order-book-cover.violet {
  background: #242a50;
}

html[data-theme="dark"] .book-cover.gold,
html[data-theme="dark"] .large-book-cover.gold,
html[data-theme="dark"] .order-book-cover.gold {
  background: #4c3a17;
}

html[data-theme="dark"] .book-cover.sky,
html[data-theme="dark"] .large-book-cover.sky,
html[data-theme="dark"] .order-book-cover.sky {
  background: #12345f;
}

html[data-theme="dark"] .book-cover.deep,
html[data-theme="dark"] .large-book-cover.deep,
html[data-theme="dark"] .order-book-cover.deep {
  background: #0a2850;
}

html[data-theme="dark"] .book-author > span {
  background: var(--dark-surface-3);
  color: var(--dark-text);
}

html[data-theme="dark"] .digital-policy {
  background: var(--dark-surface-3);
}

html[data-theme="dark"] .digital-policy > span {
  background: var(--dark-surface);
}

html[data-theme="dark"] .auth-page,
html[data-theme="dark"] .auth-form-side {
  background: var(--dark-bg);
}

html[data-theme="dark"] .auth-card {
  color: var(--dark-text);
}

html[data-theme="dark"] .auth-card > p,
html[data-theme="dark"] .auth-benefits small,
html[data-theme="dark"] .auth-terms,
html[data-theme="dark"] .auth-mode-switch {
  color: var(--dark-muted) !important;
}

html[data-theme="dark"] .auth-benefits i {
  background: var(--dark-surface-3);
  color: var(--teal);
}

html[data-theme="dark"] .auth-separator {
  color: var(--dark-subtle);
}

html[data-theme="dark"] .auth-separator:before,
html[data-theme="dark"] .auth-separator:after {
  background: var(--dark-line);
}

html[data-theme="dark"] .register-includes {
  background: var(--dark-surface);
}

html[data-theme="dark"] .register-includes > div {
  color: var(--dark-muted);
}

html[data-theme="dark"] .auth-card fieldset {
  background: var(--dark-surface);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .auth-card fieldset legend,
html[data-theme="dark"] .auth-card label > span,
html[data-theme="dark"] .auth-card form > small,
html[data-theme="dark"] .auth-card fieldset + small {
  color: var(--dark-muted);
}

html[data-theme="dark"] .auth-card input:not([type="checkbox"]),
html[data-theme="dark"] .auth-card select,
html[data-theme="dark"] .auth-card textarea {
  background: var(--dark-surface-2);
  color: var(--dark-text);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .auth-card input::placeholder,
html[data-theme="dark"] .auth-card textarea::placeholder {
  color: var(--dark-subtle);
}

html[data-theme="dark"] .auth-card select option {
  background: var(--dark-surface-2);
  color: var(--dark-text);
}

html[data-theme="dark"] .auth-card input:focus,
html[data-theme="dark"] .auth-card select:focus,
html[data-theme="dark"] .auth-card textarea:focus {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px #5ba8ff2e;
}

html[data-theme="dark"] .auth-card [class*="identityNotice"],
html[data-theme="dark"] .auth-card [class*="verifiedIdentity"] {
  background: var(--dark-surface-3);
  border-color: #5ba8ff4d;
}

html[data-theme="dark"] .auth-card [class*="identityNotice"] small,
html[data-theme="dark"] .auth-card [class*="verifiedIdentity"] small {
  color: var(--dark-muted);
}

html[data-theme="dark"] .auth-card label:has(> input[type="checkbox"]) {
  color: var(--dark-muted);
}

html[data-theme="dark"] .auth-card label:has(> input[type="checkbox"]) a {
  color: var(--teal);
}

html[data-theme="dark"] .auth-card [role="alert"] {
  color: #ffb6aa;
  background: #321d1d;
  border-color: #ff97874d;
}

html[data-theme="dark"] .auth-primary:hover {
  color: #061147;
}

html[data-theme="dark"] .student-app {
  background: var(--dark-bg);
  color: var(--dark-text);
}

html[data-theme="dark"] .student-topbar,
html[data-theme="dark"] .student-mobile-nav,
html[data-theme="dark"] .dashboard-section,
html[data-theme="dark"] .weekly-card,
html[data-theme="dark"] .study-streak,
html[data-theme="dark"] .quick-stats article,
html[data-theme="dark"] .library-course,
html[data-theme="dark"] .module-card,
html[data-theme="dark"] .overall-progress,
html[data-theme="dark"] .teacher-note,
html[data-theme="dark"] .lesson-heading,
html[data-theme="dark"] .lesson-tabs,
html[data-theme="dark"] .lesson-overview,
html[data-theme="dark"] .lesson-nav a,
html[data-theme="dark"] .lesson-playlist,
html[data-theme="dark"] .exam-intro,
html[data-theme="dark"] .quiz-live,
html[data-theme="dark"] .exam-result,
html[data-theme="dark"] .upcoming-exams,
html[data-theme="dark"] .favorite-list a,
html[data-theme="dark"] .empty-state,
html[data-theme="dark"] .profile-card,
html[data-theme="dark"] .profile-settings {
  background: var(--dark-surface);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .student-topbar,
html[data-theme="dark"] .student-mobile-nav {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .student-search,
html[data-theme="dark"] .topbar-actions > button,
html[data-theme="dark"] .profile-stats div,
html[data-theme="dark"] .exam-intro > div,
html[data-theme="dark"] .upcoming-exams article > span {
  background: var(--dark-surface-2);
}

html[data-theme="dark"] .student-search {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .student-user > span,
html[data-theme="dark"] .teacher-note > span,
html[data-theme="dark"] .profile-head > span {
  color: var(--dark-text);
}

html[data-theme="dark"] .dashboard-greeting p,
html[data-theme="dark"] .inner-title p,
html[data-theme="dark"] .study-streak small,
html[data-theme="dark"] .app-section-head p,
html[data-theme="dark"] .mini-course > div > small,
html[data-theme="dark"] .weekly-total span,
html[data-theme="dark"] .week-bars small,
html[data-theme="dark"] .quick-stats small,
html[data-theme="dark"] .library-body p,
html[data-theme="dark"] .library-body small,
html[data-theme="dark"] .module-card summary small,
html[data-theme="dark"] .web-lesson > div > small,
html[data-theme="dark"] .web-lesson > em,
html[data-theme="dark"] .overall-progress p,
html[data-theme="dark"] .teacher-note p,
html[data-theme="dark"] .lesson-heading p,
html[data-theme="dark"] .lesson-overview > p,
html[data-theme="dark"] .lesson-resources article small,
html[data-theme="dark"] .lesson-nav span,
html[data-theme="dark"] .lesson-playlist small,
html[data-theme="dark"] .exam-intro > p,
html[data-theme="dark"] .exam-result p,
html[data-theme="dark"] .upcoming-exams article small,
html[data-theme="dark"] .favorite-list small,
html[data-theme="dark"] .empty-state p,
html[data-theme="dark"] .profile-head p,
html[data-theme="dark"] .profile-stats span,
html[data-theme="dark"] .profile-settings > p {
  color: var(--dark-muted);
}

html[data-theme="dark"] .mini-course,
html[data-theme="dark"] .library-body > div,
html[data-theme="dark"] .library-filters,
html[data-theme="dark"] .module-card > div,
html[data-theme="dark"] .web-lesson,
html[data-theme="dark"] .lesson-resources article,
html[data-theme="dark"] .upcoming-exams article {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .web-lesson:hover,
html[data-theme="dark"] .lesson-playlist nav a.active,
html[data-theme="dark"] .quiz-live > div:last-child button:hover {
  background: var(--dark-surface-3);
}

html[data-theme="dark"] .mini-cover small,
html[data-theme="dark"] .lesson-controls button,
html[data-theme="dark"] .quiz-live > div:last-child button {
  background: var(--dark-surface-2);
  color: var(--dark-text);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .lesson-controls button:first-child {
  background: var(--deep);
  border-color: var(--teal);
}

html[data-theme="dark"] .lesson-tabs button.active,
html[data-theme="dark"] .library-filters button.active {
  color: var(--dark-text);
}

html[data-theme="dark"] .lesson-playlist nav section h3 {
  background: var(--dark-surface-2);
}

html[data-theme="dark"] .lesson-kind,
html[data-theme="dark"] .module-card > summary > span,
html[data-theme="dark"] .quick-stats article > span {
  background: var(--dark-surface-3);
}

html[data-theme="dark"] .profile-settings input {
  background: var(--dark-surface-2);
  color: var(--dark-text);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .order-page {
  background: var(--dark-bg);
}

html[data-theme="dark"] .order-form,
html[data-theme="dark"] .order-success,
html[data-theme="dark"] .book-format-option {
  background: var(--dark-surface);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .order-form section,
html[data-theme="dark"] .order-summary .total,
html[data-theme="dark"] .book-format-option ul {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .order-form input:not([type="radio"]),
html[data-theme="dark"] .order-summary {
  background: var(--dark-surface-2);
  color: var(--dark-text);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .payment-options label {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .payment-options label:has(input:checked) {
  background: var(--dark-surface-3);
}

html[data-theme="dark"] .teacher-site {
  background: var(--dark-bg);
  color: var(--dark-text);
  --teacher-ink: var(--dark-text);
  --teacher-mint: #153a6a;
}

html[data-theme="dark"] .teacher-proof,
html[data-theme="dark"] .teacher-courses-section {
  background: var(--dark-bg);
}

html[data-theme="dark"] .teacher-proof,
html[data-theme="dark"] .teacher-proof > div > div,
html[data-theme="dark"] .teacher-course-grid > a,
html[data-theme="dark"] .teacher-course-grid footer {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .teacher-story-section {
  background: #061025;
}

html[data-theme="dark"] .teacher-course-grid > a,
html[data-theme="dark"] .teacher-review-section blockquote {
  background: var(--dark-surface);
  color: var(--dark-text);
}

html[data-theme="dark"] .teacher-course-grid > a > div {
  color: #edf5ff;
  background: #153a6a;
}

html[data-theme="dark"] .teacher-course-grid > a.featured > div {
  background: var(--teacher-coral);
  color: #fff;
}

html[data-theme="dark"] .teacher-course-grid > a:nth-child(3) > div {
  color: #fff3d7;
  background: #4c3a17;
}

html[data-theme="dark"] .teacher-story-copy > p,
html[data-theme="dark"] .teacher-course-grid p,
html[data-theme="dark"] .teacher-story-copy li small {
  color: var(--dark-muted);
}

html[data-theme="dark"] .teacher-story-copy li {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .teacher-course-art > div,
html[data-theme="dark"] .teacher-book-art > i {
  background: var(--dark-surface);
  color: var(--dark-text);
}

@media (width<=820px) {
  body: has(.student-app) .theme-toggle {
    bottom: calc(82px + env(safe-area-inset-bottom));
  }
}

@media (width<=620px) {
  .theme-toggle {
    width: 46px;
    min-width: 46px;
    height: 46px;
    padding: 0;
  }

  .theme-toggle-label {
    clip: rect(0 0 0 0);
    white-space: nowrap;
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-toggle {
    transition: none;
  }
}

html,
body {
  max-width: 100%;
}

body:not(:has(.student-app)) {
  overflow-x: clip;
}

.hero,
.catalog-hero,
.public-detail-hero,
.library-public-hero,
.book-detail-hero,
.story,
.auth-visual,
.teacher-slider {
  max-width: 100%;
  overflow-x: clip;
}

.hero:before,
.hero-orbit,
.catalog-hero:before,
.catalog-hero:after,
.detail-art:before,
.detail-art:after,
.cta-panel:before,
.cta-panel:after,
.auth-shape {
  pointer-events: none;
}

.hero-grid,
.hero-copy,
.hero-visual,
.catalog-tools,
.catalog-filters,
.detail-hero-grid,
.library-public-hero > .container {
  min-width: 0;
}

.mobile-menu:not([open]) > nav,
.catalog-mobile-menu:not([open]) > nav {
  display: none;
}

.mobile-menu[open] > nav {
  display: flex;
}

.mobile-menu summary,
.mobile-menu nav a {
  min-width: 44px;
  min-height: 44px;
}

.mobile-menu nav a {
  align-items: center;
  display: flex;
}

.mobile-menu summary:focus-visible,
.catalog-mobile-menu summary:focus-visible,
.catalog-mobile-menu nav a:focus-visible,
.catalog-filters button:focus-visible {
  outline: 3px solid var(--coral);
  outline-offset: 2px;
}

.catalog-mobile-menu {
  flex: none;
  display: none;
  position: relative;
}

.catalog-mobile-menu summary {
  border: 1px solid var(--line);
  cursor: pointer;
  min-width: 78px;
  min-height: 44px;
  color: var(--ink);
  font: 800 14px var(--heading);
  background: var(--paper);
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  justify-content: center;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
  list-style: none;
  display: flex;
}

.catalog-mobile-menu summary::-webkit-details-marker {
  display: none;
}

.catalog-mobile-menu summary > i {
  gap: 3px;
  width: 18px;
  display: grid;
}

.catalog-mobile-menu summary > i > b {
  background: currentColor;
  width: 18px;
  height: 2px;
  transition: transform 0.2s, opacity 0.2s;
  display: block;
}

.catalog-mobile-menu[open] summary > i > b:first-child {
  transform: translateY(5px) rotate(45deg);
}

.catalog-mobile-menu[open] summary > i > b:nth-child(2) {
  opacity: 0;
}

.catalog-mobile-menu[open] summary > i > b:last-child {
  transform: translateY(-5px) rotate(-45deg);
}

.catalog-mobile-menu[open] > nav {
  z-index: 40;
  inset-inline-end: 0;
  background: var(--paper);
  width: min(292px, 100vw - 30px);
  color: var(--ink);
  border: 1px solid var(--line);
  padding: 10px;
  display: grid;
  position: absolute;
  top: calc(100% + 10px);
  box-shadow: 0 22px 52px -28px #061d238c;
}

.catalog-mobile-menu nav a {
  border-bottom: 1px solid var(--line);
  align-items: center;
  min-height: 44px;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 800;
  display: flex;
}

.catalog-mobile-menu nav a:nth-last-child(2) {
  border-bottom: 0;
}

.catalog-mobile-menu nav a:last-child {
  background: var(--deep);
  color: #fff;
  border: 0;
  justify-content: center;
  min-height: 46px;
  margin-top: 8px;
}

body:not(:has(.student-app)) .theme-toggle {
  left: max(
    calc(10px + env(safe-area-inset-left, 0px)),
    calc((100vw - 1180px) / 2 - 56px)
  );
  bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  gap: 0;
  width: 44px;
  min-width: 44px;
  height: 44px;
  padding: 0;
}

:is(
    body:has(.site-header) .theme-toggle,
    body:has(.catalog-header) .theme-toggle
  ) {
  position: absolute;
  bottom: auto;
  left: max(24px, 50vw - 590px);
}

body:has(.site-header) .theme-toggle {
  top: max(24px, env(safe-area-inset-top, 0px));
  color: #fff;
  box-shadow: none;
  background: #0a2b3375;
  border-color: #ffffff3d;
}

body:has(.catalog-header) .theme-toggle {
  top: max(19px, env(safe-area-inset-top, 0px));
}

body:has(.auth-page) .theme-toggle {
  top: max(18px, env(safe-area-inset-top, 0px));
  bottom: auto;
}

.site-header .nav-wrap,
.catalog-header .catalog-nav {
  padding-inline-end: 58px;
}

body:not(:has(.student-app)) .theme-toggle-label {
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  position: absolute;
  overflow: hidden;
}

.catalog-brand small,
.catalog-count small,
.public-rating span,
.public-rating small,
.public-category,
.public-course-meta,
.book-body > span,
.book-formats small,
.library-app-note span,
.detail-breadcrumb,
.detail-badge,
.detail-teacher small,
.detail-teacher b em,
.detail-numbers span,
.public-syllabus summary small,
.enroll-cover > small,
.placement-note small,
.book-cover > span,
.book-cover > small,
.book-cover > em,
.book-author small,
.book-feature-grid span,
.book-chapters span,
.book-chapters small,
.book-format-option p small,
.book-format-option li,
.book-buy-card > p,
.order-form label > span,
.payment-options small,
.order-terms {
  font-size: 12px;
  line-height: 1.55;
}

.catalog-tools input,
.public-course-body > p,
.format-legend,
.book-body > p,
.library-app-note p,
.public-syllabus details > div p,
.enroll-card li,
.book-feature-grid p,
.digital-policy p,
.book-format-option p b,
.order-heading p,
.order-product p {
  font-size: 15px;
  line-height: 1.75;
}

.auth-terms,
.auth-mode-switch {
  line-height: 1.7;
  font-size: 13px !important;
}

.button-small,
.course-footer a,
.all-courses,
.text-action,
.catalog-cta,
.catalog-filters button,
.public-course-bottom > a,
.catalog-help a,
.detail-tabs a,
.detail-final a,
.book-details,
.library-app-note > a,
.book-format-option > a,
.order-success a {
  min-height: 44px;
}

.all-courses,
.text-action,
.public-course-bottom > a,
.detail-tabs a,
.book-details,
.library-app-note > a {
  align-items: center;
  display: inline-flex;
}

.public-course-bottom > a,
.book-details {
  padding-inline: 10px;
  font-size: 14px;
}

.course-footer a {
  min-width: 44px;
}

@media (width<=980px) {
  .catalog-mobile-menu {
    display: block;
  }

  .catalog-nav {
    gap: 14px;
  }
}

@media (width<=680px) {
  body: has(.catalog-header) .theme-toggle {
    top: max(13px, env(safe-area-inset-top, 0px));
  }

  .catalog-tools,
  .catalog-filters {
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }

  .catalog-filters {
    scrollbar-width: thin;
    scrollbar-color: var(--teal) transparent;
    overscroll-behavior-inline: contain;
    -webkit-overflow-scrolling: touch;
    flex-wrap: nowrap;
    padding: 2px 1px 9px;
    scroll-padding-inline: 1px;
    overflow: auto hidden;
  }

  .catalog-filters button {
    white-space: nowrap;
    flex: none;
    min-height: 44px;
  }

  .catalog-tools > label {
    min-height: 46px;
  }

  .catalog-tools input {
    font-size: 16px;
  }

  .public-rating span,
  .public-rating small,
  .public-category,
  .public-course-meta,
  .detail-breadcrumb,
  .detail-badge,
  .detail-teacher small {
    font-size: 12px;
  }

  .public-course-body > p {
    font-size: 15px;
  }

  .public-course-bottom > a,
  .detail-tabs a,
  .detail-teacher b {
    font-size: 14px;
  }

  .catalog-hero h1,
  .detail-copy h1,
  .hero h1 {
    overflow-wrap: anywhere;
    max-inline-size: 100%;
  }

  .catalog-mobile-menu summary {
    width: 44px;
    min-width: 44px;
    padding: 0;
  }

  .catalog-mobile-menu summary > span {
    clip: rect(0 0 0 0);
    white-space: nowrap;
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
  }
}

@media (width<=620px) {
  body: has(.site-header) .theme-toggle {
    top: max(16px, env(safe-area-inset-top, 0px));
  }

  :is(
      body:has(.site-header) .theme-toggle,
      body:has(.catalog-header) .theme-toggle
    ) {
    left: 15px;
  }
}

@media (width<=420px) {
  .catalog-header .catalog-nav {
    padding-left: 58px;
  }

  .catalog-nav > div {
    display: none;
  }

  .catalog-mobile-menu {
    margin-inline-start: auto;
  }

  .catalog-mobile-menu summary {
    width: 44px;
    min-width: 44px;
    padding: 0;
  }

  .catalog-mobile-menu summary > span {
    clip: rect(0 0 0 0);
    white-space: nowrap;
    width: 1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
  }

  .catalog-brand b {
    font-size: 14px;
  }

  .catalog-brand small {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .catalog-mobile-menu summary > i > b {
    transition: none;
  }
}

.access-notice {
  background: #fff8e7;
  border: 1px solid #efd9a4;
  margin-bottom: 16px;
  padding: 16px 18px;
}

.access-notice b {
  font: 800 13px var(--heading);
}

.access-notice p {
  color: #6f8083;
  margin: 5px 0 0;
  font-size: 11px;
  line-height: 1.7;
}

.web-lesson.locked {
  opacity: 0.68;
  cursor: not-allowed;
  background: #f5f7f5;
}

.web-lesson.locked > i {
  font-style: normal;
}

.course-order-link {
  background: var(--coral);
  color: #fff;
  justify-content: center;
  align-items: center;
  min-height: 44px;
  margin-top: 14px;
  font-size: 12px;
  font-weight: 900;
  display: flex;
}

.course-request-page {
  background: #f3f4ef;
  min-height: 100dvh;
  padding: 28px clamp(18px, 5vw, 70px) 70px;
}

.course-request-brand {
  color: var(--ink);
  align-items: center;
  gap: 10px;
  display: inline-flex;
}

.course-request-brand img {
  border-radius: 50%;
  width: 44px;
  height: 44px;
}

.course-request-brand span {
  flex-direction: column;
  display: flex;
}

.course-request-brand b {
  font: 900 15px var(--heading);
}

.course-request-brand small {
  color: #71868b;
  font-size: 10px;
}

.course-request-layout {
  background: #fff;
  grid-template-columns: 0.9fr 1.1fr;
  width: min(1040px, 100%);
  margin: 60px auto 0;
  display: grid;
  box-shadow: 0 30px 70px -46px #0d303973;
}

.course-request-summary {
  background: var(--deep);
  color: #fff;
  padding: 48px;
}

.course-request-summary > span {
  color: #f1cb7e;
  font-size: 11px;
  font-weight: 900;
}

.course-request-summary h1 {
  font: 900 clamp(32px, 4vw, 54px) / 1.1 var(--heading);
  margin: 14px 0;
}

.course-request-summary p {
  color: #ffffffad;
  line-height: 1.8;
}

.course-request-summary dl {
  gap: 13px;
  margin: 34px 0;
  display: grid;
}

.course-request-summary dl > div {
  border-bottom: 1px solid #ffffff24;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  display: flex;
}

.course-request-summary dt {
  color: #ffffff94;
  font-size: 11px;
}

.course-request-summary dd {
  margin: 0;
  font-weight: 800;
}

.course-request-summary > small {
  color: #ffffff8f;
  line-height: 1.7;
  display: block;
}

.course-request-card {
  align-self: center;
  padding: 48px;
}

.course-request-card > span {
  color: var(--coral);
  font-size: 11px;
  font-weight: 900;
}

.course-request-card h2 {
  font: 900 30px var(--heading);
  margin: 8px 0 14px;
}

.course-request-card > p {
  color: #6f8387;
  line-height: 1.8;
}

.course-request-form {
  gap: 12px;
  display: grid;
}

.course-request-form > div {
  border-bottom: 1px solid #e2e7e3;
  justify-content: space-between;
  gap: 18px;
  padding: 13px 0;
  display: flex;
}

.course-request-form > div span {
  color: #71868b;
  font-size: 11px;
}

.course-request-form > div b {
  font-size: 12px;
}

.course-request-form > p {
  color: #6f8387;
  font-size: 11px;
  line-height: 1.8;
}

.course-request-form > p a {
  color: var(--coral);
  font-weight: 800;
}

.course-request-primary {
  background: var(--deep);
  color: #fff;
  width: 100%;
  min-height: 50px;
  font: 900 13px var(--heading);
  cursor: pointer;
  border: 0;
  justify-content: center;
  align-items: center;
  gap: 20px;
  display: flex;
}

.course-request-primary:disabled {
  opacity: 0.58;
  cursor: wait;
}

.course-request-form > small {
  color: #829397;
  text-align: center;
  font-size: 10px;
}

.course-request-error {
  background: #fff0ed;
  padding: 10px;
  color: #a83b2e !important;
}

.course-request-success {
  text-align: center;
}

.course-request-success > span {
  color: #126254;
  background: #d8eee7;
  border-radius: 50%;
  place-items: center;
  width: 50px;
  height: 50px;
  margin: auto;
  font-size: 22px;
  display: grid;
}

.course-request-success h3 {
  font: 900 24px var(--heading);
}

.course-request-success p {
  color: #6f8387;
  font-size: 12px;
  line-height: 1.8;
}

.course-request-success a {
  color: var(--coral);
  font-weight: 900;
}

.lesson-unavailable {
  text-align: center;
  background: #f4f6f3;
  border: 1px solid #e0e5e1;
  padding: 30px;
}

.lesson-unavailable h2 {
  font: 900 22px var(--heading);
}

.lesson-unavailable p {
  color: #708488;
  line-height: 1.8;
}

.lesson-unavailable a {
  color: var(--coral);
  margin-top: 8px;
  font-weight: 900;
  display: inline-flex;
}

.video-watermark {
  text-overflow: ellipsis;
  max-width: 220px;
  overflow: hidden;
}

.student-status-note {
  background: #fff8e7;
  border: 1px solid #ecd9a9;
  padding: 15px;
  font-size: 11px;
  line-height: 1.7;
}

.student-status-note a {
  color: var(--coral);
  font-weight: 900;
}

@media (width<=760px) {
  .course-request-layout {
    grid-template-columns: 1fr;
    margin-top: 28px;
  }

  .course-request-summary,
  .course-request-card {
    padding: 30px 22px;
  }

  .course-request-summary h1 {
    font-size: 34px;
  }

  .course-request-card h2 {
    font-size: 25px;
  }

  .access-notice {
    padding: 14px;
  }

  .web-lesson.locked {
    opacity: 0.78;
  }
}

html[data-theme="dark"] .access-notice,
html[data-theme="dark"] .student-status-note {
  color: var(--dark-text);
  background: #2b291f;
  border-color: #5a4b2b;
}

html[data-theme="dark"] .web-lesson.locked {
  background: #101d21;
}

html[data-theme="dark"] .course-request-page {
  background: var(--dark-bg);
}

html[data-theme="dark"] .course-request-layout,
html[data-theme="dark"] .course-request-card {
  background: var(--dark-surface);
  color: var(--dark-text);
}

html[data-theme="dark"] .course-request-form > div {
  border-color: var(--dark-line);
}

.lesson-playlist .playlist-locked {
  color: #849397;
  opacity: 0.65;
  border-radius: 4px;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  display: flex;
}

.lesson-playlist .playlist-locked > span {
  background: #eef1ef;
  place-items: center;
  width: 27px;
  height: 27px;
  font-size: 8px;
  display: grid;
}

.lesson-playlist .playlist-locked > div {
  flex-direction: column;
  flex: 1;
  min-width: 0;
  display: flex;
}

.lesson-playlist .playlist-locked small {
  font-size: 8px;
}

.lesson-playlist .playlist-locked > i {
  font-style: normal;
}

.lesson-unavailable > span {
  color: var(--coral);
  font-size: 10px;
  font-weight: 900;
}

.lesson-control-error {
  color: #b64a3b;
  margin-top: 7px;
  font-size: 10px;
  display: block;
}

.quiz-review {
  text-align: right;
  gap: 8px;
  margin: 20px 0;
  display: grid;
}

.quiz-review article {
  border: 1px solid #e2e7e3;
  padding: 11px 13px;
}

.quiz-review article.correct {
  border-right: 3px solid #2a8b72;
}

.quiz-review article.wrong {
  border-right: 3px solid var(--coral);
}

.quiz-review b {
  font-size: 11px;
}

.quiz-review p {
  color: #728589;
  margin: 4px 0 0 !important;
  font-size: 10px !important;
}

.quiz-error {
  color: #b64a3b;
  margin-top: 12px;
  font-size: 11px;
}

.upcoming-exams article > a {
  color: var(--coral);
  font-size: 10px;
  font-weight: 900;
}

.exam-intro > a.course-request-primary {
  margin-top: 20px;
}

.student-skip-link {
  z-index: 100;
  color: var(--deep);
  background: #fff;
  padding: 10px 14px;
  font-weight: 900;
  position: fixed;
  top: 8px;
  right: 8px;
  transform: translateY(-150%);
}

.student-skip-link:focus {
  transform: none;
}

.student-topbar-copy {
  flex-direction: column;
  display: flex;
}

.student-topbar-copy b {
  font: 800 12px var(--heading);
}

.student-topbar-copy small {
  color: #7d9195;
  font-size: 9px;
}

.student-mobile-nav {
  padding-bottom: env(safe-area-inset-bottom, 0);
  height: calc(68px + env(safe-area-inset-bottom, 0px));
}

.student-content {
  scroll-margin-top: 90px;
}

.student-app {
  font-size: 15px;
  line-height: 1.65;
}

.student-app p,
.student-app small {
  line-height: 1.65;
}

.student-app p {
  font-size: 14px;
}

.student-app small {
  font-size: 12px;
}

.student-app :where(button, summary) {
  min-height: 44px;
}

.student-app :where(input, select, textarea) {
  min-height: 44px;
  font-size: 16px;
}

.student-app
  :where(a[href], button, summary, input, select, textarea):focus-visible,
.course-request-page
  :where(a[href], button, input, select, textarea):focus-visible {
  outline: 3px solid var(--focus-ring, #d85c49);
  outline-offset: 3px;
}

.student-nav a,
.back-to-site,
.continue-copy > a,
.app-section-head a,
.library-body a,
.lesson-controls button,
.lesson-tabs button,
.upcoming-exams > a,
.favorite-list a,
.empty-state a,
.signout,
.profile-edit,
.course-order-link,
.course-request-primary,
.lesson-unavailable a {
  font-size: 13px;
}

.student-nav a,
.back-to-site,
.continue-copy > a,
.app-section-head a,
.library-body a,
.upcoming-exams > a,
.empty-state a,
.signout,
.profile-edit,
.course-order-link,
.course-request-primary,
.lesson-unavailable a {
  min-height: 44px;
}

.student-logo small,
.student-user small,
.dashboard-greeting > div > span,
.inner-title > span,
.study-streak small,
.eyebrow-app,
.continue-progress b,
.app-section-head p,
.mini-course > div > small,
.weekly-total span,
.week-bars small,
.quick-stats small,
.library-body > span,
.library-body small,
.course-hero-app a,
.course-hero-app > div > span,
.course-hero-meta,
.module-card summary small,
.lesson-kind,
.web-lesson > div > small,
.web-lesson > em,
.overall-progress > span,
.watch-breadcrumb,
.video-watermark,
.lesson-heading > div:first-child > span,
.lesson-heading p,
.lesson-playlist small,
.upcoming-exams article > span,
.upcoming-exams article small,
.upcoming-exams article > i,
.favorite-list small,
.profile-head p,
.profile-head small,
.profile-stats span,
.profile-settings label span,
.profile-settings > p,
.platform-badge {
  font-size: 12px;
}

.mini-course > div > b,
.module-card summary b,
.web-lesson > div > b,
.teacher-note div b,
.upcoming-exams article div b,
.favorite-list b,
.sidebar-support b {
  font-size: 14px;
}

.access-notice p,
.course-request-summary p,
.course-request-card > p,
.course-request-form > p,
.course-request-success p,
.lesson-unavailable p,
.student-status-note {
  color: #536c71;
  font-size: 14px;
  line-height: 1.75;
}

.course-request-brand small,
.course-request-summary > span,
.course-request-summary dt,
.course-request-summary > small,
.course-request-card > span,
.course-request-form > div span,
.course-request-form > small,
.lesson-unavailable > span,
.lesson-control-error,
.quiz-error,
.student-topbar-copy small {
  font-size: 12px;
  line-height: 1.6;
}

.course-request-form > div b,
.quiz-review b,
.student-topbar-copy b {
  font-size: 14px;
}

.quiz-review p {
  color: #536c71;
  font-size: 13px !important;
}

.lesson-playlist .playlist-locked {
  color: #62787d;
  opacity: 0.82;
}

.lesson-playlist .playlist-locked b {
  font-size: 14px;
}

.lesson-playlist .playlist-locked small,
.lesson-playlist .playlist-locked > span {
  font-size: 12px;
}

html[data-theme="dark"] .student-app p,
html[data-theme="dark"] .student-app small,
html[data-theme="dark"] .lesson-playlist .playlist-locked,
html[data-theme="dark"] .course-request-page :where(p, small, dt) {
  color: var(--dark-muted);
}

@media (width<=820px) {
  .student-mobile-nav a {
    min-width: 60px;
    min-height: 52px;
    font-size: 12px;
  }

  .topbar-actions > button {
    width: 44px;
    height: 44px;
  }
}

.course-request-topbar {
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  display: flex;
}

.course-request-topbar > a {
  color: #0b67cf;
  align-items: center;
  min-height: 44px;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
}

.course-request-layout {
  grid-template-columns: minmax(300px, 0.82fr) minmax(0, 1.18fr);
  align-items: start;
  width: min(1180px, 100%);
}

.course-request-summary {
  align-self: start;
  position: sticky;
  top: 24px;
}

.course-request-card {
  align-self: stretch;
  min-width: 0;
}

@media (width<=900px) {
  .course-request-layout {
    grid-template-columns: 1fr;
    margin-top: 32px;
  }

  .course-request-summary {
    position: static;
  }
}

@media (width<=560px) {
  .course-request-page {
    padding-inline: 15px;
  }

  .course-request-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .course-request-topbar > a {
    border-top: 1px solid #dbe3e6;
    align-self: stretch;
  }
}

html[data-theme="dark"] .course-request-topbar > a {
  color: #73aff7;
  border-color: var(--dark-line);
}

.home-hero {
  color: #fff;
  background: #061147;
  min-height: 740px;
  padding-top: 92px;
  position: relative;
  overflow: hidden;
}

.home-hero:before {
  content: "";
  pointer-events: none;
  background: radial-gradient(circle at 12% 32%, #0867d438, #0000 34%),
    linear-gradient(115deg, #0000 54%, #5ba8ff0f);
  position: absolute;
  inset: 0;
}

.home-hero-layout {
  z-index: 1;
  grid-template-columns: minmax(0, 1.08fr) minmax(390px, 0.92fr);
  align-items: center;
  gap: clamp(46px, 5vw, 78px);
  min-height: 648px;
  display: grid;
  position: relative;
}

.home-hero-copy {
  min-width: 0;
  max-width: 690px;
  padding: 68px 0 76px;
}

.home-hero-kicker {
  color: #ffcf63;
  width: fit-content;
  font: 800 12px/1.5 var(--heading);
  border: 1px solid #ffb00061;
  border-radius: 99px;
  margin: 0 0 19px;
  padding: 7px 12px;
}

.home-hero h1 {
  max-width: 760px;
  font: 900 clamp(50px, 4.8vw, 68px) / 1.18 var(--heading);
  letter-spacing: -0.025em;
  text-wrap: balance;
  margin: 0;
}

.home-hero h1 span {
  display: block;
}

.home-hero h1 em {
  color: #ef7a63;
  font-style: normal;
}

.home-hero-description {
  color: #ffffffc7;
  text-wrap: pretty;
  max-width: 630px;
  margin: 24px 0 0;
  font-size: 17px;
  line-height: 1.95;
}

.home-hero-actions {
  flex-wrap: wrap;
  align-items: center;
  gap: 13px;
  margin-top: 32px;
  display: flex;
}

.home-hero-primary,
.home-hero-secondary {
  min-height: 54px;
  font: 800 14px/1 var(--heading);
  border: 1px solid #0000;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  gap: 22px;
  padding: 0 22px;
  transition: transform 0.18s, background-color 0.18s, border-color 0.18s;
  display: inline-flex;
}

.home-hero-primary {
  color: #fff;
  background: #0867d4;
}

.home-hero-primary:hover {
  background: #0b5fc2;
  transform: translateY(-2px);
}

.home-hero-primary span {
  font-size: 19px;
}

.home-hero-secondary {
  color: #fff;
  background: 0 0;
  border-color: #ffffff40;
}

.home-hero-secondary:hover {
  background: #ffffff0f;
  border-color: #ffffff80;
}

.home-hero-secondary span {
  color: #ffcf63;
  font-size: 14px;
}

.home-hero-media {
  aspect-ratio: 4/5;
  background: #0b1d46;
  border: 10px solid #5ba8ff29;
  border-radius: 18px;
  justify-self: start;
  width: min(100%, 470px);
  margin: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 38px 80px -46px #000000c7;
}

.home-hero-media img {
  object-fit: cover;
  object-position: 68% center;
  width: 100%;
  height: 100%;
  display: block;
}

.home-hero-text-only .home-hero-layout {
  grid-template-columns: 1fr;
}

.home-hero-text-only .home-hero-copy {
  text-align: center;
  max-width: 850px;
  margin-inline: auto;
}

.home-hero-text-only .home-hero-kicker {
  margin-inline: auto;
}

.home-hero-text-only .home-hero-description {
  max-width: 720px;
  margin-inline: auto;
}

.home-hero-text-only .home-hero-actions {
  justify-content: center;
}

.home-hero-primary:focus-visible,
.home-hero-secondary:focus-visible {
  outline-offset: 4px;
  outline: 3px solid #ffca4a;
}

@media (width<=980px) {
  .home-hero {
    min-height: 0;
  }

  .home-hero-layout {
    grid-template-columns: 1fr;
    gap: 14px;
    min-height: 0;
    padding-bottom: 56px;
  }

  .home-hero-copy {
    max-width: 760px;
    padding: 66px 0 28px;
  }

  .home-hero-media {
    aspect-ratio: 4/5;
    width: min(470px, 100%);
  }

  .home-hero-text-only .home-hero-layout {
    min-height: 650px;
    padding-bottom: 0;
  }
}

@media (width<=620px) {
  .home-hero {
    padding-top: 76px;
  }

  .home-hero-layout {
    padding-bottom: 32px;
  }

  .home-hero-copy {
    padding: 48px 0 25px;
  }

  .home-hero-kicker {
    margin-bottom: 15px;
    font-size: 12px;
  }

  .home-hero h1 {
    font-size: clamp(39px, 11.7vw, 47px);
    line-height: 1.2;
  }

  .home-hero-description {
    margin-top: 18px;
    font-size: 15px;
    line-height: 1.9;
  }

  .home-hero-actions {
    margin-top: 25px;
  }

  .home-hero-primary,
  .home-hero-secondary {
    min-height: 50px;
    padding-inline: 18px;
    font-size: 14px;
  }

  .home-hero-media {
    aspect-ratio: 4/5;
    border-width: 7px;
    border-radius: 12px;
  }

  .home-hero-text-only .home-hero-layout {
    min-height: 580px;
  }
}

@media (width<=390px) {
  .home-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .home-hero-primary,
  .home-hero-secondary {
    width: 100%;
  }

  .home-hero h1 {
    font-size: 37px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-hero-primary,
  .home-hero-secondary {
    transition: none !important;
  }
}

.home-course-picker {
  border: 1px solid var(--line);
  background: #edf4f1;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  margin-bottom: 32px;
  padding: 24px 28px;
  display: flex;
}

.catalog-course-picker {
  margin-bottom: 26px;
}

.catalog-course-picker h2 {
  font: 800 20px/1.5 var(--heading);
  margin: 5px 0 0;
}

.catalog-course-result.has-selection {
  animation: 0.28s both home-course-swap;
}

.catalog-course-result .catalog-filters button,
.catalog-course-result .catalog-tools > label {
  min-height: 44px;
}

.catalog-course-result .catalog-filters button:focus-visible {
  outline-offset: 3px;
  outline: 3px solid #ef775f73;
}

.catalog-course-result .catalog-tools > label:focus-within {
  border-color: var(--teal);
  box-shadow: 0 0 0 3px #2170701a;
}

.catalog-selection-heading {
  border-bottom: 1px solid var(--line);
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  margin: 0 0 24px;
  padding-bottom: 18px;
  display: flex;
}

.catalog-selection-heading span {
  color: var(--coral);
  font-size: 12px;
  font-weight: 800;
}

.catalog-selection-heading h2 {
  font: 800 25px/1.4 var(--heading);
  margin: 5px 0 0;
}

.catalog-selection-heading small {
  color: #62787d;
  font-size: 12px;
  line-height: 1.55;
}

.catalog-course-empty h2 {
  color: var(--ink);
  font: 800 clamp(22px, 3vw, 34px) / 1.35 var(--heading);
  margin: 6px 0 8px;
}

.home-course-picker > div:first-child {
  min-width: 270px;
}

.home-course-picker > div:first-child > span {
  color: var(--coral);
  font-size: 12px;
  font-weight: 800;
}

.home-course-picker h3 {
  font: 800 20px/1.5 var(--heading);
  margin: 5px 0 0;
}

.home-course-picker p {
  color: #536c71;
  margin: 5px 0 0;
  font-size: 14px;
  line-height: 1.75;
}

.home-course-audiences {
  grid-template-columns: repeat(3, minmax(132px, 1fr));
  gap: 8px;
  display: grid;
}

.home-course-audiences button {
  color: #61777c;
  cursor: pointer;
  min-height: 45px;
  font: 800 14px var(--heading);
  background: #fff;
  border: 1px solid #12313929;
  padding: 0 20px;
  transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.2s;
}

.home-course-audiences button:hover {
  border-color: var(--teal);
  color: var(--ink);
  transform: translateY(-2px);
}

.home-course-audiences button.active {
  border-color: var(--deep);
  background: var(--deep);
  color: #fff;
  box-shadow: inset 0 -3px var(--coral);
}

.home-course-audiences button:focus-visible {
  outline-offset: 3px;
  outline: 3px solid #ef775f73;
}

.home-course-result-head {
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
  display: flex;
}

.home-course-result-head h3 {
  font: 800 18px var(--heading);
  margin: 0;
}

.home-course-result-head span {
  color: #62787d;
  font-size: 12px;
  font-weight: 700;
}

.home-course-status {
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  position: absolute;
  overflow: hidden;
}

.home-course-empty {
  text-align: right;
  background: linear-gradient(110deg, #bedbd66b, #ffffffc2), #f7faf9;
  border: 1px dashed #1231393d;
  grid-template-columns: auto minmax(0, 560px) auto;
  justify-content: center;
  align-items: center;
  gap: 28px;
  min-height: 180px;
  padding: 34px;
  display: grid;
  position: relative;
  overflow: hidden;
}

.home-course-empty:before {
  background: var(--coral);
  content: "";
  width: 6px;
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
}

.home-course-empty-step {
  width: 64px;
  height: 64px;
  color: var(--deep);
  font: 800 16px var(--heading);
  background: #fff;
  border: 1px solid #12313924;
  place-items: center;
  display: grid;
  box-shadow: 8px 8px #bedbd6b3;
}

.home-course-empty div > span {
  color: var(--coral);
  font-size: 12px;
  font-weight: 800;
}

.home-course-empty h3 {
  color: var(--ink);
  font: 800 clamp(22px, 3vw, 34px) / 1.35 var(--heading);
  margin: 6px 0 8px;
}

.home-course-empty p {
  color: #536c71;
  max-width: 540px;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
}

.home-course-empty-arrow {
  color: var(--coral);
  font: 700 34px/1 var(--heading);
  animation: 1.8s ease-in-out 2 home-course-nudge;
}

.home-course-result .course-grid {
  animation: 0.28s both home-course-swap;
}

.home-course-showcase .course-card.mint .course-cover {
  background: #bedbd6;
}

.home-course-showcase .course-card.violet .course-cover {
  background: #d2c8df;
}

.home-course-showcase .course-card.sky .course-cover {
  background: #bcd8e2;
}

.home-course-showcase .course-card.deep .course-cover {
  color: #fff;
  background: #245866;
}

@keyframes home-course-swap {
  0% {
    opacity: 0.35;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes home-course-nudge {
  0%,
  to {
    transform: translateY(4px);
  }

  50% {
    transform: translateY(-4px);
  }
}

html[data-theme="dark"] .home-course-picker {
  border-color: var(--dark-line);
  background: var(--dark-surface-2);
}

html[data-theme="dark"] .home-course-audiences button {
  border-color: var(--dark-line);
  background: var(--dark-surface);
  color: var(--dark-muted);
}

html[data-theme="dark"] .home-course-audiences button:hover {
  border-color: var(--teal);
  color: var(--dark-text);
}

html[data-theme="dark"] .home-course-audiences button.active {
  border-color: var(--teal);
  background: var(--teal);
  color: #071215;
}

html[data-theme="dark"] .home-course-picker p,
html[data-theme="dark"] .home-course-empty p {
  color: var(--dark-muted);
}

html[data-theme="dark"] .home-course-empty {
  border-color: var(--dark-line);
  background: linear-gradient(110deg, #2c625947, #0d2227d6), var(--dark-surface);
}

html[data-theme="dark"] .home-course-empty-step {
  border-color: var(--dark-line);
  background: var(--dark-surface-2);
  color: var(--dark-text);
  box-shadow: 8px 8px #2c625973;
}

html[data-theme="dark"] .home-course-empty h3 {
  color: var(--dark-text);
}

html[data-theme="dark"] .home-course-result-head span {
  color: var(--dark-muted);
}

html[data-theme="dark"] .catalog-selection-heading {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .catalog-selection-heading small {
  color: var(--dark-muted);
}

html[data-theme="dark"] .catalog-course-empty h2 {
  color: var(--dark-text);
}

html[data-theme="dark"] .home-course-showcase .course-card.mint .course-cover {
  background: #294a44;
}

html[data-theme="dark"]
  .home-course-showcase
  .course-card.violet
  .course-cover {
  background: #3d3549;
}

html[data-theme="dark"] .home-course-showcase .course-card.sky .course-cover {
  background: #263f49;
}

html[data-theme="dark"] .home-course-showcase .course-card.deep .course-cover {
  background: #173d46;
}

@media (width<=820px) {
  .home-course-showcase.course-card: last-child {
    grid-column: auto;
  }

  .home-course-showcase .course-card:nth-child(odd):last-child {
    grid-column: 1/-1;
  }

  .home-course-picker {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }

  .catalog-selection-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .home-course-picker > div:first-child {
    min-width: 0;
  }

  .home-course-audiences {
    justify-content: flex-start;
    width: 100%;
  }

  .home-course-empty {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .home-course-empty-arrow {
    display: none;
  }
}

@media (width<=620px) {
  .home-course-picker {
    margin-bottom: 26px;
    padding: 20px;
  }

  .home-course-picker h3,
  .catalog-course-picker h2 {
    font-size: 17px;
  }

  .home-course-audiences {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
  }

  .home-course-audiences button {
    min-width: 0;
    min-height: 46px;
    padding-inline: 8px;
    line-height: 1.35;
  }

  .home-course-empty {
    grid-template-columns: 1fr;
    justify-items: start;
    min-height: 0;
    padding: 26px 22px;
  }

  .home-course-empty-step {
    display: none;
  }
}

@media (width<=430px) {
  .home-course-audiences {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-course-result .course-grid,
  .catalog-course-result.has-selection,
  .home-course-empty-arrow {
    animation: none;
  }
}

.home-course-audiences button {
  text-align: right;
  grid-template-rows: 1fr auto;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 2px 12px;
  min-height: 74px;
  padding: 7px;
  display: grid;
}

.stage-option-index {
  border: 1px solid var(--line);
  background: var(--paper);
  width: 48px;
  height: 48px;
  color: var(--teal);
  font: 900 13px var(--heading);
  grid-row: 1/3;
  place-items: center;
  display: grid;
}

.home-course-audiences button.active .stage-option-index {
  color: #fff;
  background: #ffffff24;
  border-color: #ffffff47;
}

.stage-option-image {
  background-position: 50%;
  background-size: cover;
  border-radius: 3px;
  grid-row: 1/3;
  width: 78px;
  height: 58px;
  box-shadow: inset 0 0 0 1px #081b3a1a;
}

.stage-option-label {
  font-weight: 800;
  white-space: nowrap;
}

.home-course-audiences button small {
  color: var(--muted-meta);
  font-size: 11px;
}

.home-course-audiences button.active small {
  color: #ffffffb8;
}

.home-stage-empty {
  border: 1px solid var(--line);
  text-align: center;
  background: linear-gradient(135deg, #f4f8ff, #fff);
  border-radius: 8px;
  padding: 46px;
}

.home-stage-empty > span {
  color: var(--coral);
  font-size: 12px;
  font-weight: 800;
}

.home-stage-empty h3 {
  font: 800 25px/1.5 var(--heading);
  margin: 7px 0;
}

.home-stage-empty p {
  max-width: 620px;
  color: var(--muted-copy);
  margin: 0 auto 20px;
  font-size: 15px;
  line-height: 1.8;
}

.home-stage-empty button {
  background: var(--coral);
  color: #fff;
  cursor: pointer;
  border: 0;
  border-radius: 4px;
  min-height: 44px;
  padding: 0 18px;
  font-weight: 800;
}

.course-cover.has-image {
  color: #fff;
  text-shadow: 0 2px 15px #00000073;
  background-position: 50%;
  background-size: cover;
}

.home-course-showcase .course-card .course-cover.teacher-course-cover {
  background-color: #061147;
  background-position: 50%, left 24px bottom -12px;
  background-repeat: no-repeat;
  background-size: 100% 100%, auto 108%;
}

.home-course-showcase .course-card .course-cover.teacher-course-cover:before {
  border-color: #ffffff38;
  bottom: -112px;
  left: auto;
  right: -62px;
}

.home-course-showcase
  .course-card
  .course-cover.teacher-course-cover
  .course-mark {
  color: #ef7a63;
  opacity: 0.28;
}

.home-course-showcase
  .course-card
  .course-cover.teacher-course-cover-month-one {
  background-color: #0b2460;
  background-position: 50%, right 26px bottom -12px;
  background-size: 100% 100%, auto 112%;
}

.home-course-showcase
  .course-card
  .course-cover.teacher-course-cover-month-one:before {
  left: -62px;
  right: auto;
}

.home-course-showcase
  .course-card
  .course-cover.teacher-course-cover-month-one
  .course-mark {
  color: #ffcf63;
  opacity: 0.24;
}

html[data-theme="dark"] .home-stage-empty {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

html[data-theme="dark"] .home-stage-empty h3 {
  color: var(--dark-text);
}

@media (width<=620px) {
  .home-course-audiences button {
    text-align: center;
    justify-content: center;
    min-height: 48px;
    padding-inline: 8px;
    display: flex;
  }

  .stage-option-image,
  .home-course-audiences button small,
  .stage-option-index {
    display: none;
  }

  .home-stage-empty {
    padding: 32px 20px;
  }

  .home-stage-empty h3 {
    font-size: 21px;
  }
}

.home-notes-section,
.home-blog-section {
  padding: 100px 0;
  overflow: hidden;
}

.home-notes-section {
  background: #eef4ff;
}

.home-blog-section {
  background: #fbfcff;
}

.home-editorial-heading {
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.65fr);
  align-items: end;
  gap: clamp(38px, 7vw, 96px);
  margin-bottom: 38px;
  display: grid;
}

.home-editorial-heading > div:first-child > span {
  color: #0867d4;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 900;
  display: flex;
}

.home-editorial-heading > div:first-child > span:before {
  content: "";
  background: #ef7a63;
  width: 29px;
  height: 2px;
}

.home-editorial-heading h2 {
  color: #081b3a;
  font: 900 clamp(39px, 4.2vw, 58px) / 1.24 var(--heading);
  letter-spacing: -0.035em;
  margin: 11px 0 0;
}

.home-editorial-heading h2 em {
  color: #ef7a63;
  font-style: normal;
}

.home-editorial-heading > p,
.home-blog-intro p {
  color: #4f617c;
  margin: 0;
  font-size: 16px;
  line-height: 1.9;
}

.home-notes-feature {
  background: #fff;
  border: 1px solid #0611471f;
  border-radius: 12px;
  grid-template-columns: minmax(300px, 0.72fr) minmax(0, 1.28fr);
  min-height: 510px;
  display: grid;
  overflow: hidden;
  box-shadow: 0 30px 80px -62px #06114799;
}

.home-notes-cover {
  color: #fff;
  background-color: #061147;
  background-position: 50%;
  background-size: cover;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 510px;
  padding: 34px;
  display: flex;
  position: relative;
  overflow: hidden;
}

.home-notes-cover:before,
.home-notes-cover:after {
  content: "";
  border: 1px solid #fff3;
  border-radius: 50%;
  position: absolute;
}

.home-notes-cover:before {
  width: 290px;
  height: 290px;
  inset: -128px auto auto -92px;
}

.home-notes-cover:after {
  width: 190px;
  height: 190px;
  inset: -79px auto auto -42px;
}

.home-notes-cover > * {
  z-index: 1;
  position: relative;
}

.home-notes-cover > span {
  font: 800 11px var(--heading);
  letter-spacing: 0.15em;
  margin-bottom: auto;
}

.home-notes-cover > strong {
  max-width: 320px;
  font: 900 clamp(28px, 3vw, 42px) / 1.3 var(--heading);
}

.home-notes-cover > small {
  color: #ffffffc7;
  margin-top: 10px;
  font-size: 13px;
}

.home-notes-cover > i {
  z-index: 2;
  color: #fff;
  width: 82px;
  height: 82px;
  font: 900 28px/1 var(--heading);
  text-align: center;
  background: #ef7a63;
  border-radius: 50%;
  place-content: center;
  display: grid;
  position: absolute;
  bottom: 28px;
  left: 26px;
}

.home-notes-cover > i b {
  margin-top: 5px;
  font-size: 10px;
  display: block;
}

.home-notes-copy {
  align-self: center;
  padding: clamp(42px, 6vw, 76px);
}

.home-notes-copy > span {
  color: #0867d4;
  font-size: 12px;
  font-weight: 900;
}

.home-notes-copy h3 {
  color: #081b3a;
  font: 900 clamp(29px, 3.3vw, 43px) / 1.35 var(--heading);
  margin: 9px 0 13px;
}

.home-notes-copy > p {
  color: #4f617c;
  max-width: 650px;
  margin: 0;
  font-size: 16px;
  line-height: 1.9;
}

.home-notes-copy ul {
  border-block: 1px solid #dce5f3;
  grid-template-columns: repeat(3, 1fr);
  margin: 28px 0;
  padding: 0;
  list-style: none;
  display: grid;
}

.home-notes-copy li {
  color: #243a5c;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  min-height: 88px;
  padding: 17px;
  font-size: 13px;
  font-weight: 800;
  display: flex;
}

.home-notes-copy li + li {
  border-inline-start: 1px solid #dce5f3;
}

.home-notes-copy li b {
  color: #ef7a63;
  font-size: 11px;
}

.home-notes-copy > div {
  flex-wrap: wrap;
  align-items: center;
  gap: 21px;
  display: flex;
}

.home-notes-primary {
  color: #fff;
  background: #0867d4;
  align-items: center;
  gap: 25px;
  min-height: 52px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
}

.home-notes-secondary {
  color: #061147;
  border-bottom: 1px solid #061147;
  align-items: center;
  min-height: 44px;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
}

.home-blog-intro a {
  color: #0867d4;
  border-bottom: 1px solid #0867d4;
  align-items: center;
  min-height: 44px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
}

.home-blog-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  display: grid;
}

.home-blog-card {
  background: #fff;
  border: 1px solid #dfe7f3;
  border-radius: 10px;
  min-width: 0;
  overflow: hidden;
}

.home-blog-card > a {
  color: #081b3a;
  flex-direction: column;
  min-height: 420px;
  display: flex;
}

.home-blog-card header {
  color: #fff;
  background: #061147;
  justify-content: space-between;
  align-items: center;
  min-height: 58px;
  padding: 0 22px;
  display: flex;
}

.home-blog-card header span {
  font-size: 12px;
  font-weight: 800;
}

.home-blog-card header b {
  font-size: 12px;
}

.home-blog-card > a > strong {
  color: #0867d4;
  min-height: 142px;
  font: 900 62px var(--heading);
  background: #e8f1ff;
  justify-content: center;
  align-items: center;
  padding: 25px;
  display: flex;
  overflow: hidden;
}

.home-blog-blue > a > strong {
  color: #fff;
  background: #0867d4;
}

.home-blog-coral > a > strong {
  color: #fff;
  background: #ef7a63;
}

.home-blog-card > a > div {
  flex-direction: column;
  flex: 1;
  padding: 25px;
  display: flex;
}

.home-blog-card small {
  color: #60718c;
  font-size: 12px;
}

.home-blog-card h3 {
  font: 900 21px/1.5 var(--heading);
  margin: 8px 0;
}

.home-blog-card p {
  color: #4f617c;
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
}

.home-blog-read {
  color: #0867d4;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 22px;
  font-size: 13px;
  font-weight: 900;
  display: flex;
}

.home-blog-read i {
  font-size: 19px;
  font-style: normal;
}

html[data-theme="dark"] .home-notes-section,
html[data-theme="dark"] .home-blog-section {
  background: var(--dark-bg);
}

html[data-theme="dark"] .home-editorial-heading h2,
html[data-theme="dark"] .home-notes-copy h3,
html[data-theme="dark"] .home-blog-card > a {
  color: var(--dark-text);
}

html[data-theme="dark"] .home-editorial-heading > p,
html[data-theme="dark"] .home-blog-intro p,
html[data-theme="dark"] .home-notes-copy > p,
html[data-theme="dark"] .home-blog-card p {
  color: var(--dark-muted);
}

html[data-theme="dark"] .home-notes-feature,
html[data-theme="dark"] .home-blog-card {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

html[data-theme="dark"] .home-notes-copy ul {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .home-notes-copy li {
  color: var(--dark-text);
}

html[data-theme="dark"] .home-notes-copy li + li {
  border-color: var(--dark-line);
}

html[data-theme="dark"] .home-notes-secondary {
  color: var(--dark-text);
  border-color: var(--dark-text);
}

@media (width<=900px) {
  .home-notes-section,
  .home-blog-section {
    padding: 78px 0;
  }

  .home-notes-feature {
    grid-template-columns: minmax(270px, 0.8fr) 1.2fr;
  }

  .home-notes-copy {
    padding: 38px 30px;
  }

  .home-notes-copy ul {
    grid-template-columns: 1fr;
  }

  .home-notes-copy li {
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 64px;
  }

  .home-notes-copy li + li {
    border-inline-start: 0;
    border-top: 1px solid #dce5f3;
  }

  .home-blog-grid {
    grid-template-columns: 1fr 1fr;
  }

  .home-blog-card:first-child {
    grid-column: 1/-1;
  }

  .home-blog-card:first-child > a {
    grid-template-columns: 0.65fr 1.35fr;
    display: grid;
  }

  .home-blog-card:first-child header {
    grid-column: 1;
  }

  .home-blog-card:first-child > a > strong {
    grid-column: 1;
    min-height: 240px;
  }

  .home-blog-card:first-child > a > div {
    grid-area: 1/2/3;
  }
}

@media (width<=680px) {
  .home-editorial-heading {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .home-editorial-heading h2 {
    font-size: 38px;
  }

  .home-notes-feature {
    grid-template-columns: 1fr;
  }

  .home-notes-cover {
    min-height: 390px;
    padding: 25px;
  }

  .home-notes-cover > i {
    width: 72px;
    height: 72px;
    font-size: 24px;
    bottom: 22px;
    left: 20px;
  }

  .home-notes-copy {
    padding: 32px 22px 36px;
  }

  .home-notes-copy h3 {
    font-size: 29px;
  }

  .home-notes-copy > p {
    font-size: 15px;
  }

  .home-notes-copy > div {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .home-notes-primary,
  .home-notes-secondary {
    justify-content: center;
    width: 100%;
  }

  .home-blog-grid {
    grid-template-columns: 1fr;
  }

  .home-blog-card:first-child {
    grid-column: auto;
  }

  .home-blog-card:first-child > a {
    display: flex;
  }

  .home-blog-card:first-child header,
  .home-blog-card:first-child > a > strong,
  .home-blog-card:first-child > a > div {
    grid-area: auto;
  }
}

.site-social-block {
  margin-top: 22px;
}

.site-social-block > b {
  color: #f0cb81;
  font: 800 12px var(--heading);
  display: block;
}

.site-socials {
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  display: flex;
}

.site-socials > a {
  color: #ffffffc7;
  border: 1px solid #ffffff29;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 13px;
  font-size: 11px;
  font-weight: 800;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
  display: inline-flex;
}

.site-socials > a:hover {
  color: #fff;
  border-color: #f0cb81;
  transform: translateY(-2px);
}

.site-socials i {
  color: #f2ca7c;
  background: #ffffff1a;
  border-radius: 50%;
  place-items: center;
  width: 22px;
  height: 22px;
  font: 900 11px/1 Arial, sans-serif;
  display: grid;
}

.site-socials i svg {
  fill: currentColor;
  width: 18px;
  height: 18px;
}

.site-contact-details {
  color: #ffffffb8;
  flex-wrap: wrap;
  gap: 7px 14px;
  margin-top: 18px;
  font-style: normal;
  display: flex;
}

.site-contact-details a,
.site-contact-details span {
  align-items: center;
  min-height: 30px;
  font-size: 13px;
  display: inline-flex;
}

.site-contact-details a:hover {
  color: #fff;
  text-decoration: underline;
}

:root {
  --coral: #0867d4;
  --gold: #ffb000;
  --deep: #061147;
  --teal: #28366c;
  --paper: #fbfcff;
  --muted-copy: #4f617c;
  --muted-meta: #60718c;
  --focus-ring: #0b4fa8;
}

body {
  font-size: 16px;
  line-height: 1.65;
}

html[data-theme="dark"] {
  --muted-copy: #b4c3db;
  --muted-meta: #99abc6;
  --focus-ring: #ffca4a;
}

:is(a[href], button, summary, input, select, textarea):focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 3px;
}

:where(button, summary, input, select, textarea) {
  min-height: 44px;
}

:is(
    .button,
    .button-small,
    .auth-primary,
    .catalog-cta,
    .catalog-help a,
    .detail-final a,
    .library-app-note > a,
    .book-format-option > a,
    .submit-order,
    .order-success a,
    .story-link
  ) {
  min-height: 44px;
  font-size: 14px;
}

.teacher-monogram {
  color: #fff;
  width: 46px;
  height: 46px;
  font: 900 13px/1 var(--heading);
  letter-spacing: -0.04em;
  background: #0b5fc2;
  border: 2px solid #ffffffb8;
  border-radius: 50%;
  flex: 0 0 46px;
  place-items: center;
  overflow: hidden;
  display: grid !important;
}

.teacher-brand-mark {
  background: #061147;
  border-radius: 10px;
  padding: 0;
}

.teacher-brand-mark img {
  object-fit: cover;
  background: 0 0;
  border: 0;
  border-radius: 0;
  width: 100%;
  max-width: none;
  height: 100%;
}

.catalog-brand .teacher-monogram {
  border-color: #123f492e;
  flex-basis: 43px;
  width: 43px;
  height: 43px;
}

.course-request-brand .teacher-monogram {
  border-color: #123f4933;
  flex-basis: 44px;
  width: 44px;
  height: 44px;
}

.auth-brand .teacher-monogram,
.student-logo .teacher-monogram,
.mobile-student-brand .teacher-monogram {
  border-color: #ffffffa8;
}

.app-gate-mark .teacher-monogram {
  border: 0;
  width: 100%;
  height: 100%;
}

.mobile-student-brand > span:last-child {
  flex-direction: column;
  display: flex;
}

.mobile-student-brand small {
  display: none;
}

.site-header .nav-wrap {
  padding-left: 90px;
}

.site-header .brand {
  min-width: 210px;
}

.site-header .brand small {
  font-size: 12px;
}

.desktop-nav a,
.login-link,
.catalog-nav > nav a,
.catalog-nav > div > a:first-child {
  align-items: center;
  min-height: 44px;
  font-size: 14px;
  display: inline-flex;
}

.footer-brand .brand small {
  color: #ffffffb8;
  font-size: 12px;
}

:is(
    body:has(.site-header) .theme-toggle,
    body:has(.catalog-header) .theme-toggle
  ) {
  font-size: 12px;
  position: absolute;
  inset: 21px auto auto max(24px, 50vw - 590px);
}

.section,
.experience {
  padding-block: 96px;
}

.section-heading {
  margin-bottom: 38px;
}

.split-heading {
  gap: 56px;
}

.split-heading > p {
  color: var(--muted-copy);
  font-size: 16px;
}

.home-hero {
  color: var(--ink);
  background: radial-gradient(circle at 12% 24%, #0867d41f, #0000 33%),
    linear-gradient(135deg, #fbfcff, #eef5ff);
}

.home-hero-kicker {
  color: var(--teal);
  border-color: #0867d438;
}

.home-hero h1 em {
  color: var(--coral);
}

.home-hero-description {
  color: var(--muted-copy);
}

.home-hero-secondary:hover {
  border-color: var(--coral);
  background: #fff;
}

.home-hero-layout {
  min-height: 620px;
}

.home-hero-copy {
  padding-block: 56px 62px;
}

.home-hero h1 {
  font-size: clamp(48px, 4.9vw, 72px);
}

.home-hero-media {
  background: linear-gradient(160deg, #e8f1ff, #d8e8ff);
  border-width: 9px;
  border-color: #0867d41f;
  border-radius: 22px 22px 88px;
}

.home-hero-media img {
  object-fit: contain;
  object-position: center bottom;
}

.home-hero-primary {
  background: #0867d4;
}

.home-hero-primary:hover {
  background: #0b5fc2;
}

.site-header {
  color: var(--ink);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  background: #fbfcffe6;
}

.site-header .nav-wrap {
  border-color: var(--line);
}

.site-header .brand small,
.site-header .desktop-nav a,
.site-header .login-link {
  color: #465c7a;
}

.site-header .desktop-nav a:hover,
.site-header .login-link:hover {
  color: var(--coral);
}

body:has(.site-header) .theme-toggle {
  color: var(--ink);
  border-color: var(--line);
  background: #ffffffd1;
}

.home-course-picker {
  background: #eef4ff;
  border-radius: 8px;
}

.home-course-empty {
  background: linear-gradient(110deg, #dbe9ffb8, #ffffffe6), #f7faff;
}

.home-course-audiences button {
  border-radius: 4px;
}

.home-course-empty {
  border-radius: 8px;
}

.course-card,
.public-course-card,
.book-card {
  border-radius: 8px;
  overflow: hidden;
}

.experience:after {
  content: "PHYSICS";
}

.story-link {
  min-height: 44px;
  color: var(--coral);
  align-items: center;
  margin-top: 24px;
  font-weight: 800;
  display: inline-flex;
}

.app-status-section {
  color: #fff;
  background: #061147;
  padding: 92px 0;
  overflow: hidden;
}

.app-status-grid {
  grid-template-columns: 1fr 360px;
  align-items: center;
  gap: 90px;
  display: grid;
}

.app-status-copy h2 {
  font: 900 clamp(37px, 4.2vw, 58px) / 1.3 var(--heading);
  letter-spacing: -0.04em;
  margin: 14px 0;
}

.app-status-copy h2 em {
  color: #5ba8ff;
  font-style: normal;
}

.app-status-copy > p {
  color: #ffffffc7;
  max-width: 650px;
  font-size: 16px;
  line-height: 1.9;
}

.app-status-copy > div {
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
  margin-top: 26px;
  display: flex;
}

.app-status-link {
  border-bottom: 1px solid #ffffff8c;
  align-items: center;
  min-height: 44px;
  font-size: 14px;
  font-weight: 800;
  display: inline-flex;
}

.app-status-phone {
  color: #081b3a;
  background: #fbfcff;
  border: 8px solid #5ba8ff2e;
  border-radius: 36px;
  justify-self: center;
  width: 290px;
  min-height: 430px;
  padding: 22px;
  transform: rotate(-2deg);
  box-shadow: 26px 30px #02061747;
}

.app-status-phone > header {
  border-bottom: 1px solid #123f491f;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  display: flex;
}

.app-status-phone .teacher-monogram {
  border-color: #123f4924;
  flex-basis: 38px;
  width: 38px;
  height: 38px;
  font-size: 11px;
}

.app-status-phone header div {
  flex-direction: column;
  display: flex;
}

.app-status-phone header b {
  font: 800 12px var(--heading);
}

.app-status-phone header small {
  color: #536c71;
  font-size: 12px;
}

.app-status-phone > section {
  background: #e8f1ff;
  border-radius: 12px;
  margin-top: 28px;
  padding: 24px 20px;
}

.app-status-phone section span {
  color: #536c71;
  font-size: 12px;
  display: block;
}

.app-status-phone section strong {
  font: 800 17px var(--heading);
  margin: 6px 0 22px;
  display: block;
}

.app-status-phone section i {
  background: #123f4921;
  border-radius: 99px;
  height: 6px;
  display: block;
  overflow: hidden;
}

.app-status-phone section i b {
  background: #0867d4;
  width: 64%;
  height: 100%;
  display: block;
}

.app-status-phone > div {
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  margin-top: 18px;
  display: grid;
}

.app-status-phone > div span {
  color: #536c71;
  border: 1px solid #123f491f;
  border-radius: 8px;
  place-items: center;
  min-height: 68px;
  padding: 10px 5px;
  font-size: 12px;
  font-weight: 800;
  display: grid;
}

.app-status-phone.app-status-real-shot {
  background: #fff;
  border-color: #fff3;
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.app-status-real-shot img {
  object-fit: cover;
  width: 100%;
  height: auto;
}

.app-status-real-shot figcaption {
  color: var(--ink);
  text-align: center;
  background: #fff;
  padding: 11px 14px;
  font-size: 12px;
  font-weight: 800;
}

.cta-panel {
  background: #0b5fc2;
  border-radius: 12px;
}

.cta-panel h2 em {
  color: #ffcf63;
}

.cta-panel .button-light {
  color: #061147;
}

.catalog-header {
  height: 84px;
}

.catalog-header .catalog-nav {
  padding-left: 90px;
}

.catalog-brand {
  min-width: 205px;
}

.catalog-brand b {
  font-size: 14px;
}

.catalog-brand small {
  font-size: 12px;
}

.catalog-nav > nav a,
.catalog-nav > div > a:first-child,
.catalog-filters button,
.catalog-cta,
.catalog-help a {
  font-size: 14px;
}

.catalog-tools input {
  font-size: 16px;
}

.catalog-count small,
.public-course-code,
.public-course-num,
.public-rating span,
.public-rating small,
.public-category,
.public-course-meta,
.detail-breadcrumb,
.detail-badge,
.detail-teacher small,
.detail-teacher b em,
.detail-section-tag,
.detail-numbers span,
.public-syllabus summary small,
.public-teacher > div small,
.enroll-cover > small,
.enroll-price del,
.placement-note small,
.book-cover > span,
.book-cover > small,
.book-cover > em,
.book-author small,
.book-feature-grid span,
.book-chapters span,
.book-chapters small,
.large-book-cover > small,
.order-book-cover > small,
.book-detail-badge,
.book-format-option p small,
.book-format-option li,
.book-buy-card > p,
.order-form label > span,
.payment-options small,
.order-terms {
  font-size: 12px;
  line-height: 1.55;
}

.public-course-body > p,
.detail-content > article > p,
.outcomes-grid p,
.public-syllabus details > div p,
.public-teacher > div p,
.enroll-card li,
.enroll-card > p,
.library-public-hero p,
.book-body > p,
.library-app-note p,
.book-detail-copy > p,
.book-info-content > article > p,
.book-feature-grid p,
.digital-policy p,
.order-heading p,
.order-product p {
  color: var(--muted-copy);
  font-size: 15px;
  line-height: 1.8;
}

.detail-copy > p {
  font-size: 15px;
  line-height: 1.8;
}

.detail-tabs a,
.public-course-bottom > a,
.book-details,
.book-format-option > a,
.order-success a {
  font-size: 14px;
}

.public-course-grid,
.home-course-result .course-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.home-course-result .course-card:last-child {
  grid-column: auto;
}

.course-content p {
  color: var(--muted-copy);
  font-size: 15px;
  line-height: 1.8;
}

.benefit-list p {
  color: #ffffffb8;
  font-size: 15px;
  line-height: 1.8;
}

.footer-brand > p {
  color: #ef7a63;
  font-size: 15px;
  line-height: 1.8;
}

.course-code,
.course-index,
.level-pill,
.teacher,
.course-footer,
.section-tag,
.cta-line,
.metric span {
  font-size: 12px;
}

.footer-grid > div > a {
  min-height: 44px;
  font-size: 14px;
}

.footer-bottom {
  color: #ffffffb3;
  font-size: 12px;
}

.faq-title p,
.faq-list details p,
.story-copy > p {
  color: var(--muted-copy);
  font-size: 16px;
}

.faq-list summary {
  min-height: 44px;
}

.kicker,
.benefit-list article > span,
.catalog-hero > div > div > span,
.catalog-help span,
.library-public-hero > div > div:first-child > span,
.library-intro > div > span,
.library-app-note span,
.app-only-gate > span,
.app-only-gate > small,
.order-product > a,
.order-product > div:last-child > span,
.order-heading > span,
.shipping-hint,
.order-summary > div,
.order-error,
.order-success > small {
  font-size: 12px;
  line-height: 1.55;
}

.student-proof p,
.experience-copy > p,
.cta-panel p,
.app-only-gate > p,
.order-success p {
  font-size: 15px;
  line-height: 1.8;
}

.trust-row,
.whatsapp,
.app-only-gate > div a,
.payment-options b,
.submit-order {
  font-size: 14px;
}

.app-only-gate > div a,
.order-success a {
  align-items: center;
  min-height: 44px;
  display: inline-flex;
}

.auth-brand small {
  color: #ffffffc7;
  font-size: 12px;
}

.auth-promise > span,
.auth-kicker {
  font-size: 13px;
}

.auth-proof span {
  color: #ffffffb8;
  font-size: 13px;
  line-height: 1.6;
}

.auth-separator {
  color: #687d82;
  font-size: 12px;
}

.auth-benefits b {
  font-size: 14px;
}

.auth-benefits small {
  color: var(--muted-meta);
  font-size: 13px;
  line-height: 1.55;
}

.auth-terms,
.auth-mode-switch {
  line-height: 1.7;
  color: var(--muted-meta) !important;
  font-size: 13px !important;
}

.register-steps span,
.register-includes h3,
.register-includes > div {
  font-size: 12px;
  line-height: 1.6;
}

.platform-badge {
  font-size: 12px;
}

.order-form section h2 {
  font-size: 14px;
}

.order-form label > span {
  color: #4f686e;
  font-size: 13px;
}

.payment-options b {
  font-size: 13px;
}

.payment-options small {
  color: var(--muted-meta);
  font-size: 12px;
}

.shipping-hint {
  color: #68532e;
}

.order-summary > div {
  color: #536c71;
}

.order-terms {
  color: var(--muted-meta);
}

html[data-theme="dark"] .order-summary > div {
  color: var(--dark-muted);
}

.course-card,
.public-course-card,
.book-card,
.catalog-tools > label,
.catalog-filters button,
.detail-numbers,
.outcomes-grid > div,
.public-syllabus details,
.book-feature-grid > div,
.book-chapters,
.book-format-option,
.order-form,
.auth-card fieldset {
  border-radius: 8px;
}

.button,
.button-small,
.auth-primary,
.catalog-cta,
.submit-order {
  border-radius: 4px;
}

html:not([data-theme="dark"])
  :where(
    .catalog-brand small,
    .catalog-count small,
    .public-rating small,
    .public-course-meta,
    .detail-tabs a,
    .detail-teacher small,
    .detail-numbers span,
    .public-syllabus summary small,
    .book-formats small,
    .book-author small,
    .book-chapters small,
    .book-format-option p small,
    .order-terms,
    .auth-card > p,
    .auth-benefits small,
    .auth-terms,
    .auth-mode-switch
  ) {
  color: var(--muted-meta) !important;
}

.catalog-footer .teacher-monogram,
footer .teacher-monogram {
  border-color: #ffffffb3;
}

.course-card.coral .course-cover,
.public-course-cover.coral,
.book-cover.coral,
.large-book-cover.coral,
.order-book-cover.coral {
  background: #0867d4;
}

.footer-grid {
  gap: 72px;
}

.footer-grid > div > a {
  align-items: center;
  min-height: 44px;
  display: inline-flex;
}

.footer-legal-links {
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  display: flex;
}

.footer-legal-links a {
  color: #ffffffc7;
  align-items: center;
  min-height: 44px;
  font-size: 12px;
  font-weight: 800;
  transition: color 0.18s;
  display: inline-flex;
}

.footer-legal-links a:hover {
  color: #fff;
}

.auth-card input,
.auth-card select,
.auth-card textarea,
.order-form input,
.order-form select,
.order-form textarea {
  font-size: 16px;
}

.student-app
  :is(
    .student-logo small,
    .sidebar-support p,
    .sidebar-support a,
    .back-to-site,
    .student-user b,
    .student-user small,
    .dashboard-greeting > div > span,
    .study-streak small,
    .eyebrow-app,
    .continue-copy > p,
    .continue-progress b,
    .app-section-head p,
    .app-section-head a,
    .mini-course > div > small,
    .library-body > span,
    .library-body p,
    .library-body a,
    .course-hero-app a,
    .course-hero-app > div > span,
    .course-hero-meta,
    .module-card summary small,
    .web-lesson > div > b,
    .web-lesson > div > small,
    .web-lesson > em,
    .overall-progress > span,
    .overall-progress p,
    .teacher-note div b,
    .teacher-note div p,
    .watch-breadcrumb,
    .lesson-heading > div:first-child > span,
    .lesson-heading p,
    .lesson-tabs button,
    .lesson-overview > p,
    .lesson-resources article b,
    .lesson-resources article small,
    .lesson-resources button,
    .lesson-nav span,
    .lesson-nav b,
    .lesson-playlist > div b,
    .lesson-playlist nav section h3,
    .lesson-playlist nav a > div b,
    .lesson-playlist nav a small,
    .exam-intro > span,
    .exam-intro > div small,
    .quiz-top,
    .upcoming-exams article div b,
    .upcoming-exams article small,
    .upcoming-exams article > i,
    .upcoming-exams article > a,
    .favorite-list small,
    .empty-state a,
    .profile-head p,
    .profile-head small,
    .profile-stats span,
    .profile-settings label span,
    .profile-settings > p,
    .signout,
    .student-mobile-nav a,
    .student-status-note,
    .lesson-playlist .playlist-locked b,
    .lesson-playlist .playlist-locked small,
    .lesson-unavailable > span,
    .lesson-control-error,
    .quiz-review b,
    .quiz-review p,
    .quiz-error
  ) {
  line-height: 1.6;
  font-size: 12px !important;
}

.student-app :is(.continue-copy > a, .course-order-link, .profile-edit) {
  min-height: 44px;
  font-size: 14px;
}

:is(
    .platform-key > span,
    .public-syllabus mark,
    .hero-books span,
    .format-legend,
    .book-body > span,
    .book-formats small,
    .book-author b,
    .book-chapters b,
    .digital-policy a,
    .book-format-option p b,
    .book-format-option > strong small,
    .course-request-brand small,
    .course-request-summary > span,
    .course-request-summary dt,
    .course-request-card > span,
    .course-request-form > div span,
    .course-request-form > p,
    .course-request-form > small,
    .access-notice p,
    .profile-actions .profile-edit,
    .profile-actions .signout,
    .site-socials > a
  ) {
  font-size: 12px;
  line-height: 1.6;
}

.digital-policy p {
  line-height: 1.8;
  font-size: 15px !important;
}

.course-request-summary > small,
.course-request-card > p {
  font-size: 14px;
  line-height: 1.8;
}

html[data-theme="dark"] .catalog-brand .teacher-monogram {
  border-color: #fff3;
}

.button,
.submit-order,
.course-request-primary {
  background: #0867d4;
}

.button:hover,
.submit-order:hover,
.course-request-primary:hover {
  background: #0b5fc2;
}

.experience,
.student-sidebar,
.app-only-gate,
footer,
.catalog-footer {
  background: #061147;
}

.auth-form-side {
  background: #fbfcff;
}

.auth-form-side .auth-kicker {
  color: #0867d4;
}

.auth-benefits i {
  color: #0867d4;
  background: #e7f0ff;
}

.library-app-note {
  color: #081b3a;
  background: #eef4ff;
  border-block: 1px solid #081b3a1f;
}

.library-app-note span {
  color: #0867d4;
}

.library-app-note p {
  color: #4f617c !important;
}

.library-app-note .app-note-icon {
  color: #0867d4;
  background: #fff;
  border: 1px solid #c9daf6;
  place-items: center;
  padding: 0;
  display: grid;
  box-shadow: 0 12px 30px -22px #0611478c;
}

.library-app-note .library-download-links a {
  color: #fff;
  background: #0867d4;
  border: 1px solid #0867d4;
}

.library-app-note .library-download-links a:last-child {
  color: #061147;
  background: #fff;
  border-color: #081b3a2e;
}

html[data-theme="dark"] .auth-form-side {
  background: var(--dark-bg);
}

html[data-theme="dark"] .library-app-note {
  border-color: var(--dark-line);
  background: var(--dark-surface-2);
  color: var(--dark-text);
}

html[data-theme="dark"] .library-app-note p {
  color: var(--dark-muted) !important;
}

.register-visual,
.app-only-gate {
  background: linear-gradient(145deg, #061147, #0d2f64);
}

.course-card.coral .course-cover,
.public-course-cover.coral,
.mini-course.coral .mini-cover,
.library-cover.coral,
.book-cover.coral,
.large-book-cover.coral,
.order-book-cover.coral {
  background: #0867d4;
}

.course-card.blue .course-cover,
.public-course-cover.mint,
.mini-course.mint .mini-cover,
.library-cover.mint,
.book-cover.mint,
.large-book-cover.mint,
.order-book-cover.mint {
  background: #ddebff;
}

.course-card.gold .course-cover,
.public-course-cover.gold,
.mini-course.gold .mini-cover,
.library-cover.gold,
.book-cover.gold,
.large-book-cover.gold,
.order-book-cover.gold {
  background: #ffcf63;
}

.book-cover.deep,
.large-book-cover.deep,
.order-book-cover.deep {
  color: #fff;
  background: #061147;
}

.book-cover.violet,
.large-book-cover.violet,
.order-book-cover.violet {
  color: #081b3a;
  background: #d9e3ff;
}

.book-detail-hero {
  background: #eaf2ff;
}

.home-hero,
.library-public-hero {
  color: #fff;
  background: #061147;
}

.home-hero-kicker,
.catalog-hero > div > div > span,
.library-public-hero > div > div:first-child > span {
  color: #f2cc7b;
}

.home-hero-kicker {
  border-color: #f2cc7b61;
}

.home-hero h1 em,
.catalog-hero h1 em,
.library-public-hero h1 em {
  color: #ef7a63;
}

.home-hero-description,
.catalog-hero p,
.library-public-hero p {
  color: #ffffffc2;
}

.home-hero-secondary {
  color: #fff;
  border-color: #ffffff40;
}

.home-hero-secondary:hover {
  color: #fff;
  background: #ffffff0f;
  border-color: #ffffff80;
}

.library-public-hero .hero-books i {
  background: #0867d4;
}

.library-public-hero .hero-books i:nth-child(2) {
  background: #ef7a63;
}

.library-public-hero .hero-books i:nth-child(3) {
  background: #ddebff;
}

.library-public-hero .hero-books i:nth-child(3):before {
  color: #061147;
}

.catalog-site .public-detail-hero {
  color: #081b3a;
  background: #ddebff;
}

.catalog-help {
  background: #eef4ff;
}

.continue-art,
.story-visual {
  background: #ddebff;
}

.auth-shape:after {
  background: #0867d424;
}

.app-status-phone section i b,
.continue-progress i,
.tiny-progress i,
.week-bars i.peak {
  background: #0867d4;
}

html[data-theme="dark"] .book-detail-hero {
  background: #0d1b32;
}

html[data-theme="dark"] .library-public-hero,
html[data-theme="dark"] .home-hero {
  color: #fff;
  background: #061147;
}

html[data-theme="dark"] .home-hero-description,
html[data-theme="dark"] .library-public-hero p {
  color: #ffffffc2;
}

html[data-theme="dark"] .catalog-site .public-detail-hero {
  color: #fff;
  background: #0d1b32;
}

html[data-theme="dark"] .continue-art,
html[data-theme="dark"] .story-visual {
  background: #142545;
}

html[data-theme="dark"] .home-hero {
  color: var(--dark-text);
  background: #061147;
}

html[data-theme="dark"] .home-hero-description {
  color: var(--dark-muted);
}

html[data-theme="dark"] .home-hero-secondary {
  color: var(--dark-text);
  border-color: var(--dark-line);
}

html[data-theme="dark"] .site-header {
  color: #fff;
  background: #061147e6;
}

html[data-theme="dark"] .site-header .nav-wrap {
  border-color: #ffffff29;
}

html[data-theme="dark"] .site-header .brand small,
html[data-theme="dark"] .site-header .desktop-nav a,
html[data-theme="dark"] .site-header .login-link {
  color: #ffffffc7;
}

html[data-theme="dark"] body:has(.site-header) .theme-toggle {
  color: #fff;
  background: #0a2b3375;
  border-color: #ffffff38;
}

@media (width<=1080px) {
  .desktop-nav {
    gap: 18px;
  }

  .nav-wrap {
    gap: 24px;
  }
}

@media (width<=900px) {
  .site-header .nav-wrap {
    gap: 14px;
    height: 84px;
    padding-inline-end: 58px;
  }

  .site-header .nav-actions {
    gap: 10px;
    margin-inline: auto 0;
  }

  .site-header .mobile-menu {
    flex: none;
    margin: 0;
    display: block;
    position: relative;
  }

  .site-header .mobile-menu summary {
    cursor: pointer;
    border: 1px solid #ffffff4d;
    place-content: center;
    gap: 4px;
    width: 44px;
    min-width: 44px;
    height: 44px;
    list-style: none;
    display: grid;
  }

  .site-header .mobile-menu summary::-webkit-details-marker {
    display: none;
  }

  .site-header .mobile-menu summary i {
    background: #fff;
    width: 18px;
    height: 2px;
    display: block;
  }

  .site-header .mobile-menu nav {
    z-index: 50;
    inset-inline-end: 0;
    border: 1px solid var(--line);
    background: var(--paper);
    width: min(270px, 100vw - 30px);
    color: var(--ink);
    border-radius: 8px;
    flex-direction: column;
    padding: 10px;
    position: absolute;
    top: calc(100% + 10px);
    box-shadow: 0 22px 52px -28px #061d2399;
  }

  .site-header .mobile-menu nav a {
    border-bottom: 1px solid var(--line);
    align-items: center;
    min-height: 44px;
    padding-inline: 12px;
    font-size: 14px;
    display: flex;
  }

  .site-header .mobile-menu nav a:last-child {
    border-bottom: 0;
  }
}

.site-contact-details a,
.site-contact-details span {
  min-height: 44px;
}

.site-socials > a,
.footer-bottom,
.auth-terms,
.student-topbar-copy small,
.catalog-hero > div > div > span,
.catalog-filters button,
.catalog-tools input,
.catalog-count small,
.public-rating span,
.public-rating small,
.public-category,
.public-course-meta,
.public-course-bottom del,
.public-course-bottom strong small,
.public-course-bottom > a,
.detail-breadcrumb,
.detail-badge,
.detail-teacher small,
.detail-teacher b,
.detail-teacher b em,
.detail-art > span,
.detail-tabs a,
.detail-section-tag,
.detail-numbers span,
.public-syllabus summary small,
.public-syllabus summary > span,
.public-syllabus details > div p,
.public-teacher > div small,
.enroll-cover > small,
.enroll-price del,
.enroll-price strong small,
.enroll-card li,
.placement-note b,
.placement-note small,
.enroll-card > p,
.library-public-hero > div > div:first-child > span,
.hero-books span,
.library-intro > div > span,
.format-legend,
.book-cover span,
.book-cover small,
.book-cover em,
.book-body > span,
.book-formats small,
.book-details,
.library-app-note span {
  font-size: 12px;
}

.public-course-body > p,
.public-syllabus summary b,
.public-teacher > div p,
.book-body > p {
  font-size: 14px !important;
}

.detail-content > article {
  scroll-margin-top: 90px;
}

.public-library-main .book-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 420px));
  justify-content: start;
}

.library-download-links {
  flex-wrap: wrap;
  gap: 9px;
  display: flex;
}

.library-download-links a {
  min-height: 46px;
  color: var(--deep);
  background: #fff;
  justify-content: center;
  align-items: center;
  padding-inline: 16px;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
}

.library-download-links a:last-child {
  color: #fff;
  background: 0 0;
  border: 1px solid #ffffff47;
}

@media (width<=680px) {
  .library-download-links {
    grid-column: 1/-1;
  }

  .library-download-links a {
    flex: 130px;
  }
}

@media (width<=980px) {
  .home-hero-layout {
    padding-bottom: 48px;
  }

  .home-hero-media {
    border-radius: 18px 18px 64px;
  }

  .site-header .brand,
  .catalog-brand {
    min-width: 0;
  }

  .app-status-grid {
    grid-template-columns: 1fr;
    gap: 52px;
  }

  .app-status-phone {
    justify-self: start;
  }
}

@media (width<=820px) {
  .auth-page {
    flex-direction: column;
    display: flex;
  }

  .auth-form-side {
    order: -1;
    padding: 34px 24px 30px;
  }

  .auth-visual {
    min-height: 220px;
    padding: 28px 24px;
  }

  .auth-promise {
    margin: 38px 0 0;
  }

  .auth-promise h1 {
    margin-block: 10px;
    font-size: 34px;
  }

  .auth-promise > p,
  .auth-proof,
  .register-steps {
    display: none;
  }
}

@media (width<=680px) {
  .container {
    width: min(100% - 32px, 1180px);
  }

  .site-header .nav-wrap {
    height: 76px;
  }

  .catalog-header {
    height: 72px;
  }

  .section,
  .experience,
  .app-status-section {
    padding-block: 70px;
  }

  .section-heading {
    margin-bottom: 28px;
  }

  .site-header .brand b {
    font-size: 14px;
  }

  .site-header .brand small {
    font-size: 12px;
  }

  .teacher-monogram {
    flex-basis: 40px;
    width: 40px;
    height: 40px;
    font-size: 12px;
  }

  .catalog-brand .teacher-monogram {
    flex-basis: 39px;
    width: 39px;
    height: 39px;
  }

  .home-hero-layout {
    padding-bottom: 28px;
  }

  .home-hero-copy {
    padding-block: 44px 22px;
  }

  .home-hero-media {
    border-radius: 12px 12px 42px;
  }

  .home-course-picker {
    padding: 18px;
  }

  .cta-panel {
    border-radius: 8px;
  }

  .footer-grid {
    gap: 38px 24px;
  }

  .footer-legal-links {
    justify-content: flex-start;
    gap: 16px;
  }

  .app-status-phone {
    justify-self: center;
    width: min(285px, 100%);
    min-height: 400px;
    transform: none;
  }

  .public-course-grid,
  .home-course-result .course-grid {
    grid-template-columns: 1fr;
  }

  .auth-form-side,
  .auth-visual {
    padding-inline: 20px;
  }
}

@media (width<=760px) {
  .site-header .nav-actions {
    display: none;
  }

  .site-header .mobile-menu {
    margin-inline-start: auto;
  }
}

@media (width<=430px) {
  .home-course-audiences {
    grid-template-columns: 1fr;
  }

  .site-header .brand small {
    display: none;
  }

  .site-header .brand {
    gap: 8px;
  }
}

.public-course-cover,
.detail-art.has-image,
.enroll-cover.has-image {
  color: #fff;
  text-shadow: 0 2px 16px #0000007a;
  background-position: 50%;
  background-size: cover;
}

.public-course-cover.teacher-course-cover,
.detail-art.teacher-course-cover,
.enroll-cover.teacher-course-cover {
  background-color: #061147;
  background-position: 50%, left 22px bottom -10px;
  background-repeat: no-repeat;
  background-size: 100% 100%, auto 108%;
}

.detail-art.teacher-course-cover {
  background-position: 50%, left 32px bottom -14px;
  background-size: 100% 100%, auto 110%;
}

.enroll-cover.teacher-course-cover {
  background-position: 50%, left 12px bottom -8px;
  background-size: 100% 100%, auto 112%;
}

.public-course-cover.teacher-course-cover > b {
  color: #ef7a63;
  opacity: 0.28;
}

.public-course-cover.teacher-course-cover-month-one,
.detail-art.teacher-course-cover-month-one,
.enroll-cover.teacher-course-cover-month-one {
  background-color: #0b2460;
  background-position: 50%, right 24px bottom -12px;
  background-size: 100% 100%, auto 112%;
}

.detail-art.teacher-course-cover-month-one {
  background-position: 50%, right 44px bottom -18px;
}

.enroll-cover.teacher-course-cover-month-one {
  background-position: 50%, right 14px bottom -10px;
}

.public-course-cover.teacher-course-cover-month-one > b {
  color: #ffcf63;
}

.detail-art.has-image:before,
.detail-art.has-image:after {
  border-color: #fff3;
}

.public-course-bottom strong {
  color: var(--ink);
  font: 900 18px var(--heading);
  margin-top: 3px;
}

.enroll-price {
  border-bottom: 1px solid var(--line);
  margin: 0 0 12px;
  padding: 0 0 14px;
}

.enroll-price span {
  color: var(--muted-meta);
  font-size: 12px;
  display: block;
}

.enroll-price strong {
  font-size: 25px;
}

html[data-theme="dark"] .public-course-bottom strong,
html[data-theme="dark"] .enroll-price strong {
  color: var(--dark-text);
}

@media (width<=900px) {
  .site-header .mobile-menu summary {
    border-color: var(--line);
  }

  .site-header .mobile-menu summary i {
    background: var(--ink);
  }

  html[data-theme="dark"] .site-header .mobile-menu summary {
    border-color: #ffffff4d;
  }

  html[data-theme="dark"] .site-header .mobile-menu summary i {
    background: #fff;
  }
}

:root {
  --motion-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-distance: 16px;
}

@keyframes motion-nav-in {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes motion-copy-in {
  0% {
    opacity: 0;
    transform: translateY(var(--motion-distance));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes motion-media-in {
  0% {
    opacity: 0;
    transform: translate(-18px, 12px) scale(0.975);
  }

  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes motion-scale-in {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
}

@keyframes motion-phone-float {
  0%,
  to {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-3px) rotate(-1.7deg);
  }
}

@keyframes motion-ambient {
  0%,
  to {
    transform: translate(0, 0) scale(1);
  }

  50% {
    transform: translate(8px, -6px) scale(1.015);
  }
}

@keyframes motion-accent-sweep {
  0% {
    opacity: 0;
    transform: scaleX(0);
  }

  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes motion-details-open {
  0% {
    opacity: 0;
    transform: translateY(-7px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes motion-menu-open {
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes motion-state-in {
  0% {
    opacity: 0.35;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: no-preference) {
  [data-motion-entrance] {
    animation: motion-copy-in 0.56s var(--motion-ease-out) both;
  }

  [data-motion-entrance="side"] {
    animation-name: motion-media-in;
    animation-duration: 0.64s;
  }

  [data-motion-entrance="scale"] {
    animation-name: motion-scale-in;
    animation-duration: 0.64s;
  }

  [data-motion-entrance][data-motion-order="1"] {
    animation-delay: 70ms;
  }

  [data-motion-entrance][data-motion-order="2"] {
    animation-delay: 0.125s;
  }

  [data-motion-entrance][data-motion-order="3"] {
    animation-delay: 0.18s;
  }

  [data-motion-entrance][data-motion-order="4"] {
    animation-delay: 0.22s;
  }

  .site-header .nav-wrap {
    animation: motion-nav-in 0.36s var(--motion-ease-out) both;
  }

  .home-hero-copy > * {
    animation: motion-copy-in 0.56s var(--motion-ease-out) both;
  }

  .home-hero-copy > :first-child {
    animation-delay: 80ms;
  }

  .home-hero-copy > :nth-child(2) {
    animation-delay: 0.135s;
  }

  .home-hero-copy > :nth-child(3) {
    animation-delay: 0.19s;
  }

  .home-hero-copy > :nth-child(4) {
    animation-delay: 0.245s;
  }

  .home-hero-copy > :nth-child(n + 5) {
    animation-delay: 0.3s;
  }

  .home-hero-media {
    animation: motion-media-in 0.68s 0.16s var(--motion-ease-out) both;
    transform-origin: 50% 75%;
  }

  .home-hero h1 em {
    display: inline-block;
    position: relative;
  }

  .home-hero h1 em:after {
    content: "";
    transform-origin: 100%;
    width: 94%;
    height: 3px;
    animation: motion-accent-sweep 0.62s 0.73s var(--motion-ease-out) both;
    background: linear-gradient(90deg, #ef7a63, #ffcf63);
    border-radius: 99px;
    position: absolute;
    bottom: -0.09em;
    right: 3%;
  }

  .home-hero:before {
    animation: motion-ambient 13s var(--motion-ease-soft) infinite;
    transform-origin: 50%;
  }

  html[data-motion="enhanced"]
    [data-motion-reveal][data-motion-state="waiting"] {
    opacity: 0;
    transition: opacity 0.52s var(--motion-ease-out) var(--motion-delay, 0s),
      transform 0.52s var(--motion-ease-out) var(--motion-delay, 0s);
    transform: translateY(16px);
  }

  html[data-motion="enhanced"]
    [data-motion-reveal="side"][data-motion-state="waiting"] {
    transform: translate(-18px, 6px);
  }

  html[data-motion="enhanced"]
    [data-motion-reveal="scale"][data-motion-state="waiting"] {
    transform: translateY(10px) scale(0.985);
  }

  html[data-motion="enhanced"]
    [data-motion-reveal][data-motion-state="waiting"].is-motion-visible {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }

  html[data-motion="enhanced"] .app-status-phone[data-motion-state="waiting"] {
    transform: translate(-10px, 10px) rotate(-2deg) scale(0.985);
  }

  html[data-motion="enhanced"]
    .app-status-phone[data-motion-state="waiting"].is-motion-visible {
    transform: translate(0, 0) rotate(-2deg) scale(1);
  }

  details[open] > :not(summary) {
    animation: motion-details-open 0.25s var(--motion-ease-out) both;
  }

  :is(.mobile-menu, .catalog-mobile-menu)[open] > nav {
    transform-origin: top;
    animation: motion-menu-open 0.24s var(--motion-ease-out) both;
  }

  .catalog-course-result .public-course-grid {
    animation: home-course-swap 0.28s var(--motion-ease-out) both;
  }

  .motion-state-swap {
    animation: motion-state-in 0.26s var(--motion-ease-out) both;
  }

  :is(
      .course-card,
      .public-course-card,
      .book-card,
      .home-blog-card,
      .home-notes-feature,
      .benefit-list article,
      .quick-stats article,
      .weekly-card,
      .module-card
    ) {
    transition: transform 0.26s var(--motion-ease-out),
      box-shadow 0.26s var(--motion-ease-out), border-color 0.22s ease;
  }

  :is(
      .button,
      .home-hero-primary,
      .home-hero-secondary,
      .catalog-cta,
      .course-footer a,
      .public-course-bottom > a,
      .book-details,
      .detail-final a,
      .enroll-card > a,
      .library-download-links a,
      .auth-primary,
      .all-courses,
      .story-link,
      .app-status-link,
      .home-notes-primary,
      .home-notes-secondary,
      .home-blog-read,
      .course-order-link,
      .course-request-primary
    ) {
    transition: transform 0.21s var(--motion-ease-out),
      box-shadow 0.21s var(--motion-ease-out), background-color 0.18s ease,
      border-color 0.18s ease;
  }

  :is(
      .button,
      .home-hero-primary,
      .home-hero-secondary,
      .catalog-cta,
      .course-footer a,
      .public-course-bottom > a,
      .book-details,
      .detail-final a,
      .enroll-card > a,
      .library-download-links a,
      .auth-primary,
      .home-notes-primary,
      .home-notes-secondary,
      .course-order-link,
      .course-request-primary
    ):active {
    transform: translateY(1px) scale(0.985);
  }

  :is(
      .button,
      .home-hero-primary,
      .home-hero-secondary,
      .catalog-cta,
      .story-link,
      .all-courses,
      .app-status-link,
      .home-notes-primary,
      .home-notes-secondary,
      .home-blog-read,
      .public-course-bottom > a,
      .detail-final a,
      .course-order-link,
      .course-request-primary
    )
    > span {
    transition: transform 0.22s var(--motion-ease-out);
    display: inline-block;
  }

  .home-course-audiences button,
  .catalog-filters button,
  .student-nav a,
  .site-socials a,
  .faq-list summary {
    transition: transform 0.2s var(--motion-ease-out),
      background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  }

  .faq-list summary span {
    transition: transform 0.24s var(--motion-ease-out);
  }

  .home-blog-read i {
    transition: transform 0.22s var(--motion-ease-out);
  }

  .faq-list details[open] summary span {
    transform: rotate(45deg) scale(1.05);
  }

  :is(
      .theme-toggle,
      .home-course-audiences button,
      .catalog-filters button,
      .quiz-live > div:last-child button
    ):active {
    transform: translateY(1px) scale(0.99);
  }

  @media (hover: hover) and (pointer: fine) {
    :is(.course-card, .public-course-card, .book-card, .home-blog-card):hover,
    .home-notes-feature:hover,
    :is(
        .benefit-list article,
        .quick-stats article,
        .weekly-card,
        .module-card
      ):hover {
      transform: translateY(-4px);
    }

    :is(
        .button,
        .home-hero-primary,
        .home-hero-secondary,
        .catalog-cta,
        .public-course-bottom > a,
        .book-details,
        .detail-final a,
        .enroll-card > a,
        .library-download-links a,
        .auth-primary,
        .home-notes-primary,
        .home-notes-secondary,
        .course-order-link,
        .course-request-primary
      ):hover {
      transform: translateY(-2px);
    }

    :is(
        .button,
        .home-hero-primary,
        .home-hero-secondary,
        .catalog-cta,
        .story-link,
        .all-courses,
        .app-status-link,
        .home-notes-primary,
        .home-notes-secondary,
        .home-blog-read,
        .public-course-bottom > a,
        .detail-final a,
        .course-order-link,
        .course-request-primary
      ):hover
      > span {
      transform: translate(-4px);
    }

    .home-blog-card:hover .home-blog-read i {
      transform: translate(-5px);
    }

    .home-course-audiences button:hover,
    .catalog-filters button:hover,
    .site-socials a:hover {
      transform: translateY(-2px);
    }

    .student-nav a:hover {
      transform: translate(-3px);
    }
  }

  @media (width>=1025px) and (hover: hover) and (pointer: fine) {
    .app-status-phone[data-motion-state="shown"] {
      animation: motion-phone-float 10s 1s var(--motion-ease-soft) infinite;
      transform-origin: 50%;
    }
  }
}

@media (width<=1024px) and (prefers-reduced-motion: no-preference) {
  .home-hero:before {
    animation-iteration-count: 1;
  }

  html[data-motion="enhanced"] .app-status-phone[data-motion-state="waiting"],
  html[data-motion="enhanced"]
    .app-status-phone[data-motion-state="waiting"].is-motion-visible {
    transform: none;
  }

  html[data-motion="enhanced"] [data-motion-reveal] {
    transition-duration: 0.48s;
  }
}

@media (hover: none), (pointer: coarse) {
  :is(
      .theme-toggle,
      .button,
      .home-hero-primary,
      .auth-primary,
      .course-card,
      .public-course-card,
      .book-card,
      .home-blog-card,
      .home-notes-feature,
      .course-order-link,
      .course-request-primary,
      .home-course-audiences button,
      .site-socials > a
    ):hover {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }

  *,
  :before,
  :after {
    scroll-behavior: auto !important;
    transition: none !important;
    animation: none !important;
  }
}

._page_11385_1 {
  background: var(--paper);
  overflow: clip;
}

._hero_11385_3 {
  background: var(--deep);
  color: #fff;
  padding: 74px 0 82px;
  overflow: hidden;
}

._heroGrid_11385_4 {
  grid-template-columns: 1.05fr 0.75fr;
  align-items: center;
  gap: clamp(54px, 8vw, 108px);
  display: grid;
}

._eyebrow_11385_5,
._sectionHead_11385_5 span,
._ctaPanel_11385_5 > div > span {
  color: #f2cc7b;
  font-size: 13px;
  font-weight: 800;
}

._hero_11385_3 h1 {
  max-width: 760px;
  font: 900 clamp(46px, 5vw, 66px) / 1.2 var(--heading);
  letter-spacing: -0.025em;
  margin: 16px 0;
}

._hero_11385_3 h1 em {
  color: #ef7a63;
  font-style: normal;
}

._heroCopy_11385_8 > p {
  color: #ffffffb8;
  max-width: 670px;
  margin: 0;
  font-size: 17px;
  line-height: 1.95;
}

._heroActions_11385_9 {
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
  margin-top: 30px;
  display: flex;
}

._heroActions_11385_9 > a:first-child,
._ctaPanel_11385_5 > a {
  color: #fff;
  min-height: 52px;
  font: 800 14px var(--heading);
  background: #c74838;
  justify-content: center;
  align-items: center;
  gap: 22px;
  padding: 0 22px;
  display: inline-flex;
}

._heroActions_11385_9 > a:last-child {
  border-bottom: 1px solid #ffffff8c;
  align-items: center;
  min-height: 44px;
  font-size: 14px;
  font-weight: 800;
  display: inline-flex;
}

._portrait_11385_12 {
  aspect-ratio: 4/5;
  background: #c7ded8;
  border: 8px solid #ffffff21;
  border-radius: 18px 18px 76px;
  margin: 0;
  position: relative;
  overflow: hidden;
}

._portrait_11385_12 img {
  object-fit: contain;
  object-position: center bottom;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

._portrait_11385_12:after {
  content: "";
  background: linear-gradient(#0000, #09232adb);
  position: absolute;
  inset: 45% 0 0;
}

._portrait_11385_12 figcaption {
  z-index: 1;
  flex-direction: column;
  display: flex;
  position: absolute;
  bottom: 22px;
  left: 24px;
  right: 24px;
}

._portrait_11385_12 figcaption span {
  font: 900 20px var(--heading);
}

._portrait_11385_12 figcaption small {
  color: #ffffffd1;
  margin-top: 4px;
  font-size: 13px;
}

._method_11385_19,
._honor_11385_19,
._activities_11385_19 {
  padding: 92px 0;
}

._sectionHead_11385_5 {
  grid-template-columns: 1.05fr 0.65fr;
  align-items: end;
  gap: 70px;
  margin-bottom: 36px;
  display: grid;
}

._sectionHead_11385_5 span {
  color: var(--coral);
}

._sectionHead_11385_5 h2,
._ctaPanel_11385_5 h2 {
  font: 900 clamp(31px, 3.5vw, 47px) / 1.35 var(--heading);
  letter-spacing: -0.035em;
  margin: 7px 0 0;
}

._sectionHead_11385_5 > p {
  color: #536c71;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
}

._principles_11385_25,
._activityGrid_11385_25 {
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  display: grid;
}

._principles_11385_25 article,
._activityGrid_11385_25 article {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 8px;
  min-height: 218px;
  padding: 27px;
}

._principles_11385_25 article > span,
._activityGrid_11385_25 article > span {
  color: var(--coral);
  font: 800 12px var(--heading);
}

._principles_11385_25 h3,
._activityGrid_11385_25 h3 {
  font: 800 20px var(--heading);
  margin: 42px 0 8px;
}

._principles_11385_25 p,
._activityGrid_11385_25 p {
  color: #536c71;
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
}

._honor_11385_19 {
  background: var(--cream);
}

._honorGrid_11385_32 {
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  display: grid;
}

._honorGrid_11385_32 > article {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

._honorGrid_11385_32 header {
  color: #fff;
  background: #173f49;
  align-items: center;
  gap: 14px;
  min-height: 94px;
  padding: 19px;
  display: flex;
}

._honorGrid_11385_32 header > span {
  width: 48px;
  height: 48px;
  font: 900 15px var(--heading);
  background: #c74838;
  flex: none;
  place-items: center;
  display: grid;
}

._honorGrid_11385_32 header small {
  color: #ffffffc2;
  font-size: 12px;
}

._honorGrid_11385_32 h3 {
  font: 800 17px var(--heading);
  margin: 3px 0 0;
}

._emptyHonor_11385_38 {
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 205px;
  padding: 28px;
  display: flex;
}

._emptyHonor_11385_38 > span {
  color: #9a7427;
  background: #f5ead3;
  border-radius: 50%;
  place-items: center;
  width: 46px;
  height: 46px;
  display: grid;
}

._emptyHonor_11385_38 h4 {
  font: 800 14px var(--heading);
  margin: 15px 0 5px;
}

._emptyHonor_11385_38 p {
  color: #5b7176;
  max-width: 290px;
  margin: 0;
  font-size: 14px;
  line-height: 1.75;
}

._honorComing_11385_42 {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

._stageChips_11385_43 {
  background: #061147;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: 78px;
  padding: 18px;
  display: flex;
}

._stageChips_11385_43 span {
  color: #fff;
  border: 1px solid #ffffff3d;
  border-radius: 99px;
  align-items: center;
  min-height: 40px;
  padding: 0 17px;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
}

._honorComing_11385_42 ._emptyHonor_11385_38 {
  min-height: 245px;
}

._honorComing_11385_42 ._emptyHonor_11385_38 h3 {
  font: 800 20px var(--heading);
  margin: 15px 0 6px;
}

._honorComing_11385_42 ._emptyHonor_11385_38 p {
  max-width: 560px;
}

._activities_11385_19 {
  background: var(--paper);
}

._activityGrid_11385_25 article {
  min-height: 230px;
}

._activityNotice_11385_51 {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 10px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 22px;
  min-height: 126px;
  padding: 25px 28px;
  display: grid;
}

._activityNotice_11385_51 > span {
  color: #795a1b;
  background: #f5ead3;
  border-radius: 99px;
  justify-content: center;
  align-items: center;
  min-width: 70px;
  min-height: 40px;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
}

._activityNotice_11385_51 h3 {
  font: 800 20px var(--heading);
  margin: 0 0 6px;
}

._activityNotice_11385_51 p {
  color: #536c71;
  margin: 0;
  font-size: 14px;
  line-height: 1.75;
}

._activityNotice_11385_51 > a {
  min-height: 44px;
  color: var(--coral);
  align-items: center;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
}

._cta_11385_5 {
  background: var(--cream);
  padding: 0 0 88px;
}

._ctaPanel_11385_5 {
  color: #fff;
  background: #bf4031;
  border-radius: 10px;
  justify-content: space-between;
  align-items: center;
  gap: 36px;
  padding: 50px 58px;
  display: flex;
}

._ctaPanel_11385_5 > div > span {
  color: #ffe39c;
}

._ctaPanel_11385_5 h2 {
  font-size: clamp(29px, 3.1vw, 42px);
}

._ctaPanel_11385_5 > a {
  color: #123f49;
  background: #fff;
  flex: none;
}

html[data-theme="dark"] ._page_11385_1,
html[data-theme="dark"] ._activities_11385_19 {
  background: var(--dark-bg);
  color: var(--dark-text);
}

html[data-theme="dark"] ._honor_11385_19,
html[data-theme="dark"] ._cta_11385_5 {
  background: #0d181b;
}

html[data-theme="dark"] ._principles_11385_25 article,
html[data-theme="dark"] ._activityGrid_11385_25 article,
html[data-theme="dark"] ._honorGrid_11385_32 > article,
html[data-theme="dark"] ._honorComing_11385_42,
html[data-theme="dark"] ._activityNotice_11385_51 {
  background: var(--dark-surface);
  border-color: var(--dark-line);
}

html[data-theme="dark"] ._sectionHead_11385_5 > p,
html[data-theme="dark"] ._principles_11385_25 p,
html[data-theme="dark"] ._activityGrid_11385_25 p,
html[data-theme="dark"] ._emptyHonor_11385_38 p,
html[data-theme="dark"] ._activityNotice_11385_51 p {
  color: var(--dark-muted);
}

@media (width<=900px) {
  ._heroGrid_11385_4 {
    grid-template-columns: 1fr;
  }

  ._portrait_11385_12 {
    aspect-ratio: 4/5;
    width: min(480px, 100%);
  }

  ._honorGrid_11385_32 {
    grid-template-columns: 1fr 1fr;
  }

  ._honorGrid_11385_32 > article:last-child {
    grid-column: 1/-1;
  }

  ._activityNotice_11385_51 {
    grid-template-columns: auto 1fr;
  }

  ._activityNotice_11385_51 > a {
    grid-column: 2;
  }
}

@media (width<=680px) {
  ._hero_11385_3 {
    padding: 58px 0 64px;
  }

  ._heroGrid_11385_4 {
    gap: 40px;
  }

  ._hero_11385_3 h1 {
    font-size: 41px;
  }

  ._heroCopy_11385_8 > p {
    font-size: 15px;
  }

  ._portrait_11385_12 {
    aspect-ratio: 4/5;
    border-width: 6px;
    border-radius: 12px 12px 46px;
  }

  ._method_11385_19,
  ._honor_11385_19,
  ._activities_11385_19 {
    padding: 68px 0;
  }

  ._sectionHead_11385_5 {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 27px;
  }

  ._principles_11385_25,
  ._activityGrid_11385_25,
  ._honorGrid_11385_32 {
    grid-template-columns: 1fr;
  }

  ._honorGrid_11385_32 > article:last-child {
    grid-column: auto;
  }

  ._principles_11385_25 article,
  ._activityGrid_11385_25 article {
    min-height: 0;
  }

  ._principles_11385_25 h3,
  ._activityGrid_11385_25 h3 {
    margin-top: 25px;
  }

  ._cta_11385_5 {
    padding-bottom: 60px;
  }

  ._ctaPanel_11385_5 {
    flex-direction: column;
    align-items: flex-start;
    padding: 38px 24px;
  }

  ._ctaPanel_11385_5 > a {
    width: 100%;
  }

  ._activityNotice_11385_51 {
    grid-template-columns: 1fr;
    align-items: start;
  }

  ._activityNotice_11385_51 > a {
    grid-column: auto;
  }
}

._page_zv4ys_1 {
  color: #061147;
  background: #f5f7fb;
  min-height: 100dvh;
  overflow: clip;
}

._listingHero_zv4ys_8,
._articleHero_zv4ys_9 {
  color: #fff;
  background: #061147;
  position: relative;
  overflow: hidden;
}

._listingHero_zv4ys_8:before,
._articleHero_zv4ys_9:before {
  content: "";
  border: 1px solid #ffffff1a;
  border-radius: 50%;
  width: 560px;
  height: 560px;
  position: absolute;
  top: -330px;
  left: -320px;
}

._listingHero_zv4ys_8:after,
._articleHero_zv4ys_9:after {
  content: "";
  border: 56px solid #0867d42b;
  border-radius: 50%;
  width: 250px;
  height: 250px;
  position: absolute;
  bottom: -165px;
  right: -150px;
}

._listingHeroGrid_zv4ys_40,
._articleHeroGrid_zv4ys_41 {
  z-index: 1;
  grid-template-columns: minmax(0, 1.1fr) minmax(310px, 0.7fr);
  align-items: center;
  gap: clamp(50px, 8vw, 110px);
  display: grid;
  position: relative;
}

._listingHeroGrid_zv4ys_40 {
  min-height: 540px;
  padding-block: 72px;
}

._eyebrow_zv4ys_55,
._articleCategory_zv4ys_56,
._sectionHeading_zv4ys_57 span,
._blogCta_zv4ys_58 > div > span,
._relatedHeading_zv4ys_59 > span {
  color: #ef7a63;
  font-size: 13px;
  font-weight: 900;
}

._eyebrow_zv4ys_55 {
  align-items: center;
  gap: 10px;
  display: inline-flex;
}

._eyebrow_zv4ys_55:before {
  content: "";
  background: #ef7a63;
  width: 34px;
  height: 2px;
}

._heroCopy_zv4ys_78 h1 {
  max-width: 720px;
  font: 900 clamp(48px, 5.3vw, 74px) / 1.16 var(--heading);
  letter-spacing: -0.04em;
  margin: 16px 0 18px;
}

._heroCopy_zv4ys_78 h1 em,
._articleHeroCopy_zv4ys_86 h1 em {
  color: #ef7a63;
  font-style: normal;
}

._heroCopy_zv4ys_78 > p {
  color: #ffffffbd;
  max-width: 650px;
  margin: 0;
  font-size: 17px;
  line-height: 1.9;
}

._heroMeta_zv4ys_99 {
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 28px;
  display: flex;
}

._heroMeta_zv4ys_99 span {
  color: #ffffffb3;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  font-size: 13px;
  display: inline-flex;
}

._heroMeta_zv4ys_99 b {
  color: #fff;
  font: 900 19px var(--heading);
}

._heroMethod_zv4ys_120 {
  background: #ffffff12;
  border: 1px solid #ffffff2e;
  min-height: 330px;
  padding: 34px;
  position: relative;
  box-shadow: 24px 24px #0867d433;
}

._heroMethod_zv4ys_120:after {
  content: "";
  border: 1px solid #ffffff24;
  border-radius: 50%;
  width: 110px;
  height: 110px;
  position: absolute;
  top: 24px;
  left: 25px;
}

._heroMethod_zv4ys_120 > span {
  color: #ef7a63;
  font-size: 12px;
  font-weight: 900;
}

._heroMethod_zv4ys_120 > strong {
  z-index: 1;
  font: 900 31px / 1.45 var(--heading);
  margin-top: 12px;
  display: block;
  position: relative;
}

._heroMethod_zv4ys_120 > strong em {
  color: #ef7a63;
  font-style: normal;
}

._heroMethod_zv4ys_120 ol {
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
}

._heroMethod_zv4ys_120 li {
  background: #ffffff0f;
  border-top: 2px solid #0867d4;
  flex-direction: column;
  justify-content: center;
  min-height: 66px;
  padding: 11px;
  display: flex;
}

._heroMethod_zv4ys_120 li b {
  color: #ef7a63;
  font: 900 11px var(--heading);
}

._heroMethod_zv4ys_120 li span {
  color: #ffffffd1;
  margin-top: 3px;
  font-size: 12px;
  font-weight: 800;
}

._blogMain_zv4ys_190 {
  padding: 86px 0 100px;
}

._sectionHeading_zv4ys_57 {
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.52fr);
  align-items: end;
  gap: 65px;
  margin-bottom: 34px;
  display: grid;
}

._sectionHeading_zv4ys_57 h2,
._relatedHeading_zv4ys_59 h2 {
  font: 900 clamp(30px, 3.4vw, 46px) / 1.35 var(--heading);
  letter-spacing: -0.03em;
  margin: 7px 0 0;
}

._sectionHeading_zv4ys_57 > p {
  color: #586984;
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
}

._articleGrid_zv4ys_216 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  display: grid;
}

._articleCard_zv4ys_222 {
  background: #fff;
  border: 1px solid #dbe3f0;
  border-radius: 12px;
  min-width: 0;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  box-shadow: 0 24px 60px -48px #0611478c;
}

@media (hover: hover) and (pointer: fine) {
  ._articleCard_zv4ys_222:hover {
    transform: translateY(-4px);
    box-shadow: 0 34px 70px -48px #061147a6;
  }
}

._featuredCard_zv4ys_239 {
  grid-column: 1/-1;
}

._cardLink_zv4ys_243 {
  min-height: 100%;
  color: inherit;
  grid-template-rows: 225px 1fr;
  display: grid;
}

._featuredCard_zv4ys_239 ._cardLink_zv4ys_243 {
  grid-template-rows: minmax(300px, auto);
  grid-template-columns: minmax(280px, 0.78fr) minmax(0, 1.22fr);
}

._cardVisual_zv4ys_255 {
  color: #fff;
  background: #061147;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

._cardVisual_zv4ys_255:before,
._cardVisual_zv4ys_255:after {
  opacity: 0.15;
  content: "";
  border: 1px solid;
  border-radius: 50%;
  position: absolute;
}

._cardVisual_zv4ys_255:before {
  width: 220px;
  height: 220px;
  bottom: -120px;
  left: -95px;
}

._cardVisual_zv4ys_255:after {
  width: 105px;
  height: 105px;
  bottom: -52px;
  left: -32px;
}

._cardVisual_zv4ys_255 > span {
  z-index: 1;
  font-size: 12px;
  font-weight: 900;
  position: relative;
}

._cardVisual_zv4ys_255 > strong {
  z-index: 1;
  font: 900 clamp(58px, 8vw, 110px) / 1 var(--heading);
  letter-spacing: -0.08em;
  position: absolute;
  bottom: 20px;
  right: 24px;
}

._cardVisual_zv4ys_255 > small {
  font: 900 13px var(--heading);
  position: absolute;
  top: 21px;
  left: 23px;
}

._toneNavy_zv4ys_309 ._cardVisual_zv4ys_255 {
  background: #061147;
}

._toneBlue_zv4ys_313 ._cardVisual_zv4ys_255 {
  background: #0867d4;
}

._toneCoral_zv4ys_317 ._cardVisual_zv4ys_255 {
  color: #061147;
  background: #ef7a63;
}

._cardBody_zv4ys_322 {
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  display: flex;
}

._featuredCard_zv4ys_239 ._cardBody_zv4ys_322 {
  justify-content: center;
  padding: clamp(32px, 5vw, 58px);
}

._cardMeta_zv4ys_334 {
  color: #63718b;
  flex-wrap: wrap;
  gap: 9px 17px;
  font-size: 12px;
  font-weight: 800;
  display: flex;
}

._cardMeta_zv4ys_334 span:first-child {
  color: #0867d4;
}

._cardBody_zv4ys_322 h2 {
  font: 900 clamp(21px, 2.2vw, 31px) / 1.45 var(--heading);
  letter-spacing: -0.02em;
  margin: 13px 0 9px;
}

._cardBody_zv4ys_322 p {
  color: #586984;
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
}

._readLink_zv4ys_360 {
  color: #0867d4;
  align-items: center;
  gap: 18px;
  min-height: 44px;
  margin-top: auto;
  padding-top: 20px;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
}

._readLink_zv4ys_360 i {
  color: #ef7a63;
  font-size: 18px;
  font-style: normal;
}

._blogCta_zv4ys_58 {
  color: #fff;
  background: #061147;
  border-radius: 12px;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  margin-top: 74px;
  padding: 42px 46px;
  display: flex;
}

._blogCta_zv4ys_58 h2 {
  font: 900 clamp(25px, 3vw, 38px) / 1.35 var(--heading);
  margin: 5px 0;
}

._blogCta_zv4ys_58 p {
  color: #ffffffb3;
  margin: 0;
  font-size: 14px;
}

._blogCta_zv4ys_58 > a,
._articleConclusion_zv4ys_402 > a {
  color: #fff;
  min-height: 50px;
  font: 900 14px var(--heading);
  background: #0867d4;
  border-radius: 4px;
  flex: none;
  justify-content: center;
  align-items: center;
  gap: 22px;
  padding: 0 20px;
  display: inline-flex;
}

._articleHeroGrid_zv4ys_41 {
  min-height: 500px;
  padding-block: 60px;
}

._breadcrumbs_zv4ys_422 {
  color: #ffffff94;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 34px;
  font-size: 12px;
  display: flex;
}

._breadcrumbs_zv4ys_422 a {
  align-items: center;
  min-height: 44px;
  display: inline-flex;
}

._breadcrumbs_zv4ys_422 a:hover {
  color: #fff;
}

._breadcrumbs_zv4ys_422 b {
  color: #fffc;
}

._articleCategory_zv4ys_56 {
  border: 1px solid #ef7a636b;
  border-radius: 99px;
  padding: 7px 10px;
  display: inline-flex;
}

._articleHeroCopy_zv4ys_86 h1 {
  max-width: 830px;
  font: 900 clamp(42px, 5vw, 66px) / 1.23 var(--heading);
  letter-spacing: -0.04em;
  margin: 15px 0 18px;
}

._articleHeroCopy_zv4ys_86 > p {
  color: #ffffffb8;
  max-width: 760px;
  margin: 0;
  font-size: 16px;
  line-height: 1.9;
}

._articleMeta_zv4ys_468 {
  color: #ffffff9e;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-top: 23px;
  font-size: 12px;
  font-weight: 800;
  display: flex;
}

._articleMark_zv4ys_478 {
  color: #fff;
  background: #0867d4;
  border: 1px solid #fff3;
  flex-direction: column;
  justify-content: space-between;
  min-height: 290px;
  padding: 28px;
  display: flex;
  position: relative;
  overflow: hidden;
}

._articleMark_zv4ys_478:before,
._articleMark_zv4ys_478:after {
  content: "";
  border: 1px solid #fff3;
  border-radius: 50%;
  position: absolute;
}

._articleMark_zv4ys_478:before {
  width: 260px;
  height: 260px;
  bottom: -130px;
  left: -120px;
}

._articleMark_zv4ys_478:after {
  width: 145px;
  height: 145px;
  bottom: -72px;
  left: -60px;
}

._articleHero_zv4ys_9._toneNavy_zv4ys_309 ._articleMark_zv4ys_478 {
  background: #0867d4;
}

._articleHero_zv4ys_9._toneBlue_zv4ys_313 ._articleMark_zv4ys_478 {
  color: #061147;
  background: #ef7a63;
}

._articleHero_zv4ys_9._toneCoral_zv4ys_317 ._articleMark_zv4ys_478 {
  color: #061147;
  background: #fff;
}

._articleMark_zv4ys_478 small,
._articleMark_zv4ys_478 span,
._articleMark_zv4ys_478 strong {
  z-index: 1;
  position: relative;
}

._articleMark_zv4ys_478 small {
  font: 900 13px var(--heading);
}

._articleMark_zv4ys_478 strong {
  font: 900 clamp(72px, 9vw, 118px) / 1 var(--heading);
  letter-spacing: -0.08em;
}

._articleMark_zv4ys_478 span {
  letter-spacing: 0.08em;
  align-self: flex-end;
  font-size: 11px;
  font-weight: 900;
}

._articleMain_zv4ys_550 {
  background: #f5f7fb;
}

._articleLayout_zv4ys_554 {
  grid-template-columns: minmax(0, 1fr) 285px;
  align-items: start;
  gap: 28px;
  padding-block: 62px 90px;
  display: grid;
}

._articleBody_zv4ys_562 {
  background: #fff;
  border: 1px solid #dbe3f0;
  border-radius: 12px;
  min-width: 0;
  padding: clamp(30px, 5vw, 62px);
}

._articleLead_zv4ys_570 {
  color: #283655;
  background: #fff3ef;
  border-right: 4px solid #ef7a63;
  margin: 0 0 40px;
  padding: 22px 24px;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.9;
}

._contentSection_zv4ys_581 {
  border-top: 1px solid #e1e7f0;
  padding: 39px 0;
  scroll-margin-top: 22px;
  position: relative;
}

._contentSection_zv4ys_581:first-of-type {
  border-top: 0;
  padding-top: 0;
}

._sectionNumber_zv4ys_593 {
  color: #ef7a63;
  font: 900 12px var(--heading);
  margin-bottom: 8px;
  display: block;
}

._contentSection_zv4ys_581 h2 {
  color: #061147;
  font: 900 clamp(24px, 2.7vw, 33px) / 1.45 var(--heading);
  letter-spacing: -0.025em;
  margin: 0 0 14px;
}

._contentSection_zv4ys_581 > p {
  color: #4f617c;
  margin: 0 0 13px;
  font-size: 16px;
  line-height: 2;
}

._contentSection_zv4ys_581 ul {
  gap: 9px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
}

._contentSection_zv4ys_581 li {
  color: #425572;
  background: #f9fbff;
  border: 1px solid #e0e7f1;
  border-radius: 6px;
  padding: 11px 43px 11px 14px;
  font-size: 15px;
  line-height: 1.75;
  position: relative;
}

._contentSection_zv4ys_581 li:before {
  color: #0867d4;
  content: "✓";
  background: #e8f1ff;
  border-radius: 50%;
  place-items: center;
  width: 20px;
  height: 20px;
  font-size: 11px;
  font-weight: 900;
  display: grid;
  position: absolute;
  top: 13px;
  right: 15px;
}

._tip_zv4ys_649 {
  background: #edf4ff;
  border-right: 4px solid #0867d4;
  margin-top: 22px;
  padding: 19px 20px;
}

._tip_zv4ys_649 b {
  color: #0867d4;
  font: 900 13px var(--heading);
}

._tip_zv4ys_649 p {
  color: #425572;
  margin: 5px 0 0;
  font-size: 14px;
  line-height: 1.85;
}

._articleConclusion_zv4ys_402 {
  color: #fff;
  background: #061147;
  border-radius: 9px;
  margin-top: 18px;
  padding: 34px;
}

._articleConclusion_zv4ys_402 > span {
  color: #ef7a63;
  font-size: 12px;
  font-weight: 900;
}

._articleConclusion_zv4ys_402 h2 {
  font: 900 clamp(24px, 3vw, 34px) / 1.45 var(--heading);
  margin: 7px 0 9px;
}

._articleConclusion_zv4ys_402 p {
  color: #ffffffb3;
  margin: 0;
  font-size: 14px;
  line-height: 1.85;
}

._articleConclusion_zv4ys_402 > a {
  width: fit-content;
  margin-top: 20px;
}

._articleAside_zv4ys_699 {
  gap: 16px;
  display: grid;
  position: sticky;
  top: 22px;
}

._toc_zv4ys_706,
._takeawayCard_zv4ys_707 {
  background: #fff;
  border: 1px solid #dbe3f0;
  border-radius: 10px;
  padding: 23px;
}

._toc_zv4ys_706 > span,
._takeawayCard_zv4ys_707 > span {
  color: #0867d4;
  font: 900 13px var(--heading);
  margin-bottom: 13px;
  display: block;
}

._toc_zv4ys_706 a {
  color: #53647f;
  border-top: 1px solid #e5eaf2;
  grid-template-columns: 27px 1fr;
  align-items: start;
  gap: 8px;
  min-height: 48px;
  padding-block: 9px;
  font-size: 12px;
  line-height: 1.65;
  display: grid;
}

._toc_zv4ys_706 a:hover {
  color: #0867d4;
}

._toc_zv4ys_706 a b {
  color: #ef7a63;
  font: 900 10px var(--heading);
}

._takeawayCard_zv4ys_707 {
  color: #fff;
  background: #061147;
  border-color: #061147;
}

._takeawayCard_zv4ys_707 > span {
  color: #ef7a63;
}

._takeawayCard_zv4ys_707 ul {
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
}

._takeawayCard_zv4ys_707 li {
  color: #ffffffbd;
  padding-right: 20px;
  font-size: 12px;
  line-height: 1.75;
  position: relative;
}

._takeawayCard_zv4ys_707 li:before {
  color: #ef7a63;
  content: "•";
  font-size: 22px;
  line-height: 1;
  position: absolute;
  right: 0;
}

._relatedSection_zv4ys_779 {
  background: #fff;
  padding: 78px 0 90px;
}

._relatedHeading_zv4ys_59 {
  margin-bottom: 27px;
}

._relatedGrid_zv4ys_788 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  display: grid;
}

._relatedCard_zv4ys_794 {
  background: #f9fbff;
  border: 1px solid #dbe3f0;
  border-radius: 10px;
}

._relatedCard_zv4ys_794 > a {
  flex-direction: column;
  min-height: 100%;
  padding: 27px;
  display: flex;
}

._relatedCard_zv4ys_794 span {
  color: #0867d4;
  font-size: 12px;
  font-weight: 900;
}

._relatedCard_zv4ys_794 h3 {
  color: #061147;
  font: 900 21px / 1.45 var(--heading);
  margin: 9px 0 8px;
}

._relatedCard_zv4ys_794 p {
  color: #586984;
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
}

._relatedCard_zv4ys_794 b {
  color: #ef7a63;
  align-items: center;
  min-height: 44px;
  margin-top: auto;
  padding-top: 16px;
  font-size: 13px;
  display: inline-flex;
}

._allArticlesLink_zv4ys_836 {
  color: #0867d4;
  align-items: center;
  min-height: 44px;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
}

html[data-theme="dark"] ._page_zv4ys_1,
html[data-theme="dark"] ._articleMain_zv4ys_550 {
  background: var(--dark-bg);
  color: var(--dark-text);
}

html[data-theme="dark"] ._articleCard_zv4ys_222,
html[data-theme="dark"] ._articleBody_zv4ys_562,
html[data-theme="dark"] ._toc_zv4ys_706,
html[data-theme="dark"] ._relatedCard_zv4ys_794 {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

html[data-theme="dark"] ._sectionHeading_zv4ys_57 > p,
html[data-theme="dark"] ._cardMeta_zv4ys_334,
html[data-theme="dark"] ._cardBody_zv4ys_322 p,
html[data-theme="dark"] ._contentSection_zv4ys_581 > p,
html[data-theme="dark"] ._relatedCard_zv4ys_794 p,
html[data-theme="dark"] ._toc_zv4ys_706 a {
  color: var(--dark-muted);
}

html[data-theme="dark"] ._cardBody_zv4ys_322 h2,
html[data-theme="dark"] ._contentSection_zv4ys_581 h2,
html[data-theme="dark"] ._relatedCard_zv4ys_794 h3 {
  color: var(--dark-text);
}

html[data-theme="dark"] ._articleLead_zv4ys_570 {
  color: #f2d5cf;
  background: #241a24;
}

html[data-theme="dark"] ._contentSection_zv4ys_581,
html[data-theme="dark"] ._toc_zv4ys_706 a {
  border-color: var(--dark-line);
}

html[data-theme="dark"] ._contentSection_zv4ys_581 li {
  border-color: var(--dark-line);
  background: var(--dark-surface-2);
  color: var(--dark-muted);
}

html[data-theme="dark"] ._tip_zv4ys_649 {
  background: #0d2143;
}

html[data-theme="dark"] ._tip_zv4ys_649 p {
  color: var(--dark-muted);
}

html[data-theme="dark"] ._relatedSection_zv4ys_779 {
  background: #050b1c;
}

@media (width<=940px) {
  ._listingHeroGrid_zv4ys_40,
  ._articleHeroGrid_zv4ys_41 {
    grid-template-columns: 1fr;
    gap: 38px;
    padding-block: 64px;
  }

  ._heroMethod_zv4ys_120,
  ._articleMark_zv4ys_478 {
    width: min(560px, 100%);
  }

  ._sectionHeading_zv4ys_57 {
    grid-template-columns: 1fr;
    gap: 13px;
  }

  ._articleLayout_zv4ys_554 {
    grid-template-columns: 1fr;
  }

  ._articleAside_zv4ys_699 {
    grid-row: 1;
    grid-template-columns: 1fr 1fr;
    position: static;
  }
}

@media (width<=720px) {
  ._articleGrid_zv4ys_216,
  ._relatedGrid_zv4ys_788 {
    grid-template-columns: 1fr;
  }

  ._featuredCard_zv4ys_239 {
    grid-column: auto;
  }

  ._featuredCard_zv4ys_239 ._cardLink_zv4ys_243 {
    grid-template-rows: 225px 1fr;
    grid-template-columns: 1fr;
  }

  ._blogCta_zv4ys_58 {
    flex-direction: column;
    align-items: flex-start;
    padding: 34px 26px;
  }

  ._blogCta_zv4ys_58 > a {
    width: 100%;
  }

  ._articleAside_zv4ys_699 {
    grid-template-columns: 1fr;
  }
}

@media (width<=560px) {
  ._listingHeroGrid_zv4ys_40,
  ._articleHeroGrid_zv4ys_41 {
    min-height: 0;
    padding-block: 52px;
  }

  ._heroCopy_zv4ys_78 h1 {
    font-size: 42px;
  }

  ._heroCopy_zv4ys_78 > p,
  ._articleHeroCopy_zv4ys_86 > p {
    font-size: 15px;
  }

  ._heroMethod_zv4ys_120 {
    min-height: 300px;
    padding: 26px;
    box-shadow: 12px 12px #0867d433;
  }

  ._heroMethod_zv4ys_120 > strong {
    font-size: 27px;
  }

  ._blogMain_zv4ys_190 {
    padding-block: 66px 76px;
  }

  ._cardBody_zv4ys_322,
  ._featuredCard_zv4ys_239 ._cardBody_zv4ys_322 {
    padding: 24px;
  }

  ._cardBody_zv4ys_322 h2 {
    font-size: 23px;
  }

  ._blogCta_zv4ys_58 {
    margin-top: 52px;
  }

  ._articleHeroCopy_zv4ys_86 h1 {
    font-size: 39px;
  }

  ._articleMark_zv4ys_478 {
    min-height: 230px;
  }

  ._articleLayout_zv4ys_554 {
    padding-block: 38px 65px;
  }

  ._articleBody_zv4ys_562 {
    padding: 24px;
  }

  ._articleLead_zv4ys_570 {
    padding: 18px;
    font-size: 15px;
  }

  ._contentSection_zv4ys_581 {
    padding-block: 32px;
  }

  ._contentSection_zv4ys_581 h2 {
    font-size: 24px;
  }

  ._contentSection_zv4ys_581 > p {
    font-size: 15px;
  }

  ._articleConclusion_zv4ys_402 {
    padding: 27px 22px;
  }

  ._articleConclusion_zv4ys_402 > a {
    width: 100%;
  }

  ._relatedSection_zv4ys_779 {
    padding-block: 62px 70px;
  }
}

@media (prefers-reduced-motion: reduce) {
  ._articleCard_zv4ys_222 {
    transition: none;
  }
}

._stageActions_1bgcv_1 {
  align-items: center;
  gap: 9px;
  display: flex;
}

._stageBadge_1bgcv_7 {
  color: #245f55;
  min-height: 34px;
  font: 800 13px var(--heading);
  white-space: nowrap;
  background: #e7f1ee;
  border: 1px solid #c9ded8;
  align-items: center;
  padding: 6px 12px;
  display: inline-flex;
}

._changeStage_1bgcv_19 {
  color: #a63c30;
  text-underline-offset: 3px;
  white-space: nowrap;
  align-items: center;
  min-height: 34px;
  font-size: 13px;
  font-weight: 800;
  text-decoration: underline;
  display: inline-flex;
}

._availabilityCard_1bgcv_31 {
  background: #fff;
  border: 1px solid #dbe5e1;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
  padding: 26px;
  display: flex;
}

._availabilityCard_1bgcv_31 span {
  color: #a63c30;
  font-size: 13px;
  font-weight: 900;
}

._availabilityCard_1bgcv_31 h2 {
  color: #173840;
  font: 900 22px / 1.45 var(--heading);
  margin: 8px 0;
}

._availabilityCard_1bgcv_31 p {
  color: #647b80;
  margin: 0;
  font-size: 15px;
  line-height: 1.85;
}

._availabilityCard_1bgcv_31 a {
  color: #fff;
  background: #173f49;
  align-self: flex-start;
  align-items: center;
  min-height: 44px;
  margin-top: 18px;
  padding: 9px 15px;
  font-size: 14px;
  font-weight: 900;
  display: inline-flex;
}

._courseStage_1bgcv_73 {
  color: #245f55;
  background: #e7f1ee;
  align-items: center;
  min-height: 30px;
  margin-bottom: 8px;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
}

._emptyPanel_1bgcv_85 {
  text-align: center;
  background: #fff;
  border: 1px dashed #cad8d3;
  place-items: center;
  min-height: 250px;
  padding: 34px;
  display: grid;
}

._emptyPanel_1bgcv_85 span {
  color: #7a9991;
  font-size: 34px;
}

._emptyPanel_1bgcv_85 h2 {
  color: #173840;
  font: 900 24px var(--heading);
  margin: 10px 0 6px;
}

._emptyPanel_1bgcv_85 p {
  color: #647b80;
  max-width: 540px;
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
}

._emptyPanel_1bgcv_85 a {
  color: #a63c30;
  margin-top: 18px;
  font-size: 14px;
  font-weight: 900;
}

html[data-theme="dark"] ._stageBadge_1bgcv_7,
html[data-theme="dark"] ._courseStage_1bgcv_73 {
  color: #b8ddd3;
  background: #17393d;
  border-color: #31585b;
}

html[data-theme="dark"] ._availabilityCard_1bgcv_31,
html[data-theme="dark"] ._emptyPanel_1bgcv_85 {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

html[data-theme="dark"] ._availabilityCard_1bgcv_31 h2,
html[data-theme="dark"] ._emptyPanel_1bgcv_85 h2 {
  color: var(--dark-text);
}

html[data-theme="dark"] ._availabilityCard_1bgcv_31 p,
html[data-theme="dark"] ._emptyPanel_1bgcv_85 p {
  color: var(--dark-muted);
}

@media (width<=1040px) {
  ._stageBadge_1bgcv_7 {
    display: none;
  }
}

@media (width<=820px) {
  .student-topbar-copy {
    display: none;
  }

  ._stageActions_1bgcv_1 {
    margin-inline-start: auto;
  }

  .topbar-actions {
    margin-right: 0;
  }
}

@media (width<=620px) {
  ._changeStage_1bgcv_19 {
    justify-content: center;
    min-width: 44px;
    font-size: 12px;
  }
}

._page_x57bx_1 {
  background: radial-gradient(circle at 16% 18%, #ef775f29, #0000 26%),
    linear-gradient(145deg, #eff4f1 0%, #f8f6ee 100%);
  min-height: 680px;
  padding: 70px 0 90px;
}

._wrap_x57bx_9 {
  width: min(900px, 100% - 48px);
  margin: 0 auto;
}

._intro_x57bx_14 {
  text-align: center;
  max-width: 650px;
  margin: 0 auto 28px;
}

._intro_x57bx_14 > span {
  color: #de6f59;
  font-size: 14px;
  font-weight: 800;
}

._intro_x57bx_14 h1 {
  color: #173840;
  font: 900 clamp(34px, 5vw, 54px) / 1.3 var(--heading);
  letter-spacing: -0.035em;
  margin: 10px 0;
}

._intro_x57bx_14 p {
  color: #667d81;
  margin: 0;
  font-size: 16px;
  line-height: 1.9;
}

._card_x57bx_40 {
  background: #fff;
  border: 1px solid #dce4df;
  grid-template-columns: 190px minmax(0, 1fr);
  display: grid;
  box-shadow: 0 28px 70px -50px #11374094;
}

._brandPanel_x57bx_48 {
  color: #fff;
  text-align: center;
  background: #07162f;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0;
  display: flex;
  overflow: hidden;
}

._brandPanel_x57bx_48 img {
  object-fit: cover;
  border: 0;
  border-radius: 0;
  width: 100%;
  height: 100%;
}

._brandPanel_x57bx_48 .teacher-monogram {
  border-width: 3px;
  flex-basis: 78px;
  width: 78px;
  height: 78px;
  font-size: 20px;
}

._brandPanel_x57bx_48 b {
  font: 900 18px var(--heading);
  margin-top: 15px;
}

._brandPanel_x57bx_48 small {
  color: #fff9;
  margin-top: 4px;
  font-size: 13px;
}

._content_x57bx_87 {
  padding: 36px 40px;
}

._kind_x57bx_91 {
  color: #2e7469;
  background: #e6f0ed;
  padding: 6px 9px;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
}

._content_x57bx_87 h2 {
  color: #173840;
  font: 900 25px / 1.45 var(--heading);
  margin: 12px 0 8px;
}

._content_x57bx_87 > p {
  color: #667d81;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
}

._warning_x57bx_113 {
  color: #735f3d;
  background: #fbf3e3;
  border-right: 3px solid #d29b43;
  margin-top: 16px;
  padding: 11px 13px;
  font-size: 14px;
  line-height: 1.8;
}

._steps_x57bx_123 {
  border-top: 1px solid #e6ebe8;
  gap: 10px;
  margin: 24px 0 0;
  padding: 22px 0 0;
  list-style: none;
  display: grid;
}

._steps_x57bx_123 li {
  color: #60777b;
  grid-template-columns: 25px 1fr;
  align-items: start;
  gap: 9px;
  font-size: 14px;
  line-height: 1.8;
  display: grid;
}

._steps_x57bx_123 span {
  color: #2f7469;
  background: #e7f0ed;
  border-radius: 50%;
  place-items: center;
  width: 25px;
  height: 25px;
  font-weight: 900;
  display: grid;
}

._fallback_x57bx_153 {
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  display: flex;
}

._fallback_x57bx_153 a {
  color: #244a53;
  background: #ffffffb8;
  border: 1px solid #ccd8d4;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 800;
}

._noStoreLink_x57bx_170 {
  color: #829194;
  text-align: center;
  max-width: 660px;
  margin: 22px auto 0;
  font-size: 13px;
  line-height: 1.8;
}

._readerCard_x57bx_179 {
  background: #fff;
  border: 1px solid #d7e1dd;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 540px;
  display: grid;
  box-shadow: 0 28px 70px -50px #11374094;
}

._readerIndex_x57bx_188 {
  color: #fff;
  background: #153f4a;
  padding: 32px 24px;
}

._readerIndex_x57bx_188 > span {
  color: #f0c978;
  font-size: 13px;
  font-weight: 900;
}

._readerIndex_x57bx_188 h2 {
  font: 900 23px var(--heading);
  margin: 8px 0 24px;
}

._readerIndex_x57bx_188 ol {
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
}

._readerIndex_x57bx_188 li {
  color: #ffffffad;
  grid-template-columns: 32px 1fr;
  align-items: center;
  gap: 9px;
  padding: 11px;
  font-size: 14px;
  line-height: 1.6;
  display: grid;
}

._readerIndex_x57bx_188 li span {
  color: #f0c978;
  font-size: 12px;
  font-weight: 900;
}

._readerIndex_x57bx_188 ._currentChapter_x57bx_230 {
  color: #fff;
  background: #ffffff1a;
}

._readerPage_x57bx_235 {
  padding: clamp(30px, 6vw, 62px);
}

._readerPage_x57bx_235 > span {
  color: #b94335;
  font-size: 13px;
  font-weight: 900;
}

._readerPage_x57bx_235 h2 {
  color: #173840;
  font: 900 32px / 1.4 var(--heading);
  margin: 8px 0 14px;
}

._readerPage_x57bx_235 p,
._readerPage_x57bx_235 li {
  color: #5d7479;
  font-size: 15px;
  line-height: 1.9;
}

._readerPage_x57bx_235 h3 {
  color: #173840;
  font: 900 19px var(--heading);
  margin: 24px 0 8px;
}

._readerPage_x57bx_235 ul {
  margin: 0;
  padding-right: 20px;
}

._readerFigure_x57bx_269 {
  color: #56706f;
  background: #edf4f1;
  justify-content: center;
  align-items: flex-end;
  gap: 14px;
  min-height: 150px;
  margin-top: 24px;
  padding: 24px;
  display: flex;
}

._readerFigure_x57bx_269 i {
  border: 8px solid #9fc8bf;
  border-radius: 50%;
  width: 42px;
  height: 42px;
}

._readerFigure_x57bx_269 i:nth-child(2) {
  border-color: #e47c68;
  width: 68px;
  height: 68px;
}

._readerFigure_x57bx_269 strong {
  align-self: center;
  margin-inline-start: 12px;
  font-size: 14px;
}

html[data-theme="dark"] ._page_x57bx_1 {
  background: radial-gradient(circle at 16% 18%, #ef775f1f, transparent 26%),
    var(--dark-bg);
}

html[data-theme="dark"] ._intro_x57bx_14 h1,
html[data-theme="dark"] ._content_x57bx_87 h2 {
  color: var(--dark-text);
}

html[data-theme="dark"] ._intro_x57bx_14 p,
html[data-theme="dark"] ._content_x57bx_87 > p,
html[data-theme="dark"] ._steps_x57bx_123 li,
html[data-theme="dark"] ._noStoreLink_x57bx_170 {
  color: var(--dark-muted);
}

html[data-theme="dark"] ._card_x57bx_40,
html[data-theme="dark"] ._readerCard_x57bx_179,
html[data-theme="dark"] ._readerPage_x57bx_235 {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

html[data-theme="dark"] ._readerPage_x57bx_235 h2,
html[data-theme="dark"] ._readerPage_x57bx_235 h3 {
  color: var(--dark-text);
}

html[data-theme="dark"] ._readerPage_x57bx_235 p,
html[data-theme="dark"] ._readerPage_x57bx_235 li {
  color: var(--dark-muted);
}

html[data-theme="dark"] ._readerFigure_x57bx_269 {
  background: var(--dark-surface-2);
}

html[data-theme="dark"] ._steps_x57bx_123 {
  border-color: var(--dark-line);
}

html[data-theme="dark"] ._warning_x57bx_113 {
  color: #e8d3a7;
  background: #31291b;
}

html[data-theme="dark"] ._fallback_x57bx_153 a {
  border-color: var(--dark-line);
  background: var(--dark-surface);
  color: var(--dark-text);
}

@media (width<=650px) {
  ._page_x57bx_1 {
    padding: 52px 0 70px;
  }

  ._wrap_x57bx_9 {
    width: min(100% - 28px, 900px);
  }

  ._card_x57bx_40,
  ._readerCard_x57bx_179 {
    grid-template-columns: 1fr;
  }

  ._readerIndex_x57bx_188 {
    padding: 24px 20px;
  }

  ._readerIndex_x57bx_188 ol {
    grid-template-columns: 1fr 1fr;
  }

  ._brandPanel_x57bx_48 {
    min-height: 150px;
  }

  ._brandPanel_x57bx_48 img {
    width: 62px;
    height: 62px;
  }

  ._brandPanel_x57bx_48 .teacher-monogram {
    flex-basis: 62px;
    width: 62px;
    height: 62px;
  }

  ._content_x57bx_87 {
    padding: 27px 21px;
  }
}

@media (width<=480px) {
  ._readerIndex_x57bx_188 ol {
    grid-template-columns: 1fr;
  }

  ._readerFigure_x57bx_269 {
    flex-wrap: wrap;
  }
}

._page_bzbb0_1 {
  color: #173840;
  background: #f6f7f3;
}

._hero_bzbb0_6 {
  color: #fff;
  background: radial-gradient(circle at 12% 20%, #ef775f24, #0000 30%),
    linear-gradient(135deg, #123f4b, #0e3038);
  padding: 72px 0 66px;
}

._heroInner_bzbb0_14,
._layout_bzbb0_15 {
  width: min(1040px, 100% - 48px);
  margin: 0 auto;
}

._eyebrow_bzbb0_20 {
  color: #f4d38f;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
}

._eyebrow_bzbb0_20:before {
  content: "";
  background: #ef775f;
  width: 30px;
  height: 2px;
}

._hero_bzbb0_6 h1 {
  font: 900 clamp(38px, 5vw, 62px) / 1.25 var(--heading);
  letter-spacing: -0.035em;
  margin: 14px 0 12px;
}

._hero_bzbb0_6 p {
  color: #ffffffb8;
  max-width: 720px;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
}

._status_bzbb0_50 {
  color: #fff;
  background: #ffffff14;
  border: 1px solid #fff3;
  align-items: center;
  gap: 7px;
  margin-top: 24px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
}

._status_bzbb0_50:before {
  content: "";
  background: #7fd6ae;
  border-radius: 50%;
  width: 7px;
  height: 7px;
}

._layout_bzbb0_15 {
  grid-template-columns: 220px minmax(0, 1fr);
  align-items: start;
  gap: 42px;
  padding-block: 54px 90px;
  display: grid;
}

._aside_bzbb0_79 {
  background: #fff;
  border: 1px solid #dfe5e1;
  border-radius: 8px;
  padding: 20px;
  position: sticky;
  top: 24px;
}

._aside_bzbb0_79 b {
  font: 800 14px var(--heading);
  margin-bottom: 12px;
  display: block;
}

._aside_bzbb0_79 a {
  color: #536c71;
  border-bottom: 1px solid #edf0ed;
  align-items: center;
  min-height: 44px;
  padding: 8px 0;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
}

._aside_bzbb0_79 a:hover {
  color: #de6f59;
}

._aside_bzbb0_79 a:last-child {
  border-bottom: 0;
}

._content_bzbb0_113 {
  background: #fff;
  border: 1px solid #dfe5e1;
  border-radius: 8px;
  min-width: 0;
  padding: 34px 38px;
}

._operationalNotice_bzbb0_121 {
  color: #62483f;
  background: #fff4ef;
  border-right: 4px solid #ef775f;
  margin: 0 0 30px;
  padding: 15px 17px;
  font-size: 14px;
  line-height: 1.9;
}

._section_bzbb0_131 {
  border-top: 1px solid #e6eae7;
  padding: 29px 0;
  scroll-margin-top: 24px;
}

._section_bzbb0_131:first-of-type {
  border-top: 0;
  padding-top: 0;
}

._section_bzbb0_131 h2 {
  font: 900 21px / 1.45 var(--heading);
  margin: 0 0 12px;
}

._section_bzbb0_131 h3 {
  font: 800 14px / 1.5 var(--heading);
  margin: 22px 0 8px;
}

._section_bzbb0_131 p,
._section_bzbb0_131 li {
  color: #4f686e;
  font-size: 15px;
  line-height: 1.9;
}

._section_bzbb0_131 p {
  margin: 0 0 10px;
}

._section_bzbb0_131 ul {
  margin: 9px 0 0;
  padding-right: 20px;
}

._section_bzbb0_131 li + li {
  margin-top: 5px;
}

._meta_bzbb0_172 {
  color: #62787d;
  border-top: 1px solid #e6eae7;
  flex-wrap: wrap;
  gap: 10px 20px;
  margin-top: 32px;
  padding-top: 22px;
  font-size: 12px;
  display: flex;
}

._backLink_bzbb0_183 {
  color: #fff;
  min-height: 44px;
  font: 800 14px var(--heading);
  background: #123f4b;
  align-items: center;
  margin-top: 24px;
  padding: 12px 18px;
  display: inline-flex;
}

html[data-theme="dark"] ._page_bzbb0_1 {
  background: var(--dark-bg);
  color: var(--dark-text);
}

html[data-theme="dark"] ._aside_bzbb0_79,
html[data-theme="dark"] ._content_bzbb0_113 {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

html[data-theme="dark"] ._aside_bzbb0_79 a,
html[data-theme="dark"] ._section_bzbb0_131,
html[data-theme="dark"] ._meta_bzbb0_172 {
  border-color: var(--dark-line);
}

html[data-theme="dark"] ._aside_bzbb0_79 a,
html[data-theme="dark"] ._section_bzbb0_131 p,
html[data-theme="dark"] ._section_bzbb0_131 li,
html[data-theme="dark"] ._meta_bzbb0_172 {
  color: var(--dark-muted);
}

html[data-theme="dark"] ._operationalNotice_bzbb0_121 {
  color: #f2d4cc;
  background: #30221f;
}

@media (width<=760px) {
  ._heroInner_bzbb0_14,
  ._layout_bzbb0_15 {
    width: min(100% - 28px, 1040px);
  }

  ._hero_bzbb0_6 {
    padding: 54px 0;
  }

  ._layout_bzbb0_15 {
    grid-template-columns: 1fr;
    gap: 18px;
    padding-block: 28px 65px;
  }

  ._aside_bzbb0_79 {
    gap: 8px;
    padding: 12px;
    display: flex;
    position: static;
    overflow-x: auto;
  }

  ._aside_bzbb0_79 b {
    display: none;
  }

  ._aside_bzbb0_79 a {
    white-space: nowrap;
    border: 1px solid #e4e9e5;
    flex: none;
    padding: 8px 10px;
  }

  ._content_bzbb0_113 {
    padding: 25px 20px;
  }
}

._card_f7ezt_1 {
  width: min(560px, 100%);
  padding-block: 12px;
}

._identityStep_f7ezt_6,
._form_f7ezt_7 {
  gap: 18px;
  display: grid;
}

._identityNotice_f7ezt_12,
._verifiedIdentity_f7ezt_13 {
  background: #eef4ff;
  border: 1px solid #c9daf6;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  display: flex;
}

._identityNotice_f7ezt_12 > span,
._verifiedIdentity_f7ezt_13 > span {
  color: #fff;
  background: #0867d4;
  border-radius: 50%;
  flex: none;
  place-items: center;
  width: 34px;
  height: 34px;
  font-weight: 900;
  display: grid;
}

._identityNotice_f7ezt_12 div,
._verifiedIdentity_f7ezt_13 div {
  flex-direction: column;
  min-width: 0;
  display: flex;
}

._identityNotice_f7ezt_12 b,
._verifiedIdentity_f7ezt_13 b {
  font: 800 14px var(--heading);
}

._identityNotice_f7ezt_12 small,
._verifiedIdentity_f7ezt_13 small {
  color: #60718c;
  overflow-wrap: anywhere;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.55;
}

._formPreview_f7ezt_56 {
  opacity: 0.72;
  background: #f8faf8;
  border: 1px dashed #cbd6d2;
  gap: 12px;
  margin: 4px 0 0;
  padding: 17px;
  display: grid;
}

._formPreview_f7ezt_56 legend {
  color: #596f74;
  font: 800 12px var(--heading);
  padding-inline: 8px;
}

._formPreview_f7ezt_56 label,
._field_f7ezt_73 {
  gap: 7px;
  display: grid;
}

._formPreview_f7ezt_56 label > span,
._field_f7ezt_73 > span {
  color: #334a70;
  font: 800 13px var(--heading);
}

._formPreview_f7ezt_56 input,
._formPreview_f7ezt_56 select,
._field_f7ezt_73 input,
._field_f7ezt_73 select {
  color: #081b3a;
  width: 100%;
  height: 47px;
  font: 600 16px var(--body);
  background: #fff;
  border: 1px solid #ccd7e8;
  border-radius: 0;
  outline: none;
  padding: 0 13px;
}

._field_f7ezt_73 input:focus,
._field_f7ezt_73 select:focus {
  border-color: #0867d4;
  box-shadow: 0 0 0 3px #0867d421;
}

._field_f7ezt_73 input[aria-invalid="true"],
._field_f7ezt_73 select[aria-invalid="true"] {
  border-color: #b75749;
}

._field_f7ezt_73 input[readonly] {
  color: #60718c;
  cursor: not-allowed;
  background: #edf2fa;
}

._previewGrid_f7ezt_116,
._fieldGrid_f7ezt_117 {
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  display: grid;
}

._hint_f7ezt_123,
._securityNote_f7ezt_124 {
  color: #60718c;
  font-size: 12px;
  line-height: 1.65;
}

._securityNote_f7ezt_124 {
  text-align: center;
  display: block;
}

._fieldError_f7ezt_135 {
  color: #a2473c;
  font-size: 12px;
  line-height: 1.6;
}

._termsRow_f7ezt_141 {
  color: #60718c;
  cursor: pointer;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  line-height: 1.8;
  display: flex;
}

._termsRow_f7ezt_141 input {
  accent-color: #0867d4;
  flex: none;
  width: 17px;
  height: 17px;
  margin: 3px 0 0;
}

._termsRow_f7ezt_141 a {
  color: #0867d4;
  text-underline-offset: 2px;
  font-weight: 800;
  text-decoration: underline;
}

._formError_f7ezt_166 {
  color: #9b4035;
  background: #fff3f1;
  border: 1px solid #efc5bf;
  margin: 0;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.6;
}

._demoAccess_f7ezt_176 {
  color: #fff;
  background: #061147;
  border: 1px solid #061147;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 18px;
  min-height: 66px;
  padding: 13px 16px;
  transition: background 0.2s, transform 0.2s;
  display: grid;
}

@media (hover: hover) and (pointer: fine) {
  ._demoAccess_f7ezt_176:hover {
    background: #0d2f64;
    transform: translateY(-1px);
  }
}

._demoAccess_f7ezt_176 > div {
  flex-direction: column;
  gap: 3px;
  display: flex;
}

._demoAccess_f7ezt_176 b {
  font: 800 15px var(--heading);
}

._demoAccess_f7ezt_176 small {
  color: #ffffffbd;
  font-size: 12px;
  line-height: 1.55;
}

._demoAccess_f7ezt_176 > span {
  color: #f2cd80;
  font-size: 21px;
}

._formDivider_f7ezt_217 {
  color: #60718c;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 800;
  display: flex;
}

._formDivider_f7ezt_217:before,
._formDivider_f7ezt_217:after {
  content: "";
  background: #d7e0ef;
  flex: 1;
  height: 1px;
}

._routeHint_f7ezt_234 {
  color: #334a70;
  background: #eef4ff;
  border-right: 3px solid #0867d4;
  margin: -3px 0 0;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.7;
}

html[data-theme="dark"] ._formDivider_f7ezt_217 {
  color: var(--dark-muted);
}

html[data-theme="dark"] ._formDivider_f7ezt_217:before,
html[data-theme="dark"] ._formDivider_f7ezt_217:after {
  background: var(--dark-line);
}

html[data-theme="dark"] ._routeHint_f7ezt_234 {
  border-color: var(--teal);
  background: var(--dark-surface-3);
  color: var(--dark-muted);
}

._submit_f7ezt_259 {
  color: #fff;
  cursor: pointer;
  width: 100%;
  min-height: 54px;
  font: 800 14px var(--heading);
  background: #0867d4;
  border: 0;
  justify-content: center;
  align-items: center;
  gap: 18px;
  padding: 0 20px;
  transition: background 0.2s, transform 0.2s;
  display: flex;
}

@media (hover: hover) and (pointer: fine) {
  ._submit_f7ezt_259:hover:not(:disabled) {
    background: #0b5fc2;
    transform: translateY(-1px);
  }
}

._submit_f7ezt_259:focus-visible {
  outline-offset: 3px;
  outline: 3px solid #ffb0008c;
}

._submit_f7ezt_259:disabled {
  cursor: wait;
  opacity: 0.68;
}

@media (width<=620px) {
  ._card_f7ezt_1 {
    padding-block: 0;
  }

  ._previewGrid_f7ezt_116,
  ._fieldGrid_f7ezt_117 {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  ._submit_f7ezt_259 {
    transition: none;
  }
}
</style>
