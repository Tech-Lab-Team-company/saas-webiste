<script setup lang="ts">
import { ref, nextTick } from "vue";

const emit = defineEmits(["update:phoneNumber"]);

const phoneNumber = ref<string>("");

const formatPhoneNumber = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  if (!target) return;

  // 1. Clean input: Remove all non-digits and limit to 10 characters
  const cleaned = target.value.replace(/\D/g, "").slice(0, 10);

  // 2. Format the cleaned digits
  let formatted = "";
  if (cleaned.length > 0) {
    formatted = "+1(";
    const areaCode = cleaned.slice(0, 3);
    const prefix = cleaned.slice(3, 6);
    const lineNumber = cleaned.slice(6, 10);

    formatted += areaCode;
    if (cleaned.length >= 3) formatted += ") ";
    if (cleaned.length >= 6) formatted += `${prefix}-`;
    formatted += lineNumber;
  }

  // 3. Update model value
  phoneNumber.value = formatted;

  // 4. Emit raw digits for external use
  emit("update:phoneNumber", cleaned);

  // 5. Adjust cursor position
  nextTick(() => {
    const newCursorPos = calculateNewCursorPosition(target.value, formatted, target.selectionStart);
    target.setSelectionRange(newCursorPos, newCursorPos);
  });
};

const calculateNewCursorPosition = (
    oldValue: string,
    newValue: string,
    oldCursorPos: number | null
): number => {
  if (!oldCursorPos) return newValue.length;

  const numericCharsBeforeCursor = oldValue
      .slice(0, oldCursorPos)
      .replace(/\D/g, "").length;

  let newCursorPos = 0;
  let numericCount = 0;

  while (numericCount < numericCharsBeforeCursor && newCursorPos < newValue.length) {
    if (/\d/.test(newValue[newCursorPos])) numericCount++;
    newCursorPos++;
  }

  return newCursorPos;
};
</script>

<template>
  <input
      type="tel"
      class="input"
      v-model="phoneNumber"
      placeholder="+1(xxx) xxx-xxxx"
      maxlength="16"
      pattern="[0-9]{10}"
      inputmode="numeric"
  />
</template>