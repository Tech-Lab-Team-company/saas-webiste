<script setup lang="ts">
type BlogPost = {
  to: string
  category: string
  index: string
  mark: string
  readingTime: string
  title: string
  description: string
  tone: 'navy' | 'blue' | 'coral'
}

const posts: BlogPost[] = [
  {
    to: '/blog/study-physics-with-understanding',
    category: 'أسلوب المذاكرة',
    index: '01',
    mark: 'فهم',
    readingTime: '6 دقائق قراءة',
    title: 'تذاكر الفيزياء بفهم، مش بحفظ القوانين',
    description:
      'طريقة عملية تخليك تربط القانون بمعناه، وتعرف إمتى تستخدمه قبل ما تبدأ في حل عدد كبير من المسائل.',
    tone: 'navy',
  },
  {
    to: '/blog/analyze-physics-problem-in-five-steps',
    category: 'حل المسائل',
    index: '02',
    mark: '05',
    readingTime: '7 دقائق قراءة',
    title: 'حلّل مسألة الفيزياء في 5 خطوات قبل ما تبدأ الحل',
    description:
      'روتين ثابت لقراءة المسألة، ترتيب المعطيات، اختيار القانون ومراجعة الناتج من غير تسرّع أو عشوائية.',
    tone: 'blue',
  },
  {
    to: '/blog/physics-revision-plan-before-exam',
    category: 'المراجعة والامتحان',
    index: '03',
    mark: '7D',
    readingTime: '6 دقائق قراءة',
    title: 'خطة مراجعة الفيزياء قبل الامتحان من غير توتر',
    description:
      'خطة مرنة ترتب المنهج والأسئلة والأخطاء في الأيام الأخيرة، وتترك لك وقتًا للنوم والمراجعة الهادئة.',
    tone: 'coral',
  },
]
</script>

<template>
  <section id="blog-preview" class="home-blog-section">
    <div class="container">
      <div class="home-editorial-heading home-blog-heading" data-motion-reveal="up">
        <div>
          <span>من مدونة Gamma</span>
          <h2>
            ذاكر بذكاء.<br />
            وحل <em>بهدوء.</em>
          </h2>
        </div>

        <div class="home-blog-intro">
          <p>مقالات عملية عن فهم الفيزياء، تحليل المسائل، وتنظيم المراجعة قبل الامتحان.</p>
          <NuxtLink to="/blog">كل مقالات المدونة ←</NuxtLink>
        </div>
      </div>

      <div class="home-blog-grid">
        <article
          v-for="(post, index) in posts"
          :key="post.to"
          class="home-blog-card"
          :class="`home-blog-${post.tone}`"
          data-motion-reveal="up"
          :data-motion-order="index"
        >
          <NuxtLink :to="post.to">
            <header>
              <span>{{ post.category }}</span>
              <b>{{ post.index }}</b>
            </header>

            <strong>{{ post.mark }}</strong>

            <div>
              <small>{{ post.readingTime }}</small>
              <h3>{{ post.title }}</h3>
              <p>{{ post.description }}</p>
              <span class="home-blog-read">
                اقرأ المقال <i aria-hidden="true">←</i>
              </span>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-blog-section {
  overflow: hidden;
  padding: 100px 0;
  background: #fbfcff;
}

.home-editorial-heading {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.65fr);
  align-items: end;
  gap: clamp(38px, 7vw, 96px);
  margin-bottom: 38px;
}

.home-editorial-heading > div:first-child > span {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0867d4;
  font-size: 12px;
  font-weight: 900;
}

.home-editorial-heading > div:first-child > span::before {
  width: 29px;
  height: 2px;
  background: #ef7a63;
  content: '';
}

.home-editorial-heading h2 {
  margin: 11px 0 0;
  color: #081b3a;
  font: 900 clamp(39px, 4.2vw, 58px) / 1.24 var(--heading);
  letter-spacing: -0.035em;
}

.home-editorial-heading h2 em {
  color: #ef7a63;
  font-style: normal;
}

.home-blog-intro p {
  margin: 0;
  color: #4f617c;
  font-size: 16px;
  line-height: 1.9;
}

.home-blog-intro a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  margin-top: 16px;
  border-bottom: 1px solid #0867d4;
  color: #0867d4;
  font-size: 14px;
  font-weight: 900;
}

.home-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.home-blog-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dfe7f3;
  border-radius: 10px;
  background: #fff;
  transition: transform 0.26s ease, box-shadow 0.26s ease;
}

.home-blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 54px -34px #12313980;
}

.home-blog-card > a {
  display: flex;
  min-height: 420px;
  flex-direction: column;
  color: #081b3a;
}

.home-blog-card header {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  background: #061147;
  color: #fff;
}

.home-blog-card header span,
.home-blog-card header b {
  font-size: 12px;
  font-weight: 800;
}

.home-blog-card > a > strong {
  display: flex;
  min-height: 142px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 25px;
  background: #e8f1ff;
  color: #0867d4;
  font: 900 62px var(--heading);
}

.home-blog-blue > a > strong {
  background: #0867d4;
  color: #fff;
}

.home-blog-coral > a > strong {
  background: #ef7a63;
  color: #fff;
}

.home-blog-card > a > div {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 25px;
}

.home-blog-card small {
  color: #60718c;
  font-size: 12px;
}

.home-blog-card h3 {
  margin: 8px 0;
  font: 900 21px/1.5 var(--heading);
}

.home-blog-card p {
  margin: 0;
  color: #4f617c;
  font-size: 14px;
  line-height: 1.8;
}

.home-blog-read {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 22px;
  color: #0867d4;
  font-size: 13px;
  font-weight: 900;
}

.home-blog-read i {
  font-size: 19px;
  font-style: normal;
  transition: transform 0.22s ease;
}

.home-blog-card:hover .home-blog-read i {
  transform: translateX(-5px);
}

:global(html[data-theme='dark']) .home-blog-section {
  background: var(--dark-bg);
}

:global(html[data-theme='dark']) .home-editorial-heading h2,
:global(html[data-theme='dark']) .home-blog-card > a {
  color: var(--dark-text);
}

:global(html[data-theme='dark']) .home-blog-intro p,
:global(html[data-theme='dark']) .home-blog-card p {
  color: var(--dark-muted);
}

:global(html[data-theme='dark']) .home-blog-card {
  border-color: var(--dark-line);
  background: var(--dark-surface);
}

@media (max-width: 900px) {
  .home-blog-section {
    padding: 78px 0;
  }

  .home-blog-grid {
    grid-template-columns: 1fr 1fr;
  }

  .home-blog-card:first-child {
    grid-column: 1 / -1;
  }

  .home-blog-card:first-child > a {
    display: grid;
    grid-template-columns: 0.65fr 1.35fr;
  }

  .home-blog-card:first-child header,
  .home-blog-card:first-child > a > strong {
    grid-column: 1;
  }

  .home-blog-card:first-child > a > strong {
    min-height: 240px;
  }

  .home-blog-card:first-child > a > div {
    grid-area: 1 / 2 / 3;
  }
}

@media (max-width: 680px) {
  .home-editorial-heading {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .home-editorial-heading h2 {
    font-size: 38px;
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
</style>
