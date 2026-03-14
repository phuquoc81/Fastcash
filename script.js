// Fastcash — Passive & Affiliate Income · Remote Jobs by Phu AI

// ── Constants ────────────────────────────────────────────────────────────────

const PASSIVE_STREAMS = [
    { name: 'Phu AI Cloud Tasks',    baseRate: 0.12 },
    { name: 'Phuoptimizer Rewards',  baseRate: 0.08 },
    { name: 'Quantum Staking Pool',  baseRate: 0.05 },
    { name: 'Auto-Mining Node',      baseRate: 0.07 },
];

const AFFILIATE_PROGRAMS = [
    { name: 'phubers.blog',          program: 'Content Affiliate',    baseRate: 0.15, url: 'https://phubers.blog' },
    { name: 'Phuoptimizer 81',       program: 'Software Referral',    baseRate: 0.10, url: '#' },
    { name: 'Phu AI Pro',            program: 'AI Tools Affiliate',   baseRate: 0.09, url: '#' },
    { name: 'Remote Work Network',   program: 'Job Board Affiliate',  baseRate: 0.06, url: '#' },
];

const REMOTE_JOB_TEMPLATES = [
    { title: 'Backend API Developer',      company: 'TechNova Inc.',       pay: 85,  skills: ['Node.js', 'REST', 'PostgreSQL'] },
    { title: 'Machine Learning Engineer',  company: 'DataFlow Corp.',      pay: 120, skills: ['Python', 'TensorFlow', 'AWS'] },
    { title: 'Frontend React Developer',   company: 'UX Studio Ltd.',      pay: 75,  skills: ['React', 'TypeScript', 'CSS'] },
    { title: 'DevOps Automation',          company: 'CloudOps Global',     pay: 95,  skills: ['Docker', 'Kubernetes', 'CI/CD'] },
    { title: 'Data Analyst',               company: 'Insight Analytics',   pay: 65,  skills: ['SQL', 'Python', 'Tableau'] },
    { title: 'Full-Stack Engineer',        company: 'Rapid Build Co.',     pay: 100, skills: ['Vue.js', 'Django', 'Redis'] },
    { title: 'AI Content Optimizer',       company: 'ContentMind AI',      pay: 70,  skills: ['NLP', 'SEO', 'Python'] },
    { title: 'Blockchain Developer',       company: 'ChainWorks Labs',     pay: 110, skills: ['Solidity', 'Web3.js', 'Rust'] },
    { title: 'Cloud Security Analyst',     company: 'SecureNet Corp.',     pay: 90,  skills: ['AWS', 'SIEM', 'Pen Testing'] },
    { title: 'QA Automation Engineer',     company: 'QualityFirst Ltd.',   pay: 72,  skills: ['Selenium', 'Cypress', 'Jest'] },
];

const BLOG_POSTS = [
    { title: 'How Phu AI Earned Me $1,200 While I Slept',    date: 'Feb 20, 2026', tag: 'Passive Income',  img: '💸' },
    { title: 'Top 10 Remote Jobs Phu AI Found This Week',     date: 'Feb 18, 2026', tag: 'Remote Jobs',     img: '🤖' },
    { title: 'Phuoptimizer 81: Maximize Your Affiliate ROI',  date: 'Feb 15, 2026', tag: 'Affiliate',       img: '⚙️' },
    { title: 'Getting Started with Fastcash in 5 Minutes',    date: 'Feb 12, 2026', tag: 'Guide',           img: '⚡' },
    { title: 'Quantum Earnings: The phubers.blog Strategy',   date: 'Feb 10, 2026', tag: 'Strategy',        img: '🔮' },
    { title: 'Why Remote Companies Love Phu AI Workers',      date: 'Feb 7, 2026',  tag: 'Remote Jobs',     img: '💼' },
];

const TICK_INTERVAL_MS = 1000;   // earn every second
const JOB_WORK_DURATION_MS = 8000; // 8 s to simulate working a job

// ── Fastcash App ─────────────────────────────────────────────────────────────

