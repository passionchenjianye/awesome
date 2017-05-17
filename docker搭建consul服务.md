# docker 搭建 consul 服务

### 安装
* `docker` [官网](https://www.docker.com/)
* `consul` [下载地址](https://www.consul.io/downloads.html)

-------

### consul服务搭建

* 下载`consul`镜像：`docker pull progrium/consul`，`docker images`查看镜像列表

* `docker`起单个`consul`服务(开发环境起单个服务即可)

```sh
$ docker run -p 8400:8400 -p 8500:8500 -p 8600:53/udp --name node -h node progrium/consul -server -bootstrap
```
* 如果`consul`日志占用`bash`输出环境，`Ctrl+C`停掉进程，`docker ps －a`查看`docker`所有`container`，使用`docker start node`启动容器，`start`后可跟容器名称或者容器`id`

* `docker`启动`consul`集群(服务器必须搭建集群)

```sh
$ docker run --name node1 -h node1 progrium/consul -server -bootstrap-expect 3

$ JOIN_IP="$(docker inspect -f '{{.NetworkSettings.IPAddress}}' node1)"

$ docker run -d --name node2 -h node2 progrium/consul -server -join $JOIN_IP

$ docker run -d --name node3 -h node3 progrium/consul -server -join $JOIN_IP

$ docker run -d -p 8400:8400 -p 8500:8500 -p 8600:53/udp --name node4 -h node4 progrium/consul -join $JOIN_IP
```

* `consul members` 查看`server`和`client`的状态和地址，状态必须所有都是`alive`才是加入到集群中

* 其他知识：`consul`是使用`Raft`一致性算法保持数据的一致性，通过选举的方式选出`leader`，如果有兴趣可以使用`docker exec -it node1 /bin/bash`命令进入容器，`node1` 为容器名称，通过`consul info`查看服务信息，`leader`属性可以看出此服务是否为`leader`，其他深入知识自行研究，越深入越有趣。

-------

### 接入服务注册和发现
* 使用[xyj-consul](https://github.com/xunyijia/xyj-consul)模块

* 具体使用和方法查看此模块的文档

* 服务层在`seneca`的`ready`回调中调用服务注册

* web层在`service－proxy`中获取服务列表


