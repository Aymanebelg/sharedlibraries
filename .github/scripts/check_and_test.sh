#!/bin/bash
set -e

# Navigate to the sharedLibraries directory
cd sharedLibraries

# Loop through each folder in sharedLibraries
for dir in */ ; do
  # Check if there are any changes in the folder
  if git diff --quiet HEAD^ HEAD -- "$dir" ; then
    echo "No changes in $dir"
  else
    echo "Changes detected in $dir"
    # Navigate to the folder
    cd "$dir"

    # Run tests and coverage
    echo "Running tests for $dir"
    pytest --cov=. --cov-report=xml

    # Navigate back to sharedLibraries
    cd ..
  fi
done
