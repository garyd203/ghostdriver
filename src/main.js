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

// Load dependencies
// NOTE: We need to provide PhantomJS with the "require" module ASAP. This is a pretty s**t way to load dependencies
var ghostdriver = {
        system : require('system'),
        hub    : require('./hub_register')
    },
    server = require('webserver').create(),
    router,
    parseURI;

// Enable "strict mode" for the 'parseURI' library
parseURI = require("./third_party/parseuri.js");
parseURI.options.strictMode = true;

phantom.injectJs("session.js");
phantom.injectJs("request_handlers/request_handler.js");
phantom.injectJs("request_handlers/status_request_handler.js");
phantom.injectJs("request_handlers/shutdown_request_handler.js");
phantom.injectJs("request_handlers/session_manager_request_handler.js");
phantom.injectJs("request_handlers/session_request_handler.js");
phantom.injectJs("request_handlers/webelement_request_handler.js");
phantom.injectJs("request_handlers/router_request_handler.js");
phantom.injectJs("webelementlocator.js");

// HTTP Request Router
router = new ghostdriver.RouterReqHand();

// Start the server
//TODO update header comments
var hostUrl, hostPort;
var hostParam = ghostdriver.system.args[1];

if (hostParam) {
  console.log("URL:" + hostParam);
  if (hostParam.match(/^(\d+)$/)) {
    // Only port was supplied
      hostPort = parseInt(hostParam, 10);
      hostUrl = "http://127.0.0.1:" + hostPort + "/";
  } else {
    // Full host name was supplied
    hostUrl = hostParam;
    hostPort = parseInt(hostParam.match(/([\w\d\.]+):(\d+)/)[2], 10);
  }
} else {
  hostPort = 8080;
  hostUrl = "http://127.0.0.1:" + hostPort + "/";
}

if (server.listen(hostPort, router.handle)) {
    console.log('Ghost Driver running on port ' + server.port);
    var reg = ghostdriver.hub.register;
    if (ghostdriver.system.args[2]) {
        reg(hostUrl, ghostdriver.system.args[2]);
        console.log('Selenium Grid hub will send commands to Ghost Driver listening for webdriver commands on ' + hostUrl);
    }
} else {
    console.error("ERROR: Could not start Ghost Driver");
    phantom.exit();
}
