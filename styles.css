:root{
    --bg:#05070b;
    --bg2:#0a0f17;
    --panel:#101722;
    --orange:#ff5a1f;
    --orange2:#ff8b45;
    --cyan:#25d9e6;
    --white:#fff;
    --text:#e8edf3;
    --muted:#98a4b3;
    --border:rgba(255,255,255,.10);
    --shadow:0 20px 60px rgba(0,0,0,.45);
}

*{
    box-sizing:border-box;
    margin:0;
    padding:0;
}

html{
    scroll-behavior:smooth;
    scroll-padding-top:80px;
}

body{
    background:
        radial-gradient(
            circle at 80% 10%,
            rgba(255,90,31,.12),
            transparent 35%
        ),
        #05070b;
    color:var(--text);
    font-family:Arial,Helvetica,sans-serif;
    line-height:1.5;
    padding-bottom:90px;
}

a{
    color:inherit;
    text-decoration:none;
}

button{
    font:inherit;
}


/* =========================
   HEADER
========================= */

.topbar{
    position:sticky;
    top:0;
    z-index:1000;
    min-height:72px;
    display:flex;
    align-items:center;
    gap:25px;
    padding:12px 5%;
    background:rgba(5,7,11,.90);
    border-bottom:1px solid var(--border);
    backdrop-filter:blur(18px);
}

.brand{
    font-size:27px;
    font-weight:900;
    white-space:nowrap;
}

.brand strong{
    color:var(--orange);
}

.live-indicator{
    display:flex;
    align-items:center;
    gap:7px;
    color:#fff;
    font-size:11px;
    font-weight:900;
    letter-spacing:1px;
}

.live-indicator i{
    width:8px;
    height:8px;
    border-radius:50%;
    background:#ff2424;
    box-shadow:0 0 12px #ff2424;
    animation:pulse 1.2s infinite;
}

@keyframes pulse{
    50%{opacity:.35}
}

nav{
    margin-left:auto;
    display:flex;
    gap:20px;
}

nav a{
    color:#aeb8c5;
    font-size:12px;
    font-weight:800;
}

nav a:hover{
    color:#fff;
}


/* =========================
   HERO
========================= */

.hero{
    min-height:calc(100vh - 72px);
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:80px 20px;
    position:relative;
    overflow:hidden;
}

.hero::before{
    content:"";
    position:absolute;
    inset:0;
    opacity:.12;
    background-image:
        linear-gradient(
            rgba(255,255,255,.08) 1px,
            transparent 1px
        ),
        linear-gradient(
            90deg,
            rgba(255,255,255,.08) 1px,
            transparent 1px
        );
    background-size:55px 55px;
}

.hero-content{
    position:relative;
    z-index:1;
}

.hero-label{
    color:var(--orange);
    font-size:11px;
    font-weight:900;
    letter-spacing:3px;
}

.hero h1{
    margin-top:15px;
    font-size:clamp(65px,12vw,150px);
    line-height:.9;
    letter-spacing:-7px;
}

.hero h1 strong{
    color:var(--orange);
}

.hero h2{
    margin-top:25px;
    font-size:clamp(15px,2vw,23px);
    color:#c6ced8;
}

.hero p{
    margin-top:18px;
    color:var(--cyan);
    font-size:16px;
    font-weight:900;
    letter-spacing:4px;
}

.hero-button,
.tv-button{
    display:inline-block;
    margin-top:30px;
    padding:15px 25px;
    border-radius:50px;
    background:linear-gradient(
        135deg,
        var(--orange),
        var(--orange2)
    );
    color:#fff;
    font-size:12px;
    font-weight:900;
    box-shadow:0 10px 30px rgba(255,90,31,.25);
}


/* =========================
   SECTIONS
========================= */

.section{
    padding:95px 6%;
}

.section-title{
    max-width:850px;
    margin:0 auto 45px;
    text-align:center;
}

.section-title span,
.section-mini{
    color:var(--orange);
    font-size:11px;
    font-weight:900;
    letter-spacing:3px;
}

.section-title h2{
    margin-top:8px;
    font-size:clamp(35px,5vw,60px);
    line-height:1;
}

.section-title p{
    margin-top:15px;
    color:var(--muted);
}


/* =========================
   PLAYER
========================= */

.radio-section{
    background:#080c12;
}

.radio-player{
    max-width:850px;
    margin:auto;
    padding:35px;
    border-radius:22px;
    background:
        linear-gradient(
            145deg,
            rgba(255,255,255,.07),
            rgba(255,255,255,.025)
        );
    border:1px solid var(--border);
    box-shadow:var(--shadow);
}

