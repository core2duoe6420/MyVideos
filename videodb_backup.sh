#!/bin/bash

BACKUP_FILE=/root/videodb.sql
DATE=$(date +%F)
RECEIVER=core2duoe6420@qq.com

mysqldump videodb > $BACKUP_FILE

echo "$DATE" | mail -s "$DATE videodb" -a $BACKUP_FILE $RECEIVER

rm -f $BACKUP_FILE
