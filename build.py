#!/usr/bin/env python3
"""Genera las páginas de OSINTario en español, inglés y portugués.

Uso: python3 build.py   (escribe index.html, en.html, pt.html, herramientas.html, tools-en.html, ferramentas.html)
El contenido del directorio vive en directory.js; los textos de las páginas, en STR (abajo).
"""
import html, json
import re

LANGS = ["es", "en", "pt"]
HOME = {"es": "index.html", "en": "en.html", "pt": "pt.html"}
TOOLSP = {"es": "herramientas.html", "en": "tools-en.html", "pt": "ferramentas.html"}
STARP = {"es": "estrella.html", "en": "star.html", "pt": "estrela.html"}
GUIDEP = {"es": "instalacion-segura.html", "en": "safe-install.html", "pt": "instalacao-segura.html"}
LOCALE = {"es": "es_ES", "en": "en_US", "pt": "pt_PT"}
BASE = "https://osintario.github.io/"
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">')
GH = "https://github.com/osintario/osintario.github.io"

# Cada entrada: (es, en, pt)
STR = {
 "tagline": ("Fuentes abiertas, con método", "Open sources, with method", "Fontes abertas, com método"),
 "nav_dir": ("Directorio", "Directory", "Diretório"), "nav_met": ("Método", "Method", "Método"), "nav_kits": ("Kits", "Kits", "Kits"),
 "nav_about": ("Sobre mí", "About me", "Sobre mim"),
 "home_title": ("OSINTario · Herramientas OSINT en español, verificadas", "OSINTario · Verified OSINT tools and free browser toolkit", "OSINTario · Ferramentas OSINT verificadas, em português"),
 "home_desc": ("Directorio en español de herramientas OSINT verificadas y herramientas gratuitas que corren en tu navegador. Por Federico Dosio, profesor de Investigación con Fuentes Abiertas en el IUPFA.",
               "A hand-reviewed directory of OSINT tools and a free toolkit that runs in your browser. By Federico Dosio, Open Source Investigation professor at IUPFA.",
               "Diretório de ferramentas OSINT verificadas e ferramentas gratuitas que rodam no seu navegador. Por Federico Dosio, professor de Investigação com Fontes Abertas no IUPFA."),
 "by": ("Por Federico Dosio · Profesor de Investigación con Fuentes Abiertas (IFA), IUPFA", "By Federico Dosio · Open Source Investigation professor (IFA), IUPFA", "Por Federico Dosio · Professor de Investigação com Fontes Abertas (IFA), IUPFA"),
 "h1": ("Las herramientas OSINT que funcionan hoy, y cómo usarlas sin equivocarte.", "The OSINT tools that work today, and how to use them without getting it wrong.", "As ferramentas OSINT que funcionam hoje, e como usá-las sem errar."),
 "hero_p": ("Un directorio revisado a mano: qué hace cada herramienta, si sigue activa, si pide registro o pago y cuándo usarla con cuidado. Gratis y sin registro. Para cada hallazgo, el mismo principio: una pista no es una conclusión.",
            "A hand-reviewed directory: what each tool does, whether it still works, if it needs a login or payment, and when to use it with care. Free, no sign-up. One rule for every finding: a lead is not a conclusion.",
            "Um diretório revisado à mão: o que cada ferramenta faz, se ainda funciona, se pede cadastro ou pagamento e quando usá-la com cuidado. Grátis e sem cadastro. Para cada achado, o mesmo princípio: uma pista não é uma conclusão."),
 "cta_tools": ("Investigar gratis con Multi-OSINT Lite", "Investigate for free with Multi-OSINT Lite", "Investigar grátis com Multi-OSINT Lite"),
 "cta_dir": ("Ver el directorio", "Browse the directory", "Ver o diretório"),
 "l_total": ("Herramientas revisadas", "Tools reviewed", "Ferramentas revisadas"), "l_ok": ("Activas y verificadas", "Active and verified", "Ativas e verificadas"),
 "l_cat": ("Categorías", "Categories", "Categorias"), "l_date": ("Última revisión", "Last review", "Última revisão"),
 "s1_tag": ("01 · Herramientas gratuitas", "01 · Free tools", "01 · Ferramentas gratuitas"),
 "s1_h": ("Multi-OSINT Lite: investiga desde tu navegador", "Multi-OSINT Lite: investigate from your browser", "Multi-OSINT Lite: investigue pelo navegador"),
 "s1_p": ("Escribe un dato y la herramienta consulta varias fuentes abiertas a la vez. Te entrega un informe con fuente, nivel de confianza y hash SHA-256. Sin registro y sin servidor: lo que buscas no pasa por OSINTario.",
          "Type one data point and the tool queries several open sources at once. You get a report with source, confidence level and SHA-256 hash. No sign-up, no server: what you search never passes through OSINTario.",
          "Digite um dado e a ferramenta consulta várias fontes abertas ao mesmo tempo. Você recebe um relatório com fonte, nível de confiança e hash SHA-256. Sem cadastro e sem servidor: o que você busca não passa pelo OSINTario."),
 "t_domain": ("Dominio o empresa", "Domain or company", "Domínio ou empresa"),
 "t_domain_d": ("DNS, SPF y DMARC, subdominios, registro, historial, reputación y puertos expuestos.", "DNS, SPF and DMARC, subdomains, registration, history, reputation and exposed ports.", "DNS, SPF e DMARC, subdomínios, registro, histórico, reputação e portas expostas."),
 "t_ip": ("Dirección IP", "IP address", "Endereço IP"),
 "t_ip_d": ("Red, ubicación aproximada, puertos, vulnerabilidades conocidas, reputación y si es nodo de Tor.", "Network, approximate location, ports, known vulnerabilities, reputation and whether it is a Tor relay.", "Rede, localização aproximada, portas, vulnerabilidades conhecidas, reputação e se é nó Tor."),
 "t_alias": ("Alias", "Username", "Apelido"),
 "t_alias_d": ("Cuentas verificadas en GitHub y Keybase y enlaces directos a 40 plataformas.", "Verified accounts on GitHub and Keybase and direct links to 40 platforms.", "Contas verificadas no GitHub e Keybase e links diretos para 40 plataformas."),
 "t_email": ("Email", "Email", "Email"),
 "t_email_d": ("Gravatar, cuenta Proton, dominio del correo y brechas del servicio.", "Gravatar, Proton account, mail domain and service breaches.", "Gravatar, conta Proton, domínio do email e vazamentos do serviço."),
 "t_onion": ("Sitio .onion", ".onion site", "Site .onion"),
 "t_onion_d": ("Comprueba si un servicio de Tor existe y muestra títulos, idioma y fechas.", "Checks whether a Tor hidden service exists and shows titles, language and dates.", "Verifica se um serviço Tor existe e mostra títulos, idioma e datas."),
 "t_image": ("Imagen", "Image", "Imagem"),
 "t_image_d": ("EXIF, GPS y hash para tu cadena de custodia. La foto no sale de tu equipo.", "EXIF, GPS and hash for your chain of custody. The photo never leaves your device.", "EXIF, GPS e hash para sua cadeia de custódia. A foto não sai do seu equipamento."),
 "t_dorks": ("Generador de dorks", "Dork generator", "Gerador de dorks"),
 "t_dorks_d": ("13 búsquedas avanzadas listas: documentos, paneles, filtraciones y menciones.", "13 ready-made advanced searches: documents, panels, leaks and mentions.", "13 buscas avançadas prontas: documentos, painéis, vazamentos e menções."),
 "s2_tag": ("02 · Directorio", "02 · Directory", "02 · Diretório"),
 "s2_h": ("Directorio de herramientas", "Tool directory", "Diretório de ferramentas"),
 "s2_p": ("Cada ficha indica su estado y si pide registro o pago. Las marcadas \"con precaución\" pueden ser legales en tu país y aun así exigir autorización, una finalidad clara o una cuenta separada para investigar.",
          "Each card shows its status and whether it needs a login or payment. Tools marked \"use with caution\" may be legal where you live and still require authorization, a clear purpose or a separate research account.",
          "Cada ficha indica o status e se pede cadastro ou pagamento. As marcadas \"com cautela\" podem ser legais no seu país e ainda exigir autorização, finalidade clara ou uma conta separada de investigação."),
 "search": ("Buscar", "Search", "Buscar"),
 "search_ph": ("Nombre o uso: subdominios, Telegram, metadatos…", "Name or use: subdomains, Telegram, metadata…", "Nome ou uso: subdomínios, Telegram, metadados…"),
 "status": ("Estado", "Status", "Status"), "all": ("Todos", "All", "Todos"),
 "st_ok": ("Activas", "Active", "Ativas"), "st_lim": ("Con límites", "Limited", "Com limites"), "st_risk": ("Con precaución", "Use with caution", "Com cautela"), "st_no": ("Descartadas", "Discarded", "Descartadas"),
 "access": ("Acceso", "Access", "Acesso"), "ac_free": ("Libre, sin registro", "Free, no login", "Livre, sem cadastro"),
 "ac_l": ("Requiere registro", "Login required", "Requer cadastro"), "ac_p": ("De pago / funciones pagas", "Paid / paid features", "Pago / recursos pagos"),
 "legend": ("Registro: necesitas crear una cuenta (gratis) para usarla. Pago: la herramienta o sus funciones útiles cuestan dinero. Nunca uses tu cuenta personal para investigar. 🧪 La herramienta se instala: sigue la <a href=\"instalacion-segura.html\">guía de instalación segura</a>.",
            "Login: you need a (free) account to use it. Paid: the tool or its useful features cost money. Never investigate with your personal account. 🧪 The tool must be installed: follow the <a href=\"safe-install.html\">safe installation guide</a>.",
            "Cadastro: é preciso criar uma conta (grátis) para usar. Pago: a ferramenta ou seus recursos úteis custam dinheiro. Nunca investigue com sua conta pessoal. 🧪 A ferramenta é instalada: siga o <a href=\"instalacao-segura.html\">guia de instalação segura</a>."),
 "s3_tag": ("03 · Método", "03 · Method", "03 · Método"),
 "s3_h": ("El ciclo de una investigación", "The investigation cycle", "O ciclo de uma investigação"),
 "s3_p": ("Las herramientas cambian cada mes. El método es lo que hace que un informe resista la revisión de otra persona.", "Tools change every month. Method is what makes a report survive someone else's review.", "As ferramentas mudam todo mês. O método é o que faz um relatório resistir à revisão de outra pessoa."),
 "m1": ("Alcance y base legal|Quién pide, para qué y con qué autorización. Sin finalidad lícita no hay investigación.", "Scope and legal basis|Who asks, what for and with what authorization. No lawful purpose, no investigation.", "Escopo e base legal|Quem pede, para quê e com qual autorização. Sem finalidade lícita não há investigação."),
 "m2": ("Descubrir|Dominios, IPs, subdominios, cuentas y servicios expuestos.", "Discover|Domains, IPs, subdomains, accounts and exposed services.", "Descobrir|Domínios, IPs, subdomínios, contas e serviços expostos."),
 "m3": ("Enriquecer|DNS, metadatos, brechas, relaciones entre entidades.", "Enrich|DNS, metadata, breaches, relationships between entities.", "Enriquecer|DNS, metadados, vazamentos, relações entre entidades."),
 "m4": ("Amenazas|IOCs, phishing, infraestructura maliciosa y actores.", "Threats|IOCs, phishing, malicious infrastructure and actors.", "Ameaças|IOCs, phishing, infraestrutura maliciosa e atores."),
 "m5": ("Huella digital|Repositorios, redes, paste sites, canales de Telegram.", "Digital footprint|Repositories, social media, paste sites, Telegram channels.", "Pegada digital|Repositórios, redes, paste sites, canais do Telegram."),
 "m6": ("Validar|Dos fuentes independientes por hallazgo, con fecha y nivel de confianza.", "Validate|Two independent sources per finding, with date and confidence level.", "Validar|Duas fontes independentes por achado, com data e nível de confiança."),
 "m7": ("Informar|Evidencia archivada, hash de cada captura y conclusiones proporcionales.", "Report|Archived evidence, a hash for every capture and proportionate conclusions.", "Relatar|Evidência arquivada, hash de cada captura e conclusões proporcionais."),
 "r1": ("Brechas|Un email en una filtración es una pista. Confírmalo con otra fuente.", "Breaches|An email in a leak is a lead. Confirm it with another source.", "Vazamentos|Um email em um vazamento é uma pista. Confirme com outra fonte."),
 "r2": ("Usuarios|El mismo alias en dos redes es una hipótesis: los homónimos son comunes.", "Usernames|The same handle on two networks is a hypothesis: namesakes are common.", "Usuários|O mesmo apelido em duas redes é uma hipótese: homônimos são comuns."),
 "r3": ("Teléfonos|Los directorios envejecen rápido. Contrasta antes de anotar.", "Phones|Directories age fast. Cross-check before you write anything down.", "Telefones|Os diretórios envelhecem rápido. Compare antes de anotar."),
 "r4": ("Imágenes|La búsqueda inversa muestra dónde apareció, no dónde se tomó.", "Images|Reverse search shows where it appeared, not where it was taken.", "Imagens|A busca reversa mostra onde apareceu, não onde foi tirada."),
 "r5": ("Blockchain|Los flujos son públicos; la identidad requiere evidencia externa.", "Blockchain|Flows are public; identity needs off-chain evidence.", "Blockchain|Os fluxos são públicos; a identidade requer evidência externa."),
 "r6": ("Evidencia|URL, fecha UTC, captura, hash SHA-256 y copia archivada.", "Evidence|URL, UTC date, capture, SHA-256 hash and archived copy.", "Evidência|URL, data UTC, captura, hash SHA-256 e cópia arquivada."),
 "s4_tag": ("04 · Kits por perfil", "04 · Kits by role", "04 · Kits por perfil"),
 "s4_h": ("Por dónde empezar según tu trabajo", "Where to start, depending on your job", "Por onde começar conforme seu trabalho"),
 "k1": ("Analista internacional|Entrega: brief de país o tema con cronología, mapa y nivel de confianza.|ACLED y GDELT;Sentinel Hub EO Browser;Flightradar24 y MarineTraffic;OpenSanctions y OpenCorporates;TGStat para canales de Telegram",
        "International analyst|Output: country or topic brief with timeline, map and confidence level.|ACLED and GDELT;Sentinel Hub EO Browser;Flightradar24 and MarineTraffic;OpenSanctions and OpenCorporates;TGStat for Telegram channels",
        "Analista internacional|Entrega: brief de país ou tema com cronologia, mapa e nível de confiança.|ACLED e GDELT;Sentinel Hub EO Browser;Flightradar24 e MarineTraffic;OpenSanctions e OpenCorporates;TGStat para canais do Telegram"),
 "k2": ("Investigador|Entrega: matriz de pistas, hipótesis y hallazgos verificados.|Sherlock y Maigret;Holehe y Hunter.io;PhoneInfoga;Búsqueda inversa: TinEye, Lens, Yandex;Hunchly para registrar el caso",
        "Investigator|Output: matrix of leads, hypotheses and verified findings.|Sherlock and Maigret;Holehe and Hunter.io;PhoneInfoga;Reverse search: TinEye, Lens, Yandex;Hunchly to log the case",
        "Investigador|Entrega: matriz de pistas, hipóteses e achados verificados.|Sherlock e Maigret;Holehe e Hunter.io;PhoneInfoga;Busca reversa: TinEye, Lens, Yandex;Hunchly para registrar o caso"),
 "k3": ("Forense digital|Entrega: informe con cadena de custodia reproducible.|ExifTool;Wayback Machine y Archive.today;InVID-WeVerify;VirusTotal y URLScan;Darkweb archive para preservar sitios .onion",
        "Digital forensics|Output: report with a reproducible chain of custody.|ExifTool;Wayback Machine and Archive.today;InVID-WeVerify;VirusTotal and URLScan;Darkweb archive to preserve .onion sites",
        "Forense digital|Entrega: relatório com cadeia de custódia reproduzível.|ExifTool;Wayback Machine e Archive.today;InVID-WeVerify;VirusTotal e URLScan;Darkweb archive para preservar sites .onion"),
 "k4": ("Pentest y superficie de ataque|Entrega: mapa de exposición priorizado por impacto.|Shodan y Censys;Amass, Subfinder y crt.sh;dnstwist;Gitleaks y TruffleHog;SOCRadar Dark Web Report",
        "Pentest and attack surface|Output: exposure map prioritized by impact.|Shodan and Censys;Amass, Subfinder and crt.sh;dnstwist;Gitleaks and TruffleHog;SOCRadar Dark Web Report",
        "Pentest e superfície de ataque|Entrega: mapa de exposição priorizado por impacto.|Shodan e Censys;Amass, Subfinder e crt.sh;dnstwist;Gitleaks e TruffleHog;SOCRadar Dark Web Report"),
 "s5_tag": ("05 · Próximamente", "05 · Coming soon", "05 · Em breve"),
 "s5_p": ("Para quienes necesitan más: búsquedas automáticas en miles de sitios, informes completos y acompañamiento en investigaciones a medida. Estamos probándola con un grupo reducido de investigadores.",
          "For those who need more: automated searches across thousands of sites, full reports and support on tailored investigations. We're testing it with a small group of investigators.",
          "Para quem precisa de mais: buscas automáticas em milhares de sites, relatórios completos e acompanhamento em investigações sob medida. Estamos testando com um grupo pequeno de investigadores."),
 "pro_li": ("Búsqueda unificada por alias, email, teléfono, dominio, imagen o empresa.;Resultados agrupados por categoría.;Informe exportable con evidencia archivada y hash de cada captura.;Investigación a medida con fuentes de pago, previa cotización.",
            "Unified search by username, email, phone, domain, image or company.;Results grouped by category.;Exportable report with archived evidence and a hash for every capture.;Tailored investigations with paid sources, quoted in advance.",
            "Busca unificada por apelido, email, telefone, domínio, imagem ou empresa.;Resultados agrupados por categoria.;Relatório exportável com evidência arquivada e hash de cada captura.;Investigação sob medida com fontes pagas, com orçamento prévio."),
 "pro_no": ("Cómo se protege a las personas investigadas: acceso solo con identidad verificada, finalidad declarada en cada búsqueda y registro de auditoría. No se venden perfiles de particulares a usuarios anónimos.",
            "How investigated people are protected: access only with verified identity, a declared purpose for each search and an audit log. Private individuals' profiles are never sold to anonymous users.",
            "Como as pessoas investigadas são protegidas: acesso só com identidade verificada, finalidade declarada em cada busca e registro de auditoria. Perfis de particulares não são vendidos a usuários anônimos."),
 "wait_p": ("La lista de espera funciona con tu cuenta de GitHub. Es pública: no hace falta dejar email ni teléfono.", "The waitlist works with your GitHub account. It's public: no email or phone needed.", "A lista de espera funciona com sua conta do GitHub. É pública: não precisa deixar email nem telefone."),
 "wait_b": ("Unirme a la lista de espera", "Join the waitlist", "Entrar na lista de espera"),
 "suggest": ("¿Conoces una herramienta que falta? Sugiérela aquí.", "Know a tool that's missing? Suggest it here.", "Conhece uma ferramenta que falta? Sugira aqui."),
 "g_tag": ("Ayúdame a crecer", "Help me grow", "Ajude-me a crescer"),
 "g_h": ("Una estrella en GitHub mantiene vivo este proyecto", "A GitHub star keeps this project alive", "Uma estrela no GitHub mantém este projeto vivo"),
 "g_p": ("OSINTario es gratis y lo voy a seguir siendo. Cada ⭐ en el repositorio hace que más investigadores lo encuentren y me ayuda a sumar herramientas y fuentes nuevas. ¿Falta algo o algo falla? Abre un Issue: también cuenta.",
         "OSINTario is free and will stay free. Every ⭐ on the repository helps more investigators find it and lets me add new tools and sources. Something missing or broken? Open an Issue: that counts too.",
         "O OSINTario é grátis e vai continuar sendo. Cada ⭐ no repositório faz mais investigadores o encontrarem e me ajuda a somar ferramentas e fontes novas. Falta algo ou algo falha? Abra uma Issue: também conta."),
 "g_star": ("Dar una ⭐ en GitHub", "Give a ⭐ on GitHub", "Dar uma ⭐ no GitHub"), "g_sug": ("Sugerir una herramienta", "Suggest a tool", "Sugerir uma ferramenta"),
 "g_stars": ("Estrellas", "Stars", "Estrelas"), "g_issues": ("Aportes de la comunidad (Issues)", "Community contributions (Issues)", "Contribuições da comunidade (Issues)"),
 "g_note": ("Meta de los primeros 30 días. Se actualiza en vivo desde GitHub.", "Goal for the first 30 days. Live from GitHub.", "Meta dos primeiros 30 dias. Atualiza ao vivo pelo GitHub."),
 "a_tag": ("06 · Sobre mí", "06 · About me", "06 · Sobre mim"),
 "a_p1": ("Soy profesor titular de <b>Investigación con Fuentes Abiertas (IFA)</b> en la Licenciatura en Ciberseguridad del Instituto Universitario de la Policía Federal Argentina (IUPFA), donde enseño desde 2018. Llevo 8 años investigando ciberdelitos con fuentes abiertas en el ámbito público y privado.",
          "I'm the lead professor of <b>Open Source Investigation (IFA)</b> in the Cybersecurity degree at the Instituto Universitario de la Policía Federal Argentina (IUPFA), where I've taught since 2018. I've spent 8 years investigating cybercrime with open sources in the public and private sectors.",
          "Sou professor titular de <b>Investigação com Fontes Abertas (IFA)</b> na Licenciatura em Cibersegurança do Instituto Universitário da Polícia Federal Argentina (IUPFA), onde leciono desde 2018. Há 8 anos investigo cibercrimes com fontes abertas nos setores público e privado."),
 "a_p2": ("Hice OSINTario porque mis alumnos me preguntaban siempre lo mismo: qué herramienta sigue funcionando y cómo usarla sin sacar conclusiones apuradas. Aquí está mi respuesta, actualizada.",
          "I built OSINTario because my students kept asking the same thing: which tool still works and how to use it without jumping to conclusions. This is my answer, kept up to date.",
          "Criei o OSINTario porque meus alunos sempre perguntavam a mesma coisa: qual ferramenta ainda funciona e como usá-la sem tirar conclusões apressadas. Esta é minha resposta, atualizada."),
 "a_repo": ("Repositorio en GitHub ⭐", "GitHub repository ⭐", "Repositório no GitHub ⭐"),
 "cred": ("Máster en Ciberseguridad Internacional;MBA;Auditor líder ISO 27001 · CRISC;Docente desde 2018 en CyberCrimes & Mobile Forensics e IFA",
          "Master's in International Cybersecurity;MBA;ISO 27001 Lead Auditor · CRISC;Teaching since 2018: CyberCrimes & Mobile Forensics and IFA",
          "Mestrado em Cibersegurança Internacional;MBA;Auditor líder ISO 27001 · CRISC;Docente desde 2018 em CyberCrimes & Mobile Forensics e IFA"),
 "foot": ("<b>Uso responsable.</b> Este directorio enlaza a servicios de terceros, sin afiliación. Investigar a una persona requiere una finalidad lícita y respetar el RGPD y la ley de protección de datos de tu país. Los servicios cambian: verifica siempre en la fuente.",
          "<b>Responsible use.</b> This directory links to third-party services with no affiliation. Investigating a person requires a lawful purpose and compliance with GDPR and your country's data protection law. Services change: always verify at the source.",
          "<b>Uso responsável.</b> Este diretório aponta para serviços de terceiros, sem afiliação. Investigar uma pessoa exige finalidade lícita e respeito ao RGPD e à lei de proteção de dados do seu país. Os serviços mudam: verifique sempre na fonte."),
 "foot2": ("Profesor de IFA en el IUPFA", "IFA professor at IUPFA", "Professor de IFA no IUPFA"),
 # Página de herramientas
 "tools_title": ("Multi-OSINT Lite · herramientas OSINT gratis en tu navegador", "Multi-OSINT Lite · free OSINT tools in your browser", "Multi-OSINT Lite · ferramentas OSINT grátis no navegador"),
 "tools_desc": ("Herramientas OSINT gratuitas que corren en tu navegador: dominio, IP, alias, email, teléfono, sitios .onion, metadatos de imagen y dorks. Informes con fuentes y hash SHA-256.",
                "Free OSINT tools that run in your browser: domain, IP, username, email, phone, .onion sites, image metadata and dorks. Reports with sources and SHA-256 hash.",
                "Ferramentas OSINT gratuitas que rodam no navegador: domínio, IP, apelido, email, telefone, sites .onion, metadados de imagem e dorks. Relatórios com fontes e hash SHA-256."),
 "tools_tag": ("Herramientas gratuitas · v2 · noviembre 2026", "Free tools · v2 · November 2026", "Ferramentas gratuitas · v2 · novembro 2026"),
 "tools_p": ("Escribe un dato y la herramienta consulta varias fuentes abiertas a la vez, ordena lo que encuentra y te entrega un informe con fuente, nivel de confianza y hash SHA-256 para tu evidencia.",
             "Type one data point and the tool queries several open sources at once, sorts what it finds and gives you a report with source, confidence level and SHA-256 hash for your evidence.",
             "Digite um dado e a ferramenta consulta várias fontes abertas ao mesmo tempo, organiza o que encontra e entrega um relatório com fonte, nível de confiança e hash SHA-256 para sua evidência."),
    "ethics": ("<b>Uso ético y legal.</b> OSINTario es una guía para investigar con fuentes abiertas, no un permiso. Cada búsqueda sobre una persona necesita una finalidad legítima y base legal (RGPD y leyes locales). No lo uses para acosar, vigilar a parejas o exparejas, exponer datos personales ni acceder a sistemas sin autorización. Quien busca es responsable de lo que hace con la información.",
               "<b>Ethical and lawful use.</b> OSINTario is a guide to open-source investigation, not a permission slip. Every search about a person needs a legitimate purpose and a legal basis (GDPR and local laws). Do not use it to harass, monitor partners or exes, expose personal data or access systems without authorisation. Whoever searches is responsible for what they do with the information.",
               "<b>Uso ético e legal.</b> O OSINTario é um guia para investigar com fontes abertas, não uma autorização. Cada pesquisa sobre uma pessoa precisa de uma finalidade legítima e base legal (RGPD e leis locais). Não o use para assediar, vigiar parceiros ou ex-parceiros, expor dados pessoais nem aceder a sistemas sem autorização. Quem pesquisa é responsável pelo que faz com a informação."),
 "privacy": ("<b>Todo corre en tu navegador.</b> OSINTario no tiene servidor ni guarda lo que buscas. Tu navegador consulta cada fuente directamente, así que esa fuente sí ve tu IP: para casos sensibles, usa una VPN o un equipo de investigación.",
             "<b>Everything runs in your browser.</b> OSINTario has no server and stores nothing you search. Your browser queries each source directly, so that source does see your IP: for sensitive cases, use a VPN or a research machine.",
             "<b>Tudo roda no seu navegador.</b> O OSINTario não tem servidor nem guarda o que você busca. Seu navegador consulta cada fonte diretamente, então essa fonte vê seu IP: em casos sensíveis, use uma VPN ou um equipamento de investigação."),
 "go": ("Investigar", "Investigate", "Investigar"),
 "tfoot": ("<b>Uso responsable.</b> Estas herramientas consultan solo fuentes abiertas. Un resultado es una pista, no una conclusión: valídalo con una segunda fuente. Investigar a una persona exige una finalidad lícita y respetar el RGPD y la ley de tu país.",
           "<b>Responsible use.</b> These tools query open sources only. A result is a lead, not a conclusion: validate it with a second source. Investigating a person requires a lawful purpose and compliance with GDPR and your local law.",
           "<b>Uso responsável.</b> Estas ferramentas consultam apenas fontes abertas. Um resultado é uma pista, não uma conclusão: valide com uma segunda fonte. Investigar uma pessoa exige finalidade lícita e respeito ao RGPD e à lei do seu país."),
 "improve": ("Sugerir una mejora", "Suggest an improvement", "Sugerir uma melhoria"),
 "n_dom": ("7 fuentes", "7 sources", "7 fontes"), "n_ip": ("5 fuentes", "5 sources", "5 fontes"), "n_alias": ("2 + 40 sitios", "2 + 40 sites", "2 + 40 sites"),
 "n_email": ("4 fuentes", "4 sources", "4 fontes"), "n_onion": ("2 fuentes", "2 sources", "2 fontes"), "n_phone": ("enlaces", "links", "links"),
 "n_img": ("local", "local", "local"), "n_dork": ("generador", "generator", "gerador"), "t_phone": ("Teléfono", "Phone", "Telefone"), "t_dorks_s": ("Dorks", "Dorks", "Dorks"),
}


