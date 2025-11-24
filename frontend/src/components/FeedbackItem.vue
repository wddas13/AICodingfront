<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div style="padding:8px; border:1px solid #eee; border-radius:6px;">
    <div>{{ item.content }}</div>
    <div style="color:#666; font-size:12px;">{{ item.contact }}</div>
    <div style="color:#999; font-size:12px;">{{ item.createdAt }}</div>
  </div>
</template>
