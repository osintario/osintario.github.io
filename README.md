# OSINTario

Directorio en español de herramientas OSINT, revisado a mano: qué hace cada una, si sigue activa y cuándo usarla con cuidado.

🌐 Sitio: https://osintario.github.io · Mantenido por Federico Dosio, profesor de Investigación con Fuentes Abiertas (IFA) en el Instituto Universitario de la Policía Federal Argentina (IUPFA).

## 🔎 Multi-OSINT Lite (gratis, en tu navegador)

Investiga un **dominio, una IP, un alias, un email, un teléfono o una imagen** y genera dorks de Google: https://osintario.github.io/herramientas.html

- Consulta varias fuentes a la vez (DNS, crt.sh, RDAP, Wayback, AlienVault OTX, Shodan InternetDB, ipinfo, GitHub, Keybase, Gravatar, Have I Been Pwned).
- Informe con fuente, nivel de confianza y **hash SHA-256**, exportable en JSON y Markdown.
- **Sin servidor:** lo que buscas no pasa por OSINTario.

> Si te sirve, deja una ⭐. Las sugerencias de herramientas nuevas van por *Issues* o *Pull Request*.

**Última revisión:** 15-nov-2026

## Estados

- ✅ Activa y verificada
- 🟡 Activa con límites (de pago, registro o poco mantenimiento)
- ⚠️ Usar con precaución legal o ética
- ❌ Descartada (no se enlaza)

## Índice

