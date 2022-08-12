rmdir /s/q .\docs
mkdir .\docs\css\
copy .\docs-dev\*.png .\docs\
copy .\docs-dev\*.js .\docs\
copy .\docs-dev\manifest.json .\docs\
copy .\docs-dev\CNAME .\docs\
copy .\docs-dev\browserconfig.xml .\docs\
copy .\docs-dev\index.min.html .\docs\index.html
copy .\docs-dev\css\*.min.css .\docs\css\




git add .
git commit -am "Automatic push"
git push