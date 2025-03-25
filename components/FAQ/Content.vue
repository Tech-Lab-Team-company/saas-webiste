<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import type Faq from "~/types/faq";

const props = defineProps<{ faqs: Faq[] | null }>();
</script>

<template>
  <section class="faq">
    <div class="container mx-auto px-8">
      <Accordion v-for="faq in faqs" :key="faq.id" :value="faq.id">
        <AccordionPanel :value="faq.id">
          <AccordionHeader>
            <h4 class="accord-title">{{ faq.question }}</h4>
          </AccordionHeader>
          <AccordionContent>
            <p class="accord-content" v-html="faq.answer"></p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </section>
</template>

<style scoped></style>
