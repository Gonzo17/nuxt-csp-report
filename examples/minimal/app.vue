<script setup lang="ts">
const { data: reports, pending } = useFetch('/api/reports')
</script>

<template>
  <main>
    <header>
      <h1>Nuxt CSP Report · Minimal</h1>
      <p>
        This example showcases <code>nuxt-csp-report</code> with <code>nuxt-security</code>. It uses <code>report-uri</code> and a file system store.
      </p>
      <div>
        External image to trigger CSP violation:
        <img
          alt="External image"
          src="https://picsum.photos/200"
          width="200"
          height="200"
        >
      </div>
    </header>

    <section>
      <h2>Stored reports (last first)</h2>
      <p v-if="pending">
        Loading…
      </p>
      <p v-else-if="!reports?.length">
        No reports yet.
      </p>
      <ul v-else>
        <li
          v-for="(report, index) in reports"
          :key="index"
        >
          <pre>{{ JSON.stringify(report, null, 2) }}</pre>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
:global(body) {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  margin: 0;
  background: linear-gradient(135deg, #0b1021, #0f172a);
  color: #e2e8f0;
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

p {
  line-height: 1.5;
  color: #cbd5e1;
}

button {
  background: #22d3ee;
  color: #0b1021;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
  box-shadow: 0 10px 30px rgba(34, 211, 238, 0.35);
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

section {
  margin-top: 32px;
}

ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}

li {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 12px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e2e8f0;
  font-size: 14px;
  line-height: 1.45;
}
</style>
