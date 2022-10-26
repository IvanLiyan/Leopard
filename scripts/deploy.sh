for i in "$@"
do
case $i in
    -s=*|--s3_bucket=*)
    S3_BUCKET="${i#*=}"
    shift # past argument=value
    ;;
    -c=*|--cloudfront_distribution_id=*)
    CLOUDFRONT_DISTRIBUTION_ID="${i#*=}"
    shift # past argument=value
    ;;
    --default)
    DEFAULT=YES
    shift # past argument with no value
    ;;
    *)
          # unknown option
    ;;
esac
done

echo "Checking AWS configuration..."
aws configure list

echo "Copy non-html build contents to S3"
aws s3 sync --delete --exclude "*.html" ./out s3://$S3_BUCKET/md

echo "Copy html build contents to S3"
for f in $(find out -name '*.html')
do
 tmp=${f#out/}
 cleaned=${tmp%.html}
 aws s3 cp $f s3://$S3_BUCKET/md/$cleaned --content-type "text/html"
done

# temp disabling cloudfront invalidation; have reached out to SRE to find the
# best way to do so for prod CF distrobution
# echo "Add cloudfront invalidation"
# aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --profile $AWS_SANDBOX_PROFILE
