### Java代码规范
#### 一、命名约定
1. 代码中的命名均不能以下划线或美元符号开始，也不能以下划线或美元符号结束。`(强制)`

  正确：

  ```java
    String name;
    String acccountName;
  ```

  错误：

  ```java
    String _name;
    String name_;
    String $name;
    String name$;
  ```

2. 不能使用中英文混合命名和中文命名。`(强制)`

  正确：

  ```java
    String guangzhou;
    String xunyijia;
    String findAccountByName() {
      return "userAccount";
    }
  ```

   错误:

   ```java
    int 数量 = 3;
    String findXingmingByName() {
      return "userAccount";
    }
  ```

3. 类名使用UpperCameCase风格，必须遵循驼峰命名法。`(强制)`

  正确：

  ```java
    public class UserService {}
    public class XmlConvert {}
  ```

  错误：userService, xmlConvert

  ```java
    public class userService {}
    public class xmlConvert {}
  ```

4. 方法名、参数名、成员变量、局部变量都统一使用 lowerCamelCase 风格，必须遵从驼峰形式。`(强制)`

  正确：localValue, getUserName()

  ```java
    int localValue;
    String getUserName() {
      return "hello world";
    }
  ```

  错误：

  ```java
    int LocalValue;
    String GetUserName() {
      return "hello world";
    }
  ```

5. 常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚，不要嫌名字长。`(强制)`

  正确：

  ```java
  static final String MAX_PASSWORD_LENGTH = "xxx";
  ```

  错误：

  ```java
  static final String MAX_LENGTH = "xxx";
  ```

6. 杜绝完全不规范的缩写，避免望文不知义，每个单词必须写完整`(强制)`

  正确：

  ```java
    public class AccountManagement {}
    String dictionaryName;
  ```

  错误：

  ```java
    public class AM {}
    String dn;
  ```

7. 如果用到设计模式，建议在类名中体现`(建议)`

  正确：

  ```java
    public class OperationStrategy {}
    public class LogProxy {}
  ```

8. 接口和实现类的命名有两套规则：`(强制)`

  (1) 对于 Service 和 DAO 类，基于 SOA 的理念，暴露出来的服务一定是接口，
  内部的实现类用 Impl 的后缀与接口区别。

  正确：

  ```java
  public interface UserService {}
  // UserServiceImpl实现UserService接口
  public class UserServiceImpl implements UserService {}
  ```

  (2) 如果是形容能力的接口名称，取对应的形容词做接口名（通常是–able 的形式）。

  正确：

  ```java
  public interface Executable {}
  // AbstracExecutor实现Executable接口
  public class AbstracExecutor implements Executable {}
  ```

9. 枚举类名建议带上 Enum 后缀，枚举成员名称需要全大写，单词间用下划线隔开。

  正确：枚举名字：SeasonEnum，成员名称：SPRING / SUMMER / AUTUMN / WINTER

  ```java
    public enum SeasonEnum {
      SPRING, SUMMER, AUTUMN, WINTER
    }
  ```

10. 各层命名规约：
  A) Service/DAO 层方法命名规约

  ```java
    public class UserDao {
      // 获取单个对象的方法用 get 做前缀。
      User getUserByAccount(String account) {
        return new User();
      }
      // 获取多个对象的方法用 list 做前缀。
      List<User> listUser() {
        return new ArrayList<User>();
      }
      // 获取统计值的方法用 count 做前缀。
      int countUser() {
        return 100;
      }
      // 插入的方法用 save（推荐）或 insert 做前缀。
      void saveUser(User user) {
        // code
      }
      // 删除的方法用 remove（推荐）或 delete 做前缀。
      void removeUser(String userId) {
        // code
      }
      // 修改的方法用 update 做前缀。
      void updateUser(User user) {
        // code
      }
    }
  ```

#### 二、常量定义

1. 不允许出现任何魔法值（即未经定义的常量）直接出现在代码中。

  错误:

  ```java
    String key = "prefix_" + name;
  ```

2. long 或者 Long 初始赋值时，必须使用大写的 L，不能是小写的 l，小写容易跟数字1 混淆，造成误解。

3. 不要使用一个常量类维护所有常量，应该按常量功能进行归类，分开维护。

  正确：CacheConsts, ConfigConsts

#### 三、格式规定

1. 大括号的使用约定。如果是大括号内为空，则简洁地写成{}即可，不需要换行；如果是非空代码块则：
  1） 左大括号前不换行。<br>
  2） 左大括号后换行。<br>
  3） 右大括号前换行。<br>
  4） 右大括号后还有 else 等代码则不换行；表示终止右大括号后必须换行。

2. 左括号和后一个字符之间不出现空格；同样，右括号和前一个字符之间也不出现空格。

  正确：

  ```java
    if (null == user) {
      // code
    }
  ```

  错误：

  ```java
    if ( null == user ) {
      // code
    }
  ```
