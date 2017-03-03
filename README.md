# node-firewall
Node-firewall configures the access control policies of a Linux based
router that has been configured to act as a shared wireless hotspot. It
interfaces directly with IPTables and is easily extendable to allow a user
control over their router from a NodeJS server.

Files are compiled down to ES5 for compatibility reasons. If you can run ES6,
it suffices to change the `main` field of `package.json` to `./src/index.js`.
