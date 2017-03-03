Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PORT_WHITELISTING_COMMANDS = PORT_WHITELISTING_COMMANDS;
exports.DOMAIN_WHITELISTING_COMMANDS = DOMAIN_WHITELISTING_COMMANDS;
exports.CAPTIVE_PORTAL_COMMANDS = CAPTIVE_PORTAL_COMMANDS;
exports.ACCESS_GRANTING_COMMAND = ACCESS_GRANTING_COMMAND;
exports.ACCESS_REVOKING_COMMAND = ACCESS_REVOKING_COMMAND;
/**
 * Commands relevant for configuring IPTables on a Linux based router
 * to act as a hotspot over a wired access point. It manages captive portal
 * configuration upon connecting to the hotspot and exposes commands
 * for adding and removing access to the wireless network.
 */

var INITIAL_POLICY_COMMANDS = exports.INITIAL_POLICY_COMMANDS = ['sudo iptables -t filter -N SOURCE_PASS;' + 'sudo iptables -t filter -A FORWARD -j SOURCE_PASS;' + 'sudo iptables -t filter -A SOURCE_PASS -d 192.168.24.1 -j ACCEPT;' + 'sudo iptables -t filter -A FORWARD -d 192.168.24.1 -j ACCEPT;' + 'sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE;' + 'sudo iptables -t filter -P FORWARD DROP;' + 'sudo iptables -A FORWARD -i eth0 -o wlan0 -m state --state RELATED,ESTABLISHED -j ACCEPT'];

var DNS_FORWARDING_COMMANDS = exports.DNS_FORWARDING_COMMANDS = ['sudo iptables -t filter -I FORWARD -p udp --dport 53 -j ACCEPT;', 'sudo iptables -t filter -I FORWARD -p udp --sport 53 -j ACCEPT;'];

var DHCP_FORWARDING_COMMANDS = exports.DHCP_FORWARDING_COMMANDS = ['sudo iptables -t filter -I FORWARD -p udp --dport 67 -j ACCEPT;', 'sudo iptables -t filter -I FORWARD -p udp --sport 67 -j ACCEPT;'];

function PORT_WHITELISTING_COMMANDS(port) {
  return ['sudo iptables -t filter -I FORWARD -p tcp --dport ' + String(port) + ' -j ACCEPT;', 'sudo iptables -t filter -I FORWARD -p tcp --sport ' + String(port) + ' -j ACCEPT;'];
};

function DOMAIN_WHITELISTING_COMMANDS(domain) {
  return ['sudo iptables -t filter -I FORWARD -p tcp --dest ' + String(domain) + ' -j ACCEPT;', 'sudo iptables -t filter -I FORWARD -p tcp --src ' + String(domain) + ' -j ACCEPT;'];
};

function CAPTIVE_PORTAL_COMMANDS(captivePortalAddress) {
  return ['sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination ' + String(captivePortalAddress) + ';', 'sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 443 -j DNAT --to-destination ' + String(captivePortalAddress) + ';'];
};

function ACCESS_GRANTING_COMMAND(mac) {
  return ['sudo iptables -t filter -A SOURCE_PASS -m mac --mac-source ' + String(mac) + ' -j ACCEPT;', 'sudo iptables -t nat -I PREROUTING -m mac --mac-source ' + String(mac) + ' -j RETURN;'];
};

function ACCESS_REVOKING_COMMAND(mac) {
  return 'sudo iptables -t filter -D SOURCE_PASS -m mac --mac-source ' + String(mac) + ' -j ACCEPT;';
};