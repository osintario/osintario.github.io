#!/usr/bin/env python3
"""Genera las páginas de OSINTario en español, inglés y portugués.

Uso: python3 build.py   (escribe index.html, en.html, pt.html, herramientas.html, tools-en.html, ferramentas.html)
El contenido del directorio vive en directory.js; los textos de las páginas, en STR (abajo).
"""
import json
import re

LANGS = ["es", "en", "pt"]
HOME = {"es": "index.html", "en": "en.html", "pt": "pt.html"}
TOOLSP = {"es": "herramientas.html", "en": "tools-en.html", "pt": "ferramentas.html"}
STARP = {"es": "estrella.html", "en": "star.html", "pt": "estrela.html"}
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
 "legend": ("Registro: necesitas crear una cuenta (gratis) para usarla. Pago: la herramienta o sus funciones útiles cuestan dinero. Nunca uses tu cuenta personal para investigar.",
            "Login: you need a (free) account to use it. Paid: the tool or its useful features cost money. Never investigate with your personal account.",
            "Cadastro: é preciso criar uma conta (grátis) para usar. Pago: a ferramenta ou seus recursos úteis custam dinheiro. Nunca investigue com sua conta pessoal."),
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
    links = f'<a href="#directorio">{s("nav_dir", lang)}</a><a class="opt" href="#metodo">{s("nav_met", lang)}</a><a class="opt" href="#kits">{s("nav_kits", lang)}</a><a class="opt" href="#sobre">{s("nav_about", lang)}</a>'
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
  <div class="pro">
    <div>
      <span class="tag">{s("s5_tag", lang)}</span>
      <h2>Multi-OSINT Pro</h2>
      <p class="lede">{s("s5_p", lang)}</p>
      <ul>{pro_li}</ul>
      <p class="no">{s("pro_no", lang)}</p>
    </div>
    <div class="wait">
      <p>{s("wait_p", lang)}</p>
      <a class="join" href="{GH}/issues/new?template=lista-espera.yml" target="_blank" rel="noopener noreferrer">{s("wait_b", lang)}</a>
      <p><a href="{GH}/issues/new?template=sugerir-herramienta.yml" target="_blank" rel="noopener noreferrer">{s("suggest", lang)}</a></p>
    </div>
  </div>
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
    <p class="note">{s("g_note", lang)}</p>
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
  <div>OSINTario · Federico Dosio<br>{s("foot2", lang)}</div>