class FastcashApp {
    constructor() {
        this.passiveTotal   = 0;
        this.affiliateTotal = 0;
        this.jobsEarned     = 0;
        this.jobsDone       = 0;
        this.optimizerLevel = 81;
        this.quantumBoost   = true;
        this.optMode        = 'quantum';
        this.jobs           = [];
        this.activeFilter   = 'all';
        this.tickCount      = 0;

        this._bindNav();
        this._bindDashboard();
        this._bindJobsTab();
        this._bindOptimizerTab();
        this._populateBlog();
        this._generateJobs();
        this._renderJobs();
        this._renderAffiliateList();
        this._renderPassiveStreams();
        this._renderOptStats();
        this._drawCanvas();
        this._startTick();

        this._log('⚡ Fastcash started. Phu AI is working for you automatically.');
        this._log('🔗 Affiliate links active via phubers.blog and partner network.');
        this._log('⚙️ Phuoptimizer 81 initialized at maximum level.');
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    _bindNav() {
        document.querySelectorAll('.fc-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => this._showTab(btn.dataset.tab));
        });

        document.querySelectorAll('.fc-hero-actions [data-tab]').forEach(btn => {
            btn.addEventListener('click', () => this._showTab(btn.dataset.tab));
        });
    }

    _showTab(tab) {
        document.querySelectorAll('.fc-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.querySelectorAll('.fc-tab').forEach(panel => panel.classList.add('hidden'));
        document.getElementById(`tab-${tab}`).classList.remove('hidden');
        if (tab === 'optimizer') this._drawCanvas();
    }

    // ── Dashboard bindings ────────────────────────────────────────────────────

    _bindDashboard() {
        document.getElementById('boostPassiveBtn').addEventListener('click', () => {
            this.passiveTotal += this._passiveRatePerSec() * 300;
            this._updateStats();
            this._toast('⚡ Phuoptimizer boost applied! 5-minute passive income added.');
            this._log('⚡ Manual Phuoptimizer boost applied to passive income engine.');
        });

        document.getElementById('refreshAffiliateBtn').addEventListener('click', () => {
            this.affiliateTotal += this._affiliateRatePerSec() * 180;
            this._updateStats();
            this._renderAffiliateList();
            this._toast('🔗 Affiliate links refreshed. New conversions detected!');
            this._log('🔗 Affiliate links refreshed through phubers.blog network.');
        });

        document.getElementById('clearLogBtn').addEventListener('click', () => {
            document.getElementById('activityLog').innerHTML = '';
        });
    }

    // ── Jobs tab bindings ─────────────────────────────────────────────────────

    _bindJobsTab() {
        document.getElementById('scanJobsBtn').addEventListener('click', () => {
            this._generateJobs(3);
            this._renderJobs();
            this._toast('🔍 Phu AI scanned 50+ companies. New jobs found!');
            this._log('🤖 Phu AI scanned remote job boards. New opportunities added.');
        });

        document.querySelectorAll('.fc-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.fc-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeFilter = btn.dataset.filter;
                this._renderJobs();
            });
        });
    }

    // ── Optimizer tab bindings ────────────────────────────────────────────────

    _bindOptimizerTab() {
        const slider = document.getElementById('optLevelSlider');
        const display = document.getElementById('optLevelDisplay');

        slider.addEventListener('input', () => {
            display.textContent = slider.value;
        });

        document.querySelectorAll('input[name="optMode"]').forEach(r => {
            r.addEventListener('change', () => { this.optMode = r.value; });
        });

        document.getElementById('quantumBoostToggle').addEventListener('change', e => {
            this.quantumBoost = e.target.checked;
        });

        document.getElementById('applyOptimizerBtn').addEventListener('click', () => {
            this.optimizerLevel = parseInt(slider.value);
            this.quantumBoost   = document.getElementById('quantumBoostToggle').checked;
            this._renderPassiveStreams();
            this._renderOptStats();
            this._drawCanvas();
            document.getElementById('passiveOptLevel').textContent = this.optimizerLevel;
            document.getElementById('passiveOptBar').style.width = `${(this.optimizerLevel / 81) * 100}%`;
            this._updateStats();
            this._toast(`⚙️ Phuoptimizer set to level ${this.optimizerLevel} (${this.optMode}).`);
            this._log(`⚙️ Phuoptimizer 81 updated → level ${this.optimizerLevel}, mode: ${this.optMode}, quantum boost: ${this.quantumBoost}.`);
        });
    }

    // ── Tick engine ───────────────────────────────────────────────────────────

    _startTick() {
        setInterval(() => {
            this.tickCount++;
            this.passiveTotal   += this._passiveRatePerSec();
            this.affiliateTotal += this._affiliateRatePerSec();
            this._updateStats();

            // Periodically log an automatic event
            if (this.tickCount % 30 === 0) {
                const stream = PASSIVE_STREAMS[Math.floor(Math.random() * PASSIVE_STREAMS.length)];
                this._log(`💰 Auto-earned $${(this._passiveRatePerSec() * 30).toFixed(2)} from ${stream.name}.`);
            }
            if (this.tickCount % 45 === 0) {
                const prog = AFFILIATE_PROGRAMS[Math.floor(Math.random() * AFFILIATE_PROGRAMS.length)];
                this._log(`🔗 New affiliate conversion via ${prog.name} (+$${(this._affiliateRatePerSec() * 45).toFixed(2)}).`);
            }
        }, TICK_INTERVAL_MS);
    }

    // ── Rate calculation ──────────────────────────────────────────────────────

    _multiplier() {
        const levelFactor = this.optimizerLevel / 81;
        const modeFactor  = this.optMode === 'quantum' ? 1.5 : this.optMode === 'advanced' ? 1.2 : 1.0;
        const boostFactor = this.quantumBoost ? 1.3 : 1.0;
        return levelFactor * modeFactor * boostFactor;
    }

    _passiveRatePerSec() {
        const base = PASSIVE_STREAMS.reduce((s, st) => s + st.baseRate, 0) / 3600;
        return base * this._multiplier();
    }

    _affiliateRatePerSec() {
        const base = AFFILIATE_PROGRAMS.reduce((s, p) => s + p.baseRate, 0) / 3600;
        return base * this._multiplier();
    }

    // ── Stats display ─────────────────────────────────────────────────────────

    _updateStats() {
        const hrPassive   = this._passiveRatePerSec() * 3600;
        const hrAffiliate = this._affiliateRatePerSec() * 3600;
        const grand = this.passiveTotal + this.affiliateTotal + this.jobsEarned;

        document.getElementById('passiveTotal').textContent   = `$${this.passiveTotal.toFixed(2)}`;
        document.getElementById('passiveRate').textContent    = `+$${hrPassive.toFixed(2)} / hr`;
        document.getElementById('affiliateTotal').textContent = `$${this.affiliateTotal.toFixed(2)}`;
        document.getElementById('affiliateRate').textContent  = `+$${hrAffiliate.toFixed(2)} / hr`;
        document.getElementById('jobsDone').textContent       = this.jobsDone;
        document.getElementById('jobsEarned').textContent     = `$${this.jobsEarned.toFixed(2)} earned`;
        document.getElementById('grandTotal').textContent     = `$${grand.toFixed(2)}`;
    }

    // ── Passive streams render ────────────────────────────────────────────────

    _renderPassiveStreams() {
        const container = document.getElementById('passiveStreams');
        container.innerHTML = '';
        PASSIVE_STREAMS.forEach(stream => {
            const rate = (stream.baseRate * this._multiplier()).toFixed(3);
            const div = document.createElement('div');
            div.className = 'fc-stream-row';
            div.innerHTML = `
                <span class="fc-stream-name">${stream.name}</span>
                <span class="fc-stream-rate">+$${rate}/hr</span>
                <span class="fc-badge fc-badge-green fc-badge-xs">AUTO</span>
            `;
            container.appendChild(div);
        });
    }

    // ── Affiliate list render ─────────────────────────────────────────────────

    _renderAffiliateList() {
        const container = document.getElementById('affiliateList');
        container.innerHTML = '';
        AFFILIATE_PROGRAMS.forEach(prog => {
            const rate = (prog.baseRate * this._multiplier()).toFixed(3);
            const div = document.createElement('div');
            div.className = 'fc-affiliate-row';
            div.innerHTML = `
                <div class="fc-affiliate-info">
                    <span class="fc-affiliate-name">${prog.name}</span>
                    <span class="fc-affiliate-prog">${prog.program}</span>
                </div>
                <div class="fc-affiliate-right">
                    <span class="fc-stream-rate">+$${rate}/hr</span>
                    <a href="${prog.url}" target="_blank" rel="noopener noreferrer" class="fc-link">Visit →</a>
                </div>
            `;
            container.appendChild(div);
        });
    }

    // ── Jobs ──────────────────────────────────────────────────────────────────

    _generateJobs(count = REMOTE_JOB_TEMPLATES.length) {
        const templates = [...REMOTE_JOB_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, count);
        templates.forEach(tpl => {
            this.jobs.push({
                id:       Date.now() + Math.random(),
                title:    tpl.title,
                company:  tpl.company,
                pay:      tpl.pay,
                skills:   tpl.skills,
                status:   'available',
                progress: 0,
            });
        });
    }

    _renderJobs() {
        const board = document.getElementById('jobBoard');
        board.innerHTML = '';
        const filtered = this.activeFilter === 'all'
            ? this.jobs
            : this.jobs.filter(j => j.status === this.activeFilter);

        if (filtered.length === 0) {
            board.innerHTML = '<p class="fc-empty">No jobs found. Click "Scan for New Jobs" to fetch more.</p>';
            return;
        }

        filtered.forEach(job => {
            const card = document.createElement('div');
            card.className = `fc-job-card fc-job-${job.status}`;
            card.innerHTML = `
                <div class="fc-job-header">
                    <div>
                        <div class="fc-job-title">${job.title}</div>
                        <div class="fc-job-company">${job.company}</div>
                    </div>
                    <div class="fc-job-pay">$${job.pay}/hr</div>
                </div>
                <div class="fc-job-skills">
                    ${job.skills.map(s => `<span class="fc-skill-tag">${s}</span>`).join('')}
                </div>
                ${job.status === 'in-progress' ? `
                    <div class="fc-job-progress-wrap">
                        <div class="fc-progress-bar-wrap"><div class="fc-progress-bar fc-progress-anim" id="jp-${job.id}" style="width:${job.progress}%"></div></div>
                        <span class="fc-job-prog-label">Phu AI working… ${Math.round(job.progress)}%</span>
                    </div>` : ''}
                <div class="fc-job-footer">
                    <span class="fc-job-status-badge fc-badge fc-badge-${this._statusColor(job.status)}">${job.status.replace('-', ' ').toUpperCase()}</span>
                    ${job.status === 'available'
                        ? `<button class="fc-btn fc-btn-primary fc-btn-sm" data-job-id="${job.id}">🤖 Work with Phu AI</button>`
                        : job.status === 'completed'
                            ? `<span class="fc-job-earned">+$${(job.pay * (JOB_WORK_DURATION_MS / 3600000)).toFixed(2)} earned</span>`
                            : ''}
                </div>
            `;
            board.appendChild(card);
        });

        // Bind "Work" buttons
        board.querySelectorAll('[data-job-id]').forEach(btn => {
            btn.addEventListener('click', () => this._startJob(btn.dataset.jobId));
        });
    }

    _startJob(jobId) {
        const job = this.jobs.find(j => String(j.id) === String(jobId));
        if (!job || job.status !== 'available') return;
        job.status   = 'in-progress';
        job.progress = 0;
        this._renderJobs();
        this._log(`🤖 Phu AI started working on "${job.title}" at ${job.company} ($${job.pay}/hr).`);
        this._toast(`🤖 Phu AI is now working: ${job.title}`);

        const interval = setInterval(() => {
            job.progress = Math.min(100, job.progress + (100 / (JOB_WORK_DURATION_MS / 200)));
            const bar = document.getElementById(`jp-${job.id}`);
            if (bar) bar.style.width = `${job.progress}%`;
            if (job.progress >= 100) {
                clearInterval(interval);
                job.status = 'completed';
                const earned = job.pay * (JOB_WORK_DURATION_MS / 3600000);
                this.jobsDone++;
                this.jobsEarned += earned;
                this._updateStats();
                this._renderJobs();
                this._log(`✅ Job completed: "${job.title}". Earned $${earned.toFixed(2)}.`);
                this._toast(`✅ Job done! Earned $${earned.toFixed(2)} from ${job.company}`);
            }
        }, 200);
    }

    _statusColor(status) {
        return status === 'available' ? 'blue' : status === 'in-progress' ? 'yellow' : 'green';
    }

    // ── Optimizer stats & canvas ──────────────────────────────────────────────

    _renderOptStats() {
        const m = this._multiplier();
        const hrPassive   = (this._passiveRatePerSec() * 3600).toFixed(2);
        const hrAffiliate = (this._affiliateRatePerSec() * 3600).toFixed(2);
        document.getElementById('optStats').innerHTML = `
            <div class="fc-opt-stat-row"><span>Level</span><strong>${this.optimizerLevel} / 81</strong></div>
            <div class="fc-opt-stat-row"><span>Mode</span><strong>${this.optMode.charAt(0).toUpperCase() + this.optMode.slice(1)}</strong></div>
            <div class="fc-opt-stat-row"><span>Quantum Boost</span><strong>${this.quantumBoost ? '✅ ON' : '❌ OFF'}</strong></div>
            <div class="fc-opt-stat-row"><span>Multiplier</span><strong>${m.toFixed(2)}×</strong></div>
            <div class="fc-opt-stat-row"><span>Passive / hr</span><strong>$${hrPassive}</strong></div>
            <div class="fc-opt-stat-row"><span>Affiliate / hr</span><strong>$${hrAffiliate}</strong></div>
        `;
    }

    _drawCanvas() {
        const canvas = document.getElementById('optCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, 0, W, H);

        // Draw optimization wave
        const m = this._multiplier();
        ctx.beginPath();
        ctx.strokeStyle = this.quantumBoost ? '#a78bfa' : '#34d399';
        ctx.lineWidth = 2;
        for (let x = 0; x < W; x++) {
            const t = (x / W) * Math.PI * 4;
            const amp = (H / 2) * 0.6 * (this.optimizerLevel / 81);
            const y = (H / 2) + Math.sin(t + Date.now() / 800) * amp * Math.sin(t / 2 + m);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Particles
        for (let i = 0; i < 12; i++) {
            const px = (Math.sin(i * 1.7 + Date.now() / 1200) * 0.5 + 0.5) * W;
            const py = (Math.cos(i * 2.1 + Date.now() / 900)  * 0.5 + 0.5) * H;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.quantumBoost ? 'rgba(167,139,250,0.8)' : 'rgba(52,211,153,0.8)';
            ctx.fill();
        }

        requestAnimationFrame(() => {
            const activeTab = document.querySelector('.fc-tab:not(.hidden)');
            if (activeTab && activeTab.id === 'tab-optimizer') this._drawCanvas();
        });
    }

    // ── Blog ──────────────────────────────────────────────────────────────────

    _populateBlog() {
        const grid = document.getElementById('blogFeed');
        BLOG_POSTS.forEach(post => {
            const card = document.createElement('div');
            card.className = 'fc-blog-card';
            card.innerHTML = `
                <div class="fc-blog-img">${post.img}</div>
                <div class="fc-blog-body">
                    <span class="fc-badge fc-badge-blue fc-badge-xs">${post.tag}</span>
                    <h3 class="fc-blog-title">${post.title}</h3>
                    <div class="fc-blog-date">${post.date}</div>
                    <a href="https://phubers.blog" target="_blank" rel="noopener noreferrer" class="fc-link">Read more →</a>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // ── Utilities ─────────────────────────────────────────────────────────────

    _log(msg) {
        const log = document.getElementById('activityLog');
        const time = new Date().toLocaleTimeString();
        const row = document.createElement('div');
        row.className = 'fc-log-row';
        row.innerHTML = `<span class="fc-log-time">${time}</span><span>${msg}</span>`;
        log.prepend(row);
        // Keep log manageable
        while (log.children.length > 80) log.removeChild(log.lastChild);
    }

    _toast(msg) {
        const el = document.getElementById('fcToast');
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
    }
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => { new FastcashApp(); });
