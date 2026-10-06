// Render engine for Claude Design canvas files (.dc.html).
// Shared by the build (Node, for the pre-rendered HTML) and the browser (runtime.js),
// so the first client render matches the server render exactly.

export function parseDc(html) {
  const body = html.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1];
  const helmet = (body.match(/<helmet>([\s\S]*?)<\/helmet>/) || ['', ''])[1];
  const tpl = body.replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  const propsJson = html.match(/data-props='([^']*)'/)[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'");
  const props = {};
  for (const [k, v] of Object.entries(JSON.parse(propsJson))) if (!k.startsWith('$')) props[k] = v.default;
  const code = html.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  return { helmet, tpl, props, code };
}

// DCLogic base class as the canvas runtime offers it: props, state, setState, forceUpdate.
export function makeComponent(factory, props, onUpdate) {
  class DCLogic {
    constructor() { this.props = props; this.state = {}; }
    setState(patch) {
      const p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = { ...this.state, ...p };
      onUpdate();
    }
    forceUpdate() { onUpdate(); }
  }
  const Component = factory(DCLogic);
  return new Component();
}

const get = (scope, path) => path.trim().split('.').reduce((o, k) => (o == null ? o : o[k]), scope);
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
// A hole that renders "false" in a boolean attribute must remove the attribute.
const BOOL_FALSE = /\s(disabled|checked|selected|hidden|required|readonly|open|multiple|autofocus)="false"/g;

function holes(s, scope, handlers) {
  // onClick="{{fn}}" becomes data-dc-onclick="<index>"; runtime.js dispatches by index.
  s = s.replace(/\s(on[A-Z][a-zA-Z]*)="\{\{\s*([^}]+?)\s*\}\}"/g, (_, ev, p) => {
    const fn = get(scope, p);
    if (typeof fn !== 'function') return '';
    handlers.push(fn);
    return ` data-dc-${ev.toLowerCase()}="${handlers.length - 1}"`;
  });
  return s.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, p) => {
    if (p === 'true' || p === 'false') return p;
    const v = get(scope, p);
    return typeof v === 'function' ? '' : v == null ? '' : esc(v);
  });
}

// Expands <sc-for list as> and <sc-if value>, nesting-aware, then fills {{holes}}.
function expand(s, scope, handlers) {
  let out = '';
  const re = /<(sc-for|sc-if)\b([^>]*)>/g;
  let pos = 0;
  while (true) {
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m) break;
    const tag = m[1];
    const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'g');
    tagRe.lastIndex = re.lastIndex;
    let depth = 1, t, end, closeEnd;
    while ((t = tagRe.exec(s))) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) { end = t.index; closeEnd = tagRe.lastIndex; break; }
    }
    out += holes(s.slice(pos, m.index), scope, handlers);
    const inner = s.slice(re.lastIndex, end);
    const attr = (n) => (m[2].match(new RegExp(`${n}="\\{\\{\\s*([^}]+?)\\s*\\}\\}"`)) || [])[1];
    if (tag === 'sc-for') {
      const as = m[2].match(/as="([^"]+)"/)[1];
      (get(scope, attr('list')) || []).forEach((item, idx) => {
        out += expand(inner, { ...scope, [as]: item, $index: idx }, handlers);
      });
    } else if (get(scope, attr('value'))) {
      out += expand(inner, scope, handlers);
    }
    pos = closeEnd;
  }
  return out + holes(s.slice(pos), scope, handlers);
}

export function renderBody(tpl, vals, handlers = []) {
  return expand(tpl, vals, handlers).replace(BOOL_FALSE, '');
}