.player-top{
    display:flex;
    align-items:center;
    gap:20px;
}

.station-logo{
    width:90px;
    height:90px;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    border-radius:20px;
    background:#090c12;
    border:1px solid var(--border);
}

.station-logo span{
    font-size:16px;
    font-weight:900;
}

.station-logo strong{
    font-size:31px;
    color:var(--orange);
    line-height:.8;
}

.on-air{
    color:#ff4545;
    font-size:10px;
    font-weight:900;
    letter-spacing:2px;
}

.station-info h3,
.player-top h3{
    margin-top:5px;
    font-size:24px;
}

.player-top p{
    color:var(--muted);
}

.equalizer{
    height:110px;
    display:flex;
    justify-content:center;
    align-items:center;
    gap:5px;
    margin:30px 0 20px;
}

.equalizer i{
    width:6px;
    height:20px;
    border-radius:5px;
    background:linear-gradient(
        to top,
        var(--orange),
        var(--cyan)
    );
}

.equalizer.active i{
    animation:eq 1s ease-in-out infinite alternate;
}

.equalizer i:nth-child(2){animation-delay:.1s}
.equalizer i:nth-child(3){animation-delay:.2s}
.equalizer i:nth-child(4){animation-delay:.3s}
.equalizer i:nth-child(5){animation-delay:.4s}
.equalizer i:nth-child(6){animation-delay:.5s}
.equalizer i:nth-child(7){animation-delay:.6s}
.equalizer i:nth-child(8){animation-delay:.7s}
.equalizer i:nth-child(9){animation-delay:.8s}
.equalizer i:nth-child(10){animation-delay:.9s}
.equalizer i:nth-child(11){animation-delay:1s}
.equalizer i:nth-child(12){animation-delay:1.1s}

@keyframes eq{
    from{height:15px}
    to{height:90px}
}

.player-controls{
    display:flex;
    justify-content:center;
    gap:15px;
}

.play-button{
    width:72px;
    height:72px;
    border:0;
    border-radius:50%;
    cursor:pointer;
    background:var(--orange);
    color:#fff;
    font-size:25px;
    box-shadow:0 10px 30px rgba(255,90,31,.35);
}

.control-button{
    width:46px;
    height:46px;
    margin-top:13px;
    border-radius:50%;
    border:1px solid var(--border);
    background:#121822;
    color:#fff;
    cursor:pointer;
}

.player-status{
    margin-top:18px;
    text-align:center;
    color:var(--muted);
    font-size:13px;
}


/* =========================
   AHORA EN VIVO
========================= */

.now-section{
    padding:35px 6%;
    background:
        linear-gradient(
            90deg,
            #0c1119,
            #121a24
        );
    border-top:1px solid var(--border);
    border-bottom:1px solid var(--border);
}

.now-container{
    max-width:1200px;
    margin:auto;
}

.now-live{
    display:flex;
    align-items:center;
    gap:8px;
    color:var(--orange);
    font-size:10px;
    font-weight:900;
    letter-spacing:2px;
}

.now-dot{
    width:7px;
    height:7px;
    border-radius:50%;
    background:#ff3333;
    box-shadow:0 0 10px #ff3333;
}

.now-main{
    display:grid;
    grid-template-columns:150px 1fr 200px;
    align-items:center;
    gap:30px;
    margin-top:15px;
}

.now-time span{
    display:block;
    color:#fff;
    font-size:36px;
    font-weight:900;
}

.now-time small{
    color:var(--muted);
    font-size:10px;
    letter-spacing:2px;
}

.now-program span,
.next-program span{
    color:var(--cyan);
    font-size:9px;
    font-weight:900;
    letter-spacing:2px;
}

.now-program h2{
    margin-top:3px;
    font-size:30px;
    color:#fff;
}

.now-program h3{
    color:var(--orange);
    font-size:16px;
}

.now-program p{
    color:var(--muted);
    font-size:12px;
}

.next-program{
    border-left:1px solid var(--border);
    padding-left:25px;
}

.next-program strong{
    display:block;
    margin-top:5px;
    color:#fff;
    font-size:16px;
}

.next-program small{
    color:var(--muted);
}


/* =========================
   NEWS
========================= */

.news-section{
    background:#f3f5f8;
    color:#111;
}

.news-section .section-title h2{
    color:#111;
}

.news-section .section-title p{
    color:#657180;
}

.news-tabs{
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    gap:10px;
    margin-bottom:35px;
}

.news-tab{
    padding:11px 18px;
    border-radius:50px;
    border:1px solid #d5dae0;
    background:#fff;
    color:#3c4652;
    font-size:11px;
    font-weight:900;
    cursor:pointer;
}