</div></footer>
<script src="directory.js"></script>
<script src="home.js"></script>
</body>
</html>
'''
    return h


def tools(lang):
    csp = "default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src https:; base-uri 'none'; form-action 'none'"
    h = head(lang, s("tools_title", lang), s("tools_desc", lang), TOOLSP[lang], TOOLSP, csp, "site.css") + "</head>\n<body>\n"
    links = f'<a href="{HOME[lang]}#directorio">{s("nav_dir", lang)}</a><a class="opt" href="{HOME[lang]}#metodo">{s("nav_met", lang)}</a>'
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
    <div class="privacy"><span aria-hidden="true">🔒</span><span>{s("privacy", lang)}</span></div>
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
</main>
<footer><div class="wrap">
  {s("tfoot", lang)} · <a href="{HOME[lang]}">OSINTario</a> · Federico Dosio, {s("foot2", lang)} · <a href="{GH}/issues/new?template=sugerir-herramienta.yml" rel="noopener noreferrer" target="_blank">{s("improve", lang)}</a>
</div></footer>
<script src="exifr.umd.js"></script>
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
    h += header(lang, "", TOOLSP[lang], "Multi-OSINT Lite", STARP)
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


if __name__ == "__main__":
    for lang in LANGS:
        open(HOME[lang], "w", encoding="utf-8").write(home(lang))
        open(TOOLSP[lang], "w", encoding="utf-8").write(tools(lang))
        open(STARP[lang], "w", encoding="utf-8").write(star(lang))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for pages in (HOME, TOOLSP, STARP):
        for l in LANGS:
            alts = "".join(f'<xhtml:link rel="alternate" hreflang="{x}" href="{BASE}{pages[x]}"/>' for x in LANGS)
            sm.append(f"  <url><loc>{BASE}{pages[l]}</loc>{alts}</url>")
    sm.append("</urlset>")
    open("sitemap.xml", "w").write("\n".join(sm) + "\n")
    print("OK: 9 páginas y sitemap")


def readme():
    """Regenera README.md desde directory.js (descripciones en español)."""
    src = open("directory.js", encoding="utf-8").read()
    tools = json.loads(re.sub(r",\s*\]$", "]", src[src.index("const TOOLS = [") + 14: src.rindex("];") + 1].strip()))
    cats = json.loads("{" + re.sub(r"(\w+):", r'"\1":', src[src.index("const CATS = {") + 14: src.index("};")]).rstrip().rstrip(",") + "}")
    st = {"ok": "✅ Activa", "lim": "🟡 Con límites", "risk": "⚠️ Con precaución", "no": "❌ Descartada"}
    acc = {"l": "🔑 registro", "p": "💳 pago"}
    out = ["# OSINTario", "",
           "Directorio de herramientas OSINT revisado a mano, en **español, inglés y portugués**: qué hace cada una, si sigue activa, si pide registro o pago y cuándo usarla con cuidado.", "",
           f"🌐 [Español]({BASE}) · [English]({BASE}en.html) · [Português]({BASE}pt.html) · Mantenido por Federico Dosio, profesor de Investigación con Fuentes Abiertas (IFA) en el Instituto Universitario de la Policía Federal Argentina (IUPFA).", "",
           "## 🔎 Multi-OSINT Lite (gratis, en tu navegador)", "",
           f"Investiga un **dominio, una IP, un alias, un email, un teléfono, un sitio .onion o una imagen** y genera dorks de Google: [ES]({BASE}herramientas.html) · [EN]({BASE}tools-en.html) · [PT]({BASE}ferramentas.html)", "",
           "- Consulta varias fuentes a la vez: Google DNS, crt.sh, RDAP, Wayback, AlienVault OTX, Shodan InternetDB, ipinfo, Tor Onionoo, AIL onion-lookup, GitHub, Keybase, Gravatar, Proton y Have I Been Pwned.",
           "- Informe con fuente, nivel de confianza y **hash SHA-256**, exportable en JSON, Markdown o PDF.",
           "- **Sin servidor:** lo que buscas no pasa por OSINTario.", "",
           "> Si te sirve, deja una ⭐. Meta de la comunidad: 100 estrellas. Las sugerencias van por *Issues* o *Pull Request*.", "",
           f"**Herramientas:** {len(tools)} · **Última revisión:** {re.search(r'REVIEWED = \"([^\"]+)\"', src).group(1)}", "",
           "Estados: ✅ activa · 🟡 con límites · ⚠️ con precaución · ❌ descartada (no se enlaza). Acceso: 🔑 requiere registro · 💳 de pago o con funciones pagas.", ""]
    for key, names in cats.items():
        rows = [t for t in tools if t[0] == key]
        if not rows:
            continue
        out += [f"## {names[0]}", "", "| Herramienta | Uso | Estado | Acceso |", "|---|---|---|---|"]
        for t in rows:
            name = t[1] if t[5] == "no" else f"[{t[1]}]({t[6]})"
            out.append(f"| {name} | {t[2]} | {st[t[5]]} | {' '.join(acc[c] for c in t[7]) or 'libre'} |")
        out.append("")
    out += ["## Uso responsable", "", "Investigar a una persona requiere una finalidad lícita y respetar el RGPD y la ley de protección de datos de tu país. Este directorio enlaza a servicios de terceros sin afiliación.", "",
            "## Cómo se actualiza", "", "El contenido vive en `directory.js` (una fila por herramienta, con descripción en ES/EN/PT). `python3 build.py` regenera las 6 páginas, el sitemap y este README.", "",
            "## Licencia", "", "Contenido bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es)."]
    open("README.md", "w", encoding="utf-8").write("\n".join(out) + "\n")


readme()
print("README regenerado")
