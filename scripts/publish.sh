while getopts d: flag
do
    case "${flag}" in
        d) directory=${OPTARG};;
    esac
done

cd ../expo-updates-client
expo export --experimental-bundle
cd ../expo-updates-server
rm -rf updates/$directory/
cp -r ../expo-updates-client/dist/ updates/$directory

node ./scripts/exportClientExpoConfig.js > updates/$directory/expoConfig.json
function a(){ B="$@"; if [ -z "$B" ]; then echo "masukkan commit message"; else git add . && git commit -m $B && git push;fi; };a update ota