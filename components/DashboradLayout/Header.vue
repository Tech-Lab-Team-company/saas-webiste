<script setup lang="ts">
import LogoutController from "~/features/LogoutFeature/presentation/controllers/logout_controller";
import Popover from "primevue/popover";
import AccordionHeader from "primevue/accordionheader";
import Accordion from "primevue/accordion";
import AccordionContent from "primevue/accordioncontent";
import AccordionPanel from "primevue/accordionpanel";
import FilterListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/filter_listing_builder";
import { setDefaultImage } from "~/base/persention/utils/set_default_image";
import { BASE_URL } from "~/base/persention/utils/constant";
import type Category from "~/types/categories";
import wordSlice from "~/base/persention/utils/word_slice";

const user = useUserStore();
const op = ref();

const router = useRouter();

const logoutController = LogoutController.getInstance();

const logout = async () => {
  await logoutController.Logout(router);
};

const toggle = (event: Event) => {
  op.value.toggle(event);
};

const { data: categories } = await useAsyncData("categories", async () => {
  const response = await $fetch<{
    data: Category[];
    message: string;
    status: number;
  }>(`${BASE_URL}/categories`, { method: "POST" });
  return response.data; // Extract only the `data` part
});

const filterListingParamsBuilder = FilterListingParamsBuilder.Instance;
const setCategory = (id: number) => {
  const categoriesIds = [];
  categoriesIds.push(id);
  filterListingParamsBuilder.setCategoryID(categoriesIds);
  navigateTo("/listing");
};

const setSubCategory = (id: number) => {
  const subCategoriesIds = [];
  subCategoriesIds.push(id);
  filterListingParamsBuilder.setSubCategoryID(subCategoriesIds);
  console.log(id);
  navigateTo("/listing");
};

const showSubCategories = ref<boolean>(false);
</script>

