# raspi-pico-kaluma-neopixel #

Neopixel driver for Raspberry Pi Pico running Kaluma

The [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) is a cheap (but powerful) microcontroller board from Raspberry Pi (important: the Raspberry Pi Pico does _not_ run Linux). [Kaluma](https://kaluma.io/) is a JavaScript runtime for the Raspi Pico with a web-based IDE, which may be run on any modern browser that supports the "Web Serial API" (important: you do not have to sign-in in order to use the IDE)

Surprisingly, Kaluma does not yet have a library that may be used to drive Neopixel displays (i.e., strings of WS2812 LEDs) - this little contribution shall fill this gap.
