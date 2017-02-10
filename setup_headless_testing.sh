#!/bin/bash
echo "This setup script was written for Ubuntu 16.04.1 and may not work elsewhere."
echo "Updating system ..."
sudo apt-get update -qq
echo "Adding requisite QtWebkit libs ..."
sudo apt-get install libqt4-dev libqtwebkit-dev -y -qq
echo "Installing XVFB (headless GUI for Firefox) ..."
sudo apt-get install xvfb -y -qq
echo "Installation complete."
