@echo off
node update-json
node update-latest
pause
git add -A
git commit -m "Automatic push"
git push origin master
echo Done
pause
