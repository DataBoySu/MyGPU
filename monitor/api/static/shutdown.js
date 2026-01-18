
(function () {
    // Inject Styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shutdown-btn-confirm { padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const overlays = `
        <div id="shutdown-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999; backdrop-filter:blur(8px); align-items:center; justify-content:center;">
            <div style="background:var(--bg-secondary); padding:40px; border-radius:16px; border:1px solid var(--accent-red); max-width:500px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.5);">
                <h2 style="color:var(--text-primary); margin-bottom:15px; font-size:1.8em;">Shutdown</h2>
                <p style="color:var(--text-secondary); margin-bottom:30px;">Stop backend and all benchmarks?</p>
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button onclick="document.getElementById('shutdown-overlay').style.display='none'"
                        style="padding:12px 24px; border-radius:8px; border:1px solid var(--border-color); background:transparent; color:var(--text-primary); cursor:pointer; font-weight:600;">Cancel</button>
                    <button onclick="confirmShutdown()"
                        style="padding:12px 24px; border-radius:8px; border:none; background:var(--accent-red); color:white; cursor:pointer; font-weight:600; box-shadow:0 4px 15px rgba(220,53,69,0.3);">Shut Down Now</button>
                </div>
            </div>
        </div>

        <div id="shutdown-final-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:#0b0b0b; z-index:100000; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
            <div class="loader-ring" style="width:80px; height:80px; border:5px solid #333; border-top:5px solid var(--accent-red); border-radius:50%; animation:spin 1s linear infinite;"></div>
            <h1 style="color:white; margin-top:30px; font-size:2em;">Shutting Down</h1>
            <p style="color:var(--text-secondary); margin-top:10px;">Backend stopped. Close this tab.</p>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', overlays);

    // Shutdown Logic
    async function shutdownServer() {
        const overlay = document.getElementById('shutdown-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        } else {
            if (!confirm('Shut down monitor?')) return;
            confirmShutdown();
        }
    }

    async function confirmShutdown() {
        const overlay = document.getElementById('shutdown-overlay');
        if (overlay) overlay.style.display = 'none';

        const finalOverlay = document.getElementById('shutdown-final-overlay');
        if (finalOverlay) finalOverlay.style.display = 'flex';

        try {
            await fetch('/api/shutdown', { method: 'POST' });
        } catch (e) {
            console.debug('Shutdown signal sent');
        }

        // Stop the rotating circle after 3 seconds to signify completion
        setTimeout(() => {
            const ring = document.querySelector('.loader-ring');
            if (ring) {
                ring.style.animation = 'none';
                ring.style.borderTopColor = 'var(--accent-green)'; // Turn green to show success
            }
            const title = finalOverlay.querySelector('h1');
            if (title) title.textContent = 'System Offline';
        }, 3000);
    }

    // Export to window
    window.shutdownServer = shutdownServer;
    window.confirmShutdown = confirmShutdown;
})();