.news-tab.active,
.news-tab:hover{
    background:#111820;
    color:#fff;
}

.news-grid{
    max-width:1200px;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
}

.news-card{
    background:#fff;
    padding:23px;
    border:1px solid #e0e4e8;
    border-radius:18px;
    box-shadow:0 10px 30px rgba(0,0,0,.06);
}

.news-source{
    color:#eb5117;
    font-size:10px;
    font-weight:900;
    letter-spacing:1px;
}

.news-card h3{
    margin-top:10px;
    color:#111820;
    font-size:18px;
    line-height:1.3;
}

.news-card p{
    margin-top:10px;
    color:#75808d;
    font-size:12px;
}

.news-card a{
    display:inline-block;
    margin-top:17px;
    color:#e95118;
    font-size:11px;
    font-weight:900;
}

.news-loading{
    grid-column:1/-1;
    min-height:180px;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    color:#697481;
}

.loading-circle{
    width:35px;
    height:35px;
    border-radius:50%;
    border:3px solid #d9dee3;
    border-top-color:#e95118;
    animation:spin 1s linear infinite;
    margin-bottom:12px;
}

@keyframes spin{
    to{transform:rotate(360deg)}
}

.refresh-button{
    display:block;
    margin:35px auto 0;
    padding:13px 20px;
    border:0;
    border-radius:50px;
    background:#111820;
    color:#fff;
    font-size:11px;
    font-weight:900;
    cursor:pointer;
}


/* =========================
   PROGRAMACION
========================= */

.schedule-section{
    background:#090d14;
}

.schedule-grid{
    max-width:1200px;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:20px;
}

.program-card{
    padding:25px;
    min-height:220px;
    border-radius:20px;
    background:linear-gradient(
        145deg,
        #151d28,
        #0a1017
    );
    border:1px solid var(--border);
    position:relative;
    overflow:hidden;
}

.program-card.current{
    border-color:var(--orange);
    box-shadow:
        0 0 0 1px rgba(255,90,31,.15),
        0 15px 40px rgba(255,90,31,.10);
}

.program-card.current::before{
    content:"● AHORA";
    position:absolute;
    top:15px;
    right:15px;
    color:var(--orange);
    font-size:9px;
    font-weight:900;
    letter-spacing:1px;
}

.program-time{
    color:var(--cyan);
    font-size:10px;
    font-weight:900;
}

.program-number{
    margin-top:18px;
    color:rgba(255,255,255,.12);
    font-size:42px;
    font-weight:900;
}

.program-card h3{
    color:#fff;
    font-size:25px;
}

.program-card h4{
    color:var(--orange);
    font-size:13px;
}

.program-card p{
    margin-top:8px;
    color:var(--muted);
    font-size:12px;
}


/* =========================
   TV
========================= */

.tv-section{
    background:#05070b;
}

.tv-content{
    max-width:1150px;
    margin:auto;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:60px;
    align-items:center;
}

.tv-content h2{
    margin-top:10px;
    font-size:clamp(45px,6vw,75px);
}

.tv-content p{
    margin-top:20px;
    color:var(--muted);
}

.tv-screen{
    aspect-ratio:16/10;
    padding:12px;
    border-radius:20px;
    background:#161c25;
    border:1px solid var(--border);
}

.tv-screen-inner{
    width:100%;
    height:100%;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    border-radius:12px;
    background:#080b11;
}

.tv-screen-inner span{
    font-size:30px;
    font-weight:900;
}

.tv-screen-inner strong{
    font-size:80px;
    line-height:.75;
    color:var(--orange);
}

.tv-screen-inner small{
    margin-top:20px;
    color:var(--cyan);
    letter-spacing:3px;
}


/* =========================
   SOCIAL
========================= */

.social-section{
    background:#f4f6f8;
}

.social-section .section-title h2{
    color:#111;
}

.social-grid{
    max-width:1100px;
    margin:auto;
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:18px;
}

.social-card{
    min-height:160px;
    padding:24px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    background:#fff;
    border:1px solid #e0e5ea;
    border-radius:20px;
    transition:.25s;
}

.social-card:hover{
    transform:translateY(-5px);
}

.social-icon{
    width:43px;
    height:43px;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:13px;
    background:#111820;
    color:#fff;
    font-size:21px;
    font-weight:900;
    margin-bottom:18px;
}

.social-card strong{
    font-size:17px;
}

.social-card small{
    margin-top:5px;
    color:#7b8592;
}

