# raspi-pico-kaluma-neopixel #

Neopixel driver for Raspberry Pi Pico running Kaluma

The [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) is a cheap (but powerful) microcontroller board from Raspberry Pi (important: the Raspberry Pi Pico does _not_ run Linux). [Kaluma](https://kaluma.io/) is a JavaScript runtime for the Raspi Pico with a web-based IDE, which may be run on any modern browser that supports the "Web Serial API" (important: you do not have to sign-in in order to use the IDE)

Surprisingly, Kaluma does not yet have a library that may be used to drive [Neopixel](https://learn.adafruit.com/adafruit-neopixel-uberguide/the-magic-of-neopixels) displays (or other strips of WS2812 LEDs) - this little contribution shall fill this gap.

> Just a small note: if you like this work and plan to use it, consider "starring" this repository (you will find the "Star" button on the top right of this page), so that I know which of my repositories to take most care of.

## Technical Background ##

This code uses the first of the "Serial Programming Interfaces" (SPI) the Raspi Pico provides. With proper timing, such an SPI can be used to drive Neopixel displays (or compatible LED strips) - [ioprog](https://ioprog.com/) has a good [article describing the technical background](https://ioprog.com/2016/04/09/stm32f042-driving-a-ws2812b-using-spi/).

#### MOSI only ####

From the possible signals an SPI provides, only "Master Out Slave In" (MOSI) is used. The Raspi Pico allows that signal to be routed to multiple output pins (but not to _any_ of them): in this example, pin 19 has been chosen - others may work as well, but you will have to test yourself.

#### Connecting an LED Stripe ####

Sometimes, LED stripes (which assume to be powered with 5V) may be directly wired to the Raspi Pico output pin (which provides 3v3 levels only) but usually, such a connection does not work reliably and may produce wrong LED patterns from time to time.

In such a case, a level shifter should be inserted between Raspi Pi and LED Stripe. This device does not have to be bidirectional but definitely must be fast since communication effectively runs with 800kHz. For that reason, a dedicated level shifting chip should be used (instead of the widely used - because ingenious - circuit consisting of a simple MOSFET and two resistors). If it still has to be the latter one, you may try to "shorten" the MOSFET with a small ceramic capacitor (e.g., 22pF) but success is not guaranteed.

#### Memory Consumption ####

Internally, the driver allocates 3 bytes per Neopixel data byte in order to prepare the bit pattern to be sent through the SPI - thus, for each RGB LED a total of 9 bytes is used internally.

#### Byte Order ####

The library directly supports linear stripes as well as matrices wired in zigzag fashion. The assumed byte order of connected LEDs is GRB - but you do not have to care and may specify any color values in RGB order.

## API ##



## Usage ##



## License ##

[MIT License](LICENSE.md)
