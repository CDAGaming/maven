#!/bin/bash
node update-json
node update-latest
read -p "Press enter to continue"
git add -A
git commit -m "Automatic push"
git push origin master
echo Done
