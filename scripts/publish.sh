while getopts d: flag
do
    case "${flag}" in
        d) directory=${OPTARG};;
    esac
done

cd ../mobile
expo export --experimental-bundle
cd ../sample-update-server
rm -rf updates/$directory/
cp -r ../mobile/dist/ updates/$directory

node ./scripts/exportClientExpoConfig.js > updates/$directory/expoConfig.json