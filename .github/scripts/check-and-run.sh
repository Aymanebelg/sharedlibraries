#!/bin/bash

COMMAND=$1

# Determine the commit range
previous_commit=$(git rev-parse HEAD~1)
current_commit=$(git rev-parse HEAD)

echo "Checking changes between commits $previous_commit and $current_commit"

# Loop through all directories and check for changes
for folder in $(ls -d */ | cut -f1 -d'/'); do
  if git diff --name-only $previous_commit $current_commit | grep -q "^$folder/"; then
    echo "$folder has changed"
    echo "Running npm $COMMAND in $folder"
    cd $folder
    npm install
    npm run $COMMAND
    cd ..
  fi
done