<template>
  <header class="header">
    <nav class="container mx-auto px-8">
      <div class="nav-wrapper flex items-center justify-between">
        <NuxtLink to="/" class="logo">
          <NuxtImg src="/logo.png" alt="logo" class="logo-img" format="webp" />
        </NuxtLink>
        <div class="links">
          <NuxtLink class="link" to="/">Home</NuxtLink>
          <NuxtLink class="link" to="/about-us">About Us</NuxtLink>
          <NuxtLink class="link" to="/blogs">Blog</NuxtLink>
          <div class="dropdown">
            <span class="dropdown-trigger"
              >{{ $t("categories") }}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_61_564)">
                  <path
                    d="M11.06 5.72656L8 8.7799L4.94 5.72656L4 6.66656L8 10.6666L12 6.66656L11.06 5.72656Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_61_564">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <ul class="dropdown-content">
              <li
                class="dropdown-item"
                v-for="category in categories?.slice(0, 10)"
                :key="category.id"
              >
                <button
                  class="sub-category"
                  v-if="category.sub_categories.length > 0"
                  @click="
                    category.show_sub_categories = !category.show_sub_categories
                  "
                  :class="category.show_sub_categories ? 'active' : ''"
                >
                  {{ wordSlice(category.name, 20) }}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_61_564)">
                      <path
                        d="M11.06 5.72656L8 8.7799L4.94 5.72656L4 6.66656L8 10.6666L12 6.66656L11.06 5.72656Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_61_564">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <ul class="sub-category-list" v-if="showSubCategories">
                    <li
                      v-for="subCategory in category.sub_categories"
                      @click="setSubCategory(subCategory.id)"
                    >
                      {{ wordSlice(subCategory.name, 20) }}
                    </li>
                  </ul>
                </button>
                <button v-else @click="setCategory(category.id)">
                  {{ wordSlice(category.name, 20) }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="dropdown-links">
          <div class="dropdown-trigger" @click="toggle">
            <IconsMore />
          </div>
          <Popover ref="op">
            <span class="option-label">
              {{ $t("links") }}
            </span>
            <div class="links-mobile">
              <NuxtLink class="link" to="/">Home</NuxtLink>
              <NuxtLink class="link" to="/about-us">About Us</NuxtLink>
              <NuxtLink class="link" to="/blogs">Blog</NuxtLink>
              <Accordion>
                <AccordionPanel value="0">
                  <AccordionHeader>
                    <h4 class="accord-title">Categories</h4>
                  </AccordionHeader>
                  <AccordionContent>
                    <ul class="flex flex-col gap-2">
                      <li v-for="category in categories">
                        <button @click="setCategory(category.id)">
                          {{ category.name }}
                        </button>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </div>
            <div class="user" v-if="!user.isAuth">
              <div class="not-auth">
                <NuxtLink to="/auth/login" class="login-link">
                  {{ $t("login") }}
                </NuxtLink>
                <span>/</span>
                <NuxtLink to="/auth/register" class="register-link">
                  {{ $t("register") }}
                </NuxtLink>
                <NuxtImg src="/user.png" alt="user" format="webp" />
              </div>
            </div>
            <span class="option-label" v-if="user.isAuth">
              {{ $t("dashboard") }}
            </span>
            <div class="links-mobile" v-if="user.isAuth">
              <ul>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/profile">
                    <span>{{ $t("profile_settings") }}</span>
                    <IconsProfile />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/add-listing">
                    <span>{{ $t("add_listing") }}</span>
                    <iconsAddListing />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/listings">
                    <span>{{ $t("my_listing") }}</span>
                    <IconsMyListing />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink
                    to="/dashboard/messages"
                    class="flex items-center gap-2"
                  >
                    <span class="link">
                      {{ $t("messages") }}
                    </span>
                    <span>
                      <IconsMessage />
                    </span>
                  </NuxtLink>
                </li>

                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/bookmarks">
                    <span>{{ $t("bookmarks") }}</span>
                    <IconsBookmark />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/reviews">
                    <span>{{ $t("reviews") }}</span>
                    <IconsReviews />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <button type="button" @click="logout" to="/logout">
                    <IconsLogin />
                    <span>{{ $t("logout") }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </Popover>
        </div>

        <div class="user">
          <div class="not-auth" v-if="!user.isAuth">
            <NuxtLink to="/auth/login" class="login-link">
              {{ $t("login") }}
            </NuxtLink>
            <span>/</span>
            <NuxtLink to="/auth/register" class="register-link">
              {{ $t("register") }}
            </NuxtLink>
            <NuxtImg src="/user.png" alt="user" format="webp" />
          </div>
          <div class="auth" v-else>
            <svg
              width="8"
              height="5"
              viewBox="0 0 8 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.03585 0.38765L3.97785 3.44465L0.920847 0.38765C0.873035 0.334 0.814775 0.290675 0.749635 0.260328C0.684494 0.22998 0.613844 0.21325 0.542012 0.211161C0.47018 0.209072 0.398677 0.221668 0.331883 0.248178C0.265089 0.274688 0.204409 0.314554 0.153561 0.365335C0.102712 0.416115 0.0627646 0.476741 0.0361648 0.5435C0.00956488 0.610258 -0.0031271 0.681744 -0.0011344 0.753579C0.000858307 0.825414 0.0174942 0.896086 0.0477543 0.961268C0.0780144 1.02645 0.121261 1.08477 0.174847 1.13265L3.23585 4.19065C3.33383 4.28877 3.4502 4.3666 3.57829 4.41971C3.70638 4.47282 3.84368 4.50016 3.98235 4.50016C4.12101 4.50016 4.25831 4.47282 4.38641 4.41971C4.5145 4.3666 4.63086 4.28877 4.72885 4.19065L7.78085 1.13265C7.86889 1.03182 7.91535 0.90131 7.91083 0.767525C7.90631 0.63374 7.85114 0.506666 7.75648 0.412012C7.66183 0.317357 7.53476 0.262188 7.40097 0.257666C7.26719 0.253143 7.13668 0.299604 7.03585 0.38765Z"
                fill="black"
              />
            </svg>
            <div class="info">
              <span class="name">{{ user.user?.name }}</span>
              <span class="role">{{ user.user?.type }}</span>
            </div>
            <img
              @error="setDefaultImage($event)"
              :src="user.user?.image"
              alt="user"
              class="user-photo"
            />
            <div class="dropdown-content">
              <ul>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/profile">
                    <span>{{ $t("profile_settings") }}</span>
                    <IconsProfile />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/add-listing">
                    <span>{{ $t("add_listing") }}</span>
                    <iconsAddListing />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/listings">
                    <span>{{ $t("my_listing") }}</span>
                    <IconsMyListing />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink
                    to="/dashboard/messages"
                    class="flex items-center gap-2"
                  >
                    <span class="link">
                      {{ $t("messages") }}
                    </span>
                    <span>
                      <IconsMessage />
                    </span>
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/bookmarks">
                    <span>{{ $t("bookmarks") }}</span>
                    <IconsBookmark />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <NuxtLink to="/dashboard/reviews">
                    <span>{{ $t("reviews") }}</span>
                    <IconsReviews />
                  </NuxtLink>
                </li>
                <li class="dropdown-item">
                  <button type="button" @click="logout" to="/logout">
                    <IconsLogin />
                    <span>{{ $t("logout") }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
