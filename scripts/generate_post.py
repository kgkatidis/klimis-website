#!/usr/bin/env python3
"""
generate_post.py — Generates a Greek psychology blog post via Claude API
and inserts it into blog.html + sitemap.xml automatically.

Usage: ANTHROPIC_API_KEY=xxx python scripts/generate_post.py
"""

import anthropic
import json
import os
import re
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Topic pool — rotates weekly
# ---------------------------------------------------------------------------
TOPICS = [
    "Πώς να διαχειριστείτε το εργασιακό στρες",
    "Τι είναι η αυτοσυμπόνια και γιατί μετράει",
    "Ύπνος και ψυχική υγεία: η σύνδεση που αγνοούμε",
    "Πώς να μιλάτε σε παιδιά για τα συναισθήματά τους",
    "Τι είναι η ψυχολογική ανθεκτικότητα (resilience)",
    "Πένθος: τα στάδια και πώς να τα διανύσετε",
    "Η επίδραση των κοινωνικών δικτύων στην ψυχική υγεία",
    "Τι είναι η mindfulness και πώς εξασκείται",
    "Φοβίες: τι τις δημιουργεί και πώς αντιμετωπίζονται",
    "Η ψυχολογία της αναβλητικότητας",
    "Πώς να θέτετε υγιή όρια στις σχέσεις",
    "Τι είναι η συναισθηματική νοημοσύνη",
    "Τραύμα και ψυχή: μακροχρόνιες επιπτώσεις και θεραπεία",
    "Πώς να αντιμετωπίσετε την κοινωνική αγχωτικότητα",
    "Η σύνδεση σώματος-ψυχής: τι λέει η επιστήμη",
    "Γενικευμένο άγχος: τι είναι και πώς αντιμετωπίζεται",
    "Πώς να ξεπεράσετε μια σχέση που τελείωσε",
    "Κατάθλιψη: πέρα από τη λύπη",
    "Ο ρόλος της οικογένειας στη διαμόρφωση της προσωπικότητας",
    "Τι είναι η ιδεοψυχαναγκαστική διαταραχή (OCD)",
    "Αυτοεκτίμηση: πώς να τη χτίσετε ξανά",
    "Επικοινωνία στη σχέση: τεχνικές που λειτουργούν",
    "Επαγγελματική εξουθένωση (burnout): πώς αναγνωρίζεται και αντιμετωπίζεται",
    "Συναισθηματική κατανάλωση φαγητού: η ψυχολογία πίσω από αυτήν",
    "Τι προσφέρει πραγματικά η ψυχοθεραπεία",
    "Η ψυχολογία της αγάπης και των σχέσεων",
    "Τεχνικές αναπνοής για μείωση του άγχους",
    "PTSD: τι είναι, πότε εμφανίζεται και πώς θεραπεύεται",
    "Μοναξιά: επιπτώσεις στην ψυχική και σωματική υγεία",
    "Γιατί σκεφτόμαστε υπερβολικά — overthinking και πώς σταματά",
    "Τι είναι η θεραπεία αποδοχής και δέσμευσης (ACT)",
    "Ψυχολογία νέων ανθρώπων: ποιες είναι οι πιο συχνές δυσκολίες",
    "Πώς η παιδική ηλικία επηρεάζει τις σχέσεις ως ενήλικες",
    "Δυσκολίες στον ύπνο: ψυχολογικοί παράγοντες και λύσεις",
    "Τι είναι η αγχώδης διαταραχή κοινωνικού τύπου",
    "Πώς να διαχειριστείτε τη θυμό υγιεινά",
    "Ψυχολογία της δημιουργικότητας και της έκφρασης",
    "Πώς να βοηθήσετε κάποιον κοντά σας που περνά δύσκολα",
    "Τι είναι η σχεσιακή ψυχοθεραπεία",
    "Η σχέση άγχους και τελειομανίας",
]

GREEK_MONTHS = {
    1: "Ιαν.", 2: "Φεβ.", 3: "Μαρ.", 4: "Απρ.", 5: "Μαΐου", 6: "Ιουν.",
    7: "Ιουλ.", 8: "Αυγ.", 9: "Σεπ.", 10: "Οκτ.", 11: "Νοε.", 12: "Δεκ.",
}

