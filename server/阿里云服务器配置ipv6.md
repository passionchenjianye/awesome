# 阿里云服务器配置ipv6

### 获取资源
* 首先用Hurricane Electric 提供的 IPv6 Tunnel Broker 来让 ECS 支持 IPv6
* [https://www.tunnelbroker.net/](https://www.tunnelbroker.net/)注册帐号，qq邮箱无效。上邮箱激活，然后登陆。
* 戳左边菜单`Create Regular Tunnel`
* 填写表单，`IPv4 Endpoint (Your side):`填写阿里云服务器ip，`Available Tunnel Servers:`选择`Hong Kong, HK`吧，如果香港不饶一圈美国，应该会快点。然后戳 `Create Tunnel` ，就完成了。

![](http://7xtuco.com1.z0.glb.clouddn.com/14937931147972.jpg)

* 所有信息在下图所示：

![](http://7xtuco.com1.z0.glb.clouddn.com/14937934192860.jpg)

* 切换到`Example Configurations`选项卡，,阿里云系统是centOS的话，下拉菜单选择Linux-route2，出现了设置的命令，待用：

![](http://7xtuco.com1.z0.glb.clouddn.com/14937938646697.jpg)

### 配置文件
* 修改`sysctl.conf`文件，修改如下3个选项为0

```sh
$ vi /etc/sysctl.conf
```

```
net.ipv6.conf.all.disable_ipv6 = 0
net.ipv6.conf.default.disable_ipv6 = 0
net.ipv6.conf.lo.disable_ipv6 = 0
```

* 编辑`/etc/network/interfaces`，如果没有`network`文件夹，则创建:

```sh
# 有则不用
$ cd /etc
$ mkdir network
```

* 把如下数据添加到`interfaces`文件中，<>都需更换具体数据，其中里面`<IPv6>` 需要你自己替换成你刚刚申请的 `Tunnel` 的 `Server IPv6 Address`，但不包括最后的::1/64。
* local 那里一定要填写内网ip，查看内网ip命令`ifconfig`

```sh
$ vi /etc/network/interfaces
```

```
auto he-ipv6
iface he-ipv6 inet6 v4tunnel
address <IPV6>::2
netmask 64
remote <Tunnel 的 Server IPv4 Address>
local <阿里云的内网 IPv4 地址>
endpoint any
ttl 255
gateway <IPv6>::1
up ip -6 route add 2000::/3 via ::<Tunnel 的 Server IPv4 Address> dev he-ipv6
up ip -6 addr add <IPv6>::1:1/128 dev he-ipv6
up ip -6 addr add <IPv6>::2:1/128 dev he-ipv6
down ip -6 route flush dev he-ipv6
```

* 修改`disable_ipv6.conf`，不同的系统命名会有些差别

```sh
$ vi /etc/modprobe.d/disable_ipv6.conf
```
```
修改前:
alias net-pf-10 off
alias ipv6 off
options ipv6 disable=1
修改后:
alias net-pf-10 off
options ipv6 disable=0
```

* 修改`/etc/sysconfig/network`,修改NETWORKING_IPV6为yes

```sh
$ vi /etc/sysconfig/network
```

```
修改前
NETWORKING=yes
HOSTNAME=coolnull
NETWORKING_IPV6=no
PEERNTP=no
GATEWAY=*.*.*.*

修改后
NETWORKING=yes
HOSTNAME=coolnull
NETWORKING_IPV6=yes
PEERNTP=no
GATEWAY=*.*.*.*
```
* 重启服务器

```sh
$ reboot
```

* 配置ipv6，把下图中的一条条命令输入`shell`

![](http://7xtuco.com1.z0.glb.clouddn.com/14937967956915.jpg)

* 最后成功图示：

![](http://7xtuco.com1.z0.glb.clouddn.com/14937968718591.jpg)


