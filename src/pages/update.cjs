const fs = require('fs');
const file = 'c:/@Projects/@ABJ Creative/bizflow/bizflow-webapp/src/pages/TelegramPage.svelte';
let content = fs.readFileSync(file, 'utf8');
const startIdx = content.indexOf('<!-- ╔═══════════════════════════════════════════════════════════╗ -->');
const endIdx = content.indexOf('</section>', startIdx) + 10;

const landingHtml = `
    <!-- ╔═══════════════════════════════════════════════════════════╗ -->
    <!-- ║             COMMAND STUDIO REDIRECT                      ║ -->
    <!-- ╚═══════════════════════════════════════════════════════════╝ -->
    <section class="surface-panel p-12 text-center" aria-labelledby="command-studio-title">
      <div class="mx-auto max-w-md">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        </div>
        <h2 id="command-studio-title" class="mb-2 font-heading text-2xl font-bold text-foreground">Command Studio</h2>
        <p class="mb-8 text-sm text-muted-foreground">The Telegram Command Studio has been moved to a dedicated, full-screen workspace for a better building experience.</p>
        <a href="/extensions/telegram/studio" class="btn-app-primary inline-flex items-center gap-2">
          Open Command Studio
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </section>
`;

const newContent = content.substring(0, startIdx) + landingHtml + content.substring(endIdx);
fs.writeFileSync(file, newContent);
console.log('Updated TelegramPage HTML');
