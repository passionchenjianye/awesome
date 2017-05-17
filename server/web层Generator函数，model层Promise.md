#目录

> 一. 为什么web层使用generator函数，model层使用promise控制异步

> 二. 怎么才是generator函数，promise又是什么？

> 三. 如何使用generator函数在web层，promise在model层控制异步				



### 1.为什么web层使用generator函数，model层使用promise控制异步

- *`项目问题`*:
 -  由于项目web太多逻辑(其实调用服务最多),而且node是异步,那么需要异步处理方式。
 -  项目中把seneca再次封装，只暴露一个方法send(),同样是异步。
 -  那么问题就来了，如果使用promise，通过then函数获取结果，那么多个请求服务就形成以往的callback金字塔样子，这样写法的代码不好维护。
- *`解决方案`*:
 -  目前项目使用bluebird库和co库处理异步，bluebird应该是针对promise一种优雅处理方式，co应该是针对generator一种转变成promise处理方式。由于上面一些问题，应该怎么为什么web层用generator函数(co库处理generator), model层使用promise了吧。

 
------



### 2. 怎么才是generator函数，promise又是什么？

- *大概样子，具体这些还是靠自己去看,我说再多你没用过也没用的。*

> *`generator函数`:*
 
 	function * gen(){
	    var result = yield serviceProxy.send();  // yield后面就是promise或者thunk
		return result;
	} 
	
> *`promise函数`:*

	serviceProxy     <= 这个就是promise函数,只是seneca被再次封装,看成promise就可以了
		.send()
		.catch(next);


------



### 3. 如何使用generator函数在web层，promise在model层控制异步

> *提示：generator函数用[co](https://github.com/tj/co)库,promise函数用[bluebird](http://bluebirdjs.com/docs/api-reference.html)库*

> *使用co库处理的generator函数代码:*

```
	co(function * gen(){
	  let grade = yield serviceProxy   `// 这个请求查看年纪的服务请求`
          		 .send({ module: 'school-class', 
          		  	     cmd: 'grade_dict_read', 
          				 data: { filters: { name: d.grade } } });
      let sportCategoryList = yield serviceProxy  `// 这个请求是获取所有运动请求
        		 .send({ module: 'sport-category', 
        				 cmd: 'sport_category_find', 
        				 data: { filters: { } } });
	}).catch(next);
```	

> *使用bluebird库的Promise函数代码:*

	头部声明:  const Promise = require('bluebird');
	
	这只是类似model例子，因为mongoose调用方法本身是promise，介于需要扩展,
	所以model层需要Promise写法，它不涉及太多业务，是对数据库操作的异步封装
	
	`// 查找关联专家团队信息和角色信息`
	Promise.props({
      team: serviceProxy.send({  `// 这个请求专家团对的服务请求`
          module: 'expert-team',
          cmd: 'expertTeam_read',
          data: { filters: { _id: { $in: team } } },
      }),
      role: serviceProxy.send({  `// 这个请求专家角色的服务请求`
      		module: 'expert-user', 
      		cmd: 'role_read', 
      		data: { filters: { _id: { $in: role } } } }),
    }).then((r) => {
        if (!r.team.success || !r.role.success) {
          return res.error({ code: 29999, msg: !r.team.success ? r.team.msg : r.role.msg });
        }
        users.map((user, index) => {
          `// 重组信息,添加团队和角色详情`
          users[index].role = _.find(r.role.data, { _id: user.role });
          users[index].expertTeam = _.find(r.team.data, { _id: user.expertTeam });
          return null;
        });
        return res.api(users);
      });