for i in "$@"
do
case $i in
    -d=*|--lambda_default=*)
    LAMBDA_DEFAULT="${i#*=}"
    shift # past argument=value
    ;;
    -a=*|--lambda_api=*)
    LAMBDA_API="${i#*=}"
    shift # past argument=value
    ;;
    -s=*|--s3_bucket=*)
    S3_BUCKET="${i#*=}"
    shift # past argument=value
    ;;
    -c=*|--cloudfront_distribution_id=*)
    CLOUDFRONT_DISTRIBUTION_ID="${i#*=}"
    shift # past argument=value
    ;;
    # environment
    -e=*|--environment=*)
    ENVIRONMENT="${i#*=}"
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

echo "Setting AWS config from $AWS_SANDBOX_CSV..."
aws configure import --csv "file://$AWS_SANDBOX_CSV"

echo "Checking AWS configuration..."
aws configure list

echo "Copy build contents to S3"
if [ "$ENVIRONMENT" = "staging" ]; then
    aws s3 sync ./export/staging s3://$S3_BUCKET --profile $AWS_SANDBOX_PROFILE
elif [ "$ENVIRONMENT" = "production" ]; then
    aws s3 sync ./export/production s3://$S3_BUCKET --profile $AWS_SANDBOX_PROFILE
else
    echo "Wrong environment!"
fi;

echo "Add cloudfront invalidation"
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --profile $AWS_SANDBOX_PROFILE
