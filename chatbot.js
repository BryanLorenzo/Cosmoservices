/* =========================================
   CosmoServices — Chatbot
   Rule-based, client-side, no API key needed.
   ========================================= */

(function () {
    'use strict';

    /* ── Knowledge Base ─────────────────────── */
    const KB = [
        {
            intents: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey', 'hello', 'hi'],
            response: `Ciao! 👋 Sono **Atlas**, l'assistente virtuale di CosmoServices. Sono qui per rispondere a tutte le tue domande sulla nostra agenzia e sui nostri servizi!<br><br>Come posso aiutarti oggi?`,
            quick: ['Servizi offerti', 'I nostri prezzi', 'Come contattarvi', 'La vostra vision']
        },
        {
            intents: ['grazie', 'perfetto', 'ottimo', 'bravo', 'benissimo', 'fantastico', 'top'],
            response: `Prego, è un piacere! 🚀 Se hai altre domande, sono qui. Puoi anche <a href="index.html#contatti" style="color:#a855f7;text-decoration:underline">contattarci direttamente</a> per parlare con il nostro team.`,
            quick: ['Inizia un progetto', 'Altri servizi']
        },
        {
            intents: ['arrivederci', 'bye', 'ciao ciao', 'addio', 'a presto'],
            response: `A presto! 🌟 Siamo sempre qui se hai bisogno. Non esitare a tornare o a <a href="index.html#contatti" style="color:#a855f7;text-decoration:underline">contattarci</a> per il tuo prossimo progetto!`,
            quick: []
        },

        /* ── Servizi ── */
        {
            intents: ['servizi', 'cosa fate', 'cosa offrite', 'offerta', 'cosa fanno', 'cosa fai', 'lavori', 'specializzati', 'specialty'],
            response: `Offriamo **6 servizi principali**:<br><br>
🌐 <b>Web Design Premium</b> — Siti web premium, performanti e ottimizzati per conversioni<br>
✨ <b>Branding & Identità</b> — Logo, palette, tipografia e brand guide<br>
🛒 <b>E-Commerce</b> — Shop online su Shopify, WooCommerce o custom<br>
📈 <b>SEO & Performance</b> — Ottimizzazione motori di ricerca e Core Web Vitals<br>
🎨 <b>UX Research & Design</b> — Wireframe, prototipi e A/B testing<br>
🤖 <b>Automazioni & AI</b> — Chatbot, integrazioni e workflow automatizzati<br><br>
Vuoi saperne di più su uno specifico servizio?`,
            quick: ['Web Design', 'Branding', 'E-Commerce', 'SEO', 'Automazioni AI']
        },
        {
            intents: ['web design', 'sito web', 'sito internet', 'website', 'landing page', 'pagina web'],
            response: `💻 Il nostro servizio di **Web Design Premium** include:<br><br>
• Design visivamente straordinario e altamente performante<br>
• Ottimizzazione per conversioni e UX eccezionale<br>
• Completamente responsive (mobile, tablet, desktop)<br>
• Animazioni e microinterazioni avanzate<br>
• Integrazione con CMS, form, e strumenti di marketing<br><br>
Realizziamo siti che non sono solo belli, ma che **convertono visitatori in clienti**. 🚀`,
            quick: ['Quanto costa un sito?', 'Tempi di consegna', 'Inizia un progetto']
        },
        {
            intents: ['branding', 'logo', 'identità visiva', 'brand', 'immagine coordinata', 'visual identity'],
            response: `✨ Il nostro servizio di **Branding & Identità Visiva** comprende:<br><br>
• Design del logo professionale<br>
• Definizione palette colori e tipografia<br>
• Brand guidelines complete<br>
• Materiali di comunicazione coordinati<br>
• Identità visiva coerente su tutti i canali<br><br>
Creiamo brand **memorabili e riconoscibili** che fanno emergere il tuo business dalla concorrenza.`,
            quick: ['Quanto costa il branding?', 'Inizia un progetto']
        },
        {
            intents: ['e-commerce', 'ecommerce', 'shop online', 'negozio online', 'shopify', 'woocommerce', 'vendita online'],
            response: `🛒 Il nostro servizio **E-Commerce** include:<br><br>
• Sviluppo su Shopify, WooCommerce o soluzioni custom<br>
• Checkout ottimizzato per massimizzare le conversioni<br>
• Gestione prodotti semplificata<br>
• Integrazioni pagamento sicure (Stripe, PayPal, ecc.)<br>
• Dashboard analytics e gestione ordini<br><br>
I nostri e-commerce raddoppiano mediamente le vendite dopo il lancio! 📈`,
            quick: ['Quanto costa un e-commerce?', 'Inizia un progetto']
        },
        {
            intents: ['seo', 'google', 'posizionamento', 'ricerca organica', 'keywords', 'motori di ricerca', 'performance'],
            response: `📈 Il nostro servizio **SEO & Performance** comprende:<br><br>
• SEO on-page e tecnico avanzato<br>
• Ottimizzazione Core Web Vitals (velocità, stabilità)<br>
• Ricerca keyword e content strategy<br>
• Link building e digital PR<br>
• Report analytics mensili trasparenti<br><br>
I nostri clienti raggiungono mediamente la **prima pagina di Google** per le loro keyword principali.`,
            quick: ['Quanto costa il servizio SEO?', 'Inizia un progetto']
        },
        {
            intents: ['ux', 'user experience', 'wireframe', 'prototipo', 'design', 'interfaccia', 'usabilità'],
            response: `🎨 Il nostro servizio di **UX Research & Design** comprende:<br><br>
• Analisi comportamento utenti<br>
• Wireframing e prototipazione<br>
• A/B testing e ottimizzazione conversioni<br>
• Design system scalabile<br>
• User testing e iterazione<br><br>
Progettiamo interfacce che gli utenti **amano usare** — e che convertono.`,
            quick: ['Inizia un progetto']
        },
        {
            intents: ['automazione', 'ai', 'intelligenza artificiale', 'chatbot', 'bot', 'automazioni', 'integrazione', 'workflow'],
            response: `🤖 Il nostro servizio **Automazioni & AI** include:<br><br>
• Chatbot AI personalizzati per il tuo business<br>
• Automazioni marketing (email, CRM, lead generation)<br>
• Integrazioni tra strumenti (Zapier, Make, custom API)<br>
• Analisi dati con intelligenza artificiale<br>
• Ottimizzazione processi aziendali con AI<br><br>
Risparmi tempo, riduci i costi e offri un'esperienza cliente superiore. ⚡`,
            quick: ['Quanto costa?', 'Inizia un progetto']
        },

        /* ── Prezzi ── */
        {
            intents: ['prezzi', 'costo', 'quanto costa', 'tariffe', 'preventivo', 'budget', 'prezzo', 'listino', 'euro', '€'],
            response: `💰 I nostri prezzi variano in base alla complessità del progetto:<br><br>
• <b>Sito web base</b> — da €800 – €2.000<br>
• <b>Sito web premium</b> — da €2.000 – €8.000<br>
• <b>E-Commerce</b> — da €1.500 – €12.000<br>
• <b>Branding completo</b> — da €500 – €3.000<br>
• <b>SEO mensile</b> — da €300 – €1.500/mese<br>
• <b>Automazioni & AI</b> — da €500 – €5.000<br><br>
Ogni progetto è unico! Contattaci per un **preventivo personalizzato gratuito** in 24h. 🚀`,
            quick: ['Richiedi un preventivo', 'Cosa include il web design?']
        },

        /* ── Processo / Metodo ── */
        {
            intents: ['processo', 'metodo', 'come lavorate', 'come funziona', 'fasi', 'step', 'procedura', 'workflow lavoro'],
            response: `⚙️ Il nostro processo in **4 step**:<br><br>
<b>01 — Analisi delle necessità</b><br>
Ascoltiamo le tue esigenze, studiamo il mercato e definiamo gli obiettivi.<br><br>
<b>02 — Prima bozza in 24h</b><br>
Entro 24h dalla call iniziale ti presentiamo una prima bozza o concept.<br><br>
<b>03 — Revisioni illimitate</b><br>
Iteriamo insieme finché non sei al 100% soddisfatto — senza costi extra.<br><br>
<b>04 — Collaudo e Lancio</b><br>
Testing completo, ottimizzazione e lancio del progetto. Ti seguiamo anche dopo.<br><br>
<a href="metodo.html" style="color:#a855f7;text-decoration:underline">Scopri il processo nel dettaglio →</a>`,
            quick: ['Tempi di consegna', 'Inizia un progetto']
        },
        {
            intents: ['tempo', 'tempi', 'quanto tempo', 'consegna', 'deadline', 'settimane', 'giorni', 'durata'],
            response: `⏱️ I tempi dipendono dal tipo di progetto:<br><br>
• <b>Landing page</b> — 3–5 giorni lavorativi<br>
• <b>Sito vetrina</b> — 1–3 settimane<br>
• <b>Sito web premium</b> — 2–5 settimane<br>
• <b>E-Commerce</b> — 3–6 settimane<br>
• <b>Branding completo</b> — 1–2 settimane<br><br>
Rispettiamo sempre le deadline concordate. La <b>prima bozza</b> è sempre pronta entro 24h! 🚀`,
            quick: ['Come iniziare?', 'I nostri prezzi']
        },

        /* ── Vision ── */
        {
            intents: ['vision', 'missione', 'obiettivo', 'perché', 'perche', 'filosofia', 'valori', 'chi siete', 'cosa siete'],
            response: `🌍 La nostra **vision** è semplice ma potente:<br><br>
<i>"Il digitale è per tutti. Nessuno escluso."</i><br><br>
Viviamo in un'era in cui le innovazioni tecnologiche evolvono a una velocità vertiginosa, e troppe persone e imprese si sentono tagliate fuori. Noi esistiamo per cambiare questo.<br><br>
La nostra missione è rendere il digitale **semplice, accessibile e potente** per chiunque — portando ogni business a funzionare al 110%.<br><br>
<a href="vision.html" style="color:#a855f7;text-decoration:underline">Scopri la nostra vision completa →</a>`,
            quick: ['Chi siete?', 'I vostri valori', 'Inizia un progetto']
        },
        {
            intents: ['chi siete', 'chi siamo', 'team', 'squadra', 'fondatori', 'storia', 'agenzia'],
            response: `🚀 **CosmoServices** è una web design agency italiana specializzata in soluzioni digitali premium.<br><br>
Siamo un team di **designer, sviluppatori e strateghi digitali** uniti da un unico obiettivo: far brillare il tuo brand in un universo digitale sempre più affollato.<br><br>
I nostri numeri parlano chiaro:<br>
• **150+ progetti** completati<br>
• **98%** clienti soddisfatti<br>
• **5★** rating medio<br>
• **8 anni** di esperienza<br><br>
Ogni progetto per noi è una missione! 🌟`,
            quick: ['I vostri servizi', 'Inizia un progetto', 'Testimoniali']
        },

        /* ── Portfolio / Clienti ── */
        {
            intents: ['portfolio', 'lavori', 'progetti', 'esempi', 'casi studio', 'clienti', 'testimonianze', 'recensioni'],
            response: `🎨 **Alcuni dei nostri progetti:**<br><br>
• 🏨 <b>Luxury Hotel Milano</b> — Sito web premium con booking integrato<br>
• 👗 <b>Aurora Fashion</b> — E-commerce con AI styling assistant<br>
• 🎵 <b>SoundWave Records</b> — Identità visiva completa per label musicale<br><br>
I nostri clienti riportano risultati straordinari: **+340% contatti**, **+100% vendite online**, prima pagina su Google.<br><br>
<a href="index.html#portfolio" style="color:#a855f7;text-decoration:underline">Vedi tutto il portfolio →</a>`,
            quick: ['Testimoniali', 'Inizia un progetto']
        },
        {
            intents: ['testimonianze', 'testimoni', 'recensioni', 'feedback', 'opinioni', 'dicono', 'risultati'],
            response: `⭐ Cosa dicono i nostri clienti:<br><br>
<i>"CosmoServices ha aumentato i nostri contatti del <b>340%</b> in soli 3 mesi."</i><br>— Marco Bellini, CEO Bellini Architettura<br><br>
<i>"Il nostro e-commerce ha <b>raddoppiato le vendite</b> dal lancio."</i><br>— Sofia Ricci, Founder Atelier Ricci<br><br>
<i>"Google mi posiziona in <b>prima pagina</b> per tutte le keyword principali."</i><br>— Andrea Costa, Studio Legale Costa<br><br>
<a href="index.html#testimonials" style="color:#a855f7;text-decoration:underline">Leggi tutte le testimonianze →</a>`,
            quick: ['I nostri servizi', 'Inizia un progetto']
        },

        /* ── Contatti ── */
        {
            intents: ['contatti', 'contattare', 'contattarvi', 'parlare', 'scrivere', 'chiamare', 'email', 'telefono', 'dove siete', 'sede'],
            response: `📬 Puoi raggiungerci in più modi:<br><br>
📧 <b>Email:</b> ciao@cosmoservices.it<br>
📞 <b>Telefono:</b> +39 02 1234 5678<br>
📍 <b>Sede:</b> Milano, Italia 🇮🇹<br>
⏰ <b>Orari:</b> Lun–Ven, 9:00–18:00<br><br>
Oppure compila il <a href="index.html#contatti" style="color:#a855f7;text-decoration:underline">form sul sito</a> e ti risponderemo entro **24 ore** con idee, strategie e un preventivo personalizzato!`,
            quick: ['Come iniziare?', 'I nostri prezzi']
        },
        {
            intents: ['preventivo', 'inizia', 'iniziare', 'progetto', 'collaborazione', 'lavorare insieme', 'come si inizia', 'primo passo'],
            response: `🚀 Iniziare con CosmoServices è semplicissimo:<br><br>
<b>1.</b> Compila il <a href="index.html#contatti" style="color:#a855f7;text-decoration:underline">form di contatto</a> sul sito<br>
<b>2.</b> Ci contatti su: ciao@cosmoservices.it<br>
<b>3.</b> Chiamaci: +39 02 1234 5678<br><br>
Ti risponderemo entro **24 ore** con:<br>
• Una prima analisi gratuita del tuo progetto<br>
• Idee e strategie personalizzate<br>
• Un preventivo chiaro e senza impegno<br><br>
Nessun costo per la consulenza iniziale! 💜`,
            quick: ['Quanto costa?', 'I nostri servizi']
        },

        /* ── Domande tecniche ── */
        {
            intents: ['hosting', 'dominio', 'server', 'manutenzione', 'assistenza', 'supporto', 'dopo il lancio'],
            response: `🔧 Sì, offriamo **supporto completo post-lancio**:<br><br>
• Assistenza tecnica dedicata<br>
• Manutenzione e aggiornamenti<br>
• Consulenza su hosting e domini<br>
• Monitoraggio performance e uptime<br>
• Aggiornamenti di sicurezza<br><br>
CosmoServices non è solo un fornitore — è un **partner strategico a lungo termine**. Restiamo al tuo fianco mentre il tuo business cresce! 🌟`,
            quick: ['I nostri prezzi', 'Contattaci']
        },
        {
            intents: ['cms', 'wordpress', 'gestire', 'modificare', 'aggiornare', 'autonomamente', 'pannello'],
            response: `✅ Assolutamente sì! Realizziamo siti con **pannelli di gestione intuitivi** che ti permettono di:<br><br>
• Aggiungere e modificare contenuti in autonomia<br>
• Gestire prodotti (per e-commerce)<br>
• Pubblicare blog e news<br>
• Visualizzare statistiche<br><br>
Utilizziamo WordPress, soluzioni headless o CMS custom a seconda delle esigenze. Ti formiamo anche all'uso del pannello! 📚`,
            quick: ['Web Design premium', 'Inizia un progetto']
        },
        {
            intents: ['mobile', 'smartphone', 'responsive', 'app', 'ios', 'android'],
            response: `📱 Tutti i nostri siti sono **completamente responsive** e ottimizzati per:<br><br>
• 📱 Smartphone (iOS e Android)<br>
• 📟 Tablet<br>
• 💻 Desktop<br>
• 🖥️ Monitor wide<br><br>
Con oltre il 60% del traffico web proveniente da mobile, è una priorità assoluta per noi. Testiamo ogni progetto su decine di dispositivi e browser!`,
            quick: ['Web Design', 'I nostri prezzi']
        },

        /* ── Fallback ── */
        {
            intents: ['__fallback__'],
            response: `Hmm, non sono sicuro di aver capito la tua domanda! 🤔<br><br>Posso aiutarti con informazioni su:<br>• I nostri <b>servizi</b> (web design, branding, SEO...)<br>• <b>Prezzi</b> e preventivi<br>• Il nostro <b>metodo di lavoro</b><br>• Come <b>contattarci</b><br>• La nostra <b>vision</b><br><br>Oppure puoi <a href="index.html#contatti" style="color:#a855f7;text-decoration:underline">contattarci direttamente</a> per parlare con il team! 🚀`,
            quick: ['Servizi offerti', 'I nostri prezzi', 'Come contattarvi']
        }
    ];

    /* ── Quick Reply shortcuts ─────────────── */
    const QUICK_TRIGGERS = {
        'Servizi offerti': 'servizi',
        'I nostri prezzi': 'prezzi',
        'Come contattarvi': 'contatti',
        'La vostra vision': 'vision',
        'Web Design': 'web design',
        'Branding': 'branding',
        'E-Commerce': 'e-commerce',
        'SEO': 'seo',
        'Automazioni AI': 'automazione ai',
        'Quanto costa un sito?': 'quanto costa un sito',
        'Tempi di consegna': 'tempi di consegna',
        'Inizia un progetto': 'preventivo',
        'Come iniziare?': 'come iniziare',
        'Chi siete?': 'chi siete',
        'I vostri valori': 'valori',
        'Testimoniali': 'testimonianze',
        'Richiedi un preventivo': 'preventivo',
        'Cosa include il web design?': 'web design',
        'Altri servizi': 'servizi',
        'Contattaci': 'contatti',
        'Quanto costa?': 'prezzi',
        'Quanto costa il branding?': 'prezzi branding',
        'Quanto costa un e-commerce?': 'prezzi e-commerce',
        'Quanto costa il servizio SEO?': 'prezzi seo',
    };

    /* ── Matcher ───────────────────────────── */
    function findResponse(text) {
        const lower = text.toLowerCase().trim();
        let best = null;
        let bestScore = 0;

        for (const entry of KB) {
            if (entry.intents[0] === '__fallback__') continue;
            let score = 0;
            for (const kw of entry.intents) {
                if (lower.includes(kw)) {
                    score += kw.length; // longer match = higher weight
                }
            }
            if (score > bestScore) {
                bestScore = score;
                best = entry;
            }
        }

        if (!best || bestScore === 0) {
            best = KB.find(e => e.intents[0] === '__fallback__');
        }
        return best;
    }

    /* ── DOM Helpers ───────────────────────── */
    function escapeHtml(t) {
        return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Convert **text** → <b>text</b>
    function parseMd(text) {
        return text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    }

    function buildMessage(html, role) {
        const wrap = document.createElement('div');
        wrap.className = `cs-msg cs-msg--${role}`;
        const bubble = document.createElement('div');
        bubble.className = 'cs-bubble';
        bubble.innerHTML = role === 'bot' ? parseMd(html) : html;
        if (role === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'cs-avatar';
            avatar.textContent = '🤖';
            wrap.appendChild(avatar);
        }
        wrap.appendChild(bubble);
        return wrap;
    }

    function buildQuickReplies(items, container) {
        if (!items || items.length === 0) return;
        const row = document.createElement('div');
        row.className = 'cs-quick-row';
        items.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'cs-quick-btn';
            btn.textContent = label;
            btn.onclick = () => {
                row.remove();
                const query = QUICK_TRIGGERS[label] || label;
                sendMessage(query, label);
            };
            row.appendChild(btn);
        });
        container.appendChild(row);
    }

    function scrollToBottom(el) {
        el.scrollTop = el.scrollHeight;
    }

    /* ── Typing Indicator ──────────────────── */
    function showTyping(bodEl) {
        const wrap = document.createElement('div');
        wrap.className = 'cs-msg cs-msg--bot cs-typing-wrap';
        const avatar = document.createElement('div');
        avatar.className = 'cs-avatar';
        avatar.textContent = '🤖';
        wrap.appendChild(avatar);
        const bubble = document.createElement('div');
        bubble.className = 'cs-bubble cs-typing';
        bubble.innerHTML = '<span></span><span></span><span></span>';
        wrap.appendChild(bubble);
        bodEl.appendChild(wrap);
        scrollToBottom(bodEl);
        return wrap;
    }

    /* ── Send Message ──────────────────────── */
    function sendMessage(query, displayText) {
        const body = document.getElementById('cs-body');
        const input = document.getElementById('cs-input');

        const label = displayText || query;
        if (!label.trim()) return;

        // User bubble
        body.appendChild(buildMessage(escapeHtml(label), 'user'));
        if (!displayText) input.value = '';
        scrollToBottom(body);

        // Typing indicator then response
        const typing = showTyping(body);
        const delay = 600 + Math.random() * 600;

        setTimeout(() => {
            typing.remove();
            const entry = findResponse(query);
            const msgEl = buildMessage(entry.response, 'bot');
            body.appendChild(msgEl);
            scrollToBottom(body);
            if (entry.quick && entry.quick.length > 0) {
                setTimeout(() => {
                    buildQuickReplies(entry.quick, body);
                    scrollToBottom(body);
                }, 300);
            }
        }, delay);
    }

    /* ── Build Widget ──────────────────────── */
    function buildWidget() {
        const widget = document.createElement('div');
        widget.id = 'cs-widget';
        widget.innerHTML = `
      <div id="cs-window" class="cs-window cs-closed" role="dialog" aria-label="Chat CosmoServices">
        <div class="cs-header">
          <div class="cs-header-info">
            <div class="cs-header-avatar">🤖</div>
            <div>
              <div class="cs-header-name">Atlas</div>
              <div class="cs-header-status"><span class="cs-online-dot"></span>Online</div>
            </div>
          </div>
          <button class="cs-close-btn" id="cs-close" aria-label="Chiudi chat">✕</button>
        </div>

        <div class="cs-body" id="cs-body"></div>

        <div class="cs-footer">
          <input
            type="text"
            id="cs-input"
            class="cs-input"
            placeholder="Scrivi un messaggio..."
            maxlength="300"
            autocomplete="off"
            aria-label="Messaggio"
          />
          <button class="cs-send" id="cs-send" aria-label="Invia">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <button class="cs-fab" id="cs-fab" aria-label="Apri chat">
        <span class="cs-fab-icon" id="cs-fab-icon" style="font-size:1.6rem;line-height:1;">🤖</span>
        <span class="cs-fab-badge" id="cs-fab-badge">1</span>
      </button>
    `;
        document.body.appendChild(widget);
    }

    /* ── Init ──────────────────────────────── */
    function init() {
        buildWidget();

        const fab = document.getElementById('cs-fab');
        const win = document.getElementById('cs-window');
        const closeBtn = document.getElementById('cs-close');
        const sendBtn = document.getElementById('cs-send');
        const input = document.getElementById('cs-input');
        const body = document.getElementById('cs-body');
        const badge = document.getElementById('cs-fab-badge');
        let isOpen = false;

        function openChat() {
            isOpen = true;
            win.classList.remove('cs-closed');
            win.classList.add('cs-open');
            badge.style.display = 'none';
            input.focus();
        }

        function closeChat() {
            isOpen = false;
            win.classList.remove('cs-open');
            win.classList.add('cs-closed');
        }

        fab.addEventListener('click', () => isOpen ? closeChat() : openChat());
        closeBtn.addEventListener('click', closeChat);

        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) sendMessage(input.value.trim());
        });

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && input.value.trim()) {
                sendMessage(input.value.trim());
            }
        });

        // Welcome message after brief delay
        setTimeout(() => {
            const welcome = findResponse('ciao');
            const msgEl = buildMessage(welcome.response, 'bot');
            body.appendChild(msgEl);
            buildQuickReplies(welcome.quick, body);
            scrollToBottom(body);
            // Show badge after 3s
            setTimeout(() => {
                if (!isOpen) badge.style.display = 'flex';
            }, 3000);
        }, 800);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