def s(key, lang):
    return STR[key][LANGS.index(lang)]


# Flujo de entrada, planes (Lite / comunidad / Pro) y navegación. Tuplas (ES, EN, PT).
FS = {
    "nav_guide": ("Instalación segura", "Safe install", "Instalação segura"),
    "nav_plans": ("Lite y Pro", "Lite & Pro", "Lite e Pro"),
    "nav_star": ("⭐ Apoyar", "⭐ Support", "⭐ Apoiar"),
    "start_tag": ("Empieza aquí", "Start here", "Comece aqui"),
    "start_h": ("Qué puedes hacer en OSINTario", "What you can do on OSINTario", "O que você pode fazer no OSINTario"),
    "start": (
        ["Encontrar la herramienta|Directorio revisado a mano: qué hace cada una, si sigue activa y si pide registro o pago.|Ver el directorio",
         "Investigar un dato ahora|Multi-OSINT Lite consulta varias fuentes desde tu navegador. Gratis y sin registro.|Abrir Multi-OSINT Lite",
         "Instalar sin riesgos|Si la herramienta se instala, sigue la guía: máquina virtual, entornos aislados y pasos por herramienta.|Ver la guía",
         "Destrabar más con tu ⭐|Con 100 estrellas se activa el barrido de alias en miles de sitios. Toma 30 segundos.|Dejar mi ⭐"],
        ["Find the right tool|Hand-reviewed directory: what each tool does, whether it still works and if it needs a login or payment.|Browse the directory",
         "Investigate a data point now|Multi-OSINT Lite queries several sources from your browser. Free, no sign-up.|Open Multi-OSINT Lite",
         "Install without risk|If a tool must be installed, follow the guide: virtual machine, isolated environments and per-tool steps.|Read the guide",
         "Unlock more with your ⭐|At 100 stars the username sweep across thousands of sites goes live. It takes 30 seconds.|Leave my ⭐"],
        ["Encontrar a ferramenta|Diretório revisado à mão: o que cada uma faz, se ainda funciona e se pede cadastro ou pagamento.|Ver o diretório",
         "Investigar um dado agora|O Multi-OSINT Lite consulta várias fontes pelo navegador. Grátis e sem cadastro.|Abrir o Multi-OSINT Lite",
         "Instalar sem riscos|Se a ferramenta é instalada, siga o guia: máquina virtual, ambientes isolados e passos por ferramenta.|Ver o guia",
         "Desbloquear mais com sua ⭐|Com 100 estrelas ativa-se a varredura de apelidos em milhares de sites. Leva 30 segundos.|Deixar minha ⭐"]),
    "plans_tag": ("05 · Lite, comunidad y Pro", "05 · Lite, community and Pro", "05 · Lite, comunidade e Pro"),
    "plans_h": ("Qué es gratis hoy, qué se activa con la comunidad y qué será Pro", "What is free today, what the community unlocks and what Pro will be", "O que é grátis hoje, o que a comunidade ativa e o que será o Pro"),
    "plans_p": ("OSINTario tiene tres etapas. La primera ya funciona. Las otras dos dependen de poder pagar un servidor, y por eso existen las metas de estrellas.",
                "OSINTario has three stages. The first one already works. The other two depend on being able to pay for a server, which is why the star goals exist.",
                "O OSINTario tem três etapas. A primeira já funciona. As outras duas dependem de poder pagar um servidor, e por isso existem as metas de estrelas."),
    "p1_k": ("Disponible hoy · gratis", "Available today · free", "Disponível hoje · grátis"),
    "p1_h": ("Multi-OSINT Lite", "Multi-OSINT Lite", "Multi-OSINT Lite"),
    "p1_p": ("Corre en tu navegador, sin registro y sin servidor: lo que buscas no pasa por OSINTario.",
             "Runs in your browser, no sign-up and no server: what you search never passes through OSINTario.",
             "Roda no seu navegador, sem cadastro e sem servidor: o que você busca não passa pelo OSINTario."),
    "p1_li": ("Dominio, IP, alias, email, teléfono, sitio .onion, imagen y dorks.;Informe con fuente, nivel de confianza y hash SHA-256.;Límite: solo puede consultar fuentes que aceptan pedidos desde un navegador.",
              "Domain, IP, username, email, phone, .onion site, image and dorks.;Report with source, confidence level and SHA-256 hash.;Limit: it can only query sources that accept requests from a browser.",
              "Domínio, IP, apelido, email, telefone, site .onion, imagem e dorks.;Relatório com fonte, nível de confiança e hash SHA-256.;Limite: só consulta fontes que aceitam pedidos a partir de um navegador."),
    "p1_b": ("Usar Multi-OSINT Lite", "Use Multi-OSINT Lite", "Usar o Multi-OSINT Lite"),
    "p2_k": ("Se activa con estrellas · gratis", "Unlocked by stars · free", "Ativa-se com estrelas · grátis"),
    "p2_h": ("Herramientas con servidor", "Server-side tools", "Ferramentas com servidor"),
    "p2_p": ("Sherlock, Maigret o theHarvester no pueden correr en un navegador: necesitan un servidor, y hoy el proyecto no puede pagarlo. Las estrellas son la señal para activarlo.",
             "Sherlock, Maigret or theHarvester cannot run in a browser: they need a server, and today the project cannot pay for one. Stars are the signal to switch it on.",
             "Sherlock, Maigret ou theHarvester não rodam num navegador: precisam de um servidor, e hoje o projeto não consegue pagá-lo. As estrelas são o sinal para ativá-lo."),
    "p2_li": ("Con 100 ⭐: barrido de alias en miles de sitios y emails registrados.;Con 1.000 ⭐: subdominios, teléfono, typosquatting, dark web y metadatos completos.;Seguirá siendo gratis: más adelante se abrirán donaciones para sostener el servidor.",
              "At 100 ⭐: username sweep across thousands of sites and registered emails.;At 1,000 ⭐: subdomains, phone, typosquatting, dark web and full metadata.;It will stay free: donations will open later to keep the server running.",
              "Com 100 ⭐: varredura de apelidos em milhares de sites e emails registrados.;Com 1.000 ⭐: subdomínios, telefone, typosquatting, dark web e metadados completos.;Continuará grátis: mais adiante serão abertas doações para manter o servidor."),
    "p2_b": ("Ver qué se destraba", "See what gets unlocked", "Ver o que é desbloqueado"),
    "p3_k": ("Más adelante · sin fecha", "Later · no date yet", "Mais adiante · sem data"),
    "p3_h": ("Multi-OSINT Pro", "Multi-OSINT Pro", "Multi-OSINT Pro"),
    "p3_p": ("Para trabajo profesional: todo en una sola búsqueda, informe completo e investigación a medida. Todavía no está disponible; llegará después de las metas de la comunidad.",
             "For professional work: everything in a single search, a full report and tailored investigations. It is not available yet; it will come after the community goals.",
             "Para trabalho profissional: tudo numa só busca, relatório completo e investigação sob medida. Ainda não está disponível; chegará depois das metas da comunidade."),
    "foot_nav": ("Directorio|Multi-OSINT Lite|Instalación segura|Dejar una ⭐", "Directory|Multi-OSINT Lite|Safe install|Leave a ⭐", "Diretório|Multi-OSINT Lite|Instalação segura|Deixar uma ⭐"),
    "lite_what": ("<b>¿Qué es «Lite»?</b> La versión gratuita que corre solo en tu navegador. Las herramientas que necesitan servidor se activan con las estrellas de la comunidad: <a href=\"#comunidad\">mira cuáles y cuánto falta</a>.",
                  "<b>What is “Lite”?</b> The free version that runs only in your browser. Tools that need a server are unlocked by community stars: <a href=\"#comunidad\">see which ones and how far we are</a>.",
                  "<b>O que é «Lite»?</b> A versão gratuita que roda só no seu navegador. As ferramentas que precisam de servidor ativam-se com as estrelas da comunidade: <a href=\"#comunidad\">veja quais e quanto falta</a>."),
}


