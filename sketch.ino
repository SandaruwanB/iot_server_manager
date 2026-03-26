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