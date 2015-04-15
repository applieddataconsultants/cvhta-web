.PHONY: deploy
project=cvhta
path=/var/www/html/sandbox3/${project}
instance=\033[36;01m${project}\033[m

deploy: server = sawyer@adc-staging-web1
deploy:
	@rsync -az --exclude=".git" . ${server}:${path}
	@printf " ${instance} | deployed to ${server}\n"