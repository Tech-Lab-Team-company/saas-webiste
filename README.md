# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# saas-webiste

## تتبّع سجل مشاهدة الطالب داخل الكورس

تم ربط مشغّل محتوى الكورس مع endpoint باسم `send_user_watch` لحفظ آخر وقت وصل إليه الطالب أثناء مشاهدة أو سماع محتوى السيشن.

### شكل الطلب

الطلب يُرسل بطريقة `POST` ويحتاج أن يكون الطالب مسجل الدخول لأن الطلب يستخدم الـ Bearer Token الخاص به:

```json
{
  "session_id": 10,
  "full_time": "00:20:00",
  "stop_time": "00:12:30"
}
```

- `session_id`: رقم السيشن التي يشاهدها الطالب.
- `full_time`: المدة الكاملة للفيديو أو الملف الصوتي بصيغة `HH:MM:SS`.
- `stop_time`: آخر ثانية وصل إليها الطالب بنفس صيغة الوقت.

### مسار البيانات

1. عند ضغط الطالب على سيشن، يتم تمرير `session.id` مع الرابط والعنوان والوصف.
2. `CourseTabs.vue` يحفظ بيانات السيشن المختارة داخل `videoLink`، بما فيها `sessionId`.
3. `CourseVideo.vue` يحدد نوع المحتوى ثم يمرر `sessionId` إلى المشغّل المناسب.
4. مشغّل MP4 أو YouTube أو Audio يرسل مدة المحتوى والوقت الحالي إلى `useCourseWatchHistory`.
5. الـ composable يحول الثواني إلى `HH:MM:SS` ويرسلها إلى `send_user_watch`.

تم تمرير رقم السيشن من أشكال الكورسات الثلاثة الموجودة في المشروع:

- كورس يحتوي على Units ثم Lessons ثم Sessions.
- كورس يحتوي على Lessons ثم Sessions.
- كورس يحتوي على Sessions مباشرة.

### متى يتم الحفظ؟

يتم حفظ سجل المشاهدة في الحالات التالية:

- كل 15 ثانية من تغيّر موضع المشاهدة، لتجنب إرسال request مع كل `timeupdate`.
- عند إيقاف الفيديو أو الصوت مؤقتًا.
- عند انتهاء المحتوى.
- عند الانتقال من سيشن إلى سيشن أخرى.
- عند إخفاء الصفحة أو مغادرتها.

لو كان هناك request جارٍ أثناء محاولة حفظ جديدة، يتم وضع أحدث عملية حفظ في الانتظار ثم إرسالها بعد انتهاء الطلب الحالي. هذا يمنع الطلبات المتداخلة ويحافظ على أحدث وقت وصل إليه الطالب.

فشل حفظ السجل لا يوقف تشغيل الفيديو ولا يعرض خطأ يقطع تجربة الطالب؛ سيحاول النظام الحفظ مرة أخرى مع checkpoint لاحقة.

### أنواع المحتوى المدعومة

- فيديو MP4 من خلال `NormalVedio.vue`.
- فيديو YouTube من خلال `Youtube.vue`.
- الملفات الصوتية من خلال `AudioPlayer.vue`.

ملفات PDF لا يتم إرسال وقت مشاهدة لها لأنها لا تمتلك مدة تشغيل أو موضع زمني.

### الملفات الأساسية التي تم تعديلها

- `base/core/networkStructure/apiNames.ts`: إضافة اسم endpoint وهو `send_user_watch`.
- `composables/useCourseWatchHistory.ts`: منطق تنسيق الوقت، تقليل عدد الطلبات، وحفظ المشاهدة.
- `components/CourseDetails/CourseTabs.vue`: استقبال وحفظ `sessionId` للسيشن المختارة.
- `components/CourseDetails/CourseVideo.vue`: تمرير رقم السيشن إلى مشغّل المحتوى المناسب.
- `components/CourseDetails/NormalVedio.vue`: التقاط مدة ووقت فيديو MP4.
- `components/CourseDetails/Youtube.vue`: التقاط مدة ووقت فيديو YouTube.
- `components/CourseDetails/TabsContent/AudioPlayer.vue`: التقاط مدة ووقت الملف الصوتي.
- ملفات `CourseContent`, `CourseContentStageOne`, و`CourseContentStageTwo`: تمرير `session.id` عند اختيار السيشن.

### ملاحظات مهمة

- يجب أن يحتوي المستخدم الحالي على `apiToken`؛ وإلا لن يتم إرسال سجل مشاهدة.
- يتم ضبط الوقت بين صفر والمدة الكاملة للمحتوى قبل الإرسال.
- هذه الميزة تحفظ history في الـ backend فقط. استكمال التشغيل تلقائيًا من `stop_time` يحتاج أن يرجع الـ backend وقت المشاهدة المحفوظ ضمن بيانات السيشن، ثم يتم ضبط `currentTime` عند فتحها.

### التحقق

تم تشغيل production build بعد التعديلات باستخدام:

```bash
npm run build
```

والـ build اكتمل بنجاح.
