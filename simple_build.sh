rm -rf ./public
mkdir ./public
mkdir ./public/css
echo "Made directories"
sass sass/index.scss:public/css/index.css
echo "Sassed it up"
cp -r bower_components public/bower_components
cp -r templates public/templates
cp -r js public/js
cp -r assets public/assets
cp index.html public/index.html
echo "Moved all that shit"
