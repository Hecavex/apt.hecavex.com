import assert from 'node:assert/strict';
import { serializeStructuredData } from '../src/utils/structured-data.mjs';

const original = {
  name: '</script><script>alert("metadata")</script>',
  description: '<!-- comment --> <img src=x onerror=alert(1)> Įrodymai & šaltiniai',
  nested: { url: 'https://example.org/?q=<value>&lang=lt' }
};
const serialized = serializeStructuredData(original);
assert.equal(serialized.includes('<'), false, 'Metadata cannot open or close an HTML element');
assert.deepEqual(JSON.parse(serialized), original, 'Script-safe serialization preserves metadata values');
assert.equal(serialized.includes('</script>'), false, 'Metadata cannot terminate its script element');
console.log('Structured-data adversarial serialization checks passed.');
