/* OSINTario · Directorio único de herramientas (ES / EN / PT).
   Formato: [categoría, nombre, descripción ES, descripción EN, descripción PT, estado, URL, acceso]
   estado: ok = activa · lim = con límites · risk = con precaución · no = descartada
   acceso: "" libre · "l" requiere registro/login · "p" de pago o con funciones pagas · "lp" ambas
   Para sumar una herramienta: agrega una fila y actualiza REVIEWED. */
const REVIEWED = "2026-11-19";
const CATS = {
  col: ["Colecciones", "Collections", "Coleções"],
  infra: ["Infraestructura", "Infrastructure", "Infraestrutura"],
  dns: ["Dominios y DNS", "Domains & DNS", "Domínios e DNS"],
  threat: ["Amenazas", "Threat intel", "Ameaças"],
  code: ["Código y secretos", "Code & secrets", "Código e segredos"],
  people: ["Personas", "People", "Pessoas"],
  breach: ["Brechas", "Breaches", "Vazamentos"],
  media: ["Imágenes y video", "Images & video", "Imagens e vídeo"],
  geo: ["GEOINT y transporte", "GEOINT & transport", "GEOINT e transporte"],
  tg: ["Telegram", "Telegram", "Telegram"],
  social: ["Redes sociales", "Social media", "Redes sociais"],
  company: ["Empresas y registros", "Companies & records", "Empresas e registros"],
  dark: ["Dark web", "Dark web", "Dark web"],
  forensic: ["Forense digital", "Digital forensics", "Forense digital"],
  dating: ["Apps de citas (RGPD)", "Dating apps (GDPR)", "Apps de encontros (RGPD)"],
  auto: ["Frameworks, IA y automatización", "Frameworks, AI & automation", "Frameworks, IA e automação"],
};
const TOOLS = [
["col","OSINT Stuff Tool Collection","Cientos de herramientas online por categoría, incluidas Telegram y dark web.","Hundreds of online tools by category, including Telegram and dark web.","Centenas de ferramentas online por categoria, incluindo Telegram e dark web.","ok","https://github.com/cipher387/osint_stuff_tool_collection",""],
["col","Awesome OSINT","La lista curada más completa de la comunidad.","The most complete community-curated list.","A lista curada mais completa da comunidade.","ok","https://github.com/jivoi/awesome-osint",""],
["col","YogSec OSINT Tools","Lista enorme por categorías (alias, registros, cripto, deepfakes, extremismo…). Muy activa; sin licencia declarada. Sus herramientas de citas están en la categoría Apps de citas, con su aviso RGPD.","Huge categorised list (usernames, records, crypto, deepfakes, extremism…). Very active; no declared license. Its dating tools are in the Dating apps category, with a GDPR notice.","Lista enorme por categorias (alias, registos, cripto, deepfakes, extremismo…). Muito ativa; sem licença declarada. As ferramentas de encontros estão na categoria Apps de encontros, com aviso RGPD.","ok","https://github.com/yogsec/OSINT-Tools",""],
["col","OSINT Framework","Árbol interactivo de herramientas por tipo de dato.","Interactive tree of tools by data type.","Árvore interativa de ferramentas por tipo de dado.","ok","https://osintframework.com",""],
["col","Awesome OSINT Arsenal","Más de 100 herramientas con instalador en un comando.","100+ tools with a one-command installer.","Mais de 100 ferramentas com instalador em um comando.","ok","https://github.com/rawfilejson/awesome-osint-arsenal",""],
["col","OSINTJet Quick Search","Lanzador de búsquedas por categoría. Servicio comercial nuevo: no subas datos de casos reales.","Search launcher by category. New commercial service: don't upload real case data.","Lançador de buscas por categoria. Serviço comercial novo: não envie dados de casos reais.","lim","https://osintjet.com/en/osint-search-tools/",""],
["col","OSINT Navigator","Buscador de más de 7.500 herramientas OSINT.","Search engine for 7,500+ OSINT tools.","Buscador de mais de 7.500 ferramentas OSINT.","ok","https://indicator.media",""],
["infra","Shodan","Dispositivos y servicios expuestos a internet.","Internet-exposed devices and services.","Dispositivos e serviços expostos à internet.","ok","https://www.shodan.io","lp"],
["infra","Censys","Activos expuestos y certificados TLS.","Exposed assets and TLS certificates.","Ativos expostos e certificados TLS.","ok","https://search.censys.io","l"],
["infra","ZoomEye","Alternativa a Shodan para contrastar resultados.","Shodan alternative to cross-check results.","Alternativa ao Shodan para comparar resultados.","ok","https://www.zoomeye.ai","l"],
["infra","Netlas","Escaneo de internet y DNS histórico.","Internet scan data and historical DNS.","Varredura da internet e DNS histórico.","ok","https://netlas.io","l"],
["infra","GreyNoise","Distingue escaneo masivo de ataques dirigidos.","Separates mass scanning from targeted attacks.","Distingue varredura em massa de ataques direcionados.","ok","https://viz.greynoise.io",""],
["infra","Grayhat Warfare","Buckets de almacenamiento en la nube abiertos.","Open cloud storage buckets.","Buckets de armazenamento em nuvem abertos.","lim","https://grayhatwarfare.com","lp"],
["infra","Wappalyzer","Tecnologías que usa un sitio web.","Technologies used by a website.","Tecnologias usadas por um site.","ok","https://www.wappalyzer.com",""],
["infra","BuiltWith","Tecnologías y relaciones entre sitios.","Technologies and relationships between sites.","Tecnologias e relações entre sites.","ok","https://builtwith.com",""],
["dns","crt.sh","Transparencia de certificados: encuentra subdominios olvidados.","Certificate transparency: find forgotten subdomains.","Transparência de certificados: encontre subdomínios esquecidos.","ok","https://crt.sh",""],
["dns","SecurityTrails","DNS histórico y dominios relacionados.","Historical DNS and related domains.","DNS histórico e domínios relacionados.","lim","https://securitytrails.com","lp"],
["dns","Amass","Mapeo de superficie de ataque y subdominios.","Attack surface and subdomain mapping.","Mapeamento de superfície de ataque e subdomínios.","ok","https://github.com/owasp-amass/amass",""],
["dns","Subfinder","Enumeración pasiva de subdominios.","Passive subdomain enumeration.","Enumeração passiva de subdomínios.","ok","https://github.com/projectdiscovery/subfinder",""],
["dns","MassDNS","Resolución masiva de DNS.","Bulk DNS resolution.","Resolução de DNS em massa.","ok","https://github.com/blechschmidt/massdns",""],
["dns","dnstwist","Dominios de typosquatting y phishing contra una marca. Sin cambios desde abr-2025, aún funciona.","Typosquatting and phishing domains targeting a brand. No changes since Apr 2025, still works.","Domínios de typosquatting e phishing contra uma marca. Sem mudanças desde abr-2025, ainda funciona.","lim","https://github.com/elceef/dnstwist",""],
["dns","theHarvester","Emails, subdominios y nombres de un dominio.","Emails, subdomains and names for a domain.","Emails, subdomínios e nomes de um domínio.","ok","https://github.com/laramies/theHarvester",""],
["dns","Wayback Machine","Versiones archivadas de sitios web.","Archived versions of websites.","Versões arquivadas de sites.","ok","https://web.archive.org",""],
["dns","Archive.today","Archivo de páginas que a veces captura lo que Wayback no.","Page archive that sometimes captures what Wayback misses.","Arquivo de páginas que às vezes captura o que o Wayback não pega.","ok","https://archive.ph",""],
["dns","FinalRecon","Reconocimiento web todo en uno.","All-in-one web recon.","Reconhecimento web tudo em um.","ok","https://github.com/thewhiteh4t/FinalRecon",""],
["threat","VirusTotal","Análisis de archivos, URLs, dominios e IPs.","Analysis of files, URLs, domains and IPs.","Análise de arquivos, URLs, domínios e IPs.","ok","https://www.virustotal.com",""],
["threat","AlienVault OTX","Indicadores de compromiso compartidos por la comunidad.","Community-shared indicators of compromise.","Indicadores de comprometimento compartilhados pela comunidade.","ok","https://otx.alienvault.com",""],
["threat","URLScan","Análisis de URLs sospechosas y phishing.","Suspicious URL and phishing analysis.","Análise de URLs suspeitas e phishing.","ok","https://urlscan.io",""],
["threat","MISP","Plataforma para compartir indicadores de amenazas.","Threat indicator sharing platform.","Plataforma para compartilhar indicadores de ameaças.","ok","https://www.misp-project.org",""],
["threat","OpenCTI","Plataforma abierta para organizar y relacionar inteligencia de amenazas (STIX).","Open platform to organize and link threat intelligence (STIX).","Plataforma aberta para organizar e relacionar inteligência de ameaças (STIX).","ok","https://github.com/OpenCTI-Platform/opencti",""],
["threat","CTILookUp","Enriquecimiento de IPs, dominios, URLs y emails.","Enrichment for IPs, domains, URLs and emails.","Enriquecimento de IPs, domínios, URLs e emails.","lim","https://www.ctilookup.com","l"],
["threat","Hudson Rock Cavalier","Comprueba si un email o dominio aparece en infecciones de infostealers.","Checks if an email or domain appears in infostealer infections.","Verifica se um email ou domínio aparece em infecções de infostealers.","ok","https://www.hudsonrock.com/free-tools",""],
["code","Gitleaks","Busca secretos expuestos en repositorios.","Finds exposed secrets in repositories.","Procura segredos expostos em repositórios.","ok","https://github.com/gitleaks/gitleaks",""],
["code","TruffleHog","Encuentra y verifica credenciales filtradas.","Finds and verifies leaked credentials.","Encontra e verifica credenciais vazadas.","ok","https://github.com/trufflesecurity/trufflehog",""],
["code","grep.app","Búsqueda en código público de GitHub.","Search across public GitHub code.","Busca em código público do GitHub.","ok","https://grep.app",""],
["code","GHunt","Investigación de cuentas de Google. Usa una cuenta de investigación.","Google account investigation. Use a research account.","Investigação de contas Google. Use uma conta de investigação.","risk","https://github.com/mxrch/GHunt","l"],
["people","Sherlock","Busca un nombre de usuario en cientos de sitios.","Hunts a username across hundreds of sites.","Procura um nome de usuário em centenas de sites.","ok","https://github.com/sherlock-project/sherlock",""],
["people","Consensus OSINT","Une 19 proyectos (Maigret, WhatsMyName, Holehe y otros) en una sola terminal: 7.700+ sitios para alias, 200+ chequeos de email, deduplicados y revisados cada semana. Informes en HTML, JSON y PDF. Incluye sitios de citas y adultos: úsalo solo con finalidad legítima.","Combines 19 projects (Maigret, WhatsMyName, Holehe and more) in one CLI: 7,700+ username sites and 200+ email checks, deduplicated and reviewed weekly. HTML, JSON and PDF reports. Includes dating and adult sites: use it only for a legitimate purpose.","Une 19 projetos (Maigret, WhatsMyName, Holehe e outros) em um só terminal: 7.700+ sites para apelidos e 200+ verificações de email, deduplicados e revisados toda semana. Relatórios em HTML, JSON e PDF. Inclui sites de encontros e adultos: use só com finalidade legítima.","ok","https://github.com/OSINT-Experts-Society/Consensus-OSINT",""],
["people","User Scanner","Alias y email en una sola CLI: 2.500+ plataformas y 200+ sitios con chequeo de email.","Username and email in one CLI: 2,500+ platforms and 200+ email-check sites.","Apelido e email em uma só CLI: 2.500+ plataformas e 200+ sites com verificação de email.","ok","https://github.com/kaifcodec/user-scanner",""],
["people","GoSearch","Clon de Sherlock en Go, rápido y concurrente; cruza el alias con credenciales filtradas de Hudson Rock.","Fast, concurrent Sherlock clone in Go; also checks the username against Hudson Rock leaked credentials.","Clone do Sherlock em Go, rápido e concorrente; cruza o apelido com credenciais vazadas da Hudson Rock.","ok","https://github.com/ibnaleem/gosearch",""],
["people","Marple","Junta enlaces a perfiles de un alias consultando 10+ buscadores (Google, Bing, DuckDuckGo…).","Collects profile links for a username from 10+ search engines (Google, Bing, DuckDuckGo…).","Reúne links de perfis de um apelido consultando 10+ buscadores (Google, Bing, DuckDuckGo…).","ok","https://github.com/soxoj/marple",""],
["people","Linkook","Encuentra cuentas vinculadas entre sí y emails asociados a partir de un alias; exporta el grafo a Neo4j.","Finds interlinked accounts and associated emails from one username; exports the graph to Neo4j.","Encontra contas vinculadas entre si e emails associados a partir de um apelido; exporta o grafo para Neo4j.","ok","https://github.com/JackJuly/linkook",""],
["people","Mailcat","Descubre direcciones de email existentes a partir de un alias en 20+ proveedores de correo.","Finds existing email addresses for a nickname across 20+ mail providers.","Descobre endereços de email existentes a partir de um apelido em 20+ provedores de email.","ok","https://github.com/sharsil/mailcat",""],
["people","Blackbird","Busca un alias o un email en cientos de sitios, con exportación a PDF y CSV. Muy activo; el repo no declara licencia.","Searches a username or email across hundreds of sites, with PDF and CSV export. Very active; the repo declares no license.","Procura um alias ou email em centenas de sites, com exportação para PDF e CSV. Muito ativo; o repositório não declara licença.","ok","https://github.com/p1ngul1n0/blackbird",""],
["people","Aliens Eye","Busca un alias en 7.700+ plataformas con detección por aprendizaje automático (menos falsos positivos); informes en PDF, HTML y Maltego. MIT, muy activo.","Searches a username across 7,700+ platforms with machine-learning detection (fewer false positives); PDF, HTML and Maltego reports. MIT, very active.","Procura um alias em 7.700+ plataformas com deteção por aprendizagem automática (menos falsos positivos); relatórios em PDF, HTML e Maltego. MIT, muito ativo.","ok","https://github.com/arxhr007/Aliens_eye",""],
["people","FindMe","Busca un alias en 400+ redes desde la terminal (pip install findme-osint); tiene versión web. MIT.","Searches a username across 400+ networks from the terminal (pip install findme-osint); has a web version. MIT.","Procura um alias em 400+ redes pelo terminal (pip install findme-osint); tem versão web. MIT.","ok","https://github.com/0xSaikat/findme",""],
["people","NAMINT","Con nombre y apellido, genera alias y emails probables y los enlaces para buscarlos. En el navegador.","From a first and last name, generates likely usernames and emails plus links to search them. In the browser.","Com nome e sobrenome, gera aliases e emails prováveis e os links para procurá-los. No navegador.","ok","https://seintpl.github.io/NAMINT/",""],
["people","Namechk","Comprueba si un alias está ocupado en redes y dominios.","Checks whether a username is taken across social networks and domains.","Verifica se um alias está ocupado em redes e domínios.","ok","https://namechk.com",""],
["people","Epieos","Búsqueda inversa de email y teléfono (cuentas de Google, Skype y otras). Búsquedas gratis limitadas.","Reverse email and phone lookup (Google, Skype and other accounts). Limited free searches.","Pesquisa inversa de email e telefone (contas Google, Skype e outras). Pesquisas grátis limitadas.","ok","https://epieos.com","lp"],
["people","OSINT Industries","Búsqueda de email, teléfono y alias en cientos de módulos. De pago.","Email, phone and username lookup across hundreds of modules. Paid.","Pesquisa de email, telefone e alias em centenas de módulos. Pago.","ok","https://www.osint.industries","lp"],
["people","Maigret","Dossier por usuario en miles de sitios.","Username dossier across thousands of sites.","Dossiê por usuário em milhares de sites.","ok","https://github.com/soxoj/maigret",""],
["people","WhatsMyName","Dataset de sitios para buscar usuarios. Archivado en nov-2026: ya no se actualiza.","Username site dataset. Archived Nov 2026: no longer updated.","Dataset de sites para buscar usuários. Arquivado em nov-2026: não é mais atualizado.","lim","https://whatsmyname.app",""],
["people","Holehe","Qué sitios tienen registrado un email. Sin mantenimiento desde 2024.","Which sites an email is registered on. Unmaintained since 2024.","Em quais sites um email está registrado. Sem manutenção desde 2024.","lim","https://github.com/megadose/holehe",""],
["people","Hunter.io","Emails corporativos asociados a un dominio.","Corporate emails linked to a domain.","Emails corporativos associados a um domínio.","ok","https://hunter.io","lp"],
["people","PhoneInfoga","Información pública sobre números de teléfono.","Public information about phone numbers.","Informações públicas sobre números de telefone.","ok","https://github.com/sundowndev/phoneinfoga",""],
["people","Numint","Perfil de un teléfono: validez, tipo de línea, país y operador sin registro; con claves API gratuitas suma riesgo de fraude y si el número está en Instagram, Amazon y otros. Terminal, web local o Discord. MIT.","Phone number profile: validity, line type, country and carrier with no signup; free API keys add fraud risk and whether the number is on Instagram, Amazon and others. Terminal, local web or Discord. MIT.","Perfil de um telefone: validade, tipo de linha, país e operadora sem registo; com chaves API gratuitas soma risco de fraude e se o número está no Instagram, Amazon e outros. Terminal, web local ou Discord. MIT.","ok","https://github.com/whoamitang/numint",""],
["people","Proton keyserver","Comprueba si un email tiene clave pública de Proton (indica cuenta Proton).","Checks if an email has a Proton public key (suggests a Proton account).","Verifica se um email tem chave pública Proton (indica conta Proton).","ok","https://api.protonmail.ch/pks/lookup?op=index&search=ejemplo@proton.me",""],
["people","Buscadores de personas de EE. UU.","PeekYou, Whitepages, TruePeopleSearch: poco útiles fuera de EE. UU. y con datos viejos.","PeekYou, Whitepages, TruePeopleSearch: of little use outside the US, often stale.","PeekYou, Whitepages, TruePeopleSearch: pouco úteis fora dos EUA e com dados antigos.","risk","https://www.whitepages.com","p"],
["breach","Have I Been Pwned","Comprueba si un email aparece en filtraciones conocidas.","Checks if an email appears in known breaches.","Verifica se um email aparece em vazamentos conhecidos.","ok","https://haveibeenpwned.com",""],
["breach","Intelligence X","Archivo de filtraciones, pastes y darknet.","Archive of leaks, pastes and darknet.","Arquivo de vazamentos, pastes e darknet.","lim","https://intelx.io","lp"],
["breach","DeHashed","Búsqueda en bases filtradas. Solo con autorización y finalidad defensiva.","Leaked database search. Only with authorization and defensive purpose.","Busca em bases vazadas. Só com autorização e finalidade defensiva.","risk","https://dehashed.com","lp"],
["media","ExifTool","Lectura de metadatos: la referencia forense.","Metadata reading: the forensic reference.","Leitura de metadados: a referência forense.","ok","https://exiftool.org",""],
["media","TinEye","Dónde apareció una imagen en internet.","Where an image appeared online.","Onde uma imagem apareceu na internet.","ok","https://tineye.com",""],
["media","Google Lens","Búsqueda visual y de objetos.","Visual and object search.","Busca visual e de objetos.","ok","https://lens.google",""],
["media","Yandex Images","Búsqueda inversa fuerte en rostros y lugares.","Strong reverse search for faces and places.","Busca reversa forte para rostos e lugares.","ok","https://yandex.com/images",""],
["media","InVID-WeVerify","Verificación de videos y fotogramas.","Video and keyframe verification.","Verificação de vídeos e quadros.","ok","https://weverify.eu/verification-plugin/",""],
["media","FOCA","Metadatos en documentos de una organización. Sin cambios desde 2022, solo Windows.","Metadata in an organization's documents. Unchanged since 2022, Windows only.","Metadados em documentos de uma organização. Sem mudanças desde 2022, só Windows.","lim","https://github.com/ElevenPaths/FOCA",""],
["media","Hunchly","Captura y registro automático de la investigación.","Automatic capture and logging of the investigation.","Captura e registro automático da investigação.","lim","https://www.hunch.ly","p"],
["media","SingleFile","Extensión que guarda una página web completa en un solo archivo HTML. Útil para preservar evidencia.","Extension that saves a full web page into a single HTML file. Useful for preserving evidence.","Extensão que guarda uma página web completa num único ficheiro HTML. Útil para preservar evidências.","ok","https://github.com/gildas-lormeau/SingleFile",""],
["media","ArchiveBox","Archivo web propio: guarda URLs en HTML, PDF, captura y WARC en tu servidor.","Self-hosted web archive: saves URLs as HTML, PDF, screenshot and WARC on your server.","Arquivo web próprio: guarda URLs em HTML, PDF, captura e WARC no seu servidor.","ok","https://github.com/ArchiveBox/ArchiveBox",""],
["media","Clearview AI","Reconocimiento facial. Incompatible con el RGPD en la UE.","Facial recognition. Incompatible with GDPR in the EU.","Reconhecimento facial. Incompatível com o RGPD na UE.","no","https://www.clearview.ai","p"],
["geo","Google Earth","Imágenes satelitales e históricas.","Satellite and historical imagery.","Imagens de satélite e históricas.","ok","https://earth.google.com",""],
["geo","Sentinel Hub EO Browser","Imágenes satelitales con fecha y bandas.","Dated satellite imagery with spectral bands.","Imagens de satélite com data e bandas.","ok","https://apps.sentinel-hub.com/eo-browser/","l"],
["geo","Flightradar24","Seguimiento de vuelos en tiempo real.","Real-time flight tracking.","Rastreamento de voos em tempo real.","ok","https://www.flightradar24.com","p"],
["geo","ADS-B Exchange","Vuelos sin filtrar, incluidos los bloqueados en otras plataformas.","Unfiltered flights, including those blocked elsewhere.","Voos sem filtro, incluindo os bloqueados em outras plataformas.","ok","https://globe.adsbexchange.com",""],
["geo","MarineTraffic","Posición de buques.","Vessel positions.","Posição de navios.","lim","https://www.marinetraffic.com","p"],
["geo","ACLED","Datos de conflictos y protestas georreferenciados.","Geo-referenced conflict and protest data.","Dados georreferenciados de conflitos e protestos.","ok","https://acleddata.com","l"],
["tg","Telegago","Buscador de Google personalizado para Telegram.","Google custom search for Telegram.","Busca personalizada do Google para Telegram.","ok","https://github.com/cipher387/osint_stuff_tool_collection#telegram",""],
["tg","TGStat","Estadísticas y búsqueda de canales y grupos.","Channel and group stats and search.","Estatísticas e busca de canais e grupos.","ok","https://tgstat.com",""],
["tg","Telemetr","Base de datos de canales con analítica.","Channel database with analytics.","Base de dados de canais com análise.","ok","https://telemetr.io","l"],
["tg","Lyzem","Búsqueda de canales, grupos, bots y mensajes.","Search channels, groups, bots and messages.","Busca de canais, grupos, bots e mensagens.","lim","https://lyzem.com",""],
["tg","4CAT","Captura y análisis de datos sociales, incluido Telegram.","Social data capture and analysis, including Telegram.","Captura e análise de dados sociais, incluindo Telegram.","lim","https://github.com/digitalmethodsinitiative/4cat","l"],
["tg","Mapas de usuarios cercanos","Telegram retiró la función en 2024 y su uso es rastreo de personas.","Telegram removed the feature in 2024, and its use is tracking people.","O Telegram removeu a função em 2024 e seu uso é rastrear pessoas.","no","https://github.com/IvanGlinkin/CCTV",""],
["social","Social Blade","Métricas e historial de cuentas.","Account metrics and history.","Métricas e histórico de contas.","ok","https://socialblade.com",""],
["social","Osintgram","Análisis de cuentas de Instagram. Exige login y viola los términos de Instagram.","Instagram account analysis. Requires login and breaks Instagram's terms.","Análise de contas do Instagram. Exige login e viola os termos do Instagram.","risk","https://github.com/Datalux/Osintgram","l"],
["company","OpenCorporates","Registros mercantiles de todo el mundo.","Company registries worldwide.","Registros comerciais do mundo todo.","ok","https://opencorporates.com",""],
["company","OpenSanctions","Sanciones y personas expuestas políticamente.","Sanctions and politically exposed persons.","Sanções e pessoas politicamente expostas.","ok","https://www.opensanctions.org",""],
["company","CourtListener","Expedientes judiciales de EE. UU.","US court records.","Processos judiciais dos EUA.","ok","https://www.courtlistener.com",""],
["dark","Tor Browser","Acceso a sitios .onion. Úsalo dentro de una máquina virtual.","Access .onion sites. Use it inside a virtual machine.","Acesso a sites .onion. Use dentro de uma máquina virtual.","ok","https://www.torproject.org",""],
["dark","Ahmia","Buscador de sitios .onion con filtrado de abuso, y grafo de enlaces entre sitios.","Filtered .onion search engine, plus a link graph between sites.","Buscador de sites .onion com filtro de abuso, e grafo de links entre sites.","ok","https://ahmia.fi",""],
["dark","Onion Search Engine","Buscador de la red Tor accesible desde la web normal.","Tor network search engine reachable from the clear web.","Buscador da rede Tor acessível pela web comum.","ok","https://onionsearchengine.com",""],
["dark","onion-lookup (AIL)","Comprueba si un sitio .onion existe y muestra títulos, idioma y fechas vistas. Integrado en Multi-OSINT Lite.","Checks if an .onion site exists and shows titles, language and seen dates. Built into Multi-OSINT Lite.","Verifica se um site .onion existe e mostra títulos, idioma e datas. Integrado ao Multi-OSINT Lite.","ok","https://onion.ail-project.org",""],
["dark","ExoneraTor","Comprueba si una IP fue nodo de Tor en una fecha. Clave para atribuir tráfico.","Checks whether an IP was a Tor relay on a given date. Key for traffic attribution.","Verifica se um IP foi nó Tor em uma data. Chave para atribuir tráfego.","ok","https://metrics.torproject.org/exonerator.html",""],
["dark","Onionoo / Relay Search","Datos oficiales de nodos Tor. Integrado en la búsqueda de IP de Multi-OSINT Lite.","Official Tor relay data. Built into Multi-OSINT Lite's IP search.","Dados oficiais de nós Tor. Integrado à busca de IP do Multi-OSINT Lite.","ok","https://metrics.torproject.org/rs.html",""],
["dark","TorMap","Mapa y búsqueda de miles de nodos de la red Tor.","Map and search of thousands of Tor relays.","Mapa e busca de milhares de nós da rede Tor.","ok","https://tormap.org",""],
["dark","Darkweb archive","Descarga un sitio .onion como archivo (HTML, CSS, JS) para preservarlo como evidencia.","Downloads an .onion site as an archive (HTML, CSS, JS) to preserve it as evidence.","Baixa um site .onion como arquivo (HTML, CSS, JS) para preservá-lo como evidência.","ok","https://darkweb-archive.activetk.jp",""],
["dark","SOCRadar Dark Web Report","Informe gratuito de exposición de un dominio en foros, Telegram y sitios de filtraciones.","Free report of a domain's exposure on forums, Telegram and leak sites.","Relatório gratuito de exposição de um domínio em fóruns, Telegram e sites de vazamento.","ok","https://socradar.io/free-tools/dark-web-report","l"],
["dark","Whiteintel","Comprueba la exposición de un dominio o email en la dark web.","Checks a domain or email's dark web exposure.","Verifica a exposição de um domínio ou email na dark web.","lim","https://whiteintel.io","lp"],
["dark","ALEPH Open Search","Busca datos de tu organización en millones de sitios de la dark y deep web.","Searches your organization's data across millions of dark and deep web sites.","Busca dados da sua organização em milhões de sites da dark e deep web.","lim","https://open-search.aleph-networks.eu/en",""],
["dark","TorBot","Crawler OSINT para la dark web (requiere Tor).","OSINT crawler for the dark web (requires Tor).","Crawler OSINT para a dark web (requer Tor).","ok","https://github.com/DedSecInside/TorBot",""],
["dark","Darkus","Busca una palabra en varios buscadores de la deep y dark web.","Searches a keyword across several deep and dark web engines.","Busca uma palavra em vários buscadores da deep e dark web.","ok","https://github.com/Lucksi/Darkus",""],
["dark","DarkSherlock","Busca un alias en más de 40 foros de la dark web. Proyecto pequeño: pruébalo aislado.","Searches a username across 40+ dark web forums. Small project: test it isolated.","Busca um apelido em mais de 40 fóruns da dark web. Projeto pequeno: teste isolado.","lim","https://github.com/banaxou/dark-sherlock",""],
["dark","TheDevilsEye","Busca enlaces .onion desde la terminal sin usar Tor.","Finds .onion links from the command line without Tor.","Busca links .onion pelo terminal sem usar Tor.","lim","https://github.com/rlyonheart/thedevilseye",""],
["dark","OnionSearch","Scraper de buscadores .onion. Sin cambios desde 2024.","Scraper for .onion search engines. Unchanged since 2024.","Scraper de buscadores .onion. Sem mudanças desde 2024.","lim","https://github.com/megadose/OnionSearch",""],
["dark","Onioff","Inspector de URLs .onion. Abandonado desde 2022.","Onion URL inspector. Abandoned since 2022.","Inspetor de URLs .onion. Abandonado desde 2022.","no","https://github.com/k4m4/onioff",""],
["dark","Dark Web Scraper (Apify)","Rastrea un sitio .onion buscando wallets, claves y contactos.","Crawls an .onion site for wallets, keys and contacts.","Rastreia um site .onion em busca de carteiras, chaves e contatos.","lim","https://apify.com/epcsht/darkweb-scraper","lp"],
["dark","The Hidden Wiki","Directorio lleno de estafas y contenido ilegal. Usa Ahmia.","Directory full of scams and illegal content. Use Ahmia.","Diretório cheio de golpes e conteúdo ilegal. Use o Ahmia.","no","https://ahmia.fi",""],
["forensic","Autopsy","Interfaz gráfica de The Sleuth Kit para analizar discos, teléfonos y líneas de tiempo. La referencia para empezar.","GUI for The Sleuth Kit to analyse disks, phones and timelines. The go-to starting point.","Interface gráfica do The Sleuth Kit para analisar discos, telefones e linhas do tempo. A referência para começar.","ok","https://www.autopsy.com",""],
["forensic","Volatility 3","Análisis de memoria RAM: procesos, conexiones y artefactos de malware.","RAM analysis: processes, connections and malware artefacts.","Análise de memória RAM: processos, ligações e artefactos de malware.","ok","https://github.com/volatilityfoundation/volatility3",""],
["forensic","MemProcFS","Monta un volcado de memoria como si fuera una carpeta para revisarlo con cualquier herramienta.","Mounts a memory dump as a folder so you can review it with any tool.","Monta um despejo de memória como uma pasta para revê-lo com qualquer ferramenta.","ok","https://github.com/ufrisk/MemProcFS",""],
["forensic","Plaso (log2timeline)","Arma una supertimeline con los eventos de un disco o de logs.","Builds a super timeline from the events in a disk image or logs.","Monta uma supertimeline com os eventos de um disco ou de logs.","ok","https://github.com/log2timeline/plaso",""],
["forensic","Herramientas de Eric Zimmerman","Parsers de artefactos de Windows (MFT, registro, LNK, prefetch). Gratuitas y muy usadas en peritajes.","Windows artefact parsers (MFT, registry, LNK, prefetch). Free and widely used in casework.","Parsers de artefactos do Windows (MFT, registo, LNK, prefetch). Gratuitos e muito usados em perícias.","ok","https://ericzimmerman.github.io",""],
["forensic","Velociraptor","Recolección y análisis forense en muchos equipos a la vez (DFIR).","Forensic collection and analysis across many endpoints at once (DFIR).","Recolha e análise forense em muitos equipamentos ao mesmo tempo (DFIR).","ok","https://github.com/Velocidex/velociraptor",""],
["forensic","YARA","Reglas para identificar y clasificar malware o archivos por patrones.","Rules to identify and classify malware or files by pattern.","Regras para identificar e classificar malware ou ficheiros por padrões.","ok","https://github.com/VirusTotal/yara",""],
["forensic","CyberChef","Decodifica, convierte y analiza datos en el navegador (Base64, hashes, fechas, XOR…).","Decodes, converts and analyses data in the browser (Base64, hashes, timestamps, XOR…).","Descodifica, converte e analisa dados no navegador (Base64, hashes, datas, XOR…).","ok","https://gchq.github.io/CyberChef/",""],
["dating","FootprintIQ Dating Lookup","Comprueba si un alias existe en Tinder, Bumble, Hinge, OkCupid y 500+ servicios. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","Checks whether a username exists on Tinder, Bumble, Hinge, OkCupid and 500+ services. Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","Verifica se um alias existe no Tinder, Bumble, Hinge, OkCupid e 500+ serviços. Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://footprintiq.app/dating-profile-lookup",""],
["dating","Social Catfish","Búsqueda inversa de fotos, alias y teléfonos para detectar perfiles falsos. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","Reverse search of photos, usernames and phones to spot fake profiles. Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","Pesquisa inversa de fotos, aliases e telefones para detetar perfis falsos. Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://www.socialcatfish.com","p"],
["dating","Spokeo","Buscador de personas de EE. UU.; puede vincular email o teléfono con perfiles de citas. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","US people-search engine; can link an email or phone to dating profiles. Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","Motor de pesquisa de pessoas dos EUA; pode ligar um email ou telefone a perfis de encontros. Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://www.spokeo.com","p"],
["dating","CheatSpyder","Extensión de Firefox que revisa si un email, alias o teléfono está registrado en 100+ plataformas de citas. Se promociona para vigilar parejas. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","Firefox extension that checks whether an email, username or phone is registered on 100+ dating platforms. Marketed for monitoring partners. Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","Extensão do Firefox que verifica se um email, alias ou telefone está registado em 100+ plataformas de encontros. Promovida para vigiar parceiros. Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://addons.mozilla.org/firefox/addon/cheatspyder-profile-search/",""],
["dating","Perfil por URL directa (Tinder, OkCupid)","Si conoces el alias, el perfil público se abre en tinder.com/@alias u okcupid.com/profile/alias. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","If you know the username, the public profile opens at tinder.com/@alias or okcupid.com/profile/alias. Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","Se souber o alias, o perfil público abre em tinder.com/@alias ou okcupid.com/profile/alias. Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://tinder.com",""],
["dating","Dorks de perfiles de citas","Búsquedas tipo site:tinder.com \"nombre\" o site:okcupid.com \"alias\" para perfiles indexados. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","Searches like site:tinder.com \"name\" or site:okcupid.com \"alias\" for indexed profiles. Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","Pesquisas como site:tinder.com \"nome\" ou site:okcupid.com \"alias\" para perfis indexados. Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://www.google.com",""],
["dating","TraceLens","App de iOS de búsqueda facial para verificar con quién hablas en una app de citas. Datos biométricos: categoría especial del RGPD (art. 9). Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","iOS face-search app to verify who you are talking to on a dating app. Biometric data: special category under GDPR (art. 9). Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","App de iOS de pesquisa facial para verificar com quem fala numa app de encontros. Dados biométricos: categoria especial do RGPD (art. 9). Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://apps.apple.com/app/tracelens-ai-face-search/id6770221940","p"],
["dating","Maigret en Apify","Maigret en la nube (3.000+ sitios, incluidos de citas) sin instalar nada. De pago por uso. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso.","Maigret in the cloud (3,000+ sites, dating included) with nothing to install. Pay per use. Only with a legal basis (GDPR art. 6): romance scams, sextortion, impersonation or a commissioned investigation. Monitoring a partner or ex can be stalking.","Maigret na nuvem (3.000+ sites, incluindo encontros) sem instalar nada. Pago por uso. Só com base legal (RGPD art. 6): burlas românticas, sextorsão, usurpação de identidade ou investigação encomendada. Vigiar um parceiro ou ex pode ser perseguição.","risk","https://apify.com/ntriqpro/maigret-actor","lp"],
["auto","X-osint","Framework de terminal (Linux/Termux) con 17 módulos: IP, email, teléfono, subdominios, CVE, metadatos, infostealers. El instalador pide sudo: revísalo y úsalo en una VM.","Terminal framework (Linux/Termux) with 17 modules: IP, email, phone, subdomains, CVE, metadata, infostealers. The installer needs sudo: review it and use a VM.","Framework de terminal (Linux/Termux) com 17 módulos: IP, email, telefone, subdomínios, CVE, metadados, infostealers. O instalador pede sudo: revise e use uma VM.","risk","https://github.com/TermuxHackz/X-osint",""],
["auto","SpiderFoot","Reconocimiento automatizado con más de 200 módulos. Sin cambios desde nov-2023: algunos módulos fallan.","Automated recon with 200+ modules. No changes since Nov 2023: some modules fail.","Reconhecimento automatizado com mais de 200 módulos. Sem mudanças desde nov-2023: alguns módulos falham.","lim","https://github.com/smicallef/spiderfoot",""],
["auto","Recon-ng","Framework modular de reconocimiento.","Modular reconnaissance framework.","Framework modular de reconhecimento.","ok","https://github.com/lanmaster53/recon-ng",""],
["auto","Maltego","Grafos de relaciones entre entidades.","Entity relationship graphs.","Grafos de relações entre entidades.","lim","https://www.maltego.com","lp"],
["auto","Awesome OSINT MCP servers","Catálogo de servidores MCP para conectar OSINT a agentes de IA.","Catalog of MCP servers to connect OSINT to AI agents.","Catálogo de servidores MCP para conectar OSINT a agentes de IA.","ok","https://start.me/p/aNMY5j/awesome-osint-mcp-servers",""],
["auto","Darknet MCP Server","66 herramientas de dark web e inteligencia de amenazas para agentes de IA. Código de terceros: revísalo.","66 dark web and threat intel tools for AI agents. Third-party code: review it.","66 ferramentas de dark web e inteligência de ameaças para agentes de IA. Código de terceiros: revise.","risk","https://github.com/badchars/darknet-mcp-server",""],
["auto","OpenTor","Skill para que un agente de IA (Claude Code) busque en 12 buscadores .onion y extraiga IOCs. Sin licencia clara.","Skill that lets an AI agent (Claude Code) search 12 .onion engines and extract IOCs. No clear license.","Skill para um agente de IA (Claude Code) buscar em 12 buscadores .onion e extrair IOCs. Sem licença clara.","risk","https://github.com/vichhka-git/OpenTor",""],
["auto","Claude-OSINT","Skills de Claude para recon externo. Código de terceros: revísalo antes de instalar.","Claude skills for external recon. Third-party code: review before installing.","Skills do Claude para recon externo. Código de terceiros: revise antes de instalar.","risk","https://github.com/elementalsouls/Claude-OSINT",""],
["auto","World Intel MCP","Inteligencia global en tiempo real. Proyecto pequeño: pruébalo aislado.","Real-time global intelligence. Small project: test it isolated.","Inteligência global em tempo real. Projeto pequeno: teste isolado.","lim","https://github.com/marc-shade/world-intel-mcp",""],
["auto","n8n","Orquestación de flujos y alertas.","Workflow and alert orchestration.","Orquestração de fluxos e alertas.","ok","https://n8n.io",""],
];

