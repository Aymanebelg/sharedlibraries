#!/bin/bash

previous_commit=$1
current_commit=$2

echo "Checking changes between commits $previous_commit and $current_commit"
for folder in $(ls -d */ | cut -f1 -d'/'); do
  if git diff --name-only $previous_commit $current_commit | grep -q "^$folder/"; then
    echo "$folder has changed"
    echo "Running npm test in $folder"
    cd $folder
    npm install
    npm run test
    cd ..
  fi
done
