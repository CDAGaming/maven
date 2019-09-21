@echo off
node update-json
node update-latest
cd marketplace
node update 
cd ..
::git add -A
::git commit -m "Automatic push"
::git push origin master
echo Done
pause