/* Atajos para Multi-OSINT Lite: herramientas del directorio que aceptan el dato en la URL.
   Clave = nombre exacto de la herramienta en TOOLS; {q} se reemplaza por el dato buscado.
   Tipos: domain, ip, alias, email, phone, onion. Para sumar una: agrega su nombre aquí y corre build.py. */
const LAUNCH = {
 "Shodan": {
  "domain": "https://www.shodan.io/search?query=hostname%3A{q}",
  "ip": "https://www.shodan.io/host/{q}"
 },
 "Censys": {
  "domain": "https://search.censys.io/search?resource=hosts&q={q}",
  "ip": "https://search.censys.io/hosts/{q}"
 },
 "GreyNoise": {
  "ip": "https://viz.greynoise.io/ip/{q}"
 },
 "BuiltWith": {
  "domain": "https://builtwith.com/{q}"
 },
 "Wappalyzer": {
  "domain": "https://www.wappalyzer.com/lookup/{q}/"
 },
 "SecurityTrails": {
  "domain": "https://securitytrails.com/domain/{q}/dns"
 },
 "Wayback Machine": {
  "domain": "https://web.archive.org/web/*/{q}*"
 },
 "Archive.today": {
  "domain": "https://archive.ph/{q}"
 },
 "VirusTotal": {
  "domain": "https://www.virustotal.com/gui/domain/{q}",
  "ip": "https://www.virustotal.com/gui/ip-address/{q}"
 },
 "AlienVault OTX": {
  "domain": "https://otx.alienvault.com/indicator/domain/{q}",
  "ip": "https://otx.alienvault.com/indicator/ip/{q}"
 },
 "URLScan": {
  "domain": "https://urlscan.io/search/#domain:{q}",
  "ip": "https://urlscan.io/search/#ip:{q}"
 },
 "grep.app": {
  "domain": "https://grep.app/search?q={q}",
  "alias": "https://grep.app/search?q={q}",
  "email": "https://grep.app/search?q={q}"
 },
 "Hunter.io": {
  "domain": "https://hunter.io/search/{q}",
  "email": "https://hunter.io/email-verifier/{q}"
 },
 "WhatsMyName": {
  "alias": "https://whatsmyname.app/?q={q}"
 },
 "Epieos": {
  "email": "https://epieos.com/?q={q}&t=email"
 },
 "Intelligence X": {
  "domain": "https://intelx.io/?s={q}",
  "ip": "https://intelx.io/?s={q}",
  "alias": "https://intelx.io/?s={q}",
  "email": "https://intelx.io/?s={q}",
  "phone": "https://intelx.io/?s={q}",
  "onion": "https://intelx.io/?s={q}"
 },
 "Ahmia": {
  "domain": "https://ahmia.fi/search/?q={q}",
  "alias": "https://ahmia.fi/search/?q={q}",
  "email": "https://ahmia.fi/search/?q={q}",
  "onion": "https://ahmia.fi/search/?q={q}"
 },
 "ExoneraTor": {
  "ip": "https://metrics.torproject.org/exonerator.html?ip={q}"
 },
 "Onionoo / Relay Search": {
  "ip": "https://metrics.torproject.org/rs.html#search/{q}"
 }
};

/* Herramientas que necesitan servidor y se activan con la comunidad.
   [nombre exacto en TOOLS, meta de estrellas, pestaña de Multi-OSINT Lite]. Para sumar una: agrega una fila y corre build.py. */
const LOCKED = [
 ["Maigret", 100, "alias"],
 ["Consensus OSINT", 100, "alias"],
 ["User Scanner", 100, "email"],
 ["Sherlock", 1000, "alias"],
 ["Blackbird", 1000, "alias"],
 ["Mailcat", 1000, "alias"],
 ["Linkook", 1000, "alias"],
 ["GoSearch", 1000, "alias"],
 ["PhoneInfoga", 1000, "phone"],
 ["theHarvester", 1000, "domain"],
 ["Subfinder", 1000, "domain"],
 ["Amass", 1000, "domain"],
 ["dnstwist", 1000, "domain"],
 ["FinalRecon", 1000, "domain"],
 ["TorBot", 1000, "onion"],
 ["ExifTool", 1000, "image"]
];
