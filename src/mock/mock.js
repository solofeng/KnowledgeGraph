import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users } from './data/user';
import { Info } from './data/info';
let _Users = Users;
let _Info = Info;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //数据集上传更新
    mock.onGet('/info/upload').reply(config => {
      let { obj } = config.params;
      _Info = [];
      _Info = obj;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '上传成功'
          }]);
        }, 500);
      });
    });

    //获取国家杰出青年信息列表
    mock.onGet('/info/list').reply(config => {
      let {name} = config.params;
      let mockInfo = _Info.filter(info => {
        if (name && info.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            info: mockInfo
          }]);
        }, 1000);
      });
    });

    //获取国家杰出青年信息列表（分页）
    mock.onGet('/info/listpage').reply(config => {
      let {page, name, pageSize} = config.params;
      let mockInfo = _Info.filter(info => {
        if (name && info.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockInfo.length;
      mockInfo = mockInfo.filter((u, index) => index < pageSize * page && index >= pageSize * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            info: mockInfo
          }]);
        }, 1000);
      });
    });

    //获取人员年份分布数
    mock.onGet('/info/countYear').reply(config => {
      let year = ['2012','2013','2014','2015','2016','2017']
      let count = [];
      for (let i=0;;i++) {
        if(year[i]==null) {
          break;
        }
        let mockInfo = _Info.filter(info => {
          if (year[i] && info.yearOfAward==year[i]) return true;
          return false;
        });
        console.log(mockInfo);
        count[i] = mockInfo.length;
        console.log(mockInfo.length);
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            count: count
          }]);
        }, 1000);
      });
    });

    //获取人员性别情况
    mock.onGet('/info/countSex').reply(config => {
      let sex = ['男','女']
      let count = [];
      for (let i=0;;i++) {
        if(sex[i]==null) {
          break;
        }
        let mockInfo = _Info.filter(info => {
          if (sex[i] && info.sex==sex[i]) return true;
          return false;
        });
        console.log(mockInfo);
        let obj = {};
        obj.name = sex[i];
        obj.value = mockInfo.length;
        console.log(obj);
        count.push(obj);
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            count: count
          }]);
        }, 1000);
      });
    });

    //获取人员出生年份情况
    mock.onGet('/info/countBirth').reply(config => {
      let birth = ['1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978']
      let count = [];
      for (let i=0;;i++) {
        if(birth[i]==null) {
          break;
        }
        let mockInfo = _Info.filter(info => {
          if (birth[i] && birth[i]==info.yearOfBirth.toString().substring(0,4)) return true;
          return false;
        });
        console.log(mockInfo.length);
        count[i] = mockInfo.length;
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            count: count
          }]);
        }, 1000);
      });
    });

    //获取人员毕业年份情况
    mock.onGet('/info/countGraduate').reply(config => {
      let graduate = ['1995','1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004']
      let count = [];
      for (let i=0;;i++) {
        if(graduate[i]==null) {
          break;
        }
        let mockInfo = _Info.filter(info => {
          if (graduate[i] && info.yearOfGraduate==graduate[i]) return true;
          return false;
        });
        console.log(mockInfo.length);
        count[i] = mockInfo.length;
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            count: count
          }]);
        }, 1000);
      });
    });

    //获取人员地域情况
    mock.onGet('/info/countArea').reply(config => {
      let area = ['北京','天津','上海','重庆','河北','河南','云南','辽宁','黑龙江','湖南','安徽','山东','新疆','江苏','浙江','江西','湖北','广西','甘肃','山西','内蒙古','陕西','吉林','福建','贵州','广东','青海','西藏','四川','宁夏','海南','台湾','香港','澳门',]
      let count = [];
      for (let i=0;;i++) {
        if(area[i]==null) {
          break;
        }
        let mockInfo = _Info.filter(info => {
          if (area[i] && info.companyAddress.toString().indexOf(area[i]) == -1) return false;
          return true;
        });
        console.log(mockInfo);
        let obj = {};
        obj.name = area[i];
        obj.value = mockInfo.length;
        console.log(obj);
        count.push(obj);
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            count: count
          }]);
        }, 1000);
      });
    });

  }
};
