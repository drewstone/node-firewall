import { promisify } from 'bluebird';
import { exec, execSync } from 'child_process';
import _ from 'lodash';

import {
  INITIAL_POLICY_COMMANDS,
  DNS_FORWARDING_COMMANDS,
  DCHP_FORWARDING_COMMANDS,
  PORT_WHITELISTING_COMMANDS,
  DOMAIN_WHITELISTING_COMMANDS,
  CAPTIVE_PORTAL_COMMANDS,
  ACCESS_GRANTING_COMMAND,
  ACCESS_REVOKING_COMMAND
} from './iptables';

const execCmd = promisify(exec);

export default class Firewall {
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
  constructor(options) {
    const captivePortalAddress = '192.168.24.1:80' || options.portal;
    const whitelistedDomains = ['www.sourcewifi.com'] || options.domains;
    const whitelistedPorts = ['8080'] || options.ports;

    INITIAL_POLICY_COMMANDS.forEach(execSync);
    DNS_FORWARDING_COMMANDS.forEach(execSync);
    _.flatten(whitelistedPorts.map(PORT_WHITELISTING_COMMANDS)).forEach(execSync);
    _.flatten(whitelistedDomains.map(DOMAIN_WHITELISTING_COMMANDS)).forEach(execSync);
    CAPTIVE_PORTAL_COMMANDS(captivePortalAddress).forEach(execSync);
  }

  /**
   * Grants access of a physical device to the network
   *
   * @param {String} macAddress: MAC Address of the device to authorize
   */
  grantAccess(macAddress) {
    return ACCESS_GRANTING_COMMAND(macAddress).forEach(execSync);
  }

  /**
   * Revokes access of a physical device to the network
   *
   * @param {String} macAddress: MAC Address of the device to unauthorize
   */
  revokeAccess(macAddress) {
    return ACCESS_REVOKING_COMMAND(macAddress).forEach(execSync);
  }

  /**
   * Retrieves MAC address of particular IP Address
   *
   * @param {String} ipAddress: IP Address
   */
  getMAC(ipAddress) {
    return execCmd(`sudo arp -a ${ipAddress} | cut -d " " -f 4`)
    .then(mac => mac.toString())
    .then(mac => mac.substring(0, mac.length - 1));
  }
}
