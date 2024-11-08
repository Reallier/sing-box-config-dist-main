# singbox 配置分发

## 引导节点修改

- `bootstrap` 设定为 `direct` 的时候,将初始化出口设定为 `direct` 的节点

这是用来避免某些地区会切协议,导致无法下载资源等. 目前资源下载已经挂上 GitHub 镜像了.

## 直连 DNS 修改

- `self-dns` 设定为 `all` 的时候,将直连出口也设定为使用自建安全 DNS,而不是使用国内加密 DNS (阿里/腾讯)

如果希望测试 AdGuardHome 的抗压能力的话,可以打开这个.

## 老 Provider 兼容 (已下线)

- `fix-legacy-outbound-provider` 设定为 `true` 的时候,将修复旧版出口配置,兼容老的配置 (未来会移除)

如果你用的是 1.9.0 以前的版本就需要打开这个.这是因为在 1.9.0 某个版本后,SingboxP 同步上游变化,具体是

`type` 字段的值,从 `file` 和`http` 变为 `local` 和 `remote`

## Tailscale 支持

- `subnets` 用于指定哪些路由要送入 Tailscale,格式为逗号分割的 CIDR
- `ts-interface` 用于覆盖 Tailscale 的网络接口名称,默认为 `tailscale0`

这个配置最好搭配 Android 上的 Tailscale-Magisk 使用.

## DoH Profile 支持

- `doh-profile` 用于指定 DoH Profile 的名称,可以享受切换到带有特定配置的 DoH 服务器

目前由 AdGuard Home 提供这个功能
