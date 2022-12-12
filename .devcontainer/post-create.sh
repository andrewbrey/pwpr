#!/usr/bin/env bash

set -eo pipefail

if [ -n "${REMOTE_CONTAINERS}" ]; then

	if [ -n "${DOTFILES_REPO}" ]; then
		git clone "${DOTFILES_REPO}" "${HOME}/dotfiles"

		bootstrap_file="${HOME}/dotfiles/script/bootstrap"
		[[ -r "${bootstrap_file}" ]] && [[ -f "${bootstrap_file}" ]] && "${bootstrap_file}"

		unset bootstrap_file
	fi

fi
