#### 1. Oracle 添加/查看表注释和字段注释

##### 1.1 Oracle添加表注释和字段注释

TODO

##### 1.2 Oracle查看全部表注释和字段注释

```sql
--获取表注释。获得 table_name,table_type,comments。
select * from user_tab_comments; 
--获取字段注释。获得 table_name,column_name,comments。
select * from user_col_comments; 
```

#### 2. Mysql 添加/查看表注释和字段注释

##### 2.1 Mysql添加表注释和字段注释

```sql
CREATE TABLE `t_cluster`(
    `id`             int(11)    NOT NULL COMMENT '样本的ID',
    `cluster_id`     int(11)    NOT NULL COMMENT '聚类的编号',
    PRIMARY KEY (`id`))
 ENGINE = InnoDB  DEFAULT CHARSET = utf8 COMMENT ='聚类结果表';
```

##### 2.2 Mysql 查看全部表注释和字段注释

```sql
-- 表注释
select * from information_schema.TABLES where TABLE_SCHEMA='数据库名' and TABLE_NAME='表名' 
-- 字段注释
show  full  columns  from  test1; 
--在元数据的表里面看 
select * from information_schema.COLUMNS where TABLE_SCHEMA='数据库名' and TABLE_NAME='表名' ;
```

##### 2.3  修改表的注释

```sql
alter table table_name comment '注释';
```

##### 2.4  修改字段的注释

```sql
alter table table_name modify column column_name int comment '注释'; 
```

#### 3. 分享一段由Oracle迁移到Mysql表注释和字段注释python代码

最后将更改表注释的语句批量执行。

```python
# -*- coding: utf-8 -*-
"""
Created on Wed Nov 25 09:02:55 2020

@author: lixin
"""

import mysql.connector as mysql
import pandas as pd
 
db = mysql.connect(
    host = "127.0.0.1",
    user = "root",
    passwd = "121457",
    database = "tpc2"
)

data = pd.read_sql("SELECT TABLE_NAME,TABLE_COMMENT FROM information_schema.TABLES",db)

# 从oracle下载来的表的注释，用于迁移到mysql
dict_comments_tab = pd.read_excel("comments/user_tab_comments.xlsx")

def prc(row, df):
    dff = df[(df['TABLE_NAME'] == row.upper())]
    res = [i for i in dff['COMMENTS']]
    return res[0] if len(res) > 0 else None


data['注释'] = data.apply(lambda x: prc(x['TABLE_NAME'],dictjj),axis = 1)
data = data[pd.notnull(data['注释'])]
data2 = data[data['TABLE_COMMENT'] == '']
data2.to_csv('tab_commentsII.csv',index=0)

cursor = db.cursor()
res = []
for index, row in data2.iterrows():
    val = row['注释']
    table = row['TABLE_NAME']
    sql = ''' alter table {} comment '{}';'''.format(table,val)
    res.append(sql)

file_name = 'write_tab_comment.txt'
with open(file_name,'w') as file_obj:
    for i in res:
        file_obj.write(i+'\n')
```



#### 参考：

1. https://www.cnblogs.com/chaos-li/p/11118696.html