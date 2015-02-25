#!/bin/sh

DIR="../gamma_build"
ZIP="../gamma_build.zip"

rm -rf $DIR
rm -f $ZIP
mkdir $DIR

cp -r audio $DIR/audio
cp -r css $DIR/css
cp -r fonts $DIR/fonts
cp -r images $DIR/images
cp -r physics $DIR/physics
cp scripts/index.build $DIR/index.html

sed -n '/<script type="text\/javascript"/s/.*<script type="text\/javascript"\s\+src="\([^"]\+\).*/\1/p' index.html > $DIR/jslist.txt
while read p; do
  cat $p >> $DIR/out.js
done < $DIR/jslist.txt
rm $DIR/jslist.txt

java -jar scripts/yuicompressor-2.4.8.jar $DIR/out.js -o $DIR/game.js
rm $DIR/out.js

cd $DIR
zip -r $ZIP *


