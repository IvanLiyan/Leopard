#!/bin/bash

echo "This process may take a few minutes. Please wait until you see \"Done\"."
echo ""

echo "installing pre-commit..."
if [[ $OSTYPE == 'darwin'* ]]; then
  brew install pre-commit
else
  pip install pre-commit
fi
pre-commit install

# set git to check the .githooks dir for hooks instead of .git/hooks
# we use this to share hooks across the team
echo "setting core.hooksPath..."
git config core.hooksPath .githooks
mv .git/hooks/pre-commit .githooks/
chmod ug+x .githooks/*

# create certs required for HTTPS
echo "setting up certs..."
yarn install
node scripts/create-certs

echo "Done"
