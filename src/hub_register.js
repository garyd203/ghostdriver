/*
This file is part of the GhostDriver project from Neustar inc.

Copyright (c) 2012, Ivan De Marino <ivan.de.marino@gmail.com / detronizator@gmail.com>
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
      this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice,
      this list of conditions and the following disclaimer in the documentation
      and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* generate node configuration for this node */
var nodeconf = function(hostUrl, hub){
  var ref$, hostPort, hubHost, hubPort;
  ref$ = hostUrl.match(/([\w\d\.]+):(\d+)/), hostPort = ref$[2];
  ref$ = hub.match(/([\w\d\.]+):(\d+)/), hubHost = ref$[1], hubPort = ref$[2];
  hubPort = +hubPort;
  return {
    capabilities: [{
      browserName: "phantomjs",
      // Note that multiple webdriver sessions or instances within a single
      // Ghostdriver process will interact in unexpected and undesirable
      // ways. Hence we limit both sessions and instances to 1. If you
      // require more than this, then you should start multiple Ghostdriver
      // instances.
      maxInstances: 1,
      seleniumProtocol: "WebDriver"
    }],
    configuration: {
      hub: hub,
      hubHost: hubHost,
      hubPort: hubPort,
      port: hostPort,
      proxy: "org.openqa.grid.selenium.proxy.DefaultRemoteProxy",
      // We only allow a single session. See the discussion above on
      // maxInstances.
      maxSession: 1,
      register: true,
      registerCycle: 5000,
      role: "wd",
      // NB: I think url is a backward-compatible version of remoteHost, for selenium grid hubs on something earlier than v2.9
      url: hostUrl,
      remoteHost: hostUrl
    }
  };
};

module.exports = {
  register: function(hostUrl, hub){
    var page = require('webpage').create();
    if (!hub.match(/\/$/)) {
      hub += '/';
    }

    /* Register with selenium grid server */
    page.open(hub + 'grid/register', {
      operation: 'post',
      data: JSON.stringify(nodeconf(hostUrl, hub)),
      headers: {
        'Content-Type': 'application/json'
      }
    }, function(status){
      if (status !== 'success') {
        return console.log("Unable to register with grid " + hub + ": " + status);
      } else {
        return console.log(("registered with grid hub: " + hub) + page.content);
      }
    });
  }
};
