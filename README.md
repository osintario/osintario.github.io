# OSINTario

Directorio de herramientas OSINT revisado a mano, en **español, inglés y portugués**: qué hace cada una, si sigue activa, si pide registro o pago y cuándo usarla con cuidado.

🌐 [Español](https://osintario.github.io/) · [English](https://osintario.github.io/en.html) · [Português](https://osintario.github.io/pt.html) · Mantenido por Federico Dosio, profesor de Investigación con Fuentes Abiertas (IFA) en el Instituto Universitario de la Policía Federal Argentina (IUPFA).

## 🔎 Multi-OSINT Lite (gratis, en tu navegador)

Investiga un **dominio, una IP, un alias, un email, un teléfono, un sitio .onion o una imagen** y genera dorks de Google: [ES](https://osintario.github.io/herramientas.html) · [EN](https://osintario.github.io/tools-en.html) · [PT](https://osintario.github.io/ferramentas.html)

- Consulta varias fuentes a la vez: Google DNS, crt.sh, RDAP, Wayback, AlienVault OTX, Shodan InternetDB, ipinfo, Tor Onionoo, AIL onion-lookup, GitHub, Keybase, Gravatar, Proton y Have I Been Pwned.
- Informe con fuente, nivel de confianza y **hash SHA-256**, exportable en JSON, Markdown o PDF.
- **Sin servidor:** lo que buscas no pasa por OSINTario.

> Si te sirve, deja una ⭐ ([cómo hacerlo en 30 segundos](https://osintario.github.io/estrella)). Con 100 estrellas se destraba el barrido de alias en miles de sitios y con 1.000, el resto ([ver metas](https://osintario.github.io/herramientas.html#comunidad)). Las sugerencias van por *Issues* o *Pull Request*.

## ⚖️ Uso ético y legal

OSINTario es una guía para investigar con fuentes abiertas, no un permiso. Cada búsqueda sobre una persona necesita una **finalidad legítima y base legal** (RGPD y leyes locales). No lo uses para acosar, vigilar a parejas o exparejas, exponer datos personales ni acceder a sistemas sin autorización. Quien busca es responsable de lo que hace con la información.

Las herramientas más sensibles (búsqueda de personas, apps de citas, reconocimiento facial) están marcadas ⚠️ y cada una explica su riesgo y cuándo está justificado usarla.

> *Federico Dosio · Profesor de Investigación con Fuentes Abiertas (IFA), Instituto Universitario de la Policía Federal Argentina (IUPFA)*

**Herramientas:** 222 · **Última revisión:** 2026-11-27

Estados: ✅ activa · 🟡 con límites · ⚠️ con precaución · ❌ descartada (no se enlaza). Acceso: 🔑 requiere registro · 💳 de pago o con funciones pagas. Instalación: 🧪 la herramienta se instala; sigue la [guía de instalación segura](https://osintario.github.io/instalacion-segura.html).

## Colecciones

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [OSINT Stuff Tool Collection](https://github.com/cipher387/osint_stuff_tool_collection) | Cientos de herramientas online por categoría, incluidas Telegram y dark web. | ✅ Activa | libre |  |
| [Awesome OSINT](https://github.com/jivoi/awesome-osint) | La lista curada más completa de la comunidad. | ✅ Activa | libre |  |
| [YogSec OSINT Tools](https://github.com/yogsec/OSINT-Tools) | Lista enorme por categorías (alias, registros, cripto, deepfakes, extremismo…). Muy activa; sin licencia declarada. Sus herramientas de citas están en la categoría Apps de citas, con su aviso RGPD. | ✅ Activa | libre |  |
| [OSINT Framework](https://osintframework.com) | Árbol interactivo de herramientas por tipo de dato. | ✅ Activa | libre |  |
| [Awesome OSINT Arsenal](https://github.com/rawfilejson/awesome-osint-arsenal) | Más de 100 herramientas con instalador en un comando. | ✅ Activa | libre |  |
| [OSINTJet Quick Search](https://osintjet.com/en/osint-search-tools/) | Lanzador de búsquedas por categoría. Servicio comercial nuevo: no subas datos de casos reales. | 🟡 Con límites | libre |  |
| [OSINT Navigator](https://indicator.media) | Buscador de más de 7.500 herramientas OSINT. | ✅ Activa | libre |  |
| [Cyber Detective (cipher387)](https://cipher387.github.io/) | Página central de @cyb_detective: colección de 800+ herramientas, mapa mundial de herramientas por país, cajas de herramientas para dominio, IP y teléfono, dorks y APIs para OSINT. | ✅ Activa | libre |  |
| [Public APIs](https://github.com/public-apis/public-apis) | Lista enorme de APIs gratuitas por tema; la sección de seguridad sirve para armar consultas propias (dispositivos expuestos, CVE, riesgo de email, dominios). | ✅ Activa | libre |  |
| [OSINT Journo: listas por país](https://github.com/Ghongha007?tab=repositories) | Registros públicos y datos abiertos de India, China y Rusia (empresas, tribunales, gasto público, sanciones), con fecha de verificación de cada enlace. Excluye búsquedas de personas. Muy nuevas (nov-2026). | ✅ Activa | libre |  |

## Infraestructura

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Shodan](https://www.shodan.io) | Dispositivos y servicios expuestos a internet. | ✅ Activa | 🔑 registro 💳 pago |  |
| [Censys](https://search.censys.io) | Activos expuestos y certificados TLS. | ✅ Activa | 🔑 registro |  |
| [ZoomEye](https://www.zoomeye.ai) | Alternativa a Shodan para contrastar resultados. | ✅ Activa | 🔑 registro |  |
| [FOFA](https://en.fofa.info/) | Buscador de equipos y servicios expuestos en internet, fuerte en Asia. Pide registro para usar filtros. | ✅ Activa | 🔑 registro |  |
| [LeakIX](https://leakix.net/) | Indexa servicios mal configurados y datos expuestos por IP o dominio. Solo para defensa o con autorización. | ✅ Activa | 🔑 registro |  |
| [Netlas](https://netlas.io) | Escaneo de internet y DNS histórico. | ✅ Activa | 🔑 registro |  |
| [GreyNoise](https://viz.greynoise.io) | Distingue escaneo masivo de ataques dirigidos. | ✅ Activa | libre |  |
| [Grayhat Warfare](https://grayhatwarfare.com) | Buckets de almacenamiento en la nube abiertos. | 🟡 Con límites | 🔑 registro 💳 pago |  |
| [Wappalyzer](https://www.wappalyzer.com) | Tecnologías que usa un sitio web. | ✅ Activa | libre |  |
| [BuiltWith](https://builtwith.com) | Tecnologías y relaciones entre sitios. | ✅ Activa | libre |  |
| [IVRE](https://github.com/ivre/ivre) | Framework propio de reconocimiento de red, tipo Shodan autoalojado: importa escaneos (Nmap, Masscan, Zeek) y datos pasivos para buscarlos. GPL-3.0. | ✅ Activa | libre | 🧪 Docker |
| [FullHunt](https://fullhunt.io) | Superficie de ataque expuesta de un dominio: subdominios, puertos y tecnologías. Búsquedas gratis limitadas con registro. | ✅ Activa | 🔑 registro 💳 pago |  |
| [ONYPHE](https://www.onyphe.io) | Motor de búsqueda de equipos y servicios expuestos en Internet, con datos de amenazas. Plan gratuito limitado con registro. | ✅ Activa | 🔑 registro 💳 pago |  |

## Dominios y DNS

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [crt.sh](https://crt.sh) | Transparencia de certificados: encuentra subdominios olvidados. | ✅ Activa | libre |  |
| [SecurityTrails](https://securitytrails.com) | DNS histórico y dominios relacionados. | 🟡 Con límites | 🔑 registro 💳 pago |  |
| [Amass](https://github.com/owasp-amass/amass) | Mapeo de superficie de ataque y subdominios. | ✅ Activa | libre | 🧪 Go |
| [Subfinder](https://github.com/projectdiscovery/subfinder) | Enumeración pasiva de subdominios. | ✅ Activa | libre | 🧪 Go |
| [MassDNS](https://github.com/blechschmidt/massdns) | Resolución masiva de DNS. | ✅ Activa | libre | 🧪 solo en VM |
| [dnstwist](https://github.com/elceef/dnstwist) | Dominios de typosquatting y phishing contra una marca. Sin cambios desde abr-2025, aún funciona. | 🟡 Con límites | libre | 🧪 Python |
| [theHarvester](https://github.com/laramies/theHarvester) | Emails, subdominios y nombres de un dominio. | ✅ Activa | libre | 🧪 Python |
| [Wayback Machine](https://web.archive.org) | Versiones archivadas de sitios web. | ✅ Activa | libre |  |
| [Archive.today](https://archive.ph) | Archivo de páginas que a veces captura lo que Wayback no. | ✅ Activa | libre |  |
| [FinalRecon](https://github.com/thewhiteh4t/FinalRecon) | Reconocimiento web todo en uno. | ✅ Activa | libre | 🧪 Python |

## Amenazas

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [VirusTotal](https://www.virustotal.com) | Análisis de archivos, URLs, dominios e IPs. | ✅ Activa | libre |  |
| [AlienVault OTX](https://otx.alienvault.com) | Indicadores de compromiso compartidos por la comunidad. | ✅ Activa | libre |  |
| [URLScan](https://urlscan.io) | Análisis de URLs sospechosas y phishing. | ✅ Activa | libre |  |
| [MISP](https://www.misp-project.org) | Plataforma para compartir indicadores de amenazas. | ✅ Activa | libre | 🧪 Docker |
| [OpenCTI](https://github.com/OpenCTI-Platform/opencti) | Plataforma abierta para organizar y relacionar inteligencia de amenazas (STIX). | ✅ Activa | libre | 🧪 Docker |
| [CTILookUp](https://www.ctilookup.com) | Enriquecimiento de IPs, dominios, URLs y emails. | 🟡 Con límites | 🔑 registro |  |
| [Hudson Rock Cavalier](https://www.hudsonrock.com/free-tools) | Comprueba si un email o dominio aparece en infecciones de infostealers. | ✅ Activa | libre |  |
| [Pulsedive](https://pulsedive.com) | Inteligencia de amenazas gratuita: reputación de IP, dominios y URL con enriquecimiento y fuentes. Registro para más consultas. | ✅ Activa | 🔑 registro |  |
| [Vulners](https://vulners.com) | Buscador de vulnerabilidades: CVE, exploits públicos y boletines de fabricantes en un solo lugar. Registro para la API. | ✅ Activa | 🔑 registro |  |
| [Agentic Attack Detections](https://github.com/ThreatDefence/agentic-attack-detections) | Reglas de detección, consultas de caza e IOC contra marcos de ataque con agentes de IA (ARTEX, PentAGI, HexStrike…) para Sigma, Sentinel, Splunk, Elastic, Zeek, Suricata y YARA. MIT, muy nuevo. | ✅ Activa | libre |  |

## Código y secretos

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Gitleaks](https://github.com/gitleaks/gitleaks) | Busca secretos expuestos en repositorios. | ✅ Activa | libre | 🧪 Go |
| [TruffleHog](https://github.com/trufflesecurity/trufflehog) | Encuentra y verifica credenciales filtradas. | ✅ Activa | libre | 🧪 Go |
| [grep.app](https://grep.app) | Búsqueda en código público de GitHub. | ✅ Activa | libre |  |
| [searchcode](https://searchcode.com/) | Busca fragmentos de código en millones de proyectos públicos de varias plataformas. | ✅ Activa | libre |  |
| [GHunt](https://github.com/mxrch/GHunt) | Investigación de cuentas de Google. Usa una cuenta de investigación. | ⚠️ Con precaución | 🔑 registro | 🧪 Python |
| [PublicWWW](https://publicwww.com) | Busca código fuente de páginas web: quién usa un mismo script, ID de Analytics o firma. Resultados gratis limitados; el resto es pago. | ✅ Activa | 💳 pago |  |

## Personas

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Sherlock](https://github.com/sherlock-project/sherlock) | Busca un nombre de usuario en cientos de sitios. | ✅ Activa | libre | 🧪 Python |
| [Consensus OSINT](https://github.com/OSINT-Experts-Society/Consensus-OSINT) | Une 19 proyectos (Maigret, WhatsMyName, Holehe y otros) en una sola terminal: 7.700+ sitios para alias, 200+ chequeos de email, deduplicados y revisados cada semana. Informes en HTML, JSON y PDF. Incluye sitios de citas y adultos: úsalo solo con finalidad legítima. | ✅ Activa | libre | 🧪 Python |
| [User Scanner](https://github.com/kaifcodec/user-scanner) | Alias y email en una sola CLI: 2.500+ plataformas y 200+ sitios con chequeo de email. | ✅ Activa | libre | 🧪 Python |
| [GoSearch](https://github.com/ibnaleem/gosearch) | Clon de Sherlock en Go, rápido y concurrente; cruza el alias con credenciales filtradas de Hudson Rock. | ✅ Activa | libre | 🧪 Go |
| [Mr.Holmes](https://github.com/Lucksi/Mr.Holmes) | CLI (Linux, Windows, Termux) que busca un alias en cientos de sitios y suma consultas de teléfono, dominio e IP; GPL-3.0. El instalador pide sudo: úsalo en una VM. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [Marple](https://github.com/soxoj/marple) | Junta enlaces a perfiles de un alias consultando 10+ buscadores (Google, Bing, DuckDuckGo…). | ✅ Activa | libre | 🧪 Python |
| [Linkook](https://github.com/JackJuly/linkook) | Encuentra cuentas vinculadas entre sí y emails asociados a partir de un alias; exporta el grafo a Neo4j. | ✅ Activa | libre | 🧪 Python |
| [Mailcat](https://github.com/sharsil/mailcat) | Descubre direcciones de email existentes a partir de un alias en 20+ proveedores de correo. | ✅ Activa | libre | 🧪 Python |
| [Blackbird](https://github.com/p1ngul1n0/blackbird) | Busca un alias o un email en cientos de sitios, con exportación a PDF y CSV. Muy activo; el repo no declara licencia. | ✅ Activa | libre | 🧪 Python |
| [Aliens Eye](https://github.com/arxhr007/Aliens_eye) | Busca un alias en 7.700+ plataformas con detección por aprendizaje automático (menos falsos positivos); informes en PDF, HTML y Maltego. MIT, muy activo. | ✅ Activa | libre | 🧪 Python |
| [FindMe](https://github.com/0xSaikat/findme) | Busca un alias en 400+ redes desde la terminal (pip install findme-osint); tiene versión web. MIT. | ✅ Activa | libre | 🧪 Python |
| [NAMINT](https://seintpl.github.io/NAMINT/) | Con nombre y apellido, genera alias y emails probables y los enlaces para buscarlos. En el navegador. | ✅ Activa | libre |  |
| [Namechk](https://namechk.com) | Comprueba si un alias está ocupado en redes y dominios. | ✅ Activa | libre |  |
| [Epieos](https://epieos.com) | Búsqueda inversa de email y teléfono (cuentas de Google, Skype y otras). Búsquedas gratis limitadas. | ✅ Activa | 🔑 registro 💳 pago |  |
| [OSINT Industries](https://www.osint.industries) | Búsqueda de email, teléfono y alias en cientos de módulos. De pago. | ✅ Activa | 🔑 registro 💳 pago |  |
| [Maigret](https://github.com/soxoj/maigret) | Dossier por usuario en miles de sitios. | ✅ Activa | libre | 🧪 Python |
| [Snoop](https://github.com/snooppr/snoop) | Busca un alias en miles de sitios, fuerte en webs rusas y de la CEI. Licencia propietaria: solo uso personal; la versión gratis trae unas 15 veces menos sitios y la completa es paga. | 🟡 Con límites | 💳 pago | 🧪 Python |
| [WhatsMyName](https://whatsmyname.app) | Dataset de sitios para buscar usuarios. Archivado en nov-2026: ya no se actualiza. | 🟡 Con límites | libre |  |
| [Holehe](https://github.com/megadose/holehe) | Qué sitios tienen registrado un email. Sin mantenimiento desde 2024. | 🟡 Con límites | libre | 🧪 Python |
| [Hunter.io](https://hunter.io) | Emails corporativos asociados a un dominio. | ✅ Activa | 🔑 registro 💳 pago |  |
| [PhoneInfoga](https://github.com/sundowndev/phoneinfoga) | Información pública sobre números de teléfono. | ✅ Activa | libre | 🧪 Go |
| [Numint](https://github.com/whoamitang/numint) | Perfil de un teléfono: validez, tipo de línea, país y operador sin registro; con claves API gratuitas suma riesgo de fraude y si el número está en Instagram, Amazon y otros. Terminal, web local o Discord. MIT. | ✅ Activa | libre | 🧪 Python |
| [Proton keyserver](https://api.protonmail.ch/pks/lookup?op=index&search=ejemplo@proton.me) | Comprueba si un email tiene clave pública de Proton (indica cuenta Proton). | ✅ Activa | libre |  |
| [Buscadores de personas de EE. UU.](https://www.whitepages.com) | PeekYou, Whitepages, TruePeopleSearch: poco útiles fuera de EE. UU. y con datos viejos. | ⚠️ Con precaución | 💳 pago |  |
| [Tookie-OSINT](https://github.com/alfredredbird/tookie-osint) | Busca un alias en cientos de sitios desde la terminal (Linux, Windows, Termux); MIT. Instálalo con pip en un entorno virtual, no con el script que pide sudo. | ✅ Activa | libre | 🧪 Python |
| [Unavatar](https://unavatar.io) | Muestra la foto de perfil pública asociada a un alias, email o dominio en decenas de plataformas (GitHub, X, YouTube, Gravatar…). Código abierto (MIT); gratis con límite diario, plan pago para más. | ✅ Activa | 💳 pago |  |
| [Enola](https://github.com/TheYahya/enola) | Busca un alias en cientos de sitios desde la terminal, al estilo Sherlock pero en Go. MIT. | ✅ Activa | libre | 🧪 Go |
| [HackUnderway CLI](https://github.com/HackUnderway/hackunderway-cli) | Consola en Python con 7 módulos (alias, X, TikTok, Instagram, email, teléfono, dominio) e informes TXT/PDF. El cliente es MIT, pero cada consulta usa créditos pagos de la API de Hack Underway. | ✅ Activa | 🔑 registro 💳 pago | 🧪 Python |

## Brechas

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Have I Been Pwned](https://haveibeenpwned.com) | Comprueba si un email aparece en filtraciones conocidas. | ✅ Activa | libre |  |
| [Intelligence X](https://intelx.io) | Archivo de filtraciones, pastes y darknet. | 🟡 Con límites | 🔑 registro 💳 pago |  |
| [DeHashed](https://dehashed.com) | Búsqueda en bases filtradas. Solo con autorización y finalidad defensiva. | ⚠️ Con precaución | 🔑 registro 💳 pago |  |
| [Library of Leaks](https://search.libraryofleaks.org/) | Buscador de DDoSecrets sobre millones de documentos filtrados de interés público. Contiene datos personales: solo para periodismo o investigación con base legal (RGPD). | ⚠️ Con precaución | libre |  |
| [Vendor History](https://vendorhistory.com) | ¿Hackearon a un proveedor? Avisos de brechas ante fiscales de EE. UU., reportes a la SEC, fallas explotadas (CISA) y reclamos de ransomware de 255 proveedores de software, cada uno con su fuente. Gratis y sin registro. | ✅ Activa | libre |  |
| [Have I Been Zuckered](https://haveibeenzuckered.com) | Comprueba si un número de teléfono está en la filtración de 533 millones de cuentas de Facebook (2021). Gratis; usa k-anonimato. | ✅ Activa | libre |  |

## Imágenes y video

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [ExifTool](https://exiftool.org) | Lectura de metadatos: la referencia forense. | ✅ Activa | libre | 🧪 instalador oficial |
| [TinEye](https://tineye.com) | Dónde apareció una imagen en internet. | ✅ Activa | libre |  |
| [Google Lens](https://lens.google) | Búsqueda visual y de objetos. | ✅ Activa | libre |  |
| [Yandex Images](https://yandex.com/images) | Búsqueda inversa fuerte en rostros y lugares. | ✅ Activa | libre |  |
| [InVID-WeVerify](https://weverify.eu/verification-plugin/) | Verificación de videos y fotogramas. | ✅ Activa | libre |  |
| [FOCA](https://github.com/ElevenPaths/FOCA) | Metadatos en documentos de una organización. Sin cambios desde 2021, solo Windows. | 🟡 Con límites | libre |  |
| [Hunchly](https://www.hunch.ly) | Captura y registro automático de la investigación. | 🟡 Con límites | 💳 pago |  |
| [WebPreserver](https://webpreserver.com/) | Extensión que captura páginas y redes sociales completas como evidencia con fecha y metadatos, en lote. De pago. | ✅ Activa | 💳 pago |  |
| [SingleFile](https://github.com/gildas-lormeau/SingleFile) | Extensión que guarda una página web completa en un solo archivo HTML. Útil para preservar evidencia. | ✅ Activa | libre |  |
| [ArchiveBox](https://github.com/ArchiveBox/ArchiveBox) | Archivo web propio: guarda URLs en HTML, PDF, captura y WARC en tu servidor. | ✅ Activa | libre | 🧪 Docker |
| Clearview AI | Reconocimiento facial. Incompatible con el RGPD en la UE. | ❌ Descartada | 💳 pago |  |
| [yt-dlp](https://github.com/yt-dlp/yt-dlp) | Descarga video y audio de miles de sitios (YouTube, X, TikTok…) para preservar evidencia antes de que la borren. Respeta derechos de autor y términos de uso. | ✅ Activa | libre | 🧪 Python |
| [Reverse Video Search (MaxIntel)](https://maxintel.org/video-reverse-search.html) | Extrae fotogramas clave de un video, lee el texto en pantalla (OCR) y los lleva a la búsqueda inversa de imágenes; también ubica una captura dentro del video. Todo corre en tu navegador, sin subir el archivo. | ✅ Activa | libre |  |

## GEOINT y transporte

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Google Earth](https://earth.google.com) | Imágenes satelitales e históricas. | ✅ Activa | libre |  |
| [Sentinel Hub EO Browser](https://apps.sentinel-hub.com/eo-browser/) | Imágenes satelitales con fecha y bandas. | ✅ Activa | 🔑 registro |  |
| [Flightradar24](https://www.flightradar24.com) | Seguimiento de vuelos en tiempo real. | ✅ Activa | 💳 pago |  |
| [ADS-B Exchange](https://globe.adsbexchange.com) | Vuelos sin filtrar, incluidos los bloqueados en otras plataformas. | ✅ Activa | libre |  |
| [MarineTraffic](https://www.marinetraffic.com) | Posición de buques. | 🟡 Con límites | 💳 pago |  |
| [ACLED](https://acleddata.com) | Datos de conflictos y protestas georreferenciados. | ✅ Activa | 🔑 registro |  |
| [Violations Watch](https://violationswatch.org/) | Registro abierto y diario de presuntas violaciones de derechos humanos y derecho humanitario, con enlaces a las fuentes. Son pistas sin verificar, no hallazgos. | ✅ Activa | libre |  |
| [WiGLE](https://wigle.net) | Mapa mundial de redes Wi-Fi, torres celulares y Bluetooth relevadas por voluntarios: sirve para ubicar un SSID. Registro para búsquedas avanzadas. | ✅ Activa | 🔑 registro |  |
| [ShadowBroker](https://github.com/bigbodycobain/shadowbroker) | Mapa en tiempo real autoalojado que junta 60+ fuentes: aviones, barcos, satélites, conflictos, interferencia GPS y más. AGPL-3.0. Incluye cámaras y escáneres de radio policiales: revisa la ley local; varias capas piden claves API. | ⚠️ Con precaución | libre | 🧪 Docker |
| [YouTube Geofind](https://mattw.io/youtube-geofind/location) | Busca videos de YouTube geoetiquetados alrededor de un punto, con radio, fechas e idioma. Útil para verificar dónde y cuándo se filmó algo. | ✅ Activa | libre |  |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/map/) | Incendios y focos de calor activos detectados por satélite casi en tiempo real, con mapa y descarga de datos. | ✅ Activa | libre |  |
| [WAQI (calidad del aire)](https://waqi.info/) | Calidad del aire en tiempo real de más de 10.000 estaciones del mundo. Sirve para contrastar humo, incendios o incidentes industriales. | ✅ Activa | libre |  |
| [Ventusky](https://www.ventusky.com/) | Mapa meteorológico mundial con historial: viento, lluvia, nubes y temperatura por hora. Clave para verificar el clima de una foto o video. | ✅ Activa | libre |  |
| [WorldCam (mapa de webcams)](https://worldcam.tv/map) | Mapa de cámaras públicas en vivo de lugares turísticos. Sirve para comparar un lugar con una imagen; no la uses para vigilar personas. | ✅ Activa | libre |  |
| [MapIndex](https://mapindex.org/) | Buscador de más de 2,8 millones de mapas por ubicación o palabra clave, incluidos mapas históricos. | ✅ Activa | libre |  |
| [Mapillary](https://www.mapillary.com/app/) | Fotos a nivel de calle de todo el mundo subidas por la comunidad, con fecha de captura; cubre zonas sin Google Street View. Gratis; la cuenta solo se pide para subir fotos. | ✅ Activa | libre |  |
| [Panoramax](https://panoramax.fr/) | Alternativa abierta a Street View: fotos de campo (360° o no) federadas por OpenStreetMap Francia, IGN y municipios, con datos libres. Cobertura fuerte en Francia y Europa. | ✅ Activa | libre |  |
| [Lookmap (Apple Look Around)](https://lookmap.skzk.dev/) | Mapa web que muestra las panorámicas de Apple Look Around desde cualquier navegador, útil donde Apple tiene imágenes más nuevas que Google. MIT; usa una API no oficial de Apple, puede dejar de funcionar. | ✅ Activa | libre |  |
| [Pano Date Resolver](https://pano-date.emily.bz/) | Calcula la fecha y hora exacta (±2 s) en que se tomó una panorámica de Google Street View a partir de su URL completa. Gratis; código abierto sin licencia declarada. | ✅ Activa | libre |  |

## Telegram

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Telegago](https://github.com/cipher387/osint_stuff_tool_collection#telegram) | Buscador de Google personalizado para Telegram. | ✅ Activa | libre |  |
| [TGStat](https://tgstat.com) | Estadísticas y búsqueda de canales y grupos. | ✅ Activa | libre |  |
| [Telemetr](https://telemetr.io) | Base de datos de canales con analítica. | ✅ Activa | 🔑 registro |  |
| [Lyzem](https://lyzem.com) | Búsqueda de canales, grupos, bots y mensajes. | 🟡 Con límites | libre |  |
| [4CAT](https://github.com/digitalmethodsinitiative/4cat) | Captura y análisis de datos sociales, incluido Telegram. | 🟡 Con límites | 🔑 registro | 🧪 Docker |
| Mapas de usuarios cercanos | Telegram retiró la función en 2024 y su uso es rastreo de personas. | ❌ Descartada | libre |  |
| [Telegram Phone Number Checker](https://github.com/bellingcat/telegram-phone-number-checker) | Herramienta de Bellingcat que comprueba si un número tiene cuenta de Telegram y muestra su alias e ID públicos. Necesita tu propia cuenta y API de Telegram. MIT. | ✅ Activa | 🔑 registro | 🧪 Python |

## Redes sociales

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Social Blade](https://socialblade.com) | Métricas e historial de cuentas. | ✅ Activa | libre |  |
| [Osintgram](https://github.com/Datalux/Osintgram) | Análisis de cuentas de Instagram. Exige login y viola los términos de Instagram. | ⚠️ Con precaución | 🔑 registro | 🧪 Python |
| [Social Media Image Search](https://cse.google.com/cse?cx=d1ef98853a52a426f) | Buscador de Google (BDE Analytics) que busca imágenes solo en Reddit, YouTube, X, Facebook, Instagram, Tumblr, LinkedIn y Snapchat. | ✅ Activa | libre |  |
| [TTAnon](https://ttanon.com/) | Visor web para ver perfiles y videos públicos de TikTok sin cuenta. Sitio de terceros detrás de una verificación antibots: no cargues datos personales. | 🟡 Con límites | libre |  |

## Empresas y registros

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [OpenCorporates](https://opencorporates.com) | Registros mercantiles de todo el mundo. | ✅ Activa | libre |  |
| [OpenSanctions](https://www.opensanctions.org) | Sanciones y personas expuestas políticamente. | ✅ Activa | libre |  |
| [CourtListener](https://www.courtlistener.com) | Expedientes judiciales de EE. UU. | ✅ Activa | libre |  |
| [Lacis](https://github.com/c4seus/lacis) | Mapea empresas francesas, sus directivos y domicilios en un grafo con fuente (SIRENE, RNE, BODACC) y marca señales como domiciliación masiva o empresas fénix. App de escritorio, GPL-3.0, interfaz en francés; versión 0.y, muy nueva. | ✅ Activa | libre | 🧪 instalador oficial |
| [Metagoofil](https://github.com/opsdisk/metagoofil) | Busca documentos públicos de una organización (PDF, DOC, XLS) y extrae sus metadatos: autores, usuarios y software. GPL-3.0. | ✅ Activa | libre | 🧪 Python |

## Dark web

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Tor Browser](https://www.torproject.org) | Acceso a sitios .onion. Úsalo dentro de una máquina virtual. | ✅ Activa | libre | 🧪 instalador oficial |
| [Ahmia](https://ahmia.fi) | Buscador de sitios .onion con filtrado de abuso, y grafo de enlaces entre sitios. | ✅ Activa | libre |  |
| [Onion Search Engine](https://onionsearchengine.com) | Buscador de la red Tor accesible desde la web normal. | ✅ Activa | libre |  |
| [onion-lookup (AIL)](https://onion.ail-project.org) | Comprueba si un sitio .onion existe y muestra títulos, idioma y fechas vistas. Integrado en Multi-OSINT Lite. | ✅ Activa | libre |  |
| [ExoneraTor](https://metrics.torproject.org/exonerator.html) | Comprueba si una IP fue nodo de Tor en una fecha. Clave para atribuir tráfico. | ✅ Activa | libre |  |
| [Onionoo / Relay Search](https://metrics.torproject.org/rs.html) | Datos oficiales de nodos Tor. Integrado en la búsqueda de IP de Multi-OSINT Lite. | ✅ Activa | libre |  |
| [TorMap](https://tormap.org) | Mapa y búsqueda de miles de nodos de la red Tor. | ✅ Activa | libre |  |
| [Darkweb archive](https://darkweb-archive.activetk.jp) | Descarga un sitio .onion como archivo (HTML, CSS, JS) para preservarlo como evidencia. | ✅ Activa | libre |  |
| [SOCRadar Dark Web Report](https://socradar.io/free-tools/dark-web-report) | Informe gratuito de exposición de un dominio en foros, Telegram y sitios de filtraciones. | ✅ Activa | 🔑 registro |  |
| [Whiteintel](https://whiteintel.io) | Comprueba la exposición de un dominio o email en la dark web. | 🟡 Con límites | 🔑 registro 💳 pago |  |
| [ALEPH Open Search](https://open-search.aleph-networks.eu/en) | Busca datos de tu organización en millones de sitios de la dark y deep web. | 🟡 Con límites | libre |  |
| [TorBot](https://github.com/DedSecInside/TorBot) | Crawler OSINT para la dark web (requiere Tor). | ✅ Activa | libre | 🧪 Python |
| [TorCrawl.py](https://github.com/MikeMeliz/TorCrawl.py) | Crawler en Python (GPL-3.0) que recorre sitios .onion a través de Tor y guarda su contenido. Úsalo dentro de una VM. | ✅ Activa | libre | 🧪 Python |
| [deepdarkCTI](https://github.com/fastfire/deepdarkCTI) | Lista curada (GPL-3.0) de fuentes de inteligencia de amenazas: foros, mercados, sitios de ransomware y canales de Telegram. Enlaza a sitios criminales: ábrelos solo en una VM y sin interactuar. | ⚠️ Con precaución | libre |  |
| [Darkus](https://github.com/Lucksi/Darkus) | Busca una palabra en varios buscadores de la deep y dark web. | ✅ Activa | libre | 🧪 Python |
| [DarkSherlock](https://github.com/banaxou/dark-sherlock) | Busca un alias en más de 40 foros de la dark web. Proyecto pequeño: pruébalo aislado. | 🟡 Con límites | libre | 🧪 Python |
| [TheDevilsEye](https://github.com/rlyonheart/thedevilseye) | Busca enlaces .onion desde la terminal sin usar Tor. | 🟡 Con límites | libre | 🧪 Python |
| [OnionSearch](https://github.com/megadose/OnionSearch) | Scraper de buscadores .onion. Sin cambios desde 2024. | 🟡 Con límites | libre | 🧪 Python |
| Onioff | Inspector de URLs .onion. Abandonado desde 2019. | ❌ Descartada | libre |  |
| [Dark Web Scraper (Apify)](https://apify.com/epcsht/darkweb-scraper) | Rastrea un sitio .onion buscando wallets, claves y contactos. | 🟡 Con límites | 🔑 registro 💳 pago |  |
| The Hidden Wiki | Directorio lleno de estafas y contenido ilegal. Usa Ahmia. | ❌ Descartada | libre |  |

## Forense digital

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Autopsy](https://www.autopsy.com) | Interfaz gráfica de The Sleuth Kit para analizar discos, teléfonos y líneas de tiempo. La referencia para empezar. | ✅ Activa | libre | 🧪 instalador oficial |
| [Volatility 3](https://github.com/volatilityfoundation/volatility3) | Análisis de memoria RAM: procesos, conexiones y artefactos de malware. | ✅ Activa | libre | 🧪 Python |
| [MemProcFS](https://github.com/ufrisk/MemProcFS) | Monta un volcado de memoria como si fuera una carpeta para revisarlo con cualquier herramienta. | ✅ Activa | libre |  |
| [Plaso (log2timeline)](https://github.com/log2timeline/plaso) | Arma una supertimeline con los eventos de un disco o de logs. | ✅ Activa | libre | 🧪 Python |
| [Herramientas de Eric Zimmerman](https://ericzimmerman.github.io) | Parsers de artefactos de Windows (MFT, registro, LNK, prefetch). Gratuitas y muy usadas en peritajes. | ✅ Activa | libre |  |
| [Velociraptor](https://github.com/Velocidex/velociraptor) | Recolección y análisis forense en muchos equipos a la vez (DFIR). | ✅ Activa | libre | 🧪 instalador oficial |
| [YARA](https://github.com/VirusTotal/yara) | Reglas para identificar y clasificar malware o archivos por patrones. | ✅ Activa | libre | 🧪 instalador oficial |
| [CyberChef](https://gchq.github.io/CyberChef/) | Decodifica, convierte y analiza datos en el navegador (Base64, hashes, fechas, XOR…). | ✅ Activa | libre |  |
| [Digital Forensics Lab](https://github.com/frankwxu/digital-forensics-lab) | Laboratorios prácticos gratuitos de forense digital (disco, memoria, red, móviles) con imágenes de evidencia y guías paso a paso; Universidad de Baltimore, Apache 2.0. | ✅ Activa | libre | 🧪 solo en VM |
| [Hopline](https://forensicworks.github.io/hopline/) | Rastreo de Bitcoin en el navegador: sigue el dinero transacción por transacción, marca patrones con su motivo, cruza listas de sanciones y ransomware y genera un informe verificable. Sin instalar ni servidor propio; Apache 2.0. | ✅ Activa | libre |  |
| [MVT (Mobile Verification Toolkit)](https://github.com/mvt-project/mvt) | De Amnesty International: busca rastros de spyware como Pegasus en copias de seguridad y volcados de Android e iPhone. | ✅ Activa | libre | 🧪 Python |
| [Ghidra](https://github.com/NationalSecurityAgency/ghidra) | Suite de ingeniería inversa de la NSA, gratuita y Apache 2.0: desensambla y descompila binarios para analizar malware. | ✅ Activa | libre | 🧪 instalador oficial |

## Apps de citas (RGPD)

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [FootprintIQ Dating Lookup](https://footprintiq.app/dating-profile-lookup) | Comprueba si un alias existe en Tinder, Bumble, Hinge, OkCupid y 500+ servicios. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | libre |  |
| [Social Catfish](https://www.socialcatfish.com) | Búsqueda inversa de fotos, alias y teléfonos para detectar perfiles falsos. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | 💳 pago |  |
| [Spokeo](https://www.spokeo.com) | Buscador de personas de EE. UU.; puede vincular email o teléfono con perfiles de citas. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | 💳 pago |  |
| [CheatSpyder](https://addons.mozilla.org/firefox/addon/cheatspyder-profile-search/) | Extensión de Firefox que revisa si un email, alias o teléfono está registrado en 100+ plataformas de citas. Se promociona para vigilar parejas. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | libre |  |
| [Perfil por URL directa (Tinder, OkCupid)](https://tinder.com) | Si conoces el alias, el perfil público se abre en tinder.com/@alias u okcupid.com/profile/alias. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | libre |  |
| [Dorks de perfiles de citas](https://www.google.com) | Búsquedas tipo site:tinder.com "nombre" o site:okcupid.com "alias" para perfiles indexados. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | libre |  |
| [TraceLens](https://apps.apple.com/app/tracelens-ai-face-search/id6770221940) | App de iOS de búsqueda facial para verificar con quién hablas en una app de citas. Datos biométricos: categoría especial del RGPD (art. 9). Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | 💳 pago |  |
| [Maigret en Apify](https://apify.com/ntriqpro/maigret-actor) | Maigret en la nube (3.000+ sitios, incluidos de citas) sin instalar nada. De pago por uso. Solo con base legal (RGPD art. 6): estafas románticas, sextorsión, suplantación o investigación encargada. Vigilar a una pareja o expareja puede ser acoso. | ⚠️ Con precaución | 🔑 registro 💳 pago |  |

## Ciberseguridad (laboratorio)

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [Kali Linux](https://www.kali.org/get-kali/) | Distribución Linux con cientos de herramientas de seguridad ya instaladas. La forma más simple de tener un laboratorio: descarga la imagen oficial para máquina virtual. | ✅ Activa | libre | 🧪 solo en VM |
| [Nmap](https://nmap.org/) | Descubre equipos, puertos abiertos y servicios en una red. Solo en sistemas propios o con autorización escrita. | ✅ Activa | libre | 🧪 instalador oficial |
| [Naabu](https://github.com/projectdiscovery/naabu) | Escáner de puertos rápido en Go (ProjectDiscovery, MIT); su modo pasivo usa Shodan InternetDB sin tocar el objetivo. Solo en sistemas propios o con autorización escrita. | ✅ Activa | libre | 🧪 Go |
| [Wireshark](https://www.wireshark.org/) | Captura y analiza tráfico de red paquete por paquete; también abre capturas (pcap) de un caso forense. | ✅ Activa | libre | 🧪 instalador oficial |
| [Burp Suite](https://portswigger.net/burp/communitydownload) | Proxy para interceptar y probar aplicaciones web. La edición Community es gratis; la Professional es paga. Solo en sistemas propios o con autorización escrita. | ✅ Activa | 💳 pago | 🧪 instalador oficial |
| [OWASP ZAP](https://www.zaproxy.org/) | Proxy y escáner de vulnerabilidades web, gratuito y de código abierto. Solo en sistemas propios o con autorización escrita. | ✅ Activa | libre | 🧪 instalador oficial |
| [Nuclei](https://github.com/projectdiscovery/nuclei) | Escáner de vulnerabilidades basado en plantillas mantenidas por la comunidad. Solo en sistemas propios o con autorización escrita. | ✅ Activa | libre | 🧪 Go |
| [Nikto](https://github.com/sullo/nikto) | Escáner de servidores web: archivos peligrosos, software desactualizado y malas configuraciones. Solo en sistemas propios o con autorización escrita. | ✅ Activa | libre | 🧪 Docker |
| [ffuf](https://github.com/ffuf/ffuf) | Fuzzer web rápido para descubrir rutas, parámetros y subdominios. Solo en sistemas propios o con autorización escrita. | ✅ Activa | libre | 🧪 Go |
| [Gobuster](https://github.com/OJ/gobuster) | Descubre directorios, archivos y subdominios por fuerza bruta. Solo en sistemas propios o con autorización escrita. | ✅ Activa | libre | 🧪 Go |
| [Metasploit Framework](https://github.com/rapid7/metasploit-framework) | Framework de explotación para comprobar si una vulnerabilidad es real. Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [sqlmap](https://github.com/sqlmapproject/sqlmap) | Detecta y explota inyecciones SQL de forma automática. Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 Python |
| [Hashcat](https://github.com/hashcat/hashcat) | Recupera contraseñas a partir de hashes usando la GPU. Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 instalador oficial |
| [John the Ripper](https://github.com/openwall/john) | Recupera contraseñas de hashes y archivos protegidos (zip, pdf, llaves). Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [Hydra](https://github.com/vanhauser-thc/thc-hydra) | Prueba contraseñas contra servicios de red (SSH, FTP, formularios web). Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [Aircrack-ng](https://github.com/aircrack-ng/aircrack-ng) | Suite para auditar redes Wi-Fi: captura, desautenticación y descifrado de claves. Necesita un adaptador USB compatible. Solo en redes propias o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [Airgorah](https://github.com/martin-olivier/airgorah) | Interfaz gráfica (Linux) sobre aircrack-ng para auditar Wi-Fi: clientes conectados, handshakes y PMKID; MIT. Solo en redes propias o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [Bettercap](https://github.com/bettercap/bettercap) | Reconocimiento y ataques de intermediario en redes Wi-Fi, Bluetooth LE y Ethernet. Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [Responder](https://github.com/lgandx/Responder) | Captura credenciales en redes Windows envenenando LLMNR, NBT-NS y mDNS. Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [NetExec](https://github.com/Pennyw0rth/NetExec) | Evalúa redes Windows y Active Directory a gran escala; sucesor de CrackMapExec (archivado). Solo en sistemas propios o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 Python |
| [Suricata](https://github.com/OISF/suricata) | Motor defensivo de detección de intrusiones (IDS/IPS) y monitoreo de red. | ✅ Activa | libre | 🧪 solo en VM |
| [Binwalk](https://github.com/ReFirmLabs/binwalk) | Analiza y extrae imágenes de firmware (routers, cámaras, IoT). | ✅ Activa | libre | 🧪 solo en VM |
| [BlueTeam-Tools](https://github.com/A-poc/BlueTeam-Tools) | Colección de 70+ herramientas defensivas: caza de amenazas, monitoreo, análisis de malware, forense y respuesta a incidentes. Sin licencia declarada. | ✅ Activa | libre |  |
| [Kismet](https://github.com/kismetwireless/kismet) | Detector pasivo de redes Wi-Fi, Bluetooth y otras señales de radio; también sirve como sensor de intrusiones inalámbricas. | ✅ Activa | libre | 🧪 instalador oficial |
| [Wifite2](https://github.com/derv82/wifite2) | Automatiza auditorías Wi-Fi (WPA, WPS) usando Aircrack-ng y otras. Solo en redes propias o con autorización escrita. | ⚠️ Con precaución | libre |  |
| [Wifit3](https://github.com/derv82/wifit3) | Sucesor de Wifite del mismo autor (GPL-2.0): auditoría Wi-Fi en Windows, Linux y macOS con un adaptador USB. Solo en redes propias o con autorización escrita. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [Airgeddon](https://github.com/v1s1t0r1sh3r3/airgeddon) | Menú en Bash para auditar redes inalámbricas (handshakes, WPS, portales falsos). Solo en redes propias o con autorización escrita. | ⚠️ Con precaución | libre |  |
| [hcxdumptool](https://github.com/ZerBea/hcxdumptool) | Captura tráfico Wi-Fi para pruebas de seguridad de WPA/WPA2 (junto con hcxtools y Hashcat). Solo en redes propias o con autorización escrita. | ⚠️ Con precaución | libre |  |
| [RedRoot](https://github.com/agampreet-singh) | Repo retirado de GitHub (404 desde el 25-nov-2026); se conserva el análisis. Framework ofensivo en Python (MIT) con 30+ módulos: phishing, backdoor, DoS, Wi-Fi. El módulo Bluetooth que roba contactos y SMS no es público: en el repo solo muestra «MODULE LOCKED». Solo en laboratorio propio. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [DarkFly-Tool](https://github.com/Ranginang67/DarkFly-Tool) | Menú de Termux que instala 500+ herramientas. Abandonado desde 2019 (Python 2), con código ofuscado que no se puede revisar y 7 herramientas de spam de SMS. No recomendado. | ⚠️ Con precaución | libre |  |

## Frameworks, IA y automatización

| Herramienta | Uso | Estado | Acceso | Instalación |
|---|---|---|---|---|
| [X-osint](https://github.com/TermuxHackz/X-osint) | Framework de terminal (Linux/Termux) con 17 módulos: IP, email, teléfono, subdominios, CVE, metadatos, infostealers. El instalador pide sudo: revísalo y úsalo en una VM. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [SpiderFoot](https://github.com/smicallef/spiderfoot) | Reconocimiento automatizado con más de 200 módulos. Sin cambios desde nov-2023: algunos módulos fallan. | 🟡 Con límites | libre | 🧪 Python |
| [Recon-ng](https://github.com/lanmaster53/recon-ng) | Framework modular de reconocimiento. | ✅ Activa | libre | 🧪 Python |
| [Maltego](https://www.maltego.com) | Grafos de relaciones entre entidades. | 🟡 Con límites | 🔑 registro 💳 pago | 🧪 instalador oficial |
| [OSINT Case](https://osintcase.com/) | Espacio de trabajo de casos en el navegador, sin cuenta: sujetos, vínculos, mapa, línea de tiempo y evidencias con SHA-256 y cadena de custodia. GPL-3.0, proyecto nuevo. | ✅ Activa | libre |  |
| [OSINTMapper](https://github.com/Geistnigma/OSINTMapper) | Cartografía colaborativa de investigaciones, autoalojada (MIT). Está en versión alfa: no la uses en un caso real sin copias propias. | 🟡 Con límites | libre | 🧪 Docker |
| [Gephi](https://gephi.org/) | Visualiza y analiza redes de vínculos (personas, cuentas, dominios) importadas desde CSV. Libre y de escritorio. | ✅ Activa | libre | 🧪 instalador oficial |
| [Cytoscape](https://cytoscape.org/) | Análisis de redes de código abierto con complementos; útil para grafos grandes de relaciones. | ✅ Activa | libre | 🧪 instalador oficial |
| [Awesome OSINT MCP servers](https://start.me/p/aNMY5j/awesome-osint-mcp-servers) | Catálogo de servidores MCP para conectar OSINT a agentes de IA. | ✅ Activa | libre |  |
| [Darknet MCP Server](https://github.com/badchars/darknet-mcp-server) | 66 herramientas de dark web e inteligencia de amenazas para agentes de IA. Código de terceros: revísalo. | ⚠️ Con precaución | libre |  |
| [OpenTor](https://github.com/vichhka-git/OpenTor) | Skill para que un agente de IA (Claude Code) busque en 12 buscadores .onion y extraiga IOCs. Sin licencia clara. | ⚠️ Con precaución | libre |  |
| [Claude-OSINT](https://github.com/elementalsouls/Claude-OSINT) | Skills de Claude para recon externo. Código de terceros: revísalo antes de instalar. | ⚠️ Con precaución | libre |  |
| [World Intel MCP](https://github.com/marc-shade/world-intel-mcp) | Inteligencia global en tiempo real. Proyecto pequeño: pruébalo aislado. | 🟡 Con límites | libre |  |
| [n8n](https://n8n.io) | Orquestación de flujos y alertas. | ✅ Activa | libre | 🧪 Docker |
| [OsintHunter](https://github.com/letox4/OsintHunter) | Plataforma local con 49 módulos (alias, email, teléfono, dominio, IP) que arma un grafo con puntaje de confianza e informes; MIT. Proyecto nuevo: ejecútalo desde el código en una VM, no desde el .exe. | ⚠️ Con precaución | libre | 🧪 solo en VM |
| [SIGIT](https://github.com/termuxhackers-id/SIGIT) | Kit de terminal: alias en 100+ plataformas, teléfono, email, DNS/WHOIS, subdominios, geolocalización de IP y cabeceras HTTP; dominio público. | ✅ Activa | libre | 🧪 Python |
| [Pip-Intel](https://github.com/emrekybs/Pip-Intel) | Reúne varias utilidades OSINT (email, teléfono, alias, IP, subdominios) en un solo script. Sin cambios desde may-2024. | 🟡 Con límites | libre | 🧪 Python |
| [ARTEMIS](https://github.com/Stanford-Trinity/ARTEMIS) | Agentes de IA autónomos de Stanford (Apache 2.0) que buscan y explotan vulnerabilidades. El alcance solo se indica en el prompt, sin bloqueo técnico; necesita claves pagas de LLM. Usar solo en laboratorio propio. | ⚠️ Con precaución | 💳 pago | 🧪 solo en VM |
| [Strix](https://github.com/usestrix/strix) | Agentes de IA que hacen pentesting de apps y APIs y validan lo que encuentran con pruebas de concepto (Apache 2.0). El alcance lo controla el propio agente. Solo en sistemas propios y dentro de una VM. | ⚠️ Con precaución | 💳 pago | 🧪 solo en VM |
| [PentAGI](https://github.com/vxcontrol/pentagi) | Sistema de agentes de IA que ejecuta pentests completos con herramientas de Kali en Docker (MIT + EULA). Corre como root con acceso al Docker del equipo. Solo en una VM dedicada y con autorización escrita. | ⚠️ Con precaución | 💳 pago | 🧪 solo en VM |

## Uso responsable

Investigar a una persona requiere una finalidad lícita y respetar el RGPD y la ley de protección de datos de tu país. Este directorio enlaza a servicios de terceros sin afiliación, salvo las herramientas marcadas 🤝 Patrocinada en el sitio.

## 🤝 Herramientas patrocinadas

Los proveedores pueden patrocinar su herramienta: nos dan acceso de prueba, la evaluamos con casos reales y publicamos lo que obtuvimos, bueno o malo, sin revisión previa del proveedor; a cambio pedimos que compartan nuestra evaluación. El patrocinio no cambia los criterios de inclusión ni el estado de la ficha, y las fichas llevan la etiqueta 🤝 Patrocinada. Reglas completas: [osintario.github.io/#patrocinadas](https://osintario.github.io/#patrocinadas). Formato de evaluación: [evaluación de ejemplo con ExifTool](https://osintario.github.io/evaluacion-ejemplo.html).

## Cómo se actualiza

El contenido vive en `directory.js` (una fila por herramienta, con descripción en ES/EN/PT). `python3 build.py` regenera las 18 páginas, `dirlinks.js`, el sitemap y este README.

## Licencia

Contenido bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