def f(key, lang):
    return FS[key][LANGS.index(lang)]


def nav_links(lang, home_page=False):
    pre = "" if home_page else HOME[lang]
    return (f'<a href="{pre}#directorio">{s("nav_dir", lang)}</a><a href="{GUIDEP[lang]}">{f("nav_guide", lang)}</a>'
            f'<a href="{pre}#pro">{f("nav_plans", lang)}</a><a class="opt" href="{pre}#metodo">{s("nav_met", lang)}</a>'
            f'<a class="opt" href="{pre}#sobre">{s("nav_about", lang)}</a><a href="{STARP[lang]}">{f("nav_star", lang)}</a>')


def foot_nav(lang):
    a, b, c, d = f("foot_nav", lang).split("|")
    return (f'<nav class="footnav" aria-label="OSINTario"><a href="{HOME[lang]}#directorio">{a}</a><a href="{TOOLSP[lang]}">{b}</a>'
            f'<a href="{GUIDEP[lang]}">{c}</a><a href="{STARP[lang]}">{d}</a></nav>')


def lang_switch(lang, pages):
    names = {"es": "ES", "en": "EN", "pt": "PT"}
    return '<nav class="lang" aria-label="Idioma / Language">' + "".join(
        f'<a href="{pages[l]}" hreflang="{l}" lang="{l}" aria-current="{str(l == lang).lower()}">{names[l]}</a>' for l in LANGS) + "</nav>"


