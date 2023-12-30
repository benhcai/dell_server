module.exports = [
  "exit",
  'printf "$DELLPASS $ESXIPASS"',
  " SSHPASS=$DELLPASS sshpass -e ssh root@192.168.2.120 'racadm serveraction powerup'",
  " SSHPASS=$DELLPASS sshpass -e ssh root@192.168.2.120 'racadm serveraction graceshutdown'",
  " SSHPASS=$DELLPASS sshpass -e ssh root@192.168.2.120 'racadm get system.Power.Realtime.Power'",
  " SSHPASS=$ESXIPASS sshpass -e ssh root@192.168.2.130 'vim-cmd vmsvc/getallvms'",
  " SSHPASS=$ESXIPASS sshpass -e ssh root@192.168.2.130 'vim-cmd vmsvc/power.getstate 1'",
  " SSHPASS=$ESXIPASS sshpass -e ssh root@192.168.2.130 'vim-cmd vmsvc/power.on 1'",
  " SSHPASS=$ESXIPASS sshpass -e ssh root@192.168.2.130 'vim-cmd vmsvc/power.off 1'",
];
