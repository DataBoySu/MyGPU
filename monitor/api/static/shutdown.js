// Shutdown module: provides client-side shutdown UI helpers.
(function(){
    function waitMs(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

    function createShutdownModal(initialText) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.background = 'rgba(0,0,0,0.45)';
        overlay.style.zIndex = '10000';

        const card = document.createElement('div');
        card.style.background = 'var(--bg-secondary)';
        card.style.color = 'var(--text-primary)';
        card.style.padding = '18px 22px';
        card.style.borderRadius = '10px';
        card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
        card.style.minWidth = '280px';
        card.style.textAlign = 'center';

        const msg = document.createElement('div');
        msg.textContent = initialText || '';
        msg.style.marginBottom = '10px';

        const spinner = document.createElement('div');
        spinner.style.width = '28px';
        spinner.style.height = '28px';
        spinner.style.border = '4px solid rgba(255,255,255,0.15)';
        spinner.style.borderTopColor = 'var(--accent-blue)';
        spinner.style.borderRadius = '50%';
        spinner.style.margin = '0 auto';
        spinner.style.animation = 'spin 1s linear infinite';

        card.appendChild(msg);
        card.appendChild(spinner);
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        if (!document.getElementById('shutdown-spin-style')) {
            const style = document.createElement('style');
            style.id = 'shutdown-spin-style';
            style.textContent = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}';
            document.head.appendChild(style);
        }

        return {
            setText: (t) => { msg.textContent = t; },
            remove: () => { try { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); } catch (e){} }
        };
    }

    function showConfirmShutdownDialog() {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.left = '0';
            overlay.style.top = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.background = 'rgba(0,0,0,0.45)';
            overlay.style.zIndex = '10000';

            const card = document.createElement('div');
            card.style.background = 'var(--bg-secondary)';
            card.style.color = 'var(--text-primary)';
            card.style.padding = '18px 22px';
            card.style.borderRadius = '10px';
            card.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
            card.style.minWidth = '320px';
            card.style.textAlign = 'center';

            const title = document.createElement('div');
            title.textContent = 'Confirm Shutdown';
            title.style.fontWeight = '700';
            title.style.marginBottom = '8px';

            const msg = document.createElement('div');
            msg.textContent = 'Are you sure you want to shutdown the server? This will stop the process.';
            msg.style.marginBottom = '14px';
            msg.style.color = 'var(--text-secondary)';

            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.justifyContent = 'center';
            actions.style.gap = '10px';

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.padding = '8px 12px';
            cancelBtn.style.borderRadius = '6px';
            cancelBtn.style.border = '1px solid var(--border-color)';
            cancelBtn.style.background = 'transparent';
            cancelBtn.style.color = 'var(--text-primary)';
            cancelBtn.onclick = () => { try { overlay.remove(); } catch (e){}; resolve(false); };

            const shutdownBtn = document.createElement('button');
            shutdownBtn.textContent = 'Shutdown Server';
            shutdownBtn.style.padding = '8px 12px';
            shutdownBtn.style.borderRadius = '6px';
            shutdownBtn.style.border = 'none';
            shutdownBtn.style.background = 'var(--accent-red)';
            shutdownBtn.style.color = '#fff';
            shutdownBtn.onclick = () => { try { overlay.remove(); } catch (e){}; resolve(true); };

            actions.appendChild(cancelBtn);
            actions.appendChild(shutdownBtn);

            card.appendChild(title);
            card.appendChild(msg);
            card.appendChild(actions);
            overlay.appendChild(card);
            document.body.appendChild(overlay);
        });
    }

    async function waitForServerStop(timeoutSeconds = 60, intervalMs = 1000) {
        const attempts = Math.max(1, Math.ceil((timeoutSeconds * 1000) / intervalMs));
        for (let i = 0; i < attempts; i++) {
            try {
                const controller = new AbortController();
                const to = setTimeout(() => controller.abort(), Math.min(intervalMs, 2000));
                const resp = await fetch('/api/status', { signal: controller.signal });
                clearTimeout(to);
                if (!resp.ok) {
                    // server responded with error -> still up
                }
            } catch (e) {
                return true;
            }
            await waitMs(intervalMs);
        }
        return false;
    }

    function showServerShutdownPage() {
        try { if (window.refreshInterval) clearInterval(window.refreshInterval); } catch (e){}
        try { if (window.benchmarkPollInterval) clearInterval(window.benchmarkPollInterval); } catch (e){}
        try { if (typeof window.stopBenchmark === 'function') window.stopBenchmark(); } catch (e){}

        document.documentElement.style.height = '100%';
        document.body.style.margin = '0';
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:var(--bg-primary);color:var(--text-primary);font-family:Roboto,Segoe UI,Arial,sans-serif;">
                <div style="text-align:center;max-width:720px;padding:24px;">
                    <h1 style="font-size:34px;margin-bottom:12px;">Server Shutting Down</h1>
                    <p style="color:var(--text-secondary);margin-bottom:18px;">The server has accepted the shutdown request and is terminating. You can close this window or keep it open to see when the server stops responding.</p>
                    <p style="color:var(--text-secondary);margin-bottom:24px;">If you started this server in a terminal, it will stop shortly.</p>
                    <div style="display:flex;gap:8px;justify-content:center;">
                        <button onclick="location.reload()" style="padding:8px 14px;border-radius:6px;border:none;background:var(--accent-blue);color:#fff;cursor:pointer;">Refresh</button>
                        <button onclick="window.close()" style="padding:8px 14px;border-radius:6px;border:1px solid var(--border-color);background:transparent;color:var(--text-primary);cursor:pointer;">Close Window</button>
                    </div>
                </div>
            </div>
        `;
    }

    function showServerStoppedPage(serverStopped = true) {
        try {
            try { if (window.refreshInterval) clearInterval(window.refreshInterval); } catch (e) {}
            try { if (window.benchmarkPollInterval) clearInterval(window.benchmarkPollInterval); } catch (e) {}
            try { if (typeof window.stopBenchmark === 'function') window.stopBenchmark(); } catch (e) {}

            document.documentElement.style.height = '100%';
            document.body.style.margin = '0';
            document.body.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:var(--bg-primary);color:var(--text-primary);font-family:Roboto,Segoe UI,Arial,sans-serif;">
                    <div style="text-align:center;max-width:720px;padding:24px;">
                        <h1 style="font-size:48px;margin-bottom:12px;">Server Shut down</h1>
                        <p style="color:var(--text-secondary);font-size:18px;margin-bottom:18px;">${serverStopped ? 'It is now safe to close this window.' : 'Server appears unreachable. You can close this window or try refreshing later.'}</p>
                        <div style="display:flex;gap:8px;justify-content:center;">
                            <button onclick="location.reload()" style="padding:10px 16px;border-radius:6px;border:none;background:var(--accent-blue);color:#fff;cursor:pointer;">Refresh</button>
                            <button onclick="window.close()" style="padding:10px 16px;border-radius:6px;border:1px solid var(--border-color);background:transparent;color:var(--text-primary);cursor:pointer;">Close Window</button>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) { console.debug('showServerStoppedPage error', e); }
    }

    function showShutdownSequence() {
        try {
            try { if (window.refreshInterval) clearInterval(window.refreshInterval); } catch (e){}
            try { if (window.benchmarkPollInterval) clearInterval(window.benchmarkPollInterval); } catch (e){}
            try { if (typeof window.stopBenchmark === 'function') window.stopBenchmark(); } catch (e){}

            document.documentElement.style.height = '100%';
            document.body.style.margin = '0';
            document.body.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:var(--bg-primary);color:var(--text-primary);font-family:Roboto,Segoe UI,Arial,sans-serif;">
                    <div style="text-align:center;max-width:720px;padding:24px;">
                        <h1 style="font-size:32px;margin-bottom:12px;">Dashboard Closed</h1>
                        <p style="color:var(--text-secondary);margin-bottom:18px;">The web dashboard has been closed in this browser tab. You can safely close this tab or navigate away.</p>
                        <div style="display:flex;gap:8px;justify-content:center;">
                            <button onclick="location.reload()" style="padding:8px 14px;border-radius:6px;border:none;background:var(--accent-blue);color:#fff;cursor:pointer;">Reopen Dashboard</button>
                            <button onclick="window.close()" style="padding:8px 14px;border-radius:6px;border:1px solid var(--border-color);background:transparent;color:var(--text-primary);cursor:pointer;">Close Window</button>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            console.debug('showShutdownSequence failed', e);
        }
    }

    async function shutdownServer() {
        try {
            const ok = await showConfirmShutdownDialog();
            if (!ok) return;
            const btn = document.getElementById('shutdown-btn');
            if (btn) { btn.disabled = true; btn.textContent = 'Shutting down...'; }

            const modal = createShutdownModal('Sending shutdown request...');
            try {
                const res = await fetch('/api/shutdown', { method: 'POST' });
                if (!res.ok) {
                    const txt = await res.text().catch(() => res.statusText || 'Error');
                    modal.setText('Shutdown failed: ' + txt);
                    if (typeof window.showError === 'function') window.showError('Shutdown failed: ' + txt);
                    if (btn) { btn.disabled = false; btn.textContent = 'Exit'; }
                    setTimeout(() => modal.remove(), 4000);
                    return;
                }

                modal.setText('Server is shutting down...');
                try { await waitMs(600); } catch (e) {}
                try { modal.remove(); } catch (e) {}

                try { showServerShutdownPage(); } catch (e) { console.debug('showServerShutdownPage error', e); }
                const stopped = await waitForServerStop(60, 1000);
                if (stopped) {
                    showServerStoppedPage(true);
                } else {
                    showServerStoppedPage(false);
                }
                return;
            } catch (postErr) {
                try { modal.setText('No response from server — waiting for shutdown...'); } catch (e) {}
                const stopped = await waitForServerStop(60, 1000);
                try { modal.remove(); } catch (e) {}
                if (stopped) {
                    showServerStoppedPage(true);
                } else {
                    showServerStoppedPage(false);
                    if (btn) { btn.disabled = false; btn.textContent = 'Exit'; }
                }
                return;
            }
        } catch (e) {
            if (typeof window.showError === 'function') window.showError('Error sending shutdown: ' + (e && e.message ? e.message : e));
            const btn = document.getElementById('shutdown-btn');
            if (btn) { btn.disabled = false; btn.textContent = 'Exit'; }
        }
    }

    // Expose to global scope
    window.shutdownServer = shutdownServer;
    window.createShutdownModal = createShutdownModal;
    window.showConfirmShutdownDialog = showConfirmShutdownDialog;
    window.showServerShutdownPage = showServerShutdownPage;
    window.waitForServerStop = waitForServerStop;
    window.showServerStoppedPage = showServerStoppedPage;
    window.showShutdownSequence = showShutdownSequence;
})();
