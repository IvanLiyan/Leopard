for i in "$@"
do
case $i in
    -s=*|--s3_bucket=*)
    S3_BUCKET="${i#*=}"
    shift # past argument=value
    ;;
    *) # unknown option
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
 aws s3 cp $f s3://$S3_BUCKET/md/$cleaned --content-type "text/html" --cache-control "no-cache"
done
