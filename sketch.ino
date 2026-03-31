#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"
#include <WiFi.h>

#define WIFI_SSID "Sandaruwan's iPhone"
#define WIFI_PASS "sandaru119"

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define ONE_WIRE_BUS 4
#define DHTPIN 23
#define DHTTYPE DHT22

#define RACK_X 8
#define RACK_Y 11
#define RACK_W 112
#define RACK_H 50

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht(DHTPIN, DHTTYPE);
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void rackDrawing (bool isInverted) {
    display.setTextSize(1);
    if (isInverted) {
        display.fillRect(0, 0, SCREEN_WIDTH, 10, WHITE);
        display.setTextColor(BLACK);
    }
    display.setCursor(14, 1);
    display.print(F("[ NAF SERVERS ]"));
    display.setTextColor(INVERSE);
    display.drawRect(RACK_X, RACK_Y, RACK_W, RACK_H, WHITE);
}


void slotDrawing (int i, bool isOnline){
    const int y = RACK_Y + 2 + i * 12;
    display.drawRect(RACK_X + 4, y, RACK_W - 8, 10, WHITE);
    display.fillRect(RACK_X + 8, y + 3, 4, 4, isOnline ? WHITE : BLACK);

    if (!isOnline) display.drawRect(RACK_X + 8, y + 3, 4, 4, WHITE);
    display.setCursor(RACK_X + 16, y + 2);
    display.print(F("SV-"));
    display.print(i + 1);

    if (isOnline) {
        display.fillRect(RACK_X + RACK_W - 20, y + 3, 14, 4, WHITE);
    } else {
        display.drawRect(RACK_X + RACK_W - 20, y + 3, 14, 4, WHITE);
    }
}

void drawWifiIcon(int16_t x, int16_t y, bool connected) {
    int16_t cx = x + 7;
    int16_t cy = y + 9;

    display.drawCircle(cx, cy, 8, WHITE); // outer arc
    display.drawCircle(cx, cy, 5, WHITE); // mid arc
    display.fillCircle(cx, cy, 2, WHITE); // dot
    display.fillRect(cx - 8, cy, 17, 10, BLACK); // mask bottom half

    if (!connected) {
        display.drawLine(x, y + 8, x + 14, y, WHITE); // strike-through
    }
}

void playStartAnime () {
    // rack frame and title
    display.clearDisplay();
    rackDrawing(false);
    display.display();
    delay(500);

    // slots
    for (int i = 0; i < 4; i++) {
        slotDrawing(i, false);
        display.display();
        delay(250);
    }
    delay(200);

    // slot blinking
    for (int b = 0; b < 4; b++) {
    display.clearDisplay();
    rackDrawing(false);
    for (int i = 0; i < 4; i++) slotDrawing(i, b % 2 == 0);
        display.display();
        delay(180);
    }

    // slots full color
    display.clearDisplay();
    rackDrawing(true);
    for (int i = 0; i < 4; i++) { 
        slotDrawing(i, true);
    }
    display.display();
    delay(1000);
}

void setup() {
    Serial.begin(115200);

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    Serial.print(F("Connecting to WiFi"));
    unsigned long wifiStart = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - wifiStart < 10000) {
        delay(500);
        Serial.print('.');
    }
    Serial.println();
    if (WiFi.status() == WL_CONNECTED) {
        Serial.print(F("Connected. IP: "));
        Serial.println(WiFi.localIP());
    } else {
        Serial.println(F("WiFi timeout. Skipping."));
    }

    dht.begin();
    sensors.begin();
    
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("OLED failed"));
        while (true);
    }

    display.setTextColor(WHITE);
    playStartAnime();
}

void loop() {
    const float dhtTemp = dht.readTemperature();
    const float dhtHum = dht.readHumidity();
    const int sensorCount = sensors.getDeviceCount();

    sensors.requestTemperatures();
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.println(F("Sensor Data"));
    drawWifiIcon(113, 0, WiFi.status() == WL_CONNECTED);

    for (int i = 0; i < 4; i++) {
        display.setCursor(0, (i + 1) * 10);
        display.print('S');
        display.print(i);
        display.print('T');
        if (i < sensorCount) {
            const float tempC = sensors.getTempCByIndex(i);
            if (tempC == DEVICE_DISCONNECTED_C) {
                display.println(F(": Err"));
            } else {
                display.print(F(": "));
                display.print(tempC, 2);
                display.drawCircle(display.getCursorX() + 2, display.getCursorY() + 1, 2, WHITE);
                display.setCursor(display.getCursorX() + 6, display.getCursorY());
                display.print('C');
            }
        }
    }

    display.setCursor(0, 50);
    if (isnan(dhtTemp) || isnan(dhtHum)) {
        display.println(F("DHT Error"));
    } else {
        display.print(F("DHT: "));
        display.print(dhtTemp, 2);
        display.drawCircle(display.getCursorX() + 2, display.getCursorY() + 1, 2, WHITE);
        display.setCursor(display.getCursorX() + 6, display.getCursorY());
        display.println(F("C"));

        display.print(F("DHH: "));
        display.print(dhtHum, 2);
        display.println(F("%"));
    }

    display.display();
    delay(1000);
}