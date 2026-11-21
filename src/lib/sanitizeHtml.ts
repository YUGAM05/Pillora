/**
 * Small allow-list HTML sanitizer for content that comes from the API
 * (hospital descriptions written by hospital accounts, blog posts written by admins).
 *
 * It parses the HTML with DOMParser (an inert document: scripts don't run and images
 * don't load while parsing), then rebuilds it keeping only allowed tags and attributes.
 * Anything not on the list is dropped; links and image sources must be http(s),
 * mailto:, tel: or site-relative. On the server (no DOMParser) it returns the text
 * escaped, so nothing unsanitised is ever rendered.
 */

// Removed together with everything inside them.
const DROP_WITH_CONTENT = new Set([
    'script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet',
    'form', 'input', 'button', 'textarea', 'select', 'option', 'noscript', 'template',
    'svg', 'math', 'link', 'meta', 'base', 'title', 'head', 'audio', 'video', 'source', 'track',
    'canvas', 'dialog',
]);

const INLINE_TAGS = ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'span', 'sup', 'sub', 'small', 'mark', 'code'];
const BLOCK_TAGS = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'hr'];

export interface SanitizeOptions {
    /** Allow <a href>. */
    allowLinks?: boolean;
    /** Allow <img src>. */
    allowImages?: boolean;
    /** Allow tables (wrapped in a horizontally scrollable div so they don't overflow on phones). */
    allowTables?: boolean;
}

const TABLE_TAGS = ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'figure', 'figcaption'];

const escapeHtml = (text: string) =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

/**
 * Returns the URL if it is safe to put in href/src, otherwise null.
 * Allowed: http(s), mailto, tel, and relative URLs ("/path", "#id", "?q", "page").
 */
export function safeUrl(url: unknown): string | null {
    if (typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!trimmed) return null;
    // Browsers ignore control characters and whitespace inside the scheme ("java\nscript:")
    // eslint-disable-next-line no-control-regex
    const compact = trimmed.replace(/[\u0000- \u007f-\u009f]/g, '').toLowerCase();
    const scheme = compact.match(/^([a-z][a-z0-9+.-]*):/);
    if (!scheme) return trimmed; // relative or protocol-relative ("//host") URL
    return ['http', 'https', 'mailto', 'tel'].includes(scheme[1]) ? trimmed : null;
}

export function sanitizeHtml(html: string, options: SanitizeOptions = {}): string {
    if (!html) return '';
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
        // Server render: never output raw HTML. Strip tags and escape the text.
        return escapeHtml(html.replace(/<[^>]*>/g, ' ')).replace(/\n/g, '<br>');
    }

    const allowed = new Set<string>([...INLINE_TAGS, ...BLOCK_TAGS]);
    if (options.allowLinks) allowed.add('a');
    if (options.allowImages) allowed.add('img');
    if (options.allowTables) TABLE_TAGS.forEach(t => allowed.add(t));

    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    const out = document.implementation.createHTMLDocument('');

    const copyChildren = (from: Node, to: Node) => {
        from.childNodes.forEach(child => {
            const cleaned = cleanNode(child);
            cleaned.forEach(n => to.appendChild(n));
        });
    };

    const cleanNode = (node: Node): Node[] => {
        if (node.nodeType === Node.TEXT_NODE) {
            return [out.createTextNode(node.textContent || '')];
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return [];

        const el = node as Element;
        const tag = el.tagName.toLowerCase();

        if (DROP_WITH_CONTENT.has(tag)) return [];

        if (!allowed.has(tag)) {
            // Unknown tag: keep its (cleaned) children, drop the tag itself.
            const frag = out.createDocumentFragment();
            copyChildren(el, frag);
            return [frag];
        }

        const clean = out.createElement(tag);

        if (tag === 'a') {
            const href = safeUrl(el.getAttribute('href'));
            if (href) clean.setAttribute('href', href);
            const title = el.getAttribute('title');
            if (title) clean.setAttribute('title', title);
            if (href && /^(https?:)?\/\//i.test(href)) {
                clean.setAttribute('target', '_blank');
                clean.setAttribute('rel', 'noopener noreferrer nofollow');
            }
        } else if (tag === 'img') {
            const src = safeUrl(el.getAttribute('src'));
            if (!src || src.toLowerCase().startsWith('mailto:') || src.toLowerCase().startsWith('tel:')) return [];
            clean.setAttribute('src', src);
            clean.setAttribute('alt', el.getAttribute('alt') || '');
            clean.setAttribute('loading', 'lazy');
            for (const dim of ['width', 'height']) {
                const v = el.getAttribute(dim);
                if (v && /^\d{1,4}$/.test(v)) clean.setAttribute(dim, v);
            }
        } else if (tag === 'td' || tag === 'th') {
            for (const span of ['colspan', 'rowspan']) {
                const v = el.getAttribute(span);
                if (v && /^\d{1,2}$/.test(v)) clean.setAttribute(span, v);
            }
        }

        copyChildren(el, clean);

        if (tag === 'table') {
            const wrap = out.createElement('div');
            wrap.setAttribute('style', 'overflow-x:auto;max-width:100%');
            wrap.appendChild(clean);
            return [wrap];
        }
        return [clean];
    };

    const container = out.createElement('div');
    copyChildren(doc.body, container);
    return container.innerHTML;
}
