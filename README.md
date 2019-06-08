# Screeps

## Setup

Run
```
mv sample.scconfig.json screeps_config.json
```
and fill out the config as required

Git commands

git add .
git commit -m "<message>"
git push

git checkout <branch_name>  # to move to a certain branch
git checkout -b <branch_name>  # when ur on develop, you might ... feature/harvest

# To merge
git checkout develop
git merge --no-ff --message "Merged <branch_name> to develop" <branch_name>


Credit to https://github.com/screepers/screeps-typescript-starter for the build pipeline.
