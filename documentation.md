1 -hero section 
├── badge
├── title
├── description
├── image
├── image_alt

2-Learning Journey
├── title
├── description
├── steps[
    title 
    sub title
    ]



3-About Teacher in home
├── title
├── description
├── benefits[[
    title 
    desc
    ]]
├── quote
├── experience
│   ├── value
│   ├── prefix
│   └── label
├

4-FAQs
├── id
├── question
├── answer



5-ready section 
├── badge
├── title
├── description


6-SaaS empty states
├── Shared component
│   └── components/home/v2/ui/HomeSectionEmptyState.vue
├── Light and dark styles
├── Compact mode for missing images or partial sections
└── Separate messages for empty API responses and request errors

Runtime content policy
├── API-backed sections display API data only
├── Empty API responses must not load demo text, teacher names, screenshots, or images
├── Missing section data displays a designed "أضف محتوى القسم" state
├── Failed requests display a load-error state and never pretend the section is configured
├── Partial API responses display available fields and an empty image/details state where needed
└── "Powered by EduHub" remains as SaaS-provider attribution, not tenant content

Application settings behavior
├── Image: website setting app_image
├── Android link: website setting play_store
├── iPhone link: website setting app_store
├── Empty or "-" store links are not displayed
└── If app_image is missing or fails to load, only its alternative text is displayed

Blog details API fields
├── read_time: preferred over locally calculated reading time
├── mail_image: article image fallback when attachments are empty
├── content_point: numbered "في هذا المقال" card
├── read_remember: dark reminder card
├── quote: optional highlighted block at the start of the article card
└── summary: optional article conclusion supporting { title, subtitle } or plain text

Dynamic blog content
├── Blog listing, hashtag listing, details, home preview, and legacy previews use fetch_blogs/show_blog
├── Hardcoded demo blog cards and demo URLs were removed
├── Empty and failed requests display UI states instead of demo articles
├── Listing images use attachments first, then mail_image
└── Paginated blog payloads are supported through data, items, or blogs collections

Teacher experience learning map
├── Stage navigation: fetch_stages
├── Year steps: fetch_stage_years with stage_id
├── Each year opens /course with stage_id and year_id
├── Loading, request-error, partial-data, empty-stage, and empty-section states
├── API stage/year responses replace all hardcoded education labels
└── Responsive tab navigation, animated panel transitions, and reduced-motion support

Sections covered by this policy
├── Home hero
├── Learning journey
├── Home about-teacher
├── Ready/CTA section
├── Books and book details
├── Blog cards and blogs hero
├── App section and app page
├── About-teacher hero, study process, and contact information
├── Header tenant identity
└── Footer tenant identity

Removed runtime mock files
├── features/HomePageFeature/mocks/homeHeroSection.mock.ts
├── features/HomePageFeature/mocks/homeLearningJourney.mock.ts
└── features/HomePageFeature/mocks/homeAboutTeacher.mock.ts
