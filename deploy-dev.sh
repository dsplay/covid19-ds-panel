BUCKET_NAME=dsplay-covid19-panel-dev
CLOUDFRONT_DISTRIBUTION_ID=E1DL7C2F4O07P0

# build
npm run build

# update s3
aws s3 rm s3://$BUCKET_NAME --recursive
aws s3 cp build s3://$BUCKET_NAME --recursive
aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"