(() => {
    if (document.getElementById('sv-support-widget')) return;

    const scriptUrl = document.currentScript?.src || new URL('support-widget.js', window.location.href).href;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = new URL('support-widget.css', scriptUrl).href;
    document.head.appendChild(stylesheet);

    const root = document.createElement('div');
    root.id = 'sv-support-widget';
    root.innerHTML = `
        <section class="support-panel" id="svSupportPanel" aria-label="Hỗ trợ khách hàng" aria-hidden="true">
            <header class="support-panel-header">
                <span class="support-panel-title">Hỗ trợ SV VT VN</span>
                <span class="support-panel-state">Trợ lý trực tuyến</span>
                <button class="support-close" type="button" aria-label="Đóng hỗ trợ" title="Đóng">&times;</button>
            </header>
            <iframe class="support-frame" title="Trò chuyện với hỗ trợ SV VT VN" loading="lazy"></iframe>
        </section>
        <button class="support-launcher" type="button" aria-label="Mở hỗ trợ khách hàng" aria-expanded="false" aria-controls="svSupportPanel" title="Chat hỗ trợ khách hàng">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.48 3 2 6.93 2 11.78c0 2.48 1.15 4.72 3 6.27V22l3.72-2.04c1.03.29 2.13.44 3.28.44 5.52 0 10-3.93 10-8.78S17.52 3 12 3zm1.02 11.82-2.55-2.72-4.98 2.72 5.47-5.8 2.62 2.72 4.91-2.72-5.47 5.8z"/></svg>
        </button>`;
    document.body.appendChild(root);

    const launcher = root.querySelector('.support-launcher');
    const panel = root.querySelector('.support-panel');
    const frame = root.querySelector('.support-frame');
    const closeButton = root.querySelector('.support-close');

    function setOpen(isOpen) {
        root.classList.toggle('is-open', isOpen);
        launcher.setAttribute('aria-expanded', String(isOpen));
        launcher.setAttribute('aria-label', isOpen ? 'Đóng hỗ trợ khách hàng' : 'Mở hỗ trợ khách hàng');
        panel.setAttribute('aria-hidden', String(!isOpen));
        document.body.classList.toggle('support-chat-open', isOpen);
        if (isOpen && !frame.src) {
            frame.src = new URL('messenger-chat-widget.html?embedded=1', scriptUrl).href;
        }
        if (isOpen) closeButton.focus();
        else launcher.focus();
    }

    launcher.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
    closeButton.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && root.classList.contains('is-open')) setOpen(false);
    });
})();
