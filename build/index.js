Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _child_process = require('child_process');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _iptables = require('./iptables');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var execCmd = (0, _bluebird.promisify)(_child_process.exec);

var Firewall = function () {
  /**
   * Constructor for firewall for controlling Linux based router from
   * a NodeJS server. Should initialize wireless router's hotspot sharing
   * as well as whitelisting settings on startup.
   *
   * @param {Object} options: Configuration settings for firewall
   * @param {String} options.portal: Port/IP combination of captive portal
   * @param {[String]} options.domains: Whitelisted domain names
   * @param {[String]} options.ports: Whitelisted ports
   */
  function Firewall(options) {
    _classCallCheck(this, Firewall);

    var captivePortalAddress = '192.168.24.1:80' || options.portal;
    var whitelistedDomains = ['www.sourcewifi.com'] || options.domains;
    var whitelistedPorts = ['8080'] || options.ports;

    _iptables.INITIAL_POLICY_COMMANDS.forEach(_child_process.execSync);
    _iptables.DNS_FORWARDING_COMMANDS.forEach(_child_process.execSync);
    _lodash2['default'].flatten(whitelistedPorts.map(_iptables.PORT_WHITELISTING_COMMANDS)).forEach(_child_process.execSync);
    _lodash2['default'].flatten(whitelistedDomains.map(_iptables.DOMAIN_WHITELISTING_COMMANDS)).forEach(_child_process.execSync);
    (0, _iptables.CAPTIVE_PORTAL_COMMANDS)(captivePortalAddress).forEach(_child_process.execSync);
  }

  /**
   * Grants access of a physical device to the network
   *
   * @param {String} macAddress: MAC Address of the device to authorize
   */


  _createClass(Firewall, [{
    key: 'grantAccess',
    value: function () {
      function grantAccess(macAddress) {
        return (0, _iptables.ACCESS_GRANTING_COMMAND)(macAddress).forEach(_child_process.execSync);
      }

      return grantAccess;
    }()

    /**
     * Revokes access of a physical device to the network
     *
     * @param {String} macAddress: MAC Address of the device to unauthorize
     */

  }, {
    key: 'revokeAccess',
    value: function () {
      function revokeAccess(macAddress) {
        return (0, _iptables.ACCESS_REVOKING_COMMAND)(macAddress).forEach(_child_process.execSync);
      }

      return revokeAccess;
    }()

    /**
     * Retrieves MAC address of particular IP Address
     *
     * @param {String} ipAddress: IP Address
     */

  }, {
    key: 'getMAC',
    value: function () {
      function getMAC(ipAddress) {
        return execCmd('sudo arp -a ' + String(ipAddress) + ' | cut -d " " -f 4').then(function (mac) {
          return mac.toString();
        }).then(function (mac) {
          return mac.substring(0, mac.length - 1);
        });
      }

      return getMAC;
    }()
  }]);

  return Firewall;
}();

exports['default'] = Firewall;