### 一、介绍

在服务架构中，业务服务会被拆分为一个个独立的服务，服务与服务之间的通讯基于http restful的。
Spring Cloud中服务的调用有两种：ribbon+restTemplate, feign。这一部分主要介绍ribbon+rest.

Ribbon是一个负载均衡客户端，可以很好的控制http和tcp的一些行为，Feign也用到ribbon，当你使用@ FeignClient，ribbon自动被应用。

### 二、创建服务消费这(smartsport-service-ribbon)

* 创建步骤:

  >右键父工程->New->Module->Spring Initializr->Cloud Routing->Ribbon

* Maven pom.xml文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>com.xunyijia.smartsport</groupId>
	<artifactId>smartsport-service-ribbon</artifactId>
	<version>1.0-SNAPSHOT</version>
	<packaging>jar</packaging>

	<name>smartsport-service-ribbon</name>
	<description>Spring Cloud Service Ribbon</description>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.3.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
		<spring-cloud.version>Dalston.RELEASE</spring-cloud.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-eureka</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-ribbon</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-web</artifactId>
			<version>4.3.8.RELEASE</version>
		</dependency>
	</dependencies>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>${spring-cloud.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
					<fork>true</fork>
				</configuration>
			</plugin>
		</plugins>
	</build>

</project>
```

* appication.yml配置文件

```yml
eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8081/eureka/
server:
  port: 8085
spring:
  application:
    name: service-ribbon
```

* 程序入口类

```java
package com.xunyijia.smartsport.service.ribbon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableDiscoveryClient
public class ServiceRibbonApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceRibbonApplication.class, args);
	}

	@Bean
	@LoadBalanced
	RestTemplate restTemplate() {
		return new RestTemplate();
	}
}
```

* Controller

```java
package com.xunyijia.smartsport.service.ribbon.controller;

import com.xunyijia.smartsport.service.ribbon.client.DiskClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName: DiskController.java
 * @Description:
 * @Author: Tony
 * @Date: 2017-05-22 13:12
 */
@RestController
public class DiskController {

    @Autowired
    private DiskClient diskClient;

    @GetMapping(value = "/profile")
    String readProfile() {
        return diskClient.getProfile();
    }

}
```

* Service

```java
package com.xunyijia.smartsport.service.ribbon.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * @ClassName: DiskClient.java
 * @Description:
 * @Author: Tony
 * @Date: 2017-05-22 13:09
 */
@Service
public class DiskClient {

    @Autowired
    RestTemplate restTemplate;

    public String getProfile() {
        return restTemplate.getForObject("http://base-disk-service/profile", String.class);
    }
}
```

* 访问service-ribbon服务

http://localhost:8085/profile

浏览器会交替出现

test-6.0from port: 8082
和
test-6.0from port: 8083
