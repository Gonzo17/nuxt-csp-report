<template>
  <div>
    <div>
      External image:
      <img
        alt="External image"
        src="https://picsum.photos/200"
        width="200"
        height="200"
      >
    </div>
    <div>
      Stored CSP Reports:
      <pre>{{ reports }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: reports } = useFetch('/api/reports')
</script>
