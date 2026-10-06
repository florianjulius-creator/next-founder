// Makes a pre-rendered canvas page interactive: runs the page's Component,
// re-renders on setState and morphs the DOM so focus, scroll and CSS transitions survive.
import morphdom from './morphdom.js';
import { makeComponent, renderBody } from './dc.js';

const tpl = JSON.parse(document.getElementById('dc-tpl').textContent);
const props = JSON.parse(document.getElementById('dc-props').textContent);
let handlers = [];
let queued = false;

const comp = makeComponent(window.__dcFactory, props, () => {
  if (queued) return;
  queued = true;
  queueMicrotask(() => { queued = false; render(); });
});

function render() {
  const next = [];
  const html = renderBody(tpl, comp.renderVals(), next);
  handlers = next;
  const body = document.createElement('body');
  body.innerHTML = html;
  morphdom(document.body, body, {
    childrenOnly: true,
    onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
  });
}

// React semantics: onChange fires on every keystroke, so it listens to "input".
function delegate(domEvent, attrs) {
  document.addEventListener(domEvent, (e) => {
    for (let el = e.target; el && el !== document; el = el.parentNode) {
      if (el.nodeType !== 1) continue;
      for (const a of attrs) {
        const i = el.getAttribute('data-dc-' + a);
        if (i !== null && handlers[i]) handlers[i](e);
      }
      if (e.cancelBubble) break;
    }
  });
}
delegate('click', ['onclick']);
delegate('input', ['oninput', 'onchange']);
delegate('submit', ['onsubmit']);
delegate('keydown', ['onkeydown']);

render(); // hydrate: same markup as the pre-render, so nothing moves; it registers the handlers
document.documentElement.dataset.dc = 'ready';
