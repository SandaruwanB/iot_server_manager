#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"

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
    display.setTextColor(RED);
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
    
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("OLED failed"));
        while (true);
    }

    display.setTextColor(WHITE);
    playStartAnime();
}

void void loop() {
    
}