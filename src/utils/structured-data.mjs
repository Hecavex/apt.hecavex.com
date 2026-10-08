/** Serialize JSON for an HTML script text node without permitting a closing tag. */
export function serializeStructuredData(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}