def alternates(pages):
    out = "".join(f'<link rel="alternate" hreflang="{l}" href="{BASE}{pages[l]}">' for l in LANGS)
    return out + f'<link rel="alternate" hreflang="x-default" href="{BASE}{pages["es"]}">'


def head(lang, title, desc, page, pages, csp, css, og="og.png"):
    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="{csp}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:type" content="website"><meta property="og:locale" content="{LOCALE[lang]}">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}">
<meta property="og:image" content="{BASE}{og}"><meta property="og:url" content="{BASE}{page}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="canonical" href="{BASE}{page}">
{alternates(pages)}
{FONTS}
<link rel="stylesheet" href="{css}">
'''


def header(lang, links, cta_href, cta_text, pages):
    return f'''<header class="top"><div class="wrap">
  <a class="logo" href="{HOME[lang]}"><span class="dot" aria-hidden="true"></span>OSINTario</a>
  <span class="tag opt">{s("tagline", lang)}</span>
  <nav class="main" aria-label="Secciones">{links}<a class="cta" href="{cta_href}">{cta_text}</a></nav>
  {lang_switch(lang, pages)}
</div></header>'''


def home(lang):
    tp = TOOLSP[lang]
    csp = "default-src 'none'; connect-src https://api.github.com; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; base-uri 'none'; form-action 'none'"
    h = head(lang, s("home_title", lang), s("home_desc", lang), HOME[lang], HOME, csp, "home.css")
    ld = {"@context": "https://schema.org", "@type": "WebSite", "name": "OSINTario", "url": BASE + HOME[lang], "inLanguage": lang,
          "description": s("home_desc", lang), "author": {"@type": "Person", "name": "Federico Dosio",
          "affiliation": {"@type": "CollegeOrUniversity", "name": "Instituto Universitario de la Policía Federal Argentina (IUPFA)"},
          "sameAs": ["https://www.linkedin.com/in/dosiofederico/"]}}
    h += f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n</head>\n<body>\n'
    links = nav_links(lang, True)
    start_to = ["#directorio", tp, GUIDEP[lang], STARP[lang]]
    start = "".join(f'<a class="tool" href="{u}"><b>{a}</b><span>{b}</span><em>{c} →</em></a>' for u, (a, b, c) in zip(start_to, (x.split("|") for x in f("start", lang))))
    li = lambda k: "".join(f"<li>{x}</li>" for x in f(k, lang).split(";"))
    h += header(lang, links, tp, "Multi-OSINT Lite", HOME)
    cards = "".join(f'<a class="tool" href="{tp}#{k}"><b>{s(t, lang)}</b><span>{s(t + "_d", lang)}</span><em>{s(n, lang)}</em></a>'
                    for k, t, n in [("domain", "t_domain", "n_dom"), ("ip", "t_ip", "n_ip"), ("alias", "t_alias", "n_alias"), ("email", "t_email", "n_email"),
                                    ("onion", "t_onion", "n_onion"), ("image", "t_image", "n_img"), ("dorks", "t_dorks", "n_dork")])
    steps = "".join(f'<li><b>{a}</b><span>{b}</span></li>' for a, b in (s(f"m{i}", lang).split("|") for i in range(1, 8)))
    rules = "".join(f'<div class="rule"><span class="k">{a}</span><span>{b}</span></div>' for a, b in (s(f"r{i}", lang).split("|") for i in range(1, 7)))
    kits = ""
    for i in range(1, 5):
        t, o, items = s(f"k{i}", lang).split("|")
        kits += f'<div class="kit"><h3>{t}</h3><p class="out">{o}</p><ul>' + "".join(f"<li>{x}</li>" for x in items.split(";")) + "</ul></div>"
    pro_li = "".join(f"<li>{x}</li>" for x in s("pro_li", lang).split(";"))
    creds = "".join(f"<li><b>{x}</b></li>" for x in s("cred", lang).split(";"))
    h += f'''
<main id="inicio">
<div class="wrap hero">
  <div>
    <span class="tag">{s("by", lang)}</span>
    <h1>{s("h1", lang)}</h1>
    <p>{s("hero_p", lang)}</p>
    <div class="ctas"><a class="btn" href="{tp}">{s("cta_tools", lang)}</a><a class="btn ghost" href="#directorio">{s("cta_dir", lang)}</a></div>
  </div>
  <div class="ledger">
    <div><span>{s("l_total", lang)}</span><b id="count-total">0</b></div>
    <div><span>{s("l_ok", lang)}</span><b id="count-ok">0</b></div>
    <div><span>{s("l_cat", lang)}</span><b id="count-cat">0</b></div>
    <div><span>{s("l_date", lang)}</span><b id="count-date">–</b></div>
  </div>
</div>

<section id="empezar"><div class="wrap">
  <span class="tag">{f("start_tag", lang)}</span>
  <h2>{f("start_h", lang)}</h2>
  <div class="toolgrid start">{start}</div>
</div></section>

<section id="herramientas"><div class="wrap">
  <span class="tag">{s("s1_tag", lang)}</span>
  <h2>{s("s1_h", lang)}</h2>
  <p class="lede">{s("s1_p", lang)}</p>
  <div class="toolgrid">{cards}</div>
</div></section>

<section id="directorio"><div class="wrap">
  <span class="tag">{s("s2_tag", lang)}</span>
  <h2>{s("s2_h", lang)}</h2>
  <p class="lede">{s("s2_p", lang)}</p>
  <p class="ethics" role="note"><span aria-hidden="true">⚖️</span> <span>{s("ethics", lang)}</span></p>
  <div class="controls">
    <label class="tag" for="q">{s("search", lang)}</label>
    <input id="q" type="search" placeholder="{s("search_ph", lang)}">
    <label class="tag" for="st">{s("status", lang)}</label>
    <select id="st"><option value="all">{s("all", lang)}</option><option value="ok">{s("st_ok", lang)}</option><option value="lim">{s("st_lim", lang)}</option><option value="risk">{s("st_risk", lang)}</option><option value="no">{s("st_no", lang)}</option></select>
    <label class="tag" for="ac">{s("access", lang)}</label>
    <select id="ac"><option value="all">{s("all", lang)}</option><option value="free">{s("ac_free", lang)}</option><option value="l">{s("ac_l", lang)}</option><option value="p">{s("ac_p", lang)}</option></select>
  </div>
  <p class="legend">{s("legend", lang)}</p>
  <div class="chips" id="chips" role="group"></div>
  <div class="grid" id="grid"></div>
</div></section>

<section id="metodo"><div class="wrap">
  <span class="tag">{s("s3_tag", lang)}</span>
  <h2>{s("s3_h", lang)}</h2>
  <p class="lede">{s("s3_p", lang)}</p>
  <ol class="steps">{steps}</ol>
  <div class="rules">{rules}</div>
</div></section>

<section id="kits"><div class="wrap">
  <span class="tag">{s("s4_tag", lang)}</span>
  <h2>{s("s4_h", lang)}</h2>
  <div class="kits">{kits}</div>
</div></section>

<section id="pro"><div class="wrap">
  <span class="tag">{f("plans_tag", lang)}</span>
  <h2>{f("plans_h", lang)}</h2>
  <p class="lede">{f("plans_p", lang)}</p>
  <div class="etapas">
    <div class="etapa now"><span class="k">{f("p1_k", lang)}</span><h3>{f("p1_h", lang)}</h3><p>{f("p1_p", lang)}</p><ul>{li("p1_li")}</ul>
      <a class="btn" href="{tp}">{f("p1_b", lang)}</a></div>
    <div class="etapa"><span class="k">{f("p2_k", lang)}</span><h3>{f("p2_h", lang)}</h3><p>{f("p2_p", lang)}</p><ul>{li("p2_li")}</ul>
      <div class="m-row"><span>{s("g_stars", lang)}</span><b><span id="stars2">–</span> / 100</b></div><div class="bar"><i id="stars2-bar"></i></div>
      <div class="ctas"><a class="btn" href="{STARP[lang]}">{s("g_star", lang)}</a><a class="btn ghost" href="{tp}#comunidad">{f("p2_b", lang)}</a></div></div>
    <div class="etapa later"><span class="k">{f("p3_k", lang)}</span><h3>{f("p3_h", lang)}</h3><p>{f("p3_p", lang)}</p><ul>{pro_li}</ul>
      <p class="no">{s("pro_no", lang)}</p>
      <p class="small">{s("wait_p", lang)}</p>
      <a class="btn ghost" href="{GH}/issues/new?template=lista-espera.yml" target="_blank" rel="noopener noreferrer">{s("wait_b", lang)}</a></div>
  </div>
  <p class="small"><a href="{GH}/issues/new?template=sugerir-herramienta.yml" target="_blank" rel="noopener noreferrer">{s("suggest", lang)}</a></p>
</div></section>

<section id="apoyo"><div class="wrap goal">
  <div>
    <span class="tag">{s("g_tag", lang)}</span>
    <h2>{s("g_h", lang)}</h2>
    <p class="lede">{s("g_p", lang)}</p>
    <div class="ctas"><a class="btn" href="{STARP[lang]}">{s("g_star", lang)}</a><a class="btn ghost" href="{GH}/issues/new?template=sugerir-herramienta.yml" target="_blank" rel="noopener noreferrer">{s("g_sug", lang)}</a></div>
  </div>
  <div class="meter">
    <div class="m-row"><span>{s("g_stars", lang)}</span><b><span id="stars">–</span> / 100</b></div>
    <div class="bar"><i id="stars-bar"></i></div>
    <div class="m-row"><span>{s("g_issues", lang)}</span><b><span id="issues">–</span> / 10</b></div>
    <div class="bar"><i id="issues-bar"></i></div>
    <p class="note">{s("g_note", lang)} · <a href="{TOOLSP[lang]}#comunidad">{LS["home"][LANGS.index(lang)]}</a></p>
  </div>
</div></section>

<section id="sobre"><div class="wrap about">
  <div>
    <span class="tag">{s("a_tag", lang)}</span>
    <h2>Federico Dosio</h2>
    <p>{s("a_p1", lang)}</p>
    <p>{s("a_p2", lang)}</p>
    <div class="ctas"><a class="btn ghost" href="https://www.linkedin.com/in/dosiofederico/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a class="btn ghost" href="{GH}" target="_blank" rel="noopener noreferrer">{s("a_repo", lang)}</a></div>
  </div>
  <ul class="creds">{creds}</ul>
</div></section>
</main>

<footer><div class="wrap">
  <div>{s("foot", lang)}</div>
  <div>OSINTario · Federico Dosio<br>{s("foot2", lang)}{foot_nav(lang)}</div>
</div></footer>
<script src="directory.js"></script>
<script src="home.js"></script>
</body>
</html>
'''
    return h

LS = {
    "tag": ("Con la comunidad", "With the community", "Com a comunidade"),
    "h": ("Herramientas que se destraban con tus estrellas", "Tools your stars will unlock", "Ferramentas que as suas estrelas vão desbloquear"),
    "p": ("Estas herramientas necesitan un servidor para funcionar y hoy, como proyecto independiente, no podemos cubrir ese costo. Cada ⭐ en GitHub nos acerca a activarlas aquí mismo, gratis y para todos. Más adelante abriremos la posibilidad de apoyar el proyecto con donaciones para seguir sumando.",
          "These tools need a server to run and, as an independent project, we cannot cover that cost yet. Every ⭐ on GitHub brings us closer to switching them on right here, free for everyone. Later on we will open donations so the project can keep growing.",
          "Estas ferramentas precisam de um servidor para funcionar e, como projeto independente, ainda não conseguimos cobrir esse custo. Cada ⭐ no GitHub aproxima-nos de as ativar aqui mesmo, grátis e para todos. Mais adiante abriremos a possibilidade de apoiar o projeto com donativos."),
    "m1": ("Meta 1 · 100 ⭐", "Goal 1 · 100 ⭐", "Meta 1 · 100 ⭐"),
    "m1p": ("Barrido de alias en miles de sitios y emails registrados.", "Username sweep across thousands of sites and registered emails.", "Varredura de alias em milhares de sites e emails registados."),
    "m2": ("Meta 2 · 1.000 ⭐", "Goal 2 · 1,000 ⭐", "Meta 2 · 1.000 ⭐"),
    "m2p": ("Todo el resto: subdominios, teléfono, typosquatting, dark web y metadatos completos.", "Everything else: subdomains, phone, typosquatting, dark web and full metadata.", "Todo o resto: subdomínios, telefone, typosquatting, dark web e metadados completos."),
    "cta": ("Dejar mi ⭐ en 30 segundos", "Leave my ⭐ in 30 seconds", "Deixar a minha ⭐ em 30 segundos"),
    "home": ("Qué se destraba con 100 y 1.000 ⭐", "What 100 and 1,000 ⭐ unlock", "O que 100 e 1.000 ⭐ desbloqueiam"),
}


def tools(lang):
    csp = "default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src https:; base-uri 'none'; form-action 'none'"
    h = head(lang, s("tools_title", lang), s("tools_desc", lang), TOOLSP[lang], TOOLSP, csp, "site.css") + "</head>\n<body>\n"
    links = nav_links(lang)
    h += header(lang, links, TOOLSP[lang], "Multi-OSINT Lite", TOOLSP).replace('class="cta"', 'class="cta" aria-current="page"')
    tabs = [("domain", "t_domain", "n_dom"), ("ip", "t_ip", "n_ip"), ("alias", "t_alias", "n_alias"), ("email", "t_email", "n_email"),
            ("phone", "t_phone", "n_phone"), ("onion", "t_onion", "n_onion"), ("image", "t_image", "n_img"), ("dorks", "t_dorks_s", "n_dork")]
    nav = "".join(f'<button role="tab" data-tool="{k}" aria-selected="{str(i == 0).lower()}">{s(t, lang)} <span class="k">{s(n, lang)}</span></button>'
                  for i, (k, t, n) in enumerate(tabs))
    h += f'''
