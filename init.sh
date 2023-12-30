#!/bin/bash

# Prompt the user for input
echo "Please enter your password: "

# Read user input and store it in a variable
read -s SSHPASS

# Set env variable
eval "export SSHPASS='$SSHPASS'"

node main.js