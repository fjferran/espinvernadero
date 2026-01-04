export const tutorialSteps = [
  {
    id: 'intro',
    title: 'Bienvenido Agricultor',
    content: `
      <h2>Control Total de tu Cultivo</h2>
      <p>Esta guía te llevará paso a paso para construir tu propio sistema de monitoreo y control para tu cultivo interior.</p>
      <p>Sin necesidad de conocimientos previos de programación. Solo sigue las instrucciones.</p>
      <p><strong>Lo que lograrás:</strong></p>
      <ul>
        <li>Controlar la iluminación desde tu móvil.</li>
        <li>Ver la temperatura y humedad en tiempo real.</li>
        <li>Todo funcionando en tu propia red WiFi local, privado y seguro.</li>
      </ul>
    `,
    type: 'info'
  },
  {
    id: 'material',
    title: 'Lista de Materiales',
    content: `
      <p>Necesitas conseguir estos componentes electrónicos económicos:</p>
      <ul class="shopping-list">
        <li><strong>ESP32 Dev Kit V1</strong> - El cerebro del sistema (aprox. 5-8€).</li>
        <li><strong>Módulo Relé de 1 Canal (5V)</strong> - Para encender/apagar focos.</li>
        <li><strong>Sensor DHT11 o DHT22</strong> - Para medir temperatura y humedad (DHT22 es más preciso).</li>
        <li><strong>Cables Jumper (Dupont)</strong> - Macho-Hembra y Hembra-Hembra para conexiones.</li>
        <li><strong>Cable USB</strong> - De buena calidad para conectar el ESP32 al PC.</li>
      </ul>
    `,
    type: 'checklist'
  },
  {
    id: 'wiring',
    title: 'Conexiones (Hardware)',
    content: `
      <h3>No tengas miedo, es sencillo.</h3>
      <p>Realiza las conexiones con el ESP32 desconectado de la corriente.</p>
      
      <h4>1. Conectar el Sensor T-H (DHT11/22)</h4>
      <ul>
        <li><strong>VCC (+)</strong> del sensor -> a <strong>3V3</strong> o <strong>VIN</strong> (5V) del ESP32.</li>
        <li><strong>GND (-)</strong> del sensor -> a <strong>GND</strong> del ESP32.</li>
        <li><strong>DATA (Señal)</strong> -> al <strong>Pin D15</strong> (GPIO 15) del ESP32.</li>
      </ul>

      <h4>2. Conectar el Módulo Relé</h4>
      <ul>
        <li><strong>VCC (+)</strong> -> a <strong>VIN</strong> (5V) del ESP32.</li>
        <li><strong>GND (-)</strong> -> a <strong>GND</strong> del ESP32.</li>
        <li><strong>IN (Entrada)</strong> -> al <strong>Pin D4</strong> (GPIO 4) del ESP32.</li>
      </ul>
      
      <div class="alert warn">
        <strong>¡Importante!</strong> La conexión de la lámpara de cultivo al relé trabaja con 220V. Si no tienes experiencia eléctrica, pide ayuda para esa parte específica. Aquí solo manejamos los 5V seguros del control.
      </div>
    `,
    type: 'info'
  },
  {
    id: 'software-setup',
    title: 'Preparar el Ordenador',
    content: `
      <p>Necesitamos un programa para enviar las órdenes al ESP32.</p>
      <ol>
        <li>Descarga e instala el <strong><a href="https://www.arduino.cc/en/software" target="_blank">Arduino IDE</a></strong>.</li>
        <li>Abre Arduino IDE. Ve a <em>Archivos > Preferencias</em>.</li>
        <li>En "Gestor de URLs Adicionales", pega esto: <br><code>https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json</code></li>
        <li>Ve a <em>Herramientas > Placa > Gestor de Tarjetas</em>, busca "esp32" e instala la versión de Espressif Systems.</li>
        <li>Selecciona tu placa en <em>Herramientas > Placa > DOIT ESP32 DEVKIT V1</em>.</li>
      </ol>
    `,
    type: 'step'
  },
  {
    id: 'firmware',
    title: 'El Código Mágico',
    content: `
      <p>Copia este código completo y pégalo en tu Arduino IDE, borrando cualquier cosa que haya antes.</p>
      <p><strong>IMPORTANTE:</strong> Busca las líneas que dicen <code>"TU_WIFI_AQUI"</code> y <code>"TU_CONTRASEÑA_AQUI"</code> y cámbialas por las de tu casa.</p>
    `,
    code: `
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

// --- CONFIGURACIÓN DE USUARIO ---
const char* ssid = "TU_WIFI_AQUI";
const char* password = "TU_CONTRASEÑA_AQUI";

#define DHTPIN 15     // Pin conectado al sensor DHT
#define DHTTYPE DHT11 // Cambia a DHT22 si usas ese sensor
#define RELAY_PIN 4   // Pin conectado al Relé

// --- OBJETOS ---
DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);

// --- VARIABLES ---
float temperature = 0;
float humidity = 0;
bool lightState = false;

// --- HTML DE LA APP (Guardado en memoria del ESP32) ---
String getHTML() {
  String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<title>Mi Cultivo</title>";
  html += "<style>body{font-family:sans-serif;text-align:center;background:#1a1a1a;color:white;padding:20px;}";
  html += ".card{background:#333;margin:auto;padding:20px;border-radius:15px;max-width:400px;box-shadow:0 4px 6px rgba(0,0,0,0.3);}";
  html += "h1{color:#4CAF50;} .data{font-size:1.5rem;margin:10px;}";
  html += ".btn{background:#4CAF50;color:white;border:none;padding:15px 32px;text-align:center;text-decoration:none;display:inline-block;font-size:16px;border-radius:10px;cursor:pointer;margin-top:20px;}";
  html += ".btn.off{background:#f44336;}";
  html += "</style></head><body>";
  html += "<div class='card'><h1>🍄 Monitor Cultivo</h1>";
  html += "<div class='data'>🌡 Temp: " + String(temperature) + " °C</div>";
  html += "<div class='data'>💧 Humedad: " + String(humidity) + " %</div>";
  html += "<h2>Iluminación</h2>";
  if(lightState) {
    html += "<p>Estado: <strong>ENCENDIDO</strong> ☀️</p>";
    html += "<a href='/toggle'><button class='btn off'>APAGAR LUZ</button></a>";
  } else {
    html += "<p>Estado: <strong>APAGADO</strong> 🌑</p>";
    html += "<a href='/toggle'><button class='btn'>ENCENDER LUZ</button></a>";
  }
  html += "</div></body></html>";
  return html;
}

void setup() {
  Serial.begin(115200);
  
  // Configuración de Pines
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Empezar apagado (o HIGH si tu relé es de lógica inversa)
  
  dht.begin();

  // Conexión WiFi
  Serial.print("Conectando a ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi Conectado.");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());

  // Rutas del Servidor Web
  server.on("/", []() {
    server.send(200, "text/html", getHTML());
  });

  server.on("/toggle", []() {
    lightState = !lightState;
    digitalWrite(RELAY_PIN, lightState ? HIGH : LOW);
    server.sendHeader("Location", "/");
    server.send(303);
  });

  server.begin();
}

void loop() {
  server.handleClient();
  
  // Leer sensor cada 2 segundos
  static unsigned long lastTime = 0;
  if (millis() - lastTime > 2000) {
    lastTime = millis();
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    if (!isnan(t)) temperature = t;
    if (!isnan(h)) humidity = h;
  }
}
    `,
    type: 'code'
  },
  {
    id: 'upload',
    title: 'Cargar y Probar',
    content: `
      <ol>
        <li>Conecta el ESP32 al ordenador con el cable USB.</li>
        <li>En Arduino IDE, asegúrate de elegir el <strong>Puerto</strong> correcto (Herramientas > Puerto).</li>
        <li>Dale al botón de la flecha ➡️ (Subir).</li>
        <li>Si aparece "Connecting...", mantén pulsado el botón <strong>BOOT</strong> del ESP32 hasta que empiece a cargar.</li>
        <li>Cuando diga "Done uploading", abre el <strong>Monitor Serie</strong> (La lupa 🔍 arriba a la derecha).</li>
        <li>Pon la velocidad en <strong>115200 baud</strong>.</li>
        <li>Reinicia el ESP32 (Botón EN) y verás aparecer una <strong>Dirección IP</strong> (ej: 192.168.1.45).</li>
      </ol>
      <p><strong>¡FINAL!</strong> Abre el navegador de tu móvil conectado a la misma WiFi y escribe esa IP. ¡Verás tu aplicación de control!</p>
    `,
    type: 'success'
  }
];