<main class="wrap">
  <section class="intro">
    <span class="tag">{s("tools_tag", lang)}</span>
    <h1>Multi-OSINT Lite</h1>
    <p>{s("tools_p", lang)}</p>
    <div class="privacy"><span aria-hidden="true">💡</span><span>{f("lite_what", lang)}</span></div>
    <div class="privacy"><span aria-hidden="true">🔒</span><span>{s("privacy", lang)}</span></div>
    <div class="privacy ethics" role="note"><span aria-hidden="true">⚖️</span><span>{s("ethics", lang)}</span></div>
  </section>
  <div class="tool-layout">
    <nav class="tool-nav" role="tablist">{nav}</nav>
    <section class="panel" id="panel" aria-live="polite">
      <h2 id="t-title"></h2>
      <p class="desc" id="t-desc"></p>
      <form id="t-form" class="row" novalidate>
        <input id="t-input" autocomplete="off" spellcheck="false">
        <input id="t-file" type="file" accept="image/*" hidden>
        <button class="go" id="t-go" type="submit">{s("go", lang)}</button>
      </form>
      <div class="examples" id="t-examples"></div>
      <p class="msg" id="t-msg" role="alert"></p>
      <div id="t-out"></div>
    </section>
  </div>
  <section class="unlock" id="comunidad">
    <span class="tag">{LS["tag"][LANGS.index(lang)]}</span>
    <h2>{LS["h"][LANGS.index(lang)]}</h2>
    <p>{LS["p"][LANGS.index(lang)]}</p>
    <div class="goals">
      <div class="goalcard" data-goal="100"><h3>{LS["m1"][LANGS.index(lang)]}</h3><p>{LS["m1p"][LANGS.index(lang)]}</p><div class="bar"><i></i></div><p class="cnt"><b class="st">–</b> / 100</p><ul class="lk"></ul></div>
      <div class="goalcard" data-goal="1000"><h3>{LS["m2"][LANGS.index(lang)]}</h3><p>{LS["m2p"][LANGS.index(lang)]}</p><div class="bar"><i></i></div><p class="cnt"><b class="st">–</b> / 1000</p><ul class="lk"></ul></div>
    </div>
    <p><a class="go cta-star" href="{STARP[lang]}">{LS["cta"][LANGS.index(lang)]}</a></p>
  </section>
</main>
<footer><div class="wrap">
  {s("tfoot", lang)} · <a href="{HOME[lang]}">OSINTario</a> · Federico Dosio, {s("foot2", lang)} · <a href="{GH}/issues/new?template=sugerir-herramienta.yml" rel="noopener noreferrer" target="_blank">{s("improve", lang)}</a>
