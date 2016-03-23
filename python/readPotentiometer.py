#Python Systemklasse importieren
import sys
import imp
#Python Timerklasse importieren
import time

print imp.find_module('RPi')
    #Python Raspberry Pi GPIO Klasse importieren
    #import RPi.GPIO as GPIO

# Festlegung der Nutzung der vorgegebenen Nummerierung der GPIOs
GPIO.setmode(GPIO.BCM)

# Namen von True und False zum besseren Verstaendnis festlegen (Klarnamen)
HIGH = True  # 3,3V Pegel (high)
LOW  = False # 0V Pegel (low)

# SCI Funktion
def getAnalogData(adCh, CLKPin, DINPin, DOUTPin, CSPin):
    # Pegel definieren
    GPIO.output(CSPin,   HIGH)    
    GPIO.output(CSPin,   LOW)
    GPIO.output(CLKPin, LOW)
        
    cmd = adCh
    cmd |= 0b00011000 # Kommando zum Abruf der Analogwerte des Datenkanals adCh

    # Bitfolge senden
    for i in range(5):
        if (cmd & 0x10): # 4. Bit pruefen und mit 0 anfangen
            GPIO.output(DINPin, HIGH)
        else:
            GPIO.output(DINPin, LOW)
        # Clocksignal negative Flanke erzeugen   
        GPIO.output(CLKPin, HIGH)
        GPIO.output(CLKPin, LOW)
        cmd <<= 1 # Bitfolge eine Position nach links verschieben
            
    # Datenabruf
    adchvalue = 0 # Wert auf 0 zuruecksetzen
    for i in range(11):
        GPIO.output(CLKPin, HIGH)
        GPIO.output(CLKPin, LOW)
        adchvalue <<= 1 # 1 Postition nach links schieben
        if(GPIO.input(DOUTPin)):
            adchvalue |= 0x01
    time.sleep(0.5)
    return adchvalue

# Konfiguration Eingangskanal und GPIOs
if (len(sys.argv) < 2): # Analog/Digital-Channel
    CH = 0
else:
    CH = sys.argv[1]
CLK     = 18 # Clock
DIN     = 24 # Digital in
DOUT    = 23  # Digital out
CS      = 25  # Chip-Select

# Pin-Programmierung
GPIO.setup(CLK, GPIO.OUT)
GPIO.setup(DIN, GPIO.OUT)
GPIO.setup(DOUT, GPIO.IN)
GPIO.setup(CS,   GPIO.OUT)

while True:
    print getAnalogData(CH, CLK, DIN, DOUT, CS)