- [Colecciones](#colecciones)
- [Infraestructura](#infraestructura)
- [Dominios y DNS](#dominios-y-dns)
- [Amenazas](#amenazas)
- [Código y secretos](#codigo-y-secretos)
- [Personas](#personas)
- [Brechas](#brechas)
- [Imágenes y video](#imágenes-y-video)
- [GEOINT y transporte](#geoint-y-transporte)
- [Telegram](#telegram)
- [Redes sociales](#redes-sociales)
- [Empresas y registros](#empresas-y-registros)
- [Dark web](#dark-web)
- [Automatización e IA](#automatizacion-e-ia)

## Colecciones

| Herramienta | Uso | Estado |
|---|---|---|
| [OSINT Stuff Tool Collection](https://github.com/cipher387/osint_stuff_tool_collection) | Cientos de herramientas online por categoría, incluida Telegram. | ✅ Activa |
| [Awesome OSINT](https://github.com/jivoi/awesome-osint) | La lista curada más completa de la comunidad. | ✅ Activa |
| [OSINT Framework](https://osintframework.com) | Árbol interactivo de herramientas por tipo de dato. | ✅ Activa |
| [Awesome OSINT Arsenal](https://github.com/rawfilejson/awesome-osint-arsenal) | Más de 100 herramientas con instalador en un comando. | ✅ Activa |
| [OSINTJet Quick Search](https://osintjet.com/en/osint-search-tools/) | Lanzador de búsquedas por categoría. Servicio comercial nuevo: no subas datos de casos reales. | 🟡 Con límites |
| [OSINT Navigator](https://indicator.media) | Buscador de más de 7.500 herramientas OSINT. | ✅ Activa |

## Infraestructura

| Herramienta | Uso | Estado |
|---|---|---|
| [Shodan](https://www.shodan.io) | Dispositivos y servicios expuestos a internet. | ✅ Activa |
| [Censys](https://search.censys.io) | Activos expuestos y certificados TLS. | ✅ Activa |
| [ZoomEye](https://www.zoomeye.ai) | Alternativa a Shodan para contrastar resultados. | ✅ Activa |
| [Netlas](https://netlas.io) | Escaneo de internet y DNS histórico. | ✅ Activa |
| [GreyNoise](https://viz.greynoise.io) | Distingue escaneo masivo de ataques dirigidos. | ✅ Activa |
| [Grayhat Warfare](https://grayhatwarfare.com) | Buckets de almacenamiento en la nube abiertos. | 🟡 Con límites |
| [Wappalyzer](https://www.wappalyzer.com) | Tecnologías que usa un sitio web. | ✅ Activa |
| [BuiltWith](https://builtwith.com) | Tecnologías y relaciones entre sitios. | ✅ Activa |

## Dominios y DNS

| Herramienta | Uso | Estado |
|---|---|---|
| [crt.sh](https://crt.sh) | Transparencia de certificados: encuentra subdominios olvidados. | ✅ Activa |
| [SecurityTrails](https://securitytrails.com) | DNS histórico y dominios relacionados. | 🟡 Con límites |
| [Amass](https://github.com/owasp-amass/amass) | Mapeo de superficie de ataque y subdominios. | ✅ Activa |
| [Subfinder](https://github.com/projectdiscovery/subfinder) | Enumeración pasiva de subdominios. | ✅ Activa |
| [MassDNS](https://github.com/blechschmidt/massdns) | Resolución masiva de DNS. | ✅ Activa |
| [dnstwist](https://github.com/elceef/dnstwist) | Dominios de typosquatting y phishing contra una marca. | ✅ Activa |
| [theHarvester](https://github.com/laramies/theHarvester) | Emails, subdominios y nombres de un dominio. | ✅ Activa |
| [Wayback Machine](https://web.archive.org) | Versiones archivadas de sitios web. | ✅ Activa |
| [Archive.today](https://archive.ph) | Archivo de páginas que a veces captura lo que Wayback no. | ✅ Activa |
| [FinalRecon](https://github.com/thewhiteh4t/FinalRecon) | Reconocimiento web todo en uno. | ✅ Activa |

## Amenazas

| Herramienta | Uso | Estado |
|---|---|---|
| [VirusTotal](https://www.virustotal.com) | Análisis de archivos, URLs, dominios e IPs. | ✅ Activa |
| [AlienVault OTX](https://otx.alienvault.com) | Indicadores de compromiso compartidos por la comunidad. | ✅ Activa |
| [URLScan](https://urlscan.io) | Análisis de URLs sospechosas y phishing. | ✅ Activa |
| [MISP](https://www.misp-project.org) | Plataforma para compartir indicadores de amenazas. | ✅ Activa |
| [CTILookUp](https://www.ctilookup.com) | Enriquecimiento de IPs, dominios, URLs y emails. | 🟡 Con límites |

## Código y secretos

| Herramienta | Uso | Estado |
|---|---|---|
| [Gitleaks](https://github.com/gitleaks/gitleaks) | Busca secretos expuestos en repositorios. | ✅ Activa |
| [TruffleHog](https://github.com/trufflesecurity/trufflehog) | Encuentra y verifica credenciales filtradas. | ✅ Activa |
| [grep.app](https://grep.app) | Búsqueda en código público de GitHub. | ✅ Activa |
| [GHunt](https://github.com/mxrch/GHunt) | Investigación de cuentas de Google. Requiere sesión: usa una cuenta de investigación. | ⚠️ Con precaución |

## Personas

| Herramienta | Uso | Estado |
|---|---|---|
| [Sherlock](https://github.com/sherlock-project/sherlock) | Busca un nombre de usuario en cientos de sitios. | ✅ Activa |
| [Maigret](https://github.com/soxoj/maigret) | Dossier por usuario en miles de sitios. | ✅ Activa |
| [WhatsMyName](https://whatsmyname.app) | Dataset de sitios para buscar usuarios. Archivado en nov-2026: ya no se actualiza. | 🟡 Con límites |
| [Holehe](https://github.com/megadose/holehe) | Qué sitios tienen registrado un email. Sin mantenimiento desde 2024. | 🟡 Con límites |
| [Hunter.io](https://hunter.io) | Emails corporativos asociados a un dominio. | ✅ Activa |
| [PhoneInfoga](https://github.com/sundowndev/phoneinfoga) | Información pública sobre números de teléfono. | ✅ Activa |
| [Buscadores de personas de EE. UU.](https://www.whitepages.com) | PeekYou, Whitepages, TruePeopleSearch: poco útiles fuera de EE. UU. y con datos viejos. | ⚠️ Con precaución |

## Brechas

| Herramienta | Uso | Estado |
|---|---|---|
| [Have I Been Pwned](https://haveibeenpwned.com) | Comprueba si un email aparece en filtraciones conocidas. | ✅ Activa |
| [Intelligence X](https://intelx.io) | Archivo de filtraciones, pastes y darknet. | 🟡 Con límites |
| [DeHashed](https://dehashed.com) | Búsqueda en bases filtradas. Solo con autorización y finalidad defensiva. | ⚠️ Con precaución |

## Imágenes y video

| Herramienta | Uso | Estado |
|---|---|---|
| [ExifTool](https://exiftool.org) | Lectura de metadatos: la referencia forense. | ✅ Activa |
| [TinEye](https://tineye.com) | Dónde apareció una imagen en internet. | ✅ Activa |
| [Google Lens](https://lens.google) | Búsqueda visual y de objetos. | ✅ Activa |
| [Yandex Images](https://yandex.com/images) | Búsqueda inversa fuerte en rostros y lugares. | ✅ Activa |
| [InVID-WeVerify](https://weverify.eu/verification-plugin/) | Verificación de videos y fotogramas. | ✅ Activa |
| [FOCA](https://github.com/ElevenPaths/FOCA) | Metadatos en documentos de una organización. Sin cambios desde 2022, solo Windows. | 🟡 Con límites |
| [Hunchly](https://www.hunch.ly) | Captura y registro automático de la investigación. | 🟡 Con límites |
| Clearview AI | Reconocimiento facial. Incompatible con el RGPD en la UE. | ❌ Descartada |

## GEOINT y transporte

| Herramienta | Uso | Estado |
|---|---|---|
| [Google Earth](https://earth.google.com) | Imágenes satelitales e históricas. | ✅ Activa |
| [Sentinel Hub EO Browser](https://apps.sentinel-hub.com/eo-browser/) | Imágenes satelitales con fecha y bandas. | ✅ Activa |
| [Flightradar24](https://www.flightradar24.com) | Seguimiento de vuelos en tiempo real. | ✅ Activa |
| [ADS-B Exchange](https://globe.adsbexchange.com) | Vuelos sin filtrar, incluidos los bloqueados en otras plataformas. | ✅ Activa |
| [MarineTraffic](https://www.marinetraffic.com) | Posición de buques. | 🟡 Con límites |
| [ACLED](https://acleddata.com) | Datos de conflictos y protestas georreferenciados. | ✅ Activa |

## Telegram

| Herramienta | Uso | Estado |
|---|---|---|
| [Telegago](https://github.com/cipher387/osint_stuff_tool_collection#telegram) | Buscador de Google personalizado para Telegram. | ✅ Activa |
| [TGStat](https://tgstat.com) | Estadísticas y búsqueda de canales y grupos. | ✅ Activa |
| [Telemetr](https://telemetr.io) | Base de datos de canales con analítica. | ✅ Activa |
| [Lyzem](https://lyzem.com) | Búsqueda de canales, grupos, bots y mensajes. | 🟡 Con límites |
| [4CAT](https://github.com/digitalmethodsinitiative/4cat) | Captura y análisis de datos sociales, incluido Telegram. | 🟡 Con límites |
| Mapas de usuarios cercanos | Telegram retiró la función en 2024 y su uso es rastreo de personas. | ❌ Descartada |

## Redes sociales

| Herramienta | Uso | Estado |
|---|---|---|
| [Social Blade](https://socialblade.com) | Métricas e historial de cuentas. | ✅ Activa |
| [Osintgram](https://github.com/Datalux/Osintgram) | Análisis de cuentas de Instagram. Exige login y viola los términos de Instagram. | ⚠️ Con precaución |

## Empresas y registros

| Herramienta | Uso | Estado |
|---|---|---|
| [OpenCorporates](https://opencorporates.com) | Registros mercantiles de todo el mundo. | ✅ Activa |
| [OpenSanctions](https://www.opensanctions.org) | Sanciones y personas expuestas políticamente. | ✅ Activa |
| [CourtListener](https://www.courtlistener.com) | Expedientes judiciales de EE. UU. | ✅ Activa |

## Dark web

| Herramienta | Uso | Estado |
|---|---|---|
| [Tor Browser](https://www.torproject.org) | Acceso a sitios .onion. Úsalo dentro de una máquina virtual. | ✅ Activa |
| [Ahmia](https://ahmia.fi) | Buscador de sitios .onion con filtrado de abuso. | ✅ Activa |
| [OnionSearch](https://github.com/megadose/OnionSearch) | Scraper de buscadores .onion. Sin cambios desde 2024. | 🟡 Con límites |
| The Hidden Wiki | Directorio lleno de estafas y contenido ilegal. Usa Ahmia. | ❌ Descartada |

## Automatización e IA

| Herramienta | Uso | Estado |
|---|---|---|
| [SpiderFoot](https://github.com/smicallef/spiderfoot) | Reconocimiento automatizado con más de 200 módulos. | ✅ Activa |
| [Recon-ng](https://github.com/lanmaster53/recon-ng) | Framework modular de reconocimiento. | ✅ Activa |
| [Maltego](https://www.maltego.com) | Grafos de relaciones entre entidades. | 🟡 Con límites |
| [Awesome OSINT MCP servers](https://start.me/p/aNMY5j/awesome-osint-mcp-servers) | Catálogo de servidores MCP para conectar OSINT a agentes de IA. | ✅ Activa |
| [Claude-OSINT](https://github.com/elementalsouls/Claude-OSINT) | Skills de Claude para recon externo. Código de terceros: revísalo antes de instalar. | ⚠️ Con precaución |
| [World Intel MCP](https://github.com/marc-shade/world-intel-mcp) | Inteligencia global en tiempo real. Proyecto pequeño: pruébalo aislado. | 🟡 Con límites |
| [n8n](https://n8n.io) | Orquestación de flujos y alertas. | ✅ Activa |

## Uso responsable

Investigar a una persona requiere una finalidad lícita y respetar el RGPD y la ley de protección de datos de tu país. Este directorio enlaza a servicios de terceros sin afiliación.

## Licencia

Contenido bajo [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.es).