</div></footer>
<script src="exifr.umd.js"></script>
<script src="dirlinks.js"></script>
<script src="tools.js"></script>
</body>
</html>
'''
    return h


SS = {
    "title": ("Dale una ⭐ a OSINTario en 30 segundos", "Give OSINTario a ⭐ in 30 seconds", "Dê uma ⭐ ao OSINTario em 30 segundos"),
    "desc": ("Cómo dejar una estrella en GitHub, paso a paso. Es gratis y ayuda a que más investigadores encuentren el directorio.",
             "How to star the project on GitHub, step by step. It is free and helps more investigators find the directory.",
             "Como deixar uma estrela no GitHub, passo a passo. É grátis e ajuda mais investigadores a encontrar o diretório."),
    "lede": ("Una estrella en GitHub es como un «me gusta» para proyectos de código abierto. Es gratis y hace que OSINTario aparezca más arriba cuando otros investigadores buscan herramientas.",
             "A GitHub star is like a “like” for open-source projects. It is free and pushes OSINTario higher when other investigators search for tools.",
             "Uma estrela no GitHub é como um «gosto» para projetos de código aberto. É grátis e faz o OSINTario aparecer mais acima quando outros investigadores procuram ferramentas."),
    "s1": ("Toca el botón naranja. Se abre la página del proyecto en GitHub.", "Tap the orange button. The project page opens on GitHub.", "Toque no botão laranja. Abre-se a página do projeto no GitHub."),
    "s2": ("Inicia sesión. Si no tienes cuenta, créala gratis: solo pide un email (1 minuto).", "Sign in. No account? Create one for free: it only needs an email (1 minute).", "Inicie sessão. Sem conta? Crie uma grátis: só pede um email (1 minuto)."),
    "s3": ("Toca «☆ Star» arriba a la derecha (en el celular, debajo del nombre del proyecto). Cuando cambia a «★ Starred», listo.",
           "Tap “☆ Star” at the top right (on mobile, below the project name). When it turns into “★ Starred”, you are done.",
           "Toque em «☆ Star» no canto superior direito (no telemóvel, por baixo do nome do projeto). Quando mudar para «★ Starred», está feito."),
    "btn": ("Abrir GitHub y dejar la ⭐", "Open GitHub and leave a ⭐", "Abrir o GitHub e deixar a ⭐"),
    "count": ("estrellas hasta ahora · meta: 100", "stars so far · goal: 100", "estrelas até agora · meta: 100"),
    "share": ("¿Ya la dejaste? ¡Gracias! Si te sirvió, comparte este link:", "Already starred? Thank you! If it helped, share this link:", "Já deixou? Obrigado! Se lhe foi útil, partilhe este link:"),
    "back": ("Ver las herramientas", "See the tools", "Ver as ferramentas"),
    "free": ("Sin costo. GitHub no te pide tarjeta ni datos de pago.", "No cost. GitHub does not ask for a card or payment details.", "Sem custo. O GitHub não pede cartão nem dados de pagamento."),
}


def star(lang):
    t = lambda k: SS[k][LANGS.index(lang)]
    csp = "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src https://api.github.com; base-uri 'none'; form-action 'none'"
    og = {"es": "og-estrella.png", "en": "og-star.png", "pt": "og-estrela.png"}[lang]
    h = head(lang, t("title"), t("desc"), STARP[lang], STARP, csp, "home.css", og) + "</head>\n<body>\n"
    h += header(lang, nav_links(lang), TOOLSP[lang], "Multi-OSINT Lite", STARP)
    h += f"""<main id="main"><section><div class="wrap starpage">
  <div class="bigstar" aria-hidden="true">★</div>
  <h1>{t("title")}</h1>
  <p class="lede">{t("lede")}</p>
  <ol class="steps">
    <li><b>1</b><span>{t("s1")}</span></li>
    <li><b>2</b><span>{t("s2")}</span></li>
    <li><b>3</b><span>{t("s3")}</span></li>
  </ol>
  <p><a class="btn big" href="{GH}" target="_blank" rel="noopener noreferrer">{t("btn")}</a></p>
  <p class="note">{t("free")}</p>
  <p class="starcount"><b id="stars">–</b> {t("count")}</p>
  <p>{t("share")} <code>osintario.github.io/{STARP[lang].replace(".html", "")}</code></p>
  <p><a class="btn ghost" href="{HOME[lang]}#directorio">{t("back")}</a></p>
</div></section></main>
<footer><div class="wrap">OSINTario · Federico Dosio</div></footer>
<script src="star.js"></script>
</body>
</html>
"""
    return h


# Guía de instalación segura (ES / EN / PT). Cada ficha con 9.º campo en directory.js enlaza a su sección (#py, #go, #docker, #vm, #app).
GS = {
    "title": ("Instalación segura de herramientas OSINT y de ciberseguridad", "Safe installation of OSINT and cybersecurity tools", "Instalação segura de ferramentas OSINT e de cibersegurança"),
    "desc": ("Cómo instalar herramientas de terminal sin poner en riesgo tu equipo: máquina virtual, entornos aislados y qué revisar antes de ejecutar.",
             "How to install command-line tools without putting your computer at risk: virtual machine, isolated environments and what to check before running.",
             "Como instalar ferramentas de terminal sem pôr seu computador em risco: máquina virtual, ambientes isolados e o que revisar antes de executar."),
    "lede": ("Muchas herramientas del directorio no se usan desde la web: se instalan. Son código de terceros que OSINTario revisa pero no audita línea por línea. Esta guía explica cómo instalarlas sin exponer tu equipo ni tus datos. Cada ficha del directorio con la etiqueta 🧪 lleva a su sección.",
             "Many tools in the directory are not used from the web: you install them. They are third-party code that OSINTario reviews but does not audit line by line. This guide explains how to install them without exposing your computer or your data. Each directory card with the 🧪 label links to its section.",
             "Muitas ferramentas do diretório não são usadas pela web: são instaladas. São código de terceiros que o OSINTario revisa, mas não audita linha por linha. Este guia explica como instalá-las sem expor seu computador nem seus dados. Cada ficha do diretório com a etiqueta 🧪 leva à sua seção."),
    "rules_h": ("7 reglas que valen para todas", "7 rules that apply to all of them", "7 regras que valem para todas"),
    "rules": (
        ["Usa una máquina virtual|VirtualBox, VMware o UTM con Kali o Debian. Nunca instales en el equipo donde tienes tu correo, tu banco o expedientes reales.",
         "Toma un snapshot antes|Si algo sale mal, vuelves al estado limpio en un minuto.",
         "Lee antes de ejecutar|Abre install.sh y requirements.txt. Desconfía de «curl … | sudo bash» y de binarios sin código fuente.",
         "Descarga del origen oficial|El repositorio o sitio del autor, no un espejo ni un enlace de un comentario. Verifica el hash o la firma si se publica.",
         "Sin root salvo que haga falta|Una herramienta que busca alias no necesita sudo. Si lo pide, pregúntate por qué.",
         "Aísla la red y los datos|Red en modo NAT, sin carpetas compartidas ni portapapeles con tu equipo. Usa cuentas y claves API creadas solo para investigar.",
         "Cierra el caso limpio|Exporta la evidencia con su hash, anota versión y fecha de la herramienta y vuelve al snapshot."],
        ["Use a virtual machine|VirtualBox, VMware or UTM with Kali or Debian. Never install on the computer that holds your email, banking or real case files.",
         "Take a snapshot first|If something goes wrong, you are back to a clean state in a minute.",
         "Read before you run|Open install.sh and requirements.txt. Be wary of “curl … | sudo bash” and of binaries without source code.",
         "Download from the official source|The author's repository or site, not a mirror or a link in a comment. Verify the hash or signature if one is published.",
         "No root unless needed|A username search tool does not need sudo. If it asks for it, ask yourself why.",
         "Isolate network and data|NAT networking, no shared folders or clipboard with your host. Use accounts and API keys created only for investigations.",
         "Close the case cleanly|Export the evidence with its hash, note the tool version and date, and roll back to the snapshot."],
        ["Use uma máquina virtual|VirtualBox, VMware ou UTM com Kali ou Debian. Nunca instale no computador onde estão seu email, seu banco ou processos reais.",
         "Tire um snapshot antes|Se algo der errado, você volta ao estado limpo em um minuto.",
         "Leia antes de executar|Abra install.sh e requirements.txt. Desconfie de «curl … | sudo bash» e de binários sem código-fonte.",
         "Baixe da origem oficial|O repositório ou site do autor, não um espelho nem um link de comentário. Verifique o hash ou a assinatura se houver.",
         "Sem root, salvo necessidade|Uma ferramenta que busca apelidos não precisa de sudo. Se pedir, pergunte-se por quê.",
         "Isole a rede e os dados|Rede em modo NAT, sem pastas compartilhadas nem área de transferência com seu computador. Use contas e chaves de API criadas só para investigar.",
         "Feche o caso limpo|Exporte a evidência com seu hash, anote versão e data da ferramenta e volte ao snapshot."]),
    "how_h": ("Paso a paso de las 10 más usadas", "Step by step for the 10 most used", "Passo a passo das 10 mais usadas"),
    "how_p": ("Cada instructivo indica si OSINTario ya probó la instalación y cuándo. Ejecuta todo dentro de tu máquina virtual; si un paso falla, avísanos con un Issue.",
              "Each guide says whether OSINTario has tested the installation and when. Run everything inside your virtual machine; if a step fails, tell us with an Issue.",
              "Cada guia indica se o OSINTario já testou a instalação e quando. Execute tudo dentro da sua máquina virtual; se um passo falhar, avise-nos com uma Issue."),
    "types_h": ("Según el tipo de herramienta", "By type of tool", "Conforme o tipo de ferramenta"),
    "types": {
        "py": (("Python (pipx o entorno virtual)", "Python (pipx or virtual environment)", "Python (pipx ou ambiente virtual)"),
               ("Cada herramienta en su propio entorno, así sus dependencias no tocan el sistema. Nunca uses «sudo pip».",
                "Each tool in its own environment, so its dependencies never touch the system. Never use “sudo pip”.",
                "Cada ferramenta no seu próprio ambiente, assim as dependências não tocam o sistema. Nunca use «sudo pip»."),
               "# si está publicada en PyPI\npipx install NOMBRE\n\n# desde el repositorio\ngit clone https://github.com/AUTOR/REPO && cd REPO\npython3 -m venv .venv && source .venv/bin/activate\ncat requirements.txt        # revisa qué instala\npip install -r requirements.txt"),
        "go": (("Go (binario único)", "Go (single binary)", "Go (binário único)"),
               ("Se compila a un solo archivo sin dependencias. Instala desde el código o baja el binario de «Releases» y compara su checksum.",
                "Compiles to a single file with no dependencies. Install from source or download the binary from “Releases” and compare its checksum.",
                "Compila para um único arquivo sem dependências. Instale pelo código ou baixe o binário em «Releases» e compare o checksum."),
               "go install github.com/AUTOR/REPO/cmd/NOMBRE@latest\n\n# o binario publicado\nsha256sum NOMBRE_linux_amd64.zip   # compara con checksums.txt"),
        "docker": (("Docker (contenedor)", "Docker (container)", "Docker (contêiner)"),
                   ("Usa la imagen oficial con una versión fija. No montes tu carpeta personal ni uses «--privileged».",
                    "Use the official image pinned to a version. Do not mount your home folder or use “--privileged”.",
                    "Use a imagem oficial com versão fixa. Não monte sua pasta pessoal nem use «--privileged»."),
                   "docker run --rm -it -v \"$PWD/salida:/data\" AUTOR/IMAGEN:VERSION\n\n# servicios con varios contenedores\ndocker compose up -d      # lee antes el docker-compose.yml"),
        "vm": (("Solo en máquina virtual", "Virtual machine only", "Só em máquina virtual"),
               ("El instalador pide sudo, toca el sistema o la herramienta es ofensiva (explotación, contraseñas, Wi-Fi). Úsala en una VM desechable y solo contra sistemas propios o con autorización escrita. Para Wi-Fi necesitas un adaptador USB conectado a la VM.",
                "The installer needs sudo, changes the system, or the tool is offensive (exploitation, passwords, Wi-Fi). Use a disposable VM and only against your own systems or with written authorization. For Wi-Fi you need a USB adapter attached to the VM.",
                "O instalador pede sudo, altera o sistema ou a ferramenta é ofensiva (exploração, senhas, Wi-Fi). Use numa VM descartável e só contra sistemas próprios ou com autorização por escrito. Para Wi-Fi é preciso um adaptador USB ligado à VM."),
               "# 1. snapshot de la VM\n# 2. en Kali muchas ya vienen en los repositorios oficiales\nsudo apt update && sudo apt install NOMBRE\n\n# 3. si solo hay instalador propio, léelo primero\ngit clone https://github.com/AUTOR/REPO && cd REPO\nless install.sh"),
        "app": (("Instalador oficial", "Official installer", "Instalador oficial"),
                ("Programa de escritorio o paquete del proyecto. Descárgalo solo del sitio oficial y verifica la firma o el hash publicado.",
                 "Desktop program or project package. Download it only from the official site and verify the published signature or hash.",
                 "Programa de desktop ou pacote do projeto. Baixe só do site oficial e verifique a assinatura ou o hash publicado."),
                "sha256sum instalador.exe      # Linux / macOS\nGet-FileHash instalador.exe    # Windows PowerShell"),
    },
    "legal": ("<b>Instalar no es tener permiso.</b> Escanear, explotar o interceptar sistemas ajenos sin autorización es delito en la mayoría de los países. Practica en tu propio laboratorio.",
              "<b>Installing is not permission.</b> Scanning, exploiting or intercepting systems you do not own without authorization is a crime in most countries. Practice in your own lab.",
              "<b>Instalar não é ter permissão.</b> Escanear, explorar ou interceptar sistemas alheios sem autorização é crime na maioria dos países. Pratique no seu próprio laboratório."),
    "note": ("Esta guía es general: mejora con cada revisión. Si una herramienta necesita pasos propios, se indica en su ficha.",
             "This guide is general and improves with each review. If a tool needs steps of its own, its card says so.",
             "Este guia é geral e melhora a cada revisão. Se uma ferramenta precisar de passos próprios, a ficha indica."),
    "back": ("Volver al directorio", "Back to the directory", "Voltar ao diretório"),
    "nav": ("Instalación segura", "Safe install", "Instalação segura"),
}


# Instructivos por herramienta. La clave es el nombre exacto en TOOLS y debe figurar en GUIDED (directory.js).
# Cada uno: (para qué sirve ES/EN/PT, comandos, aviso ES/EN/PT o None). Los comandos se traducen con CODE_TR.
HOWTO = {
    "Kali Linux": (("La base del laboratorio: una máquina virtual con cientos de herramientas ya instaladas. Empieza por aquí.",
                    "The base of your lab: a virtual machine with hundreds of tools preinstalled. Start here.",
                    "A base do laboratório: uma máquina virtual com centenas de ferramentas já instaladas. Comece por aqui."),
                   "# 1. descarga la imagen para VirtualBox o VMware solo desde kali.org/get-kali (Virtual Machines)\n# 2. comprueba que el hash coincide con el publicado en la web\nsha256sum kali-linux-*-virtualbox-amd64.7z\n# 3. importa la VM, entra con kali / kali y cambia la clave\npasswd\n# 4. actualiza y toma un snapshot limpio\nsudo apt update && sudo apt full-upgrade -y",
                   None),
    "Sherlock": (("Busca un alias en cientos de redes sociales.", "Checks a username on hundreds of social networks.", "Busca um apelido em centenas de redes sociais."),
                 "pipx install sherlock-project\nsherlock ALIAS\n\n# sin instalar nada, con Docker\ndocker run --rm -it sherlock/sherlock ALIAS",
                 ("Un alias igual en dos redes es una hipótesis, no una identidad confirmada.", "The same username on two networks is a hypothesis, not a confirmed identity.", "O mesmo apelido em duas redes é uma hipótese, não uma identidade confirmada.")),
    "Maigret": (("Busca un alias en miles de sitios y arma un informe con los datos de cada perfil.", "Checks a username on thousands of sites and builds a report with each profile's data.", "Busca um apelido em milhares de sites e monta um relatório com os dados de cada perfil."),
                "pipx install maigret\nmaigret ALIAS --html\n\n# con Docker; el informe queda en ./informes\ndocker run --rm -v \"$PWD/informes:/app/reports\" soxoj/maigret:latest ALIAS --html",
                None),
    "theHarvester": (("Reúne subdominios, emails y hosts de un dominio desde fuentes públicas.", "Collects subdomains, emails and hosts for a domain from public sources.", "Reúne subdomínios, emails e hosts de um domínio a partir de fontes públicas."),
                     "# en Kali ya viene instalado\ntheHarvester -d DOMINIO -b crtsh,certspotter\n\n# desde el repositorio (usa uv)\ngit clone https://github.com/laramies/theHarvester && cd theHarvester\nuv sync\nuv run theHarvester -d DOMINIO -b crtsh,certspotter",
                     None),
    "Subfinder": (("Enumera subdominios de forma pasiva: no toca el dominio investigado.", "Enumerates subdomains passively: it never touches the target domain.", "Enumera subdomínios de forma passiva: não toca o domínio investigado."),
                  "go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest\nsubfinder -d DOMINIO -o subdominios.txt",
                  None),
    "Nuclei": (("Escanea un sitio con plantillas de vulnerabilidades conocidas.", "Scans a site with templates for known vulnerabilities.", "Escaneia um site com templates de vulnerabilidades conhecidas."),
               "go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest\nnuclei -target https://TU-SITIO",
               ("Es un escaneo activo: solo contra sistemas propios o con autorización escrita.", "This is an active scan: only against your own systems or with written authorization.", "É um escaneamento ativo: só contra sistemas próprios ou com autorização por escrito.")),
    "Nmap": (("Descubre puertos abiertos y servicios.", "Discovers open ports and services.", "Descobre portas abertas e serviços."),
             "sudo apt install nmap          # en Kali ya viene instalado\n# scanme.nmap.org es el equipo que Nmap ofrece para practicar\nnmap -sV scanme.nmap.org",
             ("Es un escaneo activo: solo contra sistemas propios o con autorización escrita.", "This is an active scan: only against your own systems or with written authorization.", "É um escaneamento ativo: só contra sistemas próprios ou com autorização por escrito.")),
    "ExifTool": (("Lee los metadatos de fotos y documentos: fecha, equipo, autor, GPS.", "Reads metadata from photos and documents: date, device, author, GPS.", "Lê os metadados de fotos e documentos: data, equipamento, autor, GPS."),
                 "sudo apt install libimage-exiftool-perl\nexiftool ARCHIVO.jpg\n\n# trabaja siempre sobre una copia y guarda el hash del original\nsha256sum ARCHIVO.jpg",
                 None),
    "yt-dlp": (("Descarga un video con sus metadatos para preservarlo como evidencia.", "Downloads a video with its metadata to preserve it as evidence.", "Baixa um vídeo com seus metadados para preservá-lo como evidência."),
               "pipx install \"yt-dlp[default]\"\nyt-dlp --write-info-json URL\nsha256sum *.mp4                # hash del archivo para la cadena de custodia",
               None),
    "Wireshark": (("Abre y analiza capturas de tráfico de red.", "Opens and analyzes network traffic captures.", "Abre e analisa capturas de tráfego de rede."),
                  "sudo apt install wireshark     # en Kali ya viene instalado\nwireshark CAPTURA.pcap\n\n# para capturar sin ser root\nsudo usermod -aG wireshark $USER   # cierra sesión y vuelve a entrar",
                  ("Captura solo tráfico de tu red o con autorización.", "Capture traffic only on your own network or with authorization.", "Capture tráfego só da sua rede ou com autorização.")),
}

# Herramientas cuya instalación se probó de punta a punta (fecha de la última prueba). Las demás se muestran como pendientes.
TESTED = {"Sherlock": "2026-11-21", "Maigret": "2026-11-21", "theHarvester": "2026-11-21", "Nmap": "2026-11-21", "ExifTool": "2026-11-21", "yt-dlp": "2026-11-21", "Wireshark": "2026-11-21"}
TEST_OK = ("✅ Instalación probada por OSINTario el", "✅ Installation tested by OSINTario on", "✅ Instalação testada pelo OSINTario em")
TEST_NO = ("🕓 Comandos tomados de la documentación oficial; OSINTario aún no probó esta instalación.", "🕓 Commands taken from the official documentation; OSINTario has not tested this installation yet.", "🕓 Comandos tirados da documentação oficial; o OSINTario ainda não testou esta instalação.")


# Herramientas de riesgo analizadas por OSINTario (decisión de Federico, 23-nov): no se instalan ni se ejecutan;
# se analizan en un contenedor aislado, se muestran con su riesgo y con el enlace real (no a copias ni a estafas).
# Cada una: nombre exacto en TOOLS, veredicto, qué es, hallazgos (lista), imagen propia, enlaces de terceros [(texto, url)].
RISK = {
    "ARTEMIS": (
        ("Riesgo alto: agentes de IA que atacan solos", "High risk: AI agents that attack on their own", "Risco alto: agentes de IA que atacam sozinhos"),
        ("Motor de Stanford (proyecto Trinity, Apache 2.0) que lanza varios agentes de IA en paralelo para encontrar y explotar vulnerabilidades. Se presentó en un paper de ICLR 2026 que lo comparó con pentesters humanos.",
         "Stanford engine (Trinity project, Apache 2.0) that launches several AI agents in parallel to find and exploit vulnerabilities. It was presented in an ICLR 2026 paper that compared it with human pentesters.",
         "Motor de Stanford (projeto Trinity, Apache 2.0) que lança vários agentes de IA em paralelo para encontrar e explorar vulnerabilidades. Foi apresentado num artigo do ICLR 2026 que o comparou com pentesters humanos."),
        (["El alcance (qué se puede atacar) solo se le escribe al modelo en el prompt: en el código no encontramos ningún bloqueo técnico que impida salir de ese alcance.",
          "Los agentes corren con acceso a la red activado y ejecutan comandos reales de Kali.",
          "Necesita claves pagas de OpenAI u OpenRouter; cada prueba consume créditos.",
          "Último commit: 31-dic-2025. Es un proyecto de investigación, no un producto mantenido."],
         ["The scope (what may be attacked) is only written to the model in the prompt: we found no technical block in the code that stops it from leaving that scope.",
          "The agents run with network access enabled and execute real Kali commands.",
          "It needs paid OpenAI or OpenRouter keys; every test spends credits.",
          "Last commit: 31 Dec 2025. It is a research project, not a maintained product."],
         ["O escopo (o que pode ser atacado) só é escrito ao modelo no prompt: não encontrámos no código nenhum bloqueio técnico que impeça sair desse escopo.",
          "Os agentes correm com acesso à rede ativado e executam comandos reais do Kali.",
          "Precisa de chaves pagas da OpenAI ou OpenRouter; cada teste consome créditos.",
          "Último commit: 31-dez-2025. É um projeto de pesquisa, não um produto mantido."]),
        "riesgo-artemis.png",
        [("Paper (arXiv 2512.09882)", "https://arxiv.org/abs/2512.09882")],
    ),
    "RedRoot": (
        ("Riesgo alto: framework ofensivo; el módulo del reel no es público", "High risk: offensive framework; the module in the reel is not public", "Risco alto: framework ofensivo; o módulo do reel não é público"),
        ("Framework ofensivo en Python (MIT, 2026) de Agampreet Singh con más de 30 módulos: phishing, backdoor, DoS, desautenticación Wi-Fi, inyección SQL y otros. Se hizo conocido por un reel que extrae contactos y SMS de un Android por Bluetooth.",
         "Offensive Python framework (MIT, 2026) by Agampreet Singh with 30+ modules: phishing, backdoor, DoS, Wi-Fi deauthentication, SQL injection and more. It became known through a reel that pulls contacts and SMS from an Android phone over Bluetooth.",
         "Framework ofensivo em Python (MIT, 2026) de Agampreet Singh com mais de 30 módulos: phishing, backdoor, DoS, desautenticação Wi-Fi, injeção SQL e outros. Ficou conhecido por um reel que extrai contactos e SMS de um Android por Bluetooth."),
        (["El módulo Bluetooth público (redrootbluesnarf) no extrae nada: solo muestra «MODULE LOCKED» y pide contactar al autor. Lo ejecutamos en un contenedor aislado (48 líneas, solo imprime texto): la captura es real.",
          "El mensaje «Logging attempt... Done» es decorativo: el código no registra nada.",
          "Según su autor, el ataque no usa ninguna falla: depende de que la víctima acepte el emparejamiento y el acceso a contactos y mensajes. La defensa es no aceptar dispositivos desconocidos.",
          "El instalador instala bettercap con apt y 15 paquetes de Python sin fijar versiones.",
          "Actualización 25-nov-2026: el repo ya no está disponible en GitHub (404). El análisis corresponde a la versión revisada el 23-nov."],
         ["The public Bluetooth module (redrootbluesnarf) extracts nothing: it only shows “MODULE LOCKED” and asks you to contact the author. We ran it in an isolated container (48 lines, only prints text): the screenshot is real.",
          "The “Logging attempt... Done” message is decorative: the code logs nothing.",
          "According to its author, the attack uses no flaw: it relies on the victim accepting the pairing and the access to contacts and messages. The defence is not to accept unknown devices.",
          "The installer installs bettercap with apt and 15 Python packages without pinned versions.",
          "Update 25 Nov 2026: the repo is no longer available on GitHub (404). This analysis covers the version reviewed on 23 Nov."],
         ["O módulo Bluetooth público (redrootbluesnarf) não extrai nada: só mostra «MODULE LOCKED» e pede para contactar o autor. Executámo-lo num contentor isolado (48 linhas, só imprime texto): a captura é real.",
          "A mensagem «Logging attempt... Done» é decorativa: o código não regista nada.",
          "Segundo o autor, o ataque não usa nenhuma falha: depende de a vítima aceitar o emparelhamento e o acesso a contactos e mensagens. A defesa é não aceitar dispositivos desconhecidos.",
          "O instalador instala o bettercap com apt e 15 pacotes de Python sem versões fixas.",
          "Atualização 25-nov-2026: o repo já não está disponível no GitHub (404). Esta análise corresponde à versão revista a 23-nov."]),
        "riesgo-redroot.png",
        [("Reel del autor (Instagram)", "https://www.instagram.com/reel/DgCzw-Pz9Qq/")],
    ),
    "DarkFly-Tool": (
        ("No recomendado: abandonado, ofuscado e incluye spam de SMS", "Not recommended: abandoned, obfuscated and includes SMS spam", "Não recomendado: abandonado, ofuscado e inclui spam de SMS"),
        ("Menú para Termux que promete instalar más de 500 herramientas eligiendo un número. Muy compartido en redes y blogs.",
         "Termux menu that promises to install 500+ tools by picking a number. Widely shared on social media and blogs.",
         "Menu para Termux que promete instalar mais de 500 ferramentas escolhendo um número. Muito partilhado em redes e blogs."),
        (["Abandonado desde 2019 y escrito para Python 2, que ya no tiene soporte. Su propio README dice que en Linux no funciona.",
          "El código principal está ofuscado: bytecode de Python 2 cifrado con una tabla de sustitución dentro de archivos ocultos (.module/files). No se puede revisar qué instala ni de dónde.",
          "El instalador ejecuta comandos leídos de esos archivos ocultos, entre ellos «rm -rf» sobre carpetas del sistema de Termux.",
          "Incluye 7 herramientas de spam de SMS que abusan de los formularios de código (OTP) de empresas de Indonesia (KFC, Telkomsel, Tokopedia, Matahari, JD.id) para bombardear un número. Usarlas contra alguien es acoso.",
          "No lo instalamos ni lo ejecutamos: solo análisis estático del repositorio."],
         ["Abandoned since 2019 and written for Python 2, which is no longer supported. Its own README says it does not work on Linux.",
          "The main code is obfuscated: Python 2 bytecode encrypted with a substitution table inside hidden files (.module/files). There is no way to review what it installs or from where.",
          "The installer runs commands read from those hidden files, including “rm -rf” on Termux system folders.",
          "It ships 7 SMS spam tools that abuse the one-time-code (OTP) forms of Indonesian companies (KFC, Telkomsel, Tokopedia, Matahari, JD.id) to flood a phone number. Using them against someone is harassment.",
          "We did not install or run it: static analysis of the repository only."],
         ["Abandonado desde 2019 e escrito para Python 2, que já não tem suporte. O próprio README diz que no Linux não funciona.",
          "O código principal está ofuscado: bytecode de Python 2 cifrado com uma tabela de substituição dentro de ficheiros ocultos (.module/files). Não é possível rever o que instala nem de onde.",
          "O instalador executa comandos lidos desses ficheiros ocultos, entre eles «rm -rf» sobre pastas do sistema do Termux.",
          "Inclui 7 ferramentas de spam de SMS que abusam dos formulários de código (OTP) de empresas da Indonésia (KFC, Telkomsel, Tokopedia, Matahari, JD.id) para bombardear um número. Usá-las contra alguém é assédio.",
          "Não o instalámos nem executámos: só análise estática do repositório."]),
        "riesgo-darkfly.png",
        [("Cómo se ve funcionando (artículo de terceros en DEV)", "https://dev.to/terminaltools/darkfly-tool-for-termux-install-542-ethical-hacking-tools-easily-5edi")],
    ),
}
RISK_T = {
    "h": ("Herramientas de riesgo analizadas", "Risky tools we analysed", "Ferramentas de risco analisadas"),
    "p": ("No decidimos por ti si las usas: las mostramos con lo que encontramos y con su enlace real, para que no termines en una copia falsa o en una estafa. Las analizamos en un contenedor aislado, sin instalarlas. Si decides probarlas, hazlo en una máquina virtual desechable y bajo tu responsabilidad.",
          "We do not decide for you whether to use them: we show them with what we found and with their real link, so you do not end up on a fake copy or a scam. We analysed them in an isolated container without installing them. If you decide to try them, do it in a disposable virtual machine and at your own risk.",
          "Não decidimos por você se as usa: mostramo-las com o que encontrámos e com o link real, para não acabar numa cópia falsa ou num golpe. Analisámo-las num contentor isolado, sem as instalar. Se decidir testá-las, faça-o numa máquina virtual descartável e sob sua responsabilidade."),
    "found": ("Qué encontramos (23-nov-2026)", "What we found (23 Nov 2026)", "O que encontrámos (23-nov-2026)"),
    "repo": ("Repositorio real", "Real repository", "Repositório real"),
    "alt": ("Captura del análisis de OSINTario", "Screenshot of OSINTario's analysis", "Captura da análise do OSINTario"),
}


def slug(name):
    return "t-" + re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

CODE_TR = [
    ("# si está publicada en PyPI", "# if it is published on PyPI", "# se estiver publicada no PyPI"),
    ("# desde el repositorio", "# from the repository", "# a partir do repositório"),
    ("# revisa qué instala", "# check what it installs", "# veja o que instala"),
    ("# o binario publicado", "# or the published binary", "# ou o binário publicado"),
    ("# compara con checksums.txt", "# compare with checksums.txt", "# compare com checksums.txt"),
    ("# servicios con varios contenedores", "# multi-container services", "# serviços com vários contêineres"),
    ("# lee antes el docker-compose.yml", "# read docker-compose.yml first", "# leia antes o docker-compose.yml"),
    ("# 1. snapshot de la VM", "# 1. snapshot the VM", "# 1. snapshot da VM"),
    ("# 2. en Kali muchas ya vienen en los repositorios oficiales", "# 2. on Kali many are already in the official repositories", "# 2. no Kali muitas já estão nos repositórios oficiais"),
    ("# 3. si solo hay instalador propio, léelo primero", "# 3. if there is only a custom installer, read it first", "# 3. se só houver instalador próprio, leia-o primeiro"),
    ("# 1. descarga la imagen para VirtualBox o VMware solo desde kali.org/get-kali (Virtual Machines)", "# 1. download the VirtualBox or VMware image only from kali.org/get-kali (Virtual Machines)", "# 1. baixe a imagem para VirtualBox ou VMware só de kali.org/get-kali (Virtual Machines)"),
    ("# 2. comprueba que el hash coincide con el publicado en la web", "# 2. check that the hash matches the one published on the site", "# 2. confira se o hash coincide com o publicado no site"),
    ("# 3. importa la VM, entra con kali / kali y cambia la clave", "# 3. import the VM, log in with kali / kali and change the password", "# 3. importe a VM, entre com kali / kali e troque a senha"),
    ("# 4. actualiza y toma un snapshot limpio", "# 4. update and take a clean snapshot", "# 4. atualize e tire um snapshot limpo"),
    ("# sin instalar nada, con Docker", "# nothing to install, with Docker", "# sem instalar nada, com Docker"),
    ("# con Docker; el informe queda en ./informes", "# with Docker; the report is saved in ./reports", "# com Docker; o relatório fica em ./relatorios"),
    ("/informes:", "/reports:", "/relatorios:"),
    ("# en Kali ya viene instalado", "# preinstalled on Kali", "# já vem instalado no Kali"),
    ("# desde el repositorio (usa uv)", "# from the repository (uses uv)", "# a partir do repositório (usa uv)"),
    ("# scanme.nmap.org es el equipo que Nmap ofrece para practicar", "# scanme.nmap.org is the host Nmap provides for practice", "# scanme.nmap.org é a máquina que o Nmap oferece para praticar"),
    ("# trabaja siempre sobre una copia y guarda el hash del original", "# always work on a copy and keep the hash of the original", "# trabalhe sempre numa cópia e guarde o hash do original"),
    ("# hash del archivo para la cadena de custodia", "# file hash for the chain of custody", "# hash do arquivo para a cadeia de custódia"),
    ("# para capturar sin ser root", "# to capture without being root", "# para capturar sem ser root"),
    ("# cierra sesión y vuelve a entrar", "# log out and back in", "# saia e entre de novo"),
    ("subdominios.txt", "subdomains.txt", "subdominios.txt"), ("TU-SITIO", "YOUR-SITE", "SEU-SITE"), ("DOMINIO", "example.com", "exemplo.com"),
    ("ARCHIVO", "FILE", "ARQUIVO"), ("CAPTURA", "CAPTURE", "CAPTURA"), ("ALIAS", "USERNAME", "APELIDO"),
    ("NOMBRE", "NAME", "NOME"), ("AUTOR", "AUTHOR", "AUTOR"), ("IMAGEN", "IMAGE", "IMAGEM"), ("/salida:", "/output:", "/saida:"), ("instalador.exe", "installer.exe", "instalador.exe"),
]


def guide(lang):
    i = LANGS.index(lang)
    t = lambda k: GS[k][i]
    csp = "default-src 'none'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; base-uri 'none'; form-action 'none'"
    h = head(lang, t("title") + " · OSINTario", t("desc"), GUIDEP[lang], GUIDEP, csp, "home.css") + "</head>\n<body>\n"
    h += header(lang, nav_links(lang), TOOLSP[lang], "Multi-OSINT Lite", GUIDEP)
    rules = "".join(f"<li><b>{a}</b><span>{b}</span></li>" for a, b in (r.split("|", 1) for r in t("rules")))
    def code(c):
        for es, en, pt in CODE_TR:
            c = c.replace(es, (es, en, pt)[i])
        return html.escape(c)
    types = "".join(f'<article class="gtype" id="{k}"><h3>🧪 {v[0][i]}</h3><p>{v[1][i]}</p><pre><code>{code(v[2])}</code></pre></article>' for k, v in GS["types"].items())
    src = open("directory.js", encoding="utf-8").read()
    guided = json.loads(re.search(r"const GUIDED = (\[[^\]]*\]);", src).group(1))
    if sorted(guided) != sorted(HOWTO):
        raise SystemExit("GUIDED (directory.js) y HOWTO (build.py) no coinciden")
    urls = dict(re.findall(r'^\["[a-z]+","((?:[^"\\]|\\.)*)",.*?,"(https?://[^"]+)"', src, re.M))
    hows = "".join(f'<article class="gtype" id="{slug(n)}"><h3>{html.escape(n)}</h3><p>{v[0][i]} <a href="{urls[n]}" target="_blank" rel="noopener noreferrer">{("Sitio oficial", "Official site", "Site oficial")[i]} ↗</a></p><pre><code>{code(v[1])}</code></pre>'
                   + (f'<p class="warn">⚠️ {v[2][i]}</p>' if v[2] else "") + f'<p class="warn">{TEST_OK[i] + " " + TESTED[n] if n in TESTED else TEST_NO[i]}</p></article>' for n, v in HOWTO.items())
    toc = "".join(f'<a class="chip" href="#{slug(n)}">{html.escape(n)}</a>' for n in HOWTO)
    analyzed = json.loads(re.search(r"const ANALYZED = (\[[^\]]*\]);", src).group(1))
    if sorted(analyzed) != sorted(RISK):
        raise SystemExit("ANALYZED (directory.js) y RISK (build.py) no coinciden")
    for n in RISK:
        if n not in urls:
            raise SystemExit(f"RISK: '{n}' no está en TOOLS")
    risks = "".join(f'<article class="gtype" id="{slug(n)}"><h3>⚠️ {html.escape(n)}</h3><p class="warn"><b>{v[0][i]}</b></p><p>{v[1][i]}</p>'
                    f'<p><b>{RISK_T["found"][i]}</b></p><ul>' + "".join(f"<li>{html.escape(x)}</li>" for x in v[2][i]) + '</ul>'
                    f'<figure class="gfig"><img src="{v[3]}" alt="{RISK_T["alt"][i]}: {html.escape(n)}" loading="lazy"><figcaption class="note">{RISK_T["alt"][i]}</figcaption></figure>'
                    f'<p><a href="{urls[n]}" target="_blank" rel="noopener noreferrer">{RISK_T["repo"][i]} ↗</a>' + "".join(f' · <a href="{u}" target="_blank" rel="noopener noreferrer">{html.escape(tx)} ↗</a>' for tx, u in v[4]) + '</p></article>'
                    for n, v in RISK.items())
    return h + f"""<main id="main"><section><div class="wrap guide">
  <span class="tag">OSINTario</span>
  <h1>{t("title")}</h1>
  <p class="lede">{t("lede")}</p>
  <p class="ethics" role="note"><span aria-hidden="true">⚖️</span> <span>{t("legal")}</span></p>
  <h2>{t("rules_h")}</h2>
  <ol class="steps">{rules}</ol>
  <h2 id="paso-a-paso">{t("how_h")}</h2>
  <p class="lede">{t("how_p")}</p>
  <div class="chips">{toc}</div>
  {hows}
  <h2 id="riesgo">{RISK_T["h"][i]}</h2>
  <p class="lede">{RISK_T["p"][i]}</p>
  {risks}
  <h2>{t("types_h")}</h2>
  {types}
  <p class="note">{t("note")}</p>
  <p><a class="btn ghost" href="{HOME[lang]}#directorio">{t("back")}</a></p>
</div></section></main>
<footer><div class="wrap"><div>{s("foot", lang)}</div><div>OSINTario · Federico Dosio</div></div></footer>
</body>
</html>
"""


def dirlinks():
    """Genera dirlinks.js para Multi-OSINT Lite a partir de TOOLS y LAUNCH de directory.js."""
    src = open("directory.js", encoding="utf-8").read()
    launch = json.loads(re.search(r"const LAUNCH = (\{[\s\S]*?\n\});", src).group(1))
    rows, descs = {}, {}
    for m in re.finditer(r'^\["([a-z]+)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","((?:[^"\\]|\\.)*)","([a-z]+)","(?:[^"\\]|\\.)*","([lp]*)"(?:,"[a-z]*")?\]', src, re.M):
        rows[m.group(2)] = (m.group(6), m.group(7))
        descs[m.group(2)] = [json.loads('"' + m.group(k) + '"') for k in (3, 4, 5)]
    out = []
    for name, kinds in launch.items():
        if name not in rows:
            raise SystemExit(f"LAUNCH: '{name}' no está en TOOLS")
        st, acc = rows[name]
        if st != "no":
            out.append([name, acc, kinds])
    locked = json.loads(re.search(r"const LOCKED = (\[[\s\S]*?\n\]);", src).group(1))
    lk = []
    for name, goal, tab in locked:
        if name not in descs:
            raise SystemExit(f"LOCKED: '{name}' no está en TOOLS")
        lk.append([name, goal, tab, descs[name]])
    open("dirlinks.js", "w", encoding="utf-8").write("/* Generado por build.py desde directory.js (LAUNCH y LOCKED). No editar a mano. */\nconst DIRLINKS = " + json.dumps(out, ensure_ascii=False) + ";\nconst DIRLOCKED = " + json.dumps(lk, ensure_ascii=False) + ";\n")
    return len(out)


if __name__ == "__main__":
    for lang in LANGS:
        open(HOME[lang], "w", encoding="utf-8").write(home(lang))
        open(TOOLSP[lang], "w", encoding="utf-8").write(tools(lang))
        open(STARP[lang], "w", encoding="utf-8").write(star(lang))
        open(GUIDEP[lang], "w", encoding="utf-8").write(guide(lang))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for pages in (HOME, TOOLSP, STARP, GUIDEP):
        for l in LANGS:
            alts = "".join(f'<xhtml:link rel="alternate" hreflang="{x}" href="{BASE}{pages[x]}"/>' for x in LANGS)
            sm.append(f"  <url><loc>{BASE}{pages[l]}</loc>{alts}</url>")
    sm.append("</urlset>")
    open("sitemap.xml", "w").write("\n".join(sm) + "\n")
    print("OK: 12 páginas y sitemap")
    print(f"dirlinks.js: {dirlinks()} herramientas del directorio con atajo")


def readme():
    """Regenera README.md desde directory.js (descripciones en español)."""
    src = open("directory.js", encoding="utf-8").read()
    tools = json.loads(re.sub(r",\s*\]$", "]", src[src.index("const TOOLS = [") + 14: src.index("\n];", src.index("const TOOLS = [")) + 2].strip()))
    cats = json.loads("{" + re.sub(r"(\w+):", r'"\1":', src[src.index("const CATS = {") + 14: src.index("};")]).rstrip().rstrip(",") + "}")
    st = {"ok": "✅ Activa", "lim": "🟡 Con límites", "risk": "⚠️ Con precaución", "no": "❌ Descartada"}
    acc = {"l": "🔑 registro", "p": "💳 pago"}
    ins = {"py": "🧪 Python", "go": "🧪 Go", "docker": "🧪 Docker", "vm": "🧪 solo en VM", "app": "🧪 instalador oficial"}
    out = ["# OSINTario", "",
           "Directorio de herramientas OSINT revisado a mano, en **español, inglés y portugués**: qué hace cada una, si sigue activa, si pide registro o pago y cuándo usarla con cuidado.", "",
           f"🌐 [Español]({BASE}) · [English]({BASE}en.html) · [Português]({BASE}pt.html) · Mantenido por Federico Dosio, profesor de Investigación con Fuentes Abiertas (IFA) en el Instituto Universitario de la Policía Federal Argentina (IUPFA).", "",
           "## 🔎 Multi-OSINT Lite (gratis, en tu navegador)", "",
           f"Investiga un **dominio, una IP, un alias, un email, un teléfono, un sitio .onion o una imagen** y genera dorks de Google: [ES]({BASE}herramientas.html) · [EN]({BASE}tools-en.html) · [PT]({BASE}ferramentas.html)", "",
           "- Consulta varias fuentes a la vez: Google DNS, crt.sh, RDAP, Wayback, AlienVault OTX, Shodan InternetDB, ipinfo, Tor Onionoo, AIL onion-lookup, GitHub, Keybase, Gravatar, Proton y Have I Been Pwned.",
           "- Informe con fuente, nivel de confianza y **hash SHA-256**, exportable en JSON, Markdown o PDF.",
           "- **Sin servidor:** lo que buscas no pasa por OSINTario.", "",
           f"> Si te sirve, deja una ⭐ ([cómo hacerlo en 30 segundos]({BASE}estrella)). Con 100 estrellas se destraba el barrido de alias en miles de sitios y con 1.000, el resto ([ver metas]({BASE}herramientas.html#comunidad)). Las sugerencias van por *Issues* o *Pull Request*.", "",
           "## ⚖️ Uso ético y legal", "",
           "OSINTario es una guía para investigar con fuentes abiertas, no un permiso. Cada búsqueda sobre una persona necesita una **finalidad legítima y base legal** (RGPD y leyes locales). No lo uses para acosar, vigilar a parejas o exparejas, exponer datos personales ni acceder a sistemas sin autorización. Quien busca es responsable de lo que hace con la información.", "",
           "Las herramientas más sensibles (búsqueda de personas, apps de citas, reconocimiento facial) están marcadas ⚠️ y cada una explica su riesgo y cuándo está justificado usarla.", "",
           "> *Federico Dosio · Profesor de Investigación con Fuentes Abiertas (IFA), Instituto Universitario de la Policía Federal Argentina (IUPFA)*", "",
           f"**Herramientas:** {len(tools)} · **Última revisión:** {re.search(r'REVIEWED = \"([^\"]+)\"', src).group(1)}", "",
           "Estados: ✅ activa · 🟡 con límites · ⚠️ con precaución · ❌ descartada (no se enlaza). Acceso: 🔑 requiere registro · 💳 de pago o con funciones pagas. Instalación: 🧪 la herramienta se instala; sigue la [guía de instalación segura](" + BASE + "instalacion-segura.html).", ""]
    for key, names in cats.items():
        rows = [t for t in tools if t[0] == key]
        if not rows:
            continue
        out += [f"## {names[0]}", "", "| Herramienta | Uso | Estado | Acceso | Instalación |", "|---|---|---|---|---|"]
        for t in rows:
            name = t[1] if t[5] == "no" else f"[{t[1]}]({t[6]})"
            out.append(f"| {name} | {t[2]} | {st[t[5]]} | {' '.join(acc[c] for c in t[7]) or 'libre'} | {ins.get(t[8], '') if len(t) > 8 else ''} |")
        out.append("")
    out += ["## Uso responsable", "", "Investigar a una persona requiere una finalidad lícita y respetar el RGPD y la ley de protección de datos de tu país. Este directorio enlaza a servicios de terceros sin afiliación.", "",
            "## Cómo se actualiza", "", "El contenido vive en `directory.js` (una fila por herramienta, con descripción en ES/EN/PT). `python3 build.py` regenera las 12 páginas, `dirlinks.js`, el sitemap y este README.", "",
            "## Licencia", "", "Contenido bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es)."]
    open("README.md", "w", encoding="utf-8").write("\n".join(out) + "\n")


readme()
print("README regenerado")
