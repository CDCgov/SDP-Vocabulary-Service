#!/bin/bash
cd /opt/app-root/src/rakeLogs

  if [ -e /opt/app-root/src/rakeLogs/rake.log ]
    then
      rm -f /opt/app-root/src/rakeLogs/rake.log
      echo "Removing Rake log from last run."
    fi

bundle exec rake admin:sync_phinvads_vs[admin@sdpv.local] > rake.log
  if [ -e /opt/app-root/src/rakeLogs/rake.log ]
    then
      echo "Rake log exists"
        rakeLogExist=true
  else
      echo "Rake log does not exists"
  fi
