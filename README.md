![Logo](admin/batteryload.png)
# ioBroker.batteryload

[![NPM version](http://img.shields.io/npm/v/iobroker.batteryload.svg)](https://www.npmjs.com/package/iobroker.batteryload)
[![Downloads](https://img.shields.io/npm/dm/iobroker.batteryload.svg)](https://www.npmjs.com/package/iobroker.batteryload)
![Number of Installations (latest)](http://iobroker.live/badges/batteryload-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/batteryload-stable.svg)
[![Dependency Status](https://img.shields.io/david/liv-in-sky/iobroker.batteryload.svg)](https://david-dm.org/liv-in-sky/iobroker.batteryload)
[![Known Vulnerabilities](https://snyk.io/test/github/liv-in-sky/ioBroker.batteryload/badge.svg)](https://snyk.io/test/github/liv-in-sky/ioBroker.batteryload)

[![NPM](https://nodei.co/npm/iobroker.batteryload.png?downloads=true)](https://nodei.co/npm/iobroker.batteryload/)

## batteryload adapter for ioBroker

read batt level of sensors

## Developer manual
This section is intended for the developer. It can be deleted later

### Getting started


### Publishing the adapter
To get your adapter released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a tarball from your dev directory:  
    ```bash
    npm pack
    ```
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
    ```bash
    cd /opt/iobroker
    npm i /path/to/tarball.tgz
    ```

For later updates, the above procedure is not necessary. Just do the following:
1. Overwrite the changed files in the adapter directory (`/opt/iobroker/node_modules/iobroker.batteryload`)
1. Execute `iobroker upload batteryload` on the ioBroker host

## Changelog

### 0.0.1
* (liv-in-sky) initial release

## License
MIT License

Copyright (c) 2020 liv-in-sky <liv-in-sky@online.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.