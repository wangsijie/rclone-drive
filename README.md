# Rclone Drive

Under development

## Installation

```
npm i -g rclone-drive
```

## Configuration

```
Usage: rclone-drive [options]

Options:
  -V, --version                       output the version number
  -P, --port [port]                   Server port (default: "3000")
  -a, --address [address]             Server port (default: "localhost")
  -p, --password [password]           Password to login, default is random string
  -s, --secret [secret]               Session scret, default is random string
  -r, --rclone [rclone]               Rclone bin path, e.g "/usr/local/bin/rclone"
  -R, --rclone-config [rcloneConfig]  Rclone config file path, e.g "/Users/wangsijie/.config/rclone/rclone.conf"
  -d, --base-dir [baseDir]            Rclone base dir, e.g "s3:defaultbucket"
  -h, --help                          output usage information
```

## TODO

- [ ] Setup guide
- [ ] Docker support
- [ ] Error handler
- [ ] Upload progress
- [ ] Directory/File move