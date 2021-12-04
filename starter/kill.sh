#lsof -i:3000 |tail -1 |awk '{ print $2 }'| xargs kill -9 
sudo pkill node && echo 'killled '
