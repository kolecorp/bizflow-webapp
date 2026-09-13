const fs = require('fs');
const file = 'c:/@Projects/@ABJ Creative/bizflow/bizflow-webapp/src/pages/TelegramStudioPage.svelte';
let content = fs.readFileSync(file, 'utf8');
const startIdx = content.indexOf('<!-- ╔═══════════════════════════════════════════════════════════╗ -->');
const endIdx = content.indexOf('</section>', startIdx) + 10;
const htmlStart = content.indexOf('<div class="flex min-h-screen');
const scriptPart = content.substring(0, htmlStart);
const styleStart = content.lastIndexOf('<style>');
const stylePart = content.substring(styleStart);
let csHtml = content.substring(startIdx, endIdx);

// Make the height strictly 100vh since it's a full page now
csHtml = csHtml.replace('height: calc(100vh - 4.5rem); /* fill remaining height below header */', 'height: 100vh; /* full page */');
csHtml = csHtml.replace('margin: 0 -1.5rem -1.5rem -1.5rem; /* pull to edge of layout container */', 'margin: 0;');

// Also inject a back button in the topbar
const topbarEyebrowIdx = csHtml.indexOf('<span class="cs-topbar__eyebrow">');
if(topbarEyebrowIdx > -1) {
    const backBtn = '<a href="/extensions/telegram/commands" class="mr-3 inline-flex items-center justify-center rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></a>\n';
    csHtml = csHtml.slice(0, topbarEyebrowIdx) + backBtn + csHtml.slice(topbarEyebrowIdx);
}

const newContent = scriptPart + '\n' + csHtml + '\n' + stylePart;
fs.writeFileSync(file, newContent);
console.log('Extracted Studio HTML');
