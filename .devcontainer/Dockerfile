FROM mcr.microsoft.com/devcontainers/base:jammy

ARG BUILD_PASSPHRASE=""
ARG BUILD_REPO=""

RUN su vscode -c 'export DENO_INSTALL="${HOME}/.deno" && curl -fsSL https://deno.land/x/install/install.sh | sh'
RUN su vscode -c 'export CHEZMOI_INSTALL="${HOME}/.local/bin" && mkdir -p "${CHEZMOI_INSTALL}" && sh -c "$(curl -fsSL get.chezmoi.io)" -- -b "${CHEZMOI_INSTALL}"'
RUN su vscode -c 'sh -c "$(curl -fsSL https://starship.rs/install.sh)" -- --yes'
RUN su vscode -c 'curl -fsSL https://webi.sh/shfmt | sh'
RUN su vscode -c 'sudo bash -c "$(curl -fsSL https://deb.nodesource.com/setup_18.x)" && sudo apt install -y nodejs'

ENV EDITOR="code -w" VISUAL="code -w" PERSONAL_MACHINE=true DOTFILES_REPO=${BUILD_REPO} DOTFILES_PASSPHRASE=${BUILD_PASSPHRASE}
