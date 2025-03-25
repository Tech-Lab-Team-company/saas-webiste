<script setup lang="ts"></script>

<template>
  <section class="our-team">
    <h2 class="sub-section-title">
      {{ $t("our_team") }}
    </h2>
    <p class="text-center">
      {{ $t("Meet_the_faces_behind_the_magic") }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-4">
      <div class="col-span-1" v-for="i in 3" :key="i">
        <div class="team-member-card">
          <NuxtImg
            src="team-member.png"
            alt="team-member"
            class="team-member-card-img"
            format="webp"
          />
          <h3 class="team-member-card-name">John Doe</h3>
          <p class="team-member-card-role">CEO</p>
          <div class="social">
            <IconsFaceGray />
            <IconsInstaGray />
            <IconsTwitterGray />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
