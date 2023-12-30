#!/bin/bash

# Prompt dell idrac racadm pass
echo "Enter racadm pass: "
read -s DELLPASS
eval "export DELLPASS='$DELLPASS'"

# Prompt esxi pass
echo "Enter esxi pass: "
read -s ESXIPASS
eval "export ESXIPASS='$ESXIPASS'"

node main.js