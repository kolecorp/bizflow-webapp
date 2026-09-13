const fs = require('fs');

const tpPath = 'c:/@Projects/@ABJ Creative/bizflow/bizflow-webapp/src/pages/TelegramPage.svelte';
const tspPath = 'c:/@Projects/@ABJ Creative/bizflow/bizflow-webapp/src/pages/TelegramStudioPage.svelte';

const tpContent = fs.readFileSync(tpPath, 'utf8');
const tspContent = fs.readFileSync(tspPath, 'utf8');

const scriptEnd = tpContent.indexOf('</script>') + '</script>'.length;
const scriptPart = tpContent.substring(0, scriptEnd);

const newTspContent = scriptPart + '\n\n' + tspContent;

fs.writeFileSync(tspPath, newTspContent);
console.log('Successfully injected script tag into TelegramStudioPage');
