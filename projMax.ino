#include <Wire.h>
#include "MAX30100_PulseOximeter.h"

#define REPORTING_PERIOD_MS 1000

PulseOximeter pox;
uint32_t tsLastReport = 0;

void onBeatDetected()
{
    Serial.println("Beat!");
}

void setup()
{
    Serial.begin(115200);

    if (!pox.begin())
    {
        Serial.println("FAILED");
        for (;;);
    }

    pox.setOnBeatDetectedCallback(onBeatDetected);
}

void loop()
{
    pox.update();

    if (millis() - tsLastReport > REPORTING_PERIOD_MS)
    {
        float bpm = pox.getHeartRate();
        float spo2 = pox.getSpO2();

        // Envia os dados no formato JSON pela Serial
        Serial.print("{\"bpm\":");
        Serial.print(bpm);
        Serial.print(",\"spo2\":");
        Serial.print(spo2);
        Serial.println("}");

        tsLastReport = millis();
    }
}