GREEK_LATIN = {
    'α':'a','β':'v','γ':'g','δ':'d','ε':'e','ζ':'z','η':'i','θ':'th',
    'ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p',
    'ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','φ':'f','χ':'ch','ψ':'ps','ω':'o',
    'ά':'a','έ':'e','ή':'i','ί':'i','ό':'o','ύ':'y','ώ':'o','ϊ':'i','ΐ':'i',
    'Α':'a','Β':'v','Γ':'g','Δ':'d','Ε':'e','Ζ':'z','Η':'i','Θ':'th',
    'Ι':'i','Κ':'k','Λ':'l','Μ':'m','Ν':'n','Ξ':'x','Ο':'o','Π':'p',
    'Ρ':'r','Σ':'s','Τ':'t','Υ':'y','Φ':'f','Χ':'ch','Ψ':'ps','Ω':'o',
    'Ά':'a','Έ':'e','Ή':'i','Ί':'i','Ό':'o','Ύ':'y','Ώ':'o',
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    result = ""
    for c in text:
        if c in GREEK_LATIN:
            result += GREEK_LATIN[c]
        elif c.isalnum():
            result += c.lower()
        else:
            result += "-"
    result = re.sub(r'-+', '-', result).strip('-')
    return result[:55]


def load_state(state_file: Path) -> dict:
    if state_file.exists():
        with open(state_file, encoding='utf-8') as f:
            return json.load(f)
    return {"topic_index": 0, "image_index": 1, "post_count": 0}


def save_state(state_file: Path, state: dict):
    with open(state_file, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# AI generation
# ---------------------------------------------------------------------------

def generate_article(topic: str, client: anthropic.Anthropic) -> dict:
    prompt = f"""Γράψε ένα πλήρες άρθρο blog στα ελληνικά για ψυχολόγο στη Θεσσαλονίκη με θέμα: "{topic}"

Επέστρεψε ΜΟΝΟ ένα έγκυρο JSON αντικείμενο με αυτή ακριβώς τη δομή:
{{
  "title": "Τίτλος άρθρου (μέχρι 70 χαρακτήρες)",
  "meta_description": "SEO περιγραφή 140-160 χαρακτήρων που περιέχει τις λέξεις ψυχολόγος Θεσσαλονίκη",
  "excerpt": "Σύντομη περίληψη 2 προτάσεων για κάρτα blog",
  "keywords": "λέξη1, λέξη2, λέξη3, λέξη4, ψυχολόγος θεσσαλονίκη",
  "tags": ["Ετικέτα1", "Ετικέτα2", "Ετικέτα3"],
  "body_html": "Πλήρες HTML άρθρο τουλάχιστον 600 λέξεων. Χρησιμοποίησε <h2>, <p>, <ul><li>. Ξεκίνα με <h2>. Χωρίς <html>/<body>/<head> tags."
}}

Κανόνες:
- Επαγγελματική ελληνική γλώσσα, κατανοητή από το ευρύ κοινό
- Ζεστός, ειδικός τόνος — χωρίς ιατρικές συνταγές
- Χρησιμοποίησε "ψυχολόγος Θεσσαλονίκη" ή "στη Θεσσαλονίκη" φυσικά 2-3 φορές
- Κλείσε με πρόσκληση για τηλεφωνική επικοινωνία (ΟΧΙ email)
- Μόνο JSON — χωρίς markdown backticks ή άλλο κείμενο"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=4096,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    raw = re.sub(r'^```(?:json)?\s*', '', raw)
    raw = re.sub(r'\s*```$', '', raw)
    return json.loads(raw)


# ---------------------------------------------------------------------------
# HTML builders
# ---------------------------------------------------------------------------

def build_article_html(article: dict, filename: str, date_str: str, img_src: str) -> str:
    title       = article["title"]
    meta_desc   = article["meta_description"]
    keywords    = article["keywords"]
    body_html   = article["body_html"]
    tags        = article.get("tags", [])

    d = datetime.strptime(date_str, "%Y-%m-%d")
    tags_html   = "\n".join(f'<a href="blog.html" class="tag-cloud-link">{t}</a>' for t in tags)
    canonical   = f"https://www.klimis-giamouridis.gr/{filename}"
    full_img    = f"https://www.klimis-giamouridis.gr/{img_src}"

    jsonld = json.dumps({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": meta_desc,
        "datePublished": date_str,
        "author": {
            "@type": "Person",
            "name": "Κλήμης Γιαμουρίδης",
            "url": "https://www.klimis-giamouridis.gr/about.html"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Κλήμης Γιαμουρίδης",
            "url": "https://www.klimis-giamouridis.gr/"
        },
        "url": canonical,
        "image": full_img,
        "inLanguage": "el-GR"
    }, ensure_ascii=False, indent=2)

    return f"""<!DOCTYPE html>
<html lang="el">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{title} — Κλήμης Γιαμουρίδης</title>
    <meta name="description" content="{meta_desc}">
    <meta name="keywords" content="{keywords}">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{canonical}">
    <meta property="og:locale" content="el_GR">
    <meta property="og:type" content="article">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{meta_desc}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:site_name" content="Κλήμης Γιαμουρίδης">
    <meta property="og:image" content="https://www.klimis-giamouridis.gr/images/image_{image_num}.jpg">
    <meta property="article:published_time" content="{date_str}">
    <script type="application/ld+json">
{jsonld}
    </script>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/animate.css">
    <link rel="stylesheet" href="css/owl.carousel.min.css">
    <link rel="stylesheet" href="css/owl.theme.default.min.css">
    <link rel="stylesheet" href="css/magnific-popup.css">
    <link rel="stylesheet" href="css/flaticon.css">
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>

    <div class="wrap" role="banner">
      <div class="container">
        <div class="row">
          <div class="col-md-6 d-flex align-items-center">
            <p class="mb-0 phone pl-md-2">
              <a href="tel:+306948071449" class="mr-2"><span class="fa fa-phone mr-1" aria-hidden="true"></span> +30 69 48 071 449</a>
            </p>
          </div>
          <div class="col-md-6 d-flex justify-content-md-end">
            <nav class="social-media">
              <p class="mb-0 d-flex">
                <a href="https://www.facebook.com/k.giam" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span class="fa fa-facebook" aria-hidden="true"></span></a>
                <a href="https://www.instagram.com/klimisgiamouridis/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span class="fa fa-instagram" aria-hidden="true"></span></a>
                <a href="https://www.google.com/maps/place/Grigoriou+Palama+5,+Thessaloniki" target="_blank" rel="noopener noreferrer" aria-label="Χάρτης"><span class="fa fa-map-marker" aria-hidden="true"></span></a>
              </p>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <img src="images/logo_50x50.png" alt="Λογότυπο Κλήμης Γιαμουρίδης" width="50" height="50" loading="lazy" style="margin-right:10px;">
          <div style="line-height:1;">
            <strong>ΚΛΗΜΗΣ ΓΙΑΜΟΥΡΙΔΗΣ</strong><br>
            <small>Ειδικευμένος Γνωστικός Συμπεριφορικός Ψυχολόγος</small>
          </div>
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Μενού">
          <span class="oi oi-menu" aria-hidden="true"></span>
        </button>
        <div class="collapse navbar-collapse" id="ftco-nav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a href="index.html" class="nav-link">Αρχική</a></li>
            <li class="nav-item"><a href="about.html" class="nav-link">Βιογραφικό</a></li>
            <li class="nav-item"><a href="services.html" class="nav-link">Υπηρεσίες</a></li>
            <li class="nav-item"><a href="office.html" class="nav-link">Γραφείο</a></li>
            <li class="nav-item"><a href="contact.html" class="nav-link">Επικοινωνία</a></li>
            <li class="nav-item active"><a href="blog.html" class="nav-link">Blog</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <section class="hero-wrap hero-wrap-2" style="background-image: url('images/bg_5.png');" data-stellar-background-ratio="0.5">
      <div class="overlay" aria-hidden="true"></div>
      <div class="container">
        <div class="row no-gutters slider-text align-items-end justify-content-center">
          <div class="col-md-9 ftco-animate mb-5 text-center">
            <p class="breadcrumbs mb-0">
              <span class="mr-2"><a href="index.html">Αρχική <i class="fa fa-chevron-right" aria-hidden="true"></i></a></span>
              <span class="mr-2"><a href="blog.html">Blog <i class="fa fa-chevron-right" aria-hidden="true"></i></a></span>
              <span>Άρθρο <i class="fa fa-chevron-right" aria-hidden="true"></i></span>
            </p>
            <h1 class="mb-0 bread">{title}</h1>
          </div>
        </div>
      </div>
    </section>

    <main id="main" role="main">
      <section class="ftco-section ftco-degree-bg">
        <div class="container">
          <div class="row">
            <article class="col-lg-8 ftco-animate">
              <p><img src="{img_src}" alt="{title}" class="img-fluid" loading="lazy"></p>

              {body_html}

              <div class="tag-widget post-tag-container mb-5 mt-5">
                <div class="tagcloud">
                  {tags_html}
                </div>
              </div>

              <div class="about-author d-flex p-4 bg-light">
                <div class="bio mr-5">
                  <img src="images/about-1.jpg" alt="Κλήμης Γιαμουρίδης" class="img-fluid mb-4" loading="lazy" style="max-width:80px; border-radius:50%;">
                </div>
                <div class="desc">
                  <h3>Κλήμης Γιαμουρίδης</h3>
                  <p>Ειδικευμένος Γνωστικός Συμπεριφορικός Ψυχολόγος (MSc) — Θεσσαλονίκη. Πιστοποιημένος από την EABCT. Εξειδίκευση σε ΓΣΘ, EMDR και MMPI-2.</p>
                </div>
              </div>
            </article>

            <aside class="col-lg-4 sidebar pl-lg-5 ftco-animate">
              <div class="sidebar-box">
                <h3>Υπηρεσίες</h3>
                <ul class="list-unstyled">
                  <li><a href="services.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>Γνωστική Συμπεριφορική Θεραπεία</a></li>
                  <li><a href="services.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>EMDR / Τραυματοθεραπεία</a></li>
                  <li><a href="services.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>MMPI-2 Αξιολόγηση</a></li>
                  <li><a href="contact.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>Κλείσε ραντεβού</a></li>
                </ul>
              </div>

              <div class="sidebar-box ftco-animate">
                <h3>Ετικέτες</h3>
                <div class="tagcloud">
                  <a href="blog.html" class="tag-cloud-link">ΓΣΘ</a>
                  <a href="blog.html" class="tag-cloud-link">EMDR</a>
                  <a href="blog.html" class="tag-cloud-link">Άγχος</a>
                  <a href="blog.html" class="tag-cloud-link">Τραύμα</a>
                  <a href="blog.html" class="tag-cloud-link">Κατάθλιψη</a>
                  <a href="blog.html" class="tag-cloud-link">Πανικός</a>
                  <a href="blog.html" class="tag-cloud-link">MMPI-2</a>
                </div>
              </div>

              <div class="sidebar-box ftco-animate">
                <h3>Επικοινωνία</h3>
                <p>Θέλετε να κλείσετε ραντεβού;</p>
                <a href="contact.html" class="btn btn-primary">Επικοινωνία</a>
                <p class="mt-2"><a href="tel:+306948071449"><span class="fa fa-phone mr-1" aria-hidden="true"></span> +30 69 48 071 449</a></p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>

    <footer class="ftco-footer" role="contentinfo">
      <div class="container">
        <div class="row mb-5">
          <div class="col-sm-12 col-md">
            <div class="ftco-footer-widget mb-4">
              <h2 class="ftco-heading-2 logo"><a href="index.html">Κλήμης Γιαμουρίδης</a></h2>
              <p>Ειδικευμένος Γνωστικός Συμπεριφορικός Ψυχολόγος</p>
              <ul class="ftco-footer-social list-unstyled mt-2">
                <li><a href="https://www.facebook.com/k.giam" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><span class="fa fa-facebook" aria-hidden="true"></span></a></li>
                <li><a href="https://www.instagram.com/klimisgiamouridis/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span class="fa fa-instagram" aria-hidden="true"></span></a></li>
                <li><a href="https://www.google.com/maps/place/Grigoriou+Palama+5,+Thessaloniki" target="_blank" rel="noopener noreferrer" aria-label="Χάρτης"><span class="fa fa-map-marker" aria-hidden="true"></span></a></li>
              </ul>
            </div>
          </div>
          <div class="col-sm-12 col-md">
            <div class="ftco-footer-widget mb-4 ml-md-4">
              <h2 class="ftco-heading-2">Εξερεύνηση</h2>
              <ul class="list-unstyled">
                <li><a href="about.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>Βιογραφικό</a></li>
                <li><a href="services.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>Υπηρεσίες</a></li>
                <li><a href="office.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>Γραφείο</a></li>
                <li><a href="contact.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>Επικοινωνία</a></li>
                <li><a href="blog.html"><span class="fa fa-chevron-right mr-2" aria-hidden="true"></span>Blog</a></li>
              </ul>
            </div>
          </div>
          <div class="col-sm-12 col-md">
            <div class="ftco-footer-widget mb-4">
              <h2 class="ftco-heading-2">Στοιχεία Επικοινωνίας</h2>
              <div class="block-23 mb-3">
                <ul>
                  <li><span class="icon fa fa-map marker" aria-hidden="true"></span><span class="text">Γρηγορίου Παλαμά 5, Θεσσαλονίκη</span></li>
                  <li><a href="tel:+306948071449"><span class="icon fa fa-phone" aria-hidden="true"></span><span class="text">+30 69 48 071 449</span></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-fluid px-0 py-5 bg-black">
        <div class="container">
          <div class="row">
            <div class="col-md-12" style="color: rgba(255,255,255,.5);">
              <p class="mb-0">Copyright &copy; KLIMIS_GIAMOURIDIS <script>document.write(new Date().getFullYear());</script><br>
              Designed by <a href="https://colorlib.com" rel="noopener noreferrer" style="color:inherit;">sma4site</a></p>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <div id="ftco-loader" class="show fullscreen" aria-hidden="true"><svg class="circular" width="48px" height="48px"><circle class="path-bg" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke="#eeeeee"/><circle class="path" cx="24" cy="24" r="22" fill="none" stroke-width="4" stroke-miterlimit="10" stroke="#F96D00"/></svg></div>

    <script src="js/jquery.min.js"></script>
    <script src="js/jquery-migrate-3.0.1.min.js"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.easing.1.3.js"></script>
    <script src="js/jquery.waypoints.min.js"></script>
    <script src="js/jquery.stellar.min.js"></script>
    <script src="js/owl.carousel.min.js"></script>
    <script src="js/jquery.magnific-popup.min.js"></script>
    <script src="js/jquery.animateNumber.min.js"></script>
    <script src="js/scrollax.min.js"></script>
    <script src="js/main.js"></script>
    <script src="js/chatbot.js"></script>
  </body>
</html>"""


def build_blog_card(title: str, excerpt: str, filename: str, date_str: str, img_src: str) -> str:
    d = datetime.strptime(date_str, "%Y-%m-%d")
    day   = f"{d.day:02d}"
    month = GREEK_MONTHS[d.month]
    year  = str(d.year)

    return f"""
            <div class="col-md-4 d-flex ftco-animate">
              <div class="blog-entry justify-content-end">
                <div class="text text-center">
                  <a href="{filename}" class="block-20 img" style="background-image: url('{img_src}');" aria-label="{title}"></a>
                  <div class="meta text-center mb-2 d-flex align-items-center justify-content-center">
                    <div>
                      <span class="day">{day}</span>
                      <span class="mos">{month}</span>
                      <span class="yr">{year}</span>
                    </div>
                  </div>
                  <h3 class="heading mb-3"><a href="{filename}">{title}</a></h3>
                  <p>{excerpt}</p>
                </div>
              </div>
            </div>"""


# ---------------------------------------------------------------------------
# File updaters
# ---------------------------------------------------------------------------

def update_blog_html(blog_path: Path, new_card: str):
    content = blog_path.read_text(encoding='utf-8')
    marker = '<div class="row d-flex">'
    idx = content.find(marker)
    if idx == -1:
        raise ValueError("Δεν βρέθηκε το σημείο εισαγωγής στο blog.html")
    insert_pos = idx + len(marker)
    blog_path.write_text(content[:insert_pos] + "\n" + new_card + content[insert_pos:], encoding='utf-8')


def update_sitemap(sitemap_path: Path, filename: str, date_str: str):
    content = sitemap_path.read_text(encoding='utf-8')
    new_url = f"""  <url>
    <loc>https://www.klimis-giamouridis.gr/{filename}</loc>
    <lastmod>{date_str}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
"""
    content = content.replace("</urlset>", new_url + "</urlset>")
    sitemap_path.write_text(content, encoding='utf-8')


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def fetch_unsplash_image(slug: str, images_dir: Path) -> str:
    """Download a random psychology image from Unsplash. Returns relative path or None."""
    access_key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not access_key:
        return None

    import urllib.request
    import urllib.parse

    query = urllib.parse.quote("psychology therapy calm mindfulness")
    api_url = (
        f"https://api.unsplash.com/photos/random"
        f"?query={query}&orientation=landscape&client_id={access_key}"
    )
    try:
        req = urllib.request.Request(api_url, headers={"Accept-Version": "v1"})
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read())
        image_url = data["urls"]["regular"]  # ~1080px wide
        img_filename = f"blog-img-{slug}.jpg"
        urllib.request.urlretrieve(image_url, images_dir / img_filename)
        print(f"Εικόνα Unsplash: {img_filename}")
        return f"images/{img_filename}"
    except Exception as e:
        print(f"Unsplash απέτυχε ({e}) — χρησιμοποιείται τοπική εικόνα")
        return None


def main():
    root       = Path(__file__).parent.parent
    state_file = Path(__file__).parent / "post_state.json"

    state     = load_state(state_file)
    topic_idx = state["topic_index"] % len(TOPICS)
    image_num = state["image_index"]  # 1-6 fallback
    topic     = TOPICS[topic_idx]
    today     = datetime.now().strftime("%Y-%m-%d")

    print(f"Θέμα: {topic}")

    client  = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    article = generate_article(topic, client)

    slug     = slugify(article["title"])
    date_tag = datetime.now().strftime("%Y%m%d")
    filename = f"blog-{slug}-{date_tag}.html"

    print(f"Αρχείο: {filename}")

    # Try Unsplash first, fall back to local cycling images
    unsplash_path = fetch_unsplash_image(f"{slug}-{date_tag}", root / "images")
    if unsplash_path:
        img_src = unsplash_path
        next_image_num = image_num  # don't advance counter when using Unsplash
    else:
        img_src = f"images/image_{image_num}.jpg"
        next_image_num = (image_num % 6) + 1

    # Write article page
    (root / filename).write_text(
        build_article_html(article, filename, today, img_src),
        encoding='utf-8'
    )
    print(f"Γράφτηκε: {filename}")

    # Prepend card to blog listing
    update_blog_html(
        root / "blog.html",
        build_blog_card(article["title"], article["excerpt"], filename, today, img_src)
    )
    print("Ενημερώθηκε: blog.html")

    # Add URL to sitemap
    update_sitemap(root / "sitemap.xml", filename, today)
    print("Ενημερώθηκε: sitemap.xml")

    # Advance state
    state["topic_index"] = topic_idx + 1
    state["image_index"] = next_image_num
    state["post_count"]  = state.get("post_count", 0) + 1
    save_state(state_file, state)

    print(f"Ολοκληρώθηκε! Άρθρο #{state['post_count']}: {article['title']}")


if __name__ == "__main__":
    main()
