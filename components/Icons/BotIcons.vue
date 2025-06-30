<!-- components/ChatBotIcon.vue -->
<template>
  <svg 
    :width="size" 
    :height="size" 
    :viewBox="viewBox" 
    xmlns="http://www.w3.org/2000/svg"
    :class="classes"
  >
    <defs>
      <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#7AFFFC;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#47AE9C;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#14469E;stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <!-- Main chat bubble -->
    <circle cx="60" cy="45" r="35" fill="url(#chatGradient)" />
    
    <!-- Chat bubble tail -->
    <path d="M35 70 L25 85 L50 75 Z" fill="url(#chatGradient)" />
    
    <!-- Smaller chat bubble -->
    <circle cx="85" cy="25" r="20" fill="url(#chatGradient)" opacity="0.8" />
    
    <!-- Small bubble tail -->
    <path d="M75 40 L70 50 L85 45 Z" fill="url(#chatGradient)" opacity="0.8" />
    
    <!-- Chat dots inside main bubble -->
    <circle cx="50" cy="45" r="3" fill="white" opacity="0.9" />
    <circle cx="60" cy="45" r="3" fill="white" opacity="0.7" />
    <circle cx="70" cy="45" r="3" fill="white" opacity="0.5" />
    
    <!-- Small dots in smaller bubble -->
    <circle cx="82" cy="25" r="2" fill="white" opacity="0.8" />
    <circle cx="88" cy="25" r="2" fill="white" opacity="0.6" />
  </svg>
</template>

<script setup>
// Props for customization
defineProps({
  size: {
    type: [String, Number],
    default: 100
  },
  viewBox: {
    type: String,
    default: '0 0 120 120'
  },
  classes: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* Optional: Add hover effects or animations */
svg {
  transition: transform 0.2s ease;
}

svg:hover {
  transform: scale(1.1);
}
</style>