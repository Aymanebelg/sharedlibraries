#!/bin/bash

previous_commit=$1
current_commit=$2

echo "Checking changes between commits $previous_commit and $current_commit"
changed_folders=()
for folder in $(ls -d */ | cut -f1 -d'/'); do
  if git diff --name-only $previous_commit $current_commit | grep -q "^$folder/"; then
    changed_folders+=("$folder")
  fi
done

# Return the list of changed folders as a newline-separated string
IFS=$'\n' echo "${changed_folders[*]}"
