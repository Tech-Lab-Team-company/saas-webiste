<!-- <script setup lang="ts">
import LogoutController from "~/features/LogoutFeature/presentation/controllers/logout_controller";
import Popover from "primevue/popover";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import type Category from "~/types/categories";
import { BASE_URL } from "~/base/persention/utils/constant";
import FilterListingParamsBuilder from "~/features/ListingFeature/Presentation/Builder/filter_listing_builder";
import { setDefaultImage } from "~/base/persention/utils/set_default_image";
import wordSlice from "~/base/persention/utils/word_slice";

const op = ref();

const user = useUserStore();

const router = useRouter();
const showSubMenu = ref(false);

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
  // console.log(id)
  navigateTo("/listing");
};

const showChildrenStates = ref<{ [key: number]: boolean }>({});

// Toggle the visibility of subcategories for a specific category
const toggleSubCategory = (categoryId: number) => {
  showChildrenStates.value = {};
  showChildrenStates.value[categoryId] = !showChildrenStates.value[categoryId];
  // showChildrenStates.value = {
  //   ...showChildrenStates.value,
  //   [categoryId]: !showChildrenStates.value[categoryId],
  // };
};
</script> -->

<script lang="ts" setup>
  import Logo from '~/public/icons/Logo.vue'
</script>

<template>
  <header class="header">

    <div class="header-nav">
      <p class="header-title">👋 هل تريد معرفة المزيد عنا ! .. دعني اوضح لك</p>
    </div>



    <nav class="container ">

        <div class="buttons">
          <button class="btn btn-primary">
            انشاء حساب
          </button>
          <button class="btn btn-secondary">
            تسجيل الدخول
          </button>
        </div>

        <ul class="nav-links">

    
         
          <NuxtLink 
            to="/main" 
            class="nav-link">
            <li>المدونه</li>
          </NuxtLink>
          <NuxtLink 
            to="/main" 
            class="nav-link">
            <li>بنك الاسئله</li>
          </NuxtLink>
   
          <NuxtLink 
            to="/main" 
            class="nav-link active">
            <li class="active">الكورسات</li>
          </NuxtLink>
          <NuxtLink 
            to="/main" 
            class="nav-link">
            <li>نبذه عنا</li>
          </NuxtLink>
          <NuxtLink 
            to="/main" 
            class="nav-link">
            <li>الرئيسية</li>
          </NuxtLink>
        </ul>

        
        <NuxtLink to="/" class="logo">
          <Logo />
        </NuxtLink>
    
      
    </nav>

  </header>
</template>

<style scoped lang="scss">




.header{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin: 0;
  padding: 0;






  .header-nav{
    width: 100%;
    background-color:#061147 ;
    padding: 10px;
  }
  .header-title{
    margin-left: auto;
    margin-right: auto;
    font-size: 15px;
    width: fit-content;
    color: white;
    text-align: center;
    font-family: "regular";
  }

  .container{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 40px;
    background-color: #ffffff;

    
      .nav-links{
        display: flex;
        gap:20px;
        .nav-link{
          font-size: 18px;
          color: #565E68;
          font-family: "regular";

          &.active{
            color: #2525AD;
          }

        }

      }

      .buttons{
        display: flex;
        gap: 10px;
      }
                        

  }

}






</style>



