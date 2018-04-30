mongo ${1:-echr2} --eval "db.evidences.remove({})"

export DBHOST=mongodb
export DATABASE_NAME=${1:-echr2}
export ELASTICSEARCH_URL=http://elasticsearch:9200
export INDEX_NAME=${1:-echr2}

./reindex.sh
