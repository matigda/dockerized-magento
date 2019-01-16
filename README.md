docker swarm init

docker stack deploy -c docker-compose.yml magento

cat data/mysql/backup.sql | docker exec -i NAZWA_MYSQL_KONTENERA /usr/local/mysql/bin/mysql -u root --password=pw