.facebook .social-icon{background:#1877f2}
.youtube .social-icon{background:#f00}
.whatsapp .social-icon{background:#20b957}

.instagram .social-icon{
    background:linear-gradient(
        135deg,
        #833ab4,
        #fd1d1d,
        #fcb045
    );
}


/* =========================
   PLAYER FIJO
========================= */

.fixed-player{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    z-index:5000;
    min-height:78px;
    padding:10px 5%;
    display:grid;
    grid-template-columns:1fr auto 1fr;
    align-items:center;
    gap:20px;
    background:rgba(5,7,11,.96);
    border-top:1px solid rgba(255,255,255,.12);
    box-shadow:0 -15px 50px rgba(0,0,0,.45);
    backdrop-filter:blur(20px);
}

.fixed-info{
    display:flex;
    align-items:center;
    gap:12px;
}

.mini-logo{
    width:46px;
    height:46px;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:12px;
    background:#101720;
    color:#fff;
    font-weight:900;
}

.mini-logo span{
    color:var(--orange);
}

.fixed-info strong{
    display:block;
    color:#fff;
    font-size:13px;
}

.fixed-info small{
    color:var(--muted);
    font-size:10px;
}

.fixed-center{
    display:flex;
    align-items:center;
    gap:18px;
}

.fixed-play{
    width:52px;
    height:52px;
    border:0;
    border-radius:50%;
    background:var(--orange);
    color:#fff;
    cursor:pointer;
    font-size:18px;
}

.fixed-eq{
    display:flex;
    align-items:center;
    gap:3px;
    height:35px;
}

.fixed-eq i{
    width:3px;
    height:10px;
    background:var(--cyan);
    border-radius:3px;
}

.fixed-eq.active i{
    animation:miniEq .7s infinite alternate;
}

.fixed-eq i:nth-child(2){animation-delay:.1s}
.fixed-eq i:nth-child(3){animation-delay:.2s}
.fixed-eq i:nth-child(4){animation-delay:.3s}
.fixed-eq i:nth-child(5){animation-delay:.4s}
.fixed-eq i:nth-child(6){animation-delay:.5s}

@keyframes miniEq{
    to{height:30px}
}

.fixed-actions{
    display:flex;
    justify-content:flex-end;
    align-items:center;
    gap:10px;
}

.fixed-actions button,
.fixed-actions a{
    border:1px solid var(--border);
    background:#111820;
    color:#fff;
    border-radius:30px;
    padding:9px 13px;
    font-size:10px;
    cursor:pointer;
}


/* =========================
   FOOTER
========================= */

footer{
    padding:55px 20px;
    text-align:center;
    background:#030507;
    color:#8f99a7;
}

.footer-brand{
    font-size:35px;
    color:#fff;
    font-weight:900;
}

.footer-brand strong{
    color:var(--orange);
}

footer p{
    margin-top:6px;
    font-size:12px;
}

.footer-line{
    width:80px;
    height:2px;
    margin:25px auto;
    background:var(--orange);
}

footer small{
    font-size:10px;
}


/* =========================
   RESPONSIVE
========================= */

@media(max-width:1000px){

    nav{
        display:none;
    }

    .news-grid{
        grid-template-columns:repeat(2,1fr);
    }

    .schedule-grid{
        grid-template-columns:repeat(2,1fr);
    }

    .social-grid{
        grid-template-columns:repeat(2,1fr);
    }

    .tv-content{
        grid-template-columns:1fr;
    }

    .now-main{
        grid-template-columns:120px 1fr;
    }

    .next-program{
        display:none;
    }
}


@media(max-width:650px){

    body{
        padding-bottom:82px;
    }

    .section{
        padding:70px 18px;
    }

    .hero h1{
        letter-spacing:-4px;
    }

    .radio-player{
        padding:22px;
    }

    .player-top{
        align-items:flex-start;
    }

    .station-logo{
        width:70px;
        height:70px;
        flex-shrink:0;
    }

    .station-info h3,
    .player-top h3{
        font-size:19px;
    }

    .news-grid,
    .schedule-grid,
    .social-grid{
        grid-template-columns:1fr;
    }

    .now-main{
        grid-template-columns:90px 1fr;
        gap:15px;
    }

    .now-time span{
        font-size:27px;
    }

    .now-program h2{
        font-size:22px;
    }

    .fixed-player{
        min-height:70px;
        padding:8px 12px;
        grid-template-columns:1fr auto;
        gap:10px;
    }

    .fixed-center{
        order:3;
    }

    .fixed-eq{
        display:none;
    }

    .fixed-actions a{
        display:none;
    }

    .fixed-info small{
        display:none;
    }

    .fixed-play{
        width:48px;
        height:48px;
    }

    .tv-screen-inner strong{
        font-size:65px;
    }
}
