<script setup lang="ts">
import Logo from "~/public/icons/Logo.vue";
import PhoneIcon from "~/public/icons/PhoneIcon.vue";
import Location from "~/public/icons/Location.vue";
import FcaebookIcon from "~/public/icons/FcaebookIcon.vue";
import instagramIcon from "~/public/icons/instagramIcon.vue";
import linkedInIcon from "~/public/icons/linkedInIcon.vue";
import twitterIcon from "~/public/icons/twitterIcon.vue";
import { NuxtLink } from "#components";
import Email from "../Icons/Email.vue";
import FetchChatBotParams from "~/features/FetchChatBot/Core/Params/fetch_chat_bot_params";
import FetchChatBotController from "~/features/FetchChatBot/presentation/controllers/fetch_chat_bot_controller";
import type ChatBotModel from "~/features/FetchChatBot/Data/models/chat_bot_model";


const settingStore = useSettingStore();
const setting = computed(() => settingStore.setting);








</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 footer-container">
    
    <div class="col">
      <p class="col-title">وسائل التواصل</p>

      <div class="col-description">
        <div class="col-details">
          <div>
            <p>رقم الهاتف</p>
            <p>{{ setting?.phone }}</p>
          </div>
          <PhoneIcon />
        </div>

        <div class="col-details">
          <div>
            <p>موقعنا</p>
            <p>{{ setting?.address }}</p>
          </div>
          <Location />
        </div>
        <div class="col-details">
          <div>
            <p>البريد</p>
            <p>{{ setting?.email || setting?.name }}</p>
          </div>
          <Email class="email-icon" />
        </div>
      </div>
    </div>
    <div class="col">
      <div class="col-title">
        <p>صفحات اخرى</p>
      </div>
      <div class="col-data-details">
        <NuxtLink to="/privacy">
          <p>سياسه الخصوصيه</p>
        </NuxtLink>
        <NuxtLink to="/terms">
          <p>شروط الاستخدام</p>
        </NuxtLink>
        <NuxtLink to="/fqs">
          <p>الاسئله الشائعه</p>
        </NuxtLink>
        <NuxtLink to="/blogs">
          <p>المدونه</p>
        </NuxtLink>
      </div>
    </div>
    <div class="col">
      <div class="col-title">
        <p>عن منصتنا</p>
      </div>

      <div class="col-data-details">
        <Nuxt-link to="/">
          <p>الرئيسيه</p>
        </Nuxt-link>
        <Nuxt-link to="/course">
          <p>كورساتي</p>
        </Nuxt-link>
        <Nuxt-link to="/aboutus">
          <p>من نحن</p>
        </Nuxt-link>
        <!-- <p>تواصل معنا</p> -->
      </div>
    </div>

    <div class="col logo-col">
      
   

      <NuxtImg v-if="settingStore.setting?.image?.img" :src="settingStore.setting.image.img" :alt="setting?.image?.alt"
        format="webp" class="col-logo" />

      <div v-html="setting?.description" class="col-data-details"></div>
      <div class="stores-logos-container">
        <a v-if="settingStore.setting?.app_store && settingStore.setting?.app_store != '-'" class="stores-logos-link" target="_blank" :href="settingStore.setting?.app_store">
          <NuxtImg class="stores-logos stores-logos-apple" src="/images/Download_on_the_App_Store_Badge.svg.webp" />
          
        </a>
        <a v-if="settingStore.setting?.play_store && settingStore.setting?.play_store != '-'" class="stores-logos-link" target="_blank" :href="settingStore.setting?.play_store">
          <NuxtImg class="stores-logos" src="/images/en_badge_web_generic.png" />
        </a>
      </div>
      <div class="social-media-icons">
        <NuxtLink :to="setting?.twitter">
          <IconsTwiter class="social-icon" />
        </NuxtLink>
        <NuxtLink :to="setting?.linkedin">
          <IconsLinked class="social-icon" />
        </NuxtLink>
        <NuxtLink :to="setting?.instagram">
          <IconsInsta class="social-icon" />
        </NuxtLink>
        <NuxtLink :to="setting?.facebook">
          <IconsFacebookIcon class="social-icon" />
        </NuxtLink>
      </div>
    </div>

    <!-- <hr class="hr" /> -->
    <!-- <hr class="rights-hr" /> -->
    <!-- <TechLabRights class="tech-lab-rights"/> -->
  </div>
</template>

<style scoped lang="scss">

.footer-container{
  position: relative;
  @media(max-width:768px){
    grid-column: 1fr 1fr;
  }
}





.pi-comment{
  font-size: 20px;
}
.stores-logos-container{
  display:flex;
  align-items:center;
  justify-content: center;
  .stores-logos-link{
    width:50%;

    .stores-logos-apple{
      width:88%;
    }
  }

}

.social-media-icons {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  flex-wrap: wrap;

  a{

    @media(max-width:1000px){
      width: 40px;
    }

    .social-icon {
      width: 37px;
      padding: 7px;
      /* width: 48px; */
      background-color: rgba(37, 37, 173, 0.0509803922);
      height: 40px;
      border-radius: 31px;
  
      
    }
  }

 

}
.col{
  &.logo-col{
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap:15px;
    position: relative;
    .chatbot{
        position: absolute;
        top: 0;
        right: 0;
      }
  }
  .col-description{
    .col-details{
      .email-icon {
        background-color: #ECECF2;
        // width: 20px;
        // height: 20px;
        padding: 6px;
        border-radius: 50px;
      }
    }
  }
}
.rights-hr{
  margin-top: 1rem;
  grid-column: span 4;
}
.tech-lab-rights{
  width: 100%;
  grid-column: span 4;
  // @media (max-width:768px) {
  //     grid-column: span 3;
  // }
  // @media (max-width:400px) {
  //     grid-column: span 2;
  // }
  // @media (max-width:300px) {
  //     grid-column: span 1;
  // }
}
</style>





