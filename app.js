const API_URL = "https://script.google.com/macros/s/AKfycbzIG5gEXEfMeOiwJUd7SGROqcVWktQnsvQJFgW5HKBE5lXeH1hR6S1fIrCw1xpmLyl-rA/exec";

/* ========================================== */
/* 1. MESIN VIRTUAL KEYBOARD (ENTERPRISE OSK) */
/* ========================================== */
const osKeyboard = {
    targetElement: null, mode: 'numeric', isOpen: false,
    layouts: {
        numeric: [ 
            ['1', '2', '3'], 
            ['4', '5', '6'], 
            ['7', '8', '9'], 
            ['C', '0', '000'] 
        ],
        text: [ 
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], 
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], 
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
        ]
    },
    open: function(elOrId, type = 'text') {
        this.targetElement = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
        if (!this.targetElement) return;
        if (this.targetElement.id) {
            this.targetElement = document.getElementById(this.targetElement.id);
        }
        setTimeout(() => {
            try { this.targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(e){}
        }, 300);
        this.mode = type; this.isOpen = true; this.render();
        const vk = document.getElementById('virtual-keyboard'); 
        const ov = document.getElementById('virtual-keyboard-overlay');
        if (vk) { vk.classList.remove('hidden'); setTimeout(() => vk.classList.remove('translate-y-full'), 10); }
        if (ov) { ov.classList.remove('hidden'); }
    },
    close: function() {
        this.isOpen = false; 
        const vk = document.getElementById('virtual-keyboard'); 
        const ov = document.getElementById('virtual-keyboard-overlay');
        if (vk) { vk.classList.add('translate-y-full'); setTimeout(() => vk.classList.add('hidden'), 300); }
        if (ov) { ov.classList.add('hidden'); }
        this.targetElement = null;
    },
    updatePreview: function() {
        const preview = document.getElementById('vk-live-preview');
        if (preview && this.targetElement) {
            let val = this.targetElement.value;
            preview.innerHTML = val === '' ? '<span class="animate-pulse text-slate-500">_</span>' : val;
        }
    },
    render: function() {
        const container = document.getElementById('vk-keys'); 
        if (!container) return;
        let html = ''; 
        let rows = this.layouts[this.mode];
        let maxWidth = this.mode === 'numeric' ? 'max-w-sm' : 'max-w-3xl';
        html += `<div class="w-full ${maxWidth} mx-auto flex flex-col gap-1.5 sm:gap-2">`;
        let currentVal = this.targetElement ? this.targetElement.value : '';
        let placeholderTxt = this.targetElement ? (this.targetElement.placeholder || 'Ketik di sini...') : 'Ketik di sini...';
        let label = placeholderTxt;
        if (this.targetElement && this.targetElement.previousElementSibling) {
            label = this.targetElement.previousElementSibling.innerText || placeholderTxt;
        }
        html += `
        <div class="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 sm:p-4 mb-1 shadow-inner relative flex flex-col justify-end min-h-[70px]">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest absolute top-2 left-3 truncate w-5/6">${label}</span>
            <div id="vk-live-preview" class="text-xl sm:text-2xl font-mono font-black text-emerald-400 text-right w-full overflow-hidden truncate mt-3">
                ${currentVal || '<span class="animate-pulse text-slate-500">_</span>'}
            </div>
        </div>`;
        rows.forEach(row => {
            let rowGap = this.mode === 'numeric' ? 'gap-2' : 'gap-1 sm:gap-1.5';
            html += `<div class="flex justify-center ${rowGap} w-full">`;
            row.forEach(key => {
                let baseClass = "flex items-center justify-center font-bold rounded-lg sm:rounded-xl shadow-[0_3px_0_rgba(203,213,225,1)] border border-slate-200 active:shadow-none active:translate-y-[3px] transition-all select-none touch-manipulation";
                let sizeClass = this.mode === 'numeric' 
                    ? "flex-1 py-4 sm:py-5 text-2xl bg-white text-slate-800" 
                    : "flex-1 py-3 sm:py-4 text-sm sm:text-lg bg-white text-slate-800";
                if (key === 'C') {
                    sizeClass = this.mode === 'numeric'
                        ? "flex-1 py-4 sm:py-5 text-2xl bg-rose-50 text-rose-500 border-rose-200 shadow-[0_3px_0_rgba(254,205,211,1)]"
                        : "flex-1 py-3 sm:py-4 text-sm sm:text-lg bg-rose-50 text-rose-500 border-rose-200 shadow-[0_3px_0_rgba(254,205,211,1)]";
                    html += `<button type="button" class="${baseClass} ${sizeClass}" onclick="osKeyboard.clear()">${key}</button>`;
                } else {
                    html += `<button type="button" class="${baseClass} ${sizeClass}" onclick="osKeyboard.insert('${key}')">${key}</button>`;
                }
            });
            html += `</div>`;
        });
        if (this.mode === 'text') {
            html += `<div class="flex justify-center gap-1 sm:gap-1.5 w-full mt-0.5">
                <button type="button" class="flex-[1.5] py-3 bg-slate-200 text-slate-600 font-bold rounded-xl shadow-[0_3px_0_rgba(156,163,175,1)] active:shadow-none active:translate-y-[3px] transition-all flex items-center justify-center select-none" onclick="osKeyboard.backspace()">
                    <i class="fas fa-delete-left text-lg"></i>
                </button>
                <button type="button" class="flex-[5] py-3 bg-white text-slate-800 font-bold rounded-xl shadow-[0_3px_0_rgba(203,213,225,1)] border border-slate-200 active:shadow-none active:translate-y-[3px] transition-all select-none tracking-widest text-xs sm:text-sm" onclick="osKeyboard.insert(' ')">
                    SPASI
                </button>
                <button type="button" class="flex-[2] py-3 bg-brand-500 text-white font-bold rounded-xl shadow-[0_3px_0_rgba(194,65,12,1)] active:shadow-none active:translate-y-[3px] transition-all flex items-center justify-center gap-1 select-none" onclick="osKeyboard.close()">
                    <i class="fas fa-check"></i> OK
                </button>
            </div>`;
        } else {
            html += `<div class="flex justify-center gap-2 w-full mt-1">
                <button type="button" class="flex-1 py-4 sm:py-5 bg-slate-200 text-slate-700 font-bold rounded-xl shadow-[0_3px_0_rgba(156,163,175,1)] active:shadow-none active:translate-y-[3px] transition-all text-xl flex items-center justify-center select-none" onclick="osKeyboard.backspace()">
                    <i class="fas fa-delete-left"></i>
                </button>
                <button type="button" class="flex-[2] py-4 sm:py-5 bg-brand-500 text-white font-black rounded-xl shadow-[0_3px_0_rgba(194,65,12,1)] active:shadow-none active:translate-y-[3px] transition-all text-xl flex items-center justify-center gap-2 select-none" onclick="osKeyboard.close()">
                    <i class="fas fa-check-circle"></i> SELESAI
                </button>
            </div>`;
        }
        html += `</div>`;
        container.innerHTML = html;
    },
    insert: function(char) { 
        if (!this.targetElement) return; 
        if (this.targetElement.value === '0' && char !== '.') {
            this.targetElement.value = '';
        }
        this.targetElement.value += char; 
        this.targetElement.dispatchEvent(new Event('input', { bubbles: true })); 
        setTimeout(() => this.updatePreview(), 10);
    },
    backspace: function() { 
        if (!this.targetElement) return; 
        this.targetElement.value = this.targetElement.value.slice(0, -1); 
        this.targetElement.dispatchEvent(new Event('input', { bubbles: true })); 
        setTimeout(() => this.updatePreview(), 10);
    },
    clear: function() { 
        if (!this.targetElement) return; 
        this.targetElement.value = ''; 
        this.targetElement.dispatchEvent(new Event('input', { bubbles: true })); 
        setTimeout(() => this.updatePreview(), 10);
    }
};

