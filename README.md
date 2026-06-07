# Lumoryx Agency

Sitio web responsive para una agencia digital. Incluye secciones de servicios, mision, vision, portafolio, proceso, planes, preguntas frecuentes, contacto, libro de reclamaciones y seis demos funcionales.

## Funcionalidades

- Navegacion suave entre secciones.
- Menu responsive para celulares.
- Botones de servicios y planes que rellenan el formulario de contacto.
- Cotizador interactivo con calculo automatico.
- Resumen de cotizacion copiable y enviable al formulario.
- Filtros funcionales en el portafolio.
- Seis paginas demo: restaurante, e-commerce, inmobiliaria, estudio juridico, gimnasio y consultoria.
- Seccion institucional con mision, vision y proposito.
- Libro de reclamaciones virtual con validacion de campos.
- Preguntas frecuentes desplegables.
- Formulario avanzado con validacion y estructura lista para EmailJS.
- Guardado temporal del formulario en el navegador.
- Boton flotante y enlaces directos a WhatsApp.

## Archivos

- `index.html`: estructura principal del sitio.
- `style.css`: estilos, responsive y componentes visuales.
- `script.js`: interacciones y botones funcionales.
- `libro-reclamaciones.html`: pagina legal para registrar reclamos o quejas.
- `reclamaciones.js`: validacion local del libro de reclamaciones.
- `demos/`: paginas demo funcionales con estilos compartidos.

## Como usar

Abre `index.html` en el navegador. No requiere instalacion ni dependencias.

## Personalizacion rapida

1. El correo configurado actualmente es `moisesardilesmedina@gmail.com`.
2. El WhatsApp configurado actualmente es `+51 955 338 183`.
3. Reemplaza textos, precios e imagenes por contenido de tus clientes o negocio.
4. Sube la carpeta a GitHub y publica con GitHub Pages.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub.
2. Sube los archivos de esta carpeta.
3. Entra a **Settings > Pages**.
4. Selecciona la rama principal y la carpeta raiz.
5. Guarda los cambios y abre la URL generada por GitHub.

## Activar el formulario con EmailJS

El formulario ya esta preparado para enviar desde la pagina sin abrir Outlook, Gmail ni otra aplicacion del visitante. Para activarlo:

1. Crea una cuenta en EmailJS.
2. Conecta el correo que recibira los mensajes.
3. Crea un template con estas variables:
   `to_email`, `from_name`, `from_email`, `company`, `phone`, `service`, `budget`, `message`, `subject`.
4. Copia tus datos en `script.js`:
   `publicKey`, `serviceId` y `templateId`.
5. Sube el sitio a Hostinger o a tu hosting.

Mientras esos valores sigan como `TU_PUBLIC_KEY`, `TU_SERVICE_ID` y `TU_TEMPLATE_ID`, el formulario mostrara un aviso indicando que falta configurar EmailJS.
