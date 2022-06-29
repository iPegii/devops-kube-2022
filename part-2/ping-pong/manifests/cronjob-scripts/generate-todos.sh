#!/bin/sh
ls

website_headers=$(curl -I https://en.wikipedia.org/wiki/Special:Random | grep location)
filter=$(echo "$website_headers" | sed 's/location: //g')

echo "$website_headers"
echo "$filter"


kubectl exec -it -n project-namespace stateful-postgres-0 -- bash -c "psql -h localhost -U pegi-admin -p 5432 -d kubernetes-database -c \"INSERT INTO todos(todo) VALUES ('$filter');\""