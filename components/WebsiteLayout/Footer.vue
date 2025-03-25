<script setup lang="ts">
const settingStore = useSettingStore();
const setting = computed(() => settingStore.setting);
</script>

<template>
  <footer class="footer">
    <div class="wave">
      <NuxtImg
        src="/Wave.png"
        alt="wave"
        format="webp"
        class="wave-img w-full"
      />
    </div>
    <div class="company-info">
      <div class="container mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="description col-span-1">
            <NuxtImg
              src="/footer-logo.png"
              alt="logo"
              format="webp"
              class="wave-img"
            />
            <p class="mt-2">
              {{
                $t(
                  "Rakwa_USA_is_your_premier_directory_for_exploring_and_connecting_with_the_finest_Arab_American_businesses_across_the_United_States_celebrating_our_rich_culture_and_community",
                )
              }}
            </p>
          </div>
          <div class="links col-span-1">
            <h6 class="links-title">{{ $t("About_the_company") }}</h6>
            <svg
              width="96"
              height="7"
              viewBox="0 0 96 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 4.87394C0 3.82041 0.818782 2.94829 1.87021 2.88188L47.5 0L94.1271 2.88415C95.1796 2.94926 96 3.82192 96 4.87652C96 6.02746 95.0293 6.93996 93.8806 6.8689L47.5 4L2.12184 6.86599C0.972263 6.93859 0 6.0258 0 4.87394Z"
                fill="#E80306"
              />
            </svg>
            <ul class="links-list">
              <li class="links-item">
                <NuxtLink to="/" class="links-link">{{ $t("home") }}</NuxtLink>
              </li>
              <li class="links-item">
                <NuxtLink to="/blogs" class="links-link">{{
                  $t("blogs")
                }}</NuxtLink>
              </li>
              <li class="links-item">
                <NuxtLink to="/about-us" class="links-link">{{
                  $t("about_us")
                }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="links col-span-1">
            <h6 class="links-title">{{ $t("Other_links") }}</h6>
            <svg
              width="96"
              height="7"
              viewBox="0 0 96 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 4.87394C0 3.82041 0.818782 2.94829 1.87021 2.88188L47.5 0L94.1271 2.88415C95.1796 2.94926 96 3.82192 96 4.87652C96 6.02746 95.0293 6.93996 93.8806 6.8689L47.5 4L2.12184 6.86599C0.972263 6.93859 0 6.0258 0 4.87394Z"
                fill="#E80306"
              />
            </svg>
            <ul class="links-list">
              <li class="links-item">
                <NuxtLink to="/FAQ" class="links-link">{{
                  $t("FAQs")
                }}</NuxtLink>
              </li>
              <li class="links-item">
                <NuxtLink to="/terms-and-conditions" class="links-link">{{
                  $t("terms_of_service")
                }}</NuxtLink>
              </li>
              <!--              <li class="links-item">-->
              <!--                <NuxtLink to="/about-us" class="links-link">{{-->
              <!--                  $t("Help")-->
              <!--                }}</NuxtLink>-->
              <!--              </li>-->
              <li class="links-item">
                <NuxtLink to="/privacy" class="links-link">{{
                  $t("Privacy")
                }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="app col-span-1">
            <a
              v-if="setting?.google_play"
              :href="setting?.google_play"
              target="_blank"
            >
              <NuxtImg
                src="/GooglePlay.png"
                alt="GooglePlay"
                format="webp"
                class="app-img"
              />
            </a>
            <a v-if="setting?.app_store" :href="setting?.app_store" target="_blank">

              <NuxtImg
                src="/AppStore.png"
                alt="AppStore"
                format="webp"
                class="app-img"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="copy-right">
      <div class="container mx-auto px-8 flex justify-between items-center">
        <p class="copy-right-text">
          {{ $t("Copyright") }} &copy; {{ new Date().getFullYear() }}
          {{ $t("Rakwa") }}
        </p>
        <div class="footer-social">
          <a v-if="setting?.facebook" :href="setting?.facebook" target="_blank">

          <NuxtImg
            src="/Facebook.png"
            alt="Facebook"
            format="webp"
            class="social-img"
          />
          </a>
          <a v-if="setting?.twitter" :href="setting?.twitter" target="_blank">

          <NuxtImg
            src="/Twitter.png"
            alt="Twitter"
            format="webp"
            class="social-img"
          />
          </a>
          <a v-if="setting?.instagram" :href="setting?.instagram" target="_blank">

          <NuxtImg
            src="/Instagram.png"
            alt="Instagram"
            format="webp"
            class="social-img"
          />
          </a>
          <a v-if="setting?.linkedin" :href="setting?.linkedin" target="_blank">

          <NuxtImg
            src="/Linkedin.png"
            alt="Instagram"
            format="webp"
            class="social-img"
          />
          </a>
          <a v-if="setting?.github" :href="setting?.github" target="_blank">
            <NuxtImg
                src="/Vector.png"
                alt="Twitter"
                format="webp"
                class="social-img"
            />

          </a>
<!--          <NuxtImg-->
<!--            src="/Vector.png"-->
<!--            alt="Twitter"-->
<!--            format="webp"-->
<!--            class="social-img"-->
<!--          />-->
<!--          <NuxtImg-->
<!--            src="/Instagram.png"-->
<!--            alt="Instagram"-->
<!--            format="webp"-->
<!--            class="social-img"-->
<!--          />-->
<!--          <NuxtImg-->
<!--            src="/Linkedin.png"-->
<!--            alt="Instagram"-->
<!--            format="webp"-->
<!--            class="social-img"-->
<!--          />-->
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
