START_TIME=$SECONDS

# exit when any command fails
set -e

# build packages
BUILD_NUMBER="0.0.$(date +%s)"
rm -rf /tmp/strings-build
/go/bin/strings build-packages $LEOPARD_HOME/strings.yml --output=/tmp/strings-build --build-number=$BUILD_NUMBER

# Upload javascript package to NPM
cd /tmp/strings-build/javascript
echo "registry=https://npm.infra.wish.com/" > ~/.npmrc
echo "//npm.infra.wish.com/:_authToken=\"$GITLAB_NPM_TOKEN\"" >> ~/.npmrc
npm publish --registry https://npm.infra.wish.com --verbose --scope=@ContextLogic

# bump package.json version
cd $LEOPARD_HOME
# TODO [lliepert]: is this correct for next js?
npm install -g yarn@1.7.0
yarn add "@ContextLogic/leopardstrings@${BUILD_NUMBER}"

# commit changes to git
git add -A
git commit -m "[localization] sync leopard translations-test"
git checkout -b tmp-branch

echo 'pushing to master'
git push origin tmp-branch:master

git checkout master
git branch -D tmp-branch

# push prometheus metrics
echo 'leopard_string_build_runtime_seconds' $((SECONDS-START_TIME)) | curl --data-binary @- http://pushgateway.infra.wish.com:9091/metrics/job/gitlab
echo 'leopard_string_build_last_success_timestamp' $(date -u +%s) | curl --data-binary @- http://pushgateway.infra.wish.com:9091/metrics/job/gitlab
