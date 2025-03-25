<script setup lang="ts"></script>

<template>
  <section class="call-us">
    <div class="container mx-auto px-8">
      <div class="flex gap-4 items-center flex-col md:flex-row">
        <div class="img">
          <NuxtImg
            src="24service.png"
            alt="call-us"
            class="call-us-img"
            format="webp"
          />
        </div>
        <div class="call-us-info">
          <h2 class="call-us-title">{{ $t("Stay_Connected_with_Rakwa") }}</h2>
          <p>
            {{
              $t(
                "From_guiding_you_to_the_perfect_service_to_answering_your_questions_were_committed_to_supporting_you_every_step_of_the_way_Dont_hesitate_to_reach_out_together_we_can_create_meaningful_connections",
              )
            }}
          </p>
          <router-link to="/contact-us" class="secondary-button">
            <IconsCallUs />
            <span>{{ $t("contact_us") }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
