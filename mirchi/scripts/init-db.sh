set -e

psql -c "DROP DATABASE IF EXISTS telegaram;"
psql -c "CREATE DATABASE telegaram;"
