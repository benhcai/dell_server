module.exports = [
  "exit",
  "printf $SSHPASS",
  "sshpass -e ssh root@192.168.2.120 'racadm serveraction powerup'",
  "sshpass -e ssh root@192.168.2.120 'racadm serveraction graceshutdown'",
  "sshpass -e ssh root@192.168.2.120 'racadm get system.Power.Realtime.Power'",
];
