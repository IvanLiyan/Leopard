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
yarn add --ignore-engines "@ContextLogic/leopardstrings@${BUILD_NUMBER}"

# commit changes to git
git add -A
git commit -m "[localization] sync leopard translations"
git checkout -b tmp-branch

echo 'fetching'
git fetch origin $CI_COMMIT_REF_NAME:refs/remotes/github/$CI_COMMIT_REF_NAME
git pull --rebase origin $CI_COMMIT_REF_NAME
echo 'pushing to CI_COMMIT_REF_NAME'
git push origin tmp-branch:$CI_COMMIT_REF_NAME

git checkout $CI_COMMIT_REF_NAME
git branch -D tmp-branch

# push prometheus metrics
echo 'leopard_string_build_runtime_seconds' $((SECONDS-START_TIME)) | curl --data-binary @- http://pushgateway.infra.wish.com:9091/metrics/job/gitlab
echo 'leopard_string_build_last_success_timestamp' $(date -u +%s) | curl --data-binary @- http://pushgateway.infra.wish.com:9091/metrics/job/gitlab