/* ========================================== */
/* 2. MESIN UTAMA APLIKASI (SUPERAPP)         */
/* ========================================== */
const superApp = {
    outlet: '', cart: [], printerChar: null, db: null, filteredProducts: [],
    payTotal: 0, payCash: 0, payChange: 0, payMethod: 'Tunai', activeShiftId: null, activeStaffTeam: [],
    activeReprintTrx: null, currentUser: null, pinBuffer: '', ADMIN_PIN: '1234',
    offlineQueue: [], isOnline: navigator.onLine, cfdWindow: null, profitChart: null, isLoadingData: false, printerCharacteristic: null, printerDevice: null, isBluetoothSearching: false, isProcessing: false,
    cfdFocusHandlerAdded: false, cfdSuccessTimeout: null,

    // FORMATTER & PARSER
    formatRupiahInput: function(el) { let val = el.value.replace(/[^0-9]/g, ''); el.value = val !== '' ? parseInt(val, 10).toLocaleString('id-ID') : ''; },
    getNumericValue: function(val) { return parseInt(String(val).replace(/[^0-9]/g, ''), 10) || 0; },
    cleanDateOnly: function(str) {
        if (!str) return ''; 
        let s = String(str).trim();
        if ((s.includes('T') && (s.includes('Z') || s.includes('+'))) || s.includes('GMT')) { 
            let d = new Date(s); 
            if (!isNaN(d.getTime())) { 
                let pad = n => n < 10 ? '0' + n : n; 
                return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; 
            } 
        }
        let match = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (match) { 
            let pad = n => String(n).length < 2 ? '0' + n : n; 
            return `${pad(match[1])}/${pad(match[2])}/${match[3]}`; 
        }
        return s.split(' ')[0];
    },
    cleanTimeOnly: function(str) {
        if (!str) return '00.00.00'; 
        let s = String(str).trim();
        if ((s.includes('T') && (s.includes('Z') || s.includes('+'))) || s.includes('GMT')) { 
            let d = new Date(s); 
            if (!isNaN(d.getTime())) { 
                let pad = n => n < 10 ? '0' + n : n; 
                return `${pad(d.getHours())}.${pad(d.getMinutes())}.${pad(d.getSeconds())}`; 
            } 
        }
        if (!isNaN(Number(s)) && Number(s) > 0 && Number(s) < 1) {
            let totalSec = Math.floor(Number(s) * 86400);
            let h = Math.floor(totalSec / 3600);
            let m = Math.floor((totalSec % 3600) / 60);
            let sec = totalSec % 60;
            let pad = n => n < 10 ? '0' + n : n;
            return `${pad(h)}.${pad(m)}.${pad(sec)}`;
        }
        let match = s.match(/(\d{1,2})[.:](\d{1,2})[.:](\d{1,2})/);
        if (match) { 
            let pad = n => String(n).length < 2 ? '0' + n : n; 
            return `${pad(match[1])}.${pad(match[2])}.${pad(match[3])}`; 
        }
        let parts = s.split(' '); 
        return parts.length > 1 ? parts[1] : s;
    },
    parseDateId: function(dateStr) {
        if (!dateStr) return new Date(0); let s = String(dateStr); let match = s.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (match) { let p1 = parseInt(match[1]); let p2 = parseInt(match[2]); let y = parseInt(match[3]); let d = p1, m = p2; if (p2 > 12) { m = p1; d = p2; } return new Date(y, m - 1, d, 0, 0, 0, 0); }
        if (s.includes('T')) { let d = new Date(s); if (!isNaN(d.getTime())) { d.setHours(0, 0, 0, 0); return d; } }
        let fPart = s.split(' ')[0]; let d2 = new Date(fPart); if (!isNaN(d2.getTime())) { d2.setHours(0, 0, 0, 0); return d2; }
        return new Date(0);
    },

    pullBackgroundData: async function() {
        console.log("Memulai sinkronisasi seluruh riwayat data di latar belakang...");
        try {
            const res = await fetch(API_URL + "?ts=" + new Date().getTime() + "&history=all", { redirect: 'follow' });
            const data = await res.json();
            if (data && data.status === 'sukses') {
                this.db = data;
                localStorage.setItem('aisnack_db_cache', JSON.stringify(data));
                if (typeof this.updatePendingNotifications === 'function') this.updatePendingNotifications();
            }
        } catch (e) {
            console.log("Sinkronisasi latar belakang gagal, akan dicoba otomatis nanti.", e);
        }
    },

    pullFreshData: async function(silent = false) {
        if (this.isProcessing && !silent) return; 
        if (!silent) this.setLoading(true, "Menyinkronkan Seluruh Database...");
        this.isProcessing = true; 
        try {
            const res = await fetch(API_URL + "?ts=" + new Date().getTime() + "&history=all", { redirect: 'follow' }); 
            const data = await res.json();
            if (data && data.status === 'sukses') { 
                let serverVersion = (data.pengaturan || []).find(x => x.Pengaturan === 'Versi_Aplikasi');
                if (serverVersion) {
                    let localVersion = localStorage.getItem('app_version');
                    if (!localVersion) {
                        localStorage.setItem('app_version', serverVersion.Nilai);
                    } else if (localVersion !== serverVersion.Nilai) {
                        localStorage.setItem('app_version', serverVersion.Nilai);
                        if ('serviceWorker' in navigator) {
                            const regs = await navigator.serviceWorker.getRegistrations();
                            for(let reg of regs) { reg.update(); }
                        }
                        window.location.reload(true);
                        return; 
                    }
                }
                this.db = data; 
                localStorage.setItem('aisnack_db_cache', JSON.stringify(data));

                let configs = [
                    { key: 'Logo_Aplikasi', storage: 'app_logo_url', callback: (val) => typeof this.updateAppLogos === 'function' && this.updateAppLogos(val) },
                    { key: 'Promo_Standby', storage: 'cfd_promo_standby' },
                    { key: 'Promo_Transaksi', storage: 'cfd_promo_transaksi' },
                    { key: 'aisnack_receipt_template', storage: 'aisnack_receipt_template' }
                ];

                configs.forEach(c => {
                    let item = (this.db.pengaturan || []).find(x => x.Pengaturan === c.key);
                    if (item && item.Nilai) {
                        localStorage.setItem(c.storage, item.Nilai);
                        if (c.callback) c.callback(item.Nilai);
                    }
                });
                if (this.cart.length === 0) this.refreshData(); 
                if (!silent) this.showToast("Seluruh database berhasil disinkronkan!"); 
            } else {
                throw new Error("Data tidak valid");
            }
        } catch (e) { 
            console.error("Fetch Error:", e);
            if (!silent) this.showToast("Gagal menarik data. Cek koneksi Anda.", "error"); 
        } finally {
            this.isProcessing = false;
            if (!silent) this.setLoading(false);
        }
    },

    getEmptyState: function(icon, title, desc) { return `<div class="flex flex-col items-center justify-center h-full p-8 text-center opacity-70"><div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl text-slate-300 mb-4 mx-auto"><i class="fas ${icon}"></i></div><h4 class="font-black text-slate-600 text-lg mb-1">${title}</h4><p class="text-xs font-bold text-slate-400">${desc}</p></div>`; },
    showToast: function(msg, type = 'success') {
        const container = document.getElementById('toast-container'); if (!container) return;
        const icon = type === 'success' ? '<i class="fas fa-check-circle text-green-500 text-xl"></i>' : (type === 'warning' ? '<i class="fas fa-cloud-arrow-up text-orange-500 text-xl"></i>' : '<i class="fas fa-exclamation-circle text-red-500 text-xl"></i>');
        const t = document.createElement('div'); t.className = `bg-white p-4 rounded-2xl shadow-2xl shadow-slate-200 flex items-center gap-3 toast-animate z-[999] pointer-events-auto`;
        t.innerHTML = `${icon}<p class="font-bold text-sm text-slate-800">${msg}</p>`;
        container.appendChild(t); setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000); this.syncStorage();
    },
    toggleSidebar: function() { const sb = document.getElementById('sidebar'); const ov = document.getElementById('mobile-overlay'); if (sb && ov) { sb.classList.toggle('-translate-x-full'); ov.classList.toggle('hidden'); } },
    setLoading: function(show, text = "Memproses...") { 
        const loader = document.getElementById('app-loader'); const lText = document.getElementById('loader-text'); this.isProcessing = show;
        if (loader && lText) { lText.innerText = text; if (show) { loader.classList.remove('hidden'); loader.classList.add('flex'); } else { loader.classList.add('hidden'); loader.classList.remove('flex'); } }
    },
    openModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            const content = modal.querySelector('.modal-enter');
            if (content) {
                content.style.opacity = '0';
                content.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    content.style.transition = 'all 0.3s ease-out';
                    content.style.opacity = '1';
                    content.style.transform = 'scale(1)';
                }, 10);
            }
            if (modalId === 'modal-system-settings' && typeof this.loadStrukSettings === 'function') {
                this.loadStrukSettings();
            }
        }
    },
    closeModal: function(id) { 
        const modal = document.getElementById(id); 
        const content = document.getElementById(id + '-content'); 
        if (modal) { 
            if (content) {
                content.classList.remove('modal-enter-active'); 
                setTimeout(() => modal.classList.add('hidden'), 300); 
            } else {
                modal.classList.add('hidden'); 
            }
        } 
    },

    showMenuGuide: function(type) {
        let title = ''; let icon = ''; let color = ''; let content = '';
        if (type === 'terima') {
            title = 'TERIMA BARANG MASUK'; icon = 'fa-truck-loading'; color = 'text-emerald-500 bg-emerald-50 border-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
            content = `<div class="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-xl text-xs font-black mb-4 flex gap-2 items-center"><i class="fas fa-exclamation-triangle text-lg animate-pulse"></i><span>JANGAN TERTUKAR DENGAN OPNAME!</span></div><p class="text-sm font-bold text-slate-700 mb-2">Gunakan menu ini <span class="text-emerald-600 font-black">HANYA KETIKA</span>:</p><ul class="list-disc pl-5 text-sm space-y-1.5 text-slate-600 font-medium mb-4"><li>Ada <b>pengiriman bahan baku/barang baru</b> dari Gudang Pusat.</li><li>Kurir datang membawa fisik barang ke toko.</li></ul><div class="bg-slate-100 p-3 rounded-xl border border-slate-200"><p class="text-xs text-slate-500"><span class="font-black text-slate-700">Efek:</span> Angka yang diketik akan <b class="text-emerald-600">MENAMBAH</b> stok barang di komputer secara otomatis.</p></div>`;
        } else if (type === 'opname') {
            title = 'OPNAME FISIK (AUDIT)'; icon = 'fa-clipboard-check'; color = 'text-purple-500 bg-purple-50 border-purple-100 shadow-[0_0_20px_rgba(168,85,247,0.4)]';
            content = `<div class="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-xl text-xs font-black mb-4 flex gap-2 items-center"><i class="fas fa-exclamation-triangle text-lg animate-pulse"></i><span>JANGAN TERTUKAR DGN TERIMA BARANG!</span></div><p class="text-sm font-bold text-slate-700 mb-2">Gunakan menu ini <span class="text-purple-600 font-black">HANYA KETIKA</span>:</p><ul class="list-disc pl-5 text-sm space-y-1.5 text-slate-600 font-medium mb-4"><li>Anda sedang <b>menghitung sisa stok asli</b> di laci, etalase, atau kulkas.</li><li>Ingin mencocokkan apakah data di komputer sama dengan aslinya.</li></ul><div class="bg-slate-100 p-3 rounded-xl border border-slate-200"><p class="text-xs text-slate-500"><span class="font-black text-slate-700">Cara Isi:</span> Ketik angka <b>SISA FISIK YANG ADA</b>. Sistem akan otomatis menghitung selisih hilang/lebihnya.</p></div>`;
        } else { return; }
        const modal = document.getElementById('modal-menu-guide');
        if (modal) {
            document.getElementById('guide-icon-container').className = `w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-[6px] ${color}`;
            document.getElementById('guide-icon').className = `fas ${icon}`;
            document.getElementById('guide-title').innerText = title;
            document.getElementById('guide-content-body').innerHTML = content;
            this.openModal('modal-menu-guide');
        }
    },

    toggleDarkMode: function() { 
        document.documentElement.classList.toggle('dark'); 
        let ic = document.getElementById('dark-icon'); 
        if (ic) { 
            if (document.documentElement.classList.contains('dark')) { 
                ic.classList.replace('fa-moon', 'fa-sun'); ic.classList.replace('text-slate-600', 'text-yellow-400'); 
            } else { 
                ic.classList.replace('fa-sun', 'fa-moon'); ic.classList.replace('text-yellow-400', 'text-slate-600'); 
            } 
        }
    },

    apiPost: async function(payload) {
        if (!this.isOnline) { this.offlineQueue.push(payload); localStorage.setItem('aisnack_offline_queue', JSON.stringify(this.offlineQueue)); this.updateNetworkUI(); return { status: 'sukses', is_offline: true, trx_id: payload.trx_id || payload.id_shift }; }
        try { const res = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); return await res.json(); } 
        catch (e) { this.offlineQueue.push(payload); localStorage.setItem('aisnack_offline_queue', JSON.stringify(this.offlineQueue)); this.updateNetworkUI(); return { status: 'sukses', is_offline: true, trx_id: payload.trx_id || payload.id_shift }; }
    },

    openSyncCenter: function() {
        this.renderSyncQueue();
        this.openModal('modal-sync-center');
    },

    renderSyncQueue: function() {
        const listEl = document.getElementById('sync-queue-list');
        if (!listEl) return;
        let rawData = localStorage.getItem('aisnack_offline_queue');
        let offlineData = [];
        try { offlineData = JSON.parse(rawData || '[]'); if (!Array.isArray(offlineData)) offlineData = [offlineData]; } catch(e) { offlineData = []; }
        let totalQueue = offlineData.length;
        if (totalQueue === 0) {
            listEl.innerHTML = `<div class="text-center py-8"><div class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner"><i class="fas fa-check-double"></i></div><h4 class="font-extrabold text-slate-800 text-lg">Semua Data Tersinkronisasi</h4><p class="text-xs text-slate-500 mt-2 font-medium">Tidak ada antrean data lokal. Sistem dalam keadaan up-to-date dengan server.</p></div>`;
            const btnSync = document.getElementById('btn-trigger-sync'); if(btnSync) btnSync.style.display = 'none';
            return;
        }
        const btnSync = document.getElementById('btn-trigger-sync'); if(btnSync) btnSync.style.display = 'flex';
        let cTrx = 0; let cTerima = 0; let cOpname = 0; let cKas = 0; let cLain = 0;
        offlineData.forEach(item => {
            let obj = item; if (typeof item === 'string') { try { obj = JSON.parse(item); } catch(e) {} }
            let act = String(obj.action || obj.jenis || obj.type || '').toLowerCase();
            if (act.includes('checkout') || act.includes('pos')) cTrx++;
            else if (act.includes('terima') || act.includes('masuk')) cTerima++;
            else if (act.includes('opname') || act.includes('audit')) cOpname++;
            else if (act.includes('kas') || act.includes('keluar')) cKas++;
            else cLain++;
        });
        const createCard = (title, icon, count, colorClass, barColor, id) => {
            if (count === 0) return '';
            return `<div class="bg-white border border-slate-200 rounded-[1.25rem] p-4 shadow-sm relative overflow-hidden group mb-3"><div class="flex justify-between items-center mb-3"><div class="flex items-center gap-3"><div class="w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center text-lg"><i class="fas ${icon}"></i></div><h4 class="font-extrabold text-slate-700 text-sm">${title}</h4></div><span class="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200" id="badge-${id}">${count} Tertunda</span></div><div class="w-full bg-slate-100 rounded-full h-2.5 mb-1 overflow-hidden shadow-inner"><div id="bar-${id}" class="${barColor} h-2.5 rounded-full w-0 transition-all duration-500 relative"><div class="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div></div></div><div class="flex justify-between items-center mt-1.5"><span class="text-[10px] font-bold text-slate-400" id="status-${id}">Menunggu sinkronisasi...</span><span class="text-[10px] font-black text-slate-600" id="pct-${id}">0%</span></div></div>`;
        };
        let html = '';
        html += createCard('Transaksi POS', 'fa-cash-register', cTrx, 'bg-brand-50 text-brand-500', 'bg-brand-500', 'trx');
        html += createCard('Penerimaan Barang', 'fa-dolly', cTerima, 'bg-emerald-50 text-emerald-500', 'bg-emerald-500', 'terima');
        html += createCard('Opname Fisik', 'fa-clipboard-check', cOpname, 'bg-purple-50 text-purple-500', 'bg-purple-500', 'opname');
        html += createCard('Kas Keluar', 'fa-money-bill-transfer', cKas, 'bg-rose-50 text-rose-500', 'bg-rose-500', 'kas');
        html += createCard('Data Lainnya', 'fa-database', cLain, 'bg-slate-100 text-slate-600', 'bg-slate-600', 'lain');
        if (html === '') { html = createCard('Antrean Sistem', 'fa-server', totalQueue, 'bg-indigo-50 text-indigo-500', 'bg-indigo-500', 'sistem'); }
        listEl.innerHTML = html;
    },

    executeVisualSync: function() {
        const btn = document.getElementById('btn-trigger-sync');
        if(btn) { btn.innerHTML = `<i class="fas fa-spinner fa-spin text-lg text-emerald-400"></i> Menyinkronkan...`; btn.classList.add('opacity-80', 'cursor-not-allowed'); }
        const syncIcon = document.getElementById('sync-center-icon');
        if(syncIcon) syncIcon.classList.add('fa-spin');
        const animateBar = (id) => {
            let bar = document.getElementById(`bar-${id}`); let pct = document.getElementById(`pct-${id}`); let sts = document.getElementById(`status-${id}`); let badge = document.getElementById(`badge-${id}`);
            if(!bar) return;
            sts.innerText = "Mengirim data..."; sts.classList.add('text-brand-500');
            let progress = 0;
            let interval = setInterval(() => {
                progress += Math.floor(Math.random() * 20) + 5; 
                if (progress >= 100) {
                    progress = 100; clearInterval(interval); sts.innerText = "Berhasil"; sts.classList.replace('text-brand-500', 'text-emerald-500'); badge.innerText = "Selesai"; badge.classList.replace('bg-slate-100', 'bg-emerald-100'); badge.classList.replace('text-slate-600', 'text-emerald-700');
                }
                bar.style.width = `${progress}%`; pct.innerText = `${progress}%`;
            }, 300);
        };
        animateBar('trx'); animateBar('terima'); animateBar('opname'); animateBar('kas');
        if(typeof this.syncOfflineQueue === 'function') { this.syncOfflineQueue(); }
        setTimeout(() => {
            if(btn) { btn.innerHTML = `<i class="fas fa-cloud-arrow-up text-lg text-emerald-400"></i> Mulai Sinkronisasi`; btn.classList.remove('opacity-80', 'cursor-not-allowed'); }
            if(syncIcon) syncIcon.classList.remove('fa-spin');
            this.showToast('Semua data berhasil disinkronkan', 'success'); this.closeModal('modal-sync-center'); this.renderSyncQueue();
        }, 2500); 
    },
    
    syncOfflineQueue: async function() {
        if (!this.isOnline || this.offlineQueue.length === 0) return;
        this.showToast("Menyinkronkan data offline...", "warning"); let failedQueue = [];
        for (let i = 0; i < this.offlineQueue.length; i++) { try { await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(this.offlineQueue[i]) }); } catch (e) { failedQueue.push(this.offlineQueue[i]); } }
        this.offlineQueue = failedQueue; localStorage.setItem('aisnack_offline_queue', JSON.stringify(this.offlineQueue));
        if (this.offlineQueue.length === 0) { this.showToast("Tersinkronisasi!"); try { const res = await fetch(API_URL + "?ts=" + new Date().getTime(), { redirect: 'follow' }); this.db = await res.json(); this.refreshData(); } catch (e) {} }
        this.updateNetworkUI();
    },

    updateNetworkUI: function() {
        const ind = document.getElementById('network-indicator'); const dot = document.getElementById('net-dot'); const txt = document.getElementById('net-text'); if (!ind || !dot || !txt) return;
        if (this.isOnline) {
            if (this.offlineQueue.length > 0) { ind.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 cursor-pointer transition'; dot.className = 'w-2 h-2 rounded-full bg-orange-500 animate-pulse'; txt.className = 'text-[10px] font-bold text-orange-600 hidden md:inline'; txt.innerText = `Menyinkron ${this.offlineQueue.length} data...`; } 
            else { ind.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 transition'; dot.className = 'w-2 h-2 rounded-full bg-green-500'; txt.className = 'text-[10px] font-bold text-green-600 hidden md:inline'; txt.innerText = 'Online & Sinkron'; }
        } else { ind.className = 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 transition'; dot.className = 'w-2 h-2 rounded-full bg-red-500'; txt.className = 'text-[10px] font-bold text-red-600 hidden md:inline'; txt.innerText = `Offline (${this.offlineQueue.length} Pending)`; }
    },

    openCFD: async function(isAutoRestore = false) {
        localStorage.setItem('cfd_wants_open', 'true');
        try { 
            if ('getScreenDetails' in window) { 
                const screens = await window.getScreenDetails(); 
                const extScreen = screens.screens.find(s => s !== screens.currentScreen); 
                if (extScreen) { this.cfdWindow = window.open(window.location.href + '?mode=cfd', 'CFD_WINDOW_AISNACK', `left=${extScreen.availLeft},top=${extScreen.availTop},width=${extScreen.availWidth},height=${extScreen.availHeight},fullscreen=yes`); return; } 
            } 
        } catch (e) {}
        if (!this.cfdWindow || this.cfdWindow.closed) { this.cfdWindow = window.open(window.location.href + '?mode=cfd', 'CFD_WINDOW_AISNACK', `left=${window.screen.width},top=0,width=1024,height=768`); }
        if (this.cfdWindow) {
            this.cfdWindow.focus();
            if (!this.cfdFocusHandlerAdded) {
                window.addEventListener('focus', () => { if (this.cfdWindow && !this.cfdWindow.closed && localStorage.getItem('cfd_wants_open') === 'true') { this.syncStorage(); } });
                this.cfdFocusHandlerAdded = true;
            }
        }
    },

    changePromoImage: function(type) {
        let fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'image/*'; 
        fileInput.onchange = (event) => {
            const file = event.target.files[0]; if (!file || this.isProcessing) return; 
            let loadingText = type === 'standby' ? "Mengunggah Promo Standby..." : "Mengunggah Promo Transaksi...";
            this.setLoading(true, loadingText);
            const reader = new FileReader();
            reader.onload = (e) => {
                this.apiPost({ action: 'update_promo_dual', promoType: type, base64: e.target.result, fileName: file.name, mimeType: file.type }).then(res => { 
                    if (res.status === 'sukses') { 
                        const storageKey = type === 'standby' ? 'cfd_promo_standby' : 'cfd_promo_transaksi';
                        localStorage.setItem(storageKey, res.url); this.syncStorage(); this.setLoading(false); this.showToast(`Promo ${type.toUpperCase()} Berhasil Diperbarui!`); 
                    } else {
                        this.setLoading(false); this.showToast("Gagal upload: " + res.pesan, "error");
                    }
                }).catch(() => { this.setLoading(false); this.showToast("Koneksi bermasalah", "error"); });
            }; reader.readAsDataURL(file);
        }; fileInput.click();
    },

    updateAppLogos: function(url) {
        if (!url) return;
        document.querySelectorAll('.app-logo-img').forEach(img => { img.src = url; });
    },

    changeAppLogo: function() {
        let fileInput = document.createElement('input'); fileInput.type = 'file'; fileInput.accept = 'image/*';
        fileInput.onchange = (event) => {
            const file = event.target.files[0]; if (!file || this.isProcessing) return;
            this.setLoading(true, "Mengunggah Logo Baru ke Google Drive...");
            const reader = new FileReader();
            reader.onload = (e) => {
                this.apiPost({ action: 'update_logo_drive', base64: e.target.result, fileName: file.name, mimeType: file.type }).then(res => {
                    if (res.status === 'sukses') {
                        localStorage.setItem('app_logo_url', res.url); this.updateAppLogos(res.url); this.syncStorage(); this.setLoading(false); this.showToast("Logo Aplikasi Berhasil Diperbarui Secara Global!");
                    } else {
                        this.setLoading(false); this.showToast("Gagal menyimpan logo: " + res.pesan, "error");
                    }
                }).catch(() => { this.setLoading(false); this.showToast("Koneksi internet bermasalah saat upload", "error"); });
            }; reader.readAsDataURL(file);
        }; fileInput.click();
    },
    
    syncStorage: function(status = 'ordering', antrian = null) {
        if (new URLSearchParams(window.location.search).get('mode') === 'cfd') return;
        if (status === 'paid') {
            this._lastPaidTotal = this.payTotal;
            this._lastPaidChange = this.payChange;
        }
        let sentTotal = status === 'paid' ? this._lastPaidTotal : this.payTotal;
        let sentChange = status === 'paid' ? this._lastPaidChange : this.payChange;
        localStorage.setItem('ai_snack_cfd', JSON.stringify({ 
            outlet: this.outlet || 'Ai-Snack', items: this.cart, total: sentTotal, kembali: sentChange, status: status, antrian: antrian, timestamp: new Date().getTime(), promoStandbyUrl: localStorage.getItem('cfd_promo_standby'), promoScreenUrl: localStorage.getItem('cfd_promo_transaksi')
        }));
    },
    
    initCFD: function() {
        document.getElementById('login-screen').classList.add('hidden'); document.getElementById('sidebar').classList.add('hidden'); document.getElementById('main-app').classList.add('hidden');
        const cfdScreen = document.getElementById('cfd-screen'); if (cfdScreen) cfdScreen.classList.remove('hidden');
        window.addEventListener('storage', (e) => { 
            if (e.key === 'ai_snack_cfd' || e.key === 'cfd_promo_standby' || e.key === 'cfd_promo_transaksi' || e.key === 'app_logo_url') { 
                let data = JSON.parse(localStorage.getItem('ai_snack_cfd') || '{}'); if (data.outlet) this.renderCFD(data); 
                let newLogo = localStorage.getItem('app_logo_url'); if (newLogo) this.updateAppLogos(newLogo);
            } 
        });
        let initialData = localStorage.getItem('ai_snack_cfd'); if (initialData) this.renderCFD(JSON.parse(initialData));
        let bgStandby = localStorage.getItem('cfd_promo_standby'); let bgScreen = localStorage.getItem('cfd_promo_transaksi'); 
        if (bgStandby) { const bg1 = document.getElementById('cfd-bg-standby'); if (bg1) bg1.style.backgroundImage = `url('${bgStandby}')`; }
        if (bgScreen) { const bg2 = document.getElementById('cfd-bg-screen'); if (bg2) bg2.style.backgroundImage = `url('${bgScreen}')`; }
        let savedLogo = localStorage.getItem('app_logo_url'); if (savedLogo) { this.updateAppLogos(savedLogo); }
    },
    
    renderCFD: function(data) {
        const outNameEl = document.getElementById('cfd-outlet-name'); if (outNameEl) outNameEl.innerText = `Cabang ${data.outlet}`;
        if (data.promoStandbyUrl) { const bg1 = document.getElementById('cfd-bg-standby'); if (bg1) bg1.style.backgroundImage = `url('${data.promoStandbyUrl}')`; }
        if (data.promoScreenUrl) { const bg2 = document.getElementById('cfd-bg-screen'); if (bg2) bg2.style.backgroundImage = `url('${data.promoScreenUrl}')`; }
        const cfdStandby = document.getElementById('cfd-standby'); const cfdSuccess = document.getElementById('cfd-success');
        if (data.status === 'paid') { 
            cfdSuccess.classList.remove('hidden'); cfdStandby.classList.add('opacity-0', 'pointer-events-none'); 
            let kembalianAman = Number(data.kembali || 0).toLocaleString('id-ID');
            document.getElementById('cfd-kembali').innerHTML = `Rp ${kembalianAman}<br><span class="text-white text-4xl sm:text-5xl mt-6 block drop-shadow-md">NOMOR ANTRIAN ANDA:<br><span class="text-yellow-300 font-black text-6xl sm:text-8xl mt-2 block">${data.antrian || '-'}</span></span>`; 
            if(this.cfdSuccessTimeout) clearTimeout(this.cfdSuccessTimeout);
            this.cfdSuccessTimeout = setTimeout(() => { cfdSuccess.classList.add('hidden'); cfdStandby.classList.remove('opacity-0', 'pointer-events-none'); }, 7000); 
            return; 
        } 
        cfdSuccess.classList.add('hidden'); if(this.cfdSuccessTimeout) clearTimeout(this.cfdSuccessTimeout);
        if (data.items && data.items.length === 0) { cfdStandby.classList.remove('opacity-0', 'pointer-events-none'); } 
        else if (data.items) {
            cfdStandby.classList.add('opacity-0', 'pointer-events-none'); let html = '';
            data.items.forEach((i, idx) => { 
                let delay = idx * 50; 
                html += `<div class="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex justify-between items-center transform transition-all" style="animation: slideInRight 0.4s ease-out ${delay}ms both;"><div class="flex items-center gap-4"><div class="bg-slate-100/80 border border-slate-200 text-brand-600 font-black w-10 h-10 flex justify-center items-center rounded-xl text-sm shadow-inner shrink-0">${i.qty}x</div><div><h4 class="font-extrabold text-slate-800 text-sm lg:text-base leading-tight">${i.nama}</h4><p class="text-[10px] lg:text-xs font-bold text-slate-400 mt-1">@ Rp ${Number(i.price || 0).toLocaleString('id-ID')}</p></div></div><div class="font-black text-brand-500 text-lg lg:text-xl shrink-0">Rp ${(Number(i.price || 0) * Number(i.qty || 0)).toLocaleString('id-ID')}</div></div>`; 
            });
            const listEl = document.getElementById('cfd-cart-list'); if (listEl) listEl.innerHTML = html;
            const totEl = document.getElementById('cfd-total'); if (totEl) totEl.innerText = `Rp ${Number(data.total || 0).toLocaleString('id-ID')}`;
        }
    },

    quickSearchTable: function(tbodyId, keyword) {
        const tbody = document.getElementById(tbodyId); if (!tbody) return;
        const filterText = keyword.toLowerCase(); const rows = tbody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            let rowText = rows[i].textContent || rows[i].innerText;
            if (rowText.toLowerCase().indexOf(filterText) > -1) rows[i].style.display = ""; else rows[i].style.display = "none";
        }
    },
    
    init: async function() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(registration => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            const banner = document.getElementById('update-banner');
                            if (banner) { banner.classList.remove('hidden'); setTimeout(() => { banner.classList.remove('translate-y-20', 'opacity-0'); }, 100); }
                            const btn = document.getElementById('btn-update-app');
                            if (btn) { btn.onclick = () => { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; newWorker.postMessage({ action: 'skipWaiting' }); }; }
                        }
                    });
                });
            }).catch(err => console.log('SW Reg Error:', err));
            let refreshing;
            navigator.serviceWorker.addEventListener('controllerchange', () => { if (refreshing) return; refreshing = true; window.location.reload(); });
        }

        if (new URLSearchParams(window.location.search).get('mode') === 'cfd') { this.initCFD(); return; }
        document.addEventListener("visibilitychange", () => { if (document.hidden && this.cfdWindow && !this.cfdWindow.closed) { this.cfdWindow.close(); } });
        document.addEventListener("click", () => { if (this.currentUser && localStorage.getItem('cfd_wants_open') === 'true') { if (!this.cfdWindow || this.cfdWindow.closed) { this.openCFD(true); } } });
        window.addEventListener('beforeunload', () => { if (this.cfdWindow && !this.cfdWindow.closed) this.cfdWindow.close(); });
        window.addEventListener('online', () => { this.isOnline = true; this.syncOfflineQueue(); });
        window.addEventListener('offline', () => { this.isOnline = false; this.updateNetworkUI(); });
        this.initAutoSync();
        
        try { let queue = localStorage.getItem('aisnack_offline_queue'); this.offlineQueue = queue ? JSON.parse(queue) : []; } catch (e) { this.offlineQueue = []; }

        try {
            const logStat = document.getElementById('login-status');
            let cacheDb = localStorage.getItem('aisnack_db_cache');
            if (cacheDb) { 
                this.db = JSON.parse(cacheDb); 
                if (logStat) { logStat.innerText = 'Data Lokal Siap. Mencari Update Server...'; logStat.className = 'text-[10px] text-orange-500 font-bold uppercase tracking-widest text-center animate-pulse'; } 
            } else { 
                if (logStat) { logStat.innerText = 'Mengunduh Database Google Pertama Kali...'; logStat.className = 'text-[10px] text-brand-500 font-bold uppercase tracking-widest text-center animate-pulse'; } 
            }

            let performFetch = async () => {
                let data = null;
                for (let i = 0; i < 3; i++) {
                    try { 
                        const res = await fetch(API_URL + "?ts=" + new Date().getTime() + "&history=30", { redirect: 'follow' }); 
                        data = await res.json(); 
                        if (data && data.status === 'sukses') break; 
                    } catch (e) { 
                        if (logStat && !this.db) logStat.innerText = `Mencoba ulang koneksi (${i+1}/3)...`; 
                        await new Promise(r => setTimeout(r, 2000)); 
                    }
                }
                if (!data || data.status === 'error') throw new Error(data ? data.pesan : "Server Timeout");

                this.db = data; 
                localStorage.setItem('aisnack_db_cache', JSON.stringify(data));
                
                let logoData = (this.db.pengaturan || []).find(x => x.Pengaturan === 'Logo_Aplikasi');
                if (logoData) { localStorage.setItem('app_logo_url', logoData.Nilai); this.updateAppLogos(logoData.Nilai); }
                let pStandby = (this.db.pengaturan || []).find(x => x.Pengaturan === 'Promo_Standby');
                if (pStandby) localStorage.setItem('cfd_promo_standby', pStandby.Nilai);
                let pTransaksi = (this.db.pengaturan || []).find(x => x.Pengaturan === 'Promo_Transaksi');
                if (pTransaksi) localStorage.setItem('cfd_promo_transaksi', pTransaksi.Nilai);

                let today = new Date(); let yyyy = today.getFullYear(); let mm = String(today.getMonth() + 1).padStart(2, '0'); let dd = String(today.getDate()).padStart(2, '0');
                let todayStr = `${yyyy}-${mm}-${dd}`; 
                const fs = document.getElementById('filter-start'); const fe = document.getElementById('filter-end');
                if (fs && !fs.value) fs.value = todayStr; 
                if (fe && !fe.value) fe.value = todayStr;

                if (logStat) { logStat.innerText = 'Sistem Terkoneksi. Silakan Masukkan PIN.'; logStat.className = 'text-[10px] text-green-500 font-bold uppercase tracking-widest text-center'; }

                setTimeout(() => { if (typeof this.pullBackgroundData === 'function') { this.pullBackgroundData(); } }, 3000);
            };

            if (cacheDb) { performFetch(); } else { await performFetch(); }
        } catch (err) {
            const logStat = document.getElementById('login-status');
            if (logStat && this.db) { logStat.innerText = 'Offline Mode Aktif (Gunakan PIN Anda)'; logStat.className = 'text-[10px] text-orange-500 font-bold uppercase tracking-widest text-center'; } 
            else if (logStat) { logStat.innerText = 'Gagal! Buka aplikasi pertama kali butuh Internet.'; logStat.className = 'text-[10px] text-red-500 font-bold uppercase tracking-widest text-center'; }
        }
    },
    
    addPin: function(num) {
        if (!this.db || !this.db.users) { this.showToast('Sistem sedang memuat data, mohon tunggu sebentar...', 'warning'); return; }
        if (this.pinBuffer.length < 4) { this.pinBuffer += num; const dot = document.getElementById(`dot-${this.pinBuffer.length}`); if (dot) { dot.classList.replace('border-slate-300', 'bg-brand-500'); dot.classList.replace('border-2', 'border-0'); } }
        if (this.pinBuffer.length === 4) setTimeout(() => this.processLogin(), 200);
    },
    delPin: function() {
        if (this.pinBuffer.length > 0) { const dot = document.getElementById(`dot-${this.pinBuffer.length}`); if (dot) { dot.classList.replace('bg-brand-500', 'border-slate-300'); dot.classList.replace('border-0', 'border-2'); } this.pinBuffer = this.pinBuffer.slice(0, -1); }
    },
    clearPin: function() {
        this.pinBuffer = ''; for (let i = 1; i <= 4; i++) { const dot = document.getElementById(`dot-${i}`); if (dot) { dot.classList.replace('bg-brand-500', 'border-slate-300'); dot.classList.replace('border-0', 'border-2'); } }
    },
    processLogin: function() {
        if (this.isProcessing) return; this.isProcessing = true;
        if (!this.db || !this.db.users) { this.showToast('Koneksi ke Database belum siap.', 'error'); this.clearPin(); this.isProcessing = false; return; }

        let user = this.db.users.find(u => String(u.PIN) === String(this.pinBuffer));
        if (user) {
            this.currentUser = user; this.outlet = user.Outlet === 'Pusat' ? ((this.db.outlets || [])[0]?.ID_Outlet || 'Penajam') : user.Outlet;
            const sbRole = document.getElementById('sb-role'); if (sbRole) sbRole.innerText = user.Role;
            const hInit = document.getElementById('header-initial'); if (hInit) hInit.innerText = user.Username.charAt(0).toUpperCase();

            let roleStr = String(user.Role).toLowerCase();
            let isAdmin = roleStr.includes('admin') || roleStr.includes('owner');
            this.userRole = roleStr.includes('owner') ? 'owner' : (roleStr.includes('admin') ? 'admin' : 'kasir');
            
            const adminMenus = document.getElementById('admin-menus'); 
            const selOut = document.getElementById('select-outlet'); 
            const repOut = document.getElementById('report-outlet-filter');

            const premiumCards = [ 'setting-card-standby', 'setting-card-transaksi', 'setting-card-logo', 'setting-card-struk' ];

            if (isAdmin) {
                if (adminMenus) adminMenus.classList.remove('hidden'); 
                if (selOut) selOut.classList.remove('hidden'); 
                if (repOut) repOut.classList.remove('hidden');
                let outOptions = ''; let outFilters = '<option value="Semua">Semua Outlet</option>';
                (this.db.outlets || []).forEach(o => { 
                    outOptions += `<option value="${o.ID_Outlet}">📍 ${o.Nama_Outlet}</option>`; 
                    outFilters += `<option value="${o.ID_Outlet}">Hanya: ${o.Nama_Outlet}</option>`; 
                });
                if (selOut) { selOut.innerHTML = outOptions; selOut.value = this.outlet; selOut.disabled = false; }
                if (repOut) repOut.innerHTML = outFilters;
                premiumCards.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); });
            } else {
                if (adminMenus) adminMenus.classList.add('hidden');
                if (selOut) { selOut.classList.add('hidden'); selOut.innerHTML = `<option value="${this.outlet}">📍 ${this.outlet}</option>`; selOut.disabled = true; }
                if (repOut) repOut.classList.add('hidden');
                premiumCards.forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
            }

            const ls = document.getElementById('login-screen'); if (ls) ls.classList.add('hidden');
            const sbar = document.getElementById('sidebar'); if (sbar) sbar.classList.remove('hidden');
            const mainApp = document.getElementById('main-app'); if (mainApp) mainApp.classList.remove('hidden');

            this.updateNetworkUI(); this.syncOfflineQueue(); this.refreshData(); this.checkShiftStatus(); this.showToast(`Selamat datang, ${user.Username}!`);
            localStorage.setItem('aisnack_active_outlet', this.outlet);
            this.updateCFDGreeting(); 
            if (!this.cfdTimer) {
                this.cfdTimer = setInterval(() => { this.updateCFDGreeting(); }, 60000); 
            }
            this.autoConnectPrinter();
        } else { 
            this.showToast('PIN Tidak Dikenali', 'error'); this.clearPin(); 
        }
        this.isProcessing = false;
    },
    
    logout: function() {
        if (!confirm("Yakin ingin keluar dari akun ini? Anda harus memasukkan PIN lagi untuk masuk.")) return;
        this.setLoading(true, "Keluar dari sistem...");
        setTimeout(() => {
            this.currentUser = null; this.activeShiftId = null; this.activeStaffTeam = [];
            this.clearPin(); 
            const ls = document.getElementById('login-screen');
            const sbar = document.getElementById('sidebar');
            const mainApp = document.getElementById('main-app');
            if (ls) ls.classList.remove('hidden');
            if (sbar) sbar.classList.add('hidden');
            if (mainApp) mainApp.classList.add('hidden');
            const mobileOverlay = document.getElementById('mobile-overlay');
            if (mobileOverlay) mobileOverlay.classList.add('hidden');
            if (sbar && !sbar.classList.contains('-translate-x-full')) { sbar.classList.add('-translate-x-full'); }
            this.switchMenu('pos');
            this.setLoading(false);
            this.showToast("Berhasil keluar dengan aman.", "success");
        }, 500);
    },

    // SHIFT & KAS KELUAR
    checkShiftStatus: function() {
        const shiftOutName = document.getElementById('shift-outlet-name'); if (shiftOutName) shiftOutName.innerText = this.outlet;
        let openShift = (this.db.shifts || []).find(s => s.Outlet === this.outlet && s.Waktu_Tutup === '');
        const posView = document.getElementById('view-pos');

        if (openShift) {
            this.activeShiftId = openShift.ID_Shift;
            try { this.activeStaffTeam = JSON.parse(openShift.Tim_Operasional); } catch (e) { this.activeStaffTeam = []; }
            if (posView) posView.classList.remove('blur-lock');
        } else {
            this.activeShiftId = null; this.activeStaffTeam = [];
            if (posView) posView.classList.add('blur-lock');
            const shiftUserName = document.getElementById('shift-user-name'); if (shiftUserName && this.currentUser) shiftUserName.innerText = this.currentUser.Username;
            let staffHtml = '';
            (this.db.users || []).filter(u => u.Outlet === this.outlet || u.Outlet === 'Pusat').forEach(u => {
                let badge = String(u.Role).toLowerCase().includes('senior') || String(u.Role).toLowerCase().includes('admin') ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-slate-100 text-slate-500';
                staffHtml += `<label class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition"><input type="checkbox" value="${u.Username}" data-role="${u.Role}" class="shift-cb w-5 h-5 text-brand-500 rounded"><div class="flex-1 font-bold text-sm text-slate-800">${u.Username}</div><span class="px-2 py-0.5 border rounded text-[10px] font-black uppercase ${badge}"></span></label>`;
            });
            const staffListEl = document.getElementById('shift-staff-list'); if (staffListEl) staffListEl.innerHTML = staffHtml || '<p class="text-sm text-red-500">Tidak ada staf terdaftar di cabang ini.</p>';
            const mAwal = document.getElementById('shift-modal-awal'); if (mAwal) mAwal.value = '';
            const modalShift = document.getElementById('modal-shift'); const modalShiftContent = document.getElementById('modal-shift-content');
            if (modalShift && modalShiftContent) { modalShift.classList.remove('hidden'); setTimeout(() => modalShiftContent.classList.add('modal-enter-active'), 10); }
        }
    },
    executeBukaShift: async function() {
        if (this.isProcessing) return;
        let cbs = document.querySelectorAll('.shift-cb:checked'); if (cbs.length === 0) return this.showToast("Pilih minimal 1 anggota tim!", "error");
        let mAwalEl = document.getElementById('shift-modal-awal'); let m_awal = mAwalEl ? this.getNumericValue(mAwalEl.value) : 0;
        if (m_awal === 0 && (!mAwalEl || mAwalEl.value === '')) return this.showToast("Uang Laci Awal wajib diisi!", "error");

        let tim = []; let hasSenior = false;
        cbs.forEach(cb => {
            tim.push({ username: cb.value, role: cb.getAttribute('data-role') });
            if (String(cb.getAttribute('data-role')).toLowerCase().includes('senior') || String(cb.getAttribute('data-role')).toLowerCase().includes('admin')) hasSenior = true;
        });
        if (!hasSenior) return this.showToast("Ditolak: Wajib 1 Senior dalam Shift!", "error");

        this.setLoading(true, "Membuka Laci Kasir...");
        let shiftID = 'SHF' + new Date().getTime();
        const payload = { action: 'buka_shift', outlet: this.outlet, tim: tim, modal_awal: m_awal, id_shift: shiftID };
        let res = await this.apiPost(payload);

        if (res.status === 'sukses') {
            this.activeShiftId = shiftID; this.activeStaffTeam = tim;
            if (res.is_offline) {
                let d = new Date(); let pad = (n) => n < 10 ? '0' + n : n;
                this.db.shifts.push({ ID_Shift: shiftID, Tanggal: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`, Outlet: this.outlet, Waktu_Tutup: '', Tim_Operasional: JSON.stringify(tim), Modal_Awal: m_awal });
            }
            this.closeModal('modal-shift'); const posView = document.getElementById('view-pos'); if (posView) posView.classList.remove('blur-lock');
            this.showToast(res.is_offline ? "Shift Dibuka (Mode Offline)" : "Shift Dibuka! Laci siap digunakan.");
        }
        this.setLoading(false);
    },
    openKasKeluar: function() {
        const nom = document.getElementById('kas-out-nominal'); if (nom) nom.value = '';
        const ket = document.getElementById('kas-out-ket'); if (ket) ket.value = '';
        const mod = document.getElementById('modal-kas-keluar'); const modc = document.getElementById('modal-kas-keluar-content');
        if (mod && modc) { mod.classList.remove('hidden'); setTimeout(() => modc.classList.add('modal-enter-active'), 10); }
    },
    executeKasKeluar: async function() {
        if (this.isProcessing) return;
        let nomEl = document.getElementById('kas-out-nominal'); let ketEl = document.getElementById('kas-out-ket');
        if (!nomEl || !ketEl) return; let nom = this.getNumericValue(nomEl.value); let ket = ketEl.value;
        if (nom === 0 || !ket) return this.showToast("Nominal dan Keterangan wajib diisi!", "error");

        this.setLoading(true, "Mencatat Pengeluaran...");
        let kasId = 'KAS' + new Date().getTime();
        const payload = { action: 'kas_keluar', id_kas: kasId, outlet: this.outlet, kasir: this.currentUser.Username, nominal: nom, keterangan: ket, id_shift: this.activeShiftId };

        let res = await this.apiPost(payload);
        if (res.status === 'sukses') {
            if (res.is_offline) {
                let d = new Date(); let pad = (n) => n < 10 ? '0' + n : n;
                if (!this.db.kasKeluar) this.db.kasKeluar = [];
                this.db.kasKeluar.push({ ID_Kas: kasId, Tanggal: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`, Waktu: `${pad(d.getHours())}.${pad(d.getMinutes())}.${pad(d.getSeconds())}`, Outlet: this.outlet, Kasir: this.currentUser.Username, Nominal: nom, Keterangan: ket, ID_Shift: this.activeShiftId });
            }
            this.closeModal('modal-kas-keluar'); this.showToast("Kas Keluar Tersimpan.");
            if (!res.is_offline) { const r = await fetch(API_URL + "?ts=" + new Date().getTime(), { redirect: 'follow' }); this.db = await r.json(); this.refreshData(); }
        }
        this.setLoading(false);
    },
    promptTutupShift: function() {
        const setAkhir = document.getElementById('shift-setoran-akhir'); if (setAkhir) setAkhir.value = '';
        let d = new Date(); let pad = (n) => n < 10 ? '0' + n : n;
        let todayStrLocal = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        let modal = 0; let salesTunai = 0; let totalKasKeluar = 0;
        (this.db.shifts || []).forEach(s => { if (s.Outlet === this.outlet && s.Tanggal === todayStrLocal) { modal += Number(s.Modal_Awal || 0); } });
        (this.db.transactions || []).forEach(t => {
            let t_date = this.cleanDateOnly(t.Tanggal);
            if (t.Outlet === this.outlet && t_date === todayStrLocal && t.Status === 'Sukses' && String(t.Metode_Bayar || '').toUpperCase() === 'TUNAI') { salesTunai += Number(t.Total_Bayar); }
        });
        (this.db.kasKeluar || []).forEach(k => { 
            let k_date = this.cleanDateOnly(k.Tanggal);
            if (k.Outlet === this.outlet && k_date === todayStrLocal) { totalKasKeluar += Number(k.Nominal); }
        });
        let expected = modal + salesTunai - totalKasKeluar;
        const tMod = document.getElementById('ts-modal'); if (tMod) tMod.innerText = `Rp ${modal.toLocaleString('id-ID')}`;
        const tSal = document.getElementById('ts-sales'); if (tSal) tSal.innerText = `Rp ${salesTunai.toLocaleString('id-ID')}`;
        const tKas = document.getElementById('ts-kasout'); if (tKas) tKas.innerText = `Rp ${totalKasKeluar.toLocaleString('id-ID')}`;
        const tExp = document.getElementById('ts-expected'); if (tExp) tExp.innerText = `Rp ${expected.toLocaleString('id-ID')}`;
        const modalTutup = document.getElementById('modal-tutup-shift'); const modalTutupContent = document.getElementById('modal-tutup-shift-content');
        if (modalTutup && modalTutupContent) { modalTutup.classList.remove('hidden'); setTimeout(() => modalTutupContent.classList.add('modal-enter-active'), 10); }
    },
    executeTutupShift: async function() {
        if (this.isProcessing) return;
        let setAkhirEl = document.getElementById('shift-setoran-akhir'); let setor = setAkhirEl ? this.getNumericValue(setAkhirEl.value) : 0;
        if (setor === 0 && (!setAkhirEl || setAkhirEl.value === '')) return this.showToast("Hitung uang fisik di laci!", "error");
        let d = new Date(); let pad = (n) => n < 10 ? '0' + n : n;
        let todayStrLocal = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        let modal = 0; let salesTunai = 0; let totalKasKeluar = 0;
        (this.db.shifts || []).forEach(s => { if (s.Outlet === this.outlet && s.Tanggal === todayStrLocal) modal += Number(s.Modal_Awal || 0); });
        (this.db.transactions || []).forEach(t => { 
            let t_date = this.cleanDateOnly(t.Tanggal);
            if (t.Outlet === this.outlet && t_date === todayStrLocal && t.Status === 'Sukses' && String(t.Metode_Bayar || '').toUpperCase() === 'TUNAI') salesTunai += Number(t.Total_Bayar); 
        });
        (this.db.kasKeluar || []).forEach(k => { 
            let k_date = this.cleanDateOnly(k.Tanggal);
            if (k.Outlet === this.outlet && k_date === todayStrLocal) totalKasKeluar += Number(k.Nominal); 
        });
        let expected = modal + salesTunai - totalKasKeluar; 
        let selisih = setor - expected;
        this.setLoading(true, "Merekap Penjualan Hari Ini...");
        const payload = { action: 'tutup_shift', id_shift: this.activeShiftId, setoran_akhir: setor, selisih: selisih };
        let res = await this.apiPost(payload);
        if (res.status === 'sukses') {
            alert(`REKAP HARIAN DITUTUP!\n\nUang Sistem (1 Hari): Rp ${expected.toLocaleString('id-ID')}\nUang Fisik (Setoran): Rp ${setor.toLocaleString('id-ID')}\nSelisih: Rp ${selisih.toLocaleString('id-ID')}`);
            location.reload();
        }
        this.setLoading(false);
    },

    updatePendingNotifications: function() {
        if (!this.db) return;
        let roleStr = this.currentUser ? String(this.currentUser.Role).toLowerCase() : '';
        let isAdmin = roleStr.includes('admin') || roleStr.includes('owner');
        let pOpnameTotal = 0; let pTerimaTotal = 0;
        let pOpnameOutlet = 0; let pTerimaOutlet = 0;
        (this.db.opname || []).forEach(o => {
            if (o.Status_Approval === 'Pending') {
                pOpnameTotal++; if (o.Outlet === this.outlet) pOpnameOutlet++;
            }
        });
        (this.db.mutasi || []).forEach(m => {
            if (m.Status_Approval === 'Pending') {
                pTerimaTotal++; if (m.Outlet_Tujuan === this.outlet) pTerimaOutlet++;
            }
        });
        const badgeAudit = document.getElementById('badge-audit');
        if (badgeAudit) {
            let totalAudit = pOpnameTotal + pTerimaTotal;
            if (isAdmin && totalAudit > 0) { badgeAudit.innerText = totalAudit > 99 ? '99+' : totalAudit; badgeAudit.classList.remove('hidden'); } 
            else { badgeAudit.classList.add('hidden'); }
        }
        const badgeTerima = document.getElementById('badge-terima');
        const bannerTerima = document.getElementById('banner-pending-terima');
        const textTerima = document.getElementById('text-pending-terima');
        if (badgeTerima && bannerTerima && textTerima) {
            if (pTerimaOutlet > 0) {
                badgeTerima.innerText = pTerimaOutlet; badgeTerima.classList.remove('hidden');
                textTerima.innerHTML = `Terdapat <b>${pTerimaOutlet} item</b> barang masuk di Cabang ${this.outlet} yang belum disetujui. Stok belum bertambah.`;
                bannerTerima.classList.remove('hidden');
            } else { badgeTerima.classList.add('hidden'); bannerTerima.classList.add('hidden'); }
        }
        const badgeOpname = document.getElementById('badge-opname');
        const bannerOpname = document.getElementById('banner-pending-opname');
        const textOpname = document.getElementById('text-pending-opname');
        if (badgeOpname && bannerOpname && textOpname) {
            if (pOpnameOutlet > 0) {
                badgeOpname.innerText = pOpnameOutlet; badgeOpname.classList.remove('hidden');
                textOpname.innerHTML = `Terdapat <b>${pOpnameOutlet} item</b> laporan selisih di Cabang ${this.outlet} yang menunggu diperiksa Owner.`;
                bannerOpname.classList.remove('hidden');
            } else { badgeOpname.classList.add('hidden'); bannerOpname.classList.add('hidden'); }
        }
    },

    refreshData: function() {
        this.applyOutletTheme();
        if (typeof this.updateHeaderOutletName === 'function') this.updateHeaderOutletName();
        const hSub = document.getElementById('header-subtitle'); if (hSub) hSub.innerHTML = this.getOutletBadge(this.outlet);
        const lOutManage = document.getElementById('label-outlet-manage'); if (lOutManage) lOutManage.innerHTML = this.getOutletBadge(this.outlet);

        this.filteredProducts = [];
        if (this.db && this.db.masterProduk) {
            this.db.masterProduk.forEach(master => {
                if (String(master.Kategori || '').toLowerCase() !== 'bahan' && String(master.Kategori || '').toLowerCase() !== 'pendukung') {
                    let hargaOutlet = (this.db.hargaStokOutlet || []).find(x => x.SKU === master.SKU && x.ID_Outlet === this.outlet);
                    let stokReference = master.SKU_Bahan ? master.SKU_Bahan : master.SKU;
                    let stokBahan = (this.db.hargaStokOutlet || []).find(x => x.SKU === stokReference && x.ID_Outlet === this.outlet);
                    if (hargaOutlet && hargaOutlet.Harga_Jual > 0) {
                        let qtySisa = stokBahan ? stokBahan.Stok_Toko : 0;
                        this.filteredProducts.push({ 
                            sku: master.SKU, nama: master.Nama_Produk, img: master.Gambar_URL, harga: hargaOutlet.Harga_Jual, maxStok: qtySisa, sku_bahan: master.SKU_Bahan, hpp: master.HPP || 0
                        });
                    }
                }
            });
        }
        this.filteredProducts.sort((a, b) => String(a.nama || '').localeCompare(String(b.nama || '')));
        if (document.getElementById('product-list')) this.renderProducts();
        if (typeof this.renderReport === 'function') this.renderReport();
        if (typeof this.renderGudang === 'function') this.renderGudang();
        if (typeof this.renderStaf === 'function') this.renderStaf();
        if (typeof this.renderOpname === 'function') this.renderOpname();
        if (typeof this.renderAudit === 'function') this.renderAudit();
        if (typeof this.renderTerimaBarang === 'function') this.renderTerimaBarang();
        if (typeof this.generateAIReport === 'function') this.generateAIReport();
        if (typeof this.updatePendingNotifications === 'function') this.updatePendingNotifications();
    },

    changeOutlet: function(val) { 
        this.outlet = val; this.cart = []; this.renderCart(); this.checkShiftStatus(); this.refreshData(); 
    },
    
    switchMenu: function(menu) {
        document.querySelectorAll('.app-view').forEach(el => el.classList.add('hidden'));
        const colors = { 'pos': 'text-brand-500', 'terima': 'text-green-600', 'opname': 'text-purple-600', 'report': 'text-blue-600', 'audit': 'text-indigo-600', 'ai': 'text-indigo-600', 'gudang': 'text-emerald-600', 'outlet': 'text-teal-600', 'staf': 'text-amber-600' };
        const allColors = Object.values(colors);
        document.querySelectorAll('.nav-btn').forEach(b => { 
            b.classList.remove('nav-active', 'bg-slate-50', ...allColors); b.classList.add('text-slate-500'); 
            let icon = b.querySelector('i'); if(icon) { icon.classList.remove(...allColors); icon.classList.add('text-slate-400'); }
        });
        const activeNav = document.getElementById(`nav-${menu}`); 
        if (activeNav) { 
            let targetColor = colors[menu] || 'text-brand-500';
            activeNav.classList.add('nav-active', 'bg-slate-50', targetColor); activeNav.classList.remove('text-slate-500'); 
            let icon = activeNav.querySelector('i'); if(icon) { icon.classList.remove('text-slate-400'); icon.classList.add(targetColor); }
        }
        let targetViewId = menu === 'master' ? 'gudang' : menu;
        const activeView = document.getElementById(`view-${targetViewId}`); if (activeView) activeView.classList.remove('hidden');
        const titles = { 'pos': 'POS', 'opname': 'Opname Fisik Stok', 'terima': 'Penerimaan Barang', 'audit': 'Audit Laporan', 'report': 'Laporan Terpadu', 'ai': 'CFO Dashboard & Asisten AI', 'gudang': 'Gudang Pusat', 'master': 'Master Varian POS', 'outlet': 'Cabang & Harga Khusus', 'staf': 'Kinerja Karyawan' };
        const pageTitle = document.getElementById('page-title'); if (pageTitle) pageTitle.innerText = titles[menu] || 'Aplikasi';
        const sidebar = document.getElementById('sidebar');
        if (window.innerWidth < 1024 && sidebar && !sidebar.classList.contains('-translate-x-full')) { this.toggleSidebar(); }
        if (menu === 'pos' && !this.activeShiftId) this.checkShiftStatus();
        if (menu === 'report' && typeof this.renderReport === 'function') this.renderReport();
        if (menu === 'opname' && typeof this.renderOpname === 'function') { this.renderOpname(); if (typeof this.showMenuGuide === 'function') setTimeout(() => this.showMenuGuide('opname'), 200); }
        if (menu === 'audit' && typeof this.renderAudit === 'function') this.renderAudit();
        if (menu === 'terima' && typeof this.renderTerimaBarang === 'function') { this.renderTerimaBarang(); if (typeof this.showMenuGuide === 'function') setTimeout(() => this.showMenuGuide('terima'), 200); }
        if (menu === 'ai' && typeof this.generateAIReport === 'function') this.generateAIReport();
        if (menu === 'staf' && typeof this.renderStaf === 'function') this.renderStaf();
        if (menu === 'gudang' || menu === 'master' || menu === 'outlet') {
            if (typeof this.renderGudang === 'function') { this.renderGudang(); this.toggleGudangTab('stok'); }
        }
    }, 

    filterProducts: function(key) {
        this._lastSearchKey = key; let pList = document.getElementById('product-list');
        if (pList) {
            if (this.isLoadingData) return;
            pList.innerHTML = this.filteredProducts.filter(p => String(p.nama || '').toLowerCase().includes(key.toLowerCase())).map(p => this.createProductCard(p)).join('');
        }
    },
    
    renderProducts: function() {
        const list = document.getElementById('product-list'); if (!list) return;
        if (this.isLoadingData) { 
            list.innerHTML = Array(8).fill(0).map(() => `<div class="bg-white border border-slate-100 rounded-3xl p-3 shadow-2xs flex flex-col h-[200px] sm:h-[220px] md:h-[250px] animate-pulse"><div class="bg-slate-100 h-[55%] rounded-2xl mb-3 w-full"></div><div class="flex-1 flex flex-col justify-between p-1"><div class="space-y-1.5"><div class="bg-slate-100 h-3.5 w-5/6 rounded-lg"></div><div class="bg-slate-100 h-3 w-1/2 rounded-lg"></div></div><div class="flex justify-between items-center pt-2"><div class="bg-slate-100 h-4 w-2/5 rounded-lg"></div><div class="bg-slate-100 h-7 w-7 rounded-full"></div></div></div></div>`).join(''); return; 
        }
        let key = this._lastSearchKey || ''; 
        let itemsToRender = key ? this.filteredProducts.filter(p => String(p.nama || '').toLowerCase().includes(key.toLowerCase())) : this.filteredProducts;
        if (itemsToRender.length === 0) {
            list.innerHTML = `<div class="col-span-full py-16 text-center text-slate-400 font-bold text-sm bg-white/50 rounded-3xl border-2 border-dashed border-slate-200">Produk yang dicari tidak ditemukan</div>`;
            return;
        }
        list.innerHTML = itemsToRender.map(p => this.createProductCard(p)).join('');
    },
    
    createProductCard: function(p) {
        let qtyInCart = 0; let cartItem = this.cart.find(i => i.sku === p.sku); if (cartItem) qtyInCart = cartItem.qty;
        let img = p.img ? `<img src="${p.img}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/150x150/f8fafc/94a3b8?text=Err';" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">` : `<div class="w-full h-full flex items-center justify-center text-3xl text-slate-300 bg-slate-50"><i class="fas fa-utensils"></i></div>`;
        let isHabis = p.maxStok <= 0;
        let cardInteractiveStyle = isHabis ? 'opacity-50 grayscale cursor-not-allowed border-transparent' : 'hover:-translate-y-1.5 hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.08)] hover:border-brand-300 border-slate-100/80 active:scale-[0.98]';
        let stokBadgeStyle = isHabis ? 'bg-rose-500 text-white shadow-rose-500/30' : (p.maxStok <= 5 ? 'bg-amber-500/90 text-white animate-pulse' : 'bg-slate-900/75 text-white backdrop-blur-md');
        let stokText = isHabis ? 'HABIS' : `STOK: ${p.maxStok}`;
        let overlayQty = qtyInCart > 0 ? `<div class="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] flex items-center justify-center z-20 transition-all duration-300 animate-[fadeIn_0.2s_ease-out]"><div class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transform scale-100"><span class="text-xl md:text-2xl font-black text-white drop-shadow-md">${qtyInCart}</span></div></div>` : '';
        let namaProduk = p.nama || 'Nama Tidak Tersedia';
        return `<div onclick="${!isHabis ? `superApp.addToCart('${p.sku}', '${p.nama}', ${p.harga}, ${p.maxStok}, '${p.sku_bahan || ''}', event)` : ''}" class="bg-white border-2 rounded-[1.25rem] md:rounded-[1.75rem] cursor-pointer shadow-2xs transition-all duration-300 flex flex-col relative group overflow-hidden select-none h-[200px] sm:h-[220px] md:h-[250px] ${cardInteractiveStyle}"><span class="absolute top-2.5 right-2.5 md:top-3 md:right-3 ${stokBadgeStyle} text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-full z-30 shadow-md tracking-wider leading-none">${stokText}</span><div class="h-[55%] w-full overflow-hidden bg-slate-50 relative shrink-0">${img}${overlayQty}</div><div class="h-[45%] w-full flex flex-col justify-between p-3 md:p-3.5 bg-white"><h3 class="font-extrabold text-xs md:text-sm text-slate-800 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">${namaProduk}</h3><div class="flex items-center justify-between w-full mt-auto pt-1"><p class="text-brand-600 font-black text-xs md:text-sm xl:text-base tracking-tight truncate pr-1">Rp ${Number(p.harga || 0).toLocaleString('id-ID')}</p><div class="w-7 h-7 md:w-8 md:h-8 rounded-full ${qtyInCart > 0 ? 'bg-gradient-to-tr from-brand-500 to-orange-500 text-white shadow-md shadow-brand-500/30' : 'bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600'} flex items-center justify-center transition-all duration-300 shrink-0"><i class="fas ${qtyInCart > 0 ? 'fa-check' : 'fa-plus'} text-[10px] md:text-xs"></i></div></div></div></div>`;
    },
    
    addToCart: function(sku, nama, price, maxStok, skuBahan, event) {
        let currentStokBahanDiKeranjang = 0; let refBahan = skuBahan || sku;
        this.cart.forEach(i => { if ((i.sku_bahan || i.sku) === refBahan) currentStokBahanDiKeranjang += i.qty; });
        if (currentStokBahanDiKeranjang >= maxStok) return this.showToast(`Stok Habis! Sisa di Toko: ${maxStok - currentStokBahanDiKeranjang}`, 'error');
        if (event) {
            const cartIcon = document.getElementById('cart-badge');
            if (cartIcon) {
                const rect = cartIcon.getBoundingClientRect(); const dot = document.createElement('div');
                dot.className = 'fly-dot'; dot.style.left = event.clientX + 'px'; dot.style.top = event.clientY + 'px';
                document.body.appendChild(dot);
                requestAnimationFrame(() => { dot.style.transform = `translate(${rect.left - event.clientX}px, ${rect.top - event.clientY}px) scale(0.5)`; dot.style.opacity = '0'; });
                setTimeout(() => dot.remove(), 500);
            }
        }
        let item = this.cart.find(i => i.sku === sku);
        if (item) item.qty++; else this.cart.push({ sku, nama, price, qty: 1, sku_bahan: skuBahan, maxStok: maxStok });
        this.renderCart();
        setTimeout(() => { const cont = document.getElementById('cart-container'); if (cont) cont.scrollTop = cont.scrollHeight; }, 50);
    },
    
    changeQty: function(idx, val) { 
        if (val > 0) {
            let item = this.cart[idx];
            let currentStokBahan = 0; let refBahan = item.sku_bahan || item.sku;
            this.cart.forEach(i => { if ((i.sku_bahan || i.sku) === refBahan) currentStokBahan += i.qty; });
            if (currentStokBahan >= item.maxStok) return this.showToast(`Stok Habis!`, 'error');
        }
        this.cart[idx].qty += val; 
        if (this.cart[idx].qty <= 0) this.cart.splice(idx, 1); 
        this.renderCart(); 
    },
    
    renderCart: function() {
        const cont = document.getElementById('cart-container'); let total = 0, items = 0, html = ''; if (!cont) return;
        if (this.cart.length > 0) {
            html += `<div class="flex justify-between items-center mb-3.5 px-1 shrink-0"><span class="text-[10px] font-black text-slate-400 tracking-widest uppercase flex items-center gap-1.5"><i class="fas fa-list-ul text-slate-300"></i> Daftar Pesanan</span><button onclick="superApp.clearCart()" class="text-[10px] font-black text-rose-500 hover:text-rose-600 bg-rose-50/80 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-90 border border-rose-100/60"><i class="fas fa-trash-alt text-[11px]"></i> Hapus Semua</button></div>`;
        }
        this.cart.forEach((i, idx) => {
            total += (i.price * i.qty); items += i.qty;
            let sisaBahanDiKeranjang = 0; let refBahan = i.sku_bahan || i.sku;
            this.cart.forEach(c => { if ((c.sku_bahan || c.sku) === refBahan) sisaBahanDiKeranjang += c.qty; });
            let stokTersisaVisual = i.maxStok - sisaBahanDiKeranjang;
            let stokLimitStyle = stokTersisaVisual <= 0 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse font-black' : (stokTersisaVisual <= 5 ? 'bg-amber-50 text-amber-600 border-amber-200 font-extrabold' : 'bg-slate-50 text-slate-400 border-slate-100 font-bold');
            html += `<div class="relative overflow-hidden rounded-2xl mb-2.5 bg-rose-500 shadow-2xs group select-none transition-all"><button onclick="superApp.changeQty(${idx}, -999)" class="absolute inset-y-0 right-0 w-20 flex flex-col items-center justify-center text-white text-[10px] font-black transition-colors hover:bg-rose-600 active:bg-rose-700 tracking-wider"><i class="fas fa-trash-alt mb-1 text-base drop-shadow-sm group-hover:scale-110 transition-transform"></i> HAPUS</button><div class="flex bg-white border border-slate-100/80 p-3.5 rounded-2xl items-center gap-3 text-slate-800 transition-transform duration-300 transform relative z-10 w-full hover:border-slate-200" ontouchstart="this.startX = event.touches[0].clientX; this.style.transition = 'none';" ontouchmove="let diff = this.startX - event.touches[0].clientX; if(diff > 0 && diff < 100) { this.style.transform = 'translateX(-' + diff + 'px)'; }" ontouchend="let diff = this.startX - event.changedTouches[0].clientX; this.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'; if(diff > 45) { this.style.transform = 'translateX(-80px)'; } else { this.style.transform = 'translateX(0)'; }"><div class="flex-1 min-w-0 pr-1"><h4 class="font-extrabold text-xs md:text-sm truncate text-slate-800 mb-1 leading-snug">${i.nama}</h4><div class="flex items-center gap-2 flex-wrap"><p class="text-brand-600 font-black text-xs md:text-sm tracking-tight">Rp ${(i.price * i.qty).toLocaleString('id-ID')}</p><span class="text-[9px] border px-1.5 py-0.5 rounded-md ${stokLimitStyle}">Sisa: ${stokTersisaVisual}</span></div></div><div class="flex bg-slate-100/80 rounded-xl border border-slate-200/60 p-1 shrink-0 items-center shadow-inner"><button onclick="superApp.changeQty(${idx}, -1)" class="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-black text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-all shadow-2xs active:scale-90"><i class="fas fa-minus text-[10px]"></i></button><span class="w-7 md:w-8 flex items-center justify-center text-xs md:text-sm font-black text-slate-800 tracking-tight">${i.qty}</span><button onclick="superApp.changeQty(${idx}, 1)" class="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-black text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all shadow-2xs active:scale-90"><i class="fas fa-plus text-[10px]"></i></button></div></div></div>`;
        });
        cont.innerHTML = this.cart.length ? html : this.getEmptyState('fa-shopping-basket', 'Keranjang Kosong', 'Yuk, sentuh produk di samping untuk memesan!');
        const totalEl = document.getElementById('total-price'); if (totalEl) totalEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
        const badge = document.getElementById('cart-badge'); if (badge) badge.innerText = `${items} Item`;
        const mobQty = document.getElementById('mobile-cart-qty'); if (mobQty) mobQty.innerText = `${items} Item`;
        const mobTotal = document.getElementById('mobile-cart-total'); if (mobTotal) mobTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
        this.payTotal = total; 
        if (document.getElementById('product-list')) this.renderProducts();
        this.syncStorage(); 
    },
    clearCart: function() {
        if (this.cart.length === 0) return;
        if (confirm("Hapus semua pesanan dari keranjang?")) {
            this.cart = []; this.renderCart(); this.showToast("Keranjang berhasil dikosongkan", "success");
        }
    },
    
    // =========================================================
    // 🚀 MANAJEMEN USER / KARYAWAN (DUAL RENDER PC & MOBILE)
    // =========================================================
    renderUsers: function() {
        const tbody = document.getElementById('stok-user-tbody');
        const mobContainer = document.getElementById('stok-user-mobile-container');
        let htmlDesk = ''; let htmlMob = '';
        let users = [...(this.db.users || [])].sort((a, b) => String(a.Nama || '').localeCompare(String(b.Nama || '')));

        users.forEach(u => {
            let role = String(u.Role || '').toLowerCase(); let roleBadge = '';
            if (role.includes('owner')) roleBadge = 'bg-purple-50 text-purple-700 border-purple-200';
            else if (role.includes('manager') || role.includes('admin')) roleBadge = 'bg-blue-50 text-blue-700 border-blue-200';
            else roleBadge = 'bg-slate-50 text-slate-600 border-slate-200';

            let currentOutlet = u.ID_Outlet || 'Semua Cabang';
            if (currentOutlet !== 'Semua Cabang') {
                let ot = (this.db.outlets || []).find(x => x.ID_Outlet === u.ID_Outlet);
                if (ot) currentOutlet = ot.Nama_Outlet;
            }

            htmlDesk += `
            <tr class="table-row-3d border-b border-slate-50 hover:bg-slate-50 transition-all group">
                <td class="py-4 px-5 whitespace-normal"><div class="font-extrabold text-slate-800 text-sm mb-0.5">${u.Nama}</div><div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: ${u.Username || u.ID_User || '-'}</div></td>
                <td class="py-4 px-5"><span class="bg-indigo-50/60 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-lg text-xs font-black uppercase"><i class="fas fa-store mr-1.5 opacity-70"></i>${currentOutlet}</span></td>
                <td class="py-4 px-5 text-center"><code class="bg-slate-100 px-2.5 py-1 rounded-lg font-mono text-xs font-black text-slate-600 tracking-widest">••••</code></td>
                <td class="py-4 px-5 text-center"><span class="inline-flex px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${roleBadge}">${u.Role}</span></td>
                <td class="py-4 px-5 text-center"><div class="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity"><button onclick="superApp.openCrudUser('edit', '${u.Username || u.ID_User}')" class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white transition-all active:scale-90 flex items-center justify-center" title="Edit Staf"><i class="fas fa-edit text-xs"></i></button><button onclick="superApp.deleteCrud('Users', '${u.Username || u.ID_User}')" class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90 flex items-center justify-center" title="Hapus Staf"><i class="fas fa-trash text-xs"></i></button></div></td>
            </tr>`;

            htmlMob += `
            <div class="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-sm transition-all flex justify-between items-center gap-3">
                <div class="min-w-0 flex-1"><div class="flex items-center gap-2"><h4 class="font-extrabold text-sm text-slate-800 truncate">${u.Nama}</h4><span class="px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${roleBadge} shrink-0">${u.Role}</span></div><div class="text-[10px] text-slate-500 font-bold mt-1 flex items-center gap-1.5"><i class="fas fa-store text-indigo-400 text-xs"></i> ${currentOutlet}</div></div>
                <div class="flex items-center gap-2 shrink-0 border-l border-slate-50 pl-2.5"><button onclick="superApp.openCrudUser('edit', '${u.Username || u.ID_User}')" class="w-8 h-8 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 font-bold flex items-center justify-center active:scale-90"><i class="fas fa-edit text-xs"></i></button><button onclick="superApp.deleteCrud('Users', '${u.Username || u.ID_User}')" class="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 font-bold flex items-center justify-center active:scale-90"><i class="fas fa-trash text-xs"></i></button></div>
            </div>`;
        });

        if (tbody) tbody.innerHTML = htmlDesk || `<tr><td colspan="5" class="py-12 text-center text-slate-400 font-bold text-xs">Belum ada data staf</td></tr>`;
        if (mobContainer) mobContainer.innerHTML = htmlMob || `<div class="p-6 text-center text-slate-400 text-xs font-bold border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">Belum ada data staf</div>`;
    },

    openCrudUser: function(mode, userId = '') {
        let u = mode === 'edit' ? this.db.users.find(x => (x.Username || x.ID_User) === userId) : null;
        let outletOptions = `<option value="Semua Cabang">Semua Cabang (Akses Global)</option>`;
        (this.db.outlets || []).forEach(o => {
            let selected = (u && u.ID_Outlet === o.ID_Outlet) ? 'selected' : '';
            outletOptions += `<option value="${o.ID_Outlet}" ${selected}>${o.Nama_Outlet}</option>`;
        });

        let inputs = `
            ${this.makeInput('Nama Lengkap Karyawan', 'usr-nama', u ? u.Nama : '')}
            <div class="grid grid-cols-2 gap-3">
                ${this.makeInput('Username ID', 'usr-id', u ? (u.Username || u.ID_User) : '', 'text', '', mode === 'edit')}
                ${this.makeInput('PIN Kasir (4 Digit)', 'usr-pin', '', 'password', 'Kosongkan jika tidak ubah PIN')}
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div><label class="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-widest">Role Akses</label><select id="frm-usr-role" class="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-sm bg-white outline-none focus:border-brand-500"><option value="Kasir" ${u && u.Role === 'Kasir' ? 'selected' : ''}>Kasir / Operator</option><option value="Manajer" ${u && u.Role === 'Manajer' ? 'selected' : ''}>Manajer Toko</option><option value="Admin" ${u && u.Role === 'Admin' ? 'selected' : ''}>Admin Gudang</option><option value="Owner" ${u && u.Role === 'Owner' ? 'selected' : ''}>Owner</option></select></div>
                <div><label class="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-widest">Penempatan Cabang</label><select id="frm-usr-outlet" class="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-sm bg-white outline-none focus:border-brand-500">${outletOptions}</select></div>
            </div>`;
        this.buildForm(mode === 'edit' ? "Edit Profil Staf" : "Daftar Staf Baru", inputs, `superApp.executeCrudUser('${mode}', '${mode === 'edit' ? userId : ''}')`);
    },

    executeCrudUser: async function(mode, oldId) {
        if (this.isProcessing) return;
        const fNama = document.getElementById('frm-usr-nama'); const fId = document.getElementById('frm-usr-id'); const fPin = document.getElementById('frm-usr-pin'); const fRole = document.getElementById('frm-usr-role'); const fOutlet = document.getElementById('frm-usr-outlet');
        if (!fNama || !fId || !fRole || !fOutlet) return;
        if (!fNama.value || !fId.value) return this.showToast("Nama dan ID wajib diisi!", "error");
        if (mode === 'add' && (!fPin.value || fPin.value.length < 4)) return this.showToast("PIN baru wajib 4 digit!", "error");

        this.setLoading(true, "Menyimpan Data Staf...");
        let payload = { action: 'save_user', mode: mode, id: oldId || fId.value, nama: fNama.value, username: fId.value, role: fRole.value, outlet: fOutlet.value, pin: fPin.value };
        let res = await this.apiPost(payload);
        if (res.status === 'sukses') {
            this.closeModal('modal-form');
            if (!res.is_offline) { const r = await fetch(API_URL + "?ts=" + new Date().getTime(), { redirect: 'follow' }); this.db = await r.json(); }
            this.refreshData(); this.showToast("Data staf tersimpan!");
        }
        this.setLoading(false);
    },

    // UI & BLUETOOTH
    makeInput: function(label, id, val='', type='text', hint='', dis=false, customEvent='') { 
        let im = (type === 'number' || customEvent.includes('formatRupiah')) ? 'inputmode="numeric"' : '';
        return `<div><label class="text-xs font-bold text-slate-500 block mb-1 uppercase tracking-widest">${label}</label><input type="${type}" ${im} id="frm-${id}" value="${val}" ${dis?'disabled':''} ${customEvent?'oninput="'+customEvent+'"':''} class="w-full border-2 border-slate-200 rounded-xl px-4 py-3 font-bold focus:border-brand-500 text-sm outline-none bg-white text-slate-800 transition ${dis?'opacity-50':''}">${hint?`<p class="text-[10px] text-slate-400 mt-1">${hint}</p>`:''}</div>`; 
    },
    buildForm: function(title, inputsHtml, actionFunctionStr) {
        const titleEl = document.getElementById('modal-form-title'); if(titleEl) titleEl.innerText = title; 
        const bodyEl = document.getElementById('modal-form-body'); if(bodyEl) bodyEl.innerHTML = inputsHtml;
        const btnEl = document.getElementById('modal-form-btn'); if(btnEl) btnEl.setAttribute('onclick', actionFunctionStr);
        const modal = document.getElementById('modal-form'); const modalContent = document.getElementById('modal-form-content');
        if(modal && modalContent) { modal.classList.remove('hidden'); setTimeout(() => modalContent.classList.add('modal-enter-active'), 10); }
    },

    toggleMobileCart: function() {
        const aside = document.getElementById('cart-aside'); const overlay = document.getElementById('mobile-cart-overlay'); const floatingBtn = document.getElementById('floating-cart-btn');
        if (aside.classList.contains('translate-y-full')) {
            aside.classList.remove('translate-y-full'); overlay.classList.remove('hidden'); if(floatingBtn) floatingBtn.classList.add('translate-y-full');
        } else {
            aside.classList.add('translate-y-full'); overlay.classList.add('hidden'); if(floatingBtn) floatingBtn.classList.remove('translate-y-full');
        }
    },

    openGiantNumpad: function(targetId, title, subtitle) {
        this.gnTarget = document.getElementById(targetId); document.getElementById('gn-title').innerText = title; document.getElementById('gn-subtitle').innerText = subtitle;
        let initialVal = this.gnTarget ? (this.gnTarget.value || '0') : '0'; document.getElementById('gn-display').innerText = initialVal;
        const modal = document.getElementById('modal-giant-numpad'); modal.classList.remove('hidden'); modal.classList.add('flex'); setTimeout(() => modal.classList.remove('translate-y-full'), 10);
    },
    closeGiantNumpad: function() {
        const modal = document.getElementById('modal-giant-numpad'); modal.classList.add('translate-y-full');
        setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); this.gnTarget = null; }, 300);
    },
    typeGiantNumpad: function(char) {
        let disp = document.getElementById('gn-display'); if (disp.innerText === '0') disp.innerText = ''; disp.innerText += char;
    },
    delGiantNumpad: function() {
        let disp = document.getElementById('gn-display'); disp.innerText = disp.innerText.slice(0, -1); if (disp.innerText === '') disp.innerText = '0';
    },
    clearGiantNumpad: function() { document.getElementById('gn-display').innerText = '0'; },
    saveGiantNumpad: function() {
        if (this.gnTarget) { this.gnTarget.value = document.getElementById('gn-display').innerText; this.gnTarget.dispatchEvent(new Event('input', { bubbles: true })); }
        this.closeGiantNumpad();
    },

    getOutletBadge: function(outletName) {
        let safeName = String(outletName || '-').trim(); let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
        let lowerName = safeName.toLowerCase();
        if (lowerName.includes('penajam')) colorClass = 'bg-blue-50 text-blue-600 border-blue-200';
        else if (lowerName.includes('babulu')) colorClass = 'bg-green-50 text-green-600 border-green-200';
        else if (lowerName.includes('batu kajang')) colorClass = 'bg-purple-50 text-purple-600 border-purple-200';
        else if (lowerName.includes('sepaku')) colorClass = 'bg-orange-50 text-orange-600 border-orange-200';
        return `<span class="px-2 py-0.5 rounded md:rounded-md text-[10px] md:text-xs font-black border shadow-sm whitespace-nowrap ${colorClass}">${safeName}</span>`;
    },

    applyOutletTheme: function() {
        let safeName = String(this.outlet || '').toLowerCase(); let root = document.documentElement;
        if (safeName.includes('penajam')) { root.style.setProperty('--brand-50', '#eff6ff'); root.style.setProperty('--brand-100', '#dbeafe'); root.style.setProperty('--brand-500', '#3b82f6'); root.style.setProperty('--brand-600', '#2563eb'); } 
        else if (safeName.includes('babulu')) { root.style.setProperty('--brand-50', '#f0fdf4'); root.style.setProperty('--brand-100', '#dcfce7'); root.style.setProperty('--brand-500', '#22c55e'); root.style.setProperty('--brand-600', '#16a34a'); } 
        else if (safeName.includes('batu kajang')) { root.style.setProperty('--brand-50', '#faf5ff'); root.style.setProperty('--brand-100', '#f3e8ff'); root.style.setProperty('--brand-500', '#a855f7'); root.style.setProperty('--brand-600', '#9333ea'); } 
        else { root.style.setProperty('--brand-50', '#fff7ed'); root.style.setProperty('--brand-100', '#ffedd5'); root.style.setProperty('--brand-500', '#f97316'); root.style.setProperty('--brand-600', '#ea580c'); }
    },

    updateHeaderOutletName: function() {
        const hName = document.getElementById('header-outlet-name'); if (hName) hName.innerText = this.outlet || 'Pusat';
    },

    openOutletSelector: function() {
        const listEl = document.getElementById('outlet-selector-list'); if (!listEl) return;
        let roleStr = this.currentUser ? String(this.currentUser.Role).toLowerCase() : '';
        let isAdmin = roleStr.includes('admin') || roleStr.includes('owner');
        let html = '';
        (this.db.outlets || []).forEach(o => {
            let isActive = (o.ID_Outlet === this.outlet);
            let activeClass = isActive ? 'border-brand-500 bg-brand-50 ring-4 ring-brand-500/10 scale-[1.02]' : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-md';
            let checkIcon = isActive ? '<i class="fas fa-check-circle text-brand-500 text-2xl drop-shadow-sm"></i>' : '<i class="far fa-circle text-slate-300 text-2xl"></i>';
            let disableClick = (!isAdmin && !isActive) ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer';
            let clickEvent = (!isAdmin && !isActive) ? `onclick="superApp.showToast('Kasir tidak diizinkan pindah ke cabang lain', 'error')"` : `onclick="superApp.selectOutlet('${o.ID_Outlet}')"`;
            html += `<div ${clickEvent} class="${activeClass} ${disableClick} p-4 rounded-[1.5rem] mb-4 transition-all duration-300 flex items-center justify-between group"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${isActive ? 'bg-gradient-to-br from-brand-400 to-orange-500 text-white shadow-md' : 'bg-slate-100 text-slate-400'}"><i class="fas fa-map-marked-alt text-lg"></i></div><div><h4 class="font-extrabold text-slate-800 text-base tracking-tight">${o.Nama_Outlet}</h4><p class="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">ID: ${o.ID_Outlet}</p></div></div><div>${checkIcon}</div></div>`;
        });
        listEl.innerHTML = html; this.openModal('modal-outlet-selector');
    },
    
    selectOutlet: function(id) {
        superApp.changeOutlet(id); superApp.updateHeaderOutletName(); superApp.closeModal('modal-outlet-selector');
    },

    connectBluetooth: async function(isAuto = false) {
        if (this.isBluetoothSearching) return; this.isBluetoothSearching = true; 
        const btnPrinter = document.getElementById('btn-printer'); const statusPrinter = document.getElementById('printer-status');
        if (!isAuto) this.setLoading(true, "Mengecek Printer...");
        try {
            if (this.printerDevice && this.printerDevice.gatt.connected) { try { this.printerDevice.gatt.disconnect(); } catch(e) {} }
            this.printerDevice = null; this.printerCharacteristic = null; let device = null; let server = null;
            if (navigator.bluetooth && navigator.bluetooth.getDevices) {
                const devices = await navigator.bluetooth.getDevices();
                if (devices.length > 0) { device = devices[0]; try { server = await device.gatt.connect(); } catch (e) { server = null; } }
            }
            if (!server) {
                if (isAuto) { this.isBluetoothSearching = false; return; }
                if (device) { this.setLoading(true, "Membangunkan printer tersimpan..."); try { server = await device.gatt.connect(); } catch(e) { server = null; } }
                if (!server) {
                    let mauScan = true;
                    if (device) { this.setLoading(false); mauScan = confirm("Printer tersimpan gagal merespons otomatis.\n\nKlik [OK] jika Anda ingin SCAN ULANG / Pairing Baru.\nKlik [BATAL] lalu tekan ikon Printer lagi untuk sekadar memancing sambungan."); }
                    if (mauScan) {
                        this.setLoading(true, "Mencari Perangkat Baru...");
                        device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: [ '000018f0-0000-1000-8000-00805f9b34fb', '0000ff00-0000-1000-8000-00805f9b34fb', '0000e700-0000-1000-8000-00805f9b34fb', '0000fee7-0000-1000-8000-00805f9b34fb', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2' ] });
                        this.setLoading(true, "Mengawinkan Perangkat..."); server = await device.gatt.connect();
                    } else { this.isBluetoothSearching = false; return; }
                }
            }
            let service; const serviceUUIDs = ['000018f0-0000-1000-8000-00805f9b34fb', '0000ff00-0000-1000-8000-00805f9b34fb', '0000e700-0000-1000-8000-00805f9b34fb', '0000fee7-0000-1000-8000-00805f9b34fb', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2'];
            for (let uuid of serviceUUIDs) { try { service = await server.getPrimaryService(uuid); if(service) break; } catch(e) {} }
            if(!service) throw new Error("Service Printer tidak ditemukan");
            const charUUIDs = ['00002af1-0000-1000-8000-00805f9b34fb', '0000ff02-0000-1000-8000-00805f9b34fb', '0000e701-0000-1000-8000-00805f9b34fb', '0000fec8-0000-1000-8000-00805f9b34fb', 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'];
            for (let uuid of charUUIDs) { try { this.printerCharacteristic = await service.getCharacteristic(uuid); if(this.printerCharacteristic) break; } catch(e) {} }
            if(!this.printerCharacteristic) throw new Error("Characteristic gagal diakses");
            this.printerDevice = device;
            if (btnPrinter) { btnPrinter.classList.replace('text-slate-600', 'text-green-600'); btnPrinter.classList.add('bg-green-50', 'border-green-200'); }
            if (statusPrinter) statusPrinter.innerText = "Printer Ready";
            if (!isAuto) this.showToast("Printer Terhubung & Siap Cetak!", "success");
            if (!isAuto) this.setLoading(false);
            device.ongattserverdisconnected = null; 
            device.addEventListener('gattserverdisconnected', () => {
                this.printerCharacteristic = null; if (statusPrinter) statusPrinter.innerText = "Printer Off";
                if (btnPrinter) { btnPrinter.classList.remove('bg-green-50', 'border-green-200'); btnPrinter.classList.replace('text-green-600', 'text-slate-600'); }
                this.showToast("Koneksi printer terputus", "warning");
            });
        } catch (error) {
            if (!isAuto) this.setLoading(false); this.printerCharacteristic = null;
            if (!isAuto) { if (error.name === 'NotFoundError' || error.message.includes('cancelled')) { this.showToast("Pencarian dibatalkan.", "warning"); } else { this.showToast("Gagal menyambung. Pastikan printer nyala.", "error"); } }
        } finally { setTimeout(() => { this.isBluetoothSearching = false; }, 2000); }
    },
    
    autoConnectPrinter: async function() {
        let isCFD = window.location.href.toLowerCase().includes('cfd') || document.title.toLowerCase().includes('cfd'); if (isCFD) return; 
        if (this.printerCharacteristic || this.isBluetoothSearching) return;
        if (navigator.bluetooth && navigator.bluetooth.getDevices) {
            try { const devices = await navigator.bluetooth.getDevices(); if (devices.length > 0) { this.connectBluetooth(true); } } catch (e) {}
        }
    }
};

window.onload = () => superApp.init();

setInterval(() => {
    const viewPos = document.getElementById('view-pos'); const isPosActive = viewPos && !viewPos.classList.contains('hidden');
    if (superApp.isOnline && superApp.cart.length === 0 && isPosActive) { superApp.pullFreshData(true); }
}, 300000);
