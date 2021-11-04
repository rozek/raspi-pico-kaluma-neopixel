# raspi-pico-kaluma-neopixel #

Neopixel/WS2812 driver for Raspberry Pi Pico running Kaluma

The [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) is a cheap (but powerful) microcontroller board from Raspberry Pi (important: the Raspberry Pi Pico does _not_ run Linux). [Kaluma](https://kaluma.io/) is a JavaScript runtime for the RasPi Pico with a web-based IDE, which may be run on any modern browser that supports the "Web Serial API" (important: you do not have to sign-in in order to use the IDE)

Surprisingly, Kaluma does not yet have a library that may be used to drive [Neopixel](https://learn.adafruit.com/adafruit-neopixel-uberguide/the-magic-of-neopixels) displays (or other strips of WS2812 LEDs) - this little contribution shall fill this gap.

> Just a small note: if you like this work and plan to use it, consider "starring" this repository (you will find the "Star" button on the top right of this page), so that I know which of my repositories to take most care of.

## Technical Background ##

This code uses the first of the "Serial Programming Interfaces" (SPI) the RasPi Pico provides. With proper timing, such an SPI can be used to drive Neopixel displays (or compatible LED strips) - [ioprog](https://ioprog.com/) has a good [article describing the technical background](https://ioprog.com/2016/04/09/stm32f042-driving-a-ws2812b-using-spi/).

#### MOSI only ####

From the possible signals an SPI provides, only "Master Out Slave In" (MOSI) is used. The RasPi Pico allows that signal to be routed to multiple output pins (but not to _any_ of them): in this example, pin GP19 has been chosen - others may work as well (such as pin GP3), but you will have to test yourself.

#### Connecting a LED Stripe ####

Sometimes, LED stripes (which assume to be powered with 5V) may be directly wired to the RasPi Pico output pin (which provides 3v3 levels only) but usually, such a connection does not work reliably and may produce wrong LED patterns from time to time.

In such a case, a level shifter should be inserted between RasPi Pico and LED Stripe. This device does not have to be bidirectional but definitely must be fast since communication effectively runs with 800kHz. For that reason, a dedicated level shifting chip should be used (instead of the brilliant and, thus, widely used circuit consisting of a simple MOSFET and two resistors only). If it still has to be the latter one, you may try to "short-circuit" the MOSFET with a small ceramic capacitor (e.g., 22pF) but success is not guaranteed.

#### Memory Consumption ####

Internally, the driver allocates 3 bytes per Neopixel data byte in order to prepare the bit pattern to be sent through the SPI - thus, for each RGB LED a total of 9 bytes is used internally.

#### Byte Order ####

The library directly supports linear stripes as well as matrices wired in zigzag fashion. The assumed byte order of connected LEDs is GRB - but you do not have to care and may specify any color values in RGB order.

## API ##

The "library" consists of a single function `SPIDisplay` which should be invoked to setup a driver for a given MOSI pin and LED geometry: 

* **`SPIDisplay (Pin, Width, Height)`**<br>prepares an internal display storage for a LED matrix with the given dimension (omit `Height` if you have a linear stripe only) which is connected to the given `Pin` (set `Pin` to `null` if you want to use the default)

The output of this function is an object containing a few methods which may be used to prepare a display and send it to the LED stripe.

* **`clear ()`**<br>fills the internal display storage with the SPI bit pattern for dark LEDs
* **`setPixelRGB (x,y, R,G,B)`**<br>sets the LED at the given coordinate (`x = 0...Width-1, y = 0...Height-1`) to the given RGB values (`R = 0...255, G = 0...255, B = 0...255`)
* **`setPixelHSL (x,y, H,S,L)`**<br>sets the LED at the given coordinate (`x = 0...Width-1, y = 0...Height-1`) to RGB values which correspond to the given "Hue" (`H = 0...1`), "Saturation" (`S = 0...1`) and "Luminosity" (`L = 0...1`) values. Internally, this method uses the same conversion as `HSLtoRGB` and has been provided for your convenience only
* **`HSLtoRGB (H,S,L)`**<br>converts the given "Hue" (`H = 0...1`), "Saturation" (`S = 0...1`) and "Luminosity" (`L = 0...1`) values to corresponding RGB values (`R = 0...255, G = 0...255, B = 0...255`) and returns them as an array. The same conversion is also used by `setPixelHSL`, but has been provided as a separate method in case that you want to process the resulting RGB values further
* **`show ()`**<br>sends the current contents of the internal display storage to the connected LED stripe

## Usage ##

In the simplest case, the contents of file `SPIDisplay.js` may just be copied into the Kaluma Web IDE and your code added below:

```
// <<<< insert SPIDisplay.js here

let Display = SPIDisplay(null, 16,16);
  Display.clear();

  Display.setPixelRGB(0,0, 16,0,0); // red
  Display.setPixelRGB(2,0, 0,16,0); // green
  Display.setPixelRGB(4,0, 0,0,16); // blue
Display.show();
```

## Tests and Examples ##

The following tests assume a LED string connected to Pin 19. Just copy them into your clipboard, paste them into the Kaluma Web IDE and "Upload":

* **`RGB-Test.js`**<br>sets pixel 0 to red, pixel 2 to green, 4 to blue and pixel 10 to yellow, 12 to magenta, 14 to cyan
* **`HSL-Test.js`**<br>fills pixels 0...15 with different colors

All examples assume a 16x16 RGB LED matrix connected to Pin 19. Just copy them into your clipboard, paste them into the Kaluma Web IDE and "Upload":

* **`Intensity-Test-linear-non-dimmed.js`**<br>fills a 16x16 LED matrix with a variety of colors and a linearly increasing intensity ranging from 0 to maximum
* **`Intensity-Test-linear-dimmed.js`**<br>fills a 16x16 LED matrix with a variety of colors and a linearly increasing intensity ranging from 0 to 1/16th of the potential maximum
* **`Intensity-Test-non-linear-non-dimmed.js`**<br>fills a 16x16 LED matrix with a variety of colors and a quadratically increasing intensity ranging from 0 to maximum
* **`Intensity-Test-non-linear-dimmed.js`**<br>fills a 16x16 LED matrix with a variety of colors and a quadratically increasing intensity ranging from 0 to 1/16th of the potential maximum

## License ##

[MIT License](LICENSE.md)
